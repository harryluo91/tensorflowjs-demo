import React, { Component } from 'react';
import autoBind from 'react-autobind';
import * as tf from '@tensorflow/tfjs';

class PlayGroundContainer extends Component {
	constructor() {
		super()
    autoBind(this);
	}

	componentDidMount() {
		this.ohhhYep()
	}

	ohhhYep() {
    console.log('ohhhhhh yep!!!');
    this.loadSavedModel().then((model) => {
      const xs = tf.tensor([[0.00632, 18.00, 2.310, 0, 0.5380, 6.5750, 65.20, 4.0900, 1, 296.0, 15.30, 396.90, 4.98]]);
      const output = model.predict(xs);
      output.print();
    });
  }
    

  async loadSavedModel() {
    return await tf.loadModel('http://localhost:8081/model');
  }

  render() {
    return (
      <div></div>
    );
  }
}

export default PlayGroundContainer;
