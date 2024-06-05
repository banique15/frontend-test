import { describe, it, expect, vi } from 'vitest';
import * as mailchimpFunctions from '@/pages/mailchimp/mcfunctions';

vi.mock('@/pages/mailchimp/client', () => ({
  default: {
    setConfig: vi.fn(),
    searchMembers: {
      search: vi.fn(() => Promise.resolve({
        exact_matches: {
          total_items: 1,
          members: [{ email_address: 'test@example.com', status: 'subscribed' }],
        },
      })),
    },
  },
}));

describe('User Email Handling', () => {
  it('fetches existing Mailchimp member details', async () => {
    // Assuming you can spy on mailchimpFunctions.search to add the assertion as required by "Test Case 2"
    const searchSpy = vi.spyOn(mailchimpFunctions, 'search');
    
    // Call the search function and store the result
    const result = await mailchimpFunctions.search('test@example.com');

    // Assert that the result matches the expected outcome
    expect(result).toEqual({
      exact_matches: {
        total_items: 1,
        members: [{ email_address: 'test@example.com', status: 'subscribed' }],
      },
    });

    // Assert that the search function was called with the correct argument
    expect(searchSpy).toHaveBeenCalledWith('test@example.com');

    // Clean up the spy
    searchSpy.mockRestore();
  });
});
