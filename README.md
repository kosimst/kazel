# Kazel
## Advanced querySelector with custom filters, native DOM-APIs and more.

Everybody knows the following situation: You have a bunch of HTML-Elements and want to change something about them e.g. add a class or change the innerText. But that's always quite frustrating, as you can't change them all at once. In fact, you can't even loop or map over them, because it's a NodeList and not an Array.

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

Sure, you could take some 