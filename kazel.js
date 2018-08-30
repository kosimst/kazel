import KazelList from './KazelList.js'

/**
 * Selector function
 * @param {object | Array} config Init object or array to start selecting
 * @param  {...any} rest Values
 */
export const kazel = (config, ...rest) => {
  let prevElements
  let configElement = {
    useKazelList: true,
    returnReducedValues: true,
    isConfig: true,
    expect: false,
  }
  let stack = []
  let promise
  const select = new Proxy(
    function _select(strings, ...values) {
      if (strings !== undefined) {
        let removes = []
        if (Array.isArray(strings)) {
          let selector = ''
          strings.forEach((string, i) => {
            const currentElmnt = values[i] || ''
            if (currentElmnt) {
              const id = `${Math.floor(
                Math.random() *
                  Math.floor(Math.random() * (Date.now() / 10000)),
              ).toString(36)}${Math.floor(Math.random() * 10000).toString(
                27,
              )}`.repeat(
                Math.floor((Math.random() * Date.now()) / 1000000000000 + 1),
              )
              currentElmnt.dataset[id] = true
              selector += `${string}[data-${id}]`
              removes.push(() => currentElmnt.removeAttribute(`data-${id}`))
            } else {
              selector += string
            }
          })
          if (configElement.expect) {
            stack.push({ strings, values })
            if (!promise) {
              promise = new Promise((resolve, reject) => {
                prevElements.forEach(el => {
                  const observer = new MutationObserver(records => {
                    let stackedSelector = kazel
                    stack.forEach(
                      ({ strings: stackedStrings, values: stackedValues }) => {
                        stackedSelector = stackedSelector(
                          stackedStrings,
                          ...stackedValues,
                        )
                      },
                    )
                    if (stackedSelector()) {
                      resolve(records.pop().target)
                    }
                  })
                  observer.observe(el, {
                    subtree: true,
                    childList: true,
                    attributes: true,
                    characterData: true,
                  })
                  return observer
                })
              })
            }
          } else {
            if (prevElements) {
              prevElements = Array.prototype.concat(
                ...prevElements.map(
                  el => el && [...el.querySelectorAll(selector)],
                ),
              )
            } else {
              prevElements = [...document.querySelectorAll(selector)]
            }
          }
          removes.forEach(remove => remove())
          return select
        } else if (typeof strings === 'function') {
          prevElements = strings.length
            ? strings(configElement, ...prevElements)
            : strings(...prevElements)
          if (typeof prevElements === 'function') {
            return prevElements
          } else if (prevElements) {
            return !prevElements.ready && prevElements.length
              ? select
              : prevElements
          } else {
            return null
          }
        } else if (strings instanceof HTMLElement) {
          prevElements = [
            strings,
            ...(values.every(el => el instanceof HTMLElement) ? values : []),
          ]
          return select
        }
      } else {
        if (configElement.expect) {
          return promise
        } else if (prevElements && prevElements.length > 0) {
          return configElement.useKazelList
            ? new KazelList(configElement, ...prevElements)
            : prevElements
        } else {
          return null
        }
      }
    },
    {
      get(_, key) {
        return new KazelList(configElement, ...prevElements)[key]
      },
      set(_, key, value) {
        return (new KazelList(configElement, ...prevElements)[key] = value)
      },
    },
  )

  if (Array.isArray(config) || config instanceof HTMLElement) {
    return select(config, ...rest)
  } else if (config) {
    configElement = { ...configElement, ...config, isConfig: true }
    return select
  }
}

export { KazelList }
export * from './kazel-filters.js'
