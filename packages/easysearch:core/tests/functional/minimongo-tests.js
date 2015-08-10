var collection = new Meteor.Collection('minimongoCollection');

if (Meteor.isServer) {
  collection.remove({ });
  collection.insert({ _id: 'testId', name: 'testName' });

  for (var i = 0; i < 100; i += 1) {
    collection.insert({ _id: 'testId' + i, sortField: i, name: 'name sup what' });
  }
}

var index = new EasySearch.Index({
  engine: new EasySearch.Minimongo({
    sort: function () {
      return ['sortField'];
    }
  }),
  collection: collection,
  fields: ['name']
});

if (Meteor.isServer) {
  Meteor.publish('testCollection', function () {
    return collection.find();
  });

  Tinytest.add('EasySearch - Functional - Minimongo - Error on Server', function (test) {
    try {
      index.search('test');
    } catch (e) {
      test.instanceOf(e, Meteor.Error);
      return;
    }

    test.fail();
  });
} else if (Meteor.isClient) {
  Meteor.subscribe('testCollection');

  Tinytest.addAsync('EasySearch - Functional - Minimongo - prefix search', function (test, done) {
    Deps.autorun(function (c) {
      var docs = index.search('test').fetch();

      if (docs.length === 1) {
        test.equal(docs, [{ _id: 'testId', name: 'testName' }]);
        test.equal(index.search('test').count(), 1);
        done();
        c.stop();
      }
    });
  });

  Tinytest.addAsync('EasySearch - Functional - Minimongo - suffixed search', function (test, done) {
    function getExpectedDocs() {
      var docs = [];

      for (var i = 0; i < 10; i += 1) {
        docs.push({ _id: 'testId' + i,  sortField: i, name: 'name sup what' });
      }

      return docs;
    }

    Tracker.autorun(function (c) {
      var docs = index.search('what').fetch();

      if (docs.length === 10) {
        test.equal(docs, getExpectedDocs());
        test.equal(index.search('what').count(), 100);
        done();
        c.stop();
      }
    });
  });
}
