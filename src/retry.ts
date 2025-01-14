import { getMonoid, pipe } from 'fp-ts/lib/function';
import * as M from 'fp-ts/Monoid';
import * as O from 'fp-ts/Option';
import * as N from 'fp-ts/number';

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
const limitPolicy = (limit: number): RetryPolicy => {
  return ({ iterNumber }) => {
    if (iterNumber > limit) {
      return O.none;
    } else {
      return O.some(0);
    }
  };
};

const exponetialBackoff = (delay: number): RetryPolicy => {
  return ({ iterNumber }) => pipe(Math.pow(2, iterNumber) * delay, O.some);
};

// enable to set a maximum delay time
function maxDelay(delay: number, policy: RetryPolicy): RetryPolicy {
  return (status) => {
    const time = policy(status);
    return pipe(
      time,
      O.map((t) => Math.min(t, delay))
    );
  };
}

const applyPolicy =
  (policy: RetryPolicy) =>
  (status: RetryStatus): RetryStatus => ({
    iterNumber: status.iterNumber + 1,
    previousDelay: policy(status),
  });

const Monoid = getMonoid(M.max(N.Bounded));

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
