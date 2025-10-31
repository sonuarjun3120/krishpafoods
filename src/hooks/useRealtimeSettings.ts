import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  created_at: string;
  updated_at: string;
}

export const useRealtimeSettings = () => {
  const [settings, setSettings] = useState<AdminSetting[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('*');
    
    if (!error && data) {
      setSettings(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();

    const channel = supabase
      .channel('settings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'admin_settings'
        },
        (payload) => {
          console.log('Setting change detected:', payload);
          
          if (payload.eventType === 'INSERT') {
            setSettings(prev => [payload.new as AdminSetting, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setSettings(prev => prev.map(s => 
              s.id === payload.new.id ? payload.new as AdminSetting : s
            ));
          } else if (payload.eventType === 'DELETE') {
            setSettings(prev => prev.filter(s => s.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { settings, loading, refreshSettings: fetchSettings };
};
