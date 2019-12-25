# expression-node.macro

## Intro

This macro will transform a javascript block to be react native animated expression. Example:

```js
import { Animated } from 'react-native';
const { E } = Animated;
import re from 'expression-node.macro';

useOnFrameExpression(() => {
  const normalizedPan = re(panY - panYOffset);

  const min = (a, b) => re(a < b ? a : b);

  const canSwipeMore = re(
    gestureState === State.ACTIVE && scrollY <= 0,
  );

  return re(() => {
    // memoize last panY value in order to subtract it later from the real panY
    if (gestureState === State.BEGAN) {
      panYOffset = scrollY;
    }

    // check if the user has already scrolled all the way to the top
    if (canSwipeMore) {
      // if so - allow user to scroll more to the top
      // in order to show the refresh controls
      marginTop = panY >= 0 ? min(MAX_OVERSCROLL, normalizedPan) : 0;
    }
  });
});
```

Will transform to:

```js
import { Animated } from 'react-native';
const { E } = Animated;
import re from 'expression-node.macro';

useOnFrameExpression(() => {
  const normalizedPan = E.sub(panY, panYOffset);

  const min = (a, b) => E.cond(E.lessThan(a, b), a, b);

  const canSwipeMore = E.and(
    E.eq(gestureState, State.ACTIVE),
    E.lessOrEq(scrollY, 0),
  );

  return E.block(
    E.block([
      E.cond(
        E.eq(gestureState, State.BEGAN),
        E.block([E.set(panYOffset, scrollY)]),
      ),
      E.cond(
        canSwipeMore,
        E.block([
          E.set(
            marginTop,
            E.cond(
              E.greaterOrEq(panY, 0),
              min(MAX_OVERSCROLL, normalizedPan),
              0,
            ),
          ),
        ]),
      ),
    ]),
  );
});
```

## Installation

```sh
npm add -D terrysahaidak/expression-node.macro
```

## Usage

Make sure you have Animated.E in scope:

```js
import { Animated } from 'react-native';
const { E } = Animated;
```

Then you should be able to import `re` from the package. See example for usage cases. 

## Config

Define the identifier to the reanimated config name to tell the macro what identifier holds the Reanimated value.

```js
const plugins = [
	['macros',{
		expressionNode: {
			identifier: 'Animated'
		}
	}]
];
```

## License

Based on [js-to-reanimated.macro](https://github.com/kkirby/js-to-reanimated.macro) by [kkirby](https://github.com/kkirby).

MIT