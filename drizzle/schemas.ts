import { relations } from 'drizzle-orm';
import {
  boolean,
  date,
  decimal,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

export const GENDER_ENUMS = pgEnum('gender', ['male', 'female', 'other']);

// ===============================
// Users Table
// ===============================
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().unique().defaultRandom().notNull(),
    clerkId: text('clerk_id').unique().notNull(),
    fullName: text('full_name').notNull(),
    username: text('username').unique().notNull(),
    email: text('email').unique().notNull(),
    password: text('password').default(''),

    gender: GENDER_ENUMS('male').notNull(),

    birthdate: date('birthdate').notNull(),
    bio: text('bio'),
    avatarUrl: text('avatar_url'),

    preferences: jsonb('preferences')
      .$type<{
        age_range: { min: number; max: number };
        distance: number;
        gender_preference: string[];
      }>()
      .default({
        age_range: { min: 18, max: 50 },
        distance: 25,
        gender_preference: [],
      }),

    locationLat: decimal('location_lat', { precision: 10, scale: 8 }),
    locationLng: decimal('location_lng', { precision: 11, scale: 8 }),

    lastActive: timestamp('last_active', { withTimezone: true }).defaultNow(),
    isVerified: boolean('is_verified').default(false),
    isOnline: boolean('is_online').default(false),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (t) => [
    index('idx_users_username').on(t.username),
    index('idx_users_email').on(t.email),
    index('idx_users_gender').on(t.gender),
    index('idx_users_birthdate').on(t.birthdate),
    index('idx_users_location').on(t.locationLat, t.locationLng),
    index('idx_users_last_active').on(t.lastActive),
    index('idx_users_created_at').on(t.createdAt),
  ]
);

// ===============================
// Likes Table
// ===============================
export const likes = pgTable(
  'likes',
  {
    id: uuid('id').primaryKey().unique().defaultRandom().notNull(),
    fromUserId: text('from_user_id')
      .notNull()
      .references(() => users.clerkId, { onDelete: 'cascade' }),
    toUserId: text('to_user_id')
      .notNull()
      .references(() => users.clerkId, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (t) => [
    uniqueIndex('likes_unique').on(t.fromUserId, t.toUserId),
    index('idx_likes_from_user').on(t.fromUserId),
    index('idx_likes_to_user').on(t.toUserId),
    index('idx_likes_created_at').on(t.createdAt),
  ]
);

// ===============================
// Matches Table
// ===============================
export const matches = pgTable(
  'matches',
  {
    id: uuid('id').primaryKey().unique().defaultRandom().notNull(),
    user1Id: text('user1_id')
      .notNull()
      .references(() => users.clerkId, { onDelete: 'cascade' }),
    user2Id: text('user2_id')
      .notNull()
      .references(() => users.clerkId, { onDelete: 'cascade' }),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (t) => [
    uniqueIndex('matches_unique').on(t.user1Id, t.user2Id),
    index('idx_matches_user1').on(t.user1Id),
    index('idx_matches_user2').on(t.user2Id),
    index('idx_matches_created_at').on(t.createdAt),
  ]
);

// ============ RELATIONS =============

// User relations: One-to-many for likes, matches
export const usersRelations = relations(users, ({ many }) => ({
  sentLikes: many(likes, {
    relationName: 'sentLikes',
    // fields: [users.id],
    // references: [likes.fromUserId],
  }),
  receivedLikes: many(likes, {
    relationName: 'receivedLikes',
    // fields: [users.id],
    // references: [likes.toUserId],
  }),
  matchesAsUser1: many(matches, {
    relationName: 'matchesAsUser1',
    // fields: [users.id],
    // references: [matches.user1Id],
  }),
  matchesAsUser2: many(matches, {
    relationName: 'matchesAsUser2',
    // fields: [users.id],
    // references: [matches.user2Id],
  }),
}));

// Likes relations: many-to-one for users
export const likesRelations = relations(likes, ({ one }) => ({
  fromUser: one(users, {
    fields: [likes.fromUserId],
    references: [users.id],
    relationName: 'fromUser',
  }),
  toUser: one(users, {
    fields: [likes.toUserId],
    references: [users.id],
    relationName: 'toUser',
  }),
}));

// Matches relations: many-to-one for users
export const matchesRelations = relations(matches, ({ one }) => ({
  user1: one(users, {
    fields: [matches.user1Id],
    references: [users.id],
    relationName: 'user1',
  }),
  user2: one(users, {
    fields: [matches.user2Id],
    references: [users.id],
    relationName: 'user2',
  }),
}));

// ===============================
// Types
export type InsertUser = typeof users.$inferSelect;
export type SelectUser = typeof users.$inferSelect;

export type InsertLike = typeof likes.$inferSelect;
export type SelectLike = typeof likes.$inferSelect;

export type InsertMatch = typeof matches.$inferSelect;
export type SelectMatch = typeof matches.$inferSelect;
// ===============================
