import { useNavigate } from 'react-router-dom';

// Redirect pages that point to the Me page sections
export function InternshipPage() {
  const navigate = useNavigate();
  // Navigate to Me page and trigger internship section
  // For now, redirect to /me
  window.history.replaceState(null, '', '/me');
  navigate('/me', { replace: true });
  return null;
}

export function StudiesPage() {
  const navigate = useNavigate();
  window.history.replaceState(null, '', '/me');
  navigate('/me', { replace: true });
  return null;
}

export function BasketballPage() {
  const navigate = useNavigate();
  window.history.replaceState(null, '', '/me');
  navigate('/me', { replace: true });
  return null;
}
