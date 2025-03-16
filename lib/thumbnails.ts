/**
 * Utility functions for handling subject-wise thumbnails
 */

// Define the subject categories
export type SubjectCategory = 
  | 'blockchain'
  | 'programming'
  | 'design'
  | 'business'
  | 'mathematics'
  | 'science'
  | 'language'
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'computer science'
  | 'literature'
  | 'history'
  | 'economics'
  | 'document'
  | 'video'
  | 'other';

// Define the thumbnail paths and gradients for each subject
interface ThumbnailConfig {
  path: string;
  gradient: string;
  icon: string;
}

// Map of subject categories to their thumbnail configurations
export const SUBJECT_THUMBNAILS: Record<string, ThumbnailConfig> = {
  'blockchain': {
    path: '/thumbnails/blockchain.svg',
    gradient: 'from-purple-500 to-blue-500',
    icon: 'Blocks'
  },
  'programming': {
    path: '/thumbnails/programming.svg',
    gradient: 'from-blue-500 to-cyan-500',
    icon: 'Code'
  },
  'design': {
    path: '/thumbnails/design.svg',
    gradient: 'from-pink-500 to-purple-500',
    icon: 'Palette'
  },
  'business': {
    path: '/thumbnails/business.svg',
    gradient: 'from-blue-500 to-indigo-500',
    icon: 'BarChart'
  },
  'mathematics': {
    path: '/thumbnails/mathematics.svg',
    gradient: 'from-green-500 to-emerald-500',
    icon: 'Calculator'
  },
  'science': {
    path: '/thumbnails/science.svg',
    gradient: 'from-cyan-500 to-blue-500',
    icon: 'Atom'
  },
  'language': {
    path: '/thumbnails/language.svg',
    gradient: 'from-yellow-500 to-orange-500',
    icon: 'Languages'
  },
  'physics': {
    path: '/thumbnails/physics.svg',
    gradient: 'from-blue-500 to-indigo-500',
    icon: 'Atom'
  },
  'chemistry': {
    path: '/thumbnails/chemistry.svg',
    gradient: 'from-green-500 to-teal-500',
    icon: 'Beaker'
  },
  'biology': {
    path: '/thumbnails/biology.svg',
    gradient: 'from-emerald-500 to-green-500',
    icon: 'Leaf'
  },
  'computer science': {
    path: '/thumbnails/computer-science.svg',
    gradient: 'from-blue-500 to-purple-500',
    icon: 'Cpu'
  },
  'computer-science': {
    path: '/thumbnails/computer-science.svg',
    gradient: 'from-blue-500 to-purple-500',
    icon: 'Cpu'
  },
  'literature': {
    path: '/thumbnails/literature.svg',
    gradient: 'from-amber-500 to-red-500',
    icon: 'BookOpen'
  },
  'history': {
    path: '/thumbnails/history.svg',
    gradient: 'from-orange-500 to-red-500',
    icon: 'Clock'
  },
  'economics': {
    path: '/thumbnails/economics.svg',
    gradient: 'from-green-500 to-lime-500',
    icon: 'DollarSign'
  },
  'document': {
    path: '/thumbnails/document.svg',
    gradient: 'from-blue-500 to-indigo-500',
    icon: 'FileText'
  },
  'video': {
    path: '/thumbnails/video.svg',
    gradient: 'from-red-500 to-pink-500',
    icon: 'Video'
  },
  'other': {
    path: '/thumbnails/other.svg',
    gradient: 'from-slate-500 to-gray-500',
    icon: 'FileText'
  }
};

/**
 * Get the thumbnail configuration for a given subject category
 * @param category The subject category
 * @returns The thumbnail configuration
 */
export function getSubjectThumbnail(category: string): ThumbnailConfig {
  // Normalize the category name
  const normalizedCategory = category.toLowerCase().trim();
  
  // Handle special case for computer science (with or without hyphen)
  if (normalizedCategory === 'computer science' || normalizedCategory === 'computer-science') {
    return SUBJECT_THUMBNAILS['computer-science'];
  }
  
  // Return the configuration for the category or the default one
  return SUBJECT_THUMBNAILS[normalizedCategory] || SUBJECT_THUMBNAILS['other'];
}

/**
 * Generate a fallback thumbnail with a gradient background and subject icon
 * @param category The subject category
 * @returns CSS classes for the gradient background
 */
export function getSubjectGradient(category: string): string {
  const config = getSubjectThumbnail(category);
  return `bg-gradient-to-br ${config.gradient}`;
}

/**
 * Get the icon name for a subject category
 * @param category The subject category
 * @returns The icon name
 */
export function getSubjectIcon(category: string): string {
  const config = getSubjectThumbnail(category);
  return config.icon;
} 