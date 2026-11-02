import { routeMockRequest } from '../mockBaseQuery';

describe('routeMockRequest', () => {
  it('serves the profile from the spec', () => {
    const result = routeMockRequest({ url: '/api/customers/12345/profile' });
    expect(result).toEqual({
      data: expect.objectContaining({ customerId: '12345', name: 'John Doe', accountType: 'premium', currency: 'ZAR' }),
    });
  });

  it('passes query params through to handlers', () => {
    const result = routeMockRequest({ url: '/api/customers/12345/spending/trends', params: { months: 6 } });
    expect('data' in result && (result.data as { trends: unknown[] }).trends).toHaveLength(6);
  });

  it('handles POST bodies', () => {
    const result = routeMockRequest({
      url: '/api/loans/calculate-rate',
      method: 'POST',
      body: { loanAmount: 50000, loanTerm: 12, loanType: 'personal_loan' },
    });
    expect('data' in result).toBe(true);
  });

  it('returns 404 for unknown customers and routes', () => {
    expect(routeMockRequest({ url: '/api/customers/999/goals' })).toEqual({
      error: { status: 404, data: { message: 'Customer 999 not found' } },
    });
    expect(routeMockRequest({ url: '/api/nope' })).toMatchObject({ error: { status: 404 } });
  });

  it('turns handler validation errors into 400 responses', () => {
    expect(routeMockRequest({ url: '/api/customers/12345/spending/summary', params: { period: 'forever' } })).toMatchObject({
      error: { status: 400 },
    });
  });

  it('does not match a GET route for a POST', () => {
    expect(routeMockRequest({ url: '/api/loans/products', method: 'POST' })).toMatchObject({ error: { status: 404 } });
  });
});
