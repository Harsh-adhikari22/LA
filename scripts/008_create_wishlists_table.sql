-- Ensure events table has service_role access for foreign key checks
DROP POLICY IF EXISTS "Service role can access all events" ON events;
CREATE POLICY "Service role can access all events"
ON events FOR SELECT
TO service_role
USING (true);

-- Create wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- Enable RLS
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own wishlist" ON wishlists;
DROP POLICY IF EXISTS "Users can add to their own wishlist" ON wishlists;
DROP POLICY IF EXISTS "Users can remove from their own wishlist" ON wishlists;
DROP POLICY IF EXISTS "Service role can manage wishlists" ON wishlists;

-- Policy: Service role can manage wishlists
CREATE POLICY "Service role can manage wishlists"
ON wishlists FOR ALL
TO service_role
WITH CHECK (true);

-- Policy: Users can view their own wishlist
CREATE POLICY "Users can view their own wishlist"
ON wishlists FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Users can add to their own wishlist
CREATE POLICY "Users can add to their own wishlist"
ON wishlists FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can remove from their own wishlist
CREATE POLICY "Users can remove from their own wishlist"
ON wishlists FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_event_id ON wishlists(event_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_created_at ON wishlists(created_at DESC);
