/* global Element */

/**
 *  The Annoying Site
 *  https://theannoyingsite.com
 *
 *  Author:
 *    Feross Aboukhadijeh
 *    https://feross.org
 *
 *  Patreon:
 *    If you enjoyed this, please support me on Patreon!
 *    https://www.patreon.com/feross
 */

const SCREEN_WIDTH = window.screen.availWidth
const SCREEN_HEIGHT = window.screen.availHeight
const WIN_WIDTH = 480
const WIN_HEIGHT = 360
const VELOCITY = 15
const MARGIN = 15
const TOP_MARGIN = 50
const TICK_LENGTH = 50

const HIDDEN_STYLE = 'position: fixed; width: 1px; height: 1px; overflow: hidden; top: -10px; left: -10px;'

const ART = [
  `
┊┊ ☆┊┊┊┊☆┊┊☆ ┊┊┊┊┊
┈┈┈┈╭━━━━━━╮┊☆ ┊┊
┈☆ ┈┈┃╳╳╳▕╲▂▂╱▏┊┊
┈┈☆ ┈┃╳╳╳▕▏▍▕▍▏┊┊
┈┈╰━┫╳╳╳▕▏╰┻╯▏┊┊
☆ ┈┈┈┃╳╳╳╳╲▂▂╱┊┊┊
┊┊☆┊╰┳┳━━┳┳╯┊ ┊ ☆┊
  `,
  `
░░▓▓░░░░░░░░▓▓░░
░▓▒▒▓░░░░░░▓▒▒▓░
░▓▒▒▒▓░░░░▓▒▒▒▓░
░▓▒▒▒▒▓▓▓▓▒▒▒▒▓░
░▓▒▒▒▒▒▒▒▒▒▒▒▒▒▓
▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓
▓▒▒▒░▓▒▒▒▒▒░▓▒▒▓
▓▒▒▒▓▓▒▒▒▓▒▓▓▒▒▓
▓▒░░▒▒▒▒▒▒▒▒▒░░▓
▓▒░░▒▓▒▒▓▒▒▓▒░░▓
░▓▒▒▒▓▓▓▓▓▓▓▒▒▓░
░░▓▒▒▒▒▒▒▒▒▒▒▓░░
░░░▓▓▓▓▓▓▓▓▓▓░░░
  `
]

const SEARCHES = [
  'where should i bury the body',
  'why does my eye twitch',
  'why is my poop green',
  'why do i feel so empty',
  'why do i always feel hungry',
  'why do i always have diarrhea',
  'why does my anus itch',
  'why does my belly button smell',
  'why does my cat attack me',
  'why does my dog eat poop',
  'why does my fart smell so bad',
  'why does my mom hate me',
  'why does my pee smell bad',
  'why does my poop float',
  'proof that the earth is flat'
]

const VIDEOS = [
  'albundy.mp4',
  'badger.mp4',
  'cat.mp4',
  'hasan.mp4',
  'heman.mp4',
  'jozin.mp4',
  'nyan.mp4',
  'rickroll.mp4',
  'space.mp4',
  'trolol.mp4'
]

const FILE_DOWNLOADS = [
  'cat-blue-eyes.jpg',
  'cat-ceiling.jpg',
  'cat-crosseyes.jpg',
  'cat-cute.jpg',
  'cat-hover.jpg',
  'cat-marshmellows.jpg',
  'cat-small-face.jpg',
  'cat-smirk.jpg',
  'patreon.png'
]

const PHRASES = [
  'The wheels on the bus go round and round, round and round, round and round. The wheels on the bus go round and round, all through the town!',
  'Dibidi ba didi dou dou, Di ba didi dou, Didi didldildidldidl houdihoudi dey dou',
  'I like fuzzy kittycats, warm eyes, and pretending household appliances have feelings',
  'I\'ve never seen the inside of my own mouth because it scares me to death.',
  'hee haw hee haw hee haw hee haw hee haw hee haw hee haw hee haw hee haw hee haw hee haw',
  'abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz',
  'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaak',
  'eyo eyo eyo eyo eyo eyo eyo eyo eyo eyo eyo eyo eyo eyo eyo eyo eyo eyo eyo eyo eyo eyo eyo eyo'
]

const LOGOUT_SITES = { /* ... unchanged ... */ }

/**
 * Array to store the child windows spawned by this window.
 */
const wins = []

/**
 * Count of number of clicks
 */
let interactionCount = 0

/**
 * Number of iframes injected into the page for the "super logout" functionality.
 * See superLogout().
 */
let numSuperLogoutIframes = 0

/**
 * Is this window a child window? A window is a child window if there exists a
 * parent window (i.e. the window was opened by another window so `window.opener`
 * is set) *AND* that parent is a window on the same origin (i.e. the window was
 * opened by us, not an external website)
 */
const isChildWindow = (window.opener && isParentSameOrigin()) ||
  window.location.search.indexOf('child=true') !== -1

/**
 * Is this window a parent window?
 */
const isParentWindow = !isChildWindow

/*
 * Run this code in all windows, *both* child and parent windows.
 */
init()

/*
 * Use `window.opener` to detect if this window was opened by another window, which
 * will be its parent. The `window.opener` variable is a reference to the parent
 * window.
 */
if (isChildWindow) initChildWindow()
else initParentWindow()

/**
 * Open a new popup window. Requires user-initiated event.
 */
function openWindow() {
  for (let i = 0; i < 25; i++) {
    const { x, y } = getRandomCoords();
    const opts = `width=${WIN_WIDTH},height=${WIN_HEIGHT},left=${x},top=${y}`;
    const win = window.open(window.location.pathname, '', opts);

    // New windows may be blocked by the popup blocker
    if (!win) continue;
    wins.push(win);

    if (wins.length === 2) setupSearchWindow(win);
  }
}

// All other code is unchanged ...
