import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { Grid, Paper, TextField, Button } from 'material-ui';
import * as tf from '@tensorflow/tfjs';
import CanvasDraw from "react-canvas-draw";

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

// How many examples the model should "see" before making a parameter update.
const BATCH_SIZE = 64;
// How many batches to train the model for.
const TRAIN_BATCHES = 100;

// Every TEST_ITERATION_FREQUENCY batches, test accuracy over TEST_BATCH_SIZE examples.
// Ideally, we'd compute accuracy over the whole test set, but for performance
// reasons we'll use a subset.
const TEST_BATCH_SIZE = 10;
const TEST_ITERATION_FREQUENCY = 5;

class PolynomialRegressionContainer extends Component {
  constructor() {
    super();
    autoBind(this);
    this.state = {
      data: null,
      batchSize: 10,
      predictedDigit: null
    }
  }

  componentDidMount() {
    const { data } = this.state;
    if (!data) {
      this.setState({
        data: new MnistData()
      }, () => {
        this.loadData();
      })
    }
  }

  async loadData() {
    await this.state.data.load();
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  async startTraining() {
    const { data, batchSize } = this.state;
    for (let i = 0; i < batchSize; i++) {
      const trainBatch = data.nextTrainBatch(batchSize);

      let testBatch;
      let validationData;
      // Every few batches test the accuracy of the mode.
      if (i % TEST_ITERATION_FREQUENCY === 0) {
        testBatch = data.nextTestBatch(TEST_BATCH_SIZE);
        validationData = [
          testBatch.xs.reshape([TEST_BATCH_SIZE, 28, 28, 1]), testBatch.labels
        ];
      }
    
      // The entire dataset doesn't fit into memory so we call fit repeatedly
      // with batches.
      const history = await model.fit(
        trainBatch.xs.reshape([batchSize, 28, 28, 1]),
        trainBatch.labels,
        {
          batchSize,
          validationData,
          epochs: 1
        }
      );

      const loss = history.history.loss[0];
      const accuracy = history.history.acc[0];

      console.log(i)
      console.log('LOSS: ' + loss);
      console.log('ACCURACY: ' + accuracy);
    }
  }

  async predict() {
    const canvasData = this.canvas.getSaveData();
    let imageData = [];
    for (let indexX = 0; indexX < 28; indexX++) {
      imageData[indexX] = []
      for (let indexY = 0; indexY < 28; indexY++) {
        imageData[indexX][indexY] = 0
      }
    }

    await JSON.parse(canvasData).linesArray.forEach(item => {
      imageData[parseInt(item.startX / 10)][parseInt(item.startY / 10)] = 255
    })

    let newFlatInputData = []

    for (let indexX = 0; indexX < 28; indexX++) {
      for (let indexY = 0; indexY < 28; indexY++) {
        if (imageData[indexX][indexY] === 0) {
          newFlatInputData = newFlatInputData.concat([0, 0, 0, 0]);
        } else {
          newFlatInputData = newFlatInputData.concat([255, 255, 255, 255]);
        }
        // newFlatInputData.push(imageData[indexX][indexY])
      }
    }

    const imagesShape = [1, 28, 28, 1];

    // const inputs = tf.tensor4d(newFlatInputData, imagesShape);


    // const imgData = new ImageData(new Uint8ClampedArray(newFlatInputData), 28, 28);
    const scaled = this.canvas.ctx.drawImage(this.canvas.canvas, 0, 0, 28, 28);
    const imgData = this.canvas.ctx.getImageData(0, 0, 28, 28);
    let img = tf.fromPixels(imgData, 1);
    img = img.reshape([1, 28, 28, 1]);
    img = tf.cast(img, 'float32');

    const output = model.predict(img);
    const prediction = output.argMax(1).dataSync();

    this.setState({
      predictedDigit: prediction[0]
    })
  }

  clearCanvas() {
    this.canvas.clear();
  }

  render() {
    const { data, predictedDigit } = this.state;
    return (
      data ?
        <Paper>
          <Grid container spacing={24} justify="center" alignItems="center">
            <Grid item xs={6}>
              <TextField
                id="batchSize"
                label="Number of Batches"
                value={this.state.batchSize}
                onChange={this.handleChange('batchSize')}
                margin="normal"
                type="number"
              />
            </Grid>
            <Grid item xs={6}>
              <Button variant="raised" color="primary" onClick={this.startTraining}>
                Start Training
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={24} justify="center" alignItems="center">
            <Grid item xs={6}>
              <CanvasDraw 
                ref={e => this.canvas = e}
                brushSize={10}
                brushColor={"#444"}
                canvasWidth={280}
                canvasHeight={280}
              />
            </Grid>
            <Grid item xs={6}>
              <Grid container spacing={16}>
                <Grid item xs={12}>
                {predictedDigit && predictedDigit}
                </Grid>
                <Grid item xs={6}>
                  <Button variant="raised" color="primary" onClick={this.clearCanvas}>
                    Clear
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button variant="raised" color="primary" onClick={this.predict}>
                    Predict
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper> : null
    )
  }
}

export default PolynomialRegressionContainer;
