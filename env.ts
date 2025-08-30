import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    CLOUDINARY_UPLOAD_PRESET_NAME: z.string().min(1),
    CLOUDINARY_BASE_FOLDER_NAME: z.string().min(1),
    CLOUDINARY_SIGNING_MODE: z.string().superRefine((val, ctx) => {
      if (val !== 'true' && val !== 'false') {
        ctx.addIssue({
          code: 'custom',
          message: 'CLOUDINARY_SIGNING_MODE must be "true" or "false"',
        });
      }
    }),
    CLOUDINARY_API_KEY: z.string().min(1),
    CLOUDINARY_API_SECRET: z.string().min(1),
    NEON_API_KEY: z.string().min(1),
    STREAM_API_SECRET: z.string().min(1),
  },
  client: {
    // NEXT_PUBLIC_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_C15T_URL: z.url(),
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1),
    NEXT_PUBLIC_DEV_BASE_URL: z.url(),
    NEXT_PUBLIC_PROD_BASE_URL: z.url(),
    NEXT_PUBLIC_STREAM_API_KEY: z.string().min(1),
    NEXT_PUBLIC_DATABUDDY_CLIENT_ID: z.string().min(1),
  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  // runtimeEnv: {
  //   DATABASE_URL: process.env.DATABASE_URL,
  //   OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
  // },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {
    // NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
    NEXT_PUBLIC_C15T_URL: process.env.NEXT_PUBLIC_C15T_URL,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_DEV_BASE_URL: process.env.NEXT_PUBLIC_DEV_BASE_URL,
    NEXT_PUBLIC_PROD_BASE_URL: process.env.NEXT_PUBLIC_PROD_BASE_URL,
    NEXT_PUBLIC_STREAM_API_KEY: process.env.NEXT_PUBLIC_STREAM_API_KEY,
    NEXT_PUBLIC_DATABUDDY_CLIENT_ID:
      process.env.NEXT_PUBLIC_DATABUDDY_CLIENT_ID,
  },
});
