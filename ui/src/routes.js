import OnlineProfileList from './OnlineProfileList.jsx';
import OfflineProfileList from './OfflineProfileList.jsx';
import PrivateOnlineProfile from './PrivateOnlineProfile.jsx';
import PrivateOfflineProfile from './PrivateOfflineProfile.jsx';
import PublicOnlineProfile from './PublicOnlineProfile.jsx';
import PublicOfflineProfile from './PublicOfflineProfile.jsx';
import BrowseOfflineProfile from './BrowseOfflineProfile.jsx';
import BrowseOnlineProfile from './BrowseOnlineProfile.jsx';
import StorageCollaborationList from './StorageCollaborationList.jsx';
import StorageCollaboration from './StorageCollaboration.jsx';
import About from './About.jsx';
import Login from './Login.jsx';
import NotFound from './NotFound.jsx';

const routes = [
  { path: '/online-profile-list/online-profile/:id?', component: PrivateOnlineProfile },
  { path: '/offline-profile-list/offline-profile/:id?', component: PrivateOfflineProfile },
  { path: '/browse-online-profile/online-profile/:id', component: PublicOnlineProfile },
  { path: '/browse-offline-profile/offline-profile/:id', component: PublicOfflineProfile },
  { path: '/online-profile-list', component: OnlineProfileList },
  { path: '/offline-profile-list', component: OfflineProfileList },
  { path: '/browse-online-profile', component: BrowseOnlineProfile },
  { path: '/browse-offline-profile', component: BrowseOfflineProfile },
  { path: '/storage-collaboration-list', component: StorageCollaborationList },
  { path: '/storage-collaboration-list/storage-collaboration/:id', component: StorageCollaboration },
  { path: '/about', component: About },
  { path: '/login', component: Login },

  { path: '*', component: NotFound },
];

export default routes;
