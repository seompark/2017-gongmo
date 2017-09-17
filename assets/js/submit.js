import axios from 'axios'

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

function main () {
  const removeBtn = $('#rm-follower-btn')
  const addBtn = $('#add-follower-btn')
  const submitBtn = $('#submit-btn')

  const addFollower = () => {

  }
  const removeFollower = () => {

  }
  const submit = async () => {
    const name = $('.name').value
    const followers = $$('.followers').map(v => v.value)

    const res = await axios.post('/submit', {
      name,
      followers
    })

    return res
  }

  addBtn.addEventListener('click', addFollower)
  removeBtn.addEventListener('click', removeFollower)
  submitBtn.addEventListener('click', submit)
}

window.addEventListener('load', main)
