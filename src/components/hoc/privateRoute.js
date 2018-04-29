import React, { Component } from 'react';
import { Route, Link, Redirect } from "react-router-dom";

import { isAuthed } from '../../utils/authUtils';

class PrivateRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthed: isAuthed()
    };
  }
  
  render() {
    const { component: Component, ...rest } = this.props;
    const { isAuthed } = this.state;
    return (
      <Route {...rest} render={(props) => (
        isAuthed === true
          ? <Component {...props} />
          : <Redirect to='/' />
      )} />
    );
  }
}

export default PrivateRoute;
