function createRandomKey() {
  return Math.random()
    .toString(36)
    .substr(2, 5)
}

function ReactiveObject(baseObject = {}) {
  const readListners = {}
  const writeListners = {}
  const obj = {
    ...baseObject,
    addReadListner: func => {
      const randomKey = createRandomKey()
      readListners[randomKey] = func
      return randomKey
    },
    addWriteListner: func => {
      const randomKey = createRandomKey()
      writeListners[randomKey] = func
      return randomKey
    },
    removeSubscriber: subscriberID => {
      if (!delete readListners[subscriberID]) {
        return delete writeListners[subscriberID]
      } else {
        return true
      }
      return false
    },
    getReadListners: () => ({ ...readListners }),
    getWriteListners: () => ({ ...writeListners })
  }
  return new Proxy(obj, {
    get: (target, prop) => {
      const value = target[prop]
      Object.values(readListners).forEach(callbackFunc => {
        callbackFunc(prop, value, target)
      })
      return value
    },
    set: (target, prop, value) => {
      Object.values(writeListners).forEach(callbackFunc => {
        callbackFunc(prop, value, target)
      })
      target[prop] = value
      return target[prop] === value
    }
  })
}

export default ReactiveObject
