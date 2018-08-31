# Kazel

## Advanced querySelector with custom filters, native DOM-APIs and more.

> Note: Still under development, not stable yet, please report bugs

Everybody knows the following situation: You have a bunch of HTML-Elements and want to change something about them e.g. add a class or change the innerText. But that's always quite frustrating, as you can't change them all at once. In fact, you can't even loop or map over them, because it's a NodeList and not an Array.

### Installation

Install from npm:

```
npm install --save kazel
```

Import in Javascript:

```javascript
import { kazel } from '/node_modules/kazel/kazel.js'
```

### Available imports

- `kazel`: Selector function
- `KazelList`: KazelList (Advanced NodeList with Array Methods and able to change multiple elements at once -> is returned by a kazel`` - selector)
- `deep`: Filter for ShadowRoot
- `parent`: Filter for parentElements
- `first`: Filter for first child
- `last`: filter for last child
- `expect`: Filter to expect following elements
- `children`: Filter for children
- `matches`: Filter returns boolean wether selector matches or not

### Native

```javascript
const elmnts = document.querySelectorAll('#mycontainer > div.tochange')

// doesn't work
elmnts.classList.add('anyclass')
elmnts.innerText = 'sometext'

// Also doesn't work
elmnts.forEach(el => {
  el.classList.add('anyclass')
  el.innerText = 'sometext'
})
```

Sure, you could take a overloaded library like jQuery (minified around 13kB), but beside their big size they also don't offer you native DOM-APIs, so you have to learn all those functions again.

That's where Kazel comes in. With currently ~4kB it's pretty small (due to development it's not completely optimized yet, target size is below 3kB) and it exposes only DOM-APIs you already know.

### Kazel

```javascript
// Selector
const elmnts = kazel`#mycontainer > div.tochange`

// Works like a charm!
elmnts.classList.add('anyclass')

// Also easy possible
elmnts.innerText = 'sometext'

// If needed all array methods are also supported
elmnts.forEach(/* do something */)
```

## Features

- ### All-at-once change/manipulating of multiple elements
  ```javascript
  kazel`.alldivs`.innerHTML = 'Works!'
  ```
- ### Get properties of multiple elements
  ```javascript
  kazel`.mydivs`.classList.contains('opened')
  // returns true if all '.mydivs' have class '.opened', else returns false
  ```
- ### Await for elements or elements to match selector
  ```javascript
  // in async function
  const dymicallyAddedElmnt = await kazel`#parent`(expect)`h1.dynamic`()
  // Promise will be fulfilled if 'h1.dynamic' is a child of '#parent'
  ```
- ### Check relation between given HTMLElements
  ```javascript
  kazel`${myElmnt} > ${otherElmnt}`(matches)
  // returns true if myElmnt has direct child otherElmnt
  ```
- ### Combination and Currying

  ```javascript
  const selecInMyDiv = kazel`#myDiv`
  selectInMyDiv`.child-of-myDiv`()

  // or combinating
  document.querySelectorAll('div span a, div button a, div .children a')
  // equals
  kazel`div``span, button, .children``a`() // way easier
  ```

- ### Select in given elements
  ```javascript
  kazel(referenceToElmnt, otherElmnt)`.children`()
  ```
- ### Shadow Root
  ```javascript
  kazel`#elmntWithShadowDom`(deep)`.elemntsInShadowRoot`
  ```

## Usage

### Import modules

`kazel.js` provides all modules, the main module is called kazel

**Import kazel**

```javascript
import { kazel } from './minified/kazel.min.js'
```

**Use it**
kazel is a so-called tag-function, so you can call it with a template string like this:

```javascript
kazel`selector`()
```

You can add as many template strings as you want, just make sure that the previous still returns elements

```javascript
kazel`one``two``and so on…`()
```

If you want to start selecting from given elements, just pass them before the template string or include them in the template string

```javascript
kazel(document.body, document.head)`selectors`()
// or
kazel`${document.body} > .children`()
```

To select an element that will be added dynamically use the `expect` - Custom Filter (`import {kazel, expect} from './kazel.js'`):

```javascript
// in async function
const elmnt = await kazel`selectorToStaticParent`(
  expect,
)`dynamic Child selector`()
```

The selectoreToStaticParent doesn't have to be the parentNode of the dynamic child, it can be anywhere above the dynamic child.

## **! Always add empty parentheses after the template string to get all results !**

If you want to change a property on multiple elements, just select then start changing the property just like you would do on a single element:

```javascript
kazel`.elementsToChange`.style = 'background: red;'
```

All HTMLElement props and methods (like classList) should work, if not, please create an Issue.

> Note: more docs will be added soon, for question or bugs please create an issue

> TODOs:
>
> - Optimize selecting for given elements
> - Improve error handling
> - Reduce code
> - Add index.html and index.js with usefull examples

> Next features (create an issue for feature request):
>
> - CustomElements-Support (currently custom properties are not supported)
> - Create DOM with Kazel
