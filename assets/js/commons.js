import '../scss/main.scss'
import 'babel-polyfill'
import 'noto-sans-kr/styles.css'

import stickybits from 'stickybits'

stickybits('#navbar')

// NodeList#forEach polyfill
if (window.NodeList && !window.NodeList.prototype.forEach) {
  window.NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window
    for (let i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this)
    }
  }
}
