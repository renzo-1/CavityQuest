import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Landing, Menu, Detection, Records, ShowPatientInfo } from 'pages';
import AppProvider from 'features/AppContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function App() {
  return (
    <>
      <ToastContainer limit={1} />
      <Landing />
      <Router>
        <AppProvider>
          <Routes>
            {/* <Route path="/" element={<Menu />} />
            <Route path="/detection/:id" element={<Detection />} />
            <Route path="/records" element={<Records />} />
            <Route path="/records/:id" element={<ShowPatientInfo />} /> */}
            <Route path="/:clinic?" element={<Menu />} />
            <Route path="/:clinic/detection/:id" element={<Detection />} />
            <Route path="/:clinic/records" element={<Records />} />
            <Route path="/:clinic/records/:id" element={<ShowPatientInfo />} />
          </Routes>
        </AppProvider>
      </Router>
    </>
  );
}
