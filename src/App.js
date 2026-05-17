import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SplashScreen from './pages/SplashScreen';
import HomeScreen from './pages/HomeScreen';
import TemplateSelection from './pages/TemplateSelection';
import BiodataForm from './pages/BiodataForm';
import PreviewScreen from './pages/PreviewScreen';
import EditorScreen from './pages/EditorScreen';

function App() {
  return (
    <Router>
      <Routes>
        {/* ── Public website ── */}
        <Route path="/" element={<LandingPage />} />

        {/* ── App (the biodata maker) ── */}
        <Route path="/app" element={<SplashScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/templates" element={<TemplateSelection />} />
        <Route path="/form" element={<BiodataForm />} />
        <Route path="/preview" element={<PreviewScreen />} />
        <Route path="/editor" element={<EditorScreen />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;