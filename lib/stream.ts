'use server';

import { db } from '@/drizzle/db';
import { users } from '@/drizzle/schemas';
import { env } from '@/env';
import { currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { StreamChat } from 'stream-chat';
import { generateChannelId } from './helpers';

export async function requireAuth() {
  const user = await currentUser();
  if (!user) {
    return redirect('/sign-in');
  }
  return user;
}

export async function getStreamUserToken() {
  const user = await requireAuth();

  try {
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, user.id),
      columns: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
      },
    });

    if (!existingUser) {
      return {};
    }

    // instantiate your stream client using the API key and secret
    // the secret is only used server side and gives you full access to the API
    const serverClient = StreamChat.getInstance(
      env.NEXT_PUBLIC_STREAM_API_KEY,
      env.STREAM_API_SECRET
    );

    // generate a token for the user with id 'john'
    const token = serverClient.createToken(user.id);

    //* Syncing users
    /**
     * When a user starts a chat conversation with another user both users need to be present in Stream’s user storage. So you’ll want to make sure that users are synced in advance. The update users endpoint allows you to update 100 users at once, an example is shown below:
     */
    await serverClient.upsertUser({
      id: user.id,
      name: existingUser.fullName,
      image: existingUser.avatarUrl || undefined,
    });

    return {
      token,
      userId: user.id,
      userName: existingUser.fullName,
      userImage: existingUser.avatarUrl,
    };
  } catch (error) {
    console.error('failed to get stream user token', error);
    return {};
  }
}

export async function createOrGetChannel(otherUserId: string) {
  const user = await requireAuth(); // Clerk's ID
  const myId = user.id;

  // 1️⃣: Check if this is a valid, *active* match
  const [match] = await db.query.matches.findMany({
    where(fields, operators) {
      const { eq, or, and } = operators;
      return and(
        eq(fields.isActive, true),
        or(
          and(eq(fields.user1Id, myId), eq(fields.user2Id, otherUserId)),
          and(eq(fields.user1Id, otherUserId), eq(fields.user2Id, myId))
        )
      );
    },
    with: { user1: true, user2: true },
    limit: 1,
  });

  if (!match) {
    throw new Error('Users are not matched. Cannot create chat channel.');
  }

  // 2️⃣: Deterministic channel ID
  const channelId = generateChannelId(myId, otherUserId, 32, 'match');
  // const sortedIds = [myId, otherUserId].sort();
  // const combinedIds = sortedIds.join('_');
  // let hash = 0;
  // for (let i = 0; i < combinedIds.length; i++) {
  //   const char = combinedIds.charCodeAt(i);
  //   hash = (hash << 5) - hash + char;
  //   hash = hash & hash; // Convert to 32-bit int
  // }
  // const channelId = `match_${Math.abs(hash).toString(36)}`;

  // 3️⃣: Get "other" user info (via Drizzle)
  const [otherUser] = await db.query.users.findMany({
    where: eq(users.id, otherUserId),
    columns: {
      fullName: true,
      avatarUrl: true,
    },
    limit: 1,
  });
  if (!otherUser) throw new Error('Failed to fetch other user');

  // 4️⃣: Stream Chat setup
  const serverClient = StreamChat.getInstance(
    env.NEXT_PUBLIC_STREAM_API_KEY,
    env.STREAM_API_SECRET
  );

  // 5️⃣: Upsert "other" user into StreamChat (for avatar, name on frontend)
  await serverClient.upsertUser({
    id: otherUserId,
    name: otherUser.fullName,
    image: otherUser.avatarUrl || undefined,
  });

  // 6️⃣: Create or get the channel
  const channel = serverClient.channel('messaging', channelId, {
    members: [myId, otherUserId],
    created_by_id: myId,
  });

  try {
    await channel.create();
    // Channel created, carry on
    console.log('Channel created successfully:', channelId);
  } catch (error) {
    // Ignore error only if channel exists already, otherwise rethrow!
    if (!(error instanceof Error && error.message.includes('already exists'))) {
      throw error;
    }
  }

  return {
    channelType: 'messaging',
    channelId,
  };
}

export async function createVideoCall(otherUserId: string) {
  const user = await requireAuth(); // Clerk's ID
  const myId = user.id;

  try {
    // 1️⃣: Check if this is a valid, *active* match
    const [match] = await db.query.matches.findMany({
      where(fields, operators) {
        const { eq, or, and } = operators;
        return and(
          eq(fields.isActive, true),
          or(
            and(eq(fields.user1Id, myId), eq(fields.user2Id, otherUserId)),
            and(eq(fields.user1Id, otherUserId), eq(fields.user2Id, myId))
          )
        );
      },
      with: { user1: true, user2: true },
      limit: 1,
    });

    if (!match) {
      throw new Error('Users are not matched. Cannot create chat channel.');
    }

    // 2️⃣: Deterministic channel ID
    const callId = generateChannelId(myId, otherUserId, 32, 'call');

    console.log({ callId: callId });
    return { callId, callType: 'default' };
  } catch (error) {
    console.error('Error in createOrGetChannel:', error);
    throw error;
  }
}

export async function getStreamVideoToken() {
  const user = await requireAuth(); // Clerk's ID;

  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, user.id),
      columns: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
      },
    });

    if (!existingUser) {
      return { token: null };
    }

    const serverClient = StreamChat.getInstance(
      env.NEXT_PUBLIC_STREAM_API_KEY,
      env.STREAM_API_SECRET
    );

    const token = serverClient.createToken(user.id);

    return {
      token,
      userId: user.id,
      userName: existingUser.fullName,
      userImage: existingUser.avatarUrl,
    };
  } catch (error) {
    console.error('failed to get stream video token', error);
    return { token: null };
  }
}
