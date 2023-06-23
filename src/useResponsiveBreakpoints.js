import { useState, useRef, useEffect } from "react";

export default function useResponsiveBreakpoints(elRef, breakpoints) {
  const firstQuery = Object.keys(breakpoints[0])[0];
  const [breakSize, setBreakSize] = useState(firstQuery);

  const observer = useRef(
    new ResizeObserver(entries => {
      const { width } = entries[0].contentRect;

      setBreakSize(findBreakPoint(breakpoints, width));
    })
  );

  useEffect(() => {
    const callbackFunction = (entries) => {
      observer.current.unobserve(elRef.current);
    };
    if (elRef.current) {
      observer.current.observe(elRef.current);
    }
  }, [elRef, observer]);

  return breakSize;
}

function findBreakPoint(breakpoints, width) {
  const breakpointIndex = breakpoints
    .map(x => Object.values(x)[0])
    .findIndex(x => width < x);

  if (breakpointIndex === -1) {
    return Object.keys(breakpoints[breakpoints.length - 1])[0];
  }

  return Object.keys(breakpoints[breakpointIndex])[0];
}