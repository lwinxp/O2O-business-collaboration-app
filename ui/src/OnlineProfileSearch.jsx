import React from 'react';
import SelectAsync from 'react-select/lib/Async'; // eslint-disable-line
import { withRouter } from 'react-router-dom';

import graphQLFetch from './graphQLFetch.js';
import withToast from './withToast.jsx';

class OnlineProfileSearch extends React.Component {
  constructor(props) {
    super(props);

    this.onChangeSelection = this.onChangeSelection.bind(this);
    this.loadOptions = this.loadOptions.bind(this);
  }

  onChangeSelection({ value }) {
    const { history } = this.props;
    // history.push(`/edit/${value}`);
    history.push(`/browse-online-profile/online-profile/${value}`);
  }

  async loadOptions(term) {
    if (term.length < 3) return [];
    const query = `query onlineProfileList($search: String) {
      onlineProfileList(search: $search) {
        onlineProfiles {id name postal}
      }
    }`;

    const { showError } = this.props;
    const data = await graphQLFetch(query, { search: term }, showError);
    return data.onlineProfileList.onlineProfiles.map(onlineProfile => ({
      label: `#${onlineProfile.id}: ${onlineProfile.name}: ${onlineProfile.postal}`, value: onlineProfile.id,
    }));
  }

  render() {
    return (
      <SelectAsync
        instanceId="search-select"
        value=""
        loadOptions={this.loadOptions}
        filterOption={() => true}
        onChange={this.onChangeSelection}
        components={{ DropdownIndicator: null }}
      />
    );
  }
}

export default withRouter(withToast(OnlineProfileSearch));
