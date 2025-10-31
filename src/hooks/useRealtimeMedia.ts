import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Media {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  category?: string;
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
}

export const useRealtimeMedia = () => {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMedia = async () => {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setMedia(data as Media[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMedia();

    const channel = supabase
      .channel('media-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'media'
        },
        (payload) => {
          console.log('Media change detected:', payload);
          
          if (payload.eventType === 'INSERT') {
            setMedia(prev => [payload.new as Media, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setMedia(prev => prev.map(m => 
              m.id === payload.new.id ? payload.new as Media : m
            ));
          } else if (payload.eventType === 'DELETE') {
            setMedia(prev => prev.filter(m => m.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { media, loading, refreshMedia: fetchMedia };
};
