import request from '@/utils/request'

export function searchBorrow(data) {
  return request({
    url: 'http://localhost:8888/borrow/query',
    method: 'post',
    data
  })
}

export function updateBorrow(data) {
  return request({
    url: 'http://localhost:8888/borrow/modify',
    method: 'post',
    data
  })
}

export function borrowBorrow(data) {
  return request({
    url: 'http://localhost:8888/borrow/borrow',
    method: 'post',
    data
  })
}

export function returnBorrow(data) {
  return request({
    url: 'http://localhost:8888/borrow/return',
    method: 'post',
    data
  })
}
