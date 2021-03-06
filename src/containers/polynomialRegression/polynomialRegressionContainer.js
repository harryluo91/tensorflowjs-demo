import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { Grid, Paper } from 'material-ui';
import * as tf from '@tensorflow/tfjs';
import P5Wrapper from 'react-p5-wrapper';

const random = (min, max) => {
  return Math.random() * (max - min) + min;
}

// the learning rate
const learningRate = 0.1;

// sgd, adam
const optimizer = null;

// create the initial coeffcients with tf.variable
// initialize them in the plane of (-1, 1)

const Sketch = (p) => {
  let mouseOn = false;
  let x_vals = [], y_vals = [], xs = [], ys = [];
  let addPoints, train, getCurveData;

  p.setup = () => {
    const myCanavs = p.createCanvas(400, 400);
    myCanavs.mousePressed(mousePressed);
    myCanavs.mouseReleased(mouseReleased);
  }

  const mousePressed = () => {
    mouseOn = true;
    let x = p.map(p.mouseX, 0, p.width, -1, 1);
    let y = p.map(p.mouseY, 0, p.height, 1, -1);
    addPoints(x, y);
  }
  
  const mouseReleased = () => {
    mouseOn = false;
    // train();
    // p.draw();
  }

  p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
    x_vals = props.x_vals;
    y_vals = props.y_vals;
    addPoints = props.addPoints;
    train = props.train;
    getCurveData = props.getCurveData;
    xs = props.xs;
    ys = props.ys;

  };

  p.draw = () => {
    if (!mouseOn && train) {
      train();
    }
    p.background(0);

    p.stroke(255);
    p.strokeWeight(8);
    if (x_vals && y_vals) {
      for (let i = 0; i < x_vals.length; i++) {
        let px = p.map(x_vals[i], -1, 1, 0, p.width);
        let py = p.map(y_vals[i], -1, 1, p.height, 0);
        p.point(px, py);
      }
    }

    // getCurveData();
    // p.beginShape();
    // p.noFill();
    // p.stroke(255);
    // p.strokeWeight(2);
    // for (let i = 0; i < xs.length; i++) {
    //   let x = p.map(xs[i], -1, 1, 0, p.width);
    //   let y = p.map(ys[i], -1, 1, p.height, 0);
    //   p.vertex(x, y);
    // }
    // p.endShape();
  }
}

class PolynomialRegressionContainer extends Component {
  constructor() {
    super()
    autoBind(this);
    this.state = {
      x_vals: [], //
      y_vals: [],
      xs: [],
      ys: [],
      coefficients: {
      }
    }
  }

  componentDidMount() {
  }

  addPoints(x, y) {
    const { x_vals, y_vals } = this.state;
    this.setState({
      x_vals: [...x_vals, x],
      y_vals: [...y_vals, y]
    });
  }

  // define the loss function
  loss() {
  }

  predict() {
  }

  train() {
  }

  getCurveData() {
  }

  getCoefficients() {
  }

  render() {
    const { x_vals, y_vals, xs, ys, coefficients } = this.state;
    return (
      <Paper>
        <Grid container spacing={24}>
          <Grid item xs={6}>
            <P5Wrapper
              sketch={Sketch}
              x_vals={x_vals}
              y_vals={y_vals}
              addPoints={this.addPoints}
              train={this.train}
              getCurveData={this.getCurveData}
              xs={xs}
              ys={ys}
            />
          </Grid>
          <Grid item xs={6}>
            <Grid container spacing={24}>
              <Grid item xs={12}>
                {`Coefficients: a: ${coefficients.a}, b: ${coefficients.b}, c: ${coefficients.c}, d: ${coefficients.d}`}
              </Grid>
              <Grid item xs={12}>
                <div>Points:</div>
                {
                  x_vals && x_vals.map((item, index) => (
                    <div>{`{${item}, ${y_vals[index]}}`}</div>
                  ))
                }
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    )
  }
}

export default PolynomialRegressionContainer;
