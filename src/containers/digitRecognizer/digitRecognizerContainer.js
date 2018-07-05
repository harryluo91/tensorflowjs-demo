import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { Grid, Paper } from 'material-ui';
import * as tf from '@tensorflow/tfjs';

import { MnistData } from '../../utils/dataDigits';

const model = tf.sequential();

model.add(tf.layers.conv2d({
  inputShape: [28, 28, 1],
  kernelSize: 5,
  filters: 8,
  strides: 1,
  activation: 'relu',
  kernelInitializer: 'VarianceScaling'
}));

model.add(tf.layers.maxPooling2d({
  poolSize: [2, 2],
  strides: [2, 2]
}));

model.add(tf.layers.conv2d({
  kernelSize: 5,
  filters: 16,
  strides: 1,
  activation: 'relu',
  kernelInitializer: 'VarianceScaling'
}));

model.add(tf.layers.maxPooling2d({
  poolSize: [2, 2],
  strides: [2, 2]
}));

model.add(tf.layers.flatten());

model.add(tf.layers.dense({
  units: 10,
  kernelInitializer: 'VarianceScaling',
  activation: 'softmax'
}));

const LEARNING_RATE = 0.15;
const optimizer = tf.train.sgd(LEARNING_RATE);

model.compile({
  optimizer: optimizer,
  loss: 'categoricalCrossentropy',
  metrics: ['accuracy'],
});

class PolynomialRegressionContainer extends Component {
  constructor() {
    super();
    autoBind(this);
    this.state = {

    }
  }

  render() {
    const { } = this.state;
    return (
      <Paper>
        <Grid container spacing={24}>
          
        </Grid>
      </Paper>
    )
  }
}

export default PolynomialRegressionContainer;
