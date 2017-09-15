import axios from 'axios'

function main () {
  const removeBtn = document.querySelector('#rm-follower-btn')
  const addBtn = document.querySelector('#add-follower-btn')
  const submitBtn = document.querySelector('#submit-btn')

  const addFollower = () => {

  }
  const removeFollower = () => {

  }
  const submit = () => {

  }

  addBtn.addEventListener('click', addFollower)
  removeBtn.addEventListener('click', removeFollower)
  submitBtn.addEventListener('click', submit)
}

window.addEventListener('load', main)
