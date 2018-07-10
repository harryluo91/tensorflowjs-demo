import React, { Component } from 'react';
import autoBind from 'react-autobind';
import * as tf from '@tensorflow/tfjs';

class PlayGroundContainer extends Component {
	constructor() {
		super()
    autoBind(this);
	}

	componentDidMount() {
		
		this.memory();
	}

	// tf.tensor(values, shape?, dtype?)
	tensors() {
		// simple scalar tensor
		// const a = tf.tensor(1);

		// 1d tensor
		// const a = tf.tensor([1, 2, 3]);

		// 2s tensor
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
		const vals = [];
		for (let i = 0; i < 100; i++) {
			vals.push(Math.random() * 100);
		}

		const shape = [10, 10];
		tf.tidy(() => {
			const a = tf.tensor2d(vals, shape);
			const b = tf.tensor2d(vals, shape);

			const c = a.matMul(b);
		})
		// const a = tf.tensor2d(vals, shape);
		// const b = tf.tensor2d(vals, shape);

		// const c = a.matMul(b);
		console.log(tf.memory().numTensors);
	}

  render() {
    return (
      <div></div>
    );
  }
}

export default PlayGroundContainer;
