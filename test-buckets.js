// test-buckets.js
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  "https://jlvrbkracqwczuzbzrdb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsdnJia3JhY3F3Y3p1emJ6cmRiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjA0OTMzMCwiZXhwIjoyMDcxNjI1MzMwfQ.iQ08ardUoA6e-maO-l_jnsLCahao1SUSI4NPLyzQmcc"
)

const { data, error } = await supabase.storage.listBuckets()
console.log({ data, error })
