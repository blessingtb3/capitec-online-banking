import type { Transaction } from '../../types/spending';
import { addDays } from '../../utils/dates';
import { filters, MOCK_TODAY } from './customer';

/**
 * Two years of transactions (so 1-year comparisons have a previous year) ending on MOCK_TODAY. The two transactions from the
 * API spec come first, verbatim; the rest are generated deterministically
 * (same output on every run) and calibrated so a 30-day window lands close
 * to the spec's summary (~R4 250 over ~47 transactions).
 */

const specTransactions: Transaction[] = [
  {
    id: 'txn_123456',
    date: '2024-09-16T14:30:00Z',
    merchant: 'Pick n Pay',
    category: 'Groceries',
    amount: 245.8,
    description: 'Weekly groceries',
    paymentMethod: 'Credit Card',
    icon: 'shopping-cart',
    categoryColor: '#FF6B6B',
  },
  {
    id: 'txn_123457',
    date: '2024-09-15T10:15:00Z',
    merchant: 'Netflix',
    category: 'Entertainment',
    amount: 199.0,
    description: 'Monthly subscription',
    paymentMethod: 'Debit Order',
    icon: 'film',
    categoryColor: '#4ECDC4',
  },
];

interface Profile {
  category: string;
  /** Expected transactions per 30 days. */
  perMonth: number;
  /** Average amount per transaction, in rands. */
  average: number;
  merchants: { name: string; description: string; paymentMethod: string }[];
}

// Rates come from the spec's 30-day category breakdown.
const PROFILES: Profile[] = [
  {
    category: 'Groceries',
    perMonth: 13,
    average: 83,
    merchants: [
      { name: 'Pick n Pay', description: 'Weekly groceries', paymentMethod: 'Credit Card' },
      { name: 'Checkers', description: 'Groceries', paymentMethod: 'Debit Card' },
      { name: 'Woolworths Food', description: 'Fresh produce', paymentMethod: 'Credit Card' },
    ],
  },
  {
    category: 'Entertainment',
    perMonth: 6,
    average: 111,
    merchants: [
      { name: 'Ster-Kinekor', description: 'Movie tickets', paymentMethod: 'Credit Card' },
      { name: 'Computicket', description: 'Event tickets', paymentMethod: 'Credit Card' },
      { name: 'Spotify', description: 'Music subscription', paymentMethod: 'Debit Order' },
    ],
  },
  {
    category: 'Transportation',
    perMonth: 10,
    average: 57,
    merchants: [
      { name: 'Uber', description: 'Ride', paymentMethod: 'Credit Card' },
      { name: 'Gautrain', description: 'Train fare', paymentMethod: 'Debit Card' },
      { name: 'Shell', description: 'Fuel', paymentMethod: 'Credit Card' },
    ],
  },
  {
    category: 'Dining',
    perMonth: 8,
    average: 58,
    merchants: [
      { name: 'Nando’s', description: 'Lunch', paymentMethod: 'Credit Card' },
      { name: 'Mugg & Bean', description: 'Coffee', paymentMethod: 'Debit Card' },
      { name: 'Uber Eats', description: 'Food delivery', paymentMethod: 'Credit Card' },
    ],
  },
  {
    category: 'Shopping',
    perMonth: 5,
    average: 75,
    merchants: [
      { name: 'Takealot', description: 'Online order', paymentMethod: 'Credit Card' },
      { name: 'Mr Price', description: 'Clothing', paymentMethod: 'Debit Card' },
      { name: 'Clicks', description: 'Toiletries', paymentMethod: 'Credit Card' },
    ],
  },
  {
    category: 'Utilities',
    perMonth: 3,
    average: 153,
    merchants: [
      { name: 'City Power', description: 'Electricity', paymentMethod: 'Debit Order' },
      { name: 'Vodacom', description: 'Airtime & data', paymentMethod: 'Debit Order' },
      { name: 'Rain', description: 'Home internet', paymentMethod: 'Debit Order' },
    ],
  },
];

/** Mulberry32: a tiny seeded random number generator. */
function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateTransactions(days: number): Transaction[] {
  const random = seededRandom(26);
  const generated: Transaction[] = [];
  let counter = 0;

  // Walk backwards from the day before MOCK_TODAY.
  for (let d = 1; d <= days; d++) {
    const date = addDays(MOCK_TODAY, -d);
    for (const profile of PROFILES) {
      if (random() >= profile.perMonth / 30) continue;
      const category = filters.categories.find((c) => c.name === profile.category)!;
      const merchant = profile.merchants[Math.floor(random() * profile.merchants.length)];
      const amount = Math.round(profile.average * (0.6 + random() * 0.8) * 100) / 100;
      const hour = String(7 + Math.floor(random() * 14)).padStart(2, '0');
      const minute = String(Math.floor(random() * 60)).padStart(2, '0');
      counter += 1;
      generated.push({
        id: `txn_${String(200000 + counter)}`,
        date: `${date}T${hour}:${minute}:00Z`,
        merchant: merchant.name,
        category: category.name,
        amount,
        description: merchant.description,
        paymentMethod: merchant.paymentMethod,
        icon: category.icon,
        categoryColor: category.color,
      });
    }
  }
  return generated;
}

/** Newest first. */
export const transactions: Transaction[] = [...specTransactions, ...generateTransactions(800)];
