import { GEORGIAN_TO_ENGLISH, RUSSIAN_TO_ENGLISH } from '@/constants/language';

/**
 * Transliterates Georgian and Russian text to English
 * @param text - Text to transliterate
 * @returns Transliterated text
 */
export const transliterateToEnglish = (text: string): string => {
  const transliterationMap = { ...GEORGIAN_TO_ENGLISH, ...RUSSIAN_TO_ENGLISH };

  return text
    .split('')
    .map((char) =>
      transliterationMap[char] !== undefined ? transliterationMap[char] : char,
    )
    .join('')
    .replace(/[^\x00-\x7F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Formats timestamp to readable time string
 * @param timestamp - Timestamp in milliseconds
 * @returns Formatted time string
 */
export const formatMessageTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};
