import { NavLink, useLocation } from 'react-router-dom';
import './BottomNav.css';

const navItems = [
  { path: '/', label: 'Accueil', icon: 'home' },
  { path: '/planning', label: 'Planning', icon: 'calendar' },
  { path: '/tasks', label: 'Tâches', icon: 'check' },
  { path: '/goals', label: 'Objectifs', icon: 'target' },
  { path: '/me', label: 'Moi', icon: 'heart' },
];

function NavIcon({ type, active }) {
  const color = active ? 'var(--pink-400)' : 'var(--text-muted)';
  
  switch (type) {
    case 'home':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
          <path d="M9 21V12h6v9"/>
        </svg>
      );
    case 'calendar':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <path d="M16 2v4M8 2v4M3 10h18"/>
          <circle cx="8" cy="15" r="1.5" fill={active ? color : 'none'}/>
        </svg>
      );
    case 'check':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9"/>
          <path d="M9 12l2 2 4-4" strokeWidth="2"/>
        </svg>
      );
    case 'target':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9"/>
          <circle cx="12" cy="12" r="5"/>
          <circle cx="12" cy="12" r="1.5" fill={active ? color : 'none'}/>
        </svg>
      );
    case 'heart':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? color : 'none'} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      );
    default:
      return null;
  }
}

export default function BottomNav({ onAddClick }) {
  const location = useLocation();

  return (
    <>
      {/* FAB positioned above the nav */}
      <button
        className="bottom-nav-fab"
        onClick={onAddClick}
        aria-label="Ajouter"
        id="btn-quick-add"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      </button>

      <nav className="bottom-nav" id="bottom-nav">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
              id={`nav-${item.icon}`}
            >
              <NavIcon type={item.icon} active={isActive} />
              <span className="bottom-nav-label">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
