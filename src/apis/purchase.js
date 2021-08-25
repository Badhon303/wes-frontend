import { BASE_URL } from "../constants"
import {
  sendGetRequest,
  sendPostRequest,
  sendPutRequest,
} from "../libs/FetchApi"

export function getTokenPriceList() {
  return sendGetRequest(`${BASE_URL}/purchase`, null, { credential: true })
}

export function postCartItems(data) {
  return sendPostRequest(`/purchase/cart/calculate`, data, {
    credential: true,
  })
}

export function submitOrder(data) {
  return sendPostRequest(`/purchase/cart/submit`, data, { credential: true })
}

export function submitReferralOrder(data) {
  return sendPostRequest(`/referral-point/exchange`, data, {
    credential: true,
  })
}

export function submitDollarPriceUpdate(data) {
  return sendPutRequest(`/referral-point/dollar-price`, data, {
    credential: true,
  })
}

export function getTokenPrice(unit, tokens) {
  return sendGetRequest(
    `${BASE_URL}/tokens/price?price_per=${unit}&token=${tokens.join(",")}`,
    null,
    { credential: true }
  )
}

export function rewardReferralPoint(userId, orderId, packagePrice) {
  return sendPostRequest(
    `/mlm/${userId}/reward/${packagePrice}`,
    { orderId },
    { credential: true }
  )
}

export function triggerForAllApi(data) {
  return sendPostRequest(`/gold-point/trigger`, data, { credential: true })
}

export function triggerForOneApi(data) {
  return sendPostRequest(`/gold-point/trigger`, data, { credential: true })
}

export function submitGPOrder(data) {
  return sendPostRequest(`/gold-point/exchange`, data, {
    credential: true,
  })
}

export function exchangeGoldCoinRates(data) {
  return sendPutRequest(`/gold-point/exchange/exchange-rates`, data, {
    credential: true,
  })
}

export function updateEmail(data, id) {
  return sendPutRequest(`/email-template/${id}`, data, {
    credential: true,
  })
}

export function getTransectionFee(data) {
  return sendPostRequest(`/account/calculate-tx-fee`, data, {
    credential: true,
  })
}

export function setTransfer(data) {
  return sendPostRequest(`/account/transfer`, data, {
    credential: true,
  })
}
