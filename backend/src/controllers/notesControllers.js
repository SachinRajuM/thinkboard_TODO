import Note from "../../models/Note.js";
export async function getAllNotes(req,res) {
    try {
        const notes = await Note.find();
        res.status(200).json(notes);
    } catch (error) {
        console.error("Error in getAllNotes controller",error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function getNoteById(req, res) {
    try {
        const note = await Note.findById(req.params.id);
        res.status(200).json(note);
    } catch (error) {
        console.error("Error in getNoteById controller", error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function createNote(req, res) {
    try {
        const { title, content } = req.body;
        
        // Check if required fields are present
        if (!title || !content) {
            return res.status(400).json({ 
                message: "Title and content are required" 
            });
        }

        const newNote = new Note({ title, content });
        await newNote.save();
        
        res.status(201).json({ 
            message: "Note created successfully!",
            note: newNote
        });
    } catch (error) {
        console.error("Error in createNote controller", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: "Validation error",
                errors: error.errors 
            });
        }
        res.status(500).json({ 
            message: "Internal server error" 
        });
    }
}

export async function updateNote(req,res) {
    try {
        const {title, content} = req.body;
        await Note.findByIdAndUpdate(req.params.id,{title,content});
        res.status(200).json({message:"Note updated successfully!"});
    } catch (error) {
        console.error("Error in updateNote controller", error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function deleteNote(req,res) {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"Note deleted successfully!"});
    } catch (error) {
        console.error("Error in deleteNote controller", error);
        res.status(500).json({message:"Internal server error"});
    }
}