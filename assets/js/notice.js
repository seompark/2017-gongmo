const axios = require('axios')
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

function main () {
  const boxes = Array.from($$('.notice-box'))
  boxes.forEach(el => $(`#${el.id} .delete`).addEventListener('click', deleteNotice(el)))
}

function deleteNotice (el) {
  return () => {
    const accept = window.confirm('공지를 삭제하시겠습니까?')
    const id = el.id.replace('notice-', '')

    if (!accept) return
    el.classList.add('is-hidden')
    axios
      .delete('/admin/notice', { params: { id } })
      .then(({ data }) => {
        if (!data.success) el.classList.remove('is-hidden')
      })
      .catch(console.error)
  }
}

document.addEventListener('DOMContentLoaded', main)
