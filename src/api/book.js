import request from '@/utils/request'

export function searchBook(data) {
  return request({
    url: 'http://localhost:8888/book/query',
    method: 'post',
    data
  })
}

export function updateBook(data) {
  return request({
    url: 'http://localhost:8888/book/modify',
    method: 'post',
    data
  })
}

export function addBook(data) {
  return request({
    url: 'http://localhost:8888/book/add',
    method: 'post',
    data
  })
}
