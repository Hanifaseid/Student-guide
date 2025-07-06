import React, { useState, useEffect } from 'react';
import { FiBook, FiCheck, FiX, FiRotateCcw, FiInfo, FiAward, FiClock, FiBarChart2 } from 'react-icons/fi';
const ReadingTrainer  = ({ darkMode = true }) => {

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
          correctAnswer: 2,
          explanation: 'Sleep is characterized by altered consciousness, not increased muscle activity or enhanced sensory awareness.'
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
          correctAnswer: 1,
          explanation: 'Sleep shows decreased reactivity to stimuli compared to wakefulness, but not complete unresponsiveness like in a coma.'
        }
      ],
      readingTime: 2 // in minutes
    },
    {
      id: 2,
      title: 'Photosynthesis Process',
      content: 'Photosynthesis is a process used by plants and other organisms to convert light energy into chemical energy that can later be released to fuel the organisms\' activities. This chemical energy is stored in carbohydrate molecules, such as sugars, which are synthesized from carbon dioxide and water – hence the name photosynthesis, from the Greek "phōs" (light) and "synthesis" (putting together). In most cases, oxygen is also released as a waste product. Most plants, algae, and cyanobacteria perform photosynthesis, and such organisms are called photoautotrophs. Photosynthesis maintains atmospheric oxygen levels and supplies all of the organic compounds and most of the energy necessary for life on Earth.',
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
          correctAnswer: 1,
          explanation: 'While oxygen is a byproduct, the main purpose is energy conversion for the organism.'
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
          correctAnswer: 1,
          explanation: 'The process converts CO2 and water into sugars (chemical energy) and releases oxygen.'
        },
        {
          id: 5,
          text: 'What organisms perform photosynthesis?',
          options: [
            'Only green plants',
            'Plants and some bacteria',
            'Plants, algae, and some bacteria',
            'All living organisms'
          ],
          correctAnswer: 2,
          explanation: 'Photoautotrophs include plants, algae, and cyanobacteria.'
        }
      ],
      readingTime: 3 // in minutes
    },
    {
      id: 3,
      title: 'The Industrial Revolution',
      content: 'The Industrial Revolution was the transition to new manufacturing processes in Europe and the United States, in the period from about 1760 to sometime between 1820 and 1840. This transition included going from hand production methods to machines, new chemical manufacturing and iron production processes, the increasing use of steam power and water power, the development of machine tools and the rise of the mechanized factory system. The Industrial Revolution also led to an unprecedented rise in the rate of population growth. Textiles were the dominant industry of the Industrial Revolution in terms of employment, value of output and capital invested; the textile industry was also the first to use modern production methods.',
      questions: [
        {
          id: 6,
          text: 'When did the Industrial Revolution primarily occur?',
          options: [
            '1500-1600',
            '1760-1840',
            '1850-1900',
            '1900-1950'
          ],
          correctAnswer: 1,
          explanation: 'The period of transition was approximately 1760 to 1840.'
        },
        {
          id: 7,
          text: 'Which industry was dominant during the Industrial Revolution?',
          options: [
            'Steel production',
            'Agriculture',
            'Textiles',
            'Transportation'
          ],
          correctAnswer: 2,
          explanation: 'Textiles led in employment, output value, and capital investment.'
        }
      ],
      readingTime: 2 // in minutes
    }
  ];
  
  const [activePassage, setActivePassage] = useState(passages[0]);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [difficultWords, setDifficultWords] = useState([]);
  const [readingTimeLeft, setReadingTimeLeft] = useState(passages[0].readingTime * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [stats, setStats] = useState({
    attempts: 0,
    highestScore: 0,
    averageScore: 0
  });
  const [showWordModal, setShowWordModal] = useState(false);
  const [currentWord, setCurrentWord] = useState('');

  // Timer effect
  useEffect(() => {
    let interval;
    if (timerActive && readingTimeLeft > 0) {
      interval = setInterval(() => {
        setReadingTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (readingTimeLeft === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, readingTimeLeft]);

  const startTimer = () => {
    setReadingTimeLeft(activePassage.readingTime * 60);
    setTimerActive(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers({
      ...answers,
      [questionId]: answerIndex
    });
  };

  const checkAnswers = () => {
    setShowResults(true);
    setTimerActive(false);
    
    // Update stats
    const score = calculateScore();
    const newAttempts = stats.attempts + 1;
    const newAverage = Math.round((stats.averageScore * stats.attempts + score) / newAttempts);
    const newHighest = Math.max(stats.highestScore, score);
    
    setStats({
      attempts: newAttempts,
      highestScore: newHighest,
      averageScore: newAverage
    });
  };

  const resetQuiz = () => {
    setAnswers({});
    setShowResults(false);
    setReadingTimeLeft(activePassage.readingTime * 60);
  };

  const selectPassage = (passage) => {
    setActivePassage(passage);
    resetQuiz();
    setDifficultWords([]);
    setReadingTimeLeft(passage.readingTime * 60);
    setTimerActive(false);
  };

  const highlightWord = (word) => {
    setCurrentWord(word);
    setShowWordModal(true);
    
    if (!difficultWords.includes(word)) {
      setDifficultWords([...difficultWords, word]);
    }
  };

  const calculateScore = () => {
    const totalQuestions = activePassage.questions.length;
    const correctAnswers = activePassage.questions.filter(
      question => answers[question.id] === question.correctAnswer
    ).length;
    return Math.round((correctAnswers / totalQuestions) * 100);
  };

  const handleWordClick = (e) => {
    const word = e.target.innerText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    if (word.length > 8 || /[A-Z]/.test(word)) { // Long words or proper nouns
      highlightWord(word);
    }
  };

  const getPerformanceFeedback = (score) => {
    if (score >= 90) return { message: 'Outstanding!', color: 'text-green-500' };
    if (score >= 75) return { message: 'Excellent work!', color: 'text-blue-500' };
    if (score >= 60) return { message: 'Good job!', color: 'text-yellow-500' };
    return { message: 'Keep practicing!', color: 'text-red-500' };
  };

  return (
    <div className={`p-6 rounded-lg transition-colors duration-300 ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'} shadow-xl`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold flex items-center">
          <FiBook className="mr-2" /> Reading Comprehension Trainer
        </h2>
        <div className={`flex items-center px-3 py-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <FiBarChart2 className="mr-1" />
          <span className="text-sm font-medium">Attempts: {stats.attempts}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className={`p-4 rounded-lg transition-colors duration-300 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <h3 className="font-semibold mb-3 flex items-center">
              <FiBook className="mr-2" /> Select Passage
            </h3>
            <div className="space-y-2">
              {passages.map(passage => (
                <button
                  key={passage.id}
                  onClick={() => selectPassage(passage)}
                  className={`w-full text-left p-3 cursor-pointer rounded transition-colors duration-200 flex justify-between items-center ${
                    activePassage.id === passage.id ? 
                    (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') : 
                    (darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-200')
                  }`}
                >
                  <span>{passage.title}</span>
                  <span className="text-xs cursor-pointer opacity-80">{passage.questions.length} Qs</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Reading timer */}
          <div className={`p-4 rounded-lg transition-colors duration-300 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <h3 className="font-semibold mb-3 flex items-center">
              <FiClock className="mr-2" /> Reading Timer
            </h3>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-mono">
                {formatTime(readingTimeLeft)}
              </div>
              {!timerActive && readingTimeLeft === activePassage.readingTime * 60 && (
                <button
                  onClick={startTimer}
                  className={`px-3 py-1 cursor-pointer rounded ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white text-sm`}
                >
                  Start
                </button>
              )}
              {timerActive && (
                <button
                  onClick={() => setTimerActive(false)}
                  className={`px-3 py-1 cursor-pointer rounded ${darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white text-sm`}
                >
                  Pause
                </button>
              )}
            </div>
            <div className="mt-2 text-sm opacity-80">
              Suggested time: {activePassage.readingTime} min
            </div>
          </div>
          
          {/* Difficult words */}
          {difficultWords.length > 0 && (
            <div className={`p-4 rounded-lg transition-colors duration-300 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <h3 className="font-semibold mb-3 flex items-center">
                <FiInfo className="mr-2" /> Vocabulary Builder
              </h3>
              <div className="flex flex-wrap gap-2">
                {difficultWords.map((word, index) => (
                  <span 
                    key={index} 
                    onClick={() => highlightWord(word)}
                    className={`px-2 py-1 rounded cursor-pointer text-sm transition-colors duration-200 ${
                      darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Statistics */}
          <div className={`p-4 rounded-lg transition-colors duration-300 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <h3 className="font-semibold mb-3 flex items-center">
              <FiAward className="mr-2" /> Your Stats
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Highest Score:</span>
                <span className="font-medium">{stats.highestScore}%</span>
              </div>
              <div className="flex justify-between">
                <span>Average Score:</span>
                <span className="font-medium">{stats.averageScore}%</span>
              </div>
              <div className="flex justify-between">
                <span>Passages Read:</span>
                <span className="font-medium">{stats.attempts}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Passage */}
          <div className={`p-6 rounded-lg transition-colors duration-300 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-xl">{activePassage.title}</h3>
              <div className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                {activePassage.questions.length} questions
              </div>
            </div>
            <div 
              className={`prose max-w-none mb-4 leading-relaxed ${darkMode ? 'prose-invert' : ''}`}
              onClick={(e) => {
                if (e.target.tagName === 'SPAN') {
                  handleWordClick(e);
                }
              }}
              dangerouslySetInnerHTML={{ 
                __html: activePassage.content.split(' ').map(word => {
                  const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
                  const isDifficult = difficultWords.includes(cleanWord);
                  return isDifficult ? 
                    `<span class="${darkMode ? 'text-yellow-300 cursor-help' : 'text-yellow-600 cursor-help'}" style="border-bottom: 1px dotted ${darkMode ? '#d1d5db' : '#4b5563'}">${word}</span>` : 
                    word + ' ';
                }).join(' ')
              }}
            />
          </div>
          
          {/* Questions */}
          <div className={`p-6 rounded-lg transition-colors duration-300 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-xl flex items-center">
                <FiCheck className="mr-2" /> Comprehension Questions
              </h3>
              <div className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                {Object.keys(answers).length}/{activePassage.questions.length} answered
              </div>
            </div>
            
            <div className="space-y-4">
              {activePassage.questions.map(question => (
                <div 
                  key={question.id} 
                  className={`p-4 rounded transition-colors duration-200 ${
                    darkMode ? 'bg-gray-600' : 'bg-white'
                  } border ${
                    darkMode ? 'border-gray-500' : 'border-gray-200'
                  }`}
                >
                  <p className="font-medium mb-3">{question.text}</p>
                  
                  <div className="space-y-2">
                    {question.options.map((option, index) => {
                      const isSelected = answers[question.id] === index;
                      const isCorrect = index === question.correctAnswer;
                      const showCorrect = showResults && isCorrect;
                      const showIncorrect = showResults && isSelected && !isCorrect;
                      
                      return (
                        <label 
                          key={index} 
                          className={`flex items-center p-3 rounded cursor-pointer transition-colors duration-200 ${
                            showCorrect ? (darkMode ? 'bg-green-800' : 'bg-green-100 border-green-300') :
                            showIncorrect ? (darkMode ? 'bg-red-800' : 'bg-red-100 border-red-300') :
                            isSelected ? (darkMode ? 'bg-blue-700' : 'bg-blue-100 border-blue-300') :
                            darkMode ? 'hover:bg-gray-500' : 'hover:bg-gray-100'
                          } border`}
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            checked={isSelected}
                            onChange={() => handleAnswer(question.id, index)}
                            disabled={showResults}
                            className="mr-3 h-4 w-4"
                          />
                          <span className="flex-1">{option}</span>
                          {showCorrect && <FiCheck className="ml-2 text-green-500" />}
                          {showIncorrect && <FiX className="ml-2 text-red-500" />}
                        </label>
                      );
                    })}
                  </div>
                  
                  {showResults && (
                    <div className={`mt-3 p-3 rounded text-sm ${
                      darkMode ? 'bg-gray-500' : 'bg-gray-100'
                    }`}>
                      <p className="font-medium">Explanation:</p>
                      <p>{question.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Action buttons */}
            <div className="mt-6 flex justify-between">
              {!showResults ? (
                <button
                  onClick={checkAnswers}
                  disabled={Object.keys(answers).length < activePassage.questions.length}
                  className={`px-6 py-3 rounded-lg cursor-pointer flex items-center transition-colors duration-200 ${
                    Object.keys(answers).length < activePassage.questions.length ? 
                    (darkMode ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-300 cursor-not-allowed') : 
                    (darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600')
                  } text-white`}
                >
                  <FiCheck className="mr-2" /> Check Answers
                </button>
              ) : (
                <div className="w-full">
                  <div className={`p-4 rounded-lg mb-4 ${
                    darkMode ? 'bg-gray-600' : 'bg-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-lg">Your Score: {calculateScore()}%</p>
                        <p className={`mt-1 ${getPerformanceFeedback(calculateScore()).color}`}>
                          {getPerformanceFeedback(calculateScore()).message}
                        </p>
                      </div>
                      <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center" 
                        style={{
                          borderColor: darkMode ? '#4B5563' : '#E5E7EB',
                          background: `conic-gradient(${darkMode ? '#3B82F6' : '#2563EB'} 0% ${calculateScore()}%, transparent ${calculateScore()}% 100%)`
                        }}>
                        <span className="text-lg font-bold">{calculateScore()}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={resetQuiz}
                      className={`px-6 py-3 cursor-pointer rounded-lg flex items-center transition-colors duration-200 ${
                        darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                      } text-white`}
                    >
                      <FiRotateCcw className="mr-2" /> Try Again
                    </button>
                    <button
                      onClick={() => {
                        const nextPassageIndex = passages.findIndex(p => p.id === activePassage.id) + 1;
                        if (nextPassageIndex < passages.length) {
                          selectPassage(passages[nextPassageIndex]);
                        } else {
                          selectPassage(passages[0]);
                        }
                      }}
                      className={`px-6 py-3 rounded-lg cursor-pointer flex items-center transition-colors duration-200 ${
                        darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'
                      } text-white`}
                    >
                      Next Passage →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Word definition modal */}
      {showWordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg max-w-md w-full mx-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-xl font-bold mb-2">Word Definition</h3>
            <p className="text-lg font-medium mb-4">{currentWord}</p>
            <p className="mb-6">
              This would show the dictionary definition in a real application. 
              For this demo, we're highlighting longer or complex words to help 
              with vocabulary building.
            </p>
            <button
              onClick={() => setShowWordModal(false)}
              className={`w-full py-2 cursor-pointer rounded ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadingTrainer;