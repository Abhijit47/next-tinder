import { neon } from '@neondatabase/serverless';
import { loadEnvConfig } from '@next/env';
import { drizzle } from 'drizzle-orm/neon-http';
import { seed } from 'drizzle-seed';
import * as schemas from './schemas';
// import { AbstractGenerator } from 'drizzle-orm/pg-core';

loadEnvConfig(process.cwd(), true);

// const images = [
//   'https://res.cloudinary.com/rotate-key/image/upload/v1741844126/rotate-key/%5Bobject%20Object%5D/my-property/20241223_115142.jpg.jpg',
//   'https://res.cloudinary.com/rotate-key/image/upload/v1741589103/rotate-key/%5Bobject%20Object%5D/my-property/20241223_152021.jpg.jpg',
//   'https://res.cloudinary.com/rotate-key/image/upload/v1739367075/rotate-key/%5Bobject%20Object%5D/my-property/20241223_152631.jpg.jpg',
//   'https://res.cloudinary.com/rotate-key/image/upload/v1739107887/rotate-key/%5Bobject%20Object%5D/my-property/IMG_20241226_154950.jpg.jpg',
//   'https://res.cloudinary.com/rotate-key/image/upload/v1739005067/rotate-key/%5Bobject%20Object%5D/my-property/20241223_114942.jpg.jpg',
// ];

// const propertyConstantTypes = [
//   'apartment',
//   'house',
//   'condo',
//   'townhouse',
//   'cottage',
//   'villa',
//   'studio',
//   'loft',
//   'penthouse',
//   'duplex',
//   'bungalow',
//   'farmhouse',
//   'chalet',
//   'cabin',
//   'mansion',
//   'castle',
//   'beach house',
//   'ski lodge',
// ];

// const MIN_DAYS = 1;
// const MAX_DAYS = 30;

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle({ client: sql, schema: schemas });

  // const users = [
  //   'user_2xqUzTpoMveMTtT6dNIaxAEhtQz',
  //   'user_2xqRz3PcUr14EFGp1AYkE6aCNhQ',
  // ];

  // const USERID_1 = 'user_2xqRz3PcUr14EFGp1AYkE6aCNhQ';
  // const USERID_2 = 'user_2xqRz3PcUr14EFGp1AYkE6aCNhQ';
  const gender = ['male', 'female', 'other'];
  const isVerified = [true, false];
  const isOnline = [true, false];

  await seed(db, { users: schemas.users }, { count: 5 }).refine((fn) => ({
    users: {
      columns: {
        clerkId: fn.uuid(),
        fullName: fn.fullName(),
        username: fn.firstName(),
        email: fn.email(),
        gender: fn.valuesFromArray({ values: gender, arraySize: 1 }),
        birthdate: fn.timestamp(),
        // bio: '',
        avatarUrl: fn.default({
          defaultValue:
            'https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zMXV2Z2p6UFR3dEZHTG1DZkoyZlpZcndXRTUiLCJyaWQiOiJ1c2VyXzMxdjdVcWU4MlFTRHE5Q1NSMktXV2ExazBqaiIsImluaXRpYWxzIjoiQUsifQ',
        }),
        // preferences: '',
        // locationLat: '',
        // locationLng: '',
        // lastActive: '',
        isVerified: fn.valuesFromArray({ values: isVerified, arraySize: 1 }),
        isOnline: fn.valuesFromArray({ values: isOnline, arraySize: 1 }),
        // createdAt: '',
        // updatedAt: '',
      },
    },
  }));

  console.log('Seeding completed successfully!');
  process.exit(0); // stop the process after seeding
}

main();
