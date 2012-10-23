function Checklist(items, options, callback) {
  var self = this,
      calledBack = false,
      complete = false,
      list = items.slice(0);
  
  // deal with the optional options parameter
  if (typeof callback === 'undefined') {
    callback = options;
    options = {};
  }

  if (list.length === 0) {
    calledBack = true;
    complete = true;
    callback();
  }
  
  self.check = function(item) {
    if (options.debug) {
      console.log(item);
    }
    if (calledBack) {
      if (complete) {
        throw(new Error('Not waiting for item as already reported completion: ' + item));
      }
    } else {
      var index = list.indexOf(item);
      if (options.ordered && index !== 0) {
        index = -1;
      }
      if (index === -1) {
        calledBack = true;
        callback(new Error('Not waiting for item: ' + item));
      } else {
        list.splice(index, 1);
        if (list.length === 0) {
          calledBack = true;
          complete = true;
          callback();
        }
      }
    }
  };
}

module.exports = Checklist;