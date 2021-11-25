import React from 'react';
import {
  Navbar, Nav, NavItem, NavDropdown,
  MenuItem, Glyphicon,
  Grid, Col,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';


import Contents from './Contents.jsx';
import SignInNavItem from './SignInNavItem.jsx';
import Login from './Login.jsx';
import UserContext from './UserContext.js';
import graphQLFetch from './graphQLFetch.js';
import store from './store.js';

function Header() {
  return (
    <header>
      <div className="logo-container">
        <img className="logo" src="omni-logo.png" alt="omni-logo" />
      </div>
      <h1>Omni</h1>
      <p>Your 1-Stop Online-to-Offline (O2O) Portal for Omnichannel Business Collaborations</p>
    </header>
  );
}

function NavBar({ user, onUserChange }) {
  return (
    <Navbar fluid>
      <Navbar.Header>
        <Navbar.Brand>Omni</Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>

        <Nav>
          <NavDropdown eventKey={2} title="Your Profiles" id="basic-nav-dropdown">
            <LinkContainer exact to="/online-profile-list">
              <MenuItem eventKey={2.1}>Your Online Profiles</MenuItem>
            </LinkContainer>
            <LinkContainer exact to="/offline-profile-list">
              <MenuItem eventKey={2.2}>Your Offline Profiles</MenuItem>
            </LinkContainer>
          </NavDropdown>
          <NavDropdown eventKey={3} title="Browse Profiles" id="basic-nav-dropdown">
            <LinkContainer exact to="/browse-online-profile">
              <MenuItem eventKey={3.1}>Browse Online Profiles</MenuItem>
            </LinkContainer>
            <LinkContainer exact to="/browse-offline-profile">
              <MenuItem eventKey={3.2}>Browse Offline Profiles</MenuItem>
            </LinkContainer>
          </NavDropdown>
          <NavDropdown eventKey={4} title="Your Collaborations" id="basic-nav-dropdown">
            <LinkContainer exact to="/storage-collaboration-list">
              <MenuItem eventKey={4.1}>Your Storage Collaborations</MenuItem>
            </LinkContainer>
          </NavDropdown>
        </Nav>
        <Nav pullRight>
          <SignInNavItem user={user} onUserChange={onUserChange} />
          <NavDropdown
            id="user-dropdown"
            title={<Glyphicon glyph="option-vertical" />}
            noCaret
          >
            <LinkContainer to="/about">
              <MenuItem>About</MenuItem>
            </LinkContainer>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

function Footer() {
  return (
    <footer>
      <div className="homePage">
        <p>© 2021 Omni</p>
      </div>
    </footer>
  );
}

export default class Page extends React.Component {
  static async fetchData(cookie) {
    const query = `query { user {
      signedIn givenName email
    }}`;
    const data = await graphQLFetch(query, null, null, cookie);
    return data;
  }

  constructor(props) {
    super(props);
    const user = store.userData ? store.userData.user : null;
    delete store.userData;
    this.state = { user };

    this.onUserChange = this.onUserChange.bind(this);
  }

  async componentDidMount() {
    const { user } = this.state;
    if (user == null) {
      const data = await Page.fetchData();
      this.setState({ user: data.user });
    }
  }

  onUserChange(user) {
    this.setState({ user });
  }

  render() {
    const { user } = this.state;
    if (user == null) return null;

    return (
      <div>
        <Header />
        {
          user.signedIn && <NavBar user={user} onUserChange={this.onUserChange} />
        }
        <Grid fluid>
          <UserContext.Provider value={user}>
            {
              user.signedIn && (
                <div className="wrapper">
                  <Contents />
                </div>
              )
            }
            {
              !user.signedIn && (
                <div className="wrapper">
                  <Login user={user} onUserChange={this.onUserChange} authenticated={user.SignedIn} />
                </div>
              )
            }
          </UserContext.Provider>
        </Grid>
        <Footer />
      </div>
    );
  }
}
