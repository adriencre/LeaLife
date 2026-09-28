import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { getGreeting, isToday, isThisWeek, CATEGORIES, haptic, formatTime } from '../utils/helpers';
import './Home.css';

function DecoFlower({ className }) {
  return (
    <svg className={`home-deco ${className}`} width="80" height="90" viewBox="0 0 80 90" fill="none">
      {/* Stem */}
      <path d="M40 50 Q38 65 42 85" stroke="#B5CCB8" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Leaves */}
      <path d="M40 60 Q30 50 28 55 Q32 62 40 60Z" fill="#C8DBC9" opacity="0.7"/>
      <path d="M42 70 Q52 62 50 67 Q46 73 42 70Z" fill="#C8DBC9" opacity="0.6"/>
      {/* Petals */}
      <ellipse cx="40" cy="28" rx="12" ry="18" fill="#FFD0DD" opacity="0.6"/>
      <ellipse cx="28" cy="35" rx="12" ry="18" fill="#FFD0DD" opacity="0.5" transform="rotate(-40, 28, 35)"/>
      <ellipse cx="52" cy="35" rx="12" ry="18" fill="#FFD0DD" opacity="0.5" transform="rotate(40, 52, 35)"/>
      <ellipse cx="32" cy="44" rx="11" ry="16" fill="#FFD0DD" opacity="0.4" transform="rotate(-70, 32, 44)"/>
      <ellipse cx="48" cy="44" rx="11" ry="16" fill="#FFD0DD" opacity="0.4" transform="rotate(70, 48, 44)"/>
      {/* Center */}
      <circle cx="40" cy="38" r="6" fill="#FFE4EC"/>
      <circle cx="40" cy="38" r="3.5" fill="#F4A0B8" opacity="0.5"/>
      {/* Ribbon bow */}
      <path d="M35 82 Q28 76 30 80 Q32 84 35 82Z" fill="#F4A0B8" opacity="0.3"/>
      <path d="M45 82 Q52 76 50 80 Q48 84 45 82Z" fill="#F4A0B8" opacity="0.3"/>
    </svg>
  );
}

function SmallHeart({ style }) {
  return (
    <svg style={style} width="12" height="11" viewBox="0 0 12 11" fill="none">
      <path d="M6 2.5C6 0.5 3 -0.5 1.5 1.5C0 3.5 1 5.5 6 9.5C11 5.5 12 3.5 10.5 1.5C9 -0.5 6 0.5 6 2.5Z" fill="#F4A0B8" opacity="0.3"/>
    </svg>
  );
}

function SmallStar({ style }) {
  return (
    <svg style={style} width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M5 0L6.2 3.8L10 5L6.2 6.2L5 10L3.8 6.2L0 5L3.8 3.8L5 0Z" fill="#FFD4C0" opacity="0.4"/>
    </svg>
  );
}

