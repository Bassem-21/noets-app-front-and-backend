import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set) => ({
      data: null,
      error: null,
      notesUI: { notes: [] },
      notes: null,
      loading: null,
      authUser: null,
      authId: null,
      newTitle: "",
      newContent: "",

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
          set((state) => ({
            notes: [...state.notes, newNote],
            error: "",
          }));
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
        } catch (err) {
          console.error("Error:", err);
          set({ error: err.message, loading: false });
        }
      },

      updateNote: async (inputTitle, inputContent, authId, editingNoteId) => {
        set({ loading: true, error: null });

        try {
          const response = await fetch(
            `http://localhost:3000/update/note/${editingNoteId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({ inputTitle, inputContent, authId }),
            }
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Failed to update note`);
          }
          const updatedNote = await response.json();
        } catch (err) {
          console.error("Error:", err);
          set({ error: err.message, loading: false });
        }
      },

      getNoteInfo: async (noteId, authId) => {
        set({ error: null });
        try {
          const response = await fetch(`http://localhost:3000/note/${noteId}`, {
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
          set({
            newTitle: res.note.title,
            newContent: res.note.content,
            loading: false,
          });
        } catch (err) {
          set({ error: err.message, loading: false });
        }
      },
    }),
    {
      name: "notes-store", // This is the name of the storage key in localStorage
      getStorage: () => localStorage, // You can change this to sessionStorage or another store
    }
  )
);

export default useStore;
