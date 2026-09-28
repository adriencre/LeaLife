// ═══════════════════════════════════════════
// Initial empty state for LeaLife production
// ═══════════════════════════════════════════

export function getSeedData() {
  return {
    events: [],
    tasks: [],
    goals: [],
    reminders: [],
    internships: [],
    brainDump: [],
    settings: {
      name: 'Léa',
      bio: 'Mon petit espace personnel ♡',
      theme: 'light',
      notifications: false,
      installed: false,
    },
  };
}
