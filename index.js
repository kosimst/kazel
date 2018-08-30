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
} from './kazel.js'

console.log(kazel`body`(expect)`div``h3`().then(console.log))
const h3 = document.createElement('h3')

kazel`body > div`(first).appendChild(h3)

h3.classList.add('test')
