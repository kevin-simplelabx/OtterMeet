import { createContext, useContext, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { api } from './api.js';
import Landing from './pages/Landing.jsx';
import { Login, Signup } from './pages/Auth.jsx';
import Portal from './pages/Portal.jsx';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function App() {
  const [host, setHost] = useState(undefined); // undefined = still checking

  useEffect(() => {
    api('/auth/me').then((d) => setHost(d.host)).catch(() => setHost(null));
  }, []);

  return (
    <AuthContext.Provider value={{ host, setHost }}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
        <Route path="/signup" element={<GuestOnly><Signup /></GuestOnly>} />
        <Route path="/portal/*" element={<RequireHost><Portal /></RequireHost>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthContext.Provider>
  );
}

function RequireHost({ children }) {
  const { host } = useAuth();
  const location = useLocation();
  if (host === undefined) return null;
  if (!host) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}

function GuestOnly({ children }) {
  const { host } = useAuth();
  if (host === undefined) return null;
  if (host) return <Navigate to="/portal" replace />;
  return children;
}
