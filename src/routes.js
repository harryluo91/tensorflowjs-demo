import React from "react";
import { Route } from "react-router-dom";

import PolynomialRegressionContainer from './containers/polynomialRegression/polynomialRegressionContainer';
import DigitRecognizerContainer from './containers/digitRecognizer/digitRecognizerContainer';
import PlayGroundContainer from './containers/playGroundContainer';

const Routes = () => (
    <div>
		<Route exact path="/" component={PlayGroundContainer} />
        <Route exact path="/polynomial" component={PolynomialRegressionContainer} />
        <Route exact path="/digit-recognizer" component={DigitRecognizerContainer} />
    </div>
)

export default Routes;