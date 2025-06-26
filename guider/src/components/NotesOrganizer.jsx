import React, { useState } from 'react';

const NotesOrganizer = ({ darkMode }) => {
  const [notes, setNotes] = useState([
    { id: 1, title: 'React Basics', content: 'React is a JavaScript library...', tags: ['react', 'frontend'] },
    { id: 2, title: 'CSS Frameworks', content: 'Tailwind CSS is a utility-first framework...', tags: ['css', 'tailwind'] },
  ]);
  const [newNote, setNewNote] = useState({ title: '', content: '', tags: '' });
  const [activeNote, setActiveNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const addNote = () => {
    if (newNote.title && newNote.content) {
      const tagsArray = newNote.tags.split(',').map(tag => tag.trim());
      setNotes([...notes, { 
        ...newNote, 
        id: Date.now(), 
        tags: tagsArray 
      }]);
      setNewNote({ title: '', content: '', tags: '' });
    }
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
      <h2 className="text-2xl font-bold mb-6">Interactive Notes Organizer</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-4`}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notes..."
              className={`w-full p-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
            />
          </div>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-4`}>
            <h3 className="font-semibold mb-3">Add New Note</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={newNote.title}
                onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                placeholder="Title"
                className={`w-full p-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
              />
              <textarea
                value={newNote.content}
                onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                placeholder="Content (markdown supported)"
                className={`w-full p-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                rows="3"
              />
              <input
                type="text"
                value={newNote.tags}
                onChange={(e) => setNewNote({...newNote, tags: e.target.value})}
                placeholder="Tags (comma separated)"
                className={`w-full p-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
              />
              <button
                onClick={addNote}
                className={`px-4 py-2 rounded ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-4`}>
            <h3 className="font-semibold mb-3">Your Notes</h3>
            <div className="space-y-3">
              {filteredNotes.length > 0 ? (
                filteredNotes.map(note => (
                  <div 
                    key={note.id} 
                    onClick={() => setActiveNote(note)}
                    className={`p-3 rounded cursor-pointer ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-50'} border ${darkMode ? 'border-gray-500' : 'border-gray-200'}`}
                  >
                    <h4 className="font-semibold">{note.title}</h4>
                    <p className="text-sm mt-1 line-clamp-2">{note.content}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {note.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className={`px-2 py-1 text-xs rounded ${darkMode ? 'bg-gray-500' : 'bg-gray-200'}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-4">No notes found</p>
              )}
            </div>
          </div>
          
          {activeNote && (
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-xl">{activeNote.title}</h3>
                <button 
                  onClick={() => setActiveNote(null)}
                  className={`p-1 rounded ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                >
                  ✕
                </button>
              </div>
              <div className={`p-3 rounded ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: activeNote.content }} />
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {activeNote.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className={`px-2 py-1 text-xs rounded ${darkMode ? 'bg-gray-500' : 'bg-gray-200'}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesOrganizer;