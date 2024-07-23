export default class StickyNote {
    constructor(title, description, date = "") {
        this.title = title
        this.description = description
        this.date = date
    }

    setTitle(newTitle) {
        this.title = newTitle
    }
}