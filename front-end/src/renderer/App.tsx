import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Landing, Menu, Detection, Records, ShowPatientInfo } from 'pages';
import AppProvider from 'features/AppContext';

export default function App() {
  return (
    <>
      <AppProvider>
        <Landing />
        <Router>
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/detection" element={<Detection />} />
            <Route path="/records" element={<Records />} />
            <Route path="/records/:id" element={<ShowPatientInfo />} />
          </Routes>
        </Router>
      </AppProvider>
    </>
  );
}
