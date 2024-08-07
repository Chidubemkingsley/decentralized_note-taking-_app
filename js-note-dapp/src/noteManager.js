class Note {
    constructor(id, owner, content) {
      this.id = id;
      this.owner = owner;
      this.content = content;
    }
  
    update(content) {
      if (content !== undefined) this.content = content;
    }
  
    getData() {
      return { id: this.id, owner: this.owner, content: this.content };
    }
  }
  
  class NoteManager {
    constructor() {
      this.notes = [];
      this.nextId = 1;
    }
  
    createNote(owner, content) {
      const newNote = new Note(this.nextId++, owner, content);
      this.notes.push(newNote);
      return newNote;
    }
  
    getNoteById(id) {
      return this.notes.find(note => note.id === id);
    }
  
    getAllNotes() {
      return this.notes;
    }
  
    deleteNoteById(owner, id) {
      const index = this.notes.findIndex(note => note.id === id && note.owner === owner);
      if (index === -1) return false;
      this.notes.splice(index, 1);
      return true;
    }
  
    updateNoteById(owner, id, content) {
      const note = this.notes.find(note => note.id === id && note.owner === owner);
      if (!note) return false;
      note.update(content);
      return note;
    }
  }
  
  module.exports = new NoteManager();
  