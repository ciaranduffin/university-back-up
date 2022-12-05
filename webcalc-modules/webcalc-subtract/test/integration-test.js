//reference: https://www.youtube.com/watch?v=r8sPUw4uxAI
//test comment

var request = require('supertest')
    , server = require('../server')

describe("valid data returns correct response code", function () {
    it("two positives", function (done) {
        request(server).get("/?x=6&y=2")
            .expect(200, done)
    })

    it("two negatives", function (done) {
        request(server).get("/?x=-6&y=-2")
            .expect(200, done)
    })

    it("one positive one negative", function (done) {
        request(server).get("/?x=-6&y=2")
            .expect(200, done)
    })
})

describe("invalid data returns correct response code", function () {
    it("no data", function (done) {
        request(server).get("/")
            .expect(400, done)
    })

    it("non numeric data", function (done) {
        request(server).get("/?x=foo&y=bar")
            .expect(400, done)
    })

    it("decimal numbers data", function (done) {
        request(server).get("/?x=4.2&y=3.2")
            .expect(400, done)
    })
})

describe("valid data returns correct response body", function () {
    it("two positives", function (done) {
        request(server).get("/?x=4&y=2")
            .expect({ error: false, string: "4-2=2", answer: 2 }, done)
    })

    it("two negatives", function (done) {
        request(server).get("/?x=-4&y=-2")
            .expect({ error: false, string: "-4--2=-2", answer: -2 }, done)
    })

    it("one positive one negative", function (done) {
        request(server).get("/?x=-4&y=2")
            .expect({ error: false, string: "-4-2=-6", answer: -6 }, done)
    })
})

describe("invalid data returns correct response body", function () {
    it("no data", function (done) {
        request(server).get("/")
            .expect({ error: true, string: "One or both required parameters (x and y) are missing.", answer: 0 }, done)
    })

    it("non numeric data", function (done) {
        request(server).get("/?x=foo&y=bar")
            .expect({ error: true, string: "One or both required parameters (x and y) are non numeric.", answer: 0 }, done)
    })

    it("decimal numbers data", function (done) {
        request(server).get("/?x=4.2&y=3.2")
            .expect({ error: true, string: "One or both required parameters (x and y) are not whole numbers.", answer: 0 }, done)
    })
})

describe("valid data returns correct content type", function () {
    it("two positives", function (done) {
        request(server)
        .get('/?x=2&y=2')
        .expect('Content-Type', 'application/json', done);
    });

    it("two negatives", function (done) {
        request(server)
        .get('/?x=-2&y=-2')
        .expect('Content-Type', 'application/json', done);
    });

    it("one positive one negative", function (done) {
        request(server)
        .get('/?x=2&y=-2')
        .expect('Content-Type', 'application/json', done);
    });
});

describe("invalid data returns correct content type", function () {
    it("no data", function (done) {
        request(server)
        .get('/')
        .expect('Content-Type', 'application/json', done);
    })

    it("non numeric data", function (done) {
        request(server)
        .get('/?x=foo&y=bar')
        .expect('Content-Type', 'application/json', done);
    })

    it("decimal numbers data", function (done) {
        request(server)
        .get('/?x=2.2&y=2.2')
        .expect('Content-Type', 'application/json', done);
    })
})
