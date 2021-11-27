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
  // console.log('small list offlineProfileUserId:', offlineProfileUserId);

  const storageCollaborations = await db.collection('storageCollaborations').find({}).toArray();
  return storageCollaborations;
}

const PAGE_SIZE = 10;

async function list(_, {
  status, storageMin, storageMax, search, page, offlineProfileUserId, onlineProfileUserId,
}) {
  // console.log('offlineProfileUserId:', offlineProfileUserId);
  // console.log('onlineProfileUserId:', onlineProfileUserId);

  const db = getDb();
  const filter = {$or:[{'offlineProfileUserId':offlineProfileUserId}, {'onlineProfileUserId':onlineProfileUserId }]};
  // const filter = {'offlineProfileUserId':offlineProfileUserId};
  // const filter = {'onlineProfileUserId':onlineProfileUserId};

  // filter = {}
  // if (offlineProfileUserId) filter.offlineProfileUserId = offlineProfileUserId;
  // if (onlineProfileUserId) filter.onlineProfileUserId = onlineProfileUserId;

  // if (status) filter.status = status;

  // if (storageMin !== undefined || storageMax !== undefined) {
  //   filter.storage = {};
  //   if (storageMin !== undefined) filter.storage.$gte = storageMin;
  //   if (storageMax !== undefined) filter.storage.$lte = storageMax;
  // }
  // console.log('search:', search);

  // if (search) filter.$text = { $search: search };
  // if (search && offlineProfileUserId) filter.$text = { $search: search, $offlineProfileUserId: offlineProfileUserId };


  // console.log('storageCollaborations filter:', filter);

  const cursor = db.collection('storageCollaborations').find(filter)
    .sort({ id: 1 })
    .skip(PAGE_SIZE * (page - 1))
    .limit(PAGE_SIZE);

  const totalCount = await cursor.count(false);
  const storageCollaborations = cursor.toArray();
  const pages = Math.ceil(totalCount / PAGE_SIZE);
  return { storageCollaborations, pages };
}
// returned storageCollaborations should be filtered by offlineProfileUserId

function validateAdd(storageCollaboration) {
  const errors = [];
  if (!storageCollaboration.name || !storageCollaboration.seeking) {
    errors.push('All fields are mandatory. Please fill in all fields');
  }
  if (errors.length > 0) {
    throw new UserInputError('Invalid input(s)', { errors });
  }
}

function validateUpdate(storageCollaboration) {
  const errors = [];
  if (!storageCollaboration.name || !storageCollaboration.seeking || !storageCollaboration.volume || !storageCollaboration.price || !storageCollaboration.startDate || !storageCollaboration.endDate || !storageCollaboration.coldVolume || !storageCollaboration.coldPrice || !storageCollaboration.coldStartDate || !storageCollaboration.coldEndDate) {
    errors.push('All fields are mandatory. Please fill in all fields');
  }
  if (errors.length > 0) {
    throw new UserInputError('Invalid input(s)', { errors });
  }
}

async function add(_, { storageCollaboration }) {
  const db = getDb();
  validateAdd(storageCollaboration);

  const newStorageCollaboration = Object.assign({}, storageCollaboration);
  newStorageCollaboration.created = new Date();
  newStorageCollaboration.id = await getNextSequence('storageCollaborations');
  newStorageCollaboration.status = 'Draft';

  const result = await db.collection('storageCollaborations').insertOne(newStorageCollaboration);
  const savedStorageCollaboration = await db.collection('storageCollaborations')
    .findOne({ _id: result.insertedId });
  // console.log('add - savedStorageCollaboration:', savedStorageCollaboration);
  return savedStorageCollaboration;
}

async function update(_, { id, changes }) {
  const db = getDb();
  // console.log('update - changes:', changes);

  try {
    if (changes.name || changes.seeking || changes.status || changes.volume || changes.price || changes.startDate || changes.endDate || changes.coldVolume || changes.coldPrice || changes.coldStartDate || changes.coldEndDate) {
      const storageCollaboration = await db.collection('storageCollaborations').findOne({ id });
      // console.log('update - storageCollaboration db object:', storageCollaboration);

      Object.assign(storageCollaboration, changes);
      validateUpdate(storageCollaboration);

      await db.collection('storageCollaborations').updateOne({ id }, { $set: changes });
      var savedStorageCollaboration = await db.collection('storageCollaborations').findOne({ id });
      // console.log('update - savedStorageCollaboration:', savedStorageCollaboration);
    }

    if (changes.status && changes.status === 'Accepted') {
      const ObjectID = require('mongodb').ObjectID;   
      
      const storageCollaborationTarget = await db.collection('offlineProfiles').findOne({"_id": new ObjectID(changes.offlineProfileId)});
      // console.log('storageCollaborationTarget:',storageCollaborationTarget);
    
      const storageCollaborationTargetId = storageCollaborationTarget.id
      // console.log('storageCollaborationTargetId 1:',storageCollaborationTargetId);
    
      const newVolume = storageCollaborationTarget.availStorage - changes.volume
      // console.log('newVolume:',newVolume);
    
      const newColdVolume = storageCollaborationTarget.availColdStorage - changes.coldVolume
      // console.log('newColdVolume:',newColdVolume);
    
      const volumeChange = {availStorage: newVolume, availColdStorage: newColdVolume}
      // console.log('volumeChange 1:',volumeChange);
    
      const reservedChange = {reserved: true}
      const reservationContact = {reservationContact: changes.onlineProfileUserId}

      Object.assign(storageCollaborationTarget, volumeChange);
      // validate(storageCollaborationVolumeUpdate);
      await db.collection('offlineProfiles').updateOne({"_id": new ObjectID(changes.offlineProfileId)}, { $set: volumeChange });
      await db.collection('offlineProfiles').updateOne({"_id": new ObjectID(changes.offlineProfileId)}, { $set: reservedChange });
      await db.collection('offlineProfiles').updateOne({"_id": new ObjectID(changes.offlineProfileId)}, { $set: reservationContact });

      const savedStorageCollaborationTarget = await db.collection('offlineProfiles').findOne({ storageCollaborationTargetId });
      // console.log('update - savedStorageCollaborationTarget:', savedStorageCollaborationTarget);

      // console.log('storageCollaborationTargetId 2:',storageCollaborationTargetId);
      // console.log('volumeChange 2:',volumeChange);
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
