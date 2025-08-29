'use client';

import { InsertUser } from '@/drizzle/schemas';
import { getUserMatches } from '@/lib/matches-actions';
import { calculateAge } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function MatchesPage() {
  const [matches, setMatches] = useState<InsertUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMatches() {
      try {
        const userMatches = await getUserMatches();
        setMatches(userMatches);
        console.log(userMatches);
      } catch (error) {
        console.error(error);
        setError('Failed to load matches.');
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto'></div>
          <p className='mt-4 text-gray-600 dark:text-gray-400'>
            Loading your matches...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center'>
        <div className='text-center max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
            Oops!
          </h2>
          <p className='text-gray-600 dark:text-gray-400 mb-6'>{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              setMatches([]);
            }}
            className='bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold py-2 px-4 rounded-full hover:from-pink-600 hover:to-red-600 transition-all duration-200'>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800'>
      <div className='container mx-auto px-4 py-8'>
        <header className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
            Your Matches
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>
            {matches.length} match{matches.length !== 1 ? 'es' : ''}
          </p>
        </header>

        {matches.length === 0 ? (
          <div className='text-center max-w-md mx-auto p-8'>
            <div className='w-24 h-24 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6'>
              <span className='text-4xl'>💕</span>
            </div>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
              No matches yet
            </h2>
            <p className='text-gray-600 dark:text-gray-400 mb-6'>
              Start swiping to find your perfect match!
            </p>
            <Link
              href='/matches'
              className='bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold py-3 px-6 rounded-full hover:from-pink-600 hover:to-red-600 transition-all duration-200'>
              Start Swiping
            </Link>
          </div>
        ) : (
          <div className='max-w-2xl mx-auto'>
            <div className='grid gap-4'>
              {matches.map((match, key) => (
                <Link
                  key={key}
                  href={`/chat/${match.id}`}
                  className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105'>
                  <div className='flex items-center space-x-4'>
                    <div className='relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0'>
                      <Image
                        src={
                          match.avatarUrl ??
                          'https://placehold.co/600x400/png?text=No+Image'
                        }
                        alt={match.fullName}
                        className='w-full h-full object-cover'
                        width={150}
                        height={150}
                      />
                    </div>

                    <div className='flex-1 min-w-0'>
                      <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                        {match.fullName}, {calculateAge(match.birthdate)}
                      </h3>
                      <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
                        @{match.username}
                      </p>
                      <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2'>
                        {match.bio}
                      </p>
                    </div>
                    <div className='flex-shrink-0'>
                      <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
