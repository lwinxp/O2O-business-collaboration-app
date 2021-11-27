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
  static async fetchUserData(cookie) {
    const query = `query { user {
      signedIn givenName email
    }}`;
    const data = await graphQLFetch(query, null, null, cookie);
    return data;
  }

  constructor(props) {
    super(props);
    this.state = {
      showing: false,
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  async componentDidMount() {
    const { user } = this.state;
    if (user == null) {
      const data = await StorageCollaborationAddItem.fetchUserData();
      this.setState({ user: data.user });
    }
    // console.log('StorageCollaborationAddItem componentDidMount fetchUserData:', this.state.user);
  }

  showModal() {
    this.setState({ showing: true });
  }

  hideModal() {
    this.setState({ showing: false });
  }

  async handleSubmit(userContext, e) {
    e.preventDefault();
    this.hideModal();

    // console.log('StorageCollaborationAddItem user:', user);
    // console.log('StorageCollaborationAddItem this.state.user:', this.state.user);

    const { offlineProfileId, offlineProfileUserId, userObject } = this.props;

    const form = document.forms.storageCollaborationAdd;
    const storageCollaboration = {
      name: form.name.value,
      seeking: form.seeking.value,
      offlineProfileId,
      offlineProfileUserId,
      onlineProfileUserId: this.state.user.email, // user from prop and context had flakiness, did not add to DB and cause error. to solve, here used direct async query for user in async componentDidUMount for speed and guarantee
    };
    const query = `mutation storageCollaborationAdd($storageCollaboration: StorageCollaborationInputs!) {
      storageCollaborationAdd(storageCollaboration: $storageCollaboration) {
        id
      }
    }`;

    // console.log('storage add item onlineProfileUserId:', storageCollaboration);
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
                onClick={(e) => this.handleSubmit(user, e)}
                // onClick={() => { this.handleSubmit.bind(this, user)}}
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
