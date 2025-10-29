export type Observer<A> = {
  next: (a: A) => void;
  complete?: () => void;
};

export type Unsubscribe = () => void;

export interface Stream<A> {
  subscribe(o: Observer<A>): Unsubscribe;
  map<B>(f: (a: A) => B): Stream<B>;
}

export const Stream = <A>(subscribe: (o: Observer<A>) => Unsubscribe): Stream<A> => {
  return {
    subscribe,
    map: function <B>(f: (a: A) => B): Stream<B> {
      return Stream<B>((o) =>
        subscribe({
          next: (a) => o.next(f(a)),
          complete: () => o.complete?.(),
        })
      );
    },
  };
};
