import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Col, Panel, Form, FormGroup, FormControl, ControlLabel,
  ButtonToolbar, Button, Alert,
} from 'react-bootstrap';

import graphQLFetch from './graphQLFetch.js';

import TextInput from './TextInput.jsx';
import withToast from './withToast.jsx';
import store from './store.js';
import UserContext from './UserContext.js';

class PublicOnlineProfile extends React.Component {
  static async fetchData(match, search, showError) {
    const query = `query onlineProfile($id: Int!) {
      onlineProfile(id: $id) {
        id name seeking product
        website address postal
        created userId
      }
    }`;

    const { params: { id } } = match;
    const result = await graphQLFetch(query, { id }, showError);
    return result;
  }

  constructor() {
    super();
    const onlineProfile = store.initialData ? store.initialData.onlineProfile : null;
    delete store.initialData;
    this.state = {
      onlineProfile,
      invalidFields: {},
      showingValidation: false,
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onValidityChange = this.onValidityChange.bind(this);
    this.dismissValidation = this.dismissValidation.bind(this);
    this.showValidation = this.showValidation.bind(this);
  }

  componentDidMount() {
    const { onlineProfile } = this.state;
    if (onlineProfile == null) this.loadData();
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
      onlineProfile: { ...prevState.onlineProfile, [name]: value },
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
    const { onlineProfile, invalidFields } = this.state;
    if (Object.keys(invalidFields).length !== 0) return;

    const query = `mutation onlineProfileUpdate(
      $id: Int!
      $changes: OnlineProfileUpdateInputs!
    ) {
      onlineProfileUpdate(
        id: $id
        changes: $changes
      ) {
        id name seeking product
        website address postal created 
      }
    }`;
    // userId: String

    // console.log('query:', query);

    const { id, created, userId, ...changes } = onlineProfile;
    // console.log('changes:', changes);

    const { showSuccess, showError } = this.props;
    // console.log('======reached here========');

    const data = await graphQLFetch(query, { changes, id }, showError);
    // console.log('PublicOnlineProfile data:', data);

    if (data) {
      this.setState({ onlineProfile: data.onlineProfileUpdate });
      showSuccess('Updated Online Profile successfully');
    }
  }

  async loadData() {
    const { match, showError } = this.props;
    const data = await PublicOnlineProfile.fetchData(match, null, showError);
    this.setState({ onlineProfile: data ? data.onlineProfile : {}, invalidFields: {} });
  }

  showValidation() {
    this.setState({ showingValidation: true });
  }

  dismissValidation() {
    this.setState({ showingValidation: false });
  }

  render() {
    const { onlineProfile } = this.state;
    if (onlineProfile == null) return null;

    const { onlineProfile: { id } } = this.state;
    const { match: { params: { id: propsId } } } = this.props;
    if (id == null) {
      if (propsId != null) {
        return <h3>{`Online Profile with ID ${propsId} not found.`}</h3>;
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

    const { onlineProfile: { name, seeking } } = this.state;
    const { onlineProfile: { product, website, address, postal } } = this.state;
    const { onlineProfile: { created } } = this.state;

    const user = this.context;

    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title>Viewing Online Profile</Panel.Title>
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
                  readOnly
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
                  disabled
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
                  readOnly
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
                  readOnly
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
                  readOnly
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
                  readOnly
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={3} sm={6}>
                <ButtonToolbar>
                  <LinkContainer to="/browse-online-profile">
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
    );
  }
}

PublicOnlineProfile.contextType = UserContext;

const OnlineProfileEditWithToast = withToast(PublicOnlineProfile);
OnlineProfileEditWithToast.fetchData = PublicOnlineProfile.fetchData;

export default OnlineProfileEditWithToast;
