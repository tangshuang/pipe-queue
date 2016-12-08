# Pipe Queue

Put different pipe lines into a queue, stream pipe lines in this queue will run one by one.
Use like a Promise with `when` and `then`.

## Install

```
$ npm install pipe-queue
```

## Usage

#### import

```
import PipeQueue from 'pipe-queque';
```

or

```
var PipeQueue = require('pipe-queue');
```

#### instantiate

```
var $queue = new PipeQueue();
```

#### when: begin the queue with one or more streams

```
$queue.when(stream1[,stream2,...])...
```

or you can use a callback function:

```
$queue.when((next,concat) => {
	var stream = ...
	stream.on('end',next);
})...
```

Callback function detail will be told later.

#### then: arrange your queue

```
$queue.when(...).then((next,concat) => {
	var stream = ...
	stream.on('end',next);
}).then(...)...
```

The callback function is as same as `.when()`. I will talk about it later.

### end: do something in the end

```
$queue
.when(...)
.then((next,concat) => {
	var stream = ...
	stream.on('end',next);
})
.then(...)
...
.end(() => {
	// do something at the end
})
```

**Notice:** don't do something async in `end` callback function.

Only one end can be called, if you pend more than one, the last one will be use, and others will be dropped.

## APIs

#### .when()

After instantiating, you will get an instance of `PipeQueue`, it has `.when()` to begin the queue.

1) with streams:

```
$queue.when(stream1[,stream2,...])
```

You must pass stream data type into `when` so that `.on('end',callback)` can work successfully.

2) with a callback function:

```
new PipeQueue().when(function(next,concat){
	var stream1 = ...,stream2 = ...
	concat(stream1,stream2,...).on('end',next)
})
```

I will talk about the detail of callback function later. 

**Notice:** you must call `next` function in when callback function, or it will not run functions passed to `then`. And in `then` callback function, it is the same, you must call `next` before you end your queue.

#### .then()

After the beginning `when`, you have more tasks to do, put these tasks in `then` callback function. Functions passed to `then()` will be run one by one (called by `next`).

```
.then(function(next,concat){
	...// must call next()
}).then(...)...
```

#### .end()

You may want to do something after all `then` ended. You can pass a function into `.end()` to PipeQueue.

```
new PipeQueue().when(...).then(...).then(...).end(function(){
	// do something...
});
```

**Notice:** you must use `next()` in the last `then()` callback function to call `end`. 

No parameters for end callback function.

#### callback function

You can use callback function in both `when()` and `then()`, but you must follow rules:

* `next()` must be called before you end your queue, util `.end()`.
* all pipe streams are async, so be careful when you run more than one stream in a callback function, `concat` function recommended.

Callback function structure:

```
function(next,concat) {
	stream.on('end',next)
}
```

Sometimes, you may do something without streams, so you can call `next()` directly:

```
function(next,concat) {
	// do something
	next();
}
```

**next()**

To call the next `then()` callback function. Without a `next` call in callback function, queue will be paused in this place until you call `next` again.

In fact, `next` in callback function is an alias of `PipeQueue.next()`, so you can use the instance of `PipeQueue` to call `next()`:

```
var $queue = new PipeQueue().then(...).then(...); // without next in then()
$queue.next();
// ...
$queue.next();
// ...
```

This give your freedom to do what you want.

**concat()**

This is a helper to contact serveral streams, so that you can do something after all of these streams ended:

```
function(next,concat) {
	var concatedStream = concat(stream1,stream2,...);
	concatedStream.on('end',next);
}
```

**Notice:** all streams are async.

You can also pass in an array (only one parameter):

```
function(next,concat) {
	var concatedStream = concat([stream1,stream2,...]);
	concatedStream.on('end',next);
}
```

However, you can know more about `concat` from [here](https://github.com/tangshuang/pipe-concat).

#### .promise()

The instance of PipeQueue has a `.promise()` property. This is for gulp, in a gulp task, only stream, promise and callback can notice the end of task. So when you want to notice gulp task end, use `.promise()` like this:

```
var PipeQueue = require('pipe-queue');
gulp.task('default',() => {
	var $queue = new PipeQueue();
	$queue.when(...).then(...)...
	return $queue.promise();
});
```

**Notice:** whenever you use pipe-queue, you should call `next` in `then()` callback function. If you don't do this, promise will not be resolved, and your task will never be end.

## Development

This package is written by ES6, use [componer](https://github.com/tangshuang/componer) to build source code.