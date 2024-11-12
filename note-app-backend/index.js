const { PrismaClient } = require('@prisma/client')
const express = require('express')
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/auth-middleware');
require('dotenv').config();

const saltRounds = 10;
 

const app = express()

const prisma = new PrismaClient()


app.use(cors());
app.use(express.json())

// code to create a new user
app.post ('/user/signup', async (req, res) => {
    const userExists = await prisma.User.findUnique({
        where: {
            username: req.body.username
        }
    });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }
    try {
        const {username, password} = req.body;
        const hashPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await prisma.User.create({
            data: {
                username,
                password: hashPassword
            }          
        });
        const accesstoken = jwt.sign({ foo: "bar" }, process.env.TOKEN_KEY);
        res.json({ message: 'User created successfully',
            token: accesstoken,
            userId: newUser.id,
            username: newUser.username,
            error: ''
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message,username: '', password: '' });
    }

})

app.post('/user/login', async (req, res) => { 
    try {
        const user = await prisma.User.findUnique({
            where: {
                username: req.body.username
            },
        });

        if (!user) {
            return res.status(401).json({ message: 'Wrong password or username' });
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

        if (!isPasswordValid) {
            return res.status(403).json({ message: 'Wrong password or username' });
        }

        // Use environment variable for the JWT secret
        const accesstoken = jwt.sign({ foo: "bar" }, process.env.TOKEN_KEY);
        res.json({ message: 'Logged in successfully',
            token: accesstoken,
            userId: user.id,
            username: user.username,
            error: ''
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});


// code to create a new note for a user
app.post('/note/create', async (req, res) => {
    try {
        const newNote = await prisma.Notes.create({
            data: {
                title: req.body.title,
                content: req.body.content,
                userId: req.body.authId,
            },
        });
        res.json({ message: `Note created successfully`, note: newNote, error: ''});
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred', error, note: ''  });
    }
})

// code to get information of the user with the id sent in body
app.get('/user/:id', async (req, res) => {
    try {
        const user = await prisma.User.findUnique({
            where: {
                id: parseInt(req.params.id),
            },
        }); 
        res.json({ message: user, error: ''});
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

// code to find a note for the user
app.post('/note/:id', async (req, res) => {
    try {
        const noteId = parseInt(req.params.id);
        const  userId  = req.body.id;

        // Find the note by ID
        const note = await prisma.Notes.findUnique({
            where: {
                id: noteId,
            },
        });

        // Check if the note exists
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Check if the note belongs to the user
        if (note.userId !== userId) {
            return res.status(403).json({ message: 'Access forbidden' });
        }

        // Return the note if it belongs to the user
        res.json({ message: 'Note retrieved successfully', note, error: '' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred', note: '' });
    }
});


// code to get all notes of the user 
app.post('/notes', authMiddleware,async (req, res) => {
    try {
        const userId = req.body.authId; // Get the user ID from the request body
        //if the user ID is not provided, return an error
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        // Fetch all notes for the specified user ID
        const notes = await prisma.Notes.findMany({
            where: {
                userId: userId,
            },
        });
        if (!notes) {
            return res.status(404).json({ message: "You have zero notes", notes: '' });
        }
        res.json({ message: 'Notes retrieved successfully', notes, error: '' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred', error, notes:''  });
    }
});


// code to delete a note
app.delete('/delete/:noteId',authMiddleware, async (req, res) => {
    try {
        const userId = req.body.authId;
        const noteId = parseInt(req.params.noteId);

        const note = await prisma.Notes.findUnique({
            where: {
                id: noteId
            }
        });

        // Check if the note exists
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Check if the note belongs to the user
        if (note.userId !== userId) {
            return res.status(403).json({ message: 'Access forbidden' });
        }

        // try to delete the note
        await prisma.Notes.delete({
            where: {
                id: noteId,
            },
        });

        res.json({ message: 'Note deleted successfully' });
    } catch (err) {
        res.status(500).json({  message: err.message  });
    }
});



// code to update a note
app.put('/update/note/:id', authMiddleware,async (req, res) => {
    try{
        const noteId = parseInt(req.params.id);
        const  userId  = req.body.authId;
        const note = await prisma.Notes.findUnique({
            where: {
                id: noteId
            }
        })
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        if (note.userId!== userId) {
            return res.status(401).json({ message: 'The note is not owned by the user' });
        }
        await prisma.Notes.update({
            where: {
                id: noteId
            },
            data: {
                title: req.body.title,
                content: req.body.content
            }
        });
        res.json({ message: 'Note updated successfully', note })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
