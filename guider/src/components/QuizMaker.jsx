import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiX, FiChevronDown, FiCheck } from 'react-icons/fi';

const QuizMaker = ({ darkMode }) => {
  const [quizzes, setQuizzes] = useState([
    {
      id: 1,
      title: 'React Basics',
      questions: [
        {
          id: 1,
          text: 'What is React?',
          type: 'multiple_choice',
          options: ['A programming language', 'A JavaScript library', 'A database', 'A CSS framework'],
          correctAnswer: 1,
        },
        {
          id: 2,
          text: 'React uses JSX for templating.',
          type: 'true_false',
          correctAnswer: true,
        },
      ],
    },
  ]);

  const [activeQuiz, setActiveQuiz] = useState(null);
  const [newQuiz, setNewQuiz] = useState({ title: '', questions: [] });
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    type: 'multiple_choice',
    options: ['', ''],
    correctAnswer: 0,
  });
  const [isAddingQuiz, setIsAddingQuiz] = useState(false);

  // Handlers
  const addQuiz = () => {
    if (newQuiz.title) {
      const quiz = { ...newQuiz, id: Date.now() };
      setQuizzes([...quizzes, quiz]);
      setNewQuiz({ title: '', questions: [] });
      setIsAddingQuiz(false);
    }
  };

  const addQuestion = () => {
    if (
      newQuestion.text &&
      (newQuestion.type === 'true_false' || newQuestion.options.every((opt) => opt.trim())
    )
    ) {
      const question = { ...newQuestion, id: Date.now() };
      setNewQuiz({
        ...newQuiz,
        questions: [...newQuiz.questions, question],
      });
      setNewQuestion({
        text: '',
        type: 'multiple_choice',
        options: ['', ''],
        correctAnswer: 0,
      });
    }
  };

  const updateOption = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const addOption = () => {
    setNewQuestion({
      ...newQuestion,
      options: [...newQuestion.options, ''],
    });
  };

  const removeOption = (index) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions.splice(index, 1);
    setNewQuestion({
      ...newQuestion,
      options: updatedOptions,
      correctAnswer: Math.min(newQuestion.correctAnswer, updatedOptions.length - 1),
    });
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: 'beforeChildren',
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const cardVariants = {
    hover: {
      y: -5,
      boxShadow: darkMode
        ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
        : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      transition: { duration: 0.3 },
    },
    tap: {
      scale: 0.98,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`p-4 md:p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
    >
      {/* Title */}
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
      >
        Quiz Practice
      </motion.h2>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Quiz Creation */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.div
            variants={itemVariants}
            className={`p-5 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} mb-4 shadow-md transition-all duration-300`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Your Quizzes</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAddingQuiz(!isAddingQuiz)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                  darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                } text-white text-sm`}
              >
                <FiPlus size={16} />
                New Quiz
              </motion.button>
            </div>

            {/* Add Quiz Form */}
            <AnimatePresence>
              {isAddingQuiz && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 pt-2">
                    {/* Quiz Title */}
                    <motion.input
                      type="text"
                      value={newQuiz.title}
                      onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                      placeholder="Quiz title"
                      className={`w-full p-3 rounded-lg ${
                        darkMode ? 'bg-gray-600 text-white placeholder-gray-400' : 'bg-white placeholder-gray-500'
                      } focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all`}
                      whileFocus={{ scale: 1.01 }}
                    />

                    {/* Question Form */}
                    <motion.div
                      className={`p-4 rounded-lg ${
                        darkMode ? 'bg-gray-600' : 'bg-white'
                      } shadow-inner`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <FiPlus size={18} />
                        Add Question
                      </h4>
                      <div className="space-y-4">
                        {/* Question Text */}
                        <motion.input
                          type="text"
                          value={newQuestion.text}
                          onChange={(e) =>
                            setNewQuestion({ ...newQuestion, text: e.target.value })
                          }
                          placeholder="Question text"
                          className={`w-full p-3 rounded-lg ${
                            darkMode
                              ? 'bg-gray-500 text-white placeholder-gray-400'
                              : 'bg-gray-100 placeholder-gray-500'
                          } focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all`}
                          whileFocus={{ scale: 1.01 }}
                        />

                        {/* Question Type Selector */}
                        <motion.div className="relative" whileHover={{ scale: 1.01 }}>
                          <select
                            value={newQuestion.type}
                            onChange={(e) =>
                              setNewQuestion({
                                ...newQuestion,
                                type: e.target.value,
                                options:
                                  e.target.value === 'multiple_choice'
                                    ? ['', '']
                                    : [],
                                correctAnswer: 0,
                              })
                            }
                            className={`w-full p-3 rounded-lg appearance-none ${
                              darkMode ? 'bg-gray-500 text-white' : 'bg-gray-100'
                            } focus:ring-2 focus:ring-blue-500 focus:outline-none pr-8`}
                          >
                            <option value="multiple_choice">Multiple Choice</option>
                            <option value="true_false">True/False</option>
                          </select>
                          <FiChevronDown
                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                              darkMode ? 'text-gray-300' : 'text-gray-500'
                            }`}
                          />
                        </motion.div>

                        {/* Multiple Choice Options */}
                        {newQuestion.type === 'multiple_choice' && (
                          <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            {newQuestion.options.map((option, index) => (
                              <motion.div key={index} className="flex items-center gap-2" variants={itemVariants}>
                                <motion.button
                                  type="button"
                                  onClick={() => setNewQuestion({ ...newQuestion, correctAnswer: index })}
                                  className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    darkMode ? 'border-gray-400' : 'border-gray-500'
                                  } ${
                                    newQuestion.correctAnswer === index
                                      ? darkMode
                                        ? 'bg-blue-500 border-blue-500'
                                        : 'bg-blue-400 border-blue-400'
                                      : ''
                                  }`}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  {newQuestion.correctAnswer === index && <FiCheck size={12} className="text-white" />}
                                </motion.button>
                                <motion.input
                                  type="text"
                                  value={option}
                                  onChange={(e) => updateOption(index, e.target.value)}
                                  placeholder={`Option ${index + 1}`}
                                  className={`flex-1 p-2 rounded-lg ${
                                    darkMode
                                      ? 'bg-gray-500 text-white placeholder-gray-400'
                                      : 'bg-gray-100 placeholder-gray-500'
                                  } focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all`}
                                  whileFocus={{ scale: 1.01 }}
                                />
                                {newQuestion.options.length > 2 && (
                                  <motion.button
                                    onClick={() => removeOption(index)}
                                    className="ml-1 text-red-500 p-1 rounded-full hover:bg-red-500/10"
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <FiX size={16} />
                                  </motion.button>
                                )}
                              </motion.div>
                            ))}

                            {/* Add Option Button */}
                            <motion.button
                              onClick={addOption}
                              className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg ${
                                darkMode ? 'bg-gray-500 hover:bg-gray-400 text-white' : 'bg-gray-200 hover:bg-gray-300'
                              } transition-colors`}
                              whileHover={{ y: -1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FiPlus size={14} />
                              Add Option
                            </motion.button>
                          </motion.div>
                        )}

                        {/* True/False Toggle */}
                        {newQuestion.type === 'true_false' && (
                          <motion.div
                            className="flex gap-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            {[true, false].map((value) => (
                              <motion.label
                                key={value.toString()}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer ${
                                  darkMode ? 'hover:bg-gray-500' : 'hover:bg-gray-200'
                                } transition-colors ${
                                  newQuestion.correctAnswer === value
                                    ? darkMode
                                      ? 'bg-blue-600'
                                      : 'bg-blue-400 text-white'
                                    : ''
                                }`}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                              >
                                <input
                                  type="radio"
                                  name="trueFalse"
                                  checked={newQuestion.correctAnswer === value}
                                  onChange={() =>
                                    setNewQuestion({ ...newQuestion, correctAnswer: value })
                                  }
                                  className="hidden"
                                />
                                <div
                                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                    darkMode ? 'border-gray-300' : 'border-gray-500'
                                  } ${
                                    newQuestion.correctAnswer === value
                                      ? darkMode
                                        ? 'bg-blue-500 border-blue-500'
                                        : 'bg-blue-400 border-blue-400'
                                      : ''
                                  }`}
                                >
                                  {newQuestion.correctAnswer === value && (
                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                  )}
                                </div>
                                <span>{value ? 'True' : 'False'}</span>
                              </motion.label>
                            ))}
                          </motion.div>
                        )}

                        {/* Add Question Button */}
                        <div className="flex justify-end gap-2 pt-2">
                          <motion.button
                            onClick={addQuestion}
                            disabled={
                              !newQuestion.text ||
                              (newQuestion.type === 'multiple_choice' &&
                                !newQuestion.options.every((opt) => opt.trim()))
                            }
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                              !newQuestion.text ||
                              (newQuestion.type === 'multiple_choice' &&
                                !newQuestion.options.every((opt) => opt.trim()))
                                ? darkMode
                                  ? 'bg-gray-600 cursor-not-allowed'
                                  : 'bg-gray-300 cursor-not-allowed'
                                : darkMode
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-blue-500 hover:bg-blue-600'
                            } text-white transition-colors`}
                            whileHover={{
                              scale:
                                !newQuestion.text ||
                                (newQuestion.type === 'multiple_choice' &&
                                  !newQuestion.options.every((opt) => opt))
                                  ? 1
                                  : 1.05,
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FiPlus size={16} />
                            Add Question
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>

                    {/* Create Quiz Button */}
                    <motion.div className="flex justify-end">
                      <motion.button
                        onClick={addQuiz}
                        disabled={!newQuiz.title || newQuiz.questions.length === 0}
                        className={`px-5 py-2.5 rounded-lg ${
                          !newQuiz.title || newQuiz.questions.length === 0
                            ? darkMode
                              ? 'bg-gray-600 cursor-not-allowed'
                              : 'bg-gray-300 cursor-not-allowed'
                            : darkMode
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                            : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                        } text-white font-medium`}
                        whileHover={{
                          scale:
                            !newQuiz.title || newQuiz.questions.length === 0
                              ? 1
                              : 1.05,
                          boxShadow:
                            !newQuiz.title || newQuiz.questions.length === 0
                              ? 'none'
                              : '0 4px 12px rgba(59, 130, 246, 0.3)',
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Create Quiz
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Right Column - Quiz List */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.div
            variants={itemVariants}
            className={`p-5 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-md`}
          >
            <h3 className="font-semibold text-lg mb-4">Available Quizzes</h3>
            <div className="space-y-3">
              <AnimatePresence>
                {quizzes.length > 0 ? (
                  quizzes.map((quiz) => (
                    <motion.div
                      key={quiz.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      whileHover="hover"
                      whileTap="tap"
                      variants={cardVariants}
                      className={`p-4 rounded-lg cursor-pointer ${
                        darkMode ? 'bg-gray-600 hover:bg-gray-550' : 'bg-white hover:bg-gray-50'
                      } border ${darkMode ? 'border-gray-500' : 'border-gray-200'} transition-colors`}
                      onClick={() => setActiveQuiz(quiz)}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold">{quiz.title}</h4>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            darkMode ? 'bg-gray-500 text-gray-200' : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {quiz.questions.length}{' '}
                          {quiz.questions.length === 1 ? 'question' : 'questions'}
                        </span>
                      </div>

                      {/* Question Types Preview */}
                      <div className="mt-2 flex gap-1">
                        {quiz.questions.slice(0, 3).map((q, i) => (
                          <span
                            key={i}
                            className={`text-xs px-1.5 py-0.5 rounded ${
                              darkMode ? 'bg-gray-500 text-gray-300' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {q.type === 'multiple_choice' ? 'MCQ' : 'T/F'}
                          </span>
                        ))}
                        {quiz.questions.length > 3 && (
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded ${
                              darkMode ? 'bg-gray-500 text-gray-300' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            +{quiz.questions.length - 3}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center py-6"
                  >
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      No quizzes created yet
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsAddingQuiz(true)}
                      className={`mt-3 px-4 py-2 rounded-lg ${
                        darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                      } text-white text-sm`}
                    >
                      Create Your First Quiz
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Quiz Preview Modal */}
      <AnimatePresence>
        {activeQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setActiveQuiz(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={`w-full max-w-2xl rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-2xl overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className={`p-5 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'} flex justify-between items-center`}
              >
                <h3 className="font-semibold text-xl">{activeQuiz.title}</h3>
                <motion.button
                  onClick={() => setActiveQuiz(null)}
                  className={`p-1.5 rounded-full ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} transition-colors`}
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiX size={20} />
                </motion.button>
              </div>

              {/* Questions List */}
              <div className="max-h-[70vh] overflow-y-auto p-5">
                <motion.div
                  className="space-y-4"
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                >
                  {activeQuiz.questions.map((question, qIndex) => (
                    <motion.div
                      key={question.id}
                      variants={itemVariants}
                      className={`p-4 rounded-lg ${
                        darkMode ? 'bg-gray-600' : 'bg-gray-50'
                      } shadow-sm`}
                    >
                      <p className="font-medium flex items-start gap-2">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-sm ${
                            darkMode ? 'bg-gray-500 text-white' : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {qIndex + 1}
                        </span>
                        {question.text}
                      </p>

                      {/* Multiple Choice Answers */}
                      {question.type === 'multiple_choice' && (
                        <div className="mt-3 space-y-2">
                          {question.options.map((option, oIndex) => (
                            <div
                              key={oIndex}
                              className={`flex items-center gap-3 p-2 rounded-lg ${
                                darkMode ? 'hover:bg-gray-500' : 'hover:bg-gray-100'
                              } ${
                                question.correctAnswer === oIndex
                                  ? darkMode
                                    ? 'bg-green-900/30 border border-green-500'
                                    : 'bg-green-100 border border-green-300'
                                  : ''
                              } transition-colors`}
                            >
                              <div
                                className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center ${
                                  darkMode ? 'border-gray-400' : 'border-gray-500'
                                } ${
                                  question.correctAnswer === oIndex
                                    ? darkMode
                                      ? 'bg-green-500 border-green-500'
                                      : 'bg-green-400 border-green-400'
                                    : ''
                                }`}
                              >
                                {question.correctAnswer === oIndex && <FiCheck size={12} className="text-white" />}
                              </div>
                              <span>{option}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* True/False Answers */}
                      {question.type === 'true_false' && (
                        <div className="mt-3 space-y-2">
                          {[true, false].map((value) => (
                            <div
                              key={value.toString()}
                              className={`flex items-center gap-3 p-2 rounded-lg ${
                                darkMode ? 'hover:bg-gray-500' : 'hover:bg-gray-100'
                              } ${
                                question.correctAnswer === value
                                  ? darkMode
                                    ? 'bg-green-900/30 border border-green-500'
                                    : 'bg-green-100 border border-green-300'
                                  : ''
                              } transition-colors`}
                            >
                              <div
                                className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center ${
                                  darkMode ? 'border-gray-400' : 'border-gray-500'
                                } ${
                                  question.correctAnswer === value
                                    ? darkMode
                                      ? 'bg-green-500 border-green-500'
                                      : 'bg-green-400 border-green-400'
                                    : ''
                                }`}
                              >
                                {question.correctAnswer === value && <FiCheck size={12} className="text-white" />}
                              </div>
                              <span>{value ? 'True' : 'False'}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Footer */}
              <div
                className={`p-4 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'} flex justify-end`}
              >
                <motion.button
                  onClick={() => setActiveQuiz(null)}
                  className={`px-5 py-2 rounded-lg ${
                    darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
                  } transition-colors`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default QuizMaker;