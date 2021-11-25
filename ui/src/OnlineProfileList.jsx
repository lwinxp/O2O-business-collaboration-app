import React from 'react';
import URLSearchParams from 'url-search-params';
import { Panel, Pagination, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import ProfileFilter from './ProfileFilter.jsx';
import ProfileSearch from './ProfileSearch.jsx';

import graphQLFetch from './graphQLFetch.js';
import withToast from './withToast.jsx';
import store from './store.js';

import OnlineProfileTable from './OnlineProfileTable.jsx';
import OnlineProfileAddItem from './OnlineProfileAddItem.jsx';

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

class OnlineProfileList extends React.Component {
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

    const query = `query onlineProfileList(
      $seeking: SeekingStatusType
      $storageMin: Int
      $storageMax: Int
      $hasSelection: Boolean!
      $selectedId: Int!
      $page: Int
    ) {
      onlineProfileList(
        seeking: $seeking
        storageMin: $storageMin
        storageMax: $storageMax
        page: $page
      ) {
        onlineProfiles {
          id name seeking website product
          address postal created userId
        }
        pages
      }
      onlineProfile(id: $selectedId) @include (if : $hasSelection) {
        id
      }
    }`;

    const data = await graphQLFetch(query, vars, showError);
    return data;
  }

  constructor() {
    super();
    const initialData = store.initialData || { onlineProfileList: {} };
    const {
      onlineProfileList: { onlineProfiles, pages }, onlineProfile: selectedOnlineProfile,
    } = initialData;
    delete store.initialData;
    this.state = {
      onlineProfiles,
      selectedOnlineProfile,
      pages,
    };
    console.log('selectedOnlineProfile:', selectedOnlineProfile);
    console.log('pages:', pages);
    console.log('onlineProfiles:', onlineProfiles);


    const user = store.userData ? store.userData.user : null;
    delete store.userData;
    this.state = { user };

    this.onUserChange = this.onUserChange.bind(this);
  }

  async componentDidMount() {
    const { onlineProfiles } = this.state;
    if (onlineProfiles == null) this.loadData();
    const { user } = this.state;
    if (user == null) {
      const data = await OnlineProfileList.fetchUserData();
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
    const data = await OnlineProfileList.fetchData(match, search, showError);
    if (data) {
      this.setState({
        onlineProfiles: data.onlineProfileList.onlineProfiles,
        selectedOnlineProfile: data.onlineProfile,
        pages: data.onlineProfileList.pages,
      });
    }
  }


  render() {
    const { user } = this.state;
    if (user == null) return null;

    const { onlineProfiles } = this.state;
    if (onlineProfiles == null) return null;

    const { selectedOnlineProfile, pages } = this.state;
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
        <h3>Your Online Profiles</h3>
        {/* <ProfileSearch />
        <br />
        <Panel>
          <Panel.Heading>
            <Panel.Title toggle>Filter</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>
            <ProfileFilter urlBase="/online-profile-list" />
          </Panel.Body>
        </Panel> */}
        <OnlineProfileTable onlineProfiles={onlineProfiles} browse={false} />

        <div>
          <OnlineProfileAddItem user={user} />
          <p />
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

const OnlineProfileListWithToast = withToast(OnlineProfileList);
OnlineProfileListWithToast.fetchData = OnlineProfileList.fetchData;

export default OnlineProfileListWithToast;
