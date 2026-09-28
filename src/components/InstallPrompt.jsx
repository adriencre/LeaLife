import { useState, useEffect } from 'react';
import { storage } from '../utils/helpers';

export default function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already dismissed or installed
    const dismissed = storage.get('installDismissed');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone;

    if (dismissed || isStandalone) return;

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);

    // Show after a delay for iOS (no beforeinstallprompt event)
    if (iOS) {
      const timer = setTimeout(() => setShow(true), 5000);
      return () => clearTimeout(timer);
    }

    // Listen for beforeinstallprompt on Android/Desktop
    const handlePrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShow(true), 3000);
    };
    window.addEventListener('beforeinstallprompt', handlePrompt);
    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShow(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    storage.set('installDismissed', true);
  };

  if (!show) return null;

  return (
    <div className="install-prompt">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
        <span style={{ fontSize: 28 }}>🌸</span>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 'var(--text-md)', marginBottom: 4 }}>
            Emporte LéaBloom avec toi ♡
          </h3>
          {isIOS ? (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
              Appuie sur{' '}
              <span style={{ fontSize: 16 }}>⎙</span>{' '}
              puis <strong>"Sur l'écran d'accueil"</strong>
            </p>
          ) : (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
              Ajoute-la à ton écran d'accueil
            </p>
          )}
        </div>
        <button
          onClick={handleDismiss}
          style={{ color: 'var(--text-muted)', fontSize: 18, padding: 8, margin: -8 }}
        >
          ×
        </button>
      </div>
      {!isIOS && deferredPrompt && (
        <button
          className="btn btn-primary btn-full"
          onClick={handleInstall}
          style={{ marginTop: 'var(--space-md)' }}
        >
          Installer ✨
        </button>
      )}
    </div>
  );
}
