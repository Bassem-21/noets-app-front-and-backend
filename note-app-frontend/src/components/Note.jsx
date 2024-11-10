import React, { useEffect, useState } from "react";
import useStore from "../store/Store";

function Note() {
  // State to toggle between dark and light mode
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const { data, loading, error, loginData, notes, authUser, createNote, updateNote, deleteNote } = useStore();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState(null); // To store selected note ID for update

  let allNotes = [];

  // Toggling between dark and light mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleUpdate = (noteId, noteTitle, noteContent) => {
    setSelectedNoteId(noteId);
    setTitle(noteTitle);
    setContent(noteContent);
  };

  const handleDelete = async (noteId) => {
    await deleteNote(noteId); // Call delete function from store
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedNoteId) {
      // If a note is selected for update, call update function
      await updateNote(selectedNoteId, title, content);
    } else {
      // Otherwise, create a new note
      await createNote(authUser, title, content);
    }

    // Reset form fields after submit
    setTitle('');
    setContent('');
    setSelectedNoteId(null); // Reset selected note ID
  };

  // Make sure notes is defined before trying to access notes.notes
  if (notes && notes) {
    allNotes = notes;
  }

  return (
    <div className={isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"}>
      <div className="flex min-h-screen">
        {/* Sidebar to display notes */}
        <div className="w-1/2 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{authUser}'s Note</h2>
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search Notes..."
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* List of Notes */}
          <ul className="space-y-4">
            {/* Check if there are notes before calling map */}
            {allNotes && allNotes.length > 0 ? (
              allNotes.map((note) => (
                <li key={note.id} className="border p-4 rounded-md bg-white shadow-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg">{note.title}</h3>
                      <p className="text-sm text-gray-700">{note.content}</p>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleUpdate(note.id, note.title, note.content)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <i className="fas fa-edit"> Edit</i>
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <i className="fas fa-trash"> Delete</i>
                      </button>
                      <button className="text-green-500 hover:text-green-700">
                        <i className="fas fa-share-alt"> Share</i>
                      </button>
                    </div>
                  </div>

                  {/* Created At / Updated At */}
                  <div className="text-xs text-gray-500 mt-2">
                    <p>{note.createdAt}</p>
                    {isUpdated && <p>Updated at {new Date().toLocaleString()}</p>}
                  </div>
                </li>
              ))
            ) : (
              <li className="text-gray-500">No notes available</li>
            )}
          </ul>
        </div>

        {/* Form to create or update a note */}
        <div className={`${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"} w-1/2 p-6 flex flex-col justify-center items-center`}>
          {/* Dark/Light Mode Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full border-2 border-gray-500 dark:bg-gray-700 dark:text-white"
          >
            {isDarkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
          <h2 className="text-2xl font-semibold mb-4">{selectedNoteId ? "Update Note" : "Create a New Note"}</h2>
          <form className="w-full max-w-md" onSubmit={handleSubmit}>
            {/* Title Input */}
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Note Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter note title"
                required
              />
            </div>

            {/* Content Input */}
            <div className="mb-4">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                Note Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                placeholder="Enter note content"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {selectedNoteId ? "Update Note" : "Submit Note"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Note;
