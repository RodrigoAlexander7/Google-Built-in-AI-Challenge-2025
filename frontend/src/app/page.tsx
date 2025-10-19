'use client';

import { useState } from 'react';
import Summarizer from "./pages/Summarizer"
import Template from './pages/Template';
export default function Home() {
  
  return (
    <Template>
      <Summarizer />
    </Template>
  );
}