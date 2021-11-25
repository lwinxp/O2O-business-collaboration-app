import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import {
  NavItem, Glyphicon, Modal, Form, FormGroup, FormControl, ControlLabel,
  Button, ButtonToolbar, Tooltip, OverlayTrigger,
} from 'react-bootstrap';

import graphQLFetch from './graphQLFetch.js';
import withToast from './withToast.jsx';
import UserContext from './UserContext.js';

class StorageCollaborationAddItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: false,
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  showModal() {
    this.setState({ showing: true });
  }

  hideModal() {
    this.setState({ showing: false });
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.hideModal();

    const { offlineProfileId, offlineProfileUserId, userObject } = this.props;

    const form = document.forms.storageCollaborationAdd;
    const storageCollaboration = {
      name: form.name.value,
      seeking: form.seeking.value,
      offlineProfileId,
      offlineProfileUserId,
      onlineProfileUserId: userObject.email, // storageCollaboration don't have userId
    };
    const query = `mutation storageCollaborationAdd($storageCollaboration: StorageCollaborationInputs!) {
      storageCollaborationAdd(storageCollaboration: $storageCollaboration) {
        id
      }
    }`;

    const { showError } = this.props;
    const data = await graphQLFetch(query, { storageCollaboration }, showError);
    if (data) {
      const { history } = this.props;
      history.replace(`/storage-collaboration-list/storage-collaboration/${data.storageCollaborationAdd.id}`);
    }
  }

  render() {
    const { showing } = this.state;
    const user = this.context;

    return (
      <React.Fragment>
        <Button disabled={!user.signedIn} onClick={this.showModal} bsStyle="primary" type="button" className="add-storageCollaboration-profile-button">Create Storage Collaboration</Button>

        <Modal keyboard show={showing} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Create Storage Collaboration</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form name="storageCollaborationAdd">
              <FormGroup>
                <ControlLabel>Name</ControlLabel>
                <FormControl name="name" autoFocus />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Seeking</ControlLabel>
                <FormControl name="seeking" componentClass="select" placeholder="seeking...">
                  <option value="Storage">Storage</option>
                  <option value="Other">Other</option>
                </FormControl>
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <ButtonToolbar>
              <Button
                type="button"
                bsStyle="primary"
                onClick={this.handleSubmit}
              >
                Submit
              </Button>
              <Button bsStyle="link" onClick={this.hideModal}>Cancel</Button>
            </ButtonToolbar>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

// StorageCollaborationAddItem.contextType = UserContext;

export default withToast(withRouter(StorageCollaborationAddItem));

StorageCollaborationAddItem.contextType = UserContext;
