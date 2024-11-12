import React, { useState, useEffect } from "react";
import useStore from "../store/store";

function Note() {
  // State to toggle between dark and light mode
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const {
    data,
    loading,
    error,
    notes,
    authUser,
    authId,
    getNotes,
    createNote,
    notesUI,
    deleteNote,
    updateNote,
    getNoteInfo,
    newTitle,
    newContent,
  } = useStore();
  
  const [inputTitle, setInputTitle] = useState("");
  const [inputContent, setInputContent] = useState("");
  const [editing, setEditing] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);

  // State for the search query
  const [searchQuery, setSearchQuery] = useState("");
  
  let allNotes = notesUI ? notesUI.notes : [];

  // Toggling between dark and light mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleUpdate = async (noteId) => {
    // Fetch note info for editing
    await getNoteInfo(noteId, authId);

    // Set form values to the existing note's content for editing
    setInputTitle(newTitle);
    setInputContent(newContent);
    setEditing(true);
    setEditingNoteId(noteId); // Track the note ID being edited
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputTitle || !inputContent) {
      console.log("Please enter both a title and content");
      return;
    }

    if (editing) {
      // If editing, call updateNote
      await updateNote(inputTitle, inputContent, authId, editingNoteId);
      setEditing(false); // Reset editing mode
      setInputTitle("");
      setInputContent("");
      setEditingNoteId(null);
      setIsUpdated(true); // Set isUpdated to true to trigger the component to re-render with the updated note
      getNotes(authId); // Re-fetch notes after update
    } else {
      // If creating new note, call createNote
      createNote(inputTitle, inputContent, authId);
      setInputTitle("");
      setInputContent("");
      getNotes(authId); // Re-fetch notes after creation
    }
  };

  const handleDelete = async (noteId) => {
    try {
      console.log("from handleDelete the noteId is: " + noteId);
      await deleteNote(authId, noteId);
      getNotes(authId); // Re-fetch notes after deletion
    } catch (error) {
      console.error("Error deleting note: ", error);
      // You can show an error message to the user here
    }
  };

  const handleShare = (noteId) => {
    // Generate a shareable URL, for example `/note/123`
    const url = `localhost:3000/note/${noteId}`;
    
    // Alert the shareable URL
    alert(`Note URL: ${url}`);
  };

  // Function to filter notes based on the search query
  const filteredNotes = allNotes.filter((note) => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
    className={`transition-all duration-300 ease-in-out ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}
  >
    <div className="flex min-h-screen">
      {/* Sidebar to display notes */}
      <div className="w-1/2 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">{authUser}'s Notes</h2>
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none transition duration-300"
          >
            {isDarkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search Notes..."
            className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* List of Notes */}
        <ul className="space-y-6">
          {filteredNotes.map((note) => (
            <li key={note.id} className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{note.title}</h3>
                    <p className="text-sm text-gray-600 mt-2">{note.content}</p>
                  </div>
                  <div className="space-x-3 flex-shrink-0">
                    <button
                      onClick={() => handleUpdate(note.id)}
                      className="text-blue-600 hover:text-blue-800 transition duration-200"
                    >
                      <i className="fas fa-edit"> Edit</i>
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="text-red-600 hover:text-red-800 transition duration-200"
                    >
                      <i className="fas fa-trash"> Delete</i>
                    </button>
                    <button
                      onClick={() => handleShare(note.id)}
                      className="text-green-600 hover:text-green-800 transition duration-200"
                    >
                      <i className="fas fa-share-alt"> Share</i>
                    </button>
                  </div>
                </div>

                {/* Created At / Updated At */}
                <div className="text-xs text-gray-500 mt-3">
                    <p>Created on {new Date(note.publishedAt).toLocaleString()}</p>
                    {/* Display Updated At only for the specific note */}
                    {/* {note.updatedAt && ( */}
                      {/* // <p>Updated at {new Date(note.updatedAt).toLocaleString()}</p> */}
                    {/* // )} */}
                  </div>
                </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Form to create a new note */}
      <div
        className={`${
          isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
        } w-1/2 p-8 flex flex-col justify-center items-center`}
      >
        <h2 className="text-3xl font-semibold mb-6">Create a New Note</h2>
        <form className="w-full max-w-lg">
          {/* Title Input */}
          <div className="mb-6">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Note Title
            </label>
            <input
              id="title"
              type="text"
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter note title"
            />
          </div>

          {/* Content Input */}
          <div className="mb-6">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Note Content
            </label>
            <textarea
              id="content"
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
              rows="4"
              placeholder="Enter note content"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            {editing ? "Edit Note" : "Create Note"}
          </button>
        </form>
      </div>
    </div>
  </div>
);
}

export default Note;
