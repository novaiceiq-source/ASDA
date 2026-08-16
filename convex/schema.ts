import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import { appStateValidator } from './validators';

export default defineSchema({
  appState: defineTable({
    key: v.literal('primary'),
    data: appStateValidator,
    updatedAt: v.number(),
    updatedBy: v.string(),
  }).index('by_key', ['key']),
});
