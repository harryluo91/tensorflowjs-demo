import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { Grid, Paper } from 'material-ui';
import * as tf from '@tensorflow/tfjs';
import { Scatter } from 'react-chartjs-2';

import { generateData, generateLineData } from '../../utils/data';


const a = tf.variable(tf.scalar(Math.random()));
const b = tf.variable(tf.scalar(Math.random()));
const c = tf.variable(tf.scalar(Math.random()));
const d = tf.variable(tf.scalar(Math.random()));

const numIterations = 100;
const learningRate = 0.5;
const optimizer = tf.train.sgd(learningRate);

const trueCoefficients = {a: -.8, b: -.2, c: .9, d: .5};
const trainingData = generateData(100, trueCoefficients);
const xvalsTraining = trainingData.xs.dataSync();
const yvalsTraining = trainingData.ys.dataSync();
const scatterData = Array.from(yvalsTraining).map((y, i) => {
  return {'x': xvalsTraining[i], 'y': yvalsTraining[i]};
});
const bestFitData = generateLineData(trueCoefficients);
const xvalsBestFit = bestFitData.xs.dataSync();
const yvalsBestFit = bestFitData.ys.dataSync();
const bestFitLineData = Array.from(yvalsBestFit).map((y, i) => {
  return {'x': xvalsBestFit[i], 'y': yvalsBestFit[i]};
});

class HomeContainer extends Component {
  constructor() {
    super()
    autoBind(this);
    this.state = {
      trainedCoefficients: {},
      plotData: {
        labels: ['Scatter'],
        datasets: [
          {
            label: 'My First dataset',
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.4)',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: scatterData
          },
          {
            label: 'Line of best fit',
            type: 'line',
            borderColor: 'rgb(219, 15, 35)',
            showLine: true,
            fill: false,
            data: bestFitLineData
          },
          {
            label: 'Predict Line',
            type: 'line',
            borderColor: 'rgb(64, 105, 229)',
            showLine: true,
            fill: false,
            data: []
          },
          {
            label: 'Trained Line',
            type: 'line',
            borderColor: 'rgb(7, 196, 45)',
            showLine: true,
            fill: false,
            data: []
          }
        ]
      }
    }
  }

  componentDidMount() {
    this.learnCoefficients().then((res) => {
      let newPlotData = Object.assign({}, this.state.plotData);
      newPlotData.datasets[2].data = res.lineDataBeforeTraining;
      newPlotData.datasets[3].data = res.lineDataAfterTraining;
      this.setState({
        plotData: newPlotData
      })
    })
  }

  async learnCoefficients() {
    const randomCoefficients = {
      a: a.dataSync()[0],
      b: b.dataSync()[0],
      c: c.dataSync()[0],
      d: d.dataSync()[0]
    }
    const unTrainedData = generateLineData(randomCoefficients);
    await this.train(trainingData.xs, trainingData.ys, numIterations);
    const trainedCoefficients = {
      a: a.dataSync()[0],
      b: b.dataSync()[0],
      c: c.dataSync()[0],
      d: d.dataSync()[0]
    }
    this.setState({
      trainedCoefficients: trainedCoefficients
    })
    const trainedData = generateLineData(trainedCoefficients);

    return await this.prepareData(unTrainedData, trainedData);
  }

  async prepareData(unTrainedData, trainedData) {
    const xvalsBeforeTraining = await unTrainedData.xs.data();
    const yvalsBeforeTraining = await unTrainedData.ys.data();
    const lineDataBeforeTraining = Array.from(yvalsBeforeTraining).map((y, i) => {
      return {'x': xvalsBeforeTraining[i], 'y': yvalsBeforeTraining[i]};
    });

    const xvalsAfterTraining = await trainedData.xs.data();
    const yvalsAfterTraining = await trainedData.ys.data();
    const lineDataAfterTraining = Array.from(yvalsAfterTraining).map((y, i) => {
      return {'x': xvalsAfterTraining[i], 'y': yvalsAfterTraining[i]};
    });

    return {
      lineDataBeforeTraining,
      lineDataAfterTraining
    }
  }

  async train(xs, ys, numIterations) {
    for (let iter = 0; iter < numIterations; iter++) {
      // optimizer.minimize is where the training happens. 
  
      // The function it takes must return a numerical estimate (i.e. loss) 
      // of how well we are doing using the current state of
      // the variables we created at the start.
  
      // This optimizer does the 'backward' step of our training process
      // updating variables defined previously in order to minimize the
      // loss.
      optimizer.minimize(() => {
        // Feed the examples into the model
        const pred = this.predict(xs);
        return this.loss(pred, ys);
      });
      
      // Use tf.nextFrame to not block the browser.
      await tf.nextFrame();
    }
  }

  predict(x) {
    // y = a * x ^ 3 + b * x ^ 2 + c * x + d
    return tf.tidy(() => {
      return a.mul(x.pow(tf.scalar(3, 'int32')))
        .add(b.mul(x.square()))
        .add(c.mul(x))
        .add(d);
    })
  }

  loss(prediction, labels) {
    // Having a good error function is key for training a machine learning model
    const error = prediction.sub(labels).square().mean();
    return error;
  }
  

  render() {
    const { plotData, trainedCoefficients } = this.state;
    return (
      <Paper>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <strong>True Coefficients</strong> a: {trueCoefficients.a} b: {trueCoefficients.b} c: {trueCoefficients.c} d: {trueCoefficients.d}
          </Grid>
          <Grid item xs={12}>
            <strong>Learned Coefficients</strong> a: {trainedCoefficients.a} b: {trainedCoefficients.b} c: {trainedCoefficients.c} d: {trainedCoefficients.d}
          </Grid>
          <Grid item xs={12}>
            <Scatter data={plotData}/>
          </Grid>
        </Grid>
      </Paper>
    )
  }
}

export default HomeContainer;
