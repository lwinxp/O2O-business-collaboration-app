import React from 'react';
import SelectAsync from 'react-select/lib/Async'; // eslint-disable-line
import { withRouter } from 'react-router-dom';

import graphQLFetch from './graphQLFetch.js';
import withToast from './withToast.jsx';

class OfflineProfileSearch extends React.Component {
  constructor(props) {
    super(props);

    this.onChangeSelection = this.onChangeSelection.bind(this);
    this.loadOptions = this.loadOptions.bind(this);
  }

  onChangeSelection({ value }) {
    const { history } = this.props;
    // history.push(`/edit/${value}`);
    history.push(`/browse-offline-profile/offline-profile/${value}`);
  }

  async loadOptions(term) {
    if (term.length < 3) return [];
    const query = `query offlineProfileList($search: String) {
      offlineProfileList(search: $search) {
        offlineProfiles {id name postal}
      }
    }`;

    const { showError } = this.props;
    const data = await graphQLFetch(query, { search: term }, showError);
    return data.offlineProfileList.offlineProfiles.map(offlineProfile => ({
      label: `#${offlineProfile.id}: ${offlineProfile.name}: ${offlineProfile.postal}`, value: offlineProfile.id,
    }));
  }

  render() {
    return (
      <React.Fragment>
        <SelectAsync
          instanceId="search-select"
          value=""
          loadOptions={this.loadOptions}
          filterOption={() => true}
          onChange={this.onChangeSelection}
          components={{ DropdownIndicator: null }}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(withToast(OfflineProfileSearch));
