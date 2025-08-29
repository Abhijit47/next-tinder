'use server';

import { db } from '@/drizzle/db';
import { likes, matches, users } from '@/drizzle/schemas';
import { currentUser } from '@clerk/nextjs/server';

import { and, eq, inArray, ne, or } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export async function getPotentialMatches() {
  const user = await currentUser();

  if (!user) {
    return redirect('/sign-in');
  }

  try {
    // Fetch current user preferences
    const [{ preferences }] = await db
      .select({ preferences: users.preferences })
      .from(users)
      .where(eq(users.id, user.id));

    const genderPreference = preferences?.gender_preference;

    // Find 50 potential matches
    const candidates = await db
      .select()
      .from(users)
      .where(
        and(
          ne(users.id, user.id), // Exclude self
          genderPreference?.length
            ? inArray(users.gender, genderPreference)
            : undefined
        )
      )
      .limit(50);

    return candidates;
  } catch (error) {
    console.error('Error fetching potential matches:', error);
    return [];
  }
}

export async function getUserMatches() {
  const user = await currentUser();

  if (!user) {
    return redirect('/sign-in');
  }
  try {
    // Find all matches where user is user1 or user2 AND is active
    const userMatches = await db
      .select()
      .from(matches)
      .where(
        and(
          eq(matches.isActive, true),
          or(eq(matches.user1Id, user.id), eq(matches.user2Id, user.id))
        )
      );
    // Get other user details in batch (efficient)
    const otherUserIds = userMatches.map((m) =>
      m.user1Id === user.id ? m.user2Id : m.user1Id
    );
    const matchedUsers = await db
      .select()
      .from(users)
      .where(inArray(users.id, otherUserIds));
    // Zip the match records with user info if desired

    return matchedUsers;
  } catch (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
}

export async function likeUser(toUserId: string) {
  const user = await currentUser();

  if (!user) {
    return redirect('/sign-in');
  }

  try {
    const fromUserId = user.id; // ID of the user performing the like action
    const commited = await db.transaction(async (trx) => {
      // Insert like only if it doesn't already exist
      const [existingLike] = await trx
        .select()
        .from(likes)
        .where(
          and(eq(likes.fromUserId, fromUserId), eq(likes.toUserId, toUserId))
        );

      if (existingLike) {
        return { success: false, isMatch: false, error: 'Already liked' };
      }

      await trx.insert(likes).values({ fromUserId, toUserId });

      // Check for mutual like
      const [reverseLike] = await trx
        .select()
        .from(likes)
        .where(
          and(eq(likes.fromUserId, toUserId), eq(likes.toUserId, fromUserId))
        );

      if (reverseLike) {
        // Prevent duplicate match (idempotent)
        const [existingMatch] = await trx
          .select()
          .from(matches)
          .where(
            or(
              and(
                eq(matches.user1Id, fromUserId),
                eq(matches.user2Id, toUserId)
              ),
              and(
                eq(matches.user1Id, toUserId),
                eq(matches.user2Id, fromUserId)
              )
            )
          );

        if (!existingMatch) {
          await trx.insert(matches).values({
            user1Id: fromUserId < toUserId ? fromUserId : toUserId,
            user2Id: fromUserId > toUserId ? fromUserId : toUserId,
          });
        }

        // Optional: fetch matched user details
        const [matchedUser] = await trx
          .select()
          .from(users)
          .where(eq(users.id, toUserId));
        return { success: true, isMatch: true, matchedUser: matchedUser };
      }

      return { success: true, isMatch: false };
    });
    return { ...commited };
  } catch (error) {
    console.error('Error liking user:', error);
    return { success: false, isMatch: false, error: 'Internal error' };
  }
}
