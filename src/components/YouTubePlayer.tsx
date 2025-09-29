import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: {
      Player: new (
        elementId: string,
        config: {
          height: string;
          width: string;
          videoId: string;
          events: {
            onReady: (event: any) => void;
            onStateChange: (event: any) => void;
          };
        }
      ) => any;
      PlayerState: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
  }
}

interface YouTubePlayerProps {
  videoId: string;
  onProgress?: (percentage: number, watchTime: number, currentTime: number) => void;
  onComplete?: () => void;
  autoResume?: boolean;
  className?: string;
}

export const YouTubePlayer = ({ 
  videoId, 
  onProgress, 
  onComplete, 
  autoResume = true,
  className = "w-full h-full"
}: YouTubePlayerProps) => {
  const { user } = useAuth();
  const playerRef = useRef<any>(null);
  const [isAPIReady, setIsAPIReady] = useState(false);
  const [watchTime, setWatchTime] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastProgressUpdate = useRef(0);

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT) {
      setIsAPIReady(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(script);

    window.onYouTubeIframeAPIReady = () => {
      setIsAPIReady(true);
    };

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Save progress to database
  const saveProgress = useCallback(async (currentTime: number, duration: number, completed = false) => {
    if (!user || !sessionId) return;

    const completionPercentage = duration > 0 ? Math.round((currentTime / duration) * 100) : 0;
    
    try {
      await supabase
        .from('video_sessions')
        .update({
          last_position_seconds: Math.round(currentTime),
          watch_time_seconds: watchTime,
          completion_percentage: completionPercentage,
          completed,
          session_end: completed ? new Date().toISOString() : null,
          video_duration_seconds: Math.round(duration)
        })
        .eq('id', sessionId);

      onProgress?.(completionPercentage, watchTime, currentTime);
    } catch (error) {
      console.error('Error saving video progress:', error);
    }
  }, [user, sessionId, watchTime, onProgress]);

  // Create or resume video session
  const initializeSession = useCallback(async () => {
    if (!user) return;

    try {
      // Check for existing session
      const { data: existingSession } = await supabase
        .from('video_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('video_id', videoId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingSession && !existingSession.completed) {
        setSessionId(existingSession.id);
        setWatchTime(existingSession.watch_time_seconds || 0);
        
        // Auto-resume if enabled and there's saved progress
        if (autoResume && existingSession.last_position_seconds > 10) {
          setTimeout(() => {
            if (playerRef.current) {
              playerRef.current.seekTo(existingSession.last_position_seconds);
            }
          }, 1000);
        }
      } else {
        // Create new session
        const { data: newSession, error } = await supabase
          .from('video_sessions')
          .insert({
            user_id: user.id,
            video_id: videoId,
            watch_time_seconds: 0,
            last_position_seconds: 0
          })
          .select()
          .single();

        if (error) throw error;
        setSessionId(newSession.id);
        setWatchTime(0);
      }
    } catch (error) {
      console.error('Error initializing video session:', error);
    }
  }, [user, videoId, autoResume]);

  // Initialize YouTube player
  useEffect(() => {
    if (!isAPIReady || !window.YT) return;

    const initPlayer = () => {
      playerRef.current = new window.YT.Player(`youtube-player-${videoId}`, {
        height: '100%',
        width: '100%',
        videoId,
        events: {
          onReady: (event: any) => {
            initializeSession();
          },
          onStateChange: (event: any) => {
            const player = event.target;
            const state = event.data;
            
            if (state === window.YT?.PlayerState.PLAYING) {
              // Start tracking watch time
              intervalRef.current = setInterval(() => {
                const currentTime = player.getCurrentTime();
                const duration = player.getDuration();
                
                setWatchTime(prev => prev + 1);
                
                // Save progress every 10 seconds
                if (currentTime - lastProgressUpdate.current >= 10) {
                  saveProgress(currentTime, duration);
                  lastProgressUpdate.current = currentTime;
                }
                
                // Check for completion (80% watched)
                const completionPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
                if (completionPercentage >= 80) {
                  saveProgress(currentTime, duration, true);
                  onComplete?.();
                  if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                  }
                }
              }, 1000);
            } else {
              // Pause/stop tracking
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
              }
              
              // Save current progress
              if (state === window.YT?.PlayerState.PAUSED || state === window.YT?.PlayerState.ENDED) {
                const currentTime = player.getCurrentTime();
                const duration = player.getDuration();
                const isComplete = state === window.YT?.PlayerState.ENDED;
                saveProgress(currentTime, duration, isComplete);
                
                if (isComplete) {
                  onComplete?.();
                }
              }
            }
          }
        }
      });
    };

    // Small delay to ensure DOM element exists
    setTimeout(initPlayer, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [isAPIReady, videoId, initializeSession, saveProgress, onComplete]);

  return (
    <div className={className}>
      <div 
        id={`youtube-player-${videoId}`}
        className="w-full h-full bg-black rounded-lg"
      />
    </div>
  );
};