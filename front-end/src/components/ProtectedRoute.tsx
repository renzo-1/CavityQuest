import { useAuthContext } from 'features/AuthContext';
import { Navigate } from 'react-router-dom';
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { auth, setAuth } = useAuthContext() as AuthContextType;

  if (!auth) {
    console.log(auth);
    return <Navigate to="/auth" replace={true} />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
