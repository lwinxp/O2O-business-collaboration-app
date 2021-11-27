import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Col, Panel, Form, FormGroup, FormControl, ControlLabel,
  ButtonToolbar, Button, Alert,
} from 'react-bootstrap';

import graphQLFetch from './graphQLFetch.js';

import NumInput from './NumInput.jsx';
import TextInput from './TextInput.jsx';
import withToast from './withToast.jsx';
import store from './store.js';
import UserContext from './UserContext.js';

class PrivateOfflineProfile extends React.Component {
  static async fetchData(match, search, showError) {
    const query = `query offlineProfile($id: Int!) {
      offlineProfile(id: $id) {
        id name seeking product
        website address postal
        availStorage availColdStorage
        totalStorage totalColdStorage
        created reserved userId
        reservationContact
      }
    }`;

    const { params: { id } } = match;
    const result = await graphQLFetch(query, { id }, showError);
    return result;
  }

  constructor() {
    super();
    const offlineProfile = store.initialData ? store.initialData.offlineProfile : null;
    delete store.initialData;
    this.state = {
      offlineProfile,
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
    const { offlineProfile } = this.state;
    if (offlineProfile == null) this.loadData();
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
      offlineProfile: { ...prevState.offlineProfile, [name]: value },
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

  async handleSubmit(e) {
    e.preventDefault();
    this.showValidation();
    const { offlineProfile, invalidFields } = this.state;
    if (Object.keys(invalidFields).length !== 0) return;

    const query = `mutation offlineProfileUpdate(
      $id: Int!
      $changes: OfflineProfileUpdateInputs!
    ) {
      offlineProfileUpdate(
        id: $id
        changes: $changes
      ) {
        id name seeking product
        website address postal 
        availStorage availColdStorage 
        totalStorage totalColdStorage 
        reserved reservationContact created 
      }
    }`;
    // userId: String

    // console.log('query:', query);

    const { id, created, userId, ...changes } = offlineProfile;
    // console.log('changes:', changes);

    changes.availStorage = changes.totalStorage;
    changes.availColdStorage = changes.totalColdStorage;

    const { showSuccess, showError } = this.props;
    // console.log('======reached here========');

    const data = await graphQLFetch(query, { changes, id }, showError);
    // console.log('PrivateOfflineProfile data:', data);

    if (data) {
      this.setState({ offlineProfile: data.offlineProfileUpdate });
      showSuccess('Updated Offline Profile successfully');
    }
  }

  async loadData() {
    const { match, showError } = this.props;
    const data = await PrivateOfflineProfile.fetchData(match, null, showError);
    this.setState({ offlineProfile: data ? data.offlineProfile : {}, invalidFields: {} });
  }

  showValidation() {
    this.setState({ showingValidation: true });
  }

  dismissValidation() {
    this.setState({ showingValidation: false });
  }

  render() {
    const { offlineProfile } = this.state;
    if (offlineProfile == null) return null;

    const { offlineProfile: { id } } = this.state;
    const { match: { params: { id: propsId } } } = this.props;
    if (id == null) {
      if (propsId != null) {
        return <h3>{`Offline Profile with ID ${propsId} not found.`}</h3>;
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

    const { offlineProfile: { name, seeking } } = this.state;
    const { offlineProfile: { product, website, address, postal, availStorage, availColdStorage, totalStorage, totalColdStorage, reserved, reservationContact, userId } } = this.state;
    const { offlineProfile: { created } } = this.state;

    const user = this.context;

    return (
      // <React.Fragment>
      //   {
      //     userId === user.email && (
            <Panel>
              <Panel.Heading>
                <Panel.Title>{`Editing Offline Profile | Reserved: ${reserved}`}</Panel.Title>
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
                    <Col componentClass={ControlLabel} sm={3}>Name</Col>
                    <Col sm={9}>
                      <FormControl
                        componentClass={TextInput}
                        size={50}
                        name="name"
                        value={name}
                        onChange={this.onChange}
                        key={id}
                        readOnly={reserved}
                      />
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
                        readOnly={reserved}
                      >
                        <option value="Storage">Storage</option>
                        <option value="Other">Other</option>
                      </FormControl>
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Col componentClass={ControlLabel} sm={3}>Product</Col>
                    <Col sm={9}>
                      <FormControl
                        componentClass={TextInput}
                        name="product"
                        value={product}
                        onChange={this.onChange}
                        key={id}
                        readOnly={reserved}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Col componentClass={ControlLabel} sm={3}>Website</Col>
                    <Col sm={9}>
                      <FormControl
                        componentClass={TextInput}
                        name="website"
                        value={website}
                        onChange={this.onChange}
                        key={id}
                        readOnly={reserved}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Col componentClass={ControlLabel} sm={3}>Address</Col>
                    <Col sm={9}>
                      <FormControl
                        componentClass={TextInput}
                        name="address"
                        value={address}
                        onChange={this.onChange}
                        key={id}
                        readOnly={reserved}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Col componentClass={ControlLabel} sm={3}>Postal</Col>
                    <Col sm={9}>
                      <FormControl
                        componentClass={TextInput}
                        name="postal"
                        value={postal}
                        onChange={this.onChange}
                        key={id}
                        readOnly={reserved}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Col componentClass={ControlLabel} sm={3}>Total Storage (m3)</Col>
                    <Col sm={9}>
                      <FormControl
                        componentClass={NumInput}
                        name="totalStorage"
                        value={totalStorage}
                        onChange={this.onChange}
                        key={id}
                        readOnly={reserved}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Col componentClass={ControlLabel} sm={3}>Total Cold Storage (m3)</Col>
                    <Col sm={9}>
                      <FormControl
                        componentClass={NumInput}
                        name="totalColdStorage"
                        value={totalColdStorage}
                        onChange={this.onChange}
                        key={id}
                        readOnly={reserved}
                      />
                    </Col>
                  </FormGroup>
                  <h4>
                    Available Storage, Available Cold Storage, Reservation Contact are Auto-Generated
                  </h4>
                  <FormGroup>
                    <Col componentClass={ControlLabel} sm={3}>Available Storage (m3)</Col>
                    <Col sm={9}>
                      <FormControl
                        componentClass={TextInput}
                        name="availStorage"
                        value={availStorage}
                        onChange={this.onChange}
                        key={id}
                        readOnly
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Col componentClass={ControlLabel} sm={3}>Available Cold Storage (m3)</Col>
                    <Col sm={9}>
                      <FormControl
                        componentClass={TextInput}
                        name="availColdStorage"
                        value={availColdStorage}
                        onChange={this.onChange}
                        key={id}
                        readOnly
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Col componentClass={ControlLabel} sm={3}>Reservation Contact</Col>
                    <Col sm={9}>
                      <FormControl
                        componentClass={TextInput}
                        name="reservationContact"
                        value={reservationContact}
                        onChange={this.onChange}
                        key={id}
                        readOnly
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Col smOffset={3} sm={6}>
                      <ButtonToolbar>
                        {
                          !reserved && (
                            <Button
                              disabled={!user.signedIn}
                              bsStyle="primary"
                              type="submit"
                            >
                              Submit
                            </Button>
                          )
                        }
                        <LinkContainer to="/offline-profile-list">
                          <Button bsStyle="link">Back</Button>
                        </LinkContainer>
                      </ButtonToolbar>
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Col smOffset={3} sm={9}>{validationMessage}</Col>
                  </FormGroup>
                </Form>
              </Panel.Body>
            </Panel>
      //     )
      //   }

      //   {
      //     userId !== user.email && (
      //       <React.Fragment>
      //         <h1>You are not authorized to view this page!</h1>
      //         <p>Try refreshing this page again.</p>
      //       </React.Fragment>
      //     )
      //   }
      // </React.Fragment>
    );
  }
}

PrivateOfflineProfile.contextType = UserContext;

const OfflineProfileEditWithToast = withToast(PrivateOfflineProfile);
OfflineProfileEditWithToast.fetchData = PrivateOfflineProfile.fetchData;

export default OfflineProfileEditWithToast;
