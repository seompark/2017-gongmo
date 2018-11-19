import axios from 'axios'
import swal from 'sweetalert2'

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

function main () {
  const form = $('#form')
  const formFile = $('#formfile')
  const sourceFile = $('#sourcefile')
  const formFileName = $('#formfile-name')
  const sourceFileName = $('#sourcefile-name')
  const addBtn = $('#add-followers-btn')
  const rmvBtns = $$('.remove-btn')
  const saveBtn = $('#save-btn')
  const deleteBtn = $('#delete-btn')
  const clonedFollower = $('.follower').cloneNode(true)
  const followersField = $('#followers')

  const leaderName = $(`input[name="leaderName"]`).value
  const serial = $(`input[name="serial"]`).value

  function updateFileName (el) {
    return e => {
      if (e.target.files.length === 0) return
      const fileName = e.target.files[0].name
      el.innerHTML = fileName
    }
  }

  function cloneFollower () {
    const follower = clonedFollower.cloneNode(true)
    ;[0, 1, 2].forEach(v => (follower.childNodes[v].childNodes[0].value = ''))
    return follower
  }

  function removeFollower () {
    followersField.removeChild(this.parentElement.parentElement)
  }

  function addFollower () {
    // children 이 5 + 1(label) 개 이상이면 return
    if (followersField.children.length >= 5) return swal('이런!', '팀 인원은 팀장 포함 최대 4명입니다.', 'error')

    const flw = cloneFollower()
    followersField.insertBefore(flw, addBtn.parentElement.parentElement)
    flw.children[3].children[0].addEventListener('click', removeFollower)
  }

  function init () {
    const contact = $('input[name="contact"]')
    const teamName = $('input[name="teamName"]')
    contact.className = contact.className.replace('is-danger', '')
    teamName.className = teamName.className.replace('is-danger', '')
  }

  function validate () {
    const checkbox = $('input[type="checkbox"]')
    const contact = $('input[name="contact"]')

    if (!checkbox.checked) {
      swal('이런!', '개인정보 수집 및 이용에 동의해주세요.', 'error')
      return false
    }

    if (!contact.value) {
      const input = $('input[name="contact"]')
      input.className += ' is-danger'
      swal('이런!', '팀장의 연락처를 채워주세요.', 'error')
      return false
    }

    return true
  }

  function submit (e) {
    e && e.preventDefault()
    init()

    if (!validate()) {
      return
    }

    const formData = new window.FormData()

    formData.append('name', $('input[name="teamName"]').value || leaderName)
    formData.append('contact', $('input[name="contact"]').value)
    formData.append(
      'followers',
      JSON.stringify(
        [...$$('.follower')]
          .map((v, i) => ({
            serial: Number(v.childNodes[0].childNodes[0].value),
            name: v.childNodes[1].childNodes[0].value,
            contact: v.childNodes[2].childNodes[0].value,
            priority: i + 1
          }))
          .filter(v => v.serial && v.name)
      )
    )
    formData.append('formfile', formFile.files[0])
    formData.append('sourcefile', sourceFile.files[0])

    const handleResult = error => {
      if (!error) {
        return swal({
          title: '성공!',
          text: '제출되었습니다. 신청 마감까지 언제든지 수정 혹은 삭제하실 수 있습니다.',
          type: 'success'
        }).then(() => (window.location = '/'))
      }
      swal('이런!', error.message, 'error')
      console.error(error)
      if (error.code === 'ERR_DUP_TEAMNAME') {
        const input = $('input[name="teamName"]')
        input.className += ' is-danger'
        input.parentElement.insertAdjacentHTML('beforeend', `<p class="help is-danger">${error.message}</p>`)
      }
    }

    axios.post('/submit', formData, {
      onUploadProgress (event) {
        saveBtn.innerHTML = Math.floor(event.loaded * 100 / event.total) + '%'
      },
      timeout: 1000 * 60 * 5
    })
      .catch(err => handleResult(err))
      .then(r => handleResult(r.data.error))
  }

  function deleteTeam () {
    swal({
      title: '주의!',
      text: '팀을 삭제하시겠습니까? 이 작업은 복구할 수 없습니다.',
      type: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#f2f2f2',
      cancelTextColor: '#595959',
      confirmButtonColor: '#DD3333',
      cancelButtonText: '삭제하지 않습니다.',
      confirmButtonText: '네, 삭제합니다.',
      preConfirm: () => axios.delete(`/submit/delete/${serial}`)
    }).then(result => {
      if (result.value) {
        swal('성공!', '삭제되었습니다.', 'success')
          .then(() => (window.location = '/'))
      }
    })
  }

  saveBtn.addEventListener('click', submit)
  form.onkeydown = e => (e.ctrlKey && e.keyCode === 13 && !!submit()) || e.keyCode !== 13
  formFile.addEventListener('change', updateFileName(formFileName))
  sourceFile.addEventListener('change', updateFileName(sourceFileName))
  addBtn.addEventListener('click', addFollower)
  rmvBtns.forEach(function (v) { v.addEventListener('click', removeFollower) })
  deleteBtn.addEventListener('click', deleteTeam)
}

window.addEventListener('DOMContentLoaded', main, false)
