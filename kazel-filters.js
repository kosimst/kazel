import { kazel, KazelList } from './kazel.js'

export const siblings = (...elements) =>
  new KazelList(
    ...Array.prototype.concat(
      ...elements.map(el => [
        ...[...el.parentNode.children].filter(child => child !== el),
      ]),
    ),
  )
export const children = (config, ...elements) =>
  new KazelList(
    config,
    ...Array.prototype.concat(...elements.map(el => [...el.children])),
  )
export const deep = (config, ...elements) =>
  new KazelList(config, ...elements.map(el => el.shadowRoot))
export const parent = (config, ...elements) =>
  new KazelList(config, ...elements.map(el => el.parentNode))
export const all = (config, ...elements) =>
  new KazelList({ ...config, ready: true }, ...elements)
export const first = (...elements) => elements.shift()

export const last = (...elements) => elements.pop()
export const matches = (...element) => !!element.shift()
export const expect = (config, ...elements) => {
  return kazel({ ...config, expect: true })(...elements)
}
