'use client';

import Template from './pages/Template';
import Practice from './pages/Practice';

import FlashCardPage from './pages/FlashCardPage';
import { GameOne, GameTwo, GameThree} from './components/ReactGameComponents';

export default function Home() {
  return (
    <Template>
      <GameThree />
    </Template>
  );
}