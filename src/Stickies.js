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

  deleteSticky(stickyToDeleteTitle) {
    const newArray = this.list.filter(
      (sticky) => sticky.title !== stickyToDeleteTitle
    );
    this.setList(newArray);
  }

  getSticky(chosenStickyTitle) {
    return this.list.find(note => note.title === chosenStickyTitle)
  }

}

export default Stickies;
