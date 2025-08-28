import { ThemeModeToggle } from '@/components/shared/theme-mode-toggle';
import { SignedIn, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      Dating APp
      <Link href='/sign-in'>Sign in</Link>
      <ThemeModeToggle />
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
