import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowLeft,
  FiThumbsUp,
  FiMessageSquare,
  FiSearch,
  FiPlus,
  FiChevronDown,
  FiChevronUp,
  FiX
} from 'react-icons/fi';

const API_URL = 'http://localhost:5000/api/topics';

const DiscussionForum = ({ darkMode = true }) => {
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState({
    title: '',
    subject: '',
    content: '',
    tags: []
  });
  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [newReply, setNewReply] = useState({
    content: '',
    topicId: null
  });
  const [activeTopic, setActiveTopic] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [expandedReplies, setExpandedReplies] = useState({});
  const [isScrolled, setIsScrolled] = useState(false);

  // Fetch topics on mount
  useEffect(() => {
    fetchTopics();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchTopics = async () => {
    try {
      const res = await axios.get(API_URL);
      setTopics(res.data);
    } catch (err) {
      console.error('Failed to fetch topics:', err);
    }
  };

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
  };

  // Add a new tag to the newTopic.tags list
  const addTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !newTopic.tags.includes(trimmedTag)) {
      setNewTopic({ ...newTopic, tags: [...newTopic.tags, trimmedTag] });
    }
    setNewTag('');
    setShowTagInput(false);
  };

  const removeTag = (tagToRemove) => {
    setNewTopic({
      ...newTopic,
      tags: newTopic.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Add a new topic
  const addTopic = async () => {
    if (newTopic.title && newTopic.subject && newTopic.content) {
      try {
        const topicData = {
          ...newTopic,
          id: Date.now(),
          author: 'You',
          authorAvatar: 'Y',
          date: new Date().toISOString().split('T')[0],
          replies: [],
          upvotes: 0,
          views: 0
        };
        const res = await axios.post(API_URL, topicData);
        setTopics([res.data, ...topics]);
        setNewTopic({ title: '', subject: '', content: '', tags: [] });
        setNewTag('');
        setShowTagInput(false);
      } catch (err) {
        console.error('Failed to add topic:', err);
      }
    }
  };

  // Add a reply to a topic
  const addReply = async () => {
    if (newReply.content && newReply.topicId) {
      try {
        const replyData = {
          id: Date.now(),
          author: 'You',
          authorAvatar: 'Y',
          date: new Date().toISOString().split('T')[0],
          content: newReply.content,
          upvotes: 0
        };
        const res = await axios.post(`${API_URL}/${newReply.topicId}/reply`, replyData);
        setTopics(topics.map(topic => (topic._id === newReply.topicId ? res.data : topic)));
        setNewReply({ content: '', topicId: null });
      } catch (err) {
        console.error('Failed to add reply:', err);
      }
    }
  };

  // Upvote topic
  const upvoteTopic = async (id) => {
    try {
      const res = await axios.post(`${API_URL}/${id}/upvote`);
      setTopics(topics.map(topic => (topic._id === id ? res.data : topic)));
      if (activeTopic && activeTopic._id === id) {
        setActiveTopic(res.data);
      }
    } catch (err) {
      console.error('Failed to upvote topic:', err);
    }
  };

  // Upvote reply
  const upvoteReply = async (topicId, replyId) => {
    try {
      const res = await axios.post(`${API_URL}/${topicId}/reply/${replyId}/upvote`);
      setTopics(topics.map(topic => (topic._id === topicId ? res.data : topic)));
      if (activeTopic && activeTopic._id === topicId) {
        setActiveTopic(res.data);
      }
    } catch (err) {
      console.error('Failed to upvote reply:', err);
    }
  };

  // Toggle long replies
  const toggleReplyExpansion = (replyId) => {
    setExpandedReplies(prev => ({
      ...prev,
      [replyId]: !prev[replyId]
    }));
  };

  // Open a topic
  const openTopic = async (topic) => {
    try {
      await axios.post(`${API_URL}/${topic._id}/view`);
      const updatedTopic = await axios.get(`${API_URL}/${topic._id}`);
      setActiveTopic(updatedTopic.data);
      setTopics(topics.map(t => (t._id === topic._id ? updatedTopic.data : t)));
    } catch (err) {
      console.error('Failed to load topic:', err);
    }
  };

  // Filter and sort topics
  const filteredTopics = topics.filter(topic => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (topic.tags &&
        topic.tags.some(tag =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    const matchesSubject = selectedSubject === 'all' || topic.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const sortedTopics = [...filteredTopics].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'most-upvotes') return b.upvotes - a.upvotes;
    if (sortBy === 'most-replies') return b.replies.length - a.replies.length;
    return 0;
  });

  // Subjects and tags lists
  const subjects = ['all', ...Array.from(new Set(topics.map(topic => topic.subject).filter(Boolean)))];
  const allTags = [...new Set(topics.flatMap(topic => topic.tags || []))];

  // Scroll to top
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, when: 'beforeChildren' }
    }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 10 } }
  };
  const cardVariants = {
    hover: {
      y: -5,
      boxShadow: darkMode
        ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
        : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.98 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}
    >
      {/* Header */}
      <motion.div
        className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold flex items-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
          >
            <FiMessageSquare className="mr-2" />
            Peer Study Forum
          </motion.h1>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        {!activeTopic ? (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 order-2 lg:order-1">
              <motion.div
                variants={itemVariants}
                className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-sm mb-6`}
              >
                {/* Search and filters */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="relative flex-grow">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <motion.input
                      type="text"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      placeholder="Search topics..."
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-500'}`}
                      whileFocus={{ scale: 1.01 }}
                    />
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-1 min-w-[120px]">
                      <motion.select
                        value={selectedSubject}
                        onChange={e => setSelectedSubject(e.target.value)}
                        className={`appearance-none w-full p-2.5 pr-8 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                        whileHover={{ scale: 1.01 }}
                      >
                        {subjects.map((subj, idx) => (
                          <option key={idx} value={subj}>{subj.charAt(0).toUpperCase() + subj.slice(1)}</option>
                        ))}
                      </motion.select>
                      <div className={`absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <FiChevronDown />
                      </div>
                    </div>

                    <div className="relative flex-1 min-w-[140px]">
                      <motion.select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        className={`appearance-none w-full p-2.5 pr-8 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                        whileHover={{ scale: 1.01 }}
                      >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="most-upvotes">Most Upvoted</option>
                        <option value="most-replies">Most Replies</option>
                      </motion.select>
                      <div className={`absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <FiChevronDown />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Topics List */}
                {sortedTopics.length > 0 ? (
                  <motion.ul className="space-y-4" variants={containerVariants}>
                    {sortedTopics.map(topic => (
                      <motion.li
                        key={topic._id || topic.id}
                        variants={itemVariants}
                        className={`p-4 rounded-lg cursor-pointer flex justify-between items-center border ${darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-white border-gray-200 hover:bg-gray-100'}`}
                        onClick={() => openTopic(topic)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div>
                          <h3 className="font-semibold text-lg">{topic.title}</h3>
                          <div className="flex flex-wrap items-center gap-2 text-sm mt-1">
                            <span className={`px-2.5 py-1 rounded-full ${darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'}`}>
                              {topic.subject}
                            </span>
                            {topic.tags && topic.tags.map((tag, idx) => (
                              <span key={idx} className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <FiThumbsUp className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                            <span>{topic.upvotes}</span>
                          </div>
                          <div>{topic.replies.length} replies</div>
                        </div>
                      </motion.li>
                    ))}
                  </motion.ul>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 rounded-lg"
                  >
                    <p className="text-lg mb-2">No discussion topics found</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Try adjusting your search or create a new topic
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setNewTopic({ title: '', subject: '', content: '', tags: [] })}
                      className={`mt-3 px-4 py-2 rounded-lg ${
                        darkMode
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-blue-500 hover:bg-blue-600'
                      } text-white text-sm`}
                    >
                      Create Your First Topic
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              <motion.div
                variants={itemVariants}
                className={`sticky top-24 p-6 rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-sm`}
              >
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <FiPlus className="mr-2" /> Start New Topic
                </h3>
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Title
                    </label>
                    <motion.input
                      type="text"
                      value={newTopic.title}
                      onChange={e => setNewTopic({ ...newTopic, title: e.target.value })}
                      placeholder="Enter topic title"
                      className={`w-full p-2.5 rounded-lg border ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 placeholder-gray-500'
                      }`}
                      whileFocus={{ scale: 1.01 }}
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Subject
                    </label>
                    <div className="relative">
                      <motion.select
                        value={newTopic.subject === 'new' ? 'new' : newTopic.subject}
                        onChange={e => setNewTopic({ ...newTopic, subject: e.target.value })}
                        className={`appearance-none w-full p-2.5 pr-8 rounded-lg border ${
                          darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                        }`}
                        whileHover={{ scale: 1.01 }}
                      >
                        <option value="">Select subject</option>
                        {[...new Set(topics.map(t => t.subject).filter(Boolean))].map((subject, index) => (
                          <option key={index} value={subject}>
                            {subject}
                          </option>
                        ))}
                        <option value="new">+ Add new subject</option>
                      </motion.select>
                      <div
                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        <FiChevronDown />
                      </div>
                    </div>
                  </div>

                  {/* New Subject Input */}
                  {newTopic.subject === 'new' && (
                    <div>
                      <label
                        className={`block text-sm mb-1.5 ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        New Subject
                      </label>
                    <motion.input
  type="text"
  value={newTopic.newSubject || ''}
  onChange={e =>
    setNewTopic({ ...newTopic, newSubject: e.target.value })
  }
  placeholder="Enter new subject"
  className={`w-full p-2.5 rounded-lg border ${
    darkMode
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
      : 'bg-white border-gray-300 placeholder-gray-500'
  }`}
  whileFocus={{ scale: 1.01 }}
/>

                    </div>
                  )}

                  {/* Tags */}
                  <div>
                    <label
                      className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-600'} `}
                    >
                      Tags
                    </label>
                    <div
                      className={`p-2 rounded-lg border ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                      }`}
                    >
                      <div className="flex flex-wrap gap-2 mb-2 min-h-[40px]">
                        {newTopic.tags.map((tag, index) => (
                          <motion.div
                            key={index}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${
                              darkMode
                                ? 'bg-gray-600 text-gray-200'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            #{tag}
                            <motion.button
                              onClick={() => removeTag(tag)}
                              className="ml-1.5 cursor-pointer hover:text-red-400"
                              type="button"
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <FiX size={12} />
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>

                      {/* Tag Input Field */}
                      {showTagInput ? (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="text"
                            value={newTag}
                            onChange={e => setNewTag(e.target.value)}
                            placeholder="Add tag..."
                            className={`flex-grow p-2 rounded-lg border ${
                              darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'
                            }`}
                            autoFocus
                            onKeyPress={e => e.key === 'Enter' && addTag()}
                          />
                          <motion.button
                            onClick={addTag}
                            className={`p-2 rounded-full ${
                              darkMode
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-blue-500 hover:bg-blue-600'
                            } text-white`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FiPlus />
                          </motion.button>
                        </motion.div>
                      ) : (
                        <motion.button
                          onClick={() => setShowTagInput(true)}
                          className={`text-sm flex items-center ${
                            darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                          }`}
                          whileHover={{ x: 2 }}
                          type="button"
                        >
                          <FiPlus className="mr-1" /> Add tag
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <label
                      className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                      Content
                    </label>
                    <motion.textarea
                      value={newTopic.content}
                      onChange={e =>
                        setNewTopic({ ...newTopic, content: e.target.value })
                      }
                      placeholder="Your question or discussion topic (markdown supported)"
                      className={`w-full p-2.5 rounded-lg border ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 placeholder-gray-500'
                      }`}
                      rows="5"
                      whileFocus={{ scale: 1.01 }}
                    />
                  </div>

                  {/* Post Button */}
                  <motion.button
                    onClick={addTopic}
                    disabled={!newTopic.title || !newTopic.subject || !newTopic.content}
                    className={`w-full py-2.5 rounded-lg font-medium text-lg transition-all ${
                      !newTopic.title || !newTopic.subject || !newTopic.content
                        ? darkMode
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-gray-300 cursor-not-allowed'
                        : darkMode
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                    } text-white shadow-md`}
                    whileHover={{
                      scale:
                        !newTopic.title ||
                        !newTopic.subject ||
                        !newTopic.content
                          ? 1
                          : 1.02
                    }}
                    whileTap={{
                      scale:
                        !newTopic.title ||
                        !newTopic.subject ||
                        !newTopic.content
                          ? 1
                          : 0.98
                    }}
                  >
                    Post Topic
                  </motion.button>
                </div>
              </motion.div>

              {/* Popular Tags */}
              <motion.div
                variants={itemVariants}
                className={`mt-4 p-6 rounded-xl ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                } border shadow-sm`}
              >
                <h3 className="font-semibold text-lg mb-3">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 15).map((tag, index) => (
                    <motion.span
                      key={index}
                      className={`px-2.5 py-1 rounded-full text-xs cursor-pointer transition-colors ${
                        darkMode
                          ? 'bg-gray-700 hover:bg-gray-600 text-blue-400'
                          : 'bg-gray-200 hover:bg-gray-300 text-blue-600'
                      }`}
                      onClick={() => setSearchTerm(tag)}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      #{tag}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          /* View Active Topic */
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              onClick={() => setActiveTopic(null)}
              className={`mb-6 px-4 py-2 rounded-lg flex items-center transition-colors ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              } shadow-sm`}
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiArrowLeft className="mr-2" />
              Back to topics
            </motion.button>

            <motion.div
              className={`p-6 rounded-xl ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } border shadow-sm mb-6`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Topic Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="font-bold text-2xl mb-2">{activeTopic.title}</h2>
                  <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
                    <span
                      className={`px-2.5 py-1 rounded-full ${
                        darkMode
                          ? 'bg-gray-700 text-gray-100'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {activeTopic.subject}
                    </span>
                    {activeTopic.tags.map((tag, index) => (
                      <motion.span
                        key={index}
                        className={`px-2 py-1 rounded-full text-xs ${
                          darkMode
                            ? 'bg-gray-700 text-gray-300'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        #{tag}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Upvote Button */}
                <motion.button
                  onClick={e => {
                    e.stopPropagation();
                    upvoteTopic(activeTopic._id);
                  }}
                  className={`flex flex-col items-center p-2 rounded-full transition-colors ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiThumbsUp
                    size={20}
                    className={darkMode ? 'text-blue-400' : 'text-blue-500'}
                  />
                  <span className="text-sm mt-1">{activeTopic.upvotes}</span>
                </motion.button>
              </div>

              {/* Author Info */}
              <div
                className={`flex items-center text-sm mb-6 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                    darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {activeTopic.authorAvatar}
                </div>
                <span className="font-medium">{activeTopic.author}</span>
                <span className="mx-2">•</span>
                <span>{activeTopic.date}</span>
                <span className="mx-2">•</span>
                <span>👁️ {activeTopic.views} views</span>
              </div>

              {/* Content */}
              <div
                className={`p-4 rounded-lg mb-6 ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <p className="whitespace-pre-line">{activeTopic.content}</p>
              </div>

              {/* Replies Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">
                  {activeTopic.replies.length}{' '}
                  {activeTopic.replies.length === 1 ? 'Reply' : 'Replies'}
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Sort by:
                  </span>
                  <div className="relative">
                    <motion.select
                      className={`appearance-none p-1.5 pr-6 rounded border ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      } text-sm`}
                      whileHover={{ scale: 1.02 }}
                      value={replySortBy}
                      onChange={e => setReplySortBy(e.target.value)}
                    >
                      <option value="newest">Newest</option>
                      <option value="oldest">Oldest</option>
                      <option value="most-upvotes">Most Upvoted</option>
                    </motion.select>
                    <div
                      className={`absolute right-1.5 top-1.5 pointer-events-none ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      <FiChevronDown size={14} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Replies List */}
              {sortedReplies.length > 0 ? (
                <motion.div className="space-y-4" variants={containerVariants}>
                  {sortedReplies.map(reply => (
                    <motion.div
                      key={reply._id || reply.id}
                      variants={itemVariants}
                      className={`p-4 rounded-lg ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                      } border`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                              darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {reply.authorAvatar}
                          </div>
                          <span className="font-medium">{reply.author}</span>
                          <span className={`mx-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {reply.date}
                          </span>
                        </div>
                        <motion.button
                          onClick={() => upvoteReply(activeTopic._id, reply._id || reply.id)}
                          className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                            darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiThumbsUp size={16} className={darkMode ? 'text-blue-400' : 'text-blue-500'} />
                          <span className="text-sm">{reply.upvotes}</span>
                        </motion.button>
                      </div>
                      <div className="pl-8">
                        <p
                          className={`whitespace-pre-line ${
                            expandedReplies[reply.id] ? '' : 'line-clamp-3'
                          } ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          {reply.content}
                        </p>
                        {reply.content.length > 200 && (
                          <motion.button
                            onClick={() => toggleReplyExpansion(reply.id)}
                            className={`text-sm mt-1 flex items-center ${
                              darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                            }`}
                            whileHover={{ x: 2 }}
                          >
                            {expandedReplies[reply.id] ? (
                              <>
                                <FiChevronUp className="inline mr-1" /> Show less
                              </>
                            ) : (
                              <>
                                <FiChevronDown className="inline mr-1" /> Show more
                              </>
                            )}
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-center py-8 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                >
                  <p className="mb-2">No replies yet</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Be the first to reply to this topic
                  </p>
                </motion.div>
              )}

              {/* Reply Form */}
              <div className="mt-8">
                <h4 className="font-semibold text-lg mb-4">Post Your Reply</h4>
                <motion.textarea
                  value={newReply.topicId === activeTopic._id ? newReply.content : ''}
                  onChange={e => setNewReply({ content: e.target.value, topicId: activeTopic._id })}
                  placeholder="Write your reply here... (markdown supported)"
                  className={`w-full p-3 rounded-lg border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-500'
                  }`}
                  rows="5"
                  whileFocus={{ scale: 1.01 }}
                />
                <div className="flex justify-between items-center mt-3">
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Tip: You can use markdown for formatting
                  </div>
                  <motion.button
                    onClick={addReply}
                    disabled={!newReply.content || newReply.topicId !== activeTopic._id}
                    className={`px-6 py-2.5 rounded-lg font-medium shadow-md ${
                      !newReply.content || newReply.topicId !== activeTopic._id
                        ? darkMode
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-gray-300 cursor-not-allowed'
                        : darkMode
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white`}
                    whileHover={{
                      scale:
                        !newReply.content || newReply.topicId !== activeTopic._id
                          ? 1
                          : 1.02
                    }}
                    whileTap={{
                      scale:
                        !newReply.content || newReply.topicId !== activeTopic._id
                          ? 1
                          : 0.98
                    }}
                  >
                    Post Reply
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {isScrolled && (
          <motion.button
            onClick={scrollToTop}
            className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600 text-blue-400' : 'bg-white hover:bg-gray-100 text-blue-600'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DiscussionForum;
