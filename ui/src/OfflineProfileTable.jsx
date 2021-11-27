import React from 'react';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Button, Glyphicon, Tooltip, OverlayTrigger, Table,
} from 'react-bootstrap';

import UserContext from './UserContext.js';

// eslint-disable-next-line react/prefer-stateless-function
class OfflineProfileRowPlain extends React.Component {
  render() {
    const {
      browse, offlineProfile, location: { search }, index,
    } = this.props;
    
    // console.log('offlineProfile:', offlineProfile);
    // console.log('offlineProfile.reserved:', offlineProfile.reserved);

    const user = this.context;
    const disabled = !user.signedIn;

    const pathnameToggle = browse ? '/browse-offline-profile/offline-profile' : '/offline-profile-list/offline-profile';
    const selectLocation = { pathname: `${pathnameToggle}/${offlineProfile.id}`, search };
    const editTooltip = (
      <Tooltip id="close-tooltip" placement="top">Edit Offline Profile</Tooltip>
    );

    const tableRow = (
      <tr>
        {/* <td>{offlineProfile.id}</td> */}
        <td>{offlineProfile.name}</td>
        <td>{offlineProfile.seeking}</td>
        <td>{offlineProfile.address}</td>
        <td>{offlineProfile.website}</td>
        <td>{offlineProfile.postal}</td>
        <td>{offlineProfile.totalStorage}</td>
        <td>{offlineProfile.totalColdStorage}</td>
        <td>{offlineProfile.availStorage}</td>
        <td>{offlineProfile.availColdStorage}</td>
        <td>{offlineProfile.reserved.toString()}</td>
        <td>{offlineProfile.created.toDateString()}</td>
      </tr>
    );

    return (
      <LinkContainer to={selectLocation}>
        {tableRow}
      </LinkContainer>
    );
  }
}

OfflineProfileRowPlain.contextType = UserContext;
const OfflineProfileRow = withRouter(OfflineProfileRowPlain);
delete OfflineProfileRow.contextType;

export default function OfflineProfileTable({ offlineProfiles, browse }) {
  const offlineProfileRows = offlineProfiles.map((offlineProfile, index) => (
    <OfflineProfileRow
      key={offlineProfile.id}
      offlineProfile={offlineProfile}
      index={index}
      browse={browse}
    />
  ));

  return (
    <Table bordered condensed hover responsive>
      <thead>
        <tr>
          {/* <th>ID</th> */}
          <th>Name</th>
          <th>Seeking</th>
          <th>Address</th>
          <th>Website</th>
          <th>Postal</th>
          <th>Total Storage (m3)</th>
          <th>Total Cold Storage (m3)</th>
          <th>Available Storage (m3)</th>
          <th>Available Cold Storage (m3)</th>
          <th>Reserved</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        {offlineProfileRows}
      </tbody>
    </Table>
  );
}
