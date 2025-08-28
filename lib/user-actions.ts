'use server';

import { db } from '@/drizzle/db';
import { InsertUser, users } from '@/drizzle/schemas';
import { eq } from 'drizzle-orm';

export async function insertToDB(
  args: InsertUser
): Promise<{ success: boolean; error?: string }> {
  const user = args;
  const newUser = await db.insert(users).values(user);
  if (!newUser.rowCount) {
    return { success: false, error: 'Failed to insert user' };
  }

  return { success: true };
}

export async function updateToDB(
  clerkId: string,
  args: Partial<InsertUser>
): Promise<{ success: boolean; error?: string }> {
  const updatedFields = args;

  const updatedUser = await db
    .update(users)
    .set(updatedFields)
    .where(eq(users.clerkId, clerkId));

  if (!updatedUser.rowCount) {
    return { success: false, error: 'Failed to update user' };
  }

  return { success: true };
}

export async function deleteFromDB(
  clerkId: string
): Promise<{ success: boolean; error?: string }> {
  const deletedUser = await db.delete(users).where(eq(users.clerkId, clerkId));

  if (!deletedUser.rowCount) {
    return { success: false, error: 'Failed to delete user' };
  }

  return { success: true };
}
