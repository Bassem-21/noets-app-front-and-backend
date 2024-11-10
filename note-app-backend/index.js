const express = require('express')
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt');
const authMiddleware = require('./middleware/auth-middelware');
require('dotenv').config();
const cors = require('cors');

const saltRounds = 10;
 
const jwt = require('jsonwebtoken');

const app = express()

const prisma = new PrismaClient()
// use `prisma` in your application to read and write data in your DB

app.use(express.json())

app.use(cors());
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
        res.json({ message: 'User created successfully',
                username,
                password: '' 
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
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
            return res.status(401).json({ message: 'Wrong password or username' });
        }

        // Use environment variable for the JWT secret
        const accessToken = jwt.sign({ foo: "bar" }, process.env.TOKEN_KEY);
        res.json({ message: 'Logged in successfully',username:user.username, userId: user.id,token: accessToken });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

app.post('/user/test', authMiddleware, async (req, res) => {
    try {
        const userPosts = await prisma.Note.findMany({
            where: {
                userId: req.body.userId,
            }
        });
        res.json({ message: 'Posts retrieved successfully', posts: userPosts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message});
 }
})

// code to create a new note for a user
app.post('/note/user/create', async (req, res) => {
    try {
        const newNote = await prisma.Notes.create({
            data: {
                title: req.body.title,
                content: req.body.content,
                userId: req.body.userId,
            },
        });
        res.json({ message: `Note for the User with id:${req.body.userId} created successfully`, note: newNote});
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
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
        res.json({ user: user});
        
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
        res.json({ message: 'Note retrieved successfully', note });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});


// code to get all notes of the user 
app.post('/notes', async (req, res) => {
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
        if (notes.length === 0) {
            return res.status(404).json({ message: 'No notes found for this user' });
        }
        res.json({ message: 'Notes retrieved successfully', notes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});


// code to delete a note
app.delete('/delete/note/:id', async (req, res) => {
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

        // try to delete the note
        await prisma.Notes.delete({
            where: {
                id: noteId,
            },
        });

        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});



// code to update a note
app.put('/update/note/:id', async (req, res) => {
    try{
        const noteId = parseInt(req.params.id);
        const  userId  = req.body.id;
        const updatedNote = await prisma.Notes.update({
            where: {
                id: noteId,
            },
            data: {
                title: req.body.title,
                content: req.body.content,
                userId: userId,
            },    
        })
        if(!updatedNote){
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json({ message: 'Note updated successfully', note: updatedNote });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

