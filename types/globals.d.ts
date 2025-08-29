export {};

// Create a type for the roles
export type Roles = 'admin' | 'moderator' | 'guest';

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
      gender?: GenderPreference;
      birthdate?: string; // 1990-01-01
    };
  }

  interface UserPublicMetadata {
    metadata: {
      role?: Roles;
      gender?: GenderPreference;
      birthdate?: string; // 1990-01-01
    };
  }
}
