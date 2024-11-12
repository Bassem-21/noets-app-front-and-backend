import { create } from "zustand";

const useStore = create((set) => ({
  data: null,
  error: null,
  notesUI: { notes: [] },
  notes: null,
  loading: null,
  authUser: null,
  authId: null,
  content: null,

  loginData: async (username, password) => {
    set({ loading: true, error: null });

    try {
      const response = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Failed to post data`);
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      set({ loading: false, authUser: data.username, authId: data.userId });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
  // sign up
  signupData: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("http://localhost:3000/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Failed to post data`);
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      set({ loading: false, authUser: data.username, authId: data.userId });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  getNotes: async (authId) => {
    set({ error: null });

    try {
      const response = await fetch("http://localhost:3000/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ authId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Failed to get data`);
      }

      const res = await response.json();
      set({ notesUI: res, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  createNote: async (title, content, authId) => {
    set({ loading: true, error: null });

    try {
      const response = await fetch("http://localhost:3000/note/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, content, authId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Failed to create note`);
      }

      const newNote = await response.json();
      set({ notes: [...notes, newNote], error: "" });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  deleteNote: async (authId, noteId) => {
    set({ loading: true, error: null });

    try {
      const response = await fetch(`http://localhost:3000/delete/${noteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ authId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "HTTP error! Failed to delete note"
        );
      }
      }
     catch (err) {
      console.error("Error:", err);
      set({ error: err.message, loading: false });
    }
  },

  // update a note
  updateNote: async (noteId, updatedTitle, updatedContent) => {
    set({ loading: true, error: null });

    try {
      const response = await fetch(`http://localhost:3000/note/${noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ updatedTitle, updatedContent }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Failed to update note`);
      }
      const updatedNote = await response.json();
      set((state) => {
        const updatedNotes = state.notesUI.map((note) =>
          note.id === updatedNote.id ? updatedNote : note
        );
        set({ notes: updatedNotes, error: "" });
        return { notesUI: updatedNotes };
      });
    } catch (err) {
      console.error("Error:", err);
      set({ error: err.message, loading: false });
    }
  },
}));

export default useStore;
