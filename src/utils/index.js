
// Array to object with custom key/value functions
export const arrToObj = (arr = [], keyFunc = (s) => s.id, valueFunc = (s) => s) => {
  return arr.reduce(
    (o, b, idx) => ({
      ...o,
      [keyFunc(b, idx, o)]: valueFunc(b, idx, o),
    }),
    {},
  )
}