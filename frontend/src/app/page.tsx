'use client';

import { useState } from 'react';
import Summarizer from "./pages/Summarizer"
import Template from './pages/Template';
import PracticeQuestionBox from './components/layout/PracticeQuestionBox';

export default function Home() {
  
  return (
    <Template>
      <Summarizer />
    </Template>
  );
}