const Duplex = require('stream').Duplex;

class EmitterStream extends Duplex {
  constructor(highWaterMark = 128) {
    super({
      objectMode: true,
      highWaterMark: highWaterMark
    });
  }
  
  _read(size) {
    
  }
  
  _write(chunk, encoding, callback) {
    this.emit(chunk.name, ...chunk.args);
    callback();
  }
    
  static input(emitter, ...eventNames) {
    let eventStream = new EmitterStream();
    let handlersToCleanup = [];

    eventNames.forEach(eventName => {
      let handler = (...args) => {
        eventStream.push({
          name: eventName,
          args: args
        });
      };
      handlersToCleanup.push(handler);
      emitter.on(eventName, handler);
    });
    
    eventStream.on('finish', () => {
      eventNames.forEach((eventName, i) => {
        emitter.removeListener(eventName, handlersToCleanup[i]);
      });
    });
    
    return eventStream;
  }
  
  static output(otherStream) {
    let eventStream = new EmitterStream();
    otherStream.pipe(eventStream);
    return eventStream;
  }
};

module.exports = EmitterStream;
