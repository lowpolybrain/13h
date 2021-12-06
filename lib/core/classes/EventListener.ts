type EventHandler<Args extends Array<unknown>> = (
  ...args: Args
) => void;

export class EventListener<Args extends Array<unknown>> {
  private timesFired: number = 0;
  constructor(
    // If event has been fired, on adding handler - it will be called
    // (will also be added to handlers)
    private fireOnAdd: boolean = false,
    // The event fires only once
    private happensOnce: boolean = false
  ) {}
  handlers: EventHandler<Args>[] = [];
  addHandler(eh: EventHandler<Args>) {
    if (this.fireOnAdd && this.timesFired > 0) {
      eh.apply(this, this.lastArgs);
    }
    this.handlers.push(eh);
  }
  lastArgs?: Args;
  fire(...args: Args) {
    if (!this.happensOnce || this.timesFired === 0) {
      this.timesFired += 1;
      this.lastArgs = this.lastArgs;
      for (let i = 0; i < this.handlers.length; i++) {
        this.handlers[i].apply(this, args);
      }
    }
  }
}

export const makeListener = function <
  Args extends Array<unknown>
>(
  fireOnAdd: boolean = false,
  happensOnce: boolean = false
) {
  const listener = new EventListener<Args>(
    fireOnAdd,
    happensOnce
  );
  const adder = function (handler: EventHandler<Args>) {
    listener.addHandler(handler);
  };
  adder.fire = function (...args: Args) {
    listener.fire(...args);
  };
  return adder;
};
