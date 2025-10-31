import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Page {
  id: string;
  slug: string;
  title: string;
  content_blocks: any;
  status?: string;
  created_at: string;
  updated_at: string;
}

export const useRealtimePages = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPages = async () => {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setPages(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPages();

    const channel = supabase
      .channel('pages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pages'
        },
        (payload) => {
          console.log('Page change detected:', payload);
          
          if (payload.eventType === 'INSERT') {
            setPages(prev => [payload.new as Page, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setPages(prev => prev.map(p => 
              p.id === payload.new.id ? payload.new as Page : p
            ));
          } else if (payload.eventType === 'DELETE') {
            setPages(prev => prev.filter(p => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { pages, loading, refreshPages: fetchPages };
};
