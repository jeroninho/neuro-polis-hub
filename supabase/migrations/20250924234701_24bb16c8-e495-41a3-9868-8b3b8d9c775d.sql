-- Create video_sessions table for detailed tracking
CREATE TABLE public.video_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  video_id TEXT NOT NULL, -- YouTube video ID
  session_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_end TIMESTAMP WITH TIME ZONE,
  watch_time_seconds INTEGER NOT NULL DEFAULT 0,
  last_position_seconds INTEGER NOT NULL DEFAULT 0,
  video_duration_seconds INTEGER,
  completed BOOLEAN NOT NULL DEFAULT false,
  completion_percentage INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.video_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for video_sessions
CREATE POLICY "Users can view their own video sessions" 
ON public.video_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own video sessions" 
ON public.video_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own video sessions" 
ON public.video_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add additional fields to user_progress table
ALTER TABLE public.user_progress 
ADD COLUMN IF NOT EXISTS watch_time_seconds INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_position_seconds INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_video_id TEXT;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_video_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_video_sessions_updated_at
BEFORE UPDATE ON public.video_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_video_sessions_updated_at();