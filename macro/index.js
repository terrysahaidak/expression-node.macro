const { createMacro } = require('babel-plugin-macros');
const {
  addDefault,
  addNamed,
} = require('@babel/helper-module-imports');
const t = require('@babel/types');

module.exports = createMacro(expressionNodeMacro, {
  configName: 'expressionNode',
});

function expressionNodeMacro({ references, state, babel, config }) {
  const expressionNodeName = config.identifier || 'E';

  let identifier = null;

  references.default.forEach((referencePath) => {
    if (referencePath.parentPath.type === 'CallExpression') {
      if (identifier == null) {
        const binding = referencePath.parentPath.scope.getBinding(
          expressionNodeName,
        );
        if (binding) {
          identifier = binding.identifier;
        }
      }
      if (identifier == null) {
        identifier = addNamed(
          state.file.path,
          expressionNodeName,
          'react-native',
        );
      }

      const [argumentPath] = referencePath.parentPath.get(
        'arguments',
      );

      genericReplace(argumentPath, state, babel, identifier.name);
    } else {
      throw new Error(
        `expression-node.macro
				can only be used as a function call. You tried ${referencePath.parentPath.type}.`,
      );
    }
  });
}

const createHelper = (
  argumentPath,
  state,
  babel,
  libraryIdentifier,
) => {
  const visitor = {
    ArrowFunctionExpression(path) {
      if (path == argumentPath) {
        return babel.template('LIBRARY.METHOD(ARGS)')({
          LIBRARY: libraryIdentifier,
          METHOD: 'block',
          ARGS: handlePath(path.get('body')),
        }).expression;
      }

      return handlePath(path.body);
    },
    ExpressionStatement(path) {
      const node = path.node ? path.node : path;
      return node.expression;
    },
    BlockStatement(path) {
      const node = path.node ? path.node : path;

      const body = node.body.map(handlePath);

      // return t.arrayExpression(body);

      return babel.template('LIBRARY.METHOD(ARGS)')({
        LIBRARY: libraryIdentifier,
        METHOD: 'block',
        ARGS: handlePath(t.arrayExpression(body)),
      }).expression;
    },

    ConditionalExpression(path) {
      const node = path.node ? path.node : path;

      const args = [node.test, node.consequent, node.alternate];

      return t.callExpression(
        t.memberExpression(
          t.identifier(libraryIdentifier),
          t.identifier('cond'),
        ),
        args,
      );
    },

    IfStatement(path) {
      const node = path.node ? path.node : path;

      const args = [node.test, handlePath(node.consequent)];

      if (node.alternate) {
        args.push(handlePath(node.alternate));
      }

      return t.callExpression(
        t.memberExpression(
          t.identifier(libraryIdentifier),
          t.identifier('cond'),
        ),
        args,
      );
    },
    AssignmentExpression(path) {
      return babel.template(
        'LIBRARY.METHOD(LEFT_EXPRESSION, RIGHT_EXPRESSION)',
      )({
        LIBRARY: libraryIdentifier,
        METHOD: 'set',
        LEFT_EXPRESSION: path.node.left,
        RIGHT_EXPRESSION: handlePath(path.node.right),
      }).expression;
    },
    BinaryExpression(path) {
      const node = path.node ? path.node : path;

      if (binaryOperators[node.operator] == null) {
        throw new Error('Operator is not defined: ' + node.operator);
      }

      return babel.template(
        'LIBRARY.METHOD(LEFT_EXPRESSION, RIGHT_EXPRESSION)',
      )({
        LIBRARY: libraryIdentifier,
        METHOD: babel.types.identifier(
          binaryOperators[node.operator],
        ),
        LEFT_EXPRESSION: node.left,
        RIGHT_EXPRESSION: node.right,
      }).expression;
    },
    CallExpression(path) {
      const callee = path.node.callee;
      if (
        callee.type === 'Identifier' &&
        !path.scope.hasBinding(callee.name)
      ) {
        return babel.template('LIBRARY.METHOD(ARGUMENTS)')({
          LIBRARY: libraryIdentifier,
          METHOD: babel.types.identifier(callee.name),
          ARGUMENTS: path.node.arguments,
        }).expression;
      }
    },
    UnaryExpression(path) {
      if (
        path.node.operator === '-' &&
        path.node.argument.type !== 'NumericLiteral'
      ) {
        // for unary minus operator: -var
        return babel.template('LIBRARY.METHOD(ARGUMENT, ARGUMENT2)')({
          LIBRARY: libraryIdentifier,
          METHOD: babel.types.identifier('multiply'),
          ARGUMENT: path.node.argument,
          ARGUMENT2: '-1',
        }).expression;
      }
    },
    LogicalExpression(path) {
      if (logicOperators[path.node.operator] == null) {
        throw new Error(
          'Operator is not defined: ' + path.node.operator,
        );
      }
      return babel.template('LIBRARY.METHOD(LEFT,RIGHT)')({
        LIBRARY: libraryIdentifier,
        METHOD: babel.types.identifier(
          logicOperators[path.node.operator],
        ),
        LEFT: path.node.left,
        RIGHT: path.node.right,
      }).expression;
    },
    FunctionExpression(path) {
      return path.node.expression;
    },
  };

  function handlePath(path) {
    if (visitor[path.type]) {
      return visitor[path.type](path);
    } else {
      return path;
    }
  }

  const traverseVisitor = {
    enter(path) {
      const result = handlePath(path);
      if (result) {
        path.replaceWith(result);
      }
    },
  };

  function traverse(path) {
    path.parentPath.traverse(traverseVisitor);
    path.parentPath.replaceWith(path);
  }

  return {
    handlePath,
    traverse,
  };
};

function genericReplace(
  argumentPath,
  state,
  babel,
  libraryIdentifier,
) {
  const { handlePath, traverse } = createHelper(
    argumentPath,
    state,
    babel,
    libraryIdentifier,
  );

  traverse(argumentPath);
}

const logicOperators = {
  '&&': 'and',
  '||': 'or',
};

const binaryOperators = {
  '+': 'add',
  '-': 'sub',
  '*': 'multiply',
  '/': 'divide',
  '**': 'pow',
  '%': 'mod',
  '==': 'eq',
  '===': 'eq',
  '!=': 'neq',
  '!==': 'neq',
  '>': 'greaterThan',
  '>=': 'greaterOrEq',
  '<': 'lessThan',
  '<=': 'lessOrEq',
};
