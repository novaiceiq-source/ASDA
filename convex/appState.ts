import { mutation, query } from './_generated/server';
import { appStateValidator } from './validators';

const emptyState = {
  items: [],
  transactions: [],
  shifts: ['الشفت الاول', 'الشفت الثاني', 'الشفت الثالث'],
  delegates: [],
  expenses: [],
  invoices: [],
};

export const get = query({
  args: {},
  handler: async (ctx) => {
    const record = await ctx.db
      .query('appState')
      .withIndex('by_key', (q) => q.eq('key', 'primary'))
      .unique();

    return record?.data ?? emptyState;
  },
});

export const save = mutation({
  args: { data: appStateValidator },
  handler: async (ctx, { data }) => {
    const existing = await ctx.db
      .query('appState')
      .withIndex('by_key', (q) => q.eq('key', 'primary'))
      .unique();
    const update = {
      data,
      updatedAt: Date.now(),
      updatedBy: 'personal-site',
    };

    if (existing) {
      await ctx.db.patch(existing._id, update);
      return existing._id;
    }

    return await ctx.db.insert('appState', { key: 'primary', ...update });
  },
});
