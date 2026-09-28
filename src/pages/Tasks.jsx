import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, haptic, isToday, isThisWeek } from '../utils/helpers';
import './Tasks.css';

function TaskItem({ task, celebrateId, onToggle, onDelete, onToggleSubtask }) {
  const [showActions, setShowActions] = useState(false);
  
  return (
    <div 
      className={`task-item ${task.completed ? 'completed' : ''} ${celebrateId === task.id ? 'celebrating' : ''}`}
    >
      <div className="task-item-main" onClick={() => setShowActions(!showActions)}>
        <div className="checkbox-wrapper" onClick={(e) => { e.stopPropagation(); onToggle(task.id); }}>
          <input type="checkbox" checked={task.completed} readOnly />
          <div className="checkbox-circle" />
        </div>
        <div className="task-item-content">
          <span className="task-item-title">{task.title}</span>
          {task.description && (
            <span className="task-item-desc">{task.description}</span>
          )}
          <div className="task-item-meta">
            <span className={`cat-tag cat-${task.category}`} style={{ fontSize: '11px', padding: '2px 8px' }}>
              {CATEGORIES[task.category]?.icon} {CATEGORIES[task.category]?.label}
            </span>
            {task.priority === 'high' && <span className="task-priority-badge">!</span>}
          </div>
        </div>
      </div>
      
      {/* Subtasks */}
      {task.subtasks?.length > 0 && (
        <div className="task-subtasks">
          {task.subtasks.map(st => (
            <div key={st.id} className="task-subtask-item">
              <div className="checkbox-wrapper" style={{ width: 18, height: 18 }} onClick={() => {
                haptic('light');
                onToggleSubtask(task.id, st.id);
              }}>
                <input type="checkbox" checked={st.completed} readOnly />
                <div className="checkbox-circle" style={{ width: 18, height: 18, borderWidth: 1.5 }} />
              </div>
              <span className={`task-subtask-title ${st.completed ? 'done' : ''}`}>{st.title}</span>
            </div>
          ))}
        </div>
      )}

      {showActions && (
        <div className="task-actions animate-fade-in">
          <button className="task-action-btn delete" onClick={() => onDelete(task.id)}>
            Supprimer
          </button>
        </div>
      )}

      {/* Celebration */}
      {celebrateId === task.id && (
        <div className="task-celebrate">
          <span className="task-celebrate-icon">🌸</span>
          <span className="task-celebrate-icon star">✨</span>
        </div>
      )}
    </div>
  );
}

function TaskGroup({ title, tasks, emptyText, celebrateId, onToggle, onDelete, onToggleSubtask }) {
  return (
    <div className="task-group">
      <h3 className="section-title">{title}</h3>
      {tasks.length > 0 ? (
        <div className="task-list">
          {tasks.map(t => (
            <TaskItem 
              key={t.id} 
              task={t} 
              celebrateId={celebrateId} 
              onToggle={onToggle} 
              onDelete={onDelete} 
              onToggleSubtask={onToggleSubtask} 
            />
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-lg)', color: 'var(--text-tertiary)' }}>
          <p style={{ fontSize: 'var(--text-sm)' }}>{emptyText}</p>
        </div>
      )}
    </div>
  );
}

export default function Tasks() {
  const { state, dispatch } = useApp();
  const [filter, setFilter] = useState('all');
  const [celebrateId, setCelebrateId] = useState(null);
  const timerRef = useRef(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter tasks
  const filteredTasks = state.tasks.filter(t => {
    if (filter === 'all') return true;
    return t.category === filter;
  });

  // Group tasks
  const todayTasks = filteredTasks.filter(t => t.date === todayStr);
  const weekTasks = filteredTasks.filter(t => t.date && t.date !== todayStr && isThisWeek(t.date));
  const laterTasks = filteredTasks.filter(t => !t.date || (!isToday(t.date) && !isThisWeek(t.date)));

  const handleToggle = (id) => {
    const task = state.tasks.find(t => t.id === id);
    if (task && !task.completed) {
      haptic('success');
      setCelebrateId(id);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCelebrateId(null), 1200);
    } else {
      haptic('light');
    }
    dispatch({ type: 'TOGGLE_TASK', payload: id });
  };

  const handleDelete = (id) => {
    haptic('medium');
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const handleToggleSubtask = (taskId, subtaskId) => {
    dispatch({ type: 'TOGGLE_SUBTASK', payload: { taskId, subtaskId } });
  };

  return (
    <div className="page tasks-page" id="page-tasks">
      <header className="page-header">
        <h1 style={{ fontSize: 'var(--text-2xl)' }}>Tâches ✓</h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 4 }}>
          {state.tasks.filter(t => !t.completed).length} en cours
        </p>
      </header>

      {/* Category Filter */}
      <div className="tasks-filters">
        <button
          className={`tasks-filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Tout
        </button>
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <button
            key={key}
            className={`tasks-filter-btn ${filter === key ? 'active' : ''}`}
            onClick={() => setFilter(key)}
            style={filter === key ? { background: `var(--cat-${key})`, color: `var(--cat-${key}-text)` } : {}}
          >
            {cat.icon}
          </button>
        ))}
      </div>

      {/* Task Groups */}
      <TaskGroup 
        title="Aujourd'hui" 
        tasks={todayTasks} 
        emptyText="Rien pour aujourd'hui ✨" 
        celebrateId={celebrateId} 
        onToggle={handleToggle} 
        onDelete={handleDelete} 
        onToggleSubtask={handleToggleSubtask} 
      />
      <TaskGroup 
        title="Cette semaine" 
        tasks={weekTasks} 
        emptyText="Semaine libre ♡" 
        celebrateId={celebrateId} 
        onToggle={handleToggle} 
        onDelete={handleDelete} 
        onToggleSubtask={handleToggleSubtask} 
      />
      <TaskGroup 
        title="Plus tard" 
        tasks={laterTasks} 
        emptyText="Rien de prévu" 
        celebrateId={celebrateId} 
        onToggle={handleToggle} 
        onDelete={handleDelete} 
        onToggleSubtask={handleToggleSubtask} 
      />
    </div>
  );
}
