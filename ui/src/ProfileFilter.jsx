import React from 'react';
import URLSearchParams from 'url-search-params';
import { withRouter } from 'react-router-dom';
import {
  ButtonToolbar, Button, FormGroup, FormControl, ControlLabel, InputGroup,
  Row, Col,
} from 'react-bootstrap';

class ProfileFilter extends React.Component {
  constructor({ location: { search } }) {
    super();
    const params = new URLSearchParams(search);
    this.state = {
      seeking: params.get('seeking') || '',
      storageMin: params.get('storageMin') || '',
      storageMax: params.get('storageMax') || '',
      changed: false,
    };

    this.onChangeSeeking = this.onChangeSeeking.bind(this);
    this.onChangeStorageMin = this.onChangeStorageMin.bind(this);
    this.onChangeStorageMax = this.onChangeStorageMax.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.showOriginalFilter = this.showOriginalFilter.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { location: { search: prevSearch } } = prevProps;
    const { location: { search } } = this.props;
    if (prevSearch !== search) {
      this.showOriginalFilter();
    }
  }

  onChangeSeeking(e) {
    this.setState({ seeking: e.target.value, changed: true });
  }

  onChangeStorageMin(e) {
    const storageString = e.target.value;
    if (storageString.match(/^\d*$/)) {
      this.setState({ storageMin: e.target.value, changed: true });
    }
  }

  onChangeStorageMax(e) {
    const storageString = e.target.value;
    if (storageString.match(/^\d*$/)) {
      this.setState({ storageMax: e.target.value, changed: true });
    }
  }

  showOriginalFilter() {
    const { location: { search } } = this.props;
    const params = new URLSearchParams(search);
    this.setState({
      seeking: params.get('seeking') || '',
      storageMin: params.get('storageMin') || '',
      storageMax: params.get('storageMax') || '',
      changed: false,
    });
  }

  applyFilter() {
    const { seeking, storageMin, storageMax } = this.state;
    const { history, urlBase } = this.props;
    const params = new URLSearchParams();
    if (seeking) params.set('seeking', seeking);
    if (storageMin) params.set('storageMin', storageMin);
    if (storageMax) params.set('storageMax', storageMax);

    const search = params.toString() ? `?${params.toString()}` : '';
    history.push({ pathname: urlBase, search });
  }

  render() {
    const { seeking, changed } = this.state;
    const { storageMin, storageMax } = this.state;
    return (
      <Row>
        <Col xs={6} sm={4} md={3} lg={2}>
          <FormGroup>
            <ControlLabel>Seeking:</ControlLabel>
            <FormControl
              componentClass="select"
              value={seeking}
              onChange={this.onChangeSeeking}
            >
              <option value="">(All)</option>
              <option value="Storage">Storage</option>
              <option value="Other">Other</option>
            </FormControl>
          </FormGroup>
        </Col>
        <Col xs={6} sm={4} md={3} lg={2}>
          <FormGroup>
            <ControlLabel>Storage between:</ControlLabel>
            <InputGroup>
              <FormControl value={storageMin} onChange={this.onChangeStorageMin} />
              <InputGroup.Addon>-</InputGroup.Addon>
              <FormControl value={storageMax} onChange={this.onChangeStorageMax} />
            </InputGroup>
          </FormGroup>
        </Col>
        <Col xs={6} sm={4} md={3} lg={2}>
          <FormGroup>
            <ControlLabel>&nbsp;</ControlLabel>
            <ButtonToolbar>
              <Button bsStyle="primary" type="button" onClick={this.applyFilter}>
                Apply
              </Button>
              <Button
                type="button"
                onClick={this.showOriginalFilter}
                disabled={!changed}
              >
                Reset
              </Button>
            </ButtonToolbar>
          </FormGroup>
        </Col>
      </Row>
    );
  }
}

export default withRouter(ProfileFilter);
