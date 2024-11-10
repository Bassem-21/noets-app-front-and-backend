import { create } from 'zustand';

const useStore = create((set) => ({
    data: null,
    error: null,
    notes: null,
    loading: null,
    authUser: null,
    authId: null,
    content: null,
    title: null,

    // Login action
    loginData: async (username, password) => {
        set({ loading: true, error: null });

        try {
            const response = await fetch('http://localhost:3000/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Failed to post data`);
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            set({ data, loading: false, authUser: data.username, authId: data.userId });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    // Fetch notes for authenticated user
    getNotes: async (authId) => {
        set({ error: null, loading: true });

        try {
            const response = await fetch('http://localhost:3000/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ authId }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Failed to get data`);
            }

            const notes = await response.json();
            set({ notes: notes.notes, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    // Create a new note
    createNote: async (_authId, title, content) => {
        set({ error: null, loading: true });

        try {
            const response = await fetch('http://localhost:3000/note/user/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ title, content, userId: _authId }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Failed to post data`);
            }

            const newNote = await response.json();
            set((state) => ({
                notes: [...state.notes, newNote.note],
                loading: false,
            }));
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    // Update an existing note
    updateNote: async (noteId, title, content) => {
        set({ error: null, loading: true });

        try {
            const response = await fetch(`http://localhost:3000/update/note/${noteId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ title, content, id: noteId }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Failed to update note`);
            }

            const updatedNote = await response.json();
            set((state) => ({
                notes: state.notes.map((note) =>
                    note.id === noteId ? updatedNote.note : note
                ),
                loading: false,
            }));
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    // Delete a note
    deleteNote: async (noteId) => {
        set({ error: null, loading: true });

        try {
            const response = await fetch(`http://localhost:3000/delete/note/${noteId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ id: noteId }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Failed to delete note`);
            }

            // Remove the note from state after successful deletion
            set((state) => ({
                notes: state.notes.filter((note) => note.id !== noteId),
                loading: false,
            }));
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },
}));

export default useStore;
