let {EventEmitter} = require('events');
let EmitterStream = require('./');
let assert = require('chai').assert;

describe('EmitterStream', function() {

  it('should forward events and cleanup handlers', endTest => {
    
    const EventEmitter = require('events').EventEmitter;

    let originalEmitter = new EventEmitter();

    let eventStream = EmitterStream.input(originalEmitter, 'foo');
    originalEmitter.emit('foo', {x: 'bar'});
    eventStream.end();
    
    assert.equal(originalEmitter.listenerCount('foo'), 0);

    EmitterStream.output(eventStream)
      .on('foo', data => {
        assert.deepEqual(data, {
          x: 'bar'
        });
        endTest();
      });
  });
});
