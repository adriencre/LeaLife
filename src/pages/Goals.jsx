import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, haptic } from '../utils/helpers';
import './Goals.css';

export default function Goals() {
  const { state, dispatch } = useApp();
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState('personal');

  const totalGoals = state.goals.length;
  const completedGoals = state.goals.filter(g => g.completed).length;
  const progress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  // Group by category
  const grouped = {};
  state.goals.forEach(g => {
    if (!grouped[g.category]) grouped[g.category] = [];
    grouped[g.category].push(g);
  });

  const handleToggle = (id) => {
    const goal = state.goals.find(g => g.id === id);
    if (goal && !goal.completed) {
      haptic('success');
    } else {
      haptic('light');
    }
    dispatch({ type: 'TOGGLE_GOAL', payload: id });
  };

  const handleAddGoal = () => {
    if (!newGoalTitle.trim()) return;
    haptic('success');
    dispatch({
      type: 'ADD_GOAL',
      payload: { title: newGoalTitle.trim(), category: newGoalCategory, completed: false },
    });
    setNewGoalTitle('');
    setShowAddGoal(false);
  };

  const isSunday = new Date().getDay() === 0;

  return (
    <div className="page goals-page" id="page-goals">
      <header className="page-header">
        <h1 style={{ fontSize: 'var(--text-2xl)' }}>Objectifs 🎯</h1>
        <p className="goals-subtitle script-text">This week ♡</p>
      </header>

      {/* Sunday Reset */}
      {isSunday && (
        <div className="goals-sunday-card card animate-scale-in">
          <span className="goals-sunday-emoji">🌙</span>
          <h3>Sunday reset ♡</h3>
          <p>On prépare ta semaine ?</p>
          <button className="btn btn-secondary" onClick={() => {
            haptic('medium');
            dispatch({ type: 'RESET_GOALS' });
          }}>
            Réinitialiser ✨
          </button>
        </div>
      )}

      {/* Progress */}
      <div className="card goals-progress-card">
        <div className="goals-progress-header">
          <span className="goals-progress-label">Progression globale</span>
          <span className="goals-progress-count">{completedGoals} / {totalGoals}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        {progress === 100 && totalGoals > 0 && (
          <div className="goals-complete-msg animate-scale-in">
            <span>🎉</span> Bravo {state.settings.name || 'Léa'} ! Tous les objectifs sont terminés ♡
          </div>
        )}
      </div>

      {/* Empty State */}
      {totalGoals === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl) var(--space-lg)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-lg)' }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 'var(--space-sm)' }}>🎯</span>
          <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-xs)' }}>Aucun objectif pour le moment</p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Commence ta semaine du bon pied en ajoutant tes objectifs ♡</p>
        </div>
      )}

      {/* Goals by Category */}
      {Object.entries(grouped).map(([cat, goals]) => (
        <section key={cat} className="goals-category-section">
          <div className="goals-category-header">
            <span className={`cat-tag cat-${cat}`}>
              {CATEGORIES[cat]?.icon} {CATEGORIES[cat]?.label}
            </span>
            <span className="goals-category-count">
              {goals.filter(g => g.completed).length}/{goals.length}
            </span>
          </div>
          <div className="goals-list">
            {goals.map(goal => (
              <div
                key={goal.id}
                className={`goals-item ${goal.completed ? 'completed' : ''}`}
              >
                <div className="checkbox-wrapper" onClick={() => handleToggle(goal.id)}>
                  <input type="checkbox" checked={goal.completed} readOnly />
                  <div className="checkbox-circle" />
                </div>
                <span className="goals-item-title">{goal.title}</span>
                <button
                  className="goals-item-delete"
                  onClick={() => {
                    haptic('light');
                    dispatch({ type: 'DELETE_GOAL', payload: goal.id });
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Add Goal */}
      <button
        className="goals-add-btn"
        onClick={() => setShowAddGoal(true)}
      >
        + Ajouter un objectif
      </button>

      {/* Add Goal Bottom Sheet */}
      {showAddGoal && (
        <>
          <div className="bottom-sheet-overlay active" onClick={() => setShowAddGoal(false)} />
          <div className="bottom-sheet active">
            <div className="bottom-sheet-handle" />
            <h3 style={{ marginBottom: 'var(--space-lg)', textAlign: 'center' }}>Nouvel objectif ✨</h3>
            <div className="form-group">
              <input
                className="form-input"
                placeholder="Mon objectif..."
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label">Catégorie</label>
              <div className="quick-add-categories" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <button
                    key={key}
                    className="cat-tag"
                    onClick={() => setNewGoalCategory(key)}
                    style={{
                      background: newGoalCategory === key ? `var(--cat-${key})` : 'var(--cream)',
                      color: newGoalCategory === key ? `var(--cat-${key}-text)` : 'var(--text-tertiary)',
                    }}
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              className="btn btn-primary btn-full"
              onClick={handleAddGoal}
              disabled={!newGoalTitle.trim()}
            >
              Ajouter ♡
            </button>
          </div>
        </>
      )}
    </div>
  );
}
