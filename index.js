import {
  KazelList,
  kazel,
  first,
  all,
  last,
  parent,
  matches,
  children,
  siblings,
  expect,
} from './minified/kazel.min.js'

console.log(document.querySelectorAll('div button a, div span a'))

console.log(kazel`div``button, span``a`())
