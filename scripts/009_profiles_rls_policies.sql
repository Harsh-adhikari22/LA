-- Ensure profiles table has service_role access
DROP POLICY IF EXISTS "Service role can access all profiles" ON profiles;
CREATE POLICY "Service role can access all profiles"
ON profiles FOR SELECT
TO service_role
USING (true);

-- Alternative: Allow public to view profiles
DROP POLICY IF EXISTS "Public can view profiles" ON profiles;
CREATE POLICY "Public can view profiles"
ON profiles FOR SELECT
TO public
USING (true);
