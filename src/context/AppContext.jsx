import { createContext, useContext, useReducer, useEffect } from 'react';
import { storage, generateId } from '../utils/helpers';
import { getSeedData } from '../data/seedData';

const AppContext = createContext();

// ─── Initial State ───
function getInitialState() {
  // Clear any legacy leabloom data from older versions
  try {
    localStorage.removeItem('leabloom_appState');
  } catch {
    // Ignore in private browsing
  }

  const saved = storage.get('appState');
  if (saved) {
    // Ensure no legacy mock data is present
    const hasMock = saved.events?.some(e => e.id === 'ev1') || saved.goals?.some(g => g.id === 'gl1');
    if (!hasMock) {
      return saved;
    }
  }

  const seed = getSeedData();
  storage.set('appState', seed);
  return seed;
}

// ─── Reducer ───
function appReducer(state, action) {
  let newState;

  switch (action.type) {
    // ── Tasks ──
    case 'ADD_TASK':
      newState = {
        ...state,
        tasks: [...state.tasks, { ...action.payload, id: generateId() }],
      };
      break;

    case 'UPDATE_TASK':
      newState = {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };
      break;

    case 'TOGGLE_TASK':
      newState = {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload
            ? { ...t, completed: !t.completed }
            : t
        ),
      };
      break;

    case 'DELETE_TASK':
      newState = {
        ...state,
        tasks: state.tasks.filter(t => t.id !== action.payload),
      };
      break;

    case 'TOGGLE_SUBTASK':
      newState = {
        ...state,
        tasks: state.tasks.map(t => {
          if (t.id === action.payload.taskId) {
            return {
              ...t,
              subtasks: t.subtasks.map(st =>
                st.id === action.payload.subtaskId
                  ? { ...st, completed: !st.completed }
                  : st
              ),
            };
          }
          return t;
        }),
      };
      break;

    // ── Events ──
    case 'ADD_EVENT':
      newState = {
        ...state,
        events: [...state.events, { ...action.payload, id: generateId() }],
      };
      break;

    case 'UPDATE_EVENT':
      newState = {
        ...state,
        events: state.events.map(e =>
          e.id === action.payload.id ? { ...e, ...action.payload } : e
        ),
      };
      break;

    case 'DELETE_EVENT':
      newState = {
        ...state,
        events: state.events.filter(e => e.id !== action.payload),
      };
      break;

    // ── Goals ──
    case 'ADD_GOAL':
      newState = {
        ...state,
        goals: [...state.goals, { ...action.payload, id: generateId() }],
      };
      break;

    case 'TOGGLE_GOAL':
      newState = {
        ...state,
        goals: state.goals.map(g =>
          g.id === action.payload
            ? { ...g, completed: !g.completed }
            : g
        ),
      };
      break;

    case 'DELETE_GOAL':
      newState = {
        ...state,
        goals: state.goals.filter(g => g.id !== action.payload),
      };
      break;

    case 'RESET_GOALS':
      newState = {
        ...state,
        goals: state.goals.map(g => ({ ...g, completed: false })),
      };
      break;

    // ── Reminders ──
    case 'ADD_REMINDER':
      newState = {
        ...state,
        reminders: [...state.reminders, { ...action.payload, id: generateId() }],
      };
      break;

    case 'DISMISS_REMINDER':
      newState = {
        ...state,
        reminders: state.reminders.map(r =>
          r.id === action.payload ? { ...r, dismissed: true } : r
        ),
      };
      break;

    case 'DELETE_REMINDER':
      newState = {
        ...state,
        reminders: state.reminders.filter(r => r.id !== action.payload),
      };
      break;

    // ── Brain Dump ──
    case 'ADD_BRAIN_DUMP':
      newState = {
        ...state,
        brainDump: [...state.brainDump, { id: generateId(), text: action.payload, createdAt: new Date().toISOString() }],
      };
      break;

    case 'DELETE_BRAIN_DUMP':
      newState = {
        ...state,
        brainDump: state.brainDump.filter(b => b.id !== action.payload),
      };
      break;

    case 'CLEAR_BRAIN_DUMP':
      newState = {
        ...state,
        brainDump: [],
      };
      break;

    // ── Internships ──
    case 'ADD_INTERNSHIP':
      newState = {
        ...state,
        internships: [...state.internships, { ...action.payload, id: generateId() }],
      };
      break;

    case 'UPDATE_INTERNSHIP':
      newState = {
        ...state,
        internships: state.internships.map(i =>
          i.id === action.payload.id ? { ...i, ...action.payload } : i
        ),
      };
      break;

    case 'DELETE_INTERNSHIP':
      newState = {
        ...state,
        internships: state.internships.filter(i => i.id !== action.payload),
      };
      break;

    // ── Settings ──
    case 'UPDATE_SETTINGS':
      newState = {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
      break;

    default:
      return state;
  }

  // Persist to localStorage
  storage.set('appState', newState);
  return newState;
}

// ─── Provider ───
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, null, getInitialState);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'lealife_appState' && e.newValue) {
        // Reload state from storage
        window.location.reload();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// ─── Hook ───
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
