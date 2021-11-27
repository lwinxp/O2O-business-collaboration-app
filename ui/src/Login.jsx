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
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  render() {
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
      </React.Fragment>
    );
  }
}
