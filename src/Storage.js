import Stickies from "./Stickies";
import StickyNote from "./StickyNote";

export default class Storage {
  static saveStickyNotes(data) {
    localStorage.setItem("stickynotes", JSON.stringify(data));
  }

  static getStickyNotes() {
    const stickies = Object.assign(
      new Stickies(),
      JSON.parse(localStorage.getItem("stickynotes"))
    );

    stickies.setList(
      stickies
        .getList()
        .map((sticky) => Object.assign(new StickyNote(), sticky))
    );

    return stickies;
  }

  static addStickyNote(newNote) {
    const stickies = Storage.getStickyNotes();
    stickies.addSticky(newNote);
    Storage.saveStickyNotes(stickies);
  }

  static deleteStickyNote(noteToBeDeletedTitle) {
    const stickies = Storage.getStickyNotes();
    stickies.deleteSticky(noteToBeDeletedTitle);
    Storage.saveStickyNotes(stickies);
  }

  static reTitleStickyNote(oldNoteTitle, newNoteTitle) {
    const stickies = Storage.getStickyNotes();
    const stickyToReTitle = stickies.getSticky(oldNoteTitle);
    if (stickies.getList().find((sticky) => sticky.title === newNoteTitle))
      return;
    stickyToReTitle.setTitle(newNoteTitle);
    Storage.saveStickyNotes(stickies);
  }

  static setNewDescription(chosenNote, newDescription) {
    const stickies = Storage.getStickyNotes();
    const stickyToAlter = stickies.getSticky(chosenNote);
    stickyToAlter.setDescription(newDescription);
    Storage.saveStickyNotes(stickies);
  }
}
