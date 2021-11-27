import React from 'react';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Button, Glyphicon, Tooltip, OverlayTrigger, Table,
} from 'react-bootstrap';

import UserContext from './UserContext.js';

// eslint-disable-next-line react/prefer-stateless-function
class OnlineProfileRowPlain extends React.Component {
  render() {
    const {
      browse, onlineProfile, location: { search }, index,
    } = this.props;
    const user = this.context;
    const disabled = !user.signedIn;

    const pathnameToggle = browse ? '/browse-online-profile/online-profile' : '/online-profile-list/online-profile';
    const selectLocation = { pathname: `${pathnameToggle}/${onlineProfile.id}`, search };
    
    const editTooltip = (
      <Tooltip id="close-tooltip" placement="top">Edit Online Profile</Tooltip>
    );

    const tableRow = (
      <tr>
        {/* <td>{onlineProfile.id}</td> */}
        <td>{onlineProfile.name}</td>
        <td>{onlineProfile.seeking}</td>
        <td>{onlineProfile.address}</td>
        <td>{onlineProfile.website}</td>
        <td>{onlineProfile.postal}</td>
        <td>{onlineProfile.created.toDateString()}</td>
      </tr>
    );

    return (
      <LinkContainer to={selectLocation}>
        {tableRow}
      </LinkContainer>
    );
  }
}

OnlineProfileRowPlain.contextType = UserContext;
const OnlineProfileRow = withRouter(OnlineProfileRowPlain);
delete OnlineProfileRow.contextType;

export default function OnlineProfileTable({ onlineProfiles, browse }) {
  const onlineProfileRows = onlineProfiles.map((onlineProfile, index) => (
    <OnlineProfileRow
      key={onlineProfile.id}
      onlineProfile={onlineProfile}
      browse={browse}
      index={index}
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
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        {onlineProfileRows}
      </tbody>
    </Table>
  );
}
