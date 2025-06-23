
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for better data integrity
CREATE TYPE ride_status AS ENUM ('requested', 'accepted', 'driver_assigned', 'picked_up', 'in_progress', 'completed', 'cancelled');
CREATE TYPE vehicle_type AS ENUM ('bike', 'auto', 'taxi', 'premium', 'suv', 'rental');
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'upi', 'wallet');
CREATE TYPE user_role AS ENUM ('rider', 'driver', 'admin');
CREATE TYPE driver_status AS ENUM ('offline', 'available', 'busy', 'inactive');

-- User profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role user_role DEFAULT 'rider',
  profile_image TEXT,
  emergency_contact TEXT,
  home_address TEXT,
  rating DECIMAL(2,1) DEFAULT 0.0,
  total_rides INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Driver specific information
CREATE TABLE public.drivers (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  license_number TEXT UNIQUE NOT NULL,
  vehicle_type vehicle_type NOT NULL,
  vehicle_number TEXT UNIQUE NOT NULL,
  vehicle_model TEXT,
  vehicle_color TEXT,
  city TEXT NOT NULL,
  status driver_status DEFAULT 'offline',
  is_verified BOOLEAN DEFAULT FALSE,
  current_location POINT,
  earnings_today DECIMAL(10,2) DEFAULT 0.00,
  earnings_total DECIMAL(10,2) DEFAULT 0.00,
  rides_completed INTEGER DEFAULT 0,
  documents JSONB, -- Store KYC documents info
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rides table
CREATE TABLE public.rides (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  rider_id UUID REFERENCES public.profiles(id) NOT NULL,
  driver_id UUID REFERENCES public.drivers(id),
  pickup_location TEXT NOT NULL,
  pickup_coordinates POINT NOT NULL,
  destination_location TEXT NOT NULL,
  destination_coordinates POINT NOT NULL,
  vehicle_type vehicle_type NOT NULL,
  status ride_status DEFAULT 'requested',
  fare_estimate DECIMAL(10,2),
  final_fare DECIMAL(10,2),
  distance_km DECIMAL(8,2),
  duration_minutes INTEGER,
  payment_method payment_method,
  female_driver_preference BOOLEAN DEFAULT FALSE,
  special_instructions TEXT,
  otp TEXT,
  rider_rating INTEGER CHECK (rider_rating >= 1 AND rider_rating <= 5),
  driver_rating INTEGER CHECK (driver_rating >= 1 AND driver_rating <= 5),
  rider_feedback TEXT,
  driver_feedback TEXT,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  picked_up_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT
);

-- Payments table
CREATE TABLE public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ride_id UUID REFERENCES public.rides(id) NOT NULL,
  rider_id UUID REFERENCES public.profiles(id) NOT NULL,
  driver_id UUID REFERENCES public.drivers(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_method payment_method NOT NULL,
  transaction_id TEXT,
  status TEXT DEFAULT 'pending',
  gateway_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription plans
CREATE TABLE public.subscription_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  duration_days INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  free_rides INTEGER DEFAULT 0,
  discount_percentage INTEGER DEFAULT 0,
  features JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User subscriptions
CREATE TABLE public.user_subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  plan_id UUID REFERENCES public.subscription_plans(id) NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  auto_renewal BOOLEAN DEFAULT FALSE,
  rides_used INTEGER DEFAULT 0
);

-- Promo codes
CREATE TABLE public.promo_codes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  max_discount DECIMAL(10,2),
  min_ride_amount DECIMAL(10,2) DEFAULT 0,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User promo usage
CREATE TABLE public.user_promo_usage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  promo_id UUID REFERENCES public.promo_codes(id) NOT NULL,
  ride_id UUID REFERENCES public.rides(id),
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, promo_id)
);

-- Support tickets
CREATE TABLE public.support_tickets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  ride_id UUID REFERENCES public.rides(id),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Notifications
CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Driver earnings
CREATE TABLE public.driver_earnings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  driver_id UUID REFERENCES public.drivers(id) NOT NULL,
  ride_id UUID REFERENCES public.rides(id) NOT NULL,
  base_fare DECIMAL(10,2) NOT NULL,
  commission DECIMAL(10,2) NOT NULL,
  net_earning DECIMAL(10,2) NOT NULL,
  bonus DECIMAL(10,2) DEFAULT 0.00,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_promo_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_earnings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for drivers
CREATE POLICY "Drivers can view their own data" ON public.drivers
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Drivers can update their own data" ON public.drivers
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public can view active drivers for matching" ON public.drivers
  FOR SELECT USING (status = 'available' AND is_verified = TRUE);

-- Create RLS policies for rides
CREATE POLICY "Users can view their own rides" ON public.rides
  FOR SELECT USING (auth.uid() = rider_id OR auth.uid() = driver_id);

CREATE POLICY "Riders can create rides" ON public.rides
  FOR INSERT WITH CHECK (auth.uid() = rider_id);

CREATE POLICY "Drivers can update assigned rides" ON public.rides
  FOR UPDATE USING (auth.uid() = driver_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_drivers_location ON public.drivers USING GIST(current_location);
CREATE INDEX idx_drivers_status ON public.drivers(status);
CREATE INDEX idx_rides_status ON public.rides(status);
CREATE INDEX idx_rides_rider ON public.rides(rider_id);
CREATE INDEX idx_rides_driver ON public.rides(driver_id);
CREATE INDEX idx_rides_created ON public.rides(requested_at);
