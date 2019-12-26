import { Animated } from 'react-native';
const { E } = Animated;

let a = () => null;

useOnFrameExpression(() => {
  const normalizedPan = E.sub(panY, panYOffset);
  const subtractTest = E.sub(
    E.add(E.multiply(10, 10), 10),
    1,
    1,
    E.multiply(2, E.cond(E.greaterThan(2, 1), 2, 1)),
  );

  const min = (a, b) => E.cond(E.lessThan(a, b), a, b);

  const canSwipeMore = E.and(
    E.eq(gestureState, State.ACTIVE),
    E.lessOrEq(scrollY, 0),
  );
  return E.block(
    E.block([
      E.cond(
        E.eq(gestureState, State.BEGAN),
        E.block([
          E.set(panYOffset, E.add(scrollY, 1, 2)),
          E.set(panYOffset, -1),
        ]),
        E.block([E.set(panYOffset, min(a, b))]),
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
E.multiply(a(), 12);
E.startClock();
E.multiply(E.divide(distX, E.sub(endTime, startTime)), 1000);
E.block(
  E.block([
    E.cond(
      E.eq(this.gestureState, State.ACTIVE),
      E.block([
        E.stopClock(this.clock),
        E.set(
          this.transX,
          E.add(this.transX, E.sub(this.dragX, this.prevDragX)),
        ),
        E.set(this.prevDragX, this.dragX),
        this.transX,
      ]),
      E.cond(
        E.or(
          E.and(
            E.neq(this.gestureState, -1),
            E.neq(this.gestureState, 12),
          ),
          E.eq(this.gestureState, 5),
        ),
        E.block([
          E.set(this.prevDragX, 0),
          E.set(
            this.transX,
            E.block([
              E.cond(
                E.defined(this.transX),
                E.block([
                  E.cond(
                    E.eq(E.clockRunning(this.clock), 0),
                    E.block([
                      E.set(this.animatedState.finished, 0),
                      E.set(this.animatedState.velocity, this.dragVX),
                      E.set(this.animatedState.position, this.transX),
                      E.startClock(this.clock),
                    ]),
                  ),
                ]),
              ),
              E.decay(this.clock, this.animatedState, {
                deceleration: 0.999,
              }),
              E.cond(
                this.animatedState.finished,
                E.block([E.stopClock(this.clock)]),
              ),
              this.animatedState.position,
            ]),
          ),
        ]),
      ),
    ),
  ]),
);
