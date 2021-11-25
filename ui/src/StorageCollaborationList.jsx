import React from 'react';
import URLSearchParams from 'url-search-params';
import { Panel, Pagination, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import ProfileFilter from './ProfileFilter.jsx';
import ProfileSearch from './ProfileSearch.jsx';

import graphQLFetch from './graphQLFetch.js';
import withToast from './withToast.jsx';
import store from './store.js';

import StorageCollaborationTable from './StorageCollaborationTable.jsx';

const SECTION_SIZE = 5;

function PageLink({
  params, page, activePage, children,
}) {
  params.set('page', page);
  if (page === 0) return React.cloneElement(children, { disabled: true });
  return (
    <LinkContainer
      isActive={() => page === activePage}
      to={{ search: `?${params.toString()}` }}
    >
      {children}
    </LinkContainer>
  );
}

class StorageCollaborationList extends React.Component {
  static async fetchUserData(cookie) {
    const query = `query { user {
      signedIn givenName email
    }}`;
    const data = await graphQLFetch(query, null, null, cookie);
    return data;
  }

  static async fetchData(match, search, showError) {
    const params = new URLSearchParams(search);
    const vars = { hasSelection: false, selectedId: 0 };
    if (params.get('seeking')) vars.seeking = params.get('seeking');

    const storageMin = parseInt(params.get('storageMin'), 10);
    if (!Number.isNaN(storageMin)) vars.storageMin = storageMin;
    const storageMax = parseInt(params.get('storageMax'), 10);
    if (!Number.isNaN(storageMax)) vars.storageMax = storageMax;

    const { params: { id } } = match;
    const idInt = parseInt(id, 10);
    if (!Number.isNaN(idInt)) {
      vars.hasSelection = true;
      vars.selectedId = idInt;
    }

    let page = parseInt(params.get('page'), 10);
    if (Number.isNaN(page)) page = 1;
    vars.page = page;

    const query = `query storageCollaborationList(
      $seeking: SeekingStatusType
      $storageMin: Int
      $storageMax: Int
      $hasSelection: Boolean!
      $selectedId: Int!
      $page: Int
    ) {
      storageCollaborationList(
        seeking: $seeking
        storageMin: $storageMin
        storageMax: $storageMax
        page: $page
      ) {
        storageCollaborations {
          id name seeking volume price startDate endDate
          coldVolume coldPrice coldStartDate coldEndDate created
          offlineProfileId onlineProfileUserId offlineProfileUserId
          status
        }
        pages
      }
      storageCollaboration(id: $selectedId) @include (if : $hasSelection) {
        id
      }
    }`;

    const data = await graphQLFetch(query, vars, showError);
    return data;
  }

  constructor() {
    super();
    const initialData = store.initialData || { storageCollaborationList: {} };
    const {
      storageCollaborationList: { storageCollaborations, pages }, storageCollaboration: selectedStorageCollaboration,
    } = initialData;
    delete store.initialData;
    this.state = {
      storageCollaborations,
      selectedStorageCollaboration,
      pages,
    };
    const user = store.userData ? store.userData.user : null;
    delete store.userData;
    this.state = { user };

    this.onUserChange = this.onUserChange.bind(this);
  }

  async componentDidMount() {
    const { storageCollaborations } = this.state;
    if (storageCollaborations == null) this.loadData();
    const { user } = this.state;
    if (user == null) {
      const data = await StorageCollaborationList.fetchUserData();
      this.setState({ user: data.user });
    }
  }

  componentDidUpdate(prevProps) {
    const {
      location: { search: prevSearch },
      match: { params: { id: prevId } },
    } = prevProps;
    const { location: { search }, match: { params: { id } } } = this.props;
    if (prevSearch !== search || prevId !== id) {
      this.loadData();
    }
  }

  onUserChange(user) {
    this.setState({ user });
  }

  async loadData() {
    const { location: { search }, match, showError } = this.props;
    const data = await StorageCollaborationList.fetchData(match, search, showError);
    if (data) {
      this.setState({
        storageCollaborations: data.storageCollaborationList.storageCollaborations,
        selectedStorageCollaboration: data.storageCollaboration,
        pages: data.storageCollaborationList.pages,
      });
      console.log('data:', data);
    }
  }

  render() {
    const { user } = this.state;
    if (user == null) return null;

    const { storageCollaborations } = this.state;
    if (storageCollaborations == null) return null;

    const { selectedStorageCollaboration, pages } = this.state;
    const { location: { search } } = this.props;

    const params = new URLSearchParams(search);
    let page = parseInt(params.get('page'), 10);
    if (Number.isNaN(page)) page = 1;
    const startPage = Math.floor((page - 1) / SECTION_SIZE) * SECTION_SIZE + 1;
    const endPage = startPage + SECTION_SIZE - 1;
    const prevSection = startPage === 1 ? 0 : startPage - SECTION_SIZE;
    const nextSection = endPage >= pages ? 0 : startPage + SECTION_SIZE;

    const items = [];
    for (let i = startPage; i <= Math.min(endPage, pages); i += 1) {
      params.set('page', i);
      items.push((
        <PageLink key={i} params={params} activePage={page} page={i}>
          <Pagination.Item>{i}</Pagination.Item>
        </PageLink>
      ));
    }
    return (
      <React.Fragment>
        <h3>Storage Collaborations</h3>
        {/* <ProfileSearch />
        <br />
        <Panel>
          <Panel.Heading>
            <Panel.Title toggle>Filter</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>
            <ProfileFilter urlBase="/browse-offline-profile" />
          </Panel.Body>
        </Panel> */}

        <StorageCollaborationTable storageCollaborations={storageCollaborations} browse />

        <div>
          <Pagination>
            <PageLink params={params} page={prevSection}>
              <Pagination.Item>{'<'}</Pagination.Item>
            </PageLink>
            {items}
            <PageLink params={params} page={nextSection}>
              <Pagination.Item>{'>'}</Pagination.Item>
            </PageLink>
          </Pagination>
        </div>
      </React.Fragment>
    );
  }
}

const StorageCollaborationListWithToast = withToast(StorageCollaborationList);
StorageCollaborationListWithToast.fetchData = StorageCollaborationList.fetchData;

export default StorageCollaborationListWithToast;