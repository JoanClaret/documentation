var Syntax = require('doctrine').Syntax;

/**
 * Helper used to format JSDoc-style type definitions into HTML or Markdown.
 *
 * Supported types:
 * NullableLiteral
 * VoidLiteral
 * ArrayType
 * RecordType
 * FieldType
 * FunctionType
 * ParameterType
 * NonNullableType
 *
 * User types:
 * - NameExpression
 *
 * Literals:
 * - NullLiteral
 * - AllLiteral
 * - UndefinedLiteral
 *
 * Potentially omitted values:
 * - OptionalType
 * - NullableType
 *
 * Composite types:
 * - UnionType
 * - RestType
 * - TypeApplication
 *
 * @name formatType
 * @param {Array<string>} paths valid namespace paths that can be linked
 * @param {Object} type type object in doctrine style
 * @returns {string} string
 * @example
 * var x = { type: 'NameExpression', name: 'String' };
 * // in template
 * // {{ type x }}
 * // generates String
 */
function stringifyImpl(node, compact, topLevel) {
  var result, i, iz;

  switch (node.type) {
  case Syntax.NullableLiteral:
    result = '?';
    break;

  case Syntax.AllLiteral:
    result = '*';
    break;

  case Syntax.NullLiteral:
    result = 'null';
    break;

  case Syntax.UndefinedLiteral:
    result = 'undefined';
    break;

  case Syntax.VoidLiteral:
    result = 'void';
    break;

  case Syntax.UnionType:
    if (!topLevel) {
      result = '(';
    } else {
      result = '';
    }

    for (i = 0, iz = node.elements.length; i < iz; ++i) {
      result += stringifyImpl(node.elements[i], compact);
      if ((i + 1) !== iz) {
        result += '|';
      }
    }

    if (!topLevel) {
      result += ')';
    }
    break;

  case Syntax.ArrayType:
    result = '[';
    for (i = 0, iz = node.elements.length; i < iz; ++i) {
      result += stringifyImpl(node.elements[i], compact);
      if ((i + 1) !== iz) {
        result += compact ? ',' : ', ';
      }
    }
    result += ']';
    break;

  case Syntax.RecordType:
    result = '{';
    for (i = 0, iz = node.fields.length; i < iz; ++i) {
      result += stringifyImpl(node.fields[i], compact);
      if ((i + 1) !== iz) {
        result += compact ? ',' : ', ';
      }
    }
    result += '}';
    break;

  case Syntax.FieldType:
    if (node.value) {
      result = node.key + (compact ? ':' : ': ') + stringifyImpl(node.value, compact);
    } else {
      result = node.key;
    }
    break;

  case Syntax.FunctionType:
    result = compact ? 'function(' : 'function (';

    if (node['this']) {
      if (node['new']) {
        result += (compact ? 'new:' : 'new: ');
      } else {
        result += (compact ? 'this:' : 'this: ');
      }

      result += stringifyImpl(node['this'], compact);

      if (node.params.length !== 0) {
        result += compact ? ',' : ', ';
      }
    }

    for (i = 0, iz = node.params.length; i < iz; ++i) {
      result += stringifyImpl(node.params[i], compact);
      if ((i + 1) !== iz) {
        result += compact ? ',' : ', ';
      }
    }

    result += ')';

    if (node.result) {
      result += (compact ? ':' : ': ') + stringifyImpl(node.result, compact);
    }
    break;

  case Syntax.ParameterType:
    result = node.name + (compact ? ':' : ': ') + stringifyImpl(node.expression, compact);
    break;

  case Syntax.RestType:
    result = '...';
    if (node.expression) {
      result += stringifyImpl(node.expression, compact);
    }
    break;

  case Syntax.NonNullableType:
    if (node.prefix) {
      result = '!' + stringifyImpl(node.expression, compact);
    } else {
      result = stringifyImpl(node.expression, compact) + '!';
    }
    break;

  case Syntax.OptionalType:
    result = stringifyImpl(node.expression, compact) + '=';
    break;

  case Syntax.NullableType:
    if (node.prefix) {
      result = '?' + stringifyImpl(node.expression, compact);
    } else {
      result = stringifyImpl(node.expression, compact) + '?';
    }
    break;

  case Syntax.NameExpression:
    result = node.name;
    break;

  case Syntax.TypeApplication:
    result = stringifyImpl(node.expression, compact) + '.<';
    for (i = 0, iz = node.applications.length; i < iz; ++i) {
      result += stringifyImpl(node.applications[i], compact);
      if ((i + 1) !== iz) {
        result += compact ? ',' : ', ';
      }
    }
    result += '>';
    break;

  default:
    throw new Error('Unknown type ' + node.type);
  }

  return result;
}

function stringify(path, node, options) {
  if (options == undefined) {
    options = {};
  }
  return stringifyImpl(node, options.compact, options.topLevel);
}

module.exports = stringify;
