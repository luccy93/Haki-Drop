CREATE TABLE IF NOT EXISTS cart_items (
  id              TEXT PRIMARY KEY,
  session_id      TEXT NOT NULL,
  user_id         TEXT REFERENCES users(id) ON DELETE CASCADE,
  product_id      TEXT NOT NULL,
  variant_id      TEXT NOT NULL DEFAULT '',
  quantity        INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  product_name    TEXT NOT NULL,
  product_price   DOUBLE PRECISION NOT NULL,
  product_images  JSONB DEFAULT '[]',
  product_handle  TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cart_items_session ON cart_items (session_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items (user_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_cart_items_unique ON cart_items (COALESCE(user_id, session_id), product_id, variant_id);
