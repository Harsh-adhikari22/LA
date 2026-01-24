-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id UUID REFERENCES travel_packages(id) ON DELETE CASCADE,
  number_of_travelers INTEGER NOT NULL DEFAULT 1,
  total_amount DECIMAL(10,2) NOT NULL,
  booking_status TEXT DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled')),
  special_requests TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies for bookings
CREATE POLICY "Users can view their own bookings" 
ON bookings FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings" 
ON bookings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" 
ON bookings FOR UPDATE 
USING (auth.uid() = user_id);

-- Admins can view all bookings (for admin dashboard)
CREATE POLICY "Admins can view all bookings" 
ON bookings FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  )
);
