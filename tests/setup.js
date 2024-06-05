// test/setup.js
// Setup Vitest to use mocks for external modules
import { vi } from 'vitest';

// Mocking supabase client and mailchimp functions
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    match: vi.fn().mockResolvedValue({ data: [{}], error: null }),
  },
}));

vi.mock('./mailchimp/mcfunctions', () => ({
  search: vi.fn(),
  subscribe: vi.fn(),
  addmember: vi.fn(),
}));
