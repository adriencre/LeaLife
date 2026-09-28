import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { haptic, formatTime } from '../utils/helpers';
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

  // Internship form state
  const [showAddInternship, setShowAddInternship] = useState(false);
  const [newInternship, setNewInternship] = useState({
    name: '',
    service: '',
    facility: '',
    startDate: '',
    endDate: '',
    tutor: '',
  });

  // Sports checklist state (persisted locally)
  const [checklist, setChecklist] = useState([
    { id: '1', label: 'Tenue de sport', done: false },
    { id: '2', label: 'Bouteille d\'eau', done: false },
    { id: '3', label: 'Chaussures de salle', done: false },
    { id: '4', label: 'Serviette', done: false },
  ]);
  const [newCheckItem, setNewCheckItem] = useState('');

  // ── Brain Dump ──
  const handleAddDump = () => {
    if (!dumpText.trim()) return;
    haptic('light');
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

  const handleAddInternshipSubmit = (e) => {
    e.preventDefault();
    if (!newInternship.name.trim()) return;
    haptic('success');
    dispatch({
      type: 'ADD_INTERNSHIP',
      payload: {
        name: newInternship.name.trim(),
        service: newInternship.service.trim() || newInternship.name.trim(),
        facility: newInternship.facility.trim(),
        startDate: newInternship.startDate || new Date().toISOString(),
        endDate: newInternship.endDate || new Date().toISOString(),
        tutor: newInternship.tutor.trim(),
        schedule: {},
      },
    });
    setNewInternship({ name: '', service: '', facility: '', startDate: '', endDate: '', tutor: '' });
    setShowAddInternship(false);
  };

  const studiesTasks = state.tasks.filter(t => t.category === 'studies');
  const studiesEvents = state.events.filter(e => e.category === 'studies');
  const basketTasks = state.tasks.filter(t => t.category === 'basketball');
  const basketEvents = state.events.filter(e => e.category === 'basketball');

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
              <div key={internship.id} className="card me-internship-card" style={{ marginBottom: 'var(--space-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3>{internship.name}</h3>
                  <button
                    className="goals-item-delete"
                    onClick={() => {
                      if (confirm('Supprimer ce stage ?')) {
                        dispatch({ type: 'DELETE_INTERNSHIP', payload: internship.id });
                      }
                    }}
                  >
                    ×
                  </button>
                </div>
                <div className="me-internship-info">
                  {internship.facility && (
                    <div className="me-info-row">
                      <span>🏥</span>
                      <span>{internship.service ? `${internship.service} — ` : ''}{internship.facility}</span>
                    </div>
                  )}
                  {internship.startDate && (
                    <div className="me-info-row">
                      <span>📅</span>
                      <span>
                        {new Date(internship.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                        {internship.endDate ? ` → ${new Date(internship.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}` : ''}
                      </span>
                    </div>
                  )}
                  {internship.tutor && (
                    <div className="me-info-row">
                      <span>👤</span>
                      <span>Tuteur : {internship.tutor}</span>
                    </div>
                  )}
                </div>
                {/* Schedule if defined */}
                {internship.schedule && Object.keys(internship.schedule).length > 0 && (
                  <>
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
                  </>
                )}
              </div>
            ))}

            {state.internships.length === 0 && (
              <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl) var(--space-lg)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-md)' }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 'var(--space-sm)' }}>🏥</span>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-xs)' }}>Aucun stage en cours</p>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Ajoute les informations de ton stage pour retrouver tes horaires et contacts facilement ♡</p>
              </div>
            )}

            <button
              className="btn btn-primary btn-full"
              style={{ marginTop: 'var(--space-sm)' }}
              onClick={() => setShowAddInternship(true)}
            >
              + Ajouter un stage
            </button>

            {/* Add Internship Modal */}
            {showAddInternship && (
              <>
                <div className="bottom-sheet-overlay active" onClick={() => setShowAddInternship(false)} />
                <div className="bottom-sheet active">
                  <div className="bottom-sheet-handle" />
                  <h3 style={{ marginBottom: 'var(--space-lg)', textAlign: 'center' }}>Nouveau stage 🏥</h3>
                  <form onSubmit={handleAddInternshipSubmit}>
                    <div className="form-group">
                      <label className="form-label">Nom du stage / Spécialité</label>
                      <input
                        className="form-input"
                        placeholder="ex: Médecine interne, Pédiatrie..."
                        value={newInternship.name}
                        onChange={(e) => setNewInternship({ ...newInternship, name: e.target.value })}
                        required
                        autoFocus
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Établissement / Service</label>
                      <input
                        className="form-input"
                        placeholder="ex: CHU, Clinique Saint-Jean..."
                        value={newInternship.facility}
                        onChange={(e) => setNewInternship({ ...newInternship, facility: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tuteur / Référent</label>
                      <input
                        className="form-input"
                        placeholder="ex: Mme Dupont..."
                        value={newInternship.tutor}
                        onChange={(e) => setNewInternship({ ...newInternship, tutor: e.target.value })}
                      />
                    </div>
                    <div className="quick-add-row" style={{ display: 'flex', gap: '8px' }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Début</label>
                        <input
                          type="date"
                          className="form-input"
                          value={newInternship.startDate}
                          onChange={(e) => setNewInternship({ ...newInternship, startDate: e.target.value })}
                        />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Fin</label>
                        <input
                          type="date"
                          className="form-input"
                          value={newInternship.endDate}
                          onChange={(e) => setNewInternship({ ...newInternship, endDate: e.target.value })}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary btn-full"
                      style={{ marginTop: 'var(--space-md)' }}
                      disabled={!newInternship.name.trim()}
                    >
                      Enregistrer le stage ✨
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        );

      case 'studies':
        return (
          <div className="me-section-content animate-fade-in-up">
            <div className="me-section-header">
              <button className="me-back-btn" onClick={() => setActiveSection(null)}>← Retour</button>
              <h2>Études & Révisions 🎓</h2>
            </div>

            {/* Courses / Events */}
            {studiesEvents.length > 0 && (
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>Cours & Examens</h4>
                {studiesEvents.map(ev => (
                  <div key={ev.id} className="card" style={{ marginBottom: 'var(--space-xs)', padding: 'var(--space-md)' }}>
                    <div style={{ fontWeight: 600 }}>{ev.title}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 4 }}>
                      📅 {new Date(ev.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                      {ev.location ? ` · 📍 ${ev.location}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tasks / Revisions */}
            {studiesTasks.length > 0 && (
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>Tâches & Devoirs</h4>
                {studiesTasks.map(task => (
                  <div key={task.id} className="card" style={{ marginBottom: 'var(--space-xs)', padding: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="checkbox-wrapper" onClick={() => dispatch({ type: 'TOGGLE_TASK', payload: task.id })}>
                      <input type="checkbox" checked={task.completed} readOnly />
                      <div className="checkbox-circle" />
                    </div>
                    <span style={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'var(--text-tertiary)' : 'var(--text-primary)' }}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {studiesEvents.length === 0 && studiesTasks.length === 0 && (
              <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl) var(--space-lg)', color: 'var(--text-tertiary)' }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 'var(--space-sm)' }}>🎓</span>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-xs)' }}>Aucun cours ou révision</p>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  Utilise le bouton <strong>+</strong> pour programmer tes cours, révisions et devoirs dans la catégorie <em>Études</em> ♡
                </p>
              </div>
            )}
          </div>
        );

      case 'basketball':
        return (
          <div className="me-section-content animate-fade-in-up">
            <div className="me-section-header">
              <button className="me-back-btn" onClick={() => setActiveSection(null)}>← Retour</button>
              <h2>Basket & Sport 🏀</h2>
            </div>

            {/* Events for basket */}
            {basketEvents.length > 0 && (
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>Matchs & Entraînements</h4>
                {basketEvents.map(ev => (
                  <div key={ev.id} className="card me-game-card" style={{ marginBottom: 'var(--space-sm)' }}>
                    <div className="me-game-badge badge badge-peach">Événement</div>
                    <h3 style={{ marginTop: 'var(--space-xs)' }}>{ev.title}</h3>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 4 }}>
                      📅 {new Date(ev.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                      {ev.date ? ` · 🕐 ${formatTime(ev.date)}` : ''}
                    </p>
                    {ev.location && (
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 4 }}>📍 {ev.location}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Tasks for basket */}
            {basketTasks.length > 0 && (
              <div style={{ marginBottom: 'var(--space-md)' }}>
                <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>À faire pour le basket</h4>
                {basketTasks.map(task => (
                  <div key={task.id} className="card" style={{ marginBottom: 'var(--space-xs)', padding: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="checkbox-wrapper" onClick={() => dispatch({ type: 'TOGGLE_TASK', payload: task.id })}>
                      <input type="checkbox" checked={task.completed} readOnly />
                      <div className="checkbox-circle" />
                    </div>
                    <span style={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'var(--text-tertiary)' : 'var(--text-primary)' }}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Checklist */}
            <div className="card" style={{ marginTop: 'var(--space-md)' }}>
              <h4 style={{ marginBottom: 'var(--space-md)' }}>Sac de sport 🎒</h4>
              {checklist.map(item => (
                <div key={item.id} className="me-checklist-item">
                  <div
                    className="checkbox-wrapper"
                    onClick={() => {
                      haptic('light');
                      setChecklist(checklist.map(i => i.id === item.id ? { ...i, done: !i.done } : i));
                    }}
                  >
                    <input type="checkbox" checked={item.done} readOnly />
                    <div className="checkbox-circle" />
                  </div>
                  <span style={{ textDecoration: item.done ? 'line-through' : 'none', color: item.done ? 'var(--text-tertiary)' : 'var(--text-primary)' }}>
                    {item.label}
                  </span>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '8px', marginTop: 'var(--space-md)' }}>
                <input
                  className="form-input"
                  placeholder="Ajouter au sac..."
                  value={newCheckItem}
                  onChange={(e) => setNewCheckItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newCheckItem.trim()) {
                      setChecklist([...checklist, { id: Date.now().toString(), label: newCheckItem.trim(), done: false }]);
                      setNewCheckItem('');
                    }
                  }}
                  style={{ fontSize: 'var(--text-sm)', padding: '6px 12px' }}
                />
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    if (newCheckItem.trim()) {
                      setChecklist([...checklist, { id: Date.now().toString(), label: newCheckItem.trim(), done: false }]);
                      setNewCheckItem('');
                    }
                  }}
                  style={{ fontSize: 'var(--text-xs)', padding: '6px 12px' }}
                >
                  +
                </button>
              </div>
            </div>

            {basketEvents.length === 0 && (
              <div className="card" style={{ marginTop: 'var(--space-md)', textAlign: 'center', padding: 'var(--space-lg)', color: 'var(--text-tertiary)' }}>
                <p style={{ fontSize: 'var(--text-sm)' }}>Aucun match ou entraînement programmé ✨</p>
                <p style={{ fontSize: 'var(--text-xs)', marginTop: 4 }}>Ajoute tes créneaux de sport via le bouton "+" !</p>
              </div>
            )}
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
                placeholder="Idée cadeau...&#10;Penser à appeler...&#10;Acheter du thé..."
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
            {state.brainDump.length > 0 ? (
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
            ) : (
              <div className="card" style={{ marginTop: 'var(--space-md)', textAlign: 'center', padding: 'var(--space-lg)', color: 'var(--text-tertiary)' }}>
                <p style={{ fontSize: 'var(--text-sm)' }}>Aucune note rapide pour le moment ✨</p>
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
                Rendez-vous, souhaits, moments pour soi...
                <br />
                <span className="script-text" style={{ marginTop: 8, display: 'block' }}>Ton espace zen et personnel ♡</span>
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
                  value={state.settings.name || ''}
                  placeholder="Léa"
                  onChange={(e) => dispatch({ type: 'UPDATE_SETTINGS', payload: { name: e.target.value } })}
                />
              </div>
              <div className="form-group" style={{ marginTop: 'var(--space-md)' }}>
                <label className="form-label">Bio / Sous-titre</label>
                <input
                  className="form-input"
                  value={state.settings.bio || ''}
                  placeholder="Mon espace personnel ♡"
                  onChange={(e) => dispatch({ type: 'UPDATE_SETTINGS', payload: { bio: e.target.value } })}
                />
              </div>
            </div>
            <div className="card" style={{ marginTop: 'var(--space-md)' }}>
              <button
                className="me-settings-item"
                style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', gap: '12px', alignItems: 'center', color: 'var(--error)' }}
                onClick={() => {
                  if (confirm('Voulez-vous réinitialiser toutes les données de l\'application ?')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
              >
                <span>🗑️</span>
                <span>Réinitialiser toutes les données</span>
              </button>
            </div>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginTop: 'var(--space-xl)' }}>
              LeaLife v1.0 — Made with ♡
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
          {state.settings.name || 'Léa'} <span style={{ color: 'var(--pink-300)' }}>♡</span>
        </h1>
        <p className="me-subtitle script-text">Mon petit espace</p>
      </header>

      {/* Profile Card */}
      <div className="card me-profile-card">
        <div className="me-avatar">
          <span>🌸</span>
        </div>
        <h3>{state.settings.name || 'Léa'}</h3>
        <p className="me-profile-desc">{state.settings.bio || 'Mon petit espace personnel ♡'}</p>
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
