// import React from 'react';
// import SignInButton from './SignInButton.jsx';

// export default function Login(user, onUserChange, authenticated) {

//   return (
//     <React.Fragment>
//       {
//         !authenticated && (
//           <div className="login">
//             <SignInButton user={user} onUserChange={onUserChange} />
//           </div>
//         )
//       }
//     </React.Fragment>
//   );
// }

import React from 'react';
import SignInButton from './SignInButton.jsx';

export default class Login extends React.Component {
  constructor() {
    super()
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    //  prevent default behaviour to refresh

    // this.props.changePage();
  }

  render() {
    // const email = "Please enter email:"
    // const password = "Please enter password:"

    const { authenticated, user, onUserChange } = this.props;

    return (
      <React.Fragment>
        {
          !authenticated && (
            <div className="login">
              <SignInButton user={user} onUserChange={onUserChange} />
            </div>
          )
        }

        {/* {
          authenticated && (
            <div>
              <p>You are already logged in. This is the logged in version of the login page.</p>
              <p>To see the logged out version of the login page:</p>
              <p>1. cd ~/intermediate-code/ui/src/Page.jsx</p>
              <p>2. change authenticated variable to false</p>
              <p>3. in ~/intermediate-code/ui/ directory, npx babel src --presets @babel/react --out-dir public</p>
              <p>4. in ~/intermediate-code/ui/ directory, npx webpack public/App.js --output public/app.bundle.js --mode development</p>
              <p>5. refresh http://localhost:8000/#/login</p>
            </div>
          )
        } */}
      </React.Fragment>
    );
  }
}
