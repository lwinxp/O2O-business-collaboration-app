import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Col, Panel, Form, FormGroup, FormControl, ControlLabel,
  ButtonToolbar, Button, Alert,
} from 'react-bootstrap';

import graphQLFetch from './graphQLFetch.js';

import NumInput from './NumInput.jsx';
import DateInput from './DateInput.jsx';
import TextInput from './TextInput.jsx';
import withToast from './withToast.jsx';
import store from './store.js';
import UserContext from './UserContext.js';

class StorageCollaboration extends React.Component {
  static async fetchData(match, search, showError) {
    const query = `query storageCollaboration($id: Int!) {
      storageCollaboration(id: $id) {
        id name seeking volume price startDate endDate
        coldVolume coldPrice coldStartDate coldEndDate created
        status offlineProfileId offlineProfileUserId
        onlineProfileUserId
      }
    }`;

    const { params: { id } } = match;
    const result = await graphQLFetch(query, { id }, showError);
    return result;
  }

  constructor() {
    super();
    const storageCollaboration = store.initialData ? store.initialData.storageCollaboration : null;
    delete store.initialData;
    this.state = {
      storageCollaboration,
      invalidFields: {},
      showingValidation: false,
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onValidityChange = this.onValidityChange.bind(this);
    this.dismissValidation = this.dismissValidation.bind(this);
    this.showValidation = this.showValidation.bind(this);
  
    // this.handleSubmit = this.handleSubmit.bind(this);  
  }

  componentDidMount() {
    const { storageCollaboration } = this.state;
    if (storageCollaboration == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { id: prevId } } } = prevProps;
    const { match: { params: { id } } } = this.props;
    if (id !== prevId) {
      this.loadData();
    }
  }

  onChange(event, naturalValue) {
    const { name, value: textValue } = event.target;
    const value = naturalValue === undefined ? textValue : naturalValue;
    this.setState(prevState => ({
      storageCollaboration: { ...prevState.storageCollaboration, [name]: value },
    }));
  }

  onValidityChange(event, valid) {
    const { name } = event.target;
    this.setState((prevState) => {
      const invalidFields = { ...prevState.invalidFields, [name]: !valid };
      if (valid) delete invalidFields[name];
      return { invalidFields };
    });
  }

  async handleSubmit(response, e) {
    console.log('response:', response);

    e.preventDefault();
    this.showValidation();
    const { storageCollaboration, invalidFields } = this.state;
    if (Object.keys(invalidFields).length !== 0) return;

    const query = `mutation storageCollaborationUpdate(
      $id: Int!
      $changes: StorageCollaborationUpdateInputs!
    ) {
      storageCollaborationUpdate(
        id: $id
        changes: $changes
      ) {
        id name seeking volume price startDate endDate
        coldVolume coldPrice coldStartDate coldEndDate
        status created offlineProfileId offlineProfileUserId
        onlineProfileUserId
      }
    }`;
    // userId: String

    const { id, created, ...changes } = storageCollaboration;

    changes.status = response;

    const { showSuccess, showError } = this.props;

    const data = await graphQLFetch(query, { changes, id }, showError);

    if (data) {
      this.setState({ storageCollaboration: data.storageCollaborationUpdate });
      showSuccess('Updated Storage Collaboration successfully');
    }
  }

  async loadData() {
    const { match, showError } = this.props;
    const data = await StorageCollaboration.fetchData(match, null, showError);
    this.setState({ storageCollaboration: data ? data.storageCollaboration : {}, invalidFields: {} });
  }

  showValidation() {
    this.setState({ showingValidation: true });
  }

  dismissValidation() {
    this.setState({ showingValidation: false });
  }

