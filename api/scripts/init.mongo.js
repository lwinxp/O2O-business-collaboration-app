/*
 * Run using the mongo shell. For remote databases, ensure that the
 * connection string is supplied in the command line. For example:
 * localhost:
 *   mongo omni scripts/init.mongo.js
 * Atlas:
 *   mongo mongodb+srv://user:pwd@xxx.mongodb.net/omni scripts/init.mongo.js
 * MLab:
 *   mongo mongodb://user:pwd@xxx.mlab.com:33533/omni scripts/init.mongo.js
 */

/* global db print */
/* eslint no-restricted-globals: "off" */

// ====== 
// Online Profile Seeding
// ======
db.onlineProfiles.remove({});

const onlineProfilesDB = [
  {
    id: 1,
    userId: 'limxuanping@gmail.com', // replace with your own email 1
    seeking: 'Storage',
    name: 'Big Fish',
    website: 'www.bigfish.com',
    product: 'seafood',
    address: '456 Digital Rd',
    postal: '654321',
    created: new Date('2021-11-21'),
  },
  {
    id: 2,
    userId: 'limxuanping.govtech@gmail.com', // replace with your own email 2
    seeking: 'Storage',
    name: 'Small Fish',
    website: 'www.smallfish.com',
    product: 'seafood',
    address: '123 Digital Rd',
    postal: '123456',
    created: new Date('2021-11-21'),
  },
];

db.onlineProfiles.insertMany(onlineProfilesDB);
const onlineProfilesCount = db.onlineProfiles.count();
print('Inserted', onlineProfilesCount, 'onlineProfiles');

db.counters.remove({ _id: 'onlineProfiles' });
db.counters.insert({ _id: 'onlineProfiles', current: onlineProfilesCount });

db.onlineProfiles.createIndex({ id: 1 }, { unique: true });
db.onlineProfiles.createIndex({ seeking: 1 });
db.onlineProfiles.createIndex({ created: 1 });
db.onlineProfiles.createIndex({ name: 'text', website: 'text', product: 'text', address: 'text', postal: 'text' });

// ====== 
// Offline Profile Seeding
// ======
db.offlineProfiles.remove({});

const offlineProfilesDB = [
  {
    id: 1,
    userId: 'limxuanping@gmail.com', // replace with your own email 1
    seeking: 'Storage',
    name: 'Uncle Joe Fishmonger',
    website: 'www.joefish.com',
    product: 'seafood',
    address: '123 Fishery Rd',
    postal: '123456',
    totalStorage: 100,
    totalColdStorage: 100,
    availStorage: 100,
    availColdStorage: 100,
    reserved: false,
    reservationContact: null,
    created: new Date('2021-11-21'),
  },
  {
    id: 2,
    userId: 'limxuanping.govtech@gmail.com', // replace with your own email 2
    seeking: 'Storage',
    name: 'Uncle Ben Fishmonger',
    website: 'www.benfish.com',
    product: 'seafood',
    address: '456 Fishery Rd',
    postal: '654321',
    totalStorage: 200,
    totalColdStorage: 200,
    availStorage: 200,
    availColdStorage: 200,
    reserved: false,
    reservationContact: null,
    created: new Date('2021-11-21'),
  },
];

db.offlineProfiles.insertMany(offlineProfilesDB);
const offlineProfilesCount = db.offlineProfiles.count();
print('Inserted', offlineProfilesCount, 'offlineProfiles');

db.counters.remove({ _id: 'offlineProfiles' });
db.counters.insert({ _id: 'offlineProfiles', current: offlineProfilesCount });

db.offlineProfiles.createIndex({ id: 1 }, { unique: true });
db.offlineProfiles.createIndex({ seeking: 1 });
db.offlineProfiles.createIndex({ created: 1 });
db.offlineProfiles.createIndex({ name: 'text', website: 'text', product: 'text', address: 'text', postal: 'text' });

// ====== 
// Storage Collaborations Seeding
// ======
db.storageCollaborations.remove({});

const storageCollaborationsDB = [
  {
    id: 1,
    onlineProfileUserId: 'limxuanping.govtech@gmail.com', // replace with your own email 2
    offlineProfileUserId: 'limxuanping@gmail.com', // replace with your own email 1
    offlineProfileId: 123,
    name: 'Big Fish - Uncle Joe Storage Collaboration',
    seeking: 'Storage',
    volume: 10,
    price: 10,
    startDate: new Date('2021-11-21'),
    endDate: new Date('2021-12-21'),
    coldVolume: 5,
    coldPrice: 5,
    coldStartDate: new Date('2021-11-21'),
    coldEndDate: new Date('2021-12-21'),
    status: 'Accepted',
    created: new Date('2021-11-21'),
  },
  {
    id: 2,
    onlineProfileUserId: 'limxuanping@gmail.com', // replace with your own email 1
    offlineProfileUserId: 'limxuanping.govtech@gmail.com', // replace with your own email 2
    offlineProfileId: 123,
    name: 'Small Fish - Uncle Ben Storage Collaboration',
    seeking: 'Storage',
    volume: 20,
    price: 20,
    startDate: new Date('2021-11-21'),
    endDate: new Date('2021-12-21'),
    coldVolume: 10,
    coldPrice: 10,
    coldStartDate: new Date('2021-11-21'),
    coldEndDate: new Date('2021-12-21'),
    status: 'Rejected',
    created: new Date('2021-11-21'),
  },
];

db.storageCollaborations.insertMany(storageCollaborationsDB);
const storageCollaborationsCount = db.storageCollaborations.count();
print('Inserted', storageCollaborationsCount, 'storageCollaborations');

db.counters.remove({ _id: 'storageCollaborations' });
db.counters.insert({ _id: 'storageCollaborations', current: storageCollaborationsCount });

db.storageCollaborations.createIndex({ id: 1 }, { unique: true });
db.storageCollaborations.createIndex({ seeking: 1 });
db.storageCollaborations.createIndex({ status: 1 });
db.storageCollaborations.createIndex({ created: 1 });
db.storageCollaborations.createIndex({ startDate: 1 });
db.storageCollaborations.createIndex({ endDate: 1 });
db.storageCollaborations.createIndex({ coldStartDate: 1 });
db.storageCollaborations.createIndex({ coldEndDate: 1 });
db.storageCollaborations.createIndex({ name: 'text', onlineProfileUserId: 'text', offlineProfileUserId: 'text' });
