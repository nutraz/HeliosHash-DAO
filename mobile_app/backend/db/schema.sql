CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    aadhaar_hash TEXT,
    pan_hash TEXT,
    retina_scan_hash TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE wallets (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    blockchain TEXT NOT NULL,
    address TEXT NOT NULL,
    nft_id TEXT,
    verification_hash TEXT,
    UNIQUE (blockchain, address)
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL, -- e.g., "Engineer", "Contractor", "DAO Member"
    description TEXT
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    dao_funded BOOLEAN DEFAULT FALSE,
    created_by INT REFERENCES users(id) ON DELETE SET NULL,
    status TEXT CHECK (status IN ('proposed','approved','in_progress','completed','archived')),
    start_date DATE,
    end_date DATE
);

CREATE TABLE project_stages (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    stage_name TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    progress_percent INT CHECK (progress_percent BETWEEN 0 AND 100)
);

CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    role_id INT REFERENCES roles(id),
    status TEXT CHECK (status IN ('pending','accepted','rejected')) DEFAULT 'pending',
    application_date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE energy_stats (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    timestamp TIMESTAMP DEFAULT NOW(),
    energy_generated_kwh NUMERIC(12,3),
    energy_consumed_kwh NUMERIC(12,3)
);

CREATE TABLE revenue_stats (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    timestamp TIMESTAMP DEFAULT NOW(),
    revenue_inr NUMERIC(14,2),
    token_value NUMERIC(14,6) -- OWP token price
);

CREATE TABLE proposals (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    created_by INT REFERENCES users(id) ON DELETE SET NULL,
    status TEXT CHECK (status IN ('open','closed','executed')) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    proposal_id INT REFERENCES proposals(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    vote_choice TEXT CHECK (vote_choice IN ('yes','no','abstain')),
    timestamp TIMESTAMP DEFAULT NOW(),
    UNIQUE (proposal_id, user_id)
);

CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    uploaded_by INT REFERENCES users(id) ON DELETE SET NULL,
    doc_type TEXT,
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT NOW()
);
