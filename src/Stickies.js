class Stickies {
    constructor() {
        this.list = []
    }

    setList(newArray) {
        return this.list = newArray
    }

    getList() {
        return this.list
    }

    addSticky(newSticky) {
        return this.list.push(newSticky)
    }

    deleteSticky(stickyToDelete) {
        const newArray = this.list.filter(sticky => sticky.title !== stickyToDelete.title)
        this.setList(newArray)
    }
}

export default Stickies