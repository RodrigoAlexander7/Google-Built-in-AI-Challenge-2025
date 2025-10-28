'use client';

import React, { useState } from 'react';
import FlashCard from './FlashCard';
import FlashCardModal from './FlashCardModal';
import ConfirmationModal from './ConfirmationModal';
import { FlashCardData } from '@/types/FlashCardData';
interface FlashCardContainerProps {
  /** Lista inicial de cartas (puede venir desde mockFlashCards o estar vacía) */
  initialCards?: FlashCardData[];
}

const FlashCardContainer: React.FC<FlashCardContainerProps> = ({ initialCards = [] }) => {
  const [cards, setCards] = useState<FlashCardData[]>(initialCards);
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
      id: Date.now().toString(),
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
      const updated = cards.filter(card => card.id !== currentCard.id);
      setCards(updated);
      setCurrentCardIndex((prev) => Math.max(0, prev - 1));
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
    <div id="fc-container" className="min-h-[60vh] bg-gray-50 py-8 rounded-2xl shadow-inner">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Flashcards</h1>
          <div className="flex space-x-3">
            <button
              onClick={openEditModal}
              disabled={!currentCard}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Editar
            </button>
            <button
              onClick={openDeleteModal}
              disabled={!currentCard}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              Eliminar
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Crear
            </button>
          </div>
        </div>

        {/* Selector de cartas */}
        {cards.length > 0 ? (
          <>
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

            {/* Área principal */}
            <div className="flex items-center justify-center space-x-6">
              {/* Botón Anterior */}
              <button
                onClick={handlePrevCard}
                disabled={cards.length <= 1}
                className="p-3 rounded-full bg-white shadow-md hover:shadow-lg disabled:opacity-50"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* FlashCard principal */}
              {currentCard && (
                <FlashCard
                  card={currentCard}
                  isFlipped={isFlipped}
                  onFlip={() => setIsFlipped(!isFlipped)}
                />
              )}

              {/* Botón Siguiente */}
              <button
                onClick={handleNextCard}
                disabled={cards.length <= 1}
                className="p-3 rounded-full bg-white shadow-md hover:shadow-lg disabled:opacity-50"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Contador */}
            <div className="text-center mt-6 text-gray-600">
              {currentCardIndex + 1} / {cards.length}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 mt-12 text-lg">
            No hay flashcards en este grupo aún.
          </p>
        )}
      </div>

      {/* Modales */}
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
