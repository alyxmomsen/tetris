import { useEffect } from "react";

export default function MyComponent({ state }: { state: number }) {
  useEffect(() => {
    console.log(state);
  }, [state]);

  return <div>MyComponent state: {state}</div>;
}
