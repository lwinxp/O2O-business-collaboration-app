const { mustBeSignedIn } = require('./auth.js');

let aboutMessage = 'Omni API v0.0.1';

function setMessage(_, { message }) {
  aboutMessage = message;
  return aboutMessage;
}

function getMessage() {
  return aboutMessage;
}

module.exports = { getMessage, setMessage: mustBeSignedIn(setMessage) };
