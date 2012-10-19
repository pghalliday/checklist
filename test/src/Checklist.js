var expect = require('chai').expect,
    Checklist = require('../../');

describe('Checklist', function() {
  it('should callback immediately if there are no items to check off', function(done) {
    var checklist = new Checklist([], function(error) {
      expect(error).to.be.an('undefined');
      done();
    });
  });
  
  it('should callback once all the items have been checked off', function(done) {
    var checklist = new Checklist(['test', 5, 'hello'], function(error) {
      expect(error).to.be.an('undefined');
      done();
    });
    checklist.check(5);
    checklist.check('hello');
    checklist.check('test');
  });

  it('should callback with an error if an item is checked off that we are not waiting for', function(done) {
    var checklist = new Checklist(['test', 5, 'hello'], function(error) {
      expect(error.toString()).to.equal((new Error('Not waiting for item: goodbye')).toString());
      done();
    });
    checklist.check(5);
    checklist.check('hello');
    checklist.check('goodbye');
  });
  
  it('should callback with an error if an item is checked off twice', function(done) {
    var checklist = new Checklist(['test', 5, 'hello'], function(error) {
      expect(error.toString()).to.equal((new Error('Not waiting for item: hello')).toString());
      done();
    });
    checklist.check(5);
    checklist.check('hello');
    checklist.check('hello');
  });
  
  it('should callback with an error if an item is checked off out of order and ordered has been set to true', function(done) {
    var checklist = new Checklist([
      'test', 
      5, 
      'hello'], {
        ordered: true
      }, function(error) {
      expect(error.toString()).to.equal((new Error('Not waiting for item: hello')).toString());
      done();
    });
    checklist.check('test');
    checklist.check('hello');
    checklist.check(5);
  });

  it('should not callback again after error', function() {
    var callbackCount = 0;
    var checklist = new Checklist(['test', 5, 'hello'], function(error) {
      expect(error.toString()).to.equal((new Error('Not waiting for item: hello')).toString());
      callbackCount++;
    });
    checklist.check(5);
    checklist.check('hello');
    checklist.check('hello');
    checklist.check('hello');
    checklist.check('test');
    expect(callbackCount).to.equal(1);
  });
  
  it('should throw an error if checked again after completion', function() {
    var callbackCount = 0;
    var checklist = new Checklist(['test', 5, 'hello'], function(error) {
      expect(error).to.be.an('undefined');
      callbackCount++;
    });
    checklist.check(5);
    checklist.check('hello');
    checklist.check('test');
    expect(callbackCount).to.equal(1, 'callbackCount');
    
    var errorCount = 0;
    try {
      checklist.check('hello');
    } catch(error) {
      expect(error.toString()).to.equal((new Error('Not waiting for item as already reported completion: hello')).toString());
      errorCount++;
    }
    expect(errorCount).to.equal(1, 'errorCount');
  });
});