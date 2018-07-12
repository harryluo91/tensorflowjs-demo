import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { Grid, Paper } from 'material-ui';
import * as tf from '@tensorflow/tfjs';
import P5Wrapper from 'react-p5-wrapper';

const random = (min, max) => {
  return Math.random() * (max - min) + min;
}

const learningRate = 0.1;
const optimizer = tf.train.adam(learningRate);

// initial training data
const a = tf.variable(tf.scalar(random(-1, 1)));
const b = tf.variable(tf.scalar(random(-1, 1)));
const c = tf.variable(tf.scalar(random(-1, 1)));
const d = tf.variable(tf.scalar(random(-1, 1)));

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
    if (!mouseOn) {
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

    getCurveData();
    p.beginShape();
    p.noFill();
    p.stroke(255);
    p.strokeWeight(2);
    for (let i = 0; i < xs.length; i++) {
      let x = p.map(xs[i], -1, 1, 0, p.width);
      let y = p.map(ys[i], -1, 1, p.height, 0);
      p.vertex(x, y);
    }
    p.endShape();
  }
}

class PolynomialRegressionContainer extends Component {
  constructor() {
    super()
    autoBind(this);
    this.state = {
      x_vals: [],
      y_vals: [],
      xs: [],
      ys: [],
      coefficients: {
        a: a.dataSync(),
        b: b.dataSync(),
        c: c.dataSync(),
        d: d.dataSync()
      }
    }
  }

  addPoints(x, y) {
    const { x_vals, y_vals } = this.state;
    this.setState({
      x_vals: [...x_vals, x],
      y_vals: [...y_vals, y]
    });
  }

  // define the loss function
  // taking the mean square of the difference between the prediction and actual values
  // Mean((predict - actual)^2)
  loss(pred, labels) {
    return pred.sub(labels).square().mean();
  }

  // implement the polynomial with tensorflow js methods
  // y = ax^3 + bx^2 + cx + d
  predict(xs) {
    const ys = xs.pow(tf.scalar(3)).mul(a)
      .add(xs.square().mul(b))
      .add(xs.mul(c))
      .add(d);
    return ys;
  }

  // train the model to minimize the loss function
  // optimizer.minimize(f, returnCost?, varList?)
  // tries to minimize the return value of the function by adjusting the trainable variables provided by the varList
  // varList: contains specific trainable values (default to all variables)
  // creates the tensor ys from the y_vals on the canvas
  // feed the x_vals to the predict function to get the prediction => ys
  // compute the loss between predicted ys and actual ys
  // use optimizer.minimize() to minimize this loss
  train() {
    const { x_vals, y_vals } = this.state;
    tf.tidy(() => {
      if (x_vals && x_vals.length > 0) {
        const ys = tf.tensor1d(y_vals);
        const xs = tf.tensor1d(x_vals);
        optimizer.minimize(() => this.loss(this.predict(xs), ys));
        this.getCoefficients()
      }
    })
  }

  // the actual predict function to get get the curve data
  // generate x values between (-1, 1) at an interval of 0.05
  // feed the x values to the predict function to get the predicted y values
  getCurveData() {
    let xs_tmp = [], ys_tmp = [];
    for (let x = -1; x <= 1; x += 0.05) {
      xs_tmp.push(x);
    }
    ys_tmp = tf.tidy(() => this.predict(tf.tensor1d(xs_tmp)));
    this.setState({
      xs: xs_tmp,
      ys: ys_tmp.dataSync()
    })
  }

  // get the actual value of the current coefficients
  getCoefficients() {
    const tmpCo = Object.assign({}, this.state.coefficients);
    tmpCo.a = a.dataSync();
    tmpCo.b = b.dataSync();
    tmpCo.c = c.dataSync();
    tmpCo.d = d.dataSync();
    this.setState({
      coefficients: tmpCo
    })
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
