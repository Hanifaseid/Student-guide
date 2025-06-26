import React, { useState } from 'react';

const ReadingTrainer = ({ darkMode }) => {
  const passages = [
    {
      id: 1,
      title: 'The Science of Sleep',
      content: 'Sleep is a naturally recurring state of mind and body, characterized by altered consciousness, relatively inhibited sensory activity, reduced muscle activity and inhibition of nearly all voluntary muscles during rapid eye movement (REM) sleep, and reduced interactions with surroundings. It is distinguished from wakefulness by a decreased ability to react to stimuli, but more reactive than a coma or disorders of consciousness, with sleep displaying very different and active brain patterns.',
      questions: [
        {
          id: 1,
          text: 'What characterizes the state of sleep?',
          options: [
            'Increased muscle activity',
            'Enhanced sensory activity',
            'Altered consciousness',
            'Greater interaction with surroundings'
          ],
          correctAnswer: 2
        },
        {
          id: 2,
          text: 'How is sleep distinguished from wakefulness?',
          options: [
            'By increased ability to react to stimuli',
            'By decreased ability to react to stimuli',
            'By complete lack of consciousness',
            'By constant muscle movement'
          ],
          correctAnswer: 1
        }
      ]
    },
    {
      id: 2,
      title: 'Photosynthesis Process',
      content: 'Photosynthesis is a process used by plants and other organisms to convert light energy into chemical energy that can later be released to fuel the organisms\' activities. This chemical energy is stored in carbohydrate molecules, such as sugars, which are synthesized from carbon dioxide and water – hence the name photosynthesis, from the Greek "phōs" (light) and "synthesis" (putting together). In most cases, oxygen is also released as a waste product.',
      questions: [
        {
          id: 3,
          text: 'What is the primary purpose of photosynthesis?',
          options: [
            'To produce oxygen for humans',
            'To convert light energy into chemical energy',
            'To create water from hydrogen and oxygen',
            'To absorb carbon dioxide from the atmosphere'
          ],
          correctAnswer: 1
        },
        {
          id: 4,
          text: 'What are the main byproducts of photosynthesis?',
          options: [
            'Carbon dioxide and water',
            'Oxygen and sugars',
            'Nitrogen and proteins',
            'Minerals and vitamins'
          ],
          correctAnswer: 1
        }
      ]
    }
  ];
  
  const [activePassage, setActivePassage] = useState(passages[0]);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [difficultWords, setDifficultWords] = useState([]);

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers({
      ...answers,
      [questionId]: answerIndex
    });
  };

  const checkAnswers = () => {
    setShowResults(true);
  };

  const resetQuiz = () => {
    setAnswers({});
    setShowResults(false);
  };

  const selectPassage = (passage) => {
    setActivePassage(passage);
    resetQuiz();
  };

  const highlightWord = (word) => {
    // In a real app, you would look up the word definition from an API
    alert(`Definition of "${word}": This would show the dictionary definition in a real application.`);
  };

  const calculateScore = () => {
    const totalQuestions = activePassage.questions.length;
    const correctAnswers = activePassage.questions.filter(
      question => answers[question.id] === question.correctAnswer
    ).length;
    return Math.round((correctAnswers / totalQuestions) * 100);
  };

  // Simple word complexity detection (for demo purposes)
  const handleWordClick = (e) => {
    const word = e.target.innerText;
    if (word.length > 8 && !difficultWords.includes(word)) { // Arbitrary length threshold
      setDifficultWords([...difficultWords, word]);
      highlightWord(word);
    }
  };

  return (
    <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
      <h2 className="text-2xl font-bold mb-6">Reading Comprehension Trainer</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-4`}>
            <h3 className="font-semibold mb-3">Select Passage</h3>
            <div className="space-y-2">
              {passages.map(passage => (
                <button
                  key={passage.id}
                  onClick={() => selectPassage(passage)}
                  className={`w-full text-left p-2 rounded ${activePassage.id === passage.id ? 
                    (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') : 
                    (darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-200')}`}
                >
                  {passage.title}
                </button>
              ))}
            </div>
          </div>
          
          {difficultWords.length > 0 && (
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <h3 className="font-semibold mb-3">Difficult Words</h3>
              <div className="flex flex-wrap gap-2">
                {difficultWords.map((word, index) => (
                  <span 
                    key={index} 
                    onClick={() => highlightWord(word)}
                    className={`px-2 py-1 rounded cursor-pointer ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-2">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-4`}>
            <h3 className="font-semibold text-xl mb-2">{activePassage.title}</h3>
            <div 
              className={`prose max-w-none mb-4 ${darkMode ? 'prose-invert' : ''}`}
              onClick={(e) => {
                if (e.target.tagName === 'SPAN') {
                  handleWordClick(e);
                }
              }}
              dangerouslySetInnerHTML={{ 
                __html: activePassage.content.split(' ').map(word => {
                  const isDifficult = difficultWords.includes(word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ''));
                  return isDifficult ? 
                    `<span class="${darkMode ? 'text-yellow-300 cursor-help' : 'text-yellow-600 cursor-help'}" style="border-bottom: 1px dotted ${darkMode ? '#d1d5db' : '#4b5563'}">${word}</span>` : 
                    word + ' ';
                }).join(' ')
              }}
            />
          </div>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <h3 className="font-semibold mb-3">Comprehension Questions</h3>
            
            <div className="space-y-4">
              {activePassage.questions.map(question => (
                <div 
                  key={question.id} 
                  className={`p-3 rounded ${darkMode ? 'bg-gray-600' : 'bg-white'} border ${darkMode ? 'border-gray-500' : 'border-gray-200'}`}
                >
                  <p className="font-medium mb-2">{question.text}</p>
                  
                  <div className="space-y-2">
                    {question.options.map((option, index) => {
                      const isSelected = answers[question.id] === index;
                      const isCorrect = index === question.correctAnswer;
                      const showCorrect = showResults && isCorrect;
                      const showIncorrect = showResults && isSelected && !isCorrect;
                      
                      return (
                        <label 
                          key={index} 
                          className={`flex items-center p-2 rounded cursor-pointer ${
                            showCorrect ? (darkMode ? 'bg-green-800' : 'bg-green-100') :
                            showIncorrect ? (darkMode ? 'bg-red-800' : 'bg-red-100') :
                            isSelected ? (darkMode ? 'bg-blue-700' : 'bg-blue-100') :
                            darkMode ? 'hover:bg-gray-500' : 'hover:bg-gray-100'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            checked={isSelected}
                            onChange={() => handleAnswer(question.id, index)}
                            disabled={showResults}
                            className="mr-2"
                          />
                          {option}
                          {showCorrect && <span className="ml-2">✓</span>}
                          {showIncorrect && <span className="ml-2">✗</span>}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            
            {!showResults ? (
              <button
                onClick={checkAnswers}
                disabled={Object.keys(answers).length < activePassage.questions.length}
                className={`mt-4 px-4 py-2 rounded ${Object.keys(answers).length < activePassage.questions.length ? 
                  (darkMode ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-300 cursor-not-allowed') : 
                  (darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600')} text-white`}
              >
                Check Answers
              </button>
            ) : (
              <div className="mt-4">
                <div className={`p-3 rounded mb-4 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                  <p className="font-semibold">Your Score: {calculateScore()}%</p>
                  <p className="mt-1">
                    {calculateScore() >= 80 ? 'Excellent!' : 
                     calculateScore() >= 60 ? 'Good job!' : 
                     'Keep practicing!'}
                  </p>
                </div>
                <button
                  onClick={resetQuiz}
                  className={`px-4 py-2 rounded ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingTrainer;