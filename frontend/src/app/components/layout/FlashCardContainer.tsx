import React, { useState } from 'react';
import FlashCard, { FlashCardData } from './FlashCard';
import FlashCardModal from './FlashCardModal';
import ConfirmationModal from './ConfirmationModal';

const FlashCardContainer: React.FC = () => {
  const [cards, setCards] = useState<FlashCardData[]>([
    {
      id: '1',
      front: { text: 'Fe 001', color: '#ffffff' },
      back: { text: 'Respuesta 001', color: '#f3f4f6' }
    },
    {
      id: '2',
      front: { text: 'Fe 002', color: '#ffffff' },
      back: { text: 'Respuesta 002', color: '#f3f4f6' }
    },
    {
      id: '3',
      front: { text: 'Fe 003', color: '#ffffff' },
      back: { text: 'Respuesta 003', color: '#f3f4f6' }
    },
    {
      id: '4',
      front: { text: 'Fe 004', color: '#ffffff' },
      back: { text: 'Respuesta 004', color: '#f3f4f6' }
    }
  ]);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState<FlashCardData | null>(null);

  const currentCard = cards[currentCardIndex];

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleCreateCard = (cardData: Omit<FlashCardData, 'id'>) => {
    const newCard: FlashCardData = {
      ...cardData,
      id: Date.now().toString()
    };
    setCards([...cards, newCard]);
  };

  const handleEditCard = (cardData: Omit<FlashCardData, 'id'>) => {
    if (cardToEdit) {
      setCards(cards.map(card => 
        card.id === cardToEdit.id 
          ? { ...cardData, id: cardToEdit.id }
          : card
      ));
    }
  };

  const handleDeleteCard = () => {
    if (currentCard) {
      setCards(cards.filter(card => card.id !== currentCard.id));
      if (currentCardIndex >= cards.length - 1) {
        setCurrentCardIndex(Math.max(0, cards.length - 2));
      }
      setIsDeleteModalOpen(false);
    }
  };

  const openEditModal = () => {
    setCardToEdit(currentCard);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with actions */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Flashcards</h1>
          <div className="flex space-x-3">
            <button
              onClick={openEditModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Editar
            </button>
            <button
              onClick={openDeleteModal}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Eliminar
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Crear
            </button>
          </div>
        </div>

        {/* Card selector menu */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-white rounded-lg shadow-sm p-2">
            {cards.map((card, index) => (
              <button
                key={card.id}
                onClick={() => {
                  setCurrentCardIndex(index);
                  setIsFlipped(false);
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  index === currentCardIndex
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {card.front.text}
              </button>
            ))}
          </div>
        </div>

        {/* Main card area */}
        <div className="flex items-center justify-center space-x-6">
          {/* Previous button */}
          <button
            onClick={handlePrevCard}
            className="p-3 rounded-full bg-white shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            disabled={cards.length <= 1}
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* FlashCard */}
          {currentCard && (
            <FlashCard
              card={currentCard}
              isFlipped={isFlipped}
              onFlip={() => setIsFlipped(!isFlipped)}
            />
          )}

          {/* Next button */}
          <button
            onClick={handleNextCard}
            className="p-3 rounded-full bg-white shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            disabled={cards.length <= 1}
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Card counter */}
        <div className="text-center mt-6 text-gray-600">
          {currentCardIndex + 1} / {cards.length}
        </div>
      </div>

      {/* Modals */}
      <FlashCardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateCard}
        mode="create"
      />

      <FlashCardModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditCard}
        card={cardToEdit}
        mode="edit"
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCard}
        title="Eliminar Flashcard"
        message="¿Estás seguro de que quieres eliminar esta flashcard? Esta acción no se puede deshacer."
      />
    </div>
  );
};

export default FlashCardContainer;