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
  } = useStore();
  const [inputTitle, setInputTitle] = useState();
  const [inputContent, setInputContent] = useState();

  let allNotes = [];
  if (notesUI) {
    allNotes = notesUI.notes;
  }
  // console.log("allNotes: ", allNotes);
  // Toggling between dark and light mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleUpdate = () => {
    setIsUpdated(true); // You can add further logic here to update the note
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const title = inputTitle;
    const content = inputContent;
    if (!inputTitle || !inputContent) {
      console.log("Please enter both a title and a content");
      return;
    }
    setInputTitle("");
    setInputContent("");
    createNote(title, content, authId);
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

  
  return (
    <div
      className={isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"}
    >
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
            {allNotes.map((note) => (
              <li
                key={note.id}
                className="border p-4 rounded-md bg-white shadow-md"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">{note.title}</h3>
                    <p className="text-sm text-gray-700">{note.content}</p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={handleUpdate}
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
            ))}
          </ul>
        </div>

        {/* Form to create a new note */}
        <div
          className={`${
            isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
          } w-1/2 p-6 flex flex-col justify-center items-center`}
        >
          {/* Dark/Light Mode Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full border-2 border-gray-500 dark:bg-gray-700 dark:text-white"
          >
            {isDarkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
          <h2 className="text-2xl font-semibold mb-4">Create a New Note</h2>
          <form className="w-full max-w-md">
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
                value={inputTitle}
                onChange={(e) => setInputTitle(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter note title"
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
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                placeholder="Enter note content"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit Note
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Note;
