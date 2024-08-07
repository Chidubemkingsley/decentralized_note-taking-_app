const { RollupStateHandler } = require('./rollupStateHandler');
const noteManager = require('./noteManager');

class NoteController {
  static async createNoteAction(sender, data) {
    if (!data.content) {
      return { status: "error", message: "Content must be provided." };
    }

    const newNote = noteManager.createNote(sender, data.content);
    return { status: "success", message: "Note created!", data: newNote.getData() };
  }

  static async deleteNoteAction(sender, data) {
    if (!data.id) {
      return { status: "error", message: "Note Id must be provided." };
    }

    const deleteSuccess = noteManager.deleteNoteById(sender, data.id);
    if (!deleteSuccess) {
      return { status: "error", message: `Note ${data.id} not found` };
    }
    return { status: "success", message: `Note ${data.id} deleted` };
  }

  static async updateNoteAction(sender, data) {
    const updatedNote = noteManager.updateNoteById(sender, data.id, data.content);
    if (!updatedNote) {
      return { status: "error", message: `Note ${data.id} not found` };
    }
    return { status: "success", message: "Note Updated", data: updatedNote.getData() };
  }

  static async getNoteById(id) {
    const note = noteManager.getNoteById(id);
    if (note) {
      return { status: "success", message: "Note Found", data: note.getData() };
    }
    return { status: "error", message: `Note ${id} not found` };
  }

  static async getAllNotes() {
    const notes = noteManager.getAllNotes();
    return { status: "success", message: "Notes List", data: notes };
  }
}

module.exports = { NoteController };
