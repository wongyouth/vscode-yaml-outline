import { getMonoid, pipe } from 'fp-ts/lib/function';
import * as M from 'fp-ts/Monoid';
import * as O from 'fp-ts/Option';
import * as N from 'fp-ts/number';
import * as A from 'fp-ts/Apply';

type RetryStatus = {
  iterNumber: number; // the number of retries
  previousDelay: O.Option<number>; // preview delay time in miliseconds
};

// O.none means no retry any more
interface RetryPolicy {
  (status: RetryStatus): O.Option<number>;
}

const constPolicy = (delay: number): RetryPolicy => {
  return () => O.some(delay);
};

// no delay if less than limit
const limitRetries = (limit: number): RetryPolicy => {
  return ({ iterNumber }) => (iterNumber > limit ? O.none : O.some(0));
};

const exponetialBackoff = (delay: number): RetryPolicy => {
  return ({ iterNumber }) => pipe(Math.pow(2, iterNumber) * delay, O.some);
};

// enable to set a maximum delay time
function maxDelay(delay: number, policy: RetryPolicy): RetryPolicy {
  return (status) =>
    pipe(
      policy(status),
      O.map((t) => Math.min(t, delay))
    );
}

const applyPolicy =
  (policy: RetryPolicy) =>
  (status: RetryStatus): RetryStatus => ({
    iterNumber: status.iterNumber + 1,
    previousDelay: policy(status),
  });

const M1 = M.max(N.Bounded);
const S1 = A.getApplySemigroup(O.Apply)(M1);
const MonoidForOptionNumber = {
  concat: S1.concat,
  empty: O.of(0),
};

const Monoid = getMonoid(MonoidForOptionNumber)<RetryStatus>();

const startStatus: RetryStatus = {
  iterNumber: 0,
  previousDelay: O.some(0),
};

function dryRun(policy: RetryPolicy): Array<RetryStatus> {
  let status = startStatus;
  let list: Array<RetryStatus> = [];
  list.push(status);

  while (status.previousDelay !== O.none) {
    console.log(status);

    status = applyPolicy(policy)(status);
    list.push(status);
  }

  return list;
}

function main(): void {
  const policy = maxDelay(
    500,
    M.concatAll(Monoid)([
      constPolicy(50),
      exponetialBackoff(1),
      limitRetries(10),
    ])
  );
  dryRun(policy);
}

main();
