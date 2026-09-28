import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, haptic } from '../utils/helpers';
import './Me.css';

const SECTIONS = [
  { id: 'internship', icon: '🏥', label: 'Stage', color: 'sage' },
  { id: 'studies', icon: '🎓', label: 'Études', color: 'lavender' },
  { id: 'basketball', icon: '🏀', label: 'Basket', color: 'peach' },
  { id: 'braindump', icon: '💭', label: 'Brain Dump', color: 'pink' },
  { id: 'personal', icon: '♡', label: 'Personnel', color: 'pink' },
  { id: 'settings', icon: '⚙️', label: 'Réglages', color: 'cream' },
];

const SCHEDULE_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS = { monday: 'Lundi', tuesday: 'Mardi', wednesday: 'Mercredi', thursday: 'Jeudi', friday: 'Vendredi', saturday: 'Samedi', sunday: 'Dimanche' };

export default function Me() {
  const { state, dispatch } = useApp();
  const [activeSection, setActiveSection] = useState(null);
  const [dumpText, setDumpText] = useState('');

  // ── Brain Dump ──
  const handleAddDump = () => {
    if (!dumpText.trim()) return;
    haptic('light');
    // Split by newlines for multiple items
    dumpText.split('\n').filter(t => t.trim()).forEach(text => {
      dispatch({ type: 'ADD_BRAIN_DUMP', payload: text.trim() });
    });
    setDumpText('');
  };

  const handleConvertDump = (item) => {
    haptic('success');
    dispatch({
      type: 'ADD_TASK',
      payload: {
        title: item.text,
        description: '',
        category: 'personal',
        priority: 'medium',
        date: new Date().toISOString().split('T')[0],
        completed: false,
        subtasks: [],
      },
    });
    dispatch({ type: 'DELETE_BRAIN_DUMP', payload: item.id });
  };

  // ── Render Sections ──
  const renderSection = () => {
    switch (activeSection) {
      case 'internship':
        return (
          <div className="me-section-content animate-fade-in-up">
            <div className="me-section-header">
              <button className="me-back-btn" onClick={() => setActiveSection(null)}>← Retour</button>
              <h2>Mes Stages 🏥</h2>
            </div>
            {state.internships.map(internship => (
              <div key={internship.id} className="card me-internship-card">
                <h3>{internship.name}</h3>
                <div className="me-internship-info">
                  <div className="me-info-row">
                    <span>🏥</span>
                    <span>{internship.service} — {internship.facility}</span>
                  </div>
                  <div className="me-info-row">
                    <span>📅</span>
                    <span>
                      {new Date(internship.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                      {' → '}
                      {new Date(internship.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                    </span>
                  </div>
                  {internship.tutor && (
                    <div className="me-info-row">
                      <span>👤</span>
                      <span>{internship.tutor}</span>
                    </div>
                  )}
                </div>
                {/* Schedule */}
                <h4 className="me-schedule-title">Planning horaires</h4>
                <div className="me-schedule">
                  {SCHEDULE_DAYS.map(day => (
                    <div key={day} className={`me-schedule-row ${!internship.schedule?.[day] ? 'off' : ''}`}>
                      <span className="me-schedule-day">{DAY_LABELS[day]}</span>
                      <span className="me-schedule-time">
                        {internship.schedule?.[day]
                          ? `${internship.schedule[day].start} → ${internship.schedule[day].end}`
                          : 'Repos'
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {state.internships.length === 0 && (
              <div className="empty-state">
                <span className="empty-state-icon">🏥</span>
                <p className="empty-state-text">Pas de stage en cours</p>
              </div>
            )}
          </div>
        );

      case 'studies':
        return (
          <div className="me-section-content animate-fade-in-up">
            <div className="me-section-header">
              <button className="me-back-btn" onClick={() => setActiveSection(null)}>← Retour</button>
              <h2>Études 🎓</h2>
            </div>
            <div className="card">
              <div className="me-studies-item">
                <div className="me-studies-icon" style={{ background: 'var(--lavender-100)' }}>🪻</div>
                <div>
                  <h4>Pharmacologie</h4>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>Révision : 45 minutes</p>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>Examen : 14 octobre — 14:00</p>
                </div>
              </div>
            </div>
            <div className="card" style={{ marginTop: 'var(--space-sm)' }}>
              <div className="me-studies-item">
                <div className="me-studies-icon" style={{ background: 'var(--sage-100)' }}>📖</div>
                <div>
                  <h4>UE 2.11 — Soins infirmiers</h4>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>Devoir à rendre</p>
                </div>
              </div>
            </div>
            <p className="me-coming-soon script-text">Plus de fonctionnalités bientôt ♡</p>
          </div>
        );

      case 'basketball':
        return (
          <div className="me-section-content animate-fade-in-up">
            <div className="me-section-header">
              <button className="me-back-btn" onClick={() => setActiveSection(null)}>← Retour</button>
              <h2>Basket 🏀</h2>
            </div>
            {/* Next game */}
            <div className="card me-game-card">
              <div className="me-game-badge badge badge-peach">Prochain match</div>
              <h3 style={{ marginTop: 'var(--space-sm)' }}>Dimanche</h3>
              <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)' }}>15:00</p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 4 }}>📍 Salle des Sports</p>
            </div>
            {/* Checklist */}
            <div className="card" style={{ marginTop: 'var(--space-md)' }}>
              <h4 style={{ marginBottom: 'var(--space-md)' }}>Checklist 🎒</h4>
              {['Chaussures', 'Bouteille d\'eau', 'Maillot', 'Serviette', 'Genouillères'].map((item, i) => (
                <div key={i} className="me-checklist-item">
                  <div className="checkbox-wrapper">
                    <input type="checkbox" />
                    <div className="checkbox-circle" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            {/* Trainings */}
            <div className="card" style={{ marginTop: 'var(--space-md)' }}>
              <h4 style={{ marginBottom: 'var(--space-md)' }}>Entraînements</h4>
              <div className="me-training-item">
                <span className="me-training-day">Mardi</span>
                <span className="me-training-time">19:30 — 21:00</span>
              </div>
              <div className="me-training-item">
                <span className="me-training-day">Jeudi</span>
                <span className="me-training-time">19:30 — 21:00</span>
              </div>
            </div>
          </div>
        );

      case 'braindump':
        return (
          <div className="me-section-content animate-fade-in-up">
            <div className="me-section-header">
              <button className="me-back-btn" onClick={() => setActiveSection(null)}>← Retour</button>
              <h2>Brain Dump 💭</h2>
            </div>
            <p className="me-dump-subtitle">Écris tout ce qui te passe par la tête ♡</p>
            <div className="me-dump-input-wrapper">
              <textarea
                className="form-input me-dump-textarea"
                placeholder="acheter shampooing&#10;appeler maman&#10;dossier stage&#10;réviser UE 2.8..."
                value={dumpText}
                onChange={(e) => setDumpText(e.target.value)}
                rows={4}
              />
              <button
                className="btn btn-primary"
                onClick={handleAddDump}
                disabled={!dumpText.trim()}
                style={{ marginTop: 'var(--space-sm)' }}
              >
                Ajouter ✨
              </button>
            </div>
            {state.brainDump.length > 0 && (
              <div className="me-dump-list">
                {state.brainDump.map(item => (
                  <div key={item.id} className="me-dump-item card">
                    <span className="me-dump-text">{item.text}</span>
                    <div className="me-dump-actions">
                      <button
                        className="me-dump-action"
                        onClick={() => handleConvertDump(item)}
                        title="Convertir en tâche"
                      >
                        → Tâche
                      </button>
                      <button
                        className="me-dump-action delete"
                        onClick={() => {
                          haptic('light');
                          dispatch({ type: 'DELETE_BRAIN_DUMP', payload: item.id });
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    haptic('medium');
                    dispatch({ type: 'CLEAR_BRAIN_DUMP' });
                  }}
                  style={{ marginTop: 'var(--space-sm)' }}
                >
                  Tout effacer
                </button>
              </div>
            )}
          </div>
        );

      case 'personal':
        return (
          <div className="me-section-content animate-fade-in-up">
            <div className="me-section-header">
              <button className="me-back-btn" onClick={() => setActiveSection(null)}>← Retour</button>
              <h2>Personnel ♡</h2>
            </div>
            <div className="card">
              <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: 'var(--space-xl)' }}>
                <span style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>💌</span>
                Rendez-vous, anniversaires, idées cadeaux...
                <br />
                <span className="script-text" style={{ marginTop: 8, display: 'block' }}>Bientôt disponible ♡</span>
              </p>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="me-section-content animate-fade-in-up">
            <div className="me-section-header">
              <button className="me-back-btn" onClick={() => setActiveSection(null)}>← Retour</button>
              <h2>Réglages ⚙️</h2>
            </div>
            <div className="card">
              <div className="form-group">
                <label className="form-label">Prénom</label>
                <input
                  className="form-input"
                  value={state.settings.name}
                  onChange={(e) => dispatch({ type: 'UPDATE_SETTINGS', payload: { name: e.target.value } })}
                />
              </div>
            </div>
            <div className="card" style={{ marginTop: 'var(--space-md)' }}>
              <button
                className="me-settings-item"
                onClick={() => {
                  if (confirm('Réinitialiser toutes les données ?')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
              >
                <span>🗑️</span>
                <span>Réinitialiser les données</span>
              </button>
            </div>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-xl)' }}>
              LéaBloom v1.0 — Made with ♡
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  if (activeSection) {
    return <div className="page me-page" id="page-me">{renderSection()}</div>;
  }

  return (
    <div className="page me-page" id="page-me">
      <header className="page-header">
        <h1 style={{ fontSize: 'var(--text-2xl)' }}>
          {state.settings.name} <span style={{ color: 'var(--pink-300)' }}>♡</span>
        </h1>
        <p className="me-subtitle script-text">Mon petit espace</p>
      </header>

      {/* Profile Card */}
      <div className="card me-profile-card">
        <div className="me-avatar">
          <span>🌸</span>
        </div>
        <h3>{state.settings.name}</h3>
        <p className="me-profile-desc">Étudiante infirmière · Basketteuse ♡</p>
      </div>

      {/* Sections Grid */}
      <div className="me-sections-grid">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            className="me-section-btn"
            onClick={() => {
              haptic('light');
              setActiveSection(section.id);
            }}
            style={{ '--section-bg': `var(--${section.color}-50)`, '--section-border': `var(--${section.color}-200)` }}
          >
            <span className="me-section-icon">{section.icon}</span>
            <span className="me-section-label">{section.label}</span>
            <span className="me-section-arrow">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}
