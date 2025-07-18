import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiX, FiChevronDown, FiCheck } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const QuizMaker = ({ darkMode }) => {
  /* ──────────────────────────────────── state ─────────────────────────────────── */
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [isAddingQuiz, setIsAddingQuiz] = useState(false);

  const [newQuiz, setNewQuiz] = useState({ title: '', questions: [] });
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    type: 'multiple_choice',
    options: ['', ''],
    correctAnswer: 0,
  });

  /* ───────────────────────────── fetch quizzes on mount ───────────────────────── */
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get('/api/quizzes');
        setQuizzes(res.data || []);
      } catch (err) {
        console.error('Error fetching quizzes:', err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  /* ──────────────────────────────── handlers ──────────────────────────────────── */
  const addQuiz = async () => {
    if (!newQuiz.title || newQuiz.questions.length === 0) return;
    try {
      const res = await axios.post('/api/quizzes', {
        title: newQuiz.title,
        questions: newQuiz.questions,
      });
      setQuizzes((prev) => [...prev, res.data]);
      setNewQuiz({ title: '', questions: [] });
      setIsAddingQuiz(false);
    } catch (err) {
      console.error('Error creating quiz:', err.response?.data?.message || err.message);
    }
  };

  const addQuestion = () => {
    if (!newQuestion.text) return;
    
    if (newQuestion.type === 'multiple_choice') {
      const filledOptions = newQuestion.options.filter(opt => opt.trim() !== '');
      if (filledOptions.length < 2) return;
    }

    const question = { 
      ...newQuestion, 
      id: Date.now(),
      options: newQuestion.type === 'multiple_choice' 
        ? newQuestion.options.filter(opt => opt.trim() !== '') 
        : newQuestion.options
    };
    
    setNewQuiz((prev) => ({ ...prev, questions: [...prev.questions, question] }));

    // Reset with 2 empty options for multiple choice
    setNewQuestion({
      text: '',
      type: 'multiple_choice',
      options: ['', ''],
      correctAnswer: 0,
    });
  };

  const updateOption = (index, value) => {
    const options = [...newQuestion.options];
    options[index] = value;
    setNewQuestion({ ...newQuestion, options });
  };

  const addOption = () =>
    setNewQuestion({ ...newQuestion, options: [...newQuestion.options, ''] });

  const removeOption = (index) => {
    const options = [...newQuestion.options];
    options.splice(index, 1);
    setNewQuestion({
      ...newQuestion,
      options,
      correctAnswer: Math.min(newQuestion.correctAnswer, options.length - 1),
    });
  };

  /* ───────────────────────────── animations ───────────────────────── */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, when: 'beforeChildren' } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 10 } },
  };
  const cardVariants = {
    hover: {
      y: -5,
      boxShadow: darkMode
        ? '0 10px 25px -5px rgba(0,0,0,.5)'
        : '0 10px 25px -5px rgba(0,0,0,.1)',
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.98 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`p-4 md:p-6 rounded-xl shadow-lg ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}
    >
      {/* Header */}
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
      >
        Quiz Practice
      </motion.h2>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column: create quiz */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.div
            variants={itemVariants}
            className={`p-5 rounded-xl mb-4 shadow-md transition-all ${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}
          >
            {/* Top bar */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Your Quizzes</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAddingQuiz((s) => !s)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                  darkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                <FiPlus size={16} />
                New Quiz
              </motion.button>
            </div>

            {/* Form (collapsible) */}
            <AnimatePresence>
              {isAddingQuiz && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  {/* Quiz title */}
                  <motion.input
                    type="text"
                    value={newQuiz.title}
                    onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                    placeholder="Quiz title"
                    className={`w-full p-3 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none ${
                      darkMode
                        ? 'bg-gray-600 placeholder-gray-400 text-white'
                        : 'bg-white placeholder-gray-500'
                    }`}
                  />

                  {/* Question builder */}
                  <motion.div
                    className={`p-4 rounded-lg shadow-inner ${
                      darkMode ? 'bg-gray-600' : 'bg-white'
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <FiPlus size={18} /> Add Question
                    </h4>

                    {/* Question text */}
                    <motion.input
                      type="text"
                      value={newQuestion.text}
                      onChange={(e) =>
                        setNewQuestion({ ...newQuestion, text: e.target.value })
                      }
                      placeholder="Question text"
                      className={`w-full p-3 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none ${
                        darkMode
                          ? 'bg-gray-500 placeholder-gray-400 text-white'
                          : 'bg-gray-100 placeholder-gray-500'
                      }`}
                    />

                    {/* Type selector */}
                    <motion.div className="relative mb-4">
                    <select
  value={newQuestion.type}
  onChange={(e) => {
    const type = e.target.value;
    setNewQuestion({
      text: '',
      type,
      options: type === 'multiple_choice' ? ['', ''] : [],
      correctAnswer: 0,
    });
  }}
  className={`w-full p-3 pr-8 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 outline-none ${
    darkMode ? 'bg-gray-500 text-white' : 'bg-gray-100'
  }`}
>
  <option value="multiple_choice">Multiple Choice</option>
  <option value="true_false">True / False</option>
</select>

                      <FiChevronDown
                        className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                          darkMode ? 'text-gray-300' : 'text-gray-500'
                        }`}
                      />
                    </motion.div>

                    {/* Multiple-choice options */}
                    {newQuestion.type === 'multiple_choice' && (
                      <motion.div className="space-y-3">
                        {newQuestion.options.map((opt, idx) => (
                          <motion.div
                            key={idx}
                            className="flex items-center gap-2"
                            variants={itemVariants}
                          >
                            {/* Radio choose correct */}
                            <motion.button
                              type="button"
                              onClick={() =>
                                setNewQuestion({ ...newQuestion, correctAnswer: idx })
                              }
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                darkMode ? 'border-gray-400' : 'border-gray-500'
                              } ${
                                newQuestion.correctAnswer === idx
                                  ? darkMode
                                    ? 'bg-blue-500 border-blue-500'
                                    : 'bg-blue-400 border-blue-400'
                                  : ''
                              }`}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {newQuestion.correctAnswer === idx && (
                                <FiCheck size={12} className="text-white" />
                              )}
                            </motion.button>

                            {/* Option text */}
                           <motion.input
  type="text"
  value={opt}
  onChange={(e) => updateOption(idx, e.target.value)}
  placeholder={`Option ${idx + 1}`}
  className={`flex-1 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
    darkMode
      ? 'bg-gray-500 placeholder-gray-400 text-white'
      : 'bg-gray-100 placeholder-gray-500'
  }`}
  whileFocus={{ scale: 1.01 }}
/>


                            {/* Remove option */}
                            {newQuestion.options.length > 2 && (
                              <motion.button
                                onClick={() => removeOption(idx)}
                                className="ml-1 text-red-500 p-1 rounded-full hover:bg-red-500/10"
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FiX size={16} />
                              </motion.button>
                            )}
                          </motion.div>
                        ))}

                        {/* Add option */}
                        <motion.button
                          onClick={addOption}
                          className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg ${
                            darkMode
                              ? 'bg-gray-500 hover:bg-gray-400 text-white'
                              : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiPlus size={14} />
                          Add Option
                        </motion.button>
                      </motion.div>
                    )}

                    {/* True/false radio */}
                    {newQuestion.type === 'true_false' && (
                      <motion.div className="flex gap-4">
                        {[true, false].map((val) => (
                          <motion.label
                            key={val.toString()}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer ${
                              darkMode ? 'hover:bg-gray-500' : 'hover:bg-gray-200'
                            } ${
                              newQuestion.correctAnswer === val
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
                              checked={newQuestion.correctAnswer === val}
                              onChange={() =>
                                setNewQuestion({ ...newQuestion, correctAnswer: val })
                              }
                              className="hidden"
                            />
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                darkMode ? 'border-gray-300' : 'border-gray-500'
                              } ${
                                newQuestion.correctAnswer === val
                                  ? darkMode
                                    ? 'bg-blue-500 border-blue-500'
                                    : 'bg-blue-400 border-blue-400'
                                  : ''
                              }`}
                            >
                              {newQuestion.correctAnswer === val && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                              )}
                            </div>
                            <span>{val ? 'True' : 'False'}</span>
                          </motion.label>
                        ))}
                      </motion.div>
                    )}

                    {/* Add question btn */}
                    <div className="flex justify-end pt-4">
                      <motion.button
                        onClick={addQuestion}
                        disabled={
                          !newQuestion.text ||
                          (newQuestion.type === 'multiple_choice' &&
                            newQuestion.options.filter(opt => opt.trim() !== '').length < 2)
                        }
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white ${
                          !newQuestion.text ||
                          (newQuestion.type === 'multiple_choice' &&
                            newQuestion.options.filter(opt => opt.trim() !== '').length < 2)
                            ? darkMode
                              ? 'bg-gray-600 cursor-not-allowed'
                              : 'bg-gray-300 cursor-not-allowed'
                            : darkMode
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiPlus size={16} /> Add Question
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Create quiz btn */}
                  <div className="flex justify-end mt-4">
                    <motion.button
                      onClick={addQuiz}
                      disabled={!newQuiz.title || newQuiz.questions.length === 0}
                      className={`px-5 py-2.5 rounded-lg text-white font-medium ${
                        !newQuiz.title || newQuiz.questions.length === 0
                          ? darkMode
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-gray-300 cursor-not-allowed'
                          : darkMode
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Create Quiz
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Right column: quiz list */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.div
            variants={itemVariants}
            className={`p-5 rounded-xl shadow-md ${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}
          >
            <h3 className="font-semibold text-lg mb-4">Available Quizzes</h3>

            <div className="space-y-3">
              <AnimatePresence>
                {loading ? (
                  <div className="text-center py-6 text-sm text-gray-400 animate-pulse">
                    Loading quizzes…
                  </div>
                ) : quizzes.length > 0 ? (
                  quizzes.map((quiz) => (
                    <motion.div
                      key={quiz._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      whileHover="hover"
                      whileTap="tap"
                      variants={cardVariants}
                      className={`p-4 rounded-lg cursor-pointer border transition-colors ${
                        darkMode
                          ? 'bg-gray-600 hover:bg-gray-550 border-gray-500'
                          : 'bg-white hover:bg-gray-50 border-gray-200'
                      }`}
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

                      {/* Small tag preview */}
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
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                      No quizzes created yet
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsAddingQuiz(true)}
                      className={`mt-3 px-4 py-2 rounded-lg text-sm text-white ${
                        darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                      }`}
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

      {/* Preview modal */}
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
              className={`w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div
                className={`p-5 flex justify-between items-center border-b ${
                  darkMode ? 'border-gray-600' : 'border-gray-200'
                }`}
              >
                <h3 className="font-semibold text-xl">{activeQuiz.title}</h3>
                <motion.button
                  onClick={() => setActiveQuiz(null)}
                  className={`p-1.5 rounded-full transition-colors ${
                    darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                  }`}
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiX size={20} />
                </motion.button>
              </div>

              {/* Questions */}
              <div className="max-h-[70vh] overflow-y-auto p-5">
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                  {activeQuiz.questions.map((q, idx) => (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      className={`p-4 rounded-lg shadow-sm mb-3 ${
                        darkMode ? 'bg-gray-600' : 'bg-gray-50'
                      }`}
                    >
                      <p className="font-medium flex items-start gap-2 mb-2">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-sm ${
                            darkMode ? 'bg-gray-500 text-white' : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        {q.text}
                      </p>

                      {q.type === 'multiple_choice' ? (
                        <div className="space-y-2">
                          {q.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                                darkMode ? 'hover:bg-gray-500' : 'hover:bg-gray-100'
                              } ${
                                q.correctAnswer === oIdx
                                  ? darkMode
                                    ? 'bg-green-900/30 border border-green-500'
                                    : 'bg-green-100 border border-green-300'
                                  : ''
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                  darkMode ? 'border-gray-400' : 'border-gray-500'
                                } ${
                                  q.correctAnswer === oIdx
                                    ? darkMode
                                      ? 'bg-green-500 border-green-500'
                                      : 'bg-green-400 border-green-400'
                                    : ''
                                }`}
                              >
                                {q.correctAnswer === oIdx && (
                                  <FiCheck size={12} className="text-white" />
                                )}
                              </div>
                              <span>{opt}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {[true, false].map((val) => (
                            <div
                              key={val.toString()}
                              className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                                darkMode ? 'hover:bg-gray-500' : 'hover:bg-gray-100'
                              } ${
                                q.correctAnswer === val
                                  ? darkMode
                                    ? 'bg-green-900/30 border border-green-500'
                                    : 'bg-green-100 border border-green-300'
                                  : ''
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                  darkMode ? 'border-gray-400' : 'border-gray-500'
                                } ${
                                  q.correctAnswer === val
                                    ? darkMode
                                      ? 'bg-green-500 border-green-500'
                                      : 'bg-green-400 border-green-400'
                                    : ''
                                }`}
                              >
                                {q.correctAnswer === val && (
                                  <FiCheck size={12} className="text-white" />
                                )}
                              </div>
                              <span>{val ? 'True' : 'False'}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Modal footer */}
              <div
                className={`p-4 flex justify-end border-t ${
                  darkMode ? 'border-gray-600' : 'border-gray-200'
                }`}
              >
                <motion.button
                  onClick={() => setActiveQuiz(null)}
                  className={`px-5 py-2 rounded-lg transition-colors ${
                    darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
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