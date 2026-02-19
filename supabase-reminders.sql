-- SQL Script for Daily Reminder Cron Job and Notification System

-- 1. Create a table for notifications if it doesn't exist
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'reminder',
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Function to check for upcoming reminders and create notifications/send emails
-- This should be called by a Supabase Edge Function or Cron Job
CREATE OR REPLACE FUNCTION public.check_upcoming_reminders()
RETURNS void AS $$
DECLARE
    rem RECORD;
    user_tz TEXT;
BEGIN
    FOR rem IN 
        SELECT r.*, p.name as pet_name, pr.timezone
        FROM public.reminders r
        JOIN public.pets p ON r.pet_id = p.id
        JOIN public.profiles pr ON r.user_id = pr.id
        WHERE r.status = 'pending'
          AND r.date::DATE = (now() AT TIME ZONE COALESCE(pr.timezone, 'UTC') + INTERVAL '1 day')::DATE
          AND (r.last_notified_at IS NULL OR r.last_notified_at < now() - INTERVAL '1 day')
    LOOP
        -- Insert in-app notification
        INSERT INTO public.notifications (user_id, title, message, type)
        VALUES (
            rem.user_id,
            'Reminder: ' || rem.title,
            'Your reminder for ' || rem.pet_name || ' is scheduled for tomorrow.',
            'reminder'
        );

        -- Update last notified timestamp
        UPDATE public.reminders 
        SET last_notified_at = now() 
        WHERE id = rem.id;

        -- Note: Actual email sending would happen via a Supabase Edge Function 
        -- that listens to this or is triggered alongside this.
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Enable daily cron (Requires pg_cron extension, usually available on Supabase)
-- SELECT cron.schedule('0 8 * * *', 'SELECT check_upcoming_reminders()');
