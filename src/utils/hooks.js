import { useState, useEffect, useRef } from 'react'

export const onlyUniqueId = (entity, index, self) => {
  return self.findIndex((e) => entity.id === e.id) === index
}

// Custom hook that can be used to define a timeout if not clearTimer is invoked within the time (e.g. on outside condition)
export const useTimedOut = (time, skip) => {
  const [timedOut, setTimedOut] = useState(false)
  const [clearTimer, setClearTimer] = useState(() => () => undefined)

  useEffect(() => {
    if (!skip) {
      const id = setTimeout(() => setTimedOut(true), time)
      setClearTimer(() => () => clearTimeout(id))
    }
  }, [skip, time])

  return { timedOut, clearTimer }
}

// Custom hook that can be used to define an interval that fires every delay-second
// -> https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export function useInterval(callback, delay) {
  // useRef to update the callback with new state/props without rerendering the setInterval with new time
  const savedCallback = useRef()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    // Cleanup old Interval when new delay is set
    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
    return undefined
  }, [delay])
}

// Custom hook to delay the re-exeuction of expensive calculations
export function useDebounce(func, params, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(func(...params))

  useEffect(
    () => {
      // Set debouncedValue to value (passed in) after the specified delay
      const handler = setTimeout(() => {
        setDebouncedValue(func(...params))
      }, delay)

      // Return a cleanup function that will be called every time ...
      // ... useEffect is re-called. useEffect will only be re-called ...
      // ... if value changes (see the inputs array below).
      // This is how we prevent debouncedValue from changing if value is ...
      // ... changed within the delay period. Timeout gets cleared and restarted.
      // To put it in context, if the user is typing within our app's ...
      // ... search box, we don't want the debouncedValue to update until ...
      // ... they've stopped typing for more than 500ms.
      return () => {
        clearTimeout(handler)
      }
    },
    // Only re-call effect if value changes
    // You could also add the "delay" var to inputs array if you ...
    // ... need to be able to change that dynamically.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...params, func, delay],
  )

  return debouncedValue
}

// Custom hook to use the previous value e.g. in a comparison in useEffect
export const usePrevious = (value) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

// Custom hook that excludes calling useEffect on mounting
export const useDidUpdateEffect = (fn, inputs) => {
  const didMountRef = useRef(false)

  useEffect(() => {
    if (didMountRef.current) fn()
    else didMountRef.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, inputs)
}

// Own forceUpdate hook
export const useForceUpdate = () => {
  // eslint-disable-next-line
  const [value, setValue] = useState(0) // integer state
  return () => setValue((value) => ++value) // update the state to force render
}
