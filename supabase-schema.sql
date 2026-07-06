CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'customer',
  avatar TEXT,
  email_verified BOOLEAN DEFAULT false,
  provider TEXT DEFAULT 'email',
  provider_id TEXT,
  profile_image TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token TEXT UNIQUE NOT NULL,
  user_agent TEXT,
  device TEXT,
  browser TEXT,
  ip TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  login_time TIMESTAMPTZ DEFAULT now(),
  last_seen TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS otps (
  email TEXT PRIMARY KEY,
  otp TEXT NOT NULL,
  expires_at BIGINT NOT NULL,
  attempts INT DEFAULT 0,
  resend_attempts INT DEFAULT 0,
  verified BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  customer TEXT,
  user_info JSONB DEFAULT '{}',
  shipping_address JSONB DEFAULT '{}',
  status TEXT DEFAULT 'Pending',
  total_amount DOUBLE PRECISION DEFAULT 0,
  amount TEXT,
  items JSONB DEFAULT '[]',
  payment_method TEXT,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  cancelled_at TIMESTAMPTZ,
  date TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  handle TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DOUBLE PRECISION NOT NULL,
  compare_at_price DOUBLE PRECISION,
  images JSONB DEFAULT '[]',
  category TEXT,
  tags JSONB DEFAULT '[]',
  variants JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
