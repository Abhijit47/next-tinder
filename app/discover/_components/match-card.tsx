import { InsertUser } from '@/drizzle/schemas';
import { calculateAge } from '@/lib/utils';
import Image from 'next/image';

export default function MatchCard({ user }: { user: InsertUser }) {
  return (
    <div className='relative w-full max-w-sm mx-auto'>
      <div className='card-swipe aspect-[3/4] overflow-hidden'>
        <div className='relative w-full h-full'>
          <Image
            src={user.avatarUrl ?? 'https://placehold.co/600x800/png'}
            alt={user.fullName}
            fill
            className={`object-cover transition-opacity duration-300`}
            priority
          />

          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />

          <div className='absolute bottom-0 left-0 right-0 p-6 text-white'>
            <div className='flex items-end justify-between'>
              <div>
                <h2 className='text-2xl font-bold mb-1'>
                  {user.fullName}, {calculateAge(user.birthdate)}
                </h2>
                <p className='text-sm opacity-90 mb-2'>@{user.username}</p>
                <p className='text-sm leading-relaxed'>{user.bio}</p>
                <p className='text-sm leading-relaxed'>{user.gender}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
