const { UserInputError } = require('apollo-server-express');
const { getDb, getNextSequence } = require('./db.js');
const { mustBeSignedIn, resolveUser } = require('./auth.js');
const { auth } = require('google-auth-library');

async function createUserIfNew(googleUserData) {
  // console.log('====== entered createUserIfNew function ======');
  // console.log('googleUserData:', googleUserData);
  const db = getDb();

  // console.log('====== before auth.resolveUser ====== ');

  // const googleUserData = auth.resolveUser;

  // console.log('====== after auth.resolveUser ====== ');

  // validate(user);
  if (!await db.collection('users').findOne({ email: googleUserData.email })) {
    const user = {
      // id: null,
      created: null,
      email: null,
      givenName: null,
      name: null,
    };
    const newUser = Object.assign({}, user);
    newUser.created = new Date();
    // newUser.id = await getNextSequence('users');
    newUser.email = googleUserData.email;
    newUser.givenName = googleUserData.givenName;
    newUser.name = googleUserData.name;

    // console.log('====== before user inserted ====== ');

    await db.collection('users').insertOne(newUser);

    // console.log('====== before after inserted ====== ');
  }
}

module.exports = {
  createUserIfNew,
};
