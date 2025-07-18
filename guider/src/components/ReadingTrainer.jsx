import React, { useState, useEffect } from 'react';
import { 
  FiBook, 
  FiCheck, 
  FiX, 
  FiRotateCcw, 
  FiInfo, 
  FiAward, 
  FiClock, 
  FiBarChart2,
  FiChevronRight,
  FiAlertCircle,
  FiBookmark,
  FiHelpCircle
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const ReadingTrainer = ({ darkMode = true }) => {
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
      readingTime: 2,
      icon: '🌙',
      color: 'bg-indigo-500'
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
      readingTime: 3,
      icon: '🌿',
      color: 'bg-green-500'
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
      readingTime: 2,
      icon: '🏭',
      color: 'bg-amber-500'
    }
  ];
  
  const [activePassage, setActivePassage] = useState(passages[0]);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [difficultWords, setDifficultWords] = useState([]);
  const [readingTimeLeft, setReadingTimeLeft] = useState(passages[0].readingTime * 60);
  const [timerActive, setTimerActive] = useState(false);
   const [hasStarted, setHasStarted] = useState(false);
   const [readingDuration, setReadingDuration] = useState(activePassage.readingTime || 5); 
  const [userSetTime, setUserSetTime] = useState('');
  const [stats, setStats] = useState({
    attempts: 0,
    highestScore: 0,
    averageScore: 0
  });
  const [showWordModal, setShowWordModal] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    if (word.length > 8 || /[A-Z]/.test(word)) {
      highlightWord(word);
    }
  };

  const getPerformanceFeedback = (score) => {
    if (score >= 90) return { message: 'Outstanding!', color: 'text-green-500' };
    if (score >= 75) return { message: 'Excellent work!', color: 'text-blue-500' };
    if (score >= 60) return { message: 'Good job!', color: 'text-yellow-500' };
    return { message: 'Keep practicing!', color: 'text-red-500' };
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const sidebarVariants = {
    open: { 
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    closed: { 
      x: -300,
      opacity: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  };

  return (
    <div className={`min-h-screen p-4 md:p-6 transition-colors duration-500 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`max-w-7xl mx-auto rounded-xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
      >
        {/* Header */}
        <div className={`p-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-between`}>
          <motion.div 
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center"
          >
            <FiBook className={`text-3xl mr-3 ${activePassage.color.replace('bg-', 'text-')}`} />
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Reading  Trainer
            </h1>
          </motion.div>
          
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} lg:hidden`}
          >
            <FiChevronRight className={`text-xl transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar - animated for mobile */}
          <AnimatePresence>
            {(isSidebarOpen || window.innerWidth >= 1024) && (
              <motion.div
                variants={sidebarVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className={`w-full lg:w-80 flex-shrink-0 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 border-r ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
              >
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                  {/* Passage Selection */}
                  <motion.div 
                    variants={itemVariants}
                    className={`p-5 rounded-xl ${darkMode ? 'bg-gray-600' : 'bg-white'} shadow-md`}
                  >
                    <div className="flex items-center mb-4">
                      <div className={`p-2 rounded-lg ${activePassage.color} text-white mr-3`}>
                        <FiBookmark className="text-xl" />
                      </div>
                      <h3 className="font-semibold text-lg">Select Passage</h3>
                    </div>
                    <div className="space-y-3">
                      {passages.map(passage => (
                        <motion.button
                          key={passage.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => selectPassage(passage)}
                          className={`w-full text-left p-4 rounded-lg transition-all duration-300 flex items-center ${
                            activePassage.id === passage.id ? 
                            `${passage.color} text-white shadow-md` : 
                            (darkMode ? 'bg-gray-500 hover:bg-gray-400' : 'bg-gray-100 hover:bg-gray-200')
                          }`}
                        >
                          <span className="text-xl mr-3">{passage.icon}</span>
                          <div className="flex-1">
                            <p className="font-medium">{passage.title}</p>
                            <p className="text-xs opacity-80">{passage.questions.length} questions</p>
                          </div>
                          {activePassage.id === passage.id && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 rounded-full bg-white"
                            />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
             {/* Timer */}
<motion.div
  variants={itemVariants}
  className={`p-5 rounded-xl ${darkMode ? 'bg-gray-600' : 'bg-white'} shadow-md`}
>
  <div className="flex items-center mb-4">
    <div className="p-2 rounded-lg bg-blue-500 text-white mr-3">
      <FiClock className="text-xl" />
    </div>
    <h3 className="font-semibold text-lg">Reading Timer</h3>
  </div>

  <div className="flex items-center justify-between mb-3">
    <div className="text-3xl font-mono font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
      {formatTime(readingTimeLeft)}
    </div>

    {/* Start Button */}
    {!timerActive && readingTimeLeft === readingDuration * 60 && (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={startTimer}
        className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md"
      >
        Start
      </motion.button>
    )}

    {/* Resume Button */}
    {!timerActive && readingTimeLeft < readingDuration * 60 && readingTimeLeft > 0 && (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setTimerActive(true)}
        className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md"
      >
        Resume
      </motion.button>
    )}

    {/* Pause Button */}
    {timerActive && (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setTimerActive(false)}
        className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md"
      >
        Pause
      </motion.button>
    )}
  </div>

  {/* Time Setter */}
  <div className="flex items-center gap-2 mb-3">
    <label className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
      Set Timer (minutes):
    </label>
    <input
      type="number"
      min="1"
      value={readingDuration}
      onChange={e => {
        const minutes = Math.max(1, parseInt(e.target.value || 1));
        setReadingDuration(minutes);
        setReadingTimeLeft(minutes * 60);
        setTimerActive(false); // Reset the timer when changing duration
      }}
      className={`w-16 px-2 py-1 rounded border text-sm ${
        darkMode
          ? 'bg-gray-700 text-white border-gray-500 placeholder-gray-400'
          : 'bg-white text-gray-700 border-gray-300'
      }`}
    />
  </div>

  <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
    Suggested time: {activePassage.readingTime} min
  </div>
</motion.div>

                  
                  {/* Difficult Words */}
                  {difficultWords.length > 0 && (
                    <motion.div 
                      variants={itemVariants}
                      className={`p-5 rounded-xl ${darkMode ? 'bg-gray-600' : 'bg-white'} shadow-md`}
                    >
                      <div className="flex items-center mb-4">
                        <div className="p-2 rounded-lg bg-purple-500 text-white mr-3">
                          <FiAlertCircle className="text-xl" />
                        </div>
                        <h3 className="font-semibold text-lg">Vocabulary Builder</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {difficultWords.map((word, index) => (
                          <motion.span
                            key={index}
                            whileHover={{ y: -2 }}
                            onClick={() => highlightWord(word)}
                            className={`px-3 py-1 rounded-full cursor-pointer text-sm font-medium ${
                              darkMode ? 'bg-purple-900 text-purple-100' : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {word}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Statistics */}
                  <motion.div 
                    variants={itemVariants}
                    className={`p-5 rounded-xl ${darkMode ? 'bg-gray-600' : 'bg-white'} shadow-md`}
                  >
                    <div className="flex items-center mb-4">
                      <div className="p-2 rounded-lg bg-amber-500 text-white mr-3">
                        <FiAward className="text-xl" />
                      </div>
                      <h3 className="font-semibold text-lg">Your Stats</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Highest Score:</span>
                        <span className="font-bold text-lg bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                          {stats.highestScore}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Average Score:</span>
                        <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                          {stats.averageScore}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Passages Read:</span>
                        <span className="font-bold text-lg bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                          {stats.attempts}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Main Content */}
          <div className="flex-1 p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Passage */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} shadow-lg`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{activePassage.title}</h2>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                      <span className="mr-1">{activePassage.questions.length}</span>
                      <FiHelpCircle className="text-sm" />
                    </div>
                  </div>
                  <div className={`text-4xl ${activePassage.color.replace('bg-', 'text-')}`}>
                    {activePassage.icon}
                  </div>
                </div>
                
                <motion.div 
                  className={`prose max-w-none mb-6 leading-relaxed ${darkMode ? 'prose-invert' : ''}`}
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
              </motion.div>
              
              {/* Questions */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} shadow-lg`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center">
                    <FiCheck className="mr-3 text-green-500" /> 
                    <span>Comprehension Questions</span>
                  </h3>
                  <div className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                    {Object.keys(answers).length}/{activePassage.questions.length} answered
                  </div>
                </div>
                
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-5"
                >
                  {activePassage.questions.map((question, qIndex) => (
                    <motion.div
                      key={question.id}
                      variants={itemVariants}
                      className={`p-5 rounded-xl ${darkMode ? 'bg-gray-600' : 'bg-white'} shadow-md`}
                    >
                      <p className="font-semibold text-lg mb-4">{question.text}</p>
                      
                      <div className="space-y-3">
                        {question.options.map((option, index) => {
                          const isSelected = answers[question.id] === index;
                          const isCorrect = index === question.correctAnswer;
                          const showCorrect = showResults && isCorrect;
                          const showIncorrect = showResults && isSelected && !isCorrect;
                          
                          return (
                            <motion.label
                              whileHover={{ scale: 1.01 }}
                              key={index}
                              className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                                showCorrect ? (darkMode ? 'bg-green-800' : 'bg-green-100') :
                                showIncorrect ? (darkMode ? 'bg-red-800' : 'bg-red-100') :
                                isSelected ? (darkMode ? 'bg-blue-700' : 'bg-blue-100') :
                                darkMode ? 'hover:bg-gray-500' : 'hover:bg-gray-200'
                              } border ${
                                showCorrect ? (darkMode ? 'border-green-500' : 'border-green-300') :
                                showIncorrect ? (darkMode ? 'border-red-500' : 'border-red-300') :
                                isSelected ? (darkMode ? 'border-blue-500' : 'border-blue-300') :
                                darkMode ? 'border-gray-500' : 'border-gray-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                checked={isSelected}
                                onChange={() => handleAnswer(question.id, index)}
                                disabled={showResults}
                                className="mr-3 h-5 w-5"
                              />
                              <span className="flex-1">{option}</span>
                              {showCorrect && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="ml-2 text-green-500"
                                >
                                  <FiCheck className="text-xl" />
                                </motion.div>
                              )}
                              {showIncorrect && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="ml-2 text-red-500"
                                >
                                  <FiX className="text-xl" />
                                </motion.div>
                              )}
                            </motion.label>
                          );
                        })}
                      </div>
                      
                      {showResults && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className={`mt-4 overflow-hidden rounded-lg ${darkMode ? 'bg-gray-500' : 'bg-gray-200'}`}
                        >
                          <div className="p-4">
                            <p className="font-semibold mb-2">Explanation:</p>
                            <p>{question.explanation}</p>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
                
                {/* Action buttons */}
                <div className="mt-8">
                  {!showResults ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={checkAnswers}
                      disabled={Object.keys(answers).length < activePassage.questions.length}
                      className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center ${
                        Object.keys(answers).length < activePassage.questions.length ? 
                        (darkMode ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-300 cursor-not-allowed') : 
                        'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white shadow-lg'
                      }`}
                    >
                      <FiCheck className="mr-2" /> Check Answers
                    </motion.button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                        <div className="flex flex-col md:flex-row items-center justify-between">
                          <div className="mb-4 md:mb-0">
                            <p className="font-bold text-xl mb-1">Your Score: {calculateScore()}%</p>
                            <p className={`text-lg ${getPerformanceFeedback(calculateScore()).color}`}>
                              {getPerformanceFeedback(calculateScore()).message}
                            </p>
                          </div>
                          <div className="relative w-24 h-24">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                              <path
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke={darkMode ? '#4B5563' : '#E5E7EB'}
                                strokeWidth="3"
                              />
                              <path
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke={darkMode ? '#3B82F6' : '#2563EB'}
                                strokeWidth="3"
                                strokeDasharray={`${calculateScore()}, 100`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-2xl font-bold">{calculateScore()}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={resetQuiz}
                          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium flex items-center justify-center shadow-lg"
                        >
                          <FiRotateCcw className="mr-2" /> Try Again
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            const nextPassageIndex = passages.findIndex(p => p.id === activePassage.id) + 1;
                            if (nextPassageIndex < passages.length) {
                              selectPassage(passages[nextPassageIndex]);
                            } else {
                              selectPassage(passages[0]);
                            }
                          }}
                          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium flex items-center justify-center shadow-lg"
                        >
                          Next Passage <FiChevronRight className="ml-1" />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Word definition modal */}
      <AnimatePresence>
        {showWordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className={`p-6 rounded-xl max-w-md w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                  Word Definition
                </h3>
                <button
                  onClick={() => setShowWordModal(false)}
                  className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                >
                  <FiX className="text-xl" />
                </button>
              </div>
              
              <div className="mb-6">
                <div className={`text-3xl font-bold mb-2 ${darkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>
                  {currentWord}
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className="mb-2 font-medium">Definition:</p>
                  <p>
                    This would show the dictionary definition in a real application. 
                    For this demo, we're highlighting longer or complex words to help 
                    with vocabulary building.
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setShowWordModal(false)}
                className={`w-full py-3 rounded-lg font-medium ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white shadow-md`}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReadingTrainer;