// ═══════════════════════════════════════════
// Local Storage Utility for LéaBloom
// ═══════════════════════════════════════════

const STORAGE_PREFIX = 'leabloom_';

export const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove(key) {
    localStorage.removeItem(STORAGE_PREFIX + key);
  },

  clear() {
    Object.keys(localStorage)
      .filter(k => k.startsWith(STORAGE_PREFIX))
      .forEach(k => localStorage.removeItem(k));
  }
};

// Generate unique IDs
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// Date helpers
export function formatDate(date, locale = 'fr-FR') {
  return new Date(date).toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function formatTime(date) {
  return new Date(date).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function isToday(date) {
  const d = new Date(date);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

export function isThisWeek(date) {
  const d = new Date(date);
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1);
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  return d >= startOfWeek && d <= endOfWeek;
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
}

export function getDayName(date, locale = 'fr-FR') {
  return new Date(date).toLocaleDateString(locale, { weekday: 'long' });
}

export function getMonthName(date, locale = 'fr-FR') {
  return new Date(date).toLocaleDateString(locale, { month: 'long' });
}

// Category helpers
export const CATEGORIES = {
  internship: { label: 'Stage', icon: '🏥', color: 'sage' },
  studies: { label: 'Études', icon: '🎓', color: 'lavender' },
  basketball: { label: 'Basket', icon: '🏀', color: 'peach' },
  personal: { label: 'Personnel', icon: '♡', color: 'pink' },
  appointment: { label: 'RDV', icon: '📅', color: 'blue' },
  home: { label: 'Maison', icon: '🏠', color: 'butter' },
};

export const PRIORITIES = {
  high: { label: 'Haute', color: 'var(--pink-400)' },
  medium: { label: 'Moyenne', color: 'var(--butter-300)' },
  low: { label: 'Basse', color: 'var(--sage-300)' },
};

// Haptic feedback
export function haptic(type = 'light') {
  if ('vibrate' in navigator) {
    switch (type) {
      case 'light': navigator.vibrate(10); break;
      case 'medium': navigator.vibrate(25); break;
      case 'heavy': navigator.vibrate(50); break;
      case 'success': navigator.vibrate([10, 50, 10]); break;
    }
  }
}
