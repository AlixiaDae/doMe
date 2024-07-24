class Stickies {
  constructor() {
    this.list = [];
  }

  setList(newArray) {
    this.list = newArray;
  }

  getList() {
    return this.list;
  }

  addSticky(newSticky) {
    if (this.list.find((sticky) => sticky.title === newSticky.title)) return;
    return this.list.push(newSticky);
  }

  deleteSticky(stickyToDelete) {
    const newArray = this.list.filter(
      (sticky) => sticky.title !== stickyToDelete.title
    );
    this.setList(newArray);
  }

  getSticky(chosenSticky) {
    return this.list.find(note => note.title === chosenSticky.title)
  }

}

export default Stickies;
