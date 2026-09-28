import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import BottomNav from './components/BottomNav';
import QuickAdd from './components/QuickAdd';
import OfflineIndicator from './components/OfflineIndicator';
import InstallPrompt from './components/InstallPrompt';
import Home from './pages/Home';
import Planning from './pages/Planning';
import Tasks from './pages/Tasks';
import Goals from './pages/Goals';
import Me from './pages/Me';
import './App.css';

function AppContent() {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const location = useLocation();

  return (
    <div className="app-container">
      <OfflineIndicator />
      
      <main className="app-main" key={location.pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/me" element={<Me />} />
          <Route path="/internship" element={<Navigate to="/me" replace />} />
          <Route path="/studies" element={<Navigate to="/me" replace />} />
          <Route path="/basketball" element={<Navigate to="/me" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <BottomNav onAddClick={() => setShowQuickAdd(true)} />
      <QuickAdd isOpen={showQuickAdd} onClose={() => setShowQuickAdd(false)} />
      <InstallPrompt />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
