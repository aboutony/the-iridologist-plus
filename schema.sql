-- The Iridologist Platform Database Schema Initialization
-- Engine: PostgreSQL (Assume compatible RDBMS)

CREATE TYPE lang_enum AS ENUM ('en', 'fr', 'ar');
CREATE TYPE subscription_tier_enum AS ENUM ('Bronze', 'Silver', 'Gold', 'None');
CREATE TYPE payment_method_enum AS ENUM ('Whish', 'OMT', 'WesternUnion', 'CreditCard');
CREATE TYPE item_type_enum AS ENUM ('Pill', 'Liquid', 'Powder');
CREATE TYPE media_type_enum AS ENUM ('Blog', 'Video', 'Audio', 'Interview');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) UNIQUE NOT NULL,
    country VARCHAR(100) NOT NULL,
    country_code VARCHAR(10) NOT NULL,
    otp_verified BOOLEAN DEFAULT FALSE,
    language lang_enum DEFAULT 'en',
    subscription_tier subscription_tier_enum DEFAULT 'None',
    has_iris_test_access BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE supplements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    item_type item_type_enum NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    weight_grams INTEGER NOT NULL,
    stock INTEGER DEFAULT 0
);

CREATE TABLE treatment_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    item_id UUID REFERENCES supplements(id) ON DELETE SET NULL, -- Null if Nutritional Meal
    title VARCHAR(255) NOT NULL,
    time_scheduled TIME NOT NULL,
    date_scheduled DATE NOT NULL,
    dosage VARCHAR(100),
    instructions TEXT,
    completed BOOLEAN DEFAULT FALSE,
    notes_en TEXT,
    notes_fr TEXT,
    notes_ar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping_fee DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PendingPayment',
    payment_method payment_method_enum NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE media_vault (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en VARCHAR(255) NOT NULL,
    title_fr VARCHAR(255) NOT NULL,
    title_ar VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_fr TEXT,
    description_ar TEXT,
    media_type media_type_enum NOT NULL,
    thumbnail_url VARCHAR(500),
    media_url VARCHAR(500),
    required_tier subscription_tier_enum DEFAULT 'Bronze',
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CSV Bulk Upload Schema (Supplement Inventory Seed)
-- The structure corresponds to the columns imported from the CSV tool in DoctorsPortal.tsx
/*
COPY supplements (name, description, item_type, price, weight_grams, stock)
FROM '/path/to/inventory.csv'
DELIMITER ','
CSV HEADER;
*/

-- Example Seed Data
INSERT INTO supplements (name, description, item_type, price, weight_grams, stock) VALUES
('Vitamin D3 & K2', 'Immune support', 'Liquid', 45.00, 100, 500),
('Omega 3 Fish Oil', 'Heart & Brain Health', 'Pill', 30.00, 200, 1000);
