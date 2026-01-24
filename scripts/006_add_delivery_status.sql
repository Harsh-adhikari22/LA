-- Add delivery_status column to orders table
ALTER TABLE public.orders
ADD COLUMN delivery_status text DEFAULT 'order_received';

-- Add comment to explain the possible values
COMMENT ON COLUMN public.orders.delivery_status IS 'Status of order delivery: order_received, processing, shipped, in_transit, delivered, order_failed, cancelled';

-- Create index for faster lookups
CREATE INDEX orders_delivery_status_idx ON public.orders(delivery_status);
