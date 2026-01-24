-- Create party packages table
CREATE TABLE IF NOT EXISTS party_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  duration_hours INTEGER, -- Changed from duration_days to duration_hours for party events
  max_capacity INTEGER,
  available_spots INTEGER,
  category TEXT, -- Party type: Birthday, Wedding, Corporate, etc.
  location TEXT, -- Changed from destination to location (venue address)
  event_date DATE, -- Changed from departure_date to event_date
  image_url TEXT,
  gallery_urls TEXT[], -- Array of image URLs
  inclusions TEXT[],   -- What's included in the package
  exclusions TEXT[],   -- What's not included
  itinerary JSONB,     -- Event timeline/schedule
  is_trending BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE party_packages ENABLE ROW LEVEL SECURITY;

-- Policies for party packages
-- Anyone can view available packages
CREATE POLICY "Anyone can view available party packages" 
ON party_packages FOR SELECT 
USING (is_available = true);

-- Only authenticated users (admins) can insert packages
CREATE POLICY "Authenticated users can insert party packages" 
ON party_packages FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Only the creator can update their packages
CREATE POLICY "Users can update their own party packages" 
ON party_packages FOR UPDATE 
USING (auth.uid() = created_by);

-- Only the creator can delete their packages
CREATE POLICY "Users can delete their own party packages" 
ON party_packages FOR DELETE 
USING (auth.uid() = created_by);

-- Create index for better search performance
CREATE INDEX IF NOT EXISTS idx_party_packages_category ON party_packages(category);
CREATE INDEX IF NOT EXISTS idx_party_packages_location ON party_packages(location);
CREATE INDEX IF NOT EXISTS idx_party_packages_price ON party_packages(price);
CREATE INDEX IF NOT EXISTS idx_party_packages_trending ON party_packages(is_trending);
CREATE INDEX IF NOT EXISTS idx_party_packages_available ON party_packages(is_available);
CREATE INDEX IF NOT EXISTS idx_party_packages_event_date ON party_packages(event_date);
