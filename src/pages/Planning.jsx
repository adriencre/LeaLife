import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, formatTime } from '../utils/helpers';
import './Planning.css';

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const VIEWS = ['Jour', 'Semaine', 'Mois'];

export default function Planning() {
  const { state } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('Jour');
  const [showEventDetail, setShowEventDetail] = useState(null);

  // Build week days
  const weekDays = useMemo(() => {
    const start = new Date(selectedDate);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [selectedDate]);

  // Month calendar grid
  const monthDays = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPad = (firstDay.getDay() + 6) % 7;
    
    const days = [];
    // Padding before
    for (let i = startPad - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({ date: d, inMonth: false });
    }
    // Month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), inMonth: true });
    }
    // Padding after
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        days.push({ date: new Date(year, month + 1, i), inMonth: false });
      }
    }
    return days;
  }, [selectedDate]);

  const isSameDay = (d1, d2) => d1.toDateString() === d2.toDateString();
  const isToday = (d) => isSameDay(d, new Date());

  const getEventsForDate = (date) => {
    return state.events.filter(e => isSameDay(new Date(e.date), date))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const selectedEvents = getEventsForDate(selectedDate);

  const navigateDate = (dir) => {
    const d = new Date(selectedDate);
    if (view === 'Mois') {
      d.setMonth(d.getMonth() + dir);
    } else if (view === 'Semaine') {
      d.setDate(d.getDate() + dir * 7);
    } else {
      d.setDate(d.getDate() + dir);
    }
    setSelectedDate(d);
  };

  const hasEvents = (date) => {
    return state.events.some(e => isSameDay(new Date(e.date), date));
  };

  const getCatColor = (cat) => {
    const colors = {
      internship: 'var(--sage-200)',
      studies: 'var(--lavender-200)',
      basketball: 'var(--peach-200)',
      personal: 'var(--pink-200)',
      appointment: 'var(--blue-200)',
      home: 'var(--butter-200)',
    };
    return colors[cat] || 'var(--pink-200)';
  };

  return (
    <div className="page planning-page" id="page-planning">
      <header className="page-header">
        <h1 style={{ fontSize: 'var(--text-2xl)' }}>Planning 📅</h1>
      </header>

      {/* View Tabs */}
      <div className="tab-bar" style={{ marginBottom: 'var(--space-lg)' }}>
        {VIEWS.map(v => (
          <button
            key={v}
            className={`tab-item ${view === v ? 'active' : ''}`}
            onClick={() => setView(v)}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Date Navigation */}
      <div className="planning-nav">
        <button className="planning-nav-btn" onClick={() => navigateDate(-1)}>‹</button>
        <div className="planning-nav-title">
          {view === 'Jour' && selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          {view === 'Semaine' && `${weekDays[0].getDate()} — ${weekDays[6].getDate()} ${weekDays[6].toLocaleDateString('fr-FR', { month: 'long' })}`}
          {view === 'Mois' && selectedDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </div>
        <button className="planning-nav-btn" onClick={() => navigateDate(1)}>›</button>
        <button className="planning-today-btn" onClick={() => setSelectedDate(new Date())}>
          Aujourd'hui
        </button>
      </div>

      {/* ── Week Strip (Day/Week view) ── */}
      {(view === 'Jour' || view === 'Semaine') && (
        <div className="planning-week-strip">
          {weekDays.map((day, i) => (
            <button
              key={i}
              className={`planning-week-day ${isSameDay(day, selectedDate) ? 'selected' : ''} ${isToday(day) ? 'today' : ''}`}
              onClick={() => setSelectedDate(new Date(day))}
            >
              <span className="planning-week-day-name">{DAYS[i]}</span>
              <span className="planning-week-day-num">{day.getDate()}</span>
              {hasEvents(day) && <span className="planning-week-dot" />}
            </button>
          ))}
        </div>
      )}

      {/* ── Month Calendar ── */}
      {view === 'Mois' && (
        <div className="planning-month">
          <div className="planning-month-header">
            {DAYS.map(d => (
              <span key={d} className="planning-month-day-label">{d}</span>
            ))}
          </div>
          <div className="planning-month-grid">
            {monthDays.map(({ date, inMonth }, i) => (
              <button
                key={i}
                className={`planning-month-day ${!inMonth ? 'outside' : ''} ${isSameDay(date, selectedDate) ? 'selected' : ''} ${isToday(date) ? 'today' : ''}`}
                onClick={() => { setSelectedDate(new Date(date)); setView('Jour'); }}
              >
                <span>{date.getDate()}</span>
                {hasEvents(date) && inMonth && (
                  <div className="planning-month-dots">
                    {getEventsForDate(date).slice(0, 3).map((ev, j) => (
                      <span key={j} className="planning-month-dot" style={{ background: getCatColor(ev.category) }} />
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Day Events ── */}
      {(view === 'Jour' || view === 'Semaine') && (
        <div className="planning-events">
          <h3 className="section-title" style={{ marginBottom: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
            {view === 'Semaine' ? 'Cette semaine' : 'Programme'}
          </h3>
          {(view === 'Semaine'
            ? weekDays.flatMap(d => getEventsForDate(d)).sort((a, b) => new Date(a.date) - new Date(b.date))
            : selectedEvents
          ).length > 0 ? (
            <div className="planning-events-list">
              {(view === 'Semaine'
                ? weekDays.flatMap(d => getEventsForDate(d)).sort((a, b) => new Date(a.date) - new Date(b.date))
                : selectedEvents
              ).map((event) => (
                <button
                  key={event.id}
                  className="planning-event-card"
                  style={{ '--ev-color': getCatColor(event.category) }}
                  onClick={() => setShowEventDetail(event)}
                >
                  <div className="planning-event-color" />
                  <div className="planning-event-info">
                    <span className="planning-event-time">
                      {formatTime(event.date)}
                      {event.endDate && ` — ${formatTime(event.endDate)}`}
                    </span>
                    <span className="planning-event-title">{event.title}</span>
                    {event.location && (
                      <span className="planning-event-location">📍 {event.location}</span>
                    )}
                  </div>
                  <span className="planning-event-cat-icon">
                    {CATEGORIES[event.category]?.icon}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--text-tertiary)' }}>
              <p>🌸 Rien de prévu</p>
              <p style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-xs)' }}>Profite de ta journée ♡</p>
            </div>
          )}
        </div>
      )}

      {/* ── Event Detail Bottom Sheet ── */}
      {showEventDetail && (
        <>
          <div className="bottom-sheet-overlay active" onClick={() => setShowEventDetail(null)} />
          <div className="bottom-sheet active">
            <div className="bottom-sheet-handle" />
            <div className="planning-event-detail">
              <span className="planning-detail-icon">{CATEGORIES[showEventDetail.category]?.icon}</span>
              <h2 style={{ marginBottom: 'var(--space-sm)' }}>{showEventDetail.title}</h2>
              <div className="planning-detail-row">
                <span>🕐</span>
                <span>
                  {formatTime(showEventDetail.date)}
                  {showEventDetail.endDate && ` — ${formatTime(showEventDetail.endDate)}`}
                </span>
              </div>
              <div className="planning-detail-row">
                <span>📅</span>
                <span>{new Date(showEventDetail.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
              </div>
              {showEventDetail.location && (
                <div className="planning-detail-row">
                  <span>📍</span>
                  <span>{showEventDetail.location}</span>
                </div>
              )}
              {showEventDetail.notes && (
                <div className="planning-detail-notes">
                  <p>{showEventDetail.notes}</p>
                </div>
              )}
              <span className={`cat-tag cat-${showEventDetail.category}`} style={{ marginTop: 'var(--space-md)' }}>
                {CATEGORIES[showEventDetail.category]?.icon} {CATEGORIES[showEventDetail.category]?.label}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
