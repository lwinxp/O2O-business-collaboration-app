import React from 'react';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Button, Glyphicon, Tooltip, OverlayTrigger, Table,
} from 'react-bootstrap';

import UserContext from './UserContext.js';

// eslint-disable-next-line react/prefer-stateless-function
class StorageCollaborationRowPlain extends React.Component {
  render() {
    const {
      browse, storageCollaboration, location: { search }, index,
    } = this.props;
    const user = this.context;
    const disabled = !user.signedIn;

    const selectLocation = { pathname: `storage-collaboration-list/storage-collaboration/${storageCollaboration.id}`, search };
    const editTooltip = (
      <Tooltip id="close-tooltip" placement="top">View Storage Collaboration</Tooltip>
    );

    const tableRow = (
      <tr>
        {/* <td>{storageCollaboration.id}</td> */}
        <td>{storageCollaboration.name}</td>
        <td>{storageCollaboration.seeking}</td>
        <td>{storageCollaboration.volume}</td>
        <td>{storageCollaboration.price}</td>
        <td>{storageCollaboration.startDate ? storageCollaboration.startDate.toDateString() : ''}</td>
        <td>{storageCollaboration.endDate ? storageCollaboration.endDate.toDateString() : ''}</td>
        <td>{storageCollaboration.coldVolume}</td>
        <td>{storageCollaboration.coldPrice}</td>
        <td>{storageCollaboration.coldStartDate ? storageCollaboration.coldStartDate.toDateString() : ''}</td>
        <td>{storageCollaboration.coldEndDate ? storageCollaboration.coldEndDate.toDateString() : ''}</td>
        <td>{storageCollaboration.status}</td>
        <td>{storageCollaboration.created.toDateString()}</td>
      </tr>
    );

    return (
      <LinkContainer to={selectLocation}>
        {tableRow}
      </LinkContainer>
    );
  }
}

StorageCollaborationRowPlain.contextType = UserContext;
const StorageCollaborationRow = withRouter(StorageCollaborationRowPlain);
delete StorageCollaborationRow.contextType;

export default function StorageCollaborationTable({ storageCollaborations, browse }) {
  const storageCollaborationRows = storageCollaborations.map((storageCollaboration, index) => (
    <StorageCollaborationRow
      key={storageCollaboration.id}
      storageCollaboration={storageCollaboration}
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
          <th>Volume (m3)</th>
          <th>Price ($)</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Cold Volume (m3)</th>
          <th>Cold Price ($)</th>
          <th>Cold Start Date</th>
          <th>Cold End Date</th>
          <th>Status</th>
          <th>Created</th>
          {/* <th>Edit</th> */}
        </tr>
      </thead>
      <tbody>
        {storageCollaborationRows}
      </tbody>
    </Table>
  );
}
