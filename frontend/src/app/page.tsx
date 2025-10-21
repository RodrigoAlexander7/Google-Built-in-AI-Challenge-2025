'use client';

import Template from './pages/Template';
import Practice from './pages/Practice';

import FlashCardPage from './pages/FlashCardPage';
import { GameOne, GameTwo } from './components/ReactGameComponents';

export default function Home() {
  return (
    <Template>
      <GameTwo />
    </Template>
  );
}