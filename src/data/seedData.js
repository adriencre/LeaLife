// ═══════════════════════════════════════════
// Default seed data for LéaBloom
// ═══════════════════════════════════════════

export function getSeedData() {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  // Helper to create date strings
  const makeDate = (daysOffset, hours = 0, minutes = 0) => {
    const d = new Date(today);
    d.setDate(d.getDate() + daysOffset);
    d.setHours(hours, minutes, 0, 0);
    return d.toISOString();
  };

  return {
    events: [
      {
        id: 'ev1',
        title: 'Stage — Médecine interne',
        category: 'internship',
        date: makeDate(0, 7, 0),
        endDate: makeDate(0, 15, 0),
        location: 'CHU',
        notes: '',
      },
      {
        id: 'ev2',
        title: 'Temps libre',
        category: 'personal',
        date: makeDate(0, 15, 0),
        endDate: makeDate(0, 19, 30),
        notes: '',
      },
      {
        id: 'ev3',
        title: 'Basket — Entraînement',
        category: 'basketball',
        date: makeDate(0, 19, 30),
        endDate: makeDate(0, 21, 0),
        location: 'Gymnase Municipal',
        notes: '',
      },
      {
        id: 'ev4',
        title: 'Stage — Médecine interne',
        category: 'internship',
        date: makeDate(1, 7, 0),
        endDate: makeDate(1, 15, 0),
        location: 'CHU',
        notes: '',
      },
      {
        id: 'ev5',
        title: 'Cours — Pharmacologie',
        category: 'studies',
        date: makeDate(2, 8, 0),
        endDate: makeDate(2, 12, 0),
        location: 'IFSI',
        notes: '',
      },
      {
        id: 'ev6',
        title: 'Basket — Match',
        category: 'basketball',
        date: makeDate(3, 15, 0),
        endDate: makeDate(3, 17, 0),
        location: 'Salle des Sports',
        notes: 'Convocation !',
      },
      {
        id: 'ev7',
        title: 'Rendez-vous médecin',
        category: 'appointment',
        date: makeDate(4, 10, 30),
        endDate: makeDate(4, 11, 0),
        location: 'Cabinet Dr. Martin',
        notes: '',
      },
    ],

    tasks: [
      {
        id: 'tk1',
        title: 'Envoyer le dossier de stage',
        description: 'Envoyer par email le dossier complété',
        category: 'internship',
        priority: 'high',
        date: todayStr,
        completed: false,
        subtasks: [],
      },
      {
        id: 'tk2',
        title: 'Réviser pharmacologie',
        description: 'Chapitres 4 à 6',
        category: 'studies',
        priority: 'medium',
        date: todayStr,
        completed: false,
        subtasks: [
          { id: 'st1', title: 'Chapitre 4', completed: true },
          { id: 'st2', title: 'Chapitre 5', completed: false },
          { id: 'st3', title: 'Chapitre 6', completed: false },
        ],
      },
      {
        id: 'tk3',
        title: 'Préparer mon sac',
        description: 'Affaires de sport + tenue de stage',
        category: 'personal',
        priority: 'low',
        date: todayStr,
        completed: false,
        subtasks: [],
      },
      {
        id: 'tk4',
        title: 'Rendre le devoir UE 2.11',
        description: '',
        category: 'studies',
        priority: 'high',
        date: new Date(today.getTime() + 3 * 86400000).toISOString().split('T')[0],
        completed: false,
        subtasks: [],
      },
      {
        id: 'tk5',
        title: 'Acheter des crampons',
        description: 'Décathlon ou en ligne',
        category: 'basketball',
        priority: 'low',
        date: '',
        completed: false,
        subtasks: [],
      },
    ],

    goals: [
      {
        id: 'gl1',
        title: 'Finir mon devoir',
        category: 'studies',
        completed: true,
      },
      {
        id: 'gl2',
        title: 'Réviser 3 chapitres',
        category: 'studies',
        completed: false,
      },
      {
        id: 'gl3',
        title: 'Valider 2 compétences',
        category: 'internship',
        completed: true,
      },
      {
        id: 'gl4',
        title: 'Aller aux 2 entraînements',
        category: 'basketball',
        completed: false,
      },
      {
        id: 'gl5',
        title: 'Prendre une soirée pour moi',
        category: 'personal',
        completed: true,
      },
      {
        id: 'gl6',
        title: 'Ranger ma chambre',
        category: 'home',
        completed: true,
      },
    ],

    reminders: [
      {
        id: 'rm1',
        text: 'Apporter le document signé lundi',
        date: makeDate(1, 7, 0),
        dismissed: false,
      },
    ],

    internships: [
      {
        id: 'int1',
        name: 'Médecine interne',
        service: 'Médecine interne',
        facility: 'CHU',
        address: '',
        startDate: makeDate(-5),
        endDate: makeDate(20),
        tutor: 'Mme Dupont',
        phone: '',
        notes: '',
        schedule: {
          monday: { start: '07:00', end: '15:00' },
          tuesday: { start: '07:00', end: '15:00' },
          wednesday: null,
          thursday: { start: '13:00', end: '21:00' },
          friday: { start: '07:00', end: '15:00' },
          saturday: null,
          sunday: null,
        },
      },
    ],

    brainDump: [],

    settings: {
      name: 'Léa',
      theme: 'light',
      notifications: false,
      installed: false,
    },
  };
}
