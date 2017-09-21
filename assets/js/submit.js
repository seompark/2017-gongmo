import axios from 'axios'

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

function main () {
  const fileInput = $('#formfile')
  const fileName = $('.file-name')

  const updateFile = () => {
    if (fileInput.files.length > 0) {
      fileName.innerHTML = fileInput.files[0].name
    }
  }

  fileInput.addEventListener('change', updateFile)
  // addBtn.addEventListener('click', addFollower)
  // submitBtn.addEventListener('click', submit)
}

window.addEventListener('load', main, false)
