import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Template from '../pages/Template';
import Summarizer from '../pages/SummarizerPage';
import Practice from '../pages/PracticePage';
import FlashCardPage from '../pages/FlashCardPage';
import LearningPath from '../pages/LearningPathPage';
import LearnPlay from '../pages/LearnPlayPage';

// Placeholder simple page for routes not yet implemented
const Placeholder = ({ title }) => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
      <p className="text-gray-500">Contenido próximamente.</p>
    </div>
  </div>
);

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home -> redirect to Practice for now */}
        <Route path="/" element={<Navigate to="/practice" replace />} />

        {/* Main features */}
        <Route path="/summarizer" element={<Template><Placeholder title="Summarizer" /></Template>} />
        <Route path="/practice" element={<Template><Practice /></Template>} />
        <Route path="/flashcards" element={<Template><FlashCardPage /></Template>} />
        <Route path="/learning-path" element={<Template><LearningPath /></Template>} />
        <Route path="/learn-play" element={<Template><Placeholder title="Learn & Play" /></Template>} />

        {/* Additional menu items (placeholders) */}
        <Route path="/community" element={<Template><Placeholder title="Community" /></Template>} />
        <Route path="/mindmapper" element={<Template><Placeholder title="MindMapper IA" /></Template>} />
        <Route path="/analytics" element={<Template><Placeholder title="IA Analytics" /></Template>} />
        <Route path="/exam" element={<Template><Placeholder title="Exam" /></Template>} />

        {/* Auth (placeholders) */}
        <Route path="/login" element={<Template><Placeholder title="Login" /></Template>} />
        <Route path="/register" element={<Template><Placeholder title="Get Started" /></Template>} />

        {/* Legal (placeholders) */}
        <Route path="/privacy" element={<Template><Placeholder title="Privacidad" /></Template>} />
        <Route path="/terms" element={<Template><Placeholder title="Términos" /></Template>} />
        <Route path="/cookies" element={<Template><Placeholder title="Cookies" /></Template>} />

        {/* 404 */}
        <Route path="*" element={<Template><Placeholder title="404 - Página no encontrada" /></Template>} />
      </Routes>
    </BrowserRouter>
  );
}
