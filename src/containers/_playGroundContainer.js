import React, { Component } from 'react';
import autoBind from 'react-autobind';
import * as tf from '@tensorflow/tfjs';

class PlayGroundContainer extends Component {
	constructor() {
		super()
    autoBind(this);
	}

	componentDidMount() {
		
		// this.memory();
	}

	// tf.tensor(values, shape?, dtype?)
	tensors() {
		// simple scalar tensor
		// const a = tf.tensor(1);

		// 1d tensor
		// const a = tf.tensor([1, 2, 3]);

		// 2d tensor
		// const a = tf.tensor([1, 2, 3], [1, 2, 3])

		// tensor with shape
		// const a = tf.tensor([1, 2, 3], [1, 3]);
		// const a = tf.tensor([1, 1, 1, 1, 1, 1, 1, 1], [2, 2, 2])

		// tensor with type (float, int, boolean)
		// const a = tf.tensor([1.9999], null, 'int32');

		// create tensor explicitly
		// const val = [0, 1, 2, 3, 4, 5, 6, 7];
		// const shape = [2, 2, 2];
		// const a = tf.tensor(val, shape);
		// const b = tf.tensor2d(val, shape);
		// a.print();
		// b.print();
	}

	variables() {
		const val = [];
		for (let i = 0; i < 40; i++) {
			val.push(Math.floor(Math.random() * 100));
		}
		const a = tf.tensor(val, [2, 10, 2]);

		// create a variable from tensor
		// trainable
		const a_var = tf.variable(a);
		console.log(a);
		console.log(a_var);
		// a.print();
		// console.log(a.dataSync());
	}

	operations() {
		// Arithmetic
		// tf.add, tf.sub, tf.mul, tf.div
		// const a = tf.tensor2d([1, 1, 1, 1], [2, 2]);
		// const b = tf.tensor2d([2, 2, 2, 2], [2, 2]);
		// a.add(b).print();

		// Matrices
		// tf.matMul, tf.transpose
		// const a = tf.tensor2d([1, 1, 1, 1, 1, 1], [2, 3]);
		// const b = tf.tensor2d([1, 1, 1], [1, 3]);
		// const c = a.matMul(b);
		// c.print();
	}

	// tf.tidy, tf.keep, tensor.dispose
	memory() {
    // memory leak

    // dispose
    // const a = tf.tensor2d([2, 2], [2, 1]);
    // a.dispose();

    // tidy(), tf.keep()
    setInterval(() => {
      const vals = [];
      for (let i = 0; i < 100; i++) {
        vals.push(Math.random() * 100);
      }
  
      const shape = [10, 10];
      tf.tidy(() => {
      	const a = tf.tensor2d(vals, shape);
      	const b = tf.tensor2d(vals, shape);
  
        const c = a.matMul(b);
        // tf.keep(c);
      })
      console.log(tf.memory().numTensors);
    }, 100);
  }
  
  layers() {
    const model = tf.sequential();

    // dense layers - fully connected layers
    // input, hidden, output layers
    // config
    const configHidden = {
      inputShape: 2,
      units: 4,
      activation: 'sigmoid'
    }
    const configOutput = {
      units: 1,
      activation: 'sigmoid'
    }
    const hidden = tf.layers.dense(configHidden);
    const ouput = tf.layers.dense(configOutput);

    // add layers to the model
    model.add(hidden);
    model.add(ouput);

    // compile the model
    // with optimizer and loss function
    const sgdOptimizer = tf.train.sgd(0.1);
    const configCompile = {
      optimizer: sgdOptimizer,
      loss: 'meanSquaredError' //tf.losses.meanSquaredError
    }
    model.compile(configCompile);

    // create inputs
    // shape - 1 by 2 arrays x 2
    const inputs = tf.tensor2d([[1, 1]]);

    const output = model.predict(inputs);

    output.print();

    // train
    const xTrain = tf.tensor2d([
      [0, 0],
      [0.5, 0.5],
      [1, 1]
    ])

    const yTrain = tf.tensor2d([
      [1],
      [0.5],
      [0]
    ])

    // model.fit()
    // fit is an async function, need to use async await to train in a loop
    // for loop doesn't work
    const result = model.fit(xTrain, yTrain);
    result.then((res) => {
      console.log(res);
    })
    tf.tidy(() => {
      const trainConfig = {
        epochs: 10,
        shuffle: true
      }
      this.train(model, xTrain, yTrain, trainConfig).then(() => {
        const output = model.predict(xTrain);
        output.print();
      });
    })
    
  }

  async train(model, xs, ys, config) {
    for (let i = 0; i < 1000; i++) {
      const history = await model.fit(xs, ys, config);
      console.log(history.history.loss[0]);
    }
  }

  render() {
    return (
      <div></div>
    );
  }
}

export default PlayGroundContainer;
