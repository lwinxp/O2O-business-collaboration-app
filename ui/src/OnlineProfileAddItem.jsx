import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  NavItem, Glyphicon, Modal, Form, FormGroup, FormControl, ControlLabel,
  Button, ButtonToolbar, Tooltip, OverlayTrigger,
} from 'react-bootstrap';

import graphQLFetch from './graphQLFetch.js';
import withToast from './withToast.jsx';

class OnlineProfileAddItem extends React.Component {
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
    const form = document.forms.onlineProfileAdd;
    const onlineProfile = {
      name: form.name.value,
      seeking: form.seeking.value,
      userId: user.email,
    };
    const query = `mutation onlineProfileAdd($onlineProfile: OnlineProfileInputs!) {
      onlineProfileAdd(onlineProfile: $onlineProfile) {
        id
      }
    }`;

    const { showError } = this.props;
    const data = await graphQLFetch(query, { onlineProfile }, showError);
    if (data) {
      const { history } = this.props;
      // history.push(`/edit/${data.onlineProfileAdd.id}`);
      history.push(`/online-profile-list/online-profile/${data.onlineProfileAdd.id}`);
    }
  }

  render() {
    const { showing } = this.state;
    const { user: { signedIn } } = this.props;

    return (
      <React.Fragment>
        <Button disabled={!signedIn} onClick={this.showModal} bsStyle="primary" type="button" className="add-online-profile-button">Create Online Profile</Button>

        {/* <OverlayTrigger
          placement="left"
          delayShow={1000}
          overlay={<Tooltip id="create-online-profile">Create Online Profile</Tooltip>}
        >
          <Glyphicon glyph="plus" />

        </OverlayTrigger> */}
        <Modal keyboard show={showing} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Create Online Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form name="onlineProfileAdd">
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

export default withToast(withRouter(OnlineProfileAddItem));
