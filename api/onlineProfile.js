const { UserInputError } = require('apollo-server-express');
const { getDb, getNextSequence } = require('./db.js');
const { mustBeSignedIn } = require('./auth.js');

async function get(_, { id }) {
  const db = getDb();
  const onlineProfile = await db.collection('onlineProfiles').findOne({ id });
  return onlineProfile;
}

async function list() {
  const db = getDb();
  const onlineProfiles = await db.collection('onlineProfiles').find({}).toArray();
  return onlineProfiles;
}

const PAGE_SIZE = 10;

async function list(_, {
  status, storageMin, storageMax, search, page,
}) {
  const db = getDb();
  const filter = {};

  if (status) filter.status = status;

  if (storageMin !== undefined || storageMax !== undefined) {
    filter.effort = {};
    if (storageMin !== undefined) filter.effort.$gte = storageMin;
    if (storageMax !== undefined) filter.effort.$lte = storageMax;
  }

  if (search) filter.$text = { $search: search };

  const cursor = db.collection('onlineProfiles').find(filter)
    .sort({ id: 1 })
    .skip(PAGE_SIZE * (page - 1))
    .limit(PAGE_SIZE);

  const totalCount = await cursor.count(false);
  const onlineProfiles = cursor.toArray();
  const pages = Math.ceil(totalCount / PAGE_SIZE);
  return { onlineProfiles, pages };
}

function validate(onlineProfile) {
  const errors = [];
  // if (issue.title.length < 3) {
  //   errors.push('Field "title" must be at least 3 characters long.');
  // }
  // if (issue.status === 'Assigned' && !issue.owner) {
  //   errors.push('Field "owner" is required when status is "Assigned"');
  // }
  if (errors.length > 0) {
    throw new UserInputError('Invalid input(s)', { errors });
  }
}

async function add(_, { onlineProfile }) {
  const db = getDb();
  validate(onlineProfile);

  const newOnlineProfile = Object.assign({}, onlineProfile);
  newOnlineProfile.created = new Date();
  newOnlineProfile.id = await getNextSequence('onlineProfiles');

  const result = await db.collection('onlineProfiles').insertOne(newOnlineProfile);
  const savedOnlineProfile = await db.collection('onlineProfiles')
    .findOne({ _id: result.insertedId });
  console.log('add - savedOnlineProfile:', savedOnlineProfile);
  return savedOnlineProfile;
}

async function update(_, { id, changes }) {
  const db = getDb();
  console.log('update - changes:', changes);
  if (changes.name || changes.seeking || changes.product || changes.website || changes.address || changes.postal) {
    const onlineProfile = await db.collection('onlineProfiles').findOne({ id });
    console.log('update - onlineProfile db object:', onlineProfile);

    Object.assign(onlineProfile, changes);
    validate(onlineProfile);
  }
  await db.collection('onlineProfiles').updateOne({ id }, { $set: changes });
  const savedOnlineProfile = await db.collection('onlineProfiles').findOne({ id });
  console.log('update - savedOnlineProfile:', savedOnlineProfile);
  return savedOnlineProfile;
}

module.exports = {
  list,
  add: mustBeSignedIn(add),
  get,
  update: mustBeSignedIn(update),
};
