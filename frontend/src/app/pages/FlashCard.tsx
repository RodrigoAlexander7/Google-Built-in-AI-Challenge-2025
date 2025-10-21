import React from 'react';
import FlashCardContainer from "../components/layout/FlashCardContainer";

const FlashCard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <FlashCardContainer />
    </div>
  );
};

export default FlashCard;