import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  NavItem, Glyphicon, Modal, Form, FormGroup, FormControl, ControlLabel,
  Button, ButtonToolbar, Tooltip, OverlayTrigger,
} from 'react-bootstrap';

import graphQLFetch from './graphQLFetch.js';
import withToast from './withToast.jsx';

class OfflineProfileAddItem extends React.Component {
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
    const { user } = this.props;

    e.preventDefault();
    this.hideModal();
    const form = document.forms.offlineProfileAdd;
    const offlineProfile = {
      name: form.name.value,
      seeking: form.seeking.value,
      userId: user.email,
    };
    const query = `mutation offlineProfileAdd($offlineProfile: OfflineProfileInputs!) {
      offlineProfileAdd(offlineProfile: $offlineProfile) {
        id
      }
    }`;

    const { showError } = this.props;
    const data = await graphQLFetch(query, { offlineProfile }, showError);
    if (data) {
      const { history } = this.props;
      // history.push(`/edit/${data.offlineProfileAdd.id}`);
      history.push(`/offline-profile-list/offline-profile/${data.offlineProfileAdd.id}`);
    }
  }

  render() {
    const { showing } = this.state;
    const { user: { signedIn } } = this.props;
    return (
      <React.Fragment>
        <Button disabled={!signedIn} onClick={this.showModal} bsStyle="primary" type="button" className="add-offline-profile-button">Create Offline Profile</Button>

        {/* <OverlayTrigger
          placement="left"
          delayShow={1000}
          overlay={<Tooltip id="create-offline-profile">Create Offline Profile</Tooltip>}
        >
          <Glyphicon glyph="plus" />

        </OverlayTrigger> */}
        <Modal keyboard show={showing} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Create Offline Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form name="offlineProfileAdd">
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

export default withToast(withRouter(OfflineProfileAddItem));
