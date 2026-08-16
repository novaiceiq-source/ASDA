import { ConvexError } from 'convex/values';
import { mutation, query } from './_generated/server';
import { authComponent } from './auth';
import { appStateValidator } from './validators';

const emptyState = {
  items: [],
  transactions: [],
  shifts: ['الشفت الاول', 'الشفت الثاني', 'الشفت الثالث'],
  delegates: [],
  expenses: [],
  invoices: [],
};

const requireAuthorizedUser = async (ctx: Parameters<typeof authComponent.getAuthUser>[0]) => {
  const user = await authComponent.getAuthUser(ctx);
  const allowedEmail = process.env.AUTHORIZED_EMAIL?.trim().toLowerCase();
  const email = user?.email?.trim().toLowerCase();

  if (!user || !email || !allowedEmail || email !== allowedEmail) {
    throw new ConvexError('ليس لديك صلاحية للوصول إلى بيانات الشركة');
  }

  return user;
};

export const get = query({
  args: {},
  handler: async (ctx) => {
    await requireAuthorizedUser(ctx);
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
    const user = await requireAuthorizedUser(ctx);
    const existing = await ctx.db
      .query('appState')
      .withIndex('by_key', (q) => q.eq('key', 'primary'))
      .unique();
    const update = {
      data,
      updatedAt: Date.now(),
      updatedBy: user.email,
    };

    if (existing) {
      await ctx.db.patch(existing._id, update);
      return existing._id;
    }

    return await ctx.db.insert('appState', { key: 'primary', ...update });
  },
});
