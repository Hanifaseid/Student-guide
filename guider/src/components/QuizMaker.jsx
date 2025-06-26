
import React, { useState } from 'react';
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
          correctAnswer: 1
        },
        {
          id: 2,
          text: 'React uses JSX for templating.',
          type: 'true_false',
          correctAnswer: true
        }
      ]
    }
  ]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [newQuiz, setNewQuiz] = useState({ title: '', questions: [] });
  const [newQuestion, setNewQuestion] = useState({ text: '', type: 'multiple_choice', options: ['', ''], correctAnswer: 0 });

  const addQuiz = () => {
    if (newQuiz.title) {
      const quiz = { ...newQuiz, id: Date.now() };
      setQuizzes([...quizzes, quiz]);
      setNewQuiz({ title: '', questions: [] });
    }
  };

  const addQuestion = () => {
    if (newQuestion.text && (newQuestion.type === 'true_false' || newQuestion.options.every(opt => opt))) {
      const question = { ...newQuestion, id: Date.now() };
      setNewQuiz({
        ...newQuiz,
        questions: [...newQuiz.questions, question]
      });
      setNewQuestion({ text: '', type: 'multiple_choice', options: ['', ''], correctAnswer: 0 });
    }
  };

  return (
    <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
      <h2 className="text-2xl font-bold mb-6">Quiz Maker & Practice Platform</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-4`}>
            <h3 className="font-semibold mb-3">Create New Quiz</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={newQuiz.title}
                onChange={(e) => setNewQuiz({...newQuiz, title: e.target.value})}
                placeholder="Quiz title"
                className={`w-full p-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
              />
              
              <div className={`p-3 rounded ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                <h4 className="font-semibold mb-2">Add Questions</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newQuestion.text}
                    onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
                    placeholder="Question text"
                    className={`w-full p-2 rounded ${darkMode ? 'bg-gray-500 text-white' : 'bg-gray-100'}`}
                  />
                  
                  <select
                    value={newQuestion.type}
                    onChange={(e) => setNewQuestion({
                      ...newQuestion, 
                      type: e.target.value,
                      options: e.target.value === 'multiple_choice' ? ['', ''] : [],
                      correctAnswer: 0
                    })}
                    className={`w-full p-2 rounded ${darkMode ? 'bg-gray-500 text-white' : 'bg-gray-100'}`}
                  >
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="true_false">True/False</option>
                  </select>
                  
                  {newQuestion.type === 'multiple_choice' && (
                    <div className="space-y-2">
                      {newQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="radio"
                            name="correctOption"
                            checked={newQuestion.correctAnswer === index}
                            onChange={() => setNewQuestion({...newQuestion, correctAnswer: index})}
                            className="mr-2"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...newQuestion.options];
                              newOptions[index] = e.target.value;
                              setNewQuestion({...newQuestion, options: newOptions});
                            }}
                            placeholder={`Option ${index + 1}`}
                            className={`flex-1 p-2 rounded ${darkMode ? 'bg-gray-500 text-white' : 'bg-gray-100'}`}
                          />
                          {newQuestion.options.length > 2 && (
                            <button
                              onClick={() => {
                                const newOptions = [...newQuestion.options];
                                newOptions.splice(index, 1);
                                setNewQuestion({
                                  ...newQuestion, 
                                  options: newOptions,
                                  correctAnswer: Math.min(newQuestion.correctAnswer, newOptions.length - 1)
                                });
                              }}
                              className="ml-2 text-red-500"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => setNewQuestion({
                          ...newQuestion, 
                          options: [...newQuestion.options, '']
                        })}
                        className={`text-sm px-2 py-1 rounded ${darkMode ? 'bg-gray-500 hover:bg-gray-400' : 'bg-gray-200 hover:bg-gray-300'}`}
                      >
                        Add Option
                      </button>
                    </div>
                  )}
                  
                  {newQuestion.type === 'true_false' && (
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="trueFalse"
                          checked={newQuestion.correctAnswer === true}
                          onChange={() => setNewQuestion({...newQuestion, correctAnswer: true})}
                          className="mr-2"
                        />
                        True
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="trueFalse"
                          checked={newQuestion.correctAnswer === false}
                          onChange={() => setNewQuestion({...newQuestion, correctAnswer: false})}
                          className="mr-2"
                        />
                        False
                      </label>
                    </div>
                  )}
                  
                  <button
                    onClick={addQuestion}
                    className={`px-3 py-1 rounded ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white text-sm`}
                  >
                    Add Question
                  </button>
                </div>
              </div>
              
              <button
                onClick={addQuiz}
                disabled={!newQuiz.title || newQuiz.questions.length === 0}
                className={`px-4 py-2 rounded ${(!newQuiz.title || newQuiz.questions.length === 0) ? 
                  (darkMode ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-300 cursor-not-allowed') : 
                  (darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600')} text-white`}
              >
                Create Quiz
              </button>
            </div>
          </div>
        </div>
        
        <div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <h3 className="font-semibold mb-3">Your Quizzes</h3>
            <div className="space-y-3">
              {quizzes.length > 0 ? (
                quizzes.map(quiz => (
                  <div 
                    key={quiz.id} 
                    className={`p-3 rounded cursor-pointer ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-50'} border ${darkMode ? 'border-gray-500' : 'border-gray-200'}`}
                    onClick={() => setActiveQuiz(quiz)}
                  >
                    <h4 className="font-semibold">{quiz.title}</h4>
                    <p className="text-sm mt-1">{quiz.questions.length} questions</p>
                  </div>
                ))
              ) : (
                <p className="text-center py-4">No quizzes created yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {activeQuiz && (
        <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-xl">{activeQuiz.title}</h3>
            <button 
              onClick={() => setActiveQuiz(null)}
              className={`p-1 rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            {activeQuiz.questions.map((question, qIndex) => (
              <div key={question.id} className={`p-3 rounded ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                <p className="font-medium">{qIndex + 1}. {question.text}</p>
                
                {question.type === 'multiple_choice' && (
                  <div className="mt-2 space-y-2">
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-2 border ${darkMode ? 'border-gray-400' : 'border-gray-500'}`} />
                        <span>{option}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {question.type === 'true_false' && (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-2 border ${darkMode ? 'border-gray-400' : 'border-gray-500'}`} />
                      <span>True</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-2 border ${darkMode ? 'border-gray-400' : 'border-gray-500'}`} />
                      <span>False</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizMaker;