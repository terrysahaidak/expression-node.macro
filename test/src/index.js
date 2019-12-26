import x from '../../macro';
import { Animated } from 'react-native';
const { E } = Animated;

let a = () => null;

useOnFrameExpression(() => {
  const normalizedPan = x(panY - panYOffset);

  const subtractTest = x(10 * 10 + 10 - 1 - 1 - 2 * (2 > 1 ? 2 : 1));

  const min = (a, b) => x(a < b ? a : b);

  const canSwipeMore = x(
    gestureState === State.ACTIVE && scrollY <= 0,
  );

  return x(() => {
    // memoize last panY value in order to subtract it later from the real panY
    if (gestureState === State.BEGAN) {
      panYOffset = scrollY + 1 + 2;
      panYOffset = -1;
    }

    // check if the user has already scrolled all the way to the top
    if (canSwipeMore) {
      // if so - allow user to scroll more to the top
      // in order to show the refresh controls
      marginTop = panY >= 0 ? min(MAX_OVERSCROLL, normalizedPan) : 0;
    }
  });
});

x(a() * 12);
x(startClock());

x((distX / (endTime - startTime)) * 1000);

x(() => {
  if (this.gestureState == State.ACTIVE) {
    stopClock(this.clock);
    this.transX = this.transX + (this.dragX - this.prevDragX);
    this.prevDragX = this.dragX;
    this.transX;
  } else if (
    (this.gestureState != -1 && this.gestureState != 12) ||
    this.gestureState == 5
  ) {
    this.prevDragX = 0;
    this.transX = () => {
      if (defined(this.transX)) {
        if (clockRunning(this.clock) === 0) {
          this.animatedState.finished = 0;
          this.animatedState.velocity = this.dragVX;
          this.animatedState.position = this.transX;
          startClock(this.clock);
        }
      }
      decay(this.clock, this.animatedState, {
        deceleration: 0.999,
      });
      if (this.animatedState.finished) {
        stopClock(this.clock);
      }
      this.animatedState.position;
    };
  }
});
