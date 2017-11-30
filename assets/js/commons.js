import '../scss/main.scss'
import 'babel-polyfill'
import 'noto-sans-kr/styles.css'

import '../images/logo.png'
import '../images/brand_logo.png'
import '../images/background.svg'

// NodeList#forEach polyfill
if (window.NodeList && !window.NodeList.prototype.forEach) {
  window.NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window
    for (let i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this)
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const $navBurger = document.querySelector('.navbar-burger')
  if ($navBurger) {
    $navBurger.addEventListener('click', () => {
      const target = $navBurger.dataset.target
      const $target = document.getElementById(target)

      $navBurger.classList.toggle('is-active')
      $target.classList.toggle('is-active')
    })
  }
})
