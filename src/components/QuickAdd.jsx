import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, haptic } from '../utils/helpers';
import './QuickAdd.css';

const ADD_TYPES = [
  { type: 'task', label: 'Tâche', icon: '✓', color: 'var(--pink-100)' },
  { type: 'event', label: 'Événement', icon: '📅', color: 'var(--blue-100)' },
  { type: 'goal', label: 'Objectif', icon: '🎯', color: 'var(--butter-100)' },
  { type: 'reminder', label: 'Rappel', icon: '🔔', color: 'var(--lavender-100)' },
  { type: 'braindump', label: 'Note rapide', icon: '💭', color: 'var(--peach-100)' },
];

export default function QuickAdd({ isOpen, onClose }) {
  const { dispatch } = useApp();
  const [selectedType, setSelectedType] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('personal');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    haptic('light');
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    haptic('success');

    const dateStr = date || new Date().toISOString().split('T')[0];

    switch (selectedType) {
      case 'task':
        dispatch({
          type: 'ADD_TASK',
          payload: {
            title: title.trim(),
            description: '',
            category,
            priority,
            date: dateStr,
            completed: false,
            subtasks: [],
          },
        });
        break;
      case 'event':
        dispatch({
          type: 'ADD_EVENT',
          payload: {
            title: title.trim(),
            category,
            date: time
              ? new Date(`${dateStr}T${time}`).toISOString()
              : new Date(dateStr).toISOString(),
            endDate: '',
            location: '',
            notes: '',
          },
        });
        break;
      case 'goal':
        dispatch({
          type: 'ADD_GOAL',
          payload: {
            title: title.trim(),
            category,
            completed: false,
          },
        });
        break;
      case 'reminder':
        dispatch({
          type: 'ADD_REMINDER',
          payload: {
            text: title.trim(),
            date: time
              ? new Date(`${dateStr}T${time}`).toISOString()
              : new Date(dateStr).toISOString(),
            dismissed: false,
          },
        });
        break;
      case 'braindump':
        dispatch({ type: 'ADD_BRAIN_DUMP', payload: title.trim() });
        break;
    }

    // Reset & close
    setTitle('');
    setCategory('personal');
    setDate('');
    setTime('');
    setPriority('medium');
    setSelectedType(null);
    onClose();
  };

  const handleClose = () => {
    setSelectedType(null);
    setTitle('');
    onClose();
  };

  return (
    <>
      <div
        className={`bottom-sheet-overlay ${isOpen ? 'active' : ''}`}
        onClick={handleClose}
      />
      <div className={`bottom-sheet ${isOpen ? 'active' : ''}`}>
        <div className="bottom-sheet-handle" />

        {!selectedType ? (
          <>
            <h3 className="quick-add-title">Créer ✨</h3>
            <div className="quick-add-grid">
              {ADD_TYPES.map((item) => (
                <button
                  key={item.type}
                  className="quick-add-type-btn"
                  onClick={() => handleTypeSelect(item.type)}
                  style={{ '--btn-bg': item.color }}
                >
                  <span className="quick-add-type-icon">{item.icon}</span>
                  <span className="quick-add-type-label">{item.label}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="quick-add-form">
            <div className="quick-add-form-header">
              <button className="quick-add-back" onClick={() => setSelectedType(null)}>
                ← Retour
              </button>
              <h3>
                {ADD_TYPES.find(t => t.type === selectedType)?.icon}{' '}
                {ADD_TYPES.find(t => t.type === selectedType)?.label}
              </h3>
            </div>

            <div className="form-group">
              <input
                className="form-input quick-add-input"
                placeholder={selectedType === 'braindump' ? 'Qu\'est-ce qui te passe par la tête ?' : 'Titre...'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </div>

            {selectedType !== 'braindump' && (
              <>
                <div className="form-group">
                  <label className="form-label">Catégorie</label>
                  <div className="quick-add-categories">
                    {Object.entries(CATEGORIES).map(([key, cat]) => (
                      <button
                        key={key}
                        className={`cat-tag ${category === key ? 'cat-tag-selected' : ''}`}
                        onClick={() => setCategory(key)}
                        style={{
                          background: category === key ? `var(--cat-${key})` : 'var(--cream)',
                          color: category === key ? `var(--cat-${key}-text)` : 'var(--text-tertiary)',
                        }}
                      >
                        {cat.icon} {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedType !== 'goal' && (
                  <div className="quick-add-row">
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Date</label>
                      <input
                        type="date"
                        className="form-input"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                    {(selectedType === 'event' || selectedType === 'reminder') && (
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Heure</label>
                        <input
                          type="time"
                          className="form-input"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                )}

                {selectedType === 'task' && (
                  <div className="form-group">
                    <label className="form-label">Priorité</label>
                    <div className="quick-add-priorities">
                      {['low', 'medium', 'high'].map(p => (
                        <button
                          key={p}
                          className={`quick-add-priority ${priority === p ? 'active' : ''}`}
                          onClick={() => setPriority(p)}
                        >
                          {p === 'low' ? '○' : p === 'medium' ? '◐' : '●'}
                          {' '}
                          {p === 'low' ? 'Basse' : p === 'medium' ? 'Moyenne' : 'Haute'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <button
              className="btn btn-primary btn-full"
              onClick={handleSubmit}
              disabled={!title.trim()}
              id="btn-submit-quick-add"
            >
              Ajouter ✨
            </button>
          </div>
        )}
      </div>
    </>
  );
}
