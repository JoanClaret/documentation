'use strict';

var formatType = require('../../lib/format_type'),
  parseParamType = require('doctrine/lib/typed').parseParamType,
  test = require('tap').test;

test('formatType', function (t) {
  [
    ['Foo', 'Foo'],
    ['null', 'null'],
    ['*', '*'],
    ['Array|undefined', '(Array|undefined)'],
    ['Array<number>', 'Array.<number>'],
    ['undefined', 'undefined']
  ].forEach(function (example) {
    t.deepEqual(formatType([], parseParamType(example[0])), example[1], example[0]);
  });


  /*

  t.deepEqual(formatType({
    type: 'UnionType',
    elements: [{
      type: 'NameExpression',
      name: 'Foo'
    }, {
      type: 'NameExpression',
      name: 'Bar'
    }]
  }), 'Foo or Bar', 'union expression');

  t.deepEqual(formatType({
    type: 'OptionalType',
    expression: {
      type: 'NameExpression',
      name: 'Foo'
    }
  }), '[Foo]', 'optional type');

  t.deepEqual(formatType({
    type: 'AllLiteral'
  }), 'Any', 'all literal');
  */

  t.end();
});
