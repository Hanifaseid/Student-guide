import React, { useState } from 'react';
const FlashcardApp = ({ darkMode }) => {
  const [cards, setCards] = useState([
    { id: 1, front: 'React', back: 'A JavaScript library for building user interfaces', flipped: false },
    { id: 2, front: 'Tailwind CSS', back: 'A utility-first CSS framework', flipped: false },
  ]);
  const [newCard, setNewCard] = useState({ front: '', back: '' });

  const flipCard = (id) => {
    setCards(cards.map(card => 
      card.id === id ? { ...card, flipped: !card.flipped } : card
    ));
  };

  const addCard = () => {
    if (newCard.front && newCard.back) {
      setCards([...cards, { ...newCard, id: Date.now(), flipped: false }]);
      setNewCard({ front: '', back: '' });
    }
  };

  return (
    <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
      <h2 className="text-2xl font-bold mb-6">Smart Flashcard App</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map(card => (
          <div 
            key={card.id} 
            onClick={() => flipCard(card.id)}
            className={`p-6 rounded-lg cursor-pointer h-40 flex items-center justify-center text-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
          >
            {card.flipped ? card.back : card.front}
          </div>
        ))}
      </div>

      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        <h3 className="font-semibold mb-3">Add New Flashcard</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={newCard.front}
            onChange={(e) => setNewCard({...newCard, front: e.target.value})}
            placeholder="Front (question)"
            className={`w-full p-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
          />
          <input
            type="text"
            value={newCard.back}
            onChange={(e) => setNewCard({...newCard, back: e.target.value})}
            placeholder="Back (answer)"
            className={`w-full p-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
          />
          <button
            onClick={addCard}
            className={`px-4 py-2 rounded ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
          >
            Add Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardApp;