const testRegex = /(\u001b\[[^m]+m)/;
const infoRegex = /\u001b\[([^m]+)m/;

/**
 * @function
 * @name ansiToBrowser converts ANSI colored strings to chrome console argument lists
 *
 * @param {String} ansiEncodedString the ANSI colored string
 * @return {Array<String>} an argument list that can be applied to chrome's console
 */
export default function ansiToBrowser(ansiEncodedString) {
  const splits = ansiEncodedString.split(testRegex).filter(s => s.length > 0);
  const initialState = {
    segments: [''],
    style: {
      color: '',
      backgroundColor: '',
      fontWeight: '',
      textDecoration: '',
      opacity: '',
    },
  };

  const { segments } = splits.reduce((state, piece) => {
    const action = testRegex.test(piece) ? escapeCodeToAction(piece) : stringToAction(piece);
    const newState = action(state);
    return newState;
  }, initialState);

  return segments;
}

function allMatches(regex, string) {
  // copy regex with global flag (just in case)
  const flags = 'g' +
    (regex.ignoreCase ? 'i' : '') +
    (regex.multiline ? 'm' : '');

  const globalRegex = new RegExp(regex.source, flags);
  const matches = [];
  let match;
  while (match = globalRegex.exec(string)) {
    matches.push(match);
  }

  return matches;
}

/**
 * @name stringToAction converts a string into an action
 *
 * @param {string} piece the new piece of string
 * @return {Function} the function to evolve the state
 */
function stringToAction(piece) {
  return state => {
    const [string, ...styles] = state.segments;
    return Object.assign({}, state, {
      segments: [`${ string }%c${ piece }`, ...styles, cssFromStyles(state.styles)],
    });
  };
}

/**
 * @name escapeCodeToAction converts an escape code to a color string
 *
 * @param {string} code the escape code
 * @return {Function} the function to evolve the state
 */
function escapeCodeToAction(code) {
  const codes = infoRegex.exec(code)[1].split(';').map(n => parseInt(n));
  const newStyles = codes.map(numberToStyles);
  return state => {
    const { styles: oldStyles, segments } = state;
    const styles = Object.assign({}, oldStyles, ...newStyles);
    return Object.assign({}, state, {
      styles,
    });
  };
}

function cssFromStyles(styles) {
  return Object.keys(styles).map(property => {
    const value = styles[property];
    if (value.length > 0) {
      return `${ property }: ${ value };`;
    }

    return '';
  }).filter(s => s.length > 0).join(' ');
}

/**
 * @name numberToAction converts an escape number to an action
 *
 * @param {number} number the number that gets nestled inside an escape code
 * @return {Object} the tranformative action to apply to styles
 */
function numberToStyles(number) {
  switch (number) {
  case 0: return { fontWeight: '', textDecoration: '' };
  case 1: return { fontWeight: 'bold' };
  case 4: return { textDecoration: 'underline' };
  case 30: return { color: 'black' };
  case 31: return { color: 'red' };
  case 32: return { color: 'green' };
  case 33: return { color: 'yellow' };
  case 34: return { color: 'blue' };
  case 35: return { color: 'magenta' };
  case 36: return { color: 'cyan' };
  case 37: return { color: 'white' };
  case 39: return { color: '', backgroundColor: '', fontWeight: '', textDecoration: '' };
  case 40: return { backgroundColor: 'black' };
  case 41: return { backgroundColor: 'red' };
  case 42: return { backgroundColor: 'green' };
  case 43: return { backgroundColor: 'yellow' };
  case 44: return { backgroundColor: 'blue' };
  case 45: return { backgroundColor: 'magenta' };
  case 46: return { backgroundColor: 'cyan' };
  case 47: return { backgroundColor: 'white' };
  default: return {};
  }
}
