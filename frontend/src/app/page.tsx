'use client';

import { useState } from 'react';
import Summarizer from "./pages/Summarizer"
import Template from './pages/Template';
import Practice from './pages/Practice';

export default function Home() {
  
  return (
    <Template>
      <Practice/>

    </Template>
  );
}