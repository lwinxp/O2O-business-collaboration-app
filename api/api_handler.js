const fs = require('fs');
require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');

const GraphQLDate = require('./graphql_date.js');
const about = require('./about.js');
const onlineProfile = require('./onlineProfile.js');
const offlineProfile = require('./offlineProfile.js');
const storageCollaboration = require('./storageCollaboration.js');
const auth = require('./auth.js');
// const userMod = require('./user.js');

const resolvers = {
  Query: {
    about: about.getMessage,
    user: auth.resolveUser,
    onlineProfileList: onlineProfile.list,
    offlineProfileList: offlineProfile.list,
    storageCollaborationList: storageCollaboration.list,
    onlineProfile: onlineProfile.get,
    offlineProfile: offlineProfile.get,
    storageCollaboration: storageCollaboration.get,
  },
  Mutation: {
    setAboutMessage: about.setMessage,
    onlineProfileAdd: onlineProfile.add,
    offlineProfileAdd: offlineProfile.add,
    storageCollaborationAdd: storageCollaboration.add,
    onlineProfileUpdate: onlineProfile.update,
    offlineProfileUpdate: offlineProfile.update,
    storageCollaborationUpdate: storageCollaboration.update,
  },
  GraphQLDate,
};

function getContext({ req }) {
  const user = auth.getUser(req);
  // console.log('getcontext user:', user);
  // userMod.createUserIfNew(user);
  return { user };
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
  context: getContext,
  formatError: (error) => {
    console.log(error);
    return error;
  },
});

function installHandler(app) {
  const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';
  console.log('CORS setting:', enableCors);
  let cors;
  if (enableCors) {
    const origin = process.env.UI_SERVER_ORIGIN || 'http://localhost:8000';
    const methods = 'POST';
    cors = { origin, methods, credentials: true };
  } else {
    cors = 'false';
  }
  server.applyMiddleware({ app, path: '/graphql', cors });
}

module.exports = { installHandler };
