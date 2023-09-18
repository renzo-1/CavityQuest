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
  ShowPatientInfo,
  Authentication,
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
      <Router>
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
              <Route path="/:clinic/detection/:id" element={<Detection />} />
              <Route path="/:clinic/records" element={<Records />} />
              <Route
                path="/:clinic/records/:id"
                element={<ShowPatientInfo />}
              />
            </Routes>
          </AppProvider>
        </AuthProvider>
      </Router>
    </>
  );
}
