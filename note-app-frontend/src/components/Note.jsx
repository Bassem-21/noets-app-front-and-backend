import React, { useState, useEffect } from "react";
import useStore from "../store/store";

function Note() {
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
  const [randomColor, setRandomColor] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // State for the modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const colors = ["#FEBE66", "#FF5768", "#8DD7C0", "#01A5E4"];

  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  let allNotes = notesUI ? notesUI.notes : [];

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleUpdate = async (noteId) => {
    await getNoteInfo(noteId, authId);
    setInputTitle(newTitle);
    setInputContent(newContent);
    setEditing(true);
    setEditingNoteId(noteId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputTitle || !inputContent) {
      console.log("Please enter both a title and content");
      return;
    }

    if (editing) {
      await updateNote(inputTitle, inputContent, authId, editingNoteId);
      setEditing(false);
      setInputTitle("");
      setInputContent("");
      setEditingNoteId(null);
      setIsUpdated(true);
      getNotes(authId);
    } else {
      createNote(inputTitle, inputContent, authId);
      setRandomColor(getRandomColor());
      setInputTitle("");
      setInputContent("");
      getNotes(authId);
    }
  };

  const handleDelete = async () => {
    try {
      if (noteToDelete) {
        await deleteNote(authId, noteToDelete);
        getNotes(authId);
        setShowDeleteModal(false); // Hide modal after deletion
      }
    } catch (error) {
      console.error("Error deleting note: ", error);
    }
  };

  const handleShowDeleteModal = (noteId) => {
    setShowDeleteModal(true);
    setNoteToDelete(noteId);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setNoteToDelete(null);
  };

  const filteredNotes = allNotes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${isDarkMode ? "bg-gray-900 text-white" : "bg-[#fe9f47] text-gray-800"}`}
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
          <ul className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto p-3">
            {filteredNotes.map((note) => (
              <li key={note.id} className={`bg-[${randomColor}] rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out`}>
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
                        onClick={() => handleShowDeleteModal(note.id)}
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
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Form to create a new note */}
        <div className={`${isDarkMode ? "bg-gray-900 text-white" : "bg-[#2e49d5] text-white"} w-1/2 p-8 flex flex-col justify-center items-center`}>
          <h2 className="text-3xl font-semibold mb-6">Create a New Note</h2>
          <form className="w-full max-w-lg bg-[#182775] p-8 rounded-xl">
            {/* Title Input */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-l font-medium text-white">
                Note Title
              </label>
              <input
                id="title"
                type="text"
                value={inputTitle}
                onChange={(e) => setInputTitle(e.target.value)}
                className="mt-2 block w-full px-4 py-3 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Enter note title"
              />
            </div>

            {/* Content Input */}
            <div className="mb-6">
              <label htmlFor="content" className="block text-l font-medium text-white">
                Note Content
              </label>
              <textarea
                id="content"
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
                className="mt-2 block w-full px-4 py-3 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
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

      {/* Modal for delete confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#182775] text-white border-white border-2 p-8 rounded-lg shadow-lg w-96">
            <h3 className="text-xl mb-4">Are you sure you want to delete this note?</h3>
            <div className="flex justify-around space-x-4">
              <button
                onClick={handleCloseDeleteModal}
                className="py-2 px-6 bg-[#2f46f4] text-white rounded-md hover:bg-[#2f419a]"
              >
                No
              </button>
              <button
                onClick={handleDelete}
                className="py-2 px-6 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Note;
