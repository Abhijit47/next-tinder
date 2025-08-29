import { createHash } from 'crypto';

/**
 * Generates a deterministic chat channel ID from two user IDs, always the same for the same pair.
 * @param userIdA - First user ID (string)
 * @param userIdB - Second user ID (string)
 * @param length - Length of the hash segment to use (default: 16)
 * @param type - Type of channel, either "match" or "call"
 * @returns a string like `match_<hash>`
 */
export function generateChannelId(
  userIdA: string,
  userIdB: string,
  length = 16,
  type: 'match' | 'call'
): string {
  const sorted = [userIdA, userIdB].sort(); // ensures order doesn't matter
  const hash = createHash('sha256')
    .update(sorted.join('_'))
    .digest('hex')
    .slice(0, length);
  // You can change '16' to however many chars you want for length
  //
  return `${type}_${hash}`;
}
