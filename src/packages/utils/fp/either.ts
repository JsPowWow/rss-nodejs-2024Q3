const enum EitherType {
  Left = 'Left',
  Right = 'Right',
}

export type Either<L, R> = EitherInstance<L, R, EitherType.Right> | EitherInstance<L, R, EitherType.Left>;

class EitherInstance<L, R, T extends EitherType = EitherType> {
  static right<L = never, T = never>(v: T): Either<L, T> {
    return new EitherInstance<L, T, EitherType.Right>(EitherType.Right, v);
  }

  static left<T = never, R = never>(v: T): Either<T, R> {
    return new EitherInstance<T, R, EitherType.Left>(EitherType.Left, v);
  }

  static fromTry<L, R>(fn: () => R): Either<L, R> {
    try {
      return EitherInstance.right(fn());
    } catch (e) {
      return EitherInstance.left(e as L);
    }
  }

  static from<T>(v: T): Either<never, T> {
    return EitherInstance.right(v);
  }

  static async fromPromise<L, R>(promise: Promise<R>): Promise<Either<L, R>> {
    return promise.then(EitherInstance.right).catch((e) => EitherInstance.left(e as L));
  }

  static chain<L, R, NR>(f: (v: R) => Promise<Either<never, NR>>): (m: Either<L, R>) => Promise<Either<L, NR>>;
  static chain<L, R, NL>(f: (v: R) => Promise<Either<NL, never>>): (m: Either<L, R>) => Promise<Either<NL | L, R>>;
  static chain<L, R, NL, NR>(f: (v: R) => Promise<Either<NL, NR>>): (m: Either<L, R>) => Promise<Either<NL | L, NR>>;
  static chain<L = never, R = never, NL = never, NR = never>(f: (v: R) => Promise<Either<NL, NR>>) {
    return (m: Either<L, R>): Promise<Either<L | NL, NR>> => m.asyncChain(f);
  }

  private constructor(
    private readonly type: T,
    public readonly value: T extends EitherType.Left ? L : R,
  ) {}

  get [Symbol.toStringTag]() {
    return `Either::${String(this.value)}`;
  }

  isLeft(): this is EitherInstance<L, R, EitherType.Left> {
    return this.type === EitherType.Left;
  }

  isRight(): this is EitherInstance<L, R, EitherType.Right> {
    return this.type === EitherType.Right;
  }

  chain<A, B>(f: (r: R) => Either<A, B>): Either<A | L, B> {
    if (this.isLeft()) {
      return EitherInstance.left<L, B>(this.value as L);
    }
    return f(this.value as R);
  }

  asyncChain<A, B>(f: (r: R) => Promise<Either<A, B>>): Promise<Either<A | L, B>> {
    if (this.isLeft()) {
      return Promise.resolve(EitherInstance.left<L, B>(this.value));
    }
    return f(this.value as R);
  }

  join<L1, L2, R>(this: Either<L1, Either<L2, R>>): Either<L1 | L2, R> {
    return this.chain((x) => x);
  }

  mapRight<T>(f: (r: R) => T): Either<L, T> {
    return this.map(f);
  }

  mapLeft<T>(f: (l: L) => T): Either<T, R> {
    if (this.isLeft()) {
      return EitherInstance.left<T, R>(f(this.value as L));
    }
    return EitherInstance.right<T, R>(this.value as R);
  }

  map<T>(f: (r: R) => T): Either<L, T> {
    if (this.isLeft()) {
      return EitherInstance.left<L, T>(this.value as L);
    }
    return EitherInstance.right<L, T>(f(this.value as R));
  }

  asyncMap<T>(f: (r: R) => Promise<T>): Promise<Either<L, T>> {
    if (this.isLeft()) {
      return Promise.resolve(EitherInstance.left<L, T>(this.value as L));
    }
    return f(this.value as R).then((v) => EitherInstance.right<L, T>(v));
  }

  tapRight(f: (r: R) => void): typeof this {
    f(this.value as R);
    return this;
  }

  unwrapOr(x: R): R {
    return this.isRight() ? this.value : x;
  }

  match<C>(mapLeft: (l: L) => C, mapRight: (r: R) => C) {
    return this.isRight() ? mapRight(this.value as R) : mapLeft((this as Either<L, R>).value as L);
  }
}

export const isEither = <L, R>(value: unknown | Either<L, R>): value is Either<L, R> => value instanceof EitherInstance;

export const { left, right, from, fromTry, fromPromise, chain } = EitherInstance;
