import axios from 'axios'
import moment from 'moment'

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

function main () {
  const form = $('#form')
  const fileInput = $('#formfile')
  const fileName = $('.file-name')
  const addBtn = $('#add-followers-btn')
  const rmvBtns = $$('.remove-btn')
  const saveBtn = $('#save-btn')
  const cancelBtn = $('#cancel-btn')
  const clonedFollower = $$('.follower')[0].cloneNode(true)
  const followersField = $('#followers')

  function updateFile () {
    if (fileInput.files.length > 0) {
      fileName.innerHTML = fileInput.files[0].name
    }
  }

  function cloneFollower () {
    const follower = clonedFollower.cloneNode(true)
    console.log(follower)
    ;[0, 1].forEach(v => (follower.childNodes[v].childNodes[0].value = ''))
    return follower
  }

  function removeFollower () {
    followersField.removeChild(this.parentElement.parentElement)
  }

  function addFollower () {
    // children 이 5 + 1(label) 개 이상이면 return
    if (followersField.children.length >= 6) return window.alert('팀 인원은 팀장 포함 최대 5명입니다.')
    // children 이 3 + 1(label) 개 이상이면 수상 제외 알림.
    if (followersField.children.length >= 4) window.alert('3번째 팀원부터는 수상에서 제외됩니다.')

    const flw = cloneFollower()
    followersField.insertBefore(flw, addBtn.parentElement.parentElement)
    flw.children[2].children[0].addEventListener('click', removeFollower)
  }

  function submit (e) {
    e && e.preventDefault()

    saveBtn.className += ' is-loading'
    axios.post('/submit', {
      name: $('input[name="teamName"]').value || undefined,
      description: $('textarea[name="description"]').value,
      followers: [...$$('.follower')]
        .map((v, i) => ({
          id: Number(v.childNodes[0].childNodes[0].value),
          name: v.childNodes[1].childNodes[0].value,
          priority: i + 1
        }))
        .filter(v => v.id && v.name)
    })
    .then(r => {
      saveBtn.className = saveBtn.className.replace(' is-loading', '')
      if (r.data.success) {
        $('#message').innerHTML = `<p class="has-text-grey">${moment().format('hh시 mm분 ss초')} : 저장되었습니다.</p>`
      } else {
        $('#message').innerHTML = `<p class="has-text-danger">저장에 실패했습니다.</p>`
      }
      console.log(r.data)
    })
    .catch(() => {
      $('#message').innerHTML = `<p class="has-text-danger">저장에 실패했습니다.</p>`
    })
  }

  function cancel () {
    window.location = '/'
  }

  form.onsubmit = submit
  form.onkeydown = e => (e.ctrlKey && e.keyCode === 13 && !!submit()) || e.keyCode !== 13
  fileInput.addEventListener('change', updateFile)
  addBtn.addEventListener('click', addFollower)
  rmvBtns.forEach(v => v.addEventListener('click', removeFollower))
  cancelBtn.addEventListener('click', cancel)
}

window.addEventListener('load', main, false)
