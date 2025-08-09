-- Add recipient column to notifications table
ALTER TABLE public.notifications ADD COLUMN recipient TEXT;