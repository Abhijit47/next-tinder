import { InsertUser } from '@/drizzle/schemas';
import { insertToDB, updateToDB } from '@/lib/user-actions';
import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    const eventType = evt.type;
    if (eventType === 'user.created') {
      const email = evt.data.email_addresses.find(
        (e) => e.id === evt.data.primary_email_address_id
      )?.email_address;

      const { metadata } = evt.data.public_metadata;
      console.log('metadata', metadata);

      const isProvidedGender =
        metadata?.gender === 'male'
          ? ['female']
          : metadata?.gender === 'female'
          ? ['male']
          : ['other'];

      const newUser = {
        id: evt.data.id,
        clerkId: evt.data.id,
        email: email || 'NA',
        fullName: evt.data.first_name + ' ' + evt.data.last_name,
        username: evt.data.username || 'NA',
        gender: metadata?.gender ?? 'other',
        birthdate: metadata?.birthdate || new Date().toISOString(),
        bio: "Hello! I'm new here.",
        avatarUrl: evt.data.image_url,
        preferences: {
          age_range: { min: 18, max: 50 },
          distance: 25,
          gender_preference: isProvidedGender,
        },
        isVerified: true,
        isOnline: true,
      } as InsertUser;

      const result = await insertToDB(newUser);

      if (!result.success) {
        console.error('Error inserting user to DB:', result.error);
        return new Response('Error inserting user to DB', { status: 500 });
      }

      return new Response('User created webhook received', { status: 200 });
    }
    if (eventType === 'user.updated') {
      const email = evt.data.email_addresses.find(
        (e) => e.id === evt.data.primary_email_address_id
      )?.email_address;
      const updateUser = {
        email: email || 'NA',
        fullName: evt.data.first_name + ' ' + evt.data.last_name,
        username: evt.data.username || 'NA',
        bio: "Hello! I'm new here.",
        avatarUrl: evt.data.image_url,
        preferences: {
          age_range: { min: 18, max: 50 },
          distance: 25,
          gender_preference: ['male'],
        },
        isVerified: true,
        isOnline: true,
      } as Partial<InsertUser>;

      const result = await updateToDB(evt.data.id, updateUser);

      if (!result.success) {
        console.error('Error updating user in DB:', result.error);
        return new Response('Error updating user in DB', { status: 500 });
      }
      return new Response('User updated webhook received', { status: 200 });
    }
    if (eventType === 'user.deleted') {
      console.log('user.deleted', evt.data.id);
      return new Response('User deleted webhook received', { status: 200 });
    }
    if (eventType === 'session.created') {
      console.log('session.created', evt.data.id);
      return new Response('Session created webhook received', { status: 200 });
    }
    if (eventType === 'email.created') {
      console.log('email.created', evt.data.id);
      return new Response('Email created webhook received', { status: 200 });
    }

    return new Response('Webhook received', { status: 200 });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }
}