  render() {
    const { storageCollaboration } = this.state;
    if (storageCollaboration == null) return null;

    const { storageCollaboration: { id } } = this.state;
    const { match: { params: { id: propsId } } } = this.props;
    if (id == null) {
      if (propsId != null) {
        return <h3>{`Storage Collaboration with ID ${propsId} not found.`}</h3>;
      }
      return null;
    }

    const { invalidFields, showingValidation } = this.state;
    let validationMessage;
    if (Object.keys(invalidFields).length !== 0 && showingValidation) {
      validationMessage = (
        <Alert bsStyle="danger" onDismiss={this.dismissValidation}>
          Please correct invalid fields before submitting.
        </Alert>
      );
    }

    const { storageCollaboration: { name, seeking } } = this.state;
    const { storageCollaboration: { volume, price, startDate, endDate, coldVolume, coldPrice, coldStartDate, coldEndDate } } = this.state;
    const { storageCollaboration: { created, status, onlineProfileUserId } } = this.state;

    const user = this.context;
    const readOnly = status === 'Draft' ? false : true;

    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title>{`Storage collaboration: ${id} | Status: ${status}`}</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Form horizontal onSubmit={this.handleSubmit}>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Created</Col>
              <Col sm={9}>
                <FormControl.Static>
                  {created.toDateString()}
                </FormControl.Static>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Seeking</Col>
              <Col sm={9}>
                <FormControl
                  componentClass="select"
                  name="seeking"
                  value={seeking || ''}
                  onChange={this.onChange}
                  disabled={readOnly}
                >
                  <option value="Storage">Storage</option>
                  <option value="Other">Other</option>
                </FormControl>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Volume</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={NumInput}
                  name="volume"
                  value={volume}
                  onChange={this.onChange}
                  key={id}
                  readOnly={readOnly}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Price</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={NumInput}
                  name="price"
                  value={price}
                  onChange={this.onChange}
                  key={id}
                  readOnly={readOnly}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Start Date</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={DateInput}
                  onValidityChange={this.onValidityChange}
                  name="startDate"
                  value={startDate}
                  onChange={this.onChange}
                  key={id}
                  readOnly={readOnly}
                />
                <FormControl.Feedback />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>End Date</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={DateInput}
                  onValidityChange={this.onValidityChange}
                  name="endDate"
                  value={endDate}
                  onChange={this.onChange}
                  key={id}
                  readOnly={readOnly}
                />
                <FormControl.Feedback />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Cold Volume</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={NumInput}
                  name="coldVolume"
                  value={coldVolume}
                  onChange={this.onChange}
                  key={id}
                  readOnly={readOnly}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Cold Price</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={NumInput}
                  name="coldPrice"
                  value={coldPrice}
                  onChange={this.onChange}
                  key={id}
                  readOnly={readOnly}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Cold Start Date</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={DateInput}
                  onValidityChange={this.onValidityChange}
                  name="coldStartDate"
                  value={coldStartDate}
                  onChange={this.onChange}
                  key={id}
                  readOnly={readOnly}
                />
                <FormControl.Feedback />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Cold End Date</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={DateInput}
                  onValidityChange={this.onValidityChange}
                  name="coldEndDate"
                  value={coldEndDate}
                  onChange={this.onChange}
                  key={id}
                  readOnly={readOnly}
                />
                <FormControl.Feedback />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>Name</Col>
              <Col sm={9}>
                <FormControl
                  componentClass={TextInput}
                  size={50}
                  name="name"
                  value={name}
                  onChange={this.onChange}
                  key={id}
                  readOnly={readOnly}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={3} sm={6}>
                {
                  status === 'Draft' && (
                    <ButtonToolbar>
                      <Button
                        disabled={!user.signedIn}
                        bsStyle="primary"
                        type="submit"
                        onClick={this.handleSubmit.bind(this, 'Pending')}
                      >
                        Submit
                      </Button>
                      <LinkContainer to="/storage-collaboration-list">
                        <Button bsStyle="link">Back</Button>
                      </LinkContainer>
                    </ButtonToolbar>
                  )
                }

                {
                  status === 'Pending' && onlineProfileUserId !== user.email && (
                    <ButtonToolbar>
                      <Button
                        disabled={!user.signedIn}
                        bsStyle="primary"
                        type="submit"
                        // onClick={(e) => this.handleSubmit('Accepted',e)}
                        onClick={this.handleSubmit.bind(this, 'Accepted')}

                      >
                        Accept
                      </Button>
                      <Button
                        disabled={!user.signedIn}
                        bsStyle="primary"
                        type="submit"
                        // onClick={() => { this.handleSubmit.bind(this, response)}}
                        onClick={(e) => this.handleSubmit('Rejected', e)}
                      >
                        Reject
                      </Button>
                      <LinkContainer to="/storage-collaboration-list">
                        <Button bsStyle="link">Back</Button>
                      </LinkContainer>
                    </ButtonToolbar>
                  )
                }

                {
                  (status === 'Accepted' || status === 'Rejected') && (
                    <ButtonToolbar>
                      <LinkContainer to="/storage-collaboration-list">
                        <Button bsStyle="link">Back</Button>
                      </LinkContainer>
                    </ButtonToolbar>
                  )
                }
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={3} sm={9}>{validationMessage}</Col>
            </FormGroup>
          </Form>
        </Panel.Body>
      </Panel>
    );
  }
}

StorageCollaboration.contextType = UserContext;

const StorageCollaborationEditWithToast = withToast(StorageCollaboration);
StorageCollaborationEditWithToast.fetchData = StorageCollaboration.fetchData;

export default StorageCollaborationEditWithToast;
