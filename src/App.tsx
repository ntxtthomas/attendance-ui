import { useState, useEffect } from 'react';
import { attendanceApi, authToken } from './api/attendanceApi';
import './App.css';
import SignInPage from './pages/SignInPage';
import AttendancePage from './pages/AttendancePage';

type AuthStatus = 'checking' | 'signedOut' | 'signedIn';

function App() {
  const [authStatus, setAuthStatus] = useState<AuthStatus>('checking');

  const handleSignOut = async () => {
    try {
      await attendanceApi.signOut();
    } catch {
    } finally {
      authToken.clear();
      setAuthStatus('signedOut');
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (!authToken.get()) {
        setAuthStatus('signedOut');
        return;
      }
      try {
        await attendanceApi.me();
        setAuthStatus('signedIn');
      } catch {
        authToken.clear();
        setAuthStatus('signedOut');
      }
    };
    checkAuth();
  }, []);

  if (authStatus === 'checking') return <p>Loading...</p>;
  if (authStatus === 'signedOut') return <SignInPage onSignInSuccess={() => setAuthStatus('signedIn')} />;

  return (
    <>
      <AttendancePage onSignOut={handleSignOut} />
    </>
  );
}

export default App;
