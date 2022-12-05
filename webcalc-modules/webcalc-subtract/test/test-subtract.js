var expect  = require('chai').expect;
var sub = require('../subtract');

it('Subtraction Test - Both Pos', function(done) {
        var x = 10;
        var y = 5;
        var a = 5;
        expect(sub.subtract(x,y)).to.equal(a);
        done();
});


it('Subtraction Test - Both Neg', function(done) {
        var x = -10;
        var y = -5;
        var a = -5;
        expect(sub.subtract(x,y)).to.equal(a);
        done();
});

it('Subtraction Test - One Pos One Neg', function(done) {
        var x = -10;
        var y = 5;
        var a = -15;
        expect(sub.subtract(x,y)).to.equal(a);
        done();
});
