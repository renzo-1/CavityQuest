import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

interface AppProps {
  children?: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  return useContext(AuthContext);
};

const AuthProvider: React.FC<AppProps> = ({ children }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState<Auth>();

  useEffect(() => {
    onAuthStateChanged(getAuth(), (user) => {
      if (!user && !navigator.onLine) {
        navigate('/auth');
      }
      if (user && user.emailVerified) {
        setAuth({
          uid: user.uid,
          email: user.email || '',
        });
        navigate('/');
      } else {
        navigate('/auth');
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
