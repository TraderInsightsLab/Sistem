-- TraderInsightsLab Database Schema for Supabase
-- Migration from Firebase Firestore to PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (optional - for future auth integration)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test Sessions table
CREATE TABLE IF NOT EXISTS test_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email VARCHAR(255) NOT NULL,
  user_context JSONB NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  current_section VARCHAR(50) DEFAULT 'autoportret',
  current_question_index INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'in-progress',
  payment_status VARCHAR(50) DEFAULT 'pending',
  report_status VARCHAR(50) DEFAULT 'pending',
  teaser_data JSONB,
  full_report_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test Answers table
CREATE TABLE IF NOT EXISTS test_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES test_sessions(id) ON DELETE CASCADE,
  question_id VARCHAR(50) NOT NULL,
  answer JSONB NOT NULL,
  timestamp BIGINT NOT NULL,
  response_time INTEGER,
  game_results JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment Sessions table
CREATE TABLE IF NOT EXISTS payment_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_session_id UUID REFERENCES test_sessions(id) ON DELETE CASCADE,
  stripe_session_id VARCHAR(255) UNIQUE NOT NULL,
  amount INTEGER NOT NULL,
  currency VARCHAR(10) DEFAULT 'RON',
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_test_sessions_email ON test_sessions(user_email);
CREATE INDEX IF NOT EXISTS idx_test_sessions_status ON test_sessions(status);
CREATE INDEX IF NOT EXISTS idx_test_sessions_payment_status ON test_sessions(payment_status);
CREATE INDEX IF NOT EXISTS idx_test_answers_session_id ON test_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_test_answers_question_id ON test_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_payment_sessions_stripe_id ON payment_sessions(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_payment_sessions_test_session ON payment_sessions(test_session_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_test_sessions_updated_at
  BEFORE UPDATE ON test_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_sessions_updated_at
  BEFORE UPDATE ON payment_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) - disable for now, enable when adding auth
ALTER TABLE test_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_sessions ENABLE ROW LEVEL SECURITY;

-- Policies (allow all for service_role, restrict for anon)
CREATE POLICY "Allow service_role all access on test_sessions"
  ON test_sessions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow service_role all access on test_answers"
  ON test_answers FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow service_role all access on payment_sessions"
  ON payment_sessions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Grant permissions
GRANT ALL ON test_sessions TO service_role;
GRANT ALL ON test_answers TO service_role;
GRANT ALL ON payment_sessions TO service_role;
GRANT ALL ON users TO service_role;
