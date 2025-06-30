import React, { useState, useEffect } from 'react';
import { FiRotateCw, FiPlus, FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi';

const FlashcardApp = ({ darkMode }) => {
  // Load cards from localStorage if available
  const [cards, setCards] = useState(() => {
    const savedCards = localStorage.getItem('flashcards');
    return savedCards ? JSON.parse(savedCards) : [
      { id: 1, front: 'React', back: 'A JavaScript library for building user interfaces', flipped: false },
      { id: 2, front: 'Tailwind CSS', back: 'A utility-first CSS framework', flipped: false },
    ];
  });

  const [newCard, setNewCard] = useState({ front: '', back: '' });
  const [editingId, setEditingId] = useState(null);
  const [editCard, setEditCard] = useState({ front: '', back: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [studyMode, setStudyMode] = useState(false);
  const [currentStudyIndex, setCurrentStudyIndex] = useState(0);

  // Save cards to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('flashcards', JSON.stringify(cards));
  }, [cards]);

  const flipCard = (id) => {
    setCards(cards.map(card => 
      card.id === id ? { ...card, flipped: !card.flipped } : card
    ));
  };

  const addCard = () => {
    if (newCard.front.trim() && newCard.back.trim()) {
      setCards([...cards, { 
        ...newCard, 
        id: Date.now(), 
        flipped: false,
        createdAt: new Date().toISOString(),
        lastReviewed: null,
        difficulty: 'medium'
      }]);
      setNewCard({ front: '', back: '' });
    }
  };

  const deleteCard = (id) => {
    setCards(cards.filter(card => card.id !== id));
  };

  const startEditing = (card) => {
    setEditingId(card.id);
    setEditCard({ front: card.front, back: card.back });
  };

  const saveEdit = () => {
    setCards(cards.map(card => 
      card.id === editingId ? { ...card, ...editCard } : card
    ));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.front.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         card.back.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'unreviewed') return matchesSearch && !card.lastReviewed;
    if (activeTab === 'difficult') return matchesSearch && card.difficulty === 'hard';
    return matchesSearch;
  });

  const startStudyMode = () => {
    setStudyMode(true);
    setCurrentStudyIndex(0);
  };

  const endStudyMode = () => {
    setStudyMode(false);
  };

  const nextCard = () => {
    setCurrentStudyIndex((prevIndex) => 
      prevIndex >= filteredCards.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevCard = () => {
    setCurrentStudyIndex((prevIndex) => 
      prevIndex <= 0 ? filteredCards.length - 1 : prevIndex - 1
    );
  };

  const markDifficulty = (difficulty) => {
    setCards(cards.map(card => 
      card.id === filteredCards[currentStudyIndex].id ? { 
        ...card, 
        difficulty,
        lastReviewed: new Date().toISOString()
      } : card
    ));
    nextCard();
  };

  return (
    <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg transition-colors duration-200`}>
      <h2 className="text-3xl font-bold mb-6 text-center">Smart Flashcard App</h2>
      
      {studyMode ? (
        <div className="study-mode-container">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={endStudyMode}
              className={`px-4 py-2 cursor-pointer rounded-lg flex items-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
            >
              <FiX className="mr-2" /> Exit Study Mode
            </button>
            <div className="text-lg">
              Card {currentStudyIndex + 1} of {filteredCards.length}
            </div>
          </div>

          {filteredCards.length > 0 ? (
            <div className="study-card-container">
              <div 
                onClick={() => flipCard(filteredCards[currentStudyIndex].id)}
                className={`p-8 rounded-lg cursor-pointer min-h-64 flex items-center justify-center text-center text-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-all shadow-md`}
              >
                {filteredCards[currentStudyIndex].flipped ? 
                  filteredCards[currentStudyIndex].back : 
                  filteredCards[currentStudyIndex].front}
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={prevCard}
                  className={`px-4 py-2 cursor-pointer rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Previous
                </button>
                <div className="difficulty-buttons space-x-2">
                  <button
                    onClick={() => markDifficulty('easy')}
                    className="px-4 py-2 cursor-pointer rounded-lg bg-green-500 hover:bg-green-600 text-white"
                  >
                    Easy
                  </button>
                  <button
                    onClick={() => markDifficulty('medium')}
                    className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => markDifficulty('hard')}
                    className="px-4 py-2 cursor-pointer rounded-lg bg-red-500 hover:bg-red-600 text-white"
                  >
                    Hard
                  </button>
                </div>
                <button
                  onClick={nextCard}
                  className={`px-4 py-2 cursor-pointer rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg">No cards to study with current filters.</p>
              <button
                onClick={endStudyMode}
                className={`mt-4 px-4 py-2 cursor-pointer rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
              >
                Back to Flashcards
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="controls mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="search-container flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search flashcards..."
                  className={`w-full p-3 cursor-pointer rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'} shadow-sm`}
                />
              </div>
              
              <div className="tabs flex space-x-2">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 cursor-pointer rounded-lg ${activeTab === 'all' ? (darkMode ? 'bg-blue-600' : 'bg-blue-500 text-white') : (darkMode ? 'bg-gray-700' : 'bg-gray-200')}`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab('unreviewed')}
                  className={`px-4 py-2 cursor-pointer rounded-lg ${activeTab === 'unreviewed' ? (darkMode ? 'bg-blue-600' : 'bg-blue-500 text-white') : (darkMode ? 'bg-gray-700' : 'bg-gray-200')}`}
                >
                  Unreviewed
                </button>
                <button
                  onClick={() => setActiveTab('difficult')}
                  className={`px-4 py-2 cursor-pointer rounded-lg ${activeTab === 'difficult' ? (darkMode ? 'bg-blue-600' : 'bg-blue-500 text-white') : (darkMode ? 'bg-gray-700' : 'bg-gray-200')}`}
                >
                  Difficult
                </button>
              </div>
              
              <button
                onClick={startStudyMode}
                disabled={filteredCards.length === 0}
                className={`px-4 py-2 cursor-pointer rounded-lg flex items-center ${filteredCards.length === 0 ? 'opacity-50 cursor-not-allowed' : ''} ${darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white`}
              >
                <FiRotateCw className="mr-2" /> Study Mode
              </button>
            </div>
          </div>

          {filteredCards.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg mb-4">No flashcards found.</p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className={`px-4 py-2 cursor-pointer rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredCards.map(card => (
                <div 
                  key={card.id}
                  className={`relative rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                >
                  {editingId === card.id ? (
                    <div className="p-4">
                      <input
                        type="text"
                        value={editCard.front}
                        onChange={(e) => setEditCard({...editCard, front: e.target.value})}
                        className={`w-full p-2 mb-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                      />
                      <input
                        type="text"
                        value={editCard.back}
                        onChange={(e) => setEditCard({...editCard, back: e.target.value})}
                        className={`w-full p-2 mb-3 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={cancelEdit}
                          className={`px-3 py-1 cursor-pointer rounded ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveEdit}
                          className={`px-3 cursor-pointer py-1 rounded ${darkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div 
                        onClick={() => flipCard(card.id)}
                        className={`p-6 cursor-pointer min-h-40 flex items-center justify-center text-center ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                      >
                        {card.flipped ? card.back : card.front}
                      </div>
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); startEditing(card); }}
                          className={`p-2 cursor-pointer rounded-full ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteCard(card.id); }}
                          className={`p-2 cursor-pointer rounded-full ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'} text-red-500`}
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                      {card.difficulty === 'hard' && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                          Difficult
                        </div>
                      )}
                      {card.lastReviewed && (
                        <div className={`absolute bottom-2 left-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Reviewed: {new Date(card.lastReviewed).toLocaleDateString()}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} shadow-md`}>
            <h3 className="font-semibold text-xl mb-4">Add New Flashcard</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-1">Front (question)</label>
                <textarea
                  value={newCard.front}
                  onChange={(e) => setNewCard({...newCard, front: e.target.value})}
                  placeholder="Enter question or term"
                  rows={2}
                  className={`w-full p-3 rounded-lg ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                />
              </div>
              <div>
                <label className="block mb-1">Back (answer)</label>
                <textarea
                  value={newCard.back}
                  onChange={(e) => setNewCard({...newCard, back: e.target.value})}
                  placeholder="Enter answer or definition"
                  rows={2}
                  className={`w-full p-3 rounded-lg ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                />
              </div>
              <button
                onClick={addCard}
                disabled={!newCard.front.trim() || !newCard.back.trim()}
                className={`px-4 py-2 rounded-lg cursor-pointer flex items-center justify-center ${!newCard.front.trim() || !newCard.back.trim() ? 'opacity-50 cursor-not-allowed' : ''} ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
              >
                <FiPlus className="mr-2" /> Add Card
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FlashcardApp;