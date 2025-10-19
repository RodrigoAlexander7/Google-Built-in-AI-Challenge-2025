'use client';

import { useState } from 'react';
import Summarizer from "./pages/Summarizer"

export default function Home() {
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Summarizer/>
    </div>
  );
}