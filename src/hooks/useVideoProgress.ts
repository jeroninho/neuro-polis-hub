import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface VideoSession {
  id: string;
  user_id: string;
  video_id: string;
  session_start: string;
  session_end: string | null;
  watch_time_seconds: number;
  last_position_seconds: number;
  video_duration_seconds: number | null;
  completed: boolean;
  completion_percentage: number;
  created_at: string;
  updated_at: string;
}

export const useVideoProgress = (videoIds: string[]) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<VideoSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || videoIds.length === 0) {
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('video_sessions')
          .select('*')
          .eq('user_id', user.id)
          .in('video_id', videoIds)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        
        // Get the latest session for each video
        const latestSessions = videoIds.map(videoId => {
          const videoSessions = data?.filter(session => session.video_id === videoId) || [];
          return videoSessions[0] || null;
        }).filter(Boolean);

        setSessions(latestSessions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar progresso dos vídeos');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user, videoIds]);

  const getVideoProgress = (videoId: string) => {
    const session = sessions.find(s => s.video_id === videoId);
    return {
      completed: session?.completed || false,
      percentage: session?.completion_percentage || 0,
      watchTime: session?.watch_time_seconds || 0,
      lastPosition: session?.last_position_seconds || 0,
      duration: session?.video_duration_seconds || null
    };
  };

  const getTotalProgress = () => {
    const completedCount = sessions.filter(s => s.completed).length;
    const totalWatchTime = sessions.reduce((sum, s) => sum + (s.watch_time_seconds || 0), 0);
    
    return {
      completedVideos: completedCount,
      totalVideos: videoIds.length,
      completionPercentage: videoIds.length > 0 ? Math.round((completedCount / videoIds.length) * 100) : 0,
      totalWatchTime: Math.round(totalWatchTime / 60) // in minutes
    };
  };

  return {
    sessions,
    loading,
    error,
    getVideoProgress,
    getTotalProgress
  };
};