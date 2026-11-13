import { useEffect, useState } from "react";

export const useDebounce = <T>(value: T, delay: number = 400): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const isCleared = typeof value === "string" && value.trim() === "";
    const timer = setTimeout(
      () => {
        setDebouncedValue(value);
      },
      isCleared ? 0 : delay,
    );

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};
