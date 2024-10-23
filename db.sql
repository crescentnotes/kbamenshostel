CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_mob_num VARCHAR(15) NOT NULL,  -- Adjust the length if necessary for the parent's mobile number
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE gatepasses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    rrn VARCHAR(50),
    degree VARCHAR(100),
    block_room VARCHAR(50),
    time_out TIMESTAMPTZ,
    time_in TIMESTAMPTZ,
    reason TEXT,
    student_contact VARCHAR(15),
    parent_contact VARCHAR(15),
    rt_name VARCHAR(10),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);



CREATE TABLE logins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),         -- This column should exist for email
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50)
);

CREATE TABLE housekeeping_requests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    rrn VARCHAR(50),
    block VARCHAR(50),
    room_number VARCHAR(50),
    maintenance_done BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'pending'
);
