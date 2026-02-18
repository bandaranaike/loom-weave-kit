import { useRef } from 'react';

export function useMemoKey<T>(value: T, toKey: (v: T) => string): string {
  const ref = useRef<{ key: string; value: T } | null>(null);
  const key = toKey(value);
  if (!ref.current || ref.current.key !== key) {
    ref.current = { key, value };
  }
  return ref.current.key;
}
