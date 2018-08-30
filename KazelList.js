/**
 * KazelList
 * @description Advanced NodeList with array methods and multiple changing
 */
export default class KazelList extends Array {
  constructor(config, ...args) {
    if (config.isConfig) {
      super(...args)
      this.ready = config.ready || false
    } else {
      super(config, ...args)
      config = {
        returnReducedValues: true,
      }
    }
    return new Proxy(this, {
      get(target, key) {
        if (key in Array.prototype) {
          return typeof Array.prototype[key] === 'function'
            ? Array.prototype[key].bind(target)
            : target[key]
        } else if (key in HTMLElement.prototype) {
          try {
            if (typeof HTMLElement.prototype[key] === 'function') {
              return (...args) => {
                const vals = target.map(el => {
                  args = args.map(arg => {
                    if (arg instanceof HTMLElement) {
                      return arg.cloneNode(true)
                    } else if (arg && arg.wholeText) {
                      return document.createTextNode(arg.wholeText)
                    } else {
                      return arg
                    }
                  })
                  return el[key](...args)
                })
                return config.returnReducedValues
                  ? vals.reduce((h, i) => h && i)
                  : vals
              }
            }
          } catch (e) {
            if (e instanceof TypeError) {
              let type
              if (target.length > 1) {
                type = target.map(el => el[key]).reduce((prev, current) => {
                  if (
                    (prev || prev.length === 0 || prev === false) &&
                    (prev === typeof current || typeof prev === typeof current)
                  ) {
                    return typeof current
                  } else {
                    throw new Error('Property types do not match')
                  }
                })
              } else {
                type = target[0] && target[0][key] && typeof target[0][key]
              }

              switch (type) {
                case 'function': {
                  return new Proxy(
                    {},
                    {
                      get(_, method) {
                        return (...methodArgs) => {
                          const result = target.map(el =>
                            el[key][method](...methodArgs),
                          )
                          if (result && result.reduce) {
                            return config.returnReducedValues
                              ? result.reduce(
                                  (prev, current) => prev && current,
                                )
                              : result
                          }
                        }
                      },
                      set(_, keySet, value) {
                        target.forEach(el => (el[key][keySet] = value))
                      },
                    },
                  )
                }
                case 'object': {
                  switch (key) {
                    case 'firstChild':
                    case 'lastChild':
                    case 'lastElementChild':
                    case 'firstElementChild':
                    case 'nextElementSibling':
                    case 'nextSibling':
                    case 'previousElementSibling':
                    case 'previousSibling':
                    case 'parentNode':
                    case 'parentElement': {
                      const result = target.map(el => el[key])
                      if (
                        result.every(
                          (curr, i, array) =>
                            array[i - 1] ? curr === array[i - 1] : true,
                        )
                      ) {
                        return result[0]
                      } else {
                        return new KazelList(
                          ...Array.prototype.concat(...result),
                        )
                      }
                    }
                    case 'childNodes':
                    case 'children': {
                      return new KazelList(
                        ...Array.prototype
                          .concat(...target.map(el => [...el[key]]))
                          .filter((el, i, array) => array.indexOf(el) === i),
                      )
                    }
                    default: {
                      return new Proxy(
                        Array.prototype.concat(...target.map(el => el[key])),
                        {
                          get(propTarget, prop) {
                            if (propTarget[prop]) {
                              return propTarget[prop]
                            } else if (
                              target
                                .map(el => el[key][prop])
                                .reduce(
                                  (prev, curr) =>
                                    prev && typeof curr === 'function',
                                )
                            ) {
                              return (...args) => {
                                const result = target.map(el =>
                                  el[key][prop](...args),
                                )
                                return config.returnReducedValues
                                  ? result.reduce(
                                      (prev, current) => prev && current,
                                    )
                                  : result
                              }
                            } else {
                              return undefined
                            }
                          },
                        },
                      )
                    }
                  }
                }
                case 'string':
                case 'number':
                case 'boolean': {
                  return Array.from(target.map(el => el[key]))
                }
              }
            }
          }
        } else if (key in target) {
          return target[key]
        }
      },
      set(target, key, value) {
        if (key in HTMLElement.prototype) {
          target.forEach(el => (el[key] = value))
        }
        return value
      },
    })
  }
}
