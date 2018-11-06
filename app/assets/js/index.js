import swal from 'sweetalert2'

const $ = document.querySelector.bind(document)

$('#submit-link-btn').addEventListener('click', () => swal('이런!', '신청이 마감되었습니다.', 'error'))
