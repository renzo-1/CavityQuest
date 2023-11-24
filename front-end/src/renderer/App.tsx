import {
  MemoryRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';
import 'tailwindcss/tailwind.css';
import {
  Landing,
  Menu,
  Detection,
  Records,
  PatientRecord,
  Authentication,
  AuditTrails,
} from 'pages';
import { AppProvider, AuthProvider } from 'features';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProtectedRoute } from 'components';

export default function App() {
  return (
    <>
      <Landing />
      <ToastContainer limit={1} />
      <Landing />
      <Router initialEntries={['/clinic/']}>
        <AuthProvider>
          <AppProvider>
            <Routes>
              <Route path="/auth" element={<Authentication />} />

              <Route
                path="/:clinic?"
                element={
                  <ProtectedRoute>
                    <Menu />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/:clinic/detection/:id"
                element={
                  <ProtectedRoute>
                    <Detection />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/:clinic/records"
                element={
                  <ProtectedRoute>
                    <Records />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/:clinic/auditTrails"
                element={
                  <ProtectedRoute>
                    <AuditTrails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/:clinic/records/:id"
                element={
                  <ProtectedRoute>
                    <PatientRecord />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AppProvider>
        </AuthProvider>
      </Router>
    </>
  );
}
