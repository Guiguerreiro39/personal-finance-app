import { DateTime, Effect, Option } from 'effect';

export const disableFutureDates = (date: Date) => {
  const res = DateTime.make(date).pipe(Option.getOrUndefined);

  if (!res) {
    return true;
  }

  return DateTime.isFuture(res).pipe(Effect.runSync);
};
