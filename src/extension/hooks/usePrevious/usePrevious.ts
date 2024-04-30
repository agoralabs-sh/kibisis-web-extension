import { useEffect, useRef } from 'react';

export default function usePrevious<Value>(value: Value): Value {
  const ref = useRef<Value>(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
