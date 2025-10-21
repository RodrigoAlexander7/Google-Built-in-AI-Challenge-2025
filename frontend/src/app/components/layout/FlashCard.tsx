import React from 'react';

export interface FlashCardData {
  id: string;
  front: {
    text: string;
    color: string;
  };
  back: {
    text: string;
    color: string;
  };
}

interface FlashCardProps {
  card: FlashCardData;
  isFlipped: boolean;
  onFlip: () => void;
}

const FlashCard: React.FC<FlashCardProps> = ({ card, isFlipped, onFlip }) => {
  return (
    <div 
      className="w-80 h-48 cursor-pointer perspective-1000"
      onClick={onFlip}
    >
      <div className={`relative w-full h-full transition-transform duration-600 transform-style-preserve-3d ${
        isFlipped ? 'rotate-y-180' : ''
      }`}>
        {/* Front side */}
        <div 
          className="absolute w-full h-full backface-hidden rounded-xl shadow-lg border border-gray-200 flex items-center justify-center p-6"
          style={{ backgroundColor: card.front.color }}
        >
          <p className="text-lg font-medium text-center text-gray-800">
            {card.front.text}
          </p>
        </div>
        
        {/* Back side */}
        <div 
          className="absolute w-full h-full backface-hidden rounded-xl shadow-lg border border-gray-200 flex items-center justify-center p-6 rotate-y-180"
          style={{ backgroundColor: card.back.color }}
        >
          <p className="text-lg font-medium text-center text-gray-800">
            {card.back.text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FlashCard;