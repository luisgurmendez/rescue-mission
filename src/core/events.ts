
type Subscription = (...args: any) => void;

interface EventSubscription {
  [event: string]: Subscription[]
}

const eventSubscriptions: EventSubscription = {};

class GameEvents {

  on(event: string, cb: Subscription) {
    eventSubscriptions[event] = eventSubscriptions[event] || [];
    eventSubscriptions[event].push(cb);
  }

  off(event: string, cb: Subscription) {
    eventSubscriptions[event] = (eventSubscriptions[event] || []).filter(fn => fn != cb);
  }

  static emit(event: string, ...args: any) {
    (eventSubscriptions[event] || []).map(fn => fn(...args));

  }
}

export default GameEvents;
