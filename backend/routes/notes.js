const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Notes = require('../models/Notes');

// Route 1: Get all notes - GET /api/notes/fetchallnotes
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Route 2: Add a new note - POST /api/notes/addnote
router.post('/addnote', fetchuser, [
    body('title', 'Enter a Title').isLength({ min: 1 }),
    body('description', 'Add a description').isLength({ min: 1 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const newNote = new Notes({
            title,
            description,
            tag,
            user: req.user.id
        });

        const savedNote = await newNote.save();
        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Route 3: Update an existing note - PUT /api/notes/updatenote/:id
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid note ID" });
        }

        let note = await Notes.findById(id);
        if (!note) {
            return res.status(404).send("Note Not Found");
        }

        // Check if user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // Prepare the updated note
        const newNote = {};
        if (title) newNote.title = title;
        if (description) newNote.description = description;
        if (tag) newNote.tag = tag;

        // Update note
        note = await Notes.findByIdAndUpdate(id, { $set: newNote }, { new: true });
        res.json({ note });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


//Route 4 : Delete a note - DELETE /api/notes/deletenote/:id
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid note ID" });
        }

        let note = await Notes.findById(id);
        if (!note) {
            return res.status(404).send("Note Not Found");
        }

        // Check if user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndDelete(id);
        res.json({ "Success": "Note has been deleted", note: note });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
