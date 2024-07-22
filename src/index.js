import Stickies from './Stickies'
import StickyNote from './StickyNote'

const stickies = new Stickies()

const test1 = new StickyNote('Test', 'thisonenew')
const test2 = new StickyNote('thishdif', 'adhfiudsh')
stickies.addSticky(test1)
stickies.addSticky(test2)
stickies.deleteSticky(test2)

console.log(stickies)