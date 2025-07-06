import React, { useState, useEffect } from 'react';

const NotesOrganizer = ({ darkMode = true }) => {  // Changed default to true
  const [notes, setNotes] = useState([
    { id: 1, title: 'React Basics', content: 'React is a JavaScript library for building user interfaces...', tags: ['react', 'frontend'] },
    { id: 2, title: 'CSS Frameworks', content: 'Tailwind CSS is a utility-first CSS framework for rapidly building custom designs...', tags: ['css', 'tailwind'] },
  ]);
  const [newNote, setNewNote] = useState({ title: '', content: '', tags: '' });
  const [activeNote, setActiveNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotesList, setShowNotesList] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);

  // Set the most recent note as active by default
  useEffect(() => {
    if (notes.length > 0 && !activeNote) {
      setActiveNote(notes[notes.length - 1]);
    }
  }, [notes, activeNote]);

  const addNote = () => {
    if (newNote.title && newNote.content) {
      const tagsArray = newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const note = { 
        ...newNote, 
        id: Date.now(), 
        tags: tagsArray 
      };
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
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Interactive Notes Organizer</h2>
        <div className="flex space-x-2">
          <button
            onClick={toggleNotesList}
            className={`px-4 py-2 cursor-pointer rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
          >
            Your Notes
          </button>
          <button
            onClick={toggleAddNote}
            className={`px-4 py-2 cursor-pointer rounded ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
          >
            Add Note
          </button>
        </div>
      </div>

      {/* Add Note Section */}
      {showAddNote && (
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-6 transition-all duration-300`}>
          <h3 className="font-semibold mb-3 text-lg">Create New Note</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newNote.title}
              onChange={(e) => setNewNote({...newNote, title: e.target.value})}
              placeholder="Title"
              className={`w-full p-2 rounded ${darkMode ? 'bg-gray-600 placeholder-gray-400' : 'bg-white placeholder-gray-500'}`}
            />
            <textarea
              value={newNote.content}
              onChange={(e) => setNewNote({...newNote, content: e.target.value})}
              placeholder="Content (markdown supported)"
              className={`w-full p-2 rounded ${darkMode ? 'bg-gray-600 placeholder-gray-400' : 'bg-white placeholder-gray-500'}`}
              rows="5"
            />
            <input
              type="text"
              value={newNote.tags}
              onChange={(e) => setNewNote({...newNote, tags: e.target.value})}
              placeholder="Tags (comma separated)"
              className={`w-full p-2 rounded ${darkMode ? 'bg-gray-600 placeholder-gray-400' : 'bg-white placeholder-gray-500'}`}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddNote(false)}
                className={`px-4 py-2 cursor-pointer rounded ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'} transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={addNote}
                className={`px-4 py-2 cursor-pointer rounded ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes List Section */}
      {showNotesList && (
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-6 transition-all duration-300`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg">Your Notes</h3>
            <div className="relative w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search notes..."
                className={`w-full p-2 pl-8 rounded ${darkMode ? 'bg-gray-600 placeholder-gray-400' : 'bg-white placeholder-gray-500'}`}
              />
              <svg
                className={`absolute left-2 top-3 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="space-y-3">
            {filteredNotes.length > 0 ? (
              filteredNotes.map(note => (
                <div 
                  key={note.id} 
                  onClick={() => {
                    setActiveNote(note);
                    setShowNotesList(false);
                  }}
                  className={`p-3 rounded cursor-pointer transition-colors ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-50'} border ${darkMode ? 'border-gray-500' : 'border-gray-200'}`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold">{note.title}</h4>
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(note.id).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {truncateContent(note.content)}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {note.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className={`px-2 py-1 text-xs rounded ${darkMode ? 'bg-gray-500 text-gray-200' : 'bg-gray-200 text-gray-700'}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {searchTerm ? 'No matching notes found' : 'No notes available'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Active Note Section */}
      {activeNote && !showAddNote && !showNotesList && (
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-2xl">{activeNote.title}</h3>
            <div className="flex space-x-2">
              <button
                onClick={toggleNotesList}
                className={`p-2 cursor-pointer rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} transition-colors`}
                title="View all notes"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={toggleAddNote}
                className={`p-2 rounded cursor-pointer ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} transition-colors`}
                title="Add new note"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className={`p-4 rounded ${darkMode ? 'bg-gray-600' : 'bg-white'} mb-4`}>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: activeNote.content }} />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {activeNote.tags.map((tag, index) => (
              <span 
                key={index} 
                className={`px-3 py-1 text-xs rounded-full ${darkMode ? 'bg-gray-500 text-gray-200' : 'bg-gray-200 text-gray-700'}`}
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Created: {new Date(activeNote.id).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesOrganizer;