import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, FiCalendar, FiBook, FiClock, FiFilter, FiSearch, FiChevronDown, FiChevronUp, FiRefreshCw } from 'react-icons/fi';

const ExamCountdown = ({ darkMode }) => {
  // [Previous state and effect hooks remain the same...]

  const motivationalQuotes = [
    "The secret of getting ahead is getting started. - Mark Twain",
    "You don't have to be great to start, but you have to start to be great. - Zig Ziglar",
    "The expert in anything was once a beginner. - Helen Hayes",
    "Success is the sum of small efforts, repeated day in and day out. - Robert Collier",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "You are never too old to set another goal or to dream a new dream. - C.S. Lewis"
  ];

  const [currentQuote, setCurrentQuote] = useState(
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  const changeQuote = () => {
    setCurrentQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
  };

  // [Rest of the component code remains the same until the return statement...]

  return (
    <div className={`min-h-screen p-4 md:p-8 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <div className={`max-w-7xl mx-auto rounded-xl overflow-hidden shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="p-6 md:p-8">
          {/* [Previous header and content remains the same...] */}
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left sidebar - Organized Sections */}
            <div className="lg:col-span-1 space-y-4">
              {/* Add New Exam Section (same as before) */}
              
              {/* Filters Section (same as before) */}
              
              {/* Removed the old motivation section from here */}
            </div>
            
            {/* Main content - Exams List and Details */}
            <div className="lg:col-span-3 space-y-6 relative">
              {/* Exams List (same as before) */}
              
              {/* Exam Detail View (same as before) */}
              
              {/* New Floating Motivation Section */}
              <div className="fixed bottom-6 right-6 z-10 w-72">
                <div 
                  className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 transform ${
                    expandedSections.motivation ? 'translate-y-0' : 'translate-y-40'
                  } ${darkMode ? 'bg-indigo-800' : 'bg-indigo-600'} text-white`}
                >
                  <div 
                    className={`p-3 flex justify-between items-center cursor-pointer ${darkMode ? 'hover:bg-indigo-700' : 'hover:bg-indigo-500'}`}
                    onClick={() => toggleSection('motivation')}
                  >
                    <h3 className="font-semibold flex items-center">
                      <FiBook className="mr-2" /> Daily Motivation
                    </h3>
                    <div className="flex items-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          changeQuote();
                        }}
                        className="p-1 rounded-full hover:bg-indigo-400 hover:bg-opacity-30 mr-1"
                        aria-label="Refresh quote"
                      >
                        <FiRefreshCw size={14} />
                      </button>
                      {expandedSections.motivation ? <FiChevronDown /> : <FiChevronUp />}
                    </div>
                  </div>
                  
                  {expandedSections.motivation && (
                    <div className="p-4">
                      <div className="italic mb-3 text-indigo-100">
                        "{currentQuote}"
                      </div>
                      <div className="flex justify-end">
                        <button 
                          onClick={changeQuote}
                          className={`px-3 py-1 rounded-lg text-sm font-medium flex items-center ${
                            darkMode ? 'bg-indigo-700 hover:bg-indigo-600' : 'bg-indigo-500 hover:bg-indigo-400'
                          }`}
                        >
                          <FiRefreshCw className="mr-1" /> New Quote
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamCountdown;