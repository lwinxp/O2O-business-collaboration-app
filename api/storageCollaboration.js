const { UserInputError } = require('apollo-server-express');
const { getDb, getNextSequence } = require('./db.js');
const { mustBeSignedIn } = require('./auth.js');

async function get(_, { id }) {
  const db = getDb();
  const storageCollaboration = await db.collection('storageCollaborations').findOne({ id });
  return storageCollaboration;
}

async function list() {
  const db = getDb();
  const storageCollaborations = await db.collection('storageCollaborations').find({}).toArray();
  return storageCollaborations;
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

  const cursor = db.collection('storageCollaborations').find(filter)
    .sort({ id: 1 })
    .skip(PAGE_SIZE * (page - 1))
    .limit(PAGE_SIZE);

  const totalCount = await cursor.count(false);
  const storageCollaborations = cursor.toArray();
  const pages = Math.ceil(totalCount / PAGE_SIZE);
  return { storageCollaborations, pages };
}

function validate(storageCollaboration) {
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

async function add(_, { storageCollaboration }) {
  const db = getDb();
  validate(storageCollaboration);

  const newStorageCollaboration = Object.assign({}, storageCollaboration);
  newStorageCollaboration.created = new Date();
  newStorageCollaboration.id = await getNextSequence('storageCollaborations');
  newStorageCollaboration.status = 'Draft';

  const result = await db.collection('storageCollaborations').insertOne(newStorageCollaboration);
  const savedStorageCollaboration = await db.collection('storageCollaborations')
    .findOne({ _id: result.insertedId });
  console.log('add - savedStorageCollaboration:', savedStorageCollaboration);
  return savedStorageCollaboration;
}

async function update(_, { id, changes }) {
  const db = getDb();
  console.log('update - changes:', changes);

  try {
    if (changes.name || changes.seeking || changes.status || changes.volume || changes.price || changes.startDate || changes.endDate || changes.coldVolume || changes.coldPrice || changes.coldStartDate || changes.coldEndDate) {
      const storageCollaboration = await db.collection('storageCollaborations').findOne({ id });
      console.log('update - storageCollaboration db object:', storageCollaboration);

      Object.assign(storageCollaboration, changes);
      validate(storageCollaboration);

      await db.collection('storageCollaborations').updateOne({ id }, { $set: changes });
      var savedStorageCollaboration = await db.collection('storageCollaborations').findOne({ id });
      console.log('update - savedStorageCollaboration:', savedStorageCollaboration);
    }

    if (changes.status && changes.status === 'Accepted') {
      const ObjectID = require('mongodb').ObjectID;   
      
      const storageCollaborationTarget = await db.collection('offlineProfiles').findOne({"_id": new ObjectID(changes.offlineProfileId)});
      console.log('storageCollaborationTarget:',storageCollaborationTarget);
    
      const storageCollaborationTargetId = storageCollaborationTarget.id
      console.log('storageCollaborationTargetId 1:',storageCollaborationTargetId);
    
      const newVolume = storageCollaborationTarget.availStorage - changes.volume
      console.log('newVolume:',newVolume);
    
      const newColdVolume = storageCollaborationTarget.availColdStorage - changes.coldVolume
      console.log('newColdVolume:',newColdVolume);
    
      const volumeChange = {availStorage: newVolume, availColdStorage: newColdVolume}
      console.log('volumeChange 1:',volumeChange);
    
      const reservedChange = {reserved: true}
      const reservationContact = {reservationContact: changes.onlineProfileUserId}

      Object.assign(storageCollaborationTarget, volumeChange);
      // validate(storageCollaborationVolumeUpdate);
      await db.collection('offlineProfiles').updateOne({"_id": new ObjectID(changes.offlineProfileId)}, { $set: volumeChange });
      await db.collection('offlineProfiles').updateOne({"_id": new ObjectID(changes.offlineProfileId)}, { $set: reservedChange });
      await db.collection('offlineProfiles').updateOne({"_id": new ObjectID(changes.offlineProfileId)}, { $set: reservationContact });

      const savedStorageCollaborationTarget = await db.collection('offlineProfiles').findOne({ storageCollaborationTargetId });
      console.log('update - savedStorageCollaborationTarget:', savedStorageCollaborationTarget);

      console.log('storageCollaborationTargetId 2:',storageCollaborationTargetId);
      console.log('volumeChange 2:',volumeChange);
    }

  } catch (err) {
    console.log(err);
  } finally {
    return savedStorageCollaboration;
  }
}

module.exports = {
  list,
  add: mustBeSignedIn(add),
  get,
  update: mustBeSignedIn(update),
};
