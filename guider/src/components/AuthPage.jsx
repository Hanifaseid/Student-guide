import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './Login';
import Register from './Register';

const AuthPage = ({ darkMode }) => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => setIsLogin(prev => !prev);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className={`w-full max-w-md p-8 rounded-xl shadow-lg ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <Login darkMode={darkMode} />
              <p className="mt-6 text-center text-sm">
                Don't have an account?{' '}
                <button
                  onClick={toggleForm}
                  className="font-semibold text-blue-500 hover:underline"
                >
                  Register
                </button>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4 }}
            >
              <Register darkMode={darkMode} />
              <p className="mt-6 text-center text-sm">
                Already have an account?{' '}
                <button
                  onClick={toggleForm}
                  className="font-semibold text-blue-500 hover:underline"
                >
                  Login
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AuthPage;
