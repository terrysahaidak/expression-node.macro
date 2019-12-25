import { Animated } from 'react-native';
const { E } = Animated;

let a = () => null;

Animated.E.multiply(a(), 12);
Animated.E.startClock();
Animated.E.multiply(
  Animated.E.divide(distX, Animated.E.sub(endTime, startTime)),
  1000,
);
Animated.E.block(
  Animated.E.block([
    Animated.E.cond(
      Animated.E.eq(this.gestureState, State.ACTIVE),
      Animated.E.block([
        Animated.E.stopClock(this.clock),
        Animated.E.set(
          this.transX,
          Animated.E.add(
            this.transX,
            Animated.E.sub(this.dragX, this.prevDragX),
          ),
        ),
        Animated.E.set(this.prevDragX, this.dragX),
        this.transX,
      ]),
      Animated.E.cond(
        Animated.E.or(
          Animated.E.and(
            Animated.E.neq(this.gestureState, -1),
            Animated.E.neq(this.gestureState, 12),
          ),
          Animated.E.eq(this.gestureState, 5),
        ),
        Animated.E.block([
          Animated.E.set(this.prevDragX, 0),
          Animated.E.set(
            this.transX,
            Animated.E.block([
              Animated.E.cond(
                Animated.E.defined(this.transX),
                Animated.E.block([
                  Animated.E.cond(
                    Animated.E.eq(
                      Animated.E.clockRunning(this.clock),
                      0,
                    ),
                    Animated.E.block([
                      Animated.E.set(this.animatedState.finished, 0),
                      Animated.E.set(
                        this.animatedState.velocity,
                        this.dragVX,
                      ),
                      Animated.E.set(
                        this.animatedState.position,
                        this.transX,
                      ),
                      Animated.E.startClock(this.clock),
                    ]),
                  ),
                ]),
              ),
              Animated.E.decay(this.clock, this.animatedState, {
                deceleration: 0.999,
              }),
              Animated.E.cond(
                this.animatedState.finished,
                Animated.E.block([Animated.E.stopClock(this.clock)]),
              ),
              this.animatedState.position,
            ]),
          ),
        ]),
      ),
    ),
  ]),
);
useOnFrameExpression(() => {
  const normalizedPan = Animated.E.sub(panY, panYOffset);

  const min = (a, b) =>
    Animated.E.cond(Animated.E.lessThan(a, b), a, b);

  const canSwipeMore = Animated.E.and(
    Animated.E.eq(gestureState, State.ACTIVE),
    Animated.E.lessOrEq(scrollY, 0),
  );
  return Animated.E.block(
    Animated.E.block([
      Animated.E.cond(
        Animated.E.eq(gestureState, State.BEGAN),
        Animated.E.block([Animated.E.set(panYOffset, scrollY)]),
      ),
      Animated.E.cond(
        canSwipeMore,
        Animated.E.block([
          Animated.E.set(
            marginTop,
            Animated.E.cond(
              Animated.E.greaterOrEq(panY, 0),
              min(MAX_OVERSCROLL, normalizedPan),
              0,
            ),
          ),
        ]),
      ),
    ]),
  );
});
