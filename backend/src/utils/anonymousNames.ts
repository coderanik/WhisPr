import crypto from 'crypto';

// List of adjectives and nouns to generate anonymous names
const ADJECTIVES = [
  'Mysterious', 'Silent', 'Hidden', 'Secret', 'Quiet', 'Stealthy', 'Shadow', 'Whisper',
  'Echo', 'Fade', 'Veil', 'Mask', 'Ghost', 'Phantom', 'Specter', 'Wraith',
  'Silhouette', 'Mist', 'Fog', 'Cloud', 'Vapor', 'Smoke', 'Haze', 'Dusk',
  'Twilight', 'Midnight', 'Starlight', 'Moonlight', 'Sunset', 'Dawn', 'Aurora'
];

const NOUNS = [
  'Observer', 'Watcher', 'Listener', 'Seeker', 'Wanderer', 'Traveler', 'Explorer',
  'Guardian', 'Sentinel', 'Protector', 'Defender', 'Keeper', 'Caretaker', 'Custodian',
  'Messenger', 'Herald', 'Emissary', 'Ambassador', 'Delegate', 'Representative',
  'Sage', 'Scholar', 'Sage', 'Wise', 'Thinker', 'Philosopher', 'Mystic', 'Oracle'
];

export class AnonymousNameGenerator {
  /**
   * Generate a unique anonymous name based on registration number
   * This ensures the same regNo always generates the same anonymous name
   */
  static generateAnonymousName(regNo: string): string {
    // Create a hash from the registration number to ensure consistency
    const hash = crypto.createHash('sha256').update(regNo).digest('hex');
    
    // Use the hash to deterministically select adjective and noun
    const adjectiveIndex = parseInt(hash.substring(0, 8), 16) % ADJECTIVES.length;
    const nounIndex = parseInt(hash.substring(8, 16), 16) % NOUNS.length;
    
    // Generate a short unique identifier (last 4 characters of hash)
    const uniqueId = hash.substring(hash.length - 4);
    
    const adjective = ADJECTIVES[adjectiveIndex];
    const noun = NOUNS[nounIndex];
    
    return `${adjective}${noun}${uniqueId}`;
  }

  /**
   * Generate a completely random anonymous name (for testing purposes)
   */
  static generateRandomAnonymousName(): string {
    const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const uniqueId = crypto.randomBytes(2).toString('hex');
    
    return `${adjective}${noun}${uniqueId}`;
  }
}
