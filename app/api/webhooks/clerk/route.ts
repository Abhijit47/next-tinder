import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    const eventType = evt.type;
    if (eventType === 'user.created') {
      console.log('user.created', evt.data.id);

      // const email = evt.data.email_addresses.find(
      //   (e) => e.id === evt.data.primary_email_address_id
      // )?.email_address;

      // const newUser = {
      //   clerkId: evt.data.id,
      //   email: email || 'NA',
      //   fullName: evt.data.first_name + ' ' + evt.data.last_name,
      //   username: evt.data.username || 'NA',
      //   gender: "other",
      //   birthdate: new Date().toISOString(),
      //   bio: "Hello! I'm new here.",
      //   avatarUrl: evt.data.image_url,
      // } as InsertUser;

      return new Response('User created webhook received', { status: 200 });
    }
    if (eventType === 'user.updated') {
      console.log('user.updated', evt.data.id);
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
