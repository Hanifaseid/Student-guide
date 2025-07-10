import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StudyHub = ({ darkMode = true }) => {
  // State
  const [activeTab, setActiveTab] = useState('notes');
  const [notes, setNotes] = useState([
    { id: 1, title: 'React Basics', content: 'React is a JavaScript library for building user interfaces...', tags: ['react', 'frontend'] },
    { id: 2, title: 'CSS Frameworks', content: 'Tailwind CSS is a utility-first CSS framework...', tags: ['css', 'tailwind'] },
  ]);
  const [newNote, setNewNote] = useState({ title: '', content: '', tags: '' });
  const [activeNote, setActiveNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotesList, setShowNotesList] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);

  const [resources, setResources] = useState([
    { id: 1, title: 'React Documentation', type: 'website', subject: 'React', url: 'https://reactjs.org/docs/getting-started.html ', description: 'Official React documentation with guides and API reference', bookmarked: true },
    { id: 2, title: 'Tailwind CSS Crash Course', type: 'video', subject: 'CSS', url: 'https://www.youtube.com/watch?v=UBOj6rqRUME', description: 'Learn Tailwind CSS fundamentals in this YouTube tutorial', bookmarked: false },
    { id: 3, title: 'JavaScript: The Good Parts', type: 'book', subject: 'JavaScript', url: ' https://www.oreilly.com/library/view/javascript-the-good/9780596517748/ ', description: 'Classic book about JavaScript best practices', bookmarked: true }
  ]);
  const [newResource, setNewResource] = useState({ title: '', type: 'website', subject: '', url: '', description: '' });
  const [resourceFilter, setResourceFilter] = useState({ type: 'all', subject: 'all', bookmarked: false });

  // Effects
  useEffect(() => {
    if (notes.length > 0 && !activeNote && activeTab === 'notes') {
      setActiveNote(notes[notes.length - 1]);
    }
  }, [notes, activeNote, activeTab]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, when: "beforeChildren" }
    }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  // Notes functions
  const addNote = () => {
    if (newNote.title && newNote.content) {
      const tagsArray = newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const note = { ...newNote, id: Date.now(), tags: tagsArray };
      setNotes([...notes, note]);
      setNewNote({ title: '', content: '', tags: '' });
      setActiveNote(note);
      setShowAddNote(false);
    }
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleNotesList = () => {
    setShowNotesList(!showNotesList);
    setShowAddNote(false);
  };

  const toggleAddNote = () => {
    setShowAddNote(!showAddNote);
    setShowNotesList(false);
  };

  const truncateContent = (content, maxLength = 100) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  // Resources functions
  const addResource = () => {
    if (newResource.title && newResource.url) {
      setResources([...resources, { ...newResource, id: Date.now(), bookmarked: false }]);
      setNewResource({ title: '', type: 'website', subject: '', url: '', description: '' });
    }
  };

  const toggleBookmark = (id) => {
    setResources(resources.map(resource => 
      resource.id === id ? { ...resource, bookmarked: !resource.bookmarked } : resource
    ));
  };

  const subjects = [...new Set(resources.map(resource => resource.subject))];

  const filteredResources = resources.filter(resource => {
    return (
      (resourceFilter.type === 'all' || resource.type === resourceFilter.type) &&
      (resourceFilter.subject === 'all' || resource.subject === resourceFilter.subject) &&
      (!resourceFilter.bookmarked || resource.bookmarked)
    );
  });

  return (
    <div className={`min-h-screen p-4 md:p-6 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600"
          >
            Study Hub
          </motion.h2>

          {/* Tab Buttons */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, x: -10 },
              visible: { opacity: 1, x: 0 }
            }}
            className={`flex rounded-lg p-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}
          >
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-4 py-2 rounded-md transition-all duration-300 ${
                activeTab === 'notes'
                  ? `${darkMode ? 'bg-gray-700 shadow-lg' : 'bg-white shadow-md'} text-blue-500 font-medium`
                  : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
              }`}
            >
              Notes
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-4 py-2 rounded-md transition-all duration-300 ${
                activeTab === 'resources'
                  ? `${darkMode ? 'bg-gray-700 shadow-lg' : 'bg-white shadow-md'} text-blue-500 font-medium`
                  : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
              }`}
            >
              Resources
            </button>
          </motion.div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'notes' ? (
            <motion.div
              key="notes"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl w-full`}
            >
              <div className="p-6 w-full">
                <div className="flex justify-between items-center mb-6 w-full">
                  <motion.h3 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-semibold"
                  >
                    Note Organizer
                  </motion.h3>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleNotesList}
                      className={`px-4 py-2 cursor-pointer rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-all duration-300 shadow`}
                    >
                      Your Notes
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleAddNote}
                      className={`px-4 py-2 cursor-pointer rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-all duration-300 shadow`}
                    >
                      Add Note
                    </motion.button>
                  </div>
                </div>

                {/* Add Note Form */}
                <AnimatePresence>
                  {showAddNote && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`rounded-xl overflow-hidden mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} shadow-lg w-full`}
                    >
                      <div className="p-6 w-full">
                        <motion.h3 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="font-semibold mb-4 text-lg"
                        >
                          Create New Note
                        </motion.h3>
                        <div className="space-y-4 w-full">
                          <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.2 }}
                          >
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                              type="text"
                              value={newNote.title}
                              onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                              placeholder="Title"
                              className={`w-full p-3 rounded-lg ${darkMode ? 'bg-gray-600 placeholder-gray-400 focus:ring-blue-500' : 'bg-white placeholder-gray-500 focus:ring-blue-400'} focus:outline-none focus:ring-2 transition-all duration-200`}
                            />
                          </motion.div>
                          <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.3 }}
                          >
                            <label className="block text-sm font-medium mb-1">Content</label>
                            <textarea
                              value={newNote.content}
                              onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                              placeholder="Content (markdown supported)"
                              rows="5"
                              className={`w-full p-3 rounded-lg ${darkMode ? 'bg-gray-600 placeholder-gray-400 focus:ring-blue-500' : 'bg-white placeholder-gray-500 focus:ring-blue-400'} focus:outline-none focus:ring-2 transition-all duration-200`}
                            />
                          </motion.div>
                          <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.4 }}
                          >
                            <label className="block text-sm font-medium mb-1">Tags</label>
                            <input
                              type="text"
                              value={newNote.tags}
                              onChange={(e) => setNewNote({...newNote, tags: e.target.value})}
                              placeholder="Tags (comma separated)"
                              className={`w-full p-3 rounded-lg ${darkMode ? 'bg-gray-600 placeholder-gray-400 focus:ring-blue-500' : 'bg-white placeholder-gray-500 focus:ring-blue-400'} focus:outline-none focus:ring-2 transition-all duration-200`}
                            />
                          </motion.div>
                          <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.5 }}
                            className="flex justify-end space-x-3"
                          >
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setShowAddNote(false)}
                              className={`px-5 py-2 cursor-pointer rounded-lg ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'} transition-all duration-200 shadow`}
                            >
                              Cancel
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={addNote}
                              className={`px-5 py-2 cursor-pointer rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-all duration-200 shadow`}
                            >
                              Save Note
                            </motion.button>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Notes List */}
                <AnimatePresence>
                  {showNotesList && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`rounded-xl overflow-hidden mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} shadow-lg w-full`}
                    >
                      <div className="p-6 w-full">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 w-full">
                          <motion.h3 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="font-semibold text-lg"
                          >
                            Your Notes
                          </motion.h3>
                          <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="relative w-full md:w-96"
                          >
                            <input
                              type="text"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              placeholder="Search notes..."
                              className={`w-full p-3 pl-10 rounded-lg ${darkMode ? 'bg-gray-600 placeholder-gray-400 focus:ring-blue-500' : 'bg-white placeholder-gray-500 focus:ring-blue-400'} focus:outline-none focus:ring-2 transition-all duration-200`}
                            />
                            <svg
                              className={`absolute left-3 top-3.5 h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </motion.div>
                        </div>
                        <motion.div 
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full"
                        >
                          {filteredNotes.length > 0 ? (
                            filteredNotes.map((note) => (
                              <motion.div
                                key={note.id}
                                variants={itemVariants}
                                whileHover={{ y: -5, boxShadow: darkMode ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)' : '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                onClick={() => {
                                  setActiveNote(note);
                                  setShowNotesList(false);
                                }}
                                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${darkMode ? 'bg-gray-600 hover:bg-gray-550' : 'bg-white hover:bg-gray-50'} border ${darkMode ? 'border-gray-500' : 'border-gray-200'} shadow-sm w-full`}
                              >
                                <div className="flex justify-between items-start">
                                  <h4 className="font-semibold truncate">{note.title}</h4>
                                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {new Date(note.id).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'} line-clamp-2`}>
                                  {truncateContent(note.content)}
                                </p>
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                  {note.tags.map((tag, index) => (
                                    <motion.span 
                                      key={index}
                                      whileHover={{ scale: 1.05 }}
                                      className={`px-2 py-1 text-xs rounded-full ${darkMode ? 'bg-gray-500 text-gray-200' : 'bg-gray-200 text-gray-700'}`}
                                    >
                                      {tag}
                                    </motion.span>
                                  ))}
                                </div>
                              </motion.div>
                            ))
                          ) : (
                            <motion.div
                              variants={itemVariants}
                              initial="hidden"
                              animate="visible"
                              className="col-span-full text-center py-8 w-full"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {searchTerm ? 'No matching notes found' : 'No notes available'}
                              </p>
                            </motion.div>
                          )}
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Active Note View */}
                <AnimatePresence>
                  {activeNote && !showAddNote && !showNotesList && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} shadow-lg w-full`}
                    >
                      <div className="p-6 w-full">
                        <div className="flex justify-between items-center mb-6 w-full">
                          <motion.h3 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="font-semibold text-2xl"
                          >
                            {activeNote.title}
                          </motion.h3>
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={toggleNotesList}
                              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} transition-all duration-200`}
                              title="View all notes"
                            >
                              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                              </svg>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={toggleAddNote}
                              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} transition-all duration-200`}
                              title="Add new note"
                            >
                              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </motion.button>
                          </div>
                        </div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className={`p-5 rounded-lg mb-6 ${darkMode ? 'bg-gray-600' : 'bg-white'} shadow-inner w-full`}
                        >
                          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: activeNote.content }} />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="flex flex-wrap gap-2 mb-6 w-full"
                        >
                          {activeNote.tags.map((tag, index) => (
                            <motion.span
                              key={index}
                              whileHover={{ scale: 1.05 }}
                              className={`px-3 py-1 text-xs rounded-full ${darkMode ? 'bg-gray-500 text-gray-200' : 'bg-gray-200 text-gray-700'} shadow`}
                            >
                              {tag}
                            </motion.span>
                          ))}
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className={`pt-4 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'} w-full`}
                        >
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Created: {new Date(activeNote.id).toLocaleString()}
                          </p>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="resources"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl w-full`}
            >
              <div className="p-6 w-full">
                <motion.h3 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-2xl font-semibold mb-6 text-center"
                >
                  Study Resources Hub
                </motion.h3>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full">
                  <div className="lg:col-span-1 space-y-6 w-full">
                    {/* Add Resource Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className={`p-5 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-lg w-full`}
                    >
                      <motion.h3 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="font-semibold text-lg mb-4"
                      >
                        Add New Resource
                      </motion.h3>
                      <div className="space-y-4 w-full">
                        <motion.div
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: 0.4 }}
                        >
                          <label className="block text-sm font-medium mb-1">Title</label>
                          <input
                            type="text"
                            value={newResource.title}
                            onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                            placeholder="Resource title"
                            className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white focus:ring-blue-500' : 'bg-white border-gray-300 focus:ring-blue-400'} focus:outline-none focus:ring-2 transition-all duration-200`}
                          />
                        </motion.div>
                        <motion.div
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: 0.5 }}
                        >
                          <label className="block text-sm font-medium mb-1">Type</label>
                          <select
                            value={newResource.type}
                            onChange={(e) => setNewResource({...newResource, type: e.target.value})}
                            className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white focus:ring-blue-500' : 'bg-white border-gray-300 focus:ring-blue-400'} focus:outline-none focus:ring-2 transition-all duration-200 cursor-pointer`}
                          >
                            <option value="website">Website</option>
                            <option value="video">Video</option>
                            <option value="book">Book</option>
                            <option value="article">Article</option>
                            <option value="podcast">Podcast</option>
                            <option value="pdf">PDF</option>
                          </select>
                        </motion.div>
                        <motion.div
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: 0.6 }}
                        >
                          <label className="block text-sm font-medium mb-1">Subject</label>
                          <input
                            type="text"
                            value={newResource.subject}
                            onChange={(e) => setNewResource({...newResource, subject: e.target.value})}
                            placeholder="Subject (e.g., Math, Science)"
                            className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white focus:ring-blue-500' : 'bg-white border-gray-300 focus:ring-blue-400'} focus:outline-none focus:ring-2 transition-all duration-200`}
                          />
                        </motion.div>
                        <motion.div
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: 0.7 }}
                        >
                          <label className="block text-sm font-medium mb-1">URL</label>
                          <input
                            type="url"
                            value={newResource.url}
                            onChange={(e) => setNewResource({...newResource, url: e.target.value})}
                            placeholder="URL"
                            className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white focus:ring-blue-500' : 'bg-white border-gray-300 focus:ring-blue-400'} focus:outline-none focus:ring-2 transition-all duration-200`}
                          />
                        </motion.div>
                        <motion.div
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: 0.8 }}
                        >
                          <label className="block text-sm font-medium mb-1">Description</label>
                          <textarea
                            value={newResource.description}
                            onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                            placeholder="Description"
                            className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white focus:ring-blue-500' : 'bg-white border-gray-300 focus:ring-blue-400'} focus:outline-none focus:ring-2 transition-all duration-200`}
                            rows="3"
                          />
                        </motion.div>
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.9 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={addResource}
                          className={`w-full px-4 py-3 rounded-xl transition-all duration-200 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium shadow-md hover:shadow-lg cursor-pointer`}
                        >
                          Add Resource
                        </motion.button>
                      </div>
                    </motion.div>

                    {/* Filters Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className={`p-5 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-lg w-full`}
                    >
                      <motion.h3 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="font-semibold text-lg mb-4"
                      >
                        Filters
                      </motion.h3>
                      <div className="space-y-4 w-full">
                        <motion.div
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: 0.5 }}
                        >
                          <label className="block text-sm font-medium mb-1">Type</label>
                          <select
                            value={resourceFilter.type}
                            onChange={(e) => setResourceFilter({...resourceFilter, type: e.target.value})}
                            className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white focus:ring-blue-500' : 'bg-white border-gray-300 focus:ring-blue-400'} focus:outline-none focus:ring-2 transition-all duration-200 cursor-pointer`}
                          >
                            <option value="all">All Types</option>
                            <option value="website">Website</option>
                            <option value="video">Video</option>
                            <option value="book">Book</option>
                            <option value="article">Article</option>
                            <option value="podcast">Podcast</option>
                            <option value="pdf">PDF</option>
                          </select>
                        </motion.div>
                        <motion.div
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: 0.6 }}
                        >
                          <label className="block text-sm font-medium mb-1">Subject</label>
                          <select
                            value={resourceFilter.subject}
                            onChange={(e) => setResourceFilter({...resourceFilter, subject: e.target.value})}
                            className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white focus:ring-blue-500' : 'bg-white border-gray-300 focus:ring-blue-400'} focus:outline-none focus:ring-2 transition-all duration-200 cursor-pointer`}
                          >
                            <option value="all">All Subjects</option>
                            {subjects.map((subject, index) => (
                              <option key={index} value={subject}>{subject}</option>
                            ))}
                          </select>
                        </motion.div>
                        <motion.div
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: 0.7 }}
                          className="flex items-center"
                        >
                          <input
                            type="checkbox"
                            id="bookmarked"
                            checked={resourceFilter.bookmarked}
                            onChange={(e) => setResourceFilter({...resourceFilter, bookmarked: e.target.checked})}
                            className={`mr-2 rounded ${darkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'} cursor-pointer h-5 w-5 focus:ring-blue-500`}
                          />
                          <label htmlFor="bookmarked" className="cursor-pointer">Bookmarked Only</label>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Resources List */}
                  <div className="lg:col-span-3 w-full">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className={`p-5 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-lg w-full`}
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 w-full">
                        <motion.h3 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="font-semibold text-lg"
                        >
                          Resources
                        </motion.h3>
                        <motion.span 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className={`px-4 py-2 rounded-full text-sm font-medium ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} shadow-inner`}
                        >
                          {filteredResources.length} {filteredResources.length === 1 ? 'item' : 'items'}
                        </motion.span>
                      </div>
                      {filteredResources.length > 0 ? (
                        <motion.div
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full"
                        >
                          {filteredResources.map((resource) => (
                            <motion.div
                              key={resource.id}
                              variants={itemVariants}
                              whileHover={{ y: -5, boxShadow: darkMode ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)' : '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                              className={`p-5 rounded-xl transition-all duration-300 ${darkMode ? 'bg-gray-600 hover:bg-gray-550' : 'bg-white hover:bg-gray-50'} border ${darkMode ? 'border-gray-500' : 'border-gray-200'} shadow-sm w-full`}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="font-semibold text-lg truncate">{resource.title}</h4>
                                <motion.button
                                  whileHover={{ scale: 1.2 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => toggleBookmark(resource.id)}
                                  className={`p-1 rounded-full transition-colors duration-200 ${resource.bookmarked ? 'text-yellow-400 hover:text-yellow-500' : darkMode ? 'text-gray-400 hover:text-yellow-400' : 'text-gray-300 hover:text-yellow-400'} cursor-pointer`}
                                  aria-label={resource.bookmarked ? "Remove bookmark" : "Add bookmark"}
                                >
                                  {resource.bookmarked ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                    </svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                                    </svg>
                                  )}
                                </motion.button>
                              </div>
                              <div className="flex flex-wrap gap-2 my-3">
                                <motion.span 
                                  whileHover={{ scale: 1.05 }}
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-gray-500' : 'bg-gray-200'} shadow-inner`}
                                >
                                  {resource.type}
                                </motion.span>
                                <motion.span 
                                  whileHover={{ scale: 1.05 }}
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-gray-500' : 'bg-gray-200'} shadow-inner`}
                                >
                                  {resource.subject}
                                </motion.span>
                              </div>
                              <p className="text-sm mb-4 line-clamp-2">{resource.description}</p>
                              <motion.a 
                                whileHover={{ x: 3 }}
                                href={resource.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={`text-sm font-medium inline-flex items-center ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition-colors duration-200 cursor-pointer`}
                              >
                                Visit Resource
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                              </motion.a>
                            </motion.div>
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="text-center py-12 w-full"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                            No resources match your filters
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            Try adjusting your filters or add new resources
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default StudyHub;