export default function Home() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const now = new Date();

  const greeting = getGreeting();
  const dateStr = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  // Capitalize first letter
  const formattedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  // Today's events sorted by time
  const todayEvents = state.events
    .filter(e => isToday(e.date))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Today's tasks
  const todayTasks = state.tasks.filter(
    t => t.date === now.toISOString().split('T')[0] && !t.completed
  );

  // Weekly goals
  const totalGoals = state.goals.length;
  const completedGoals = state.goals.filter(g => g.completed).length;
  const goalProgress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  // Goals grouped by category
  const goalsByCategory = {};
  state.goals.forEach(g => {
    if (!goalsByCategory[g.category]) goalsByCategory[g.category] = { total: 0, done: 0 };
    goalsByCategory[g.category].total++;
    if (g.completed) goalsByCategory[g.category].done++;
  });

  // Active reminders
  const activeReminders = state.reminders.filter(r => !r.dismissed);

  const handleToggleTask = (id) => {
    haptic('success');
    dispatch({ type: 'TOGGLE_TASK', payload: id });
  };

  const getCategoryClass = (cat) => `cat-${cat}`;
  const getCategoryIcon = (cat) => CATEGORIES[cat]?.icon || '📌';

  return (
    <div className="page home-page" id="page-home">
      {/* Decorative elements */}
      <SmallHeart style={{ position: 'absolute', top: '12%', left: '8%' }} />
      <SmallHeart style={{ position: 'absolute', top: '25%', right: '15%' }} />
      <SmallStar style={{ position: 'absolute', top: '18%', right: '25%' }} />
      <SmallStar style={{ position: 'absolute', top: '45%', left: '5%' }} />
      
      {/* ── Header ── */}
      <header className="home-header animate-fade-in-up">
        <div className="home-header-content">
          <h1 className="home-greeting">
            {greeting},<br />
            {state.settings.name} <span className="home-heart">♡</span>
          </h1>
          <p className="home-date">{formattedDate}</p>
        </div>
        <div className="home-header-deco">
          <img src="/bouquet.jpg" alt="" className="home-flower-img" />
        </div>
      </header>

      {/* Inspirational quote */}
      <div className="home-quote animate-fade-in-up stagger-1">
        <span className="script-text">Petits pas, grands rêves ♡</span>
      </div>

      {/* ── Today's Timeline ── */}
      <section className="section animate-fade-in-up stagger-2">
        <div className="section-header">
          <h2 className="section-title">
            <span>📋</span> Aujourd'hui
          </h2>
          <button className="section-link" onClick={() => navigate('/planning')}>
            Voir tout →
          </button>
        </div>
        <div className="card home-timeline-card">
          {todayEvents.length > 0 ? (
            <div className="home-timeline">
              {todayEvents.map((event, i) => (
                <div key={event.id} className="home-timeline-item">
                  <div className="home-timeline-time">
                    {formatTime(event.date)}
                  </div>
                  <div className="home-timeline-dot-wrapper">
                    <div className={`home-timeline-dot cat-dot-${event.category}`} />
                    {i < todayEvents.length - 1 && (
                      <div className="home-timeline-line" />
                    )}
                  </div>
                  <button 
                    className={`home-timeline-event ${getCategoryClass(event.category)}`}
                    onClick={() => navigate('/planning')}
                  >
                    <span>{getCategoryIcon(event.category)}</span>
                    <span>{event.title}</span>
                    <span className="home-timeline-arrow">›</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="home-empty-day">
              <span>🌸</span>
              <p>Journée libre</p>
            </div>
          )}
          <DecoFlower className="home-timeline-flower" />
        </div>
      </section>

      {/* ── Today's Tasks ── */}
      <section className="section animate-fade-in-up stagger-3">
        <div className="section-header">
          <h2 className="section-title">
            <span>✅</span> Petites choses à faire
          </h2>
          <button className="section-link" onClick={() => navigate('/tasks')}>
            Voir tout →
          </button>
        </div>
        <div className="card">
          {todayTasks.length > 0 ? (
            <div className="home-tasks">
              {todayTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="home-task-item">
                  <div className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTask(task.id)}
                      id={`task-${task.id}`}
                    />
                    <div className="checkbox-circle" />
                  </div>
                  <span className="home-task-title">{task.title}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="home-empty-tasks">
              <span>✨</span>
              <p>Tout est fait ! Bravo ♡</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Weekly Goals ── */}
      <section className="section animate-fade-in-up stagger-4">
        <div className="section-header">
          <h2 className="section-title">
            <span>🎯</span> Objectifs de la semaine
          </h2>
          <span className="home-goal-count">
            {completedGoals} / {totalGoals} terminés
          </span>
        </div>
        <div className="card home-goals-card">
          <div className="progress-bar" style={{ marginBottom: 'var(--space-lg)' }}>
            <div
              className="progress-fill"
              style={{ width: `${goalProgress}%` }}
            />
          </div>
          <div className="home-goals-grid">
            {Object.entries(goalsByCategory).map(([cat, data]) => (
              <button
                key={cat}
                className="home-goal-item"
                onClick={() => navigate('/goals')}
              >
                <div className={`home-goal-icon-wrapper`} style={{ background: `var(--cat-${cat}-bg)` }}>
                  <span>{CATEGORIES[cat]?.icon}</span>
                </div>
                <span className="home-goal-label">{CATEGORIES[cat]?.label}</span>
                <span className="home-goal-progress">{data.done}/{data.total}</span>
              </button>
            ))}
          </div>
          <button className="section-link" style={{ justifyContent: 'flex-end', width: '100%', marginTop: 'var(--space-sm)' }} onClick={() => navigate('/goals')}>
            Détails →
          </button>
        </div>
      </section>

      {/* ── Reminders ── */}
      {activeReminders.length > 0 && (
        <section className="section animate-fade-in-up stagger-5">
          <div className="section-header">
            <h2 className="section-title">
              <span>🔔</span> À ne pas oublier
            </h2>
          </div>
          {activeReminders.map((reminder) => (
            <div key={reminder.id} className="card home-reminder-card">
              <div className="home-reminder-content">
                <p className="home-reminder-text">{reminder.text}</p>
                {reminder.date && (
                  <span className="home-reminder-date">
                    {new Date(reminder.date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}
                  </span>
                )}
              </div>
              <button
                className="home-reminder-dismiss"
                onClick={() => {
                  haptic('light');
                  dispatch({ type: 'DISMISS_REMINDER', payload: reminder.id });
                }}
              >
                📌
              </button>
              <span className="home-reminder-deco script-text">Tu peux le faire ! ♡</span>
            </div>
          ))}
        </section>
      )}

      {/* ── Quick Access ── */}
      <section className="section animate-fade-in-up stagger-6">
        <div className="home-quick-access">
          <button className="home-quick-card" onClick={() => navigate('/internship')} style={{ '--qc-bg': 'var(--sage-50)', '--qc-border': 'var(--sage-200)' }}>
            <span className="home-quick-icon">🏥</span>
            <span className="home-quick-label">Stage</span>
            <span className="home-quick-arrow">→</span>
          </button>
          <button className="home-quick-card" onClick={() => navigate('/studies')} style={{ '--qc-bg': 'var(--lavender-50)', '--qc-border': 'var(--lavender-200)' }}>
            <span className="home-quick-icon">🎓</span>
            <span className="home-quick-label">Études</span>
            <span className="home-quick-arrow">→</span>
          </button>
          <button className="home-quick-card" onClick={() => navigate('/basketball')} style={{ '--qc-bg': 'var(--peach-50)', '--qc-border': 'var(--peach-200)' }}>
            <span className="home-quick-icon">🏀</span>
            <span className="home-quick-label">Basket</span>
            <span className="home-quick-arrow">→</span>
          </button>
          <button className="home-quick-card" onClick={() => navigate('/planning')} style={{ '--qc-bg': 'var(--blue-50)', '--qc-border': 'var(--blue-200)' }}>
            <span className="home-quick-icon">📅</span>
            <span className="home-quick-label">Planning</span>
            <span className="home-quick-arrow">→</span>
          </button>
        </div>
      </section>
    </div>
  );
}
