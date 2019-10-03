import config from '../config'
import { post, get } from '../utils/httpHelpers'
import log from 'loglevel'

const postQuote = (reqObj, token) => {
  try {
    const options = {
      mode: 'cors',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }
    return post(`${config.simplexHost}/quote`, reqObj, options)
  } catch (e) {
    log.error(e)
  }
}
const postOrder = (reqObj, token) => {
  try {
    const options = {
      mode: 'cors',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }
    return post(`${config.simplexHost}/order`, reqObj, options)
  } catch (e) {
    log.error(e)
  }
}

const getPastOrders = (reqObj, params = {}, token) => {
  try {
    const options = {
      mode: 'cors',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }
    const url = new URL(`${config.simplexHost}/pastorders`)
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    return get(url, options)
  } catch (e) {
    log.error(e)
  }
}

const getStatus = (userId, token) => {
  try {
    return get(`${config.simplexHost}/status/${userId}`)
  } catch (e) {
    log.error(e)
  }
}
export { postQuote, postOrder, getStatus, getPastOrders }
