import React from "react";
import { Route } from "react-router-dom";

import HomeContainer from './containers/home/home';

const Routes = () => (
    <div>
        <Route exact path="/" component={HomeContainer} />
    </div>
)

export default Routes;