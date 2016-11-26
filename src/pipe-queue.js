import {Stream} from 'stream';
import concat from 'pipe-concat';

var queue = [];
var finish;
var done;

export default class PipeQueue {
	constructor() {}
	when(argument,...streams) {
		// if the first argument is function
		if(typeof argument === 'function') {
			var factory = argument;
			factory(this.next.bind(this),concat);
			return this;
		}

		// if the arguments are all streams
		var streams = [argument,...streams];
		concat(streams).on('end',() => {
			this.next();
		});

		return this;
	}
	then(factory) {
		if(typeof factory === 'function') {
			queue.push(factory);
		}

		return this;
	}
	end(factory) {
		finish = factory;

		return this;
	}
	next() {
		if(queue.length > 0) {
			var factory = queue.shift();
			if(typeof factory === 'function') {
				factory(this.next.bind(this),concat);
			}
		}
		else {
			if(typeof finish === 'function') {
				finish();
			}
			if(typeof done === 'function') {
				done();
			}
		}
		return this;
	}
	promise() {
		return new Promise((resolve, reject)=> {
			done = resolve;
		});
	}
}

module.exports = PipeQueue;