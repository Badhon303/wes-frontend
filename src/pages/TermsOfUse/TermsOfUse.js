import React, { useState, useEffect } from "react"
import { sendGetRequest } from "../../libs/FetchApi"
import { BASE_URL } from "../../constants"

const TermsOfUse = () => {
  let [termsOfuse, setTermsOfuse] = useState("")
  const getTermsOfUse = async () => {
    return await sendGetRequest(`${BASE_URL}/terms-conditions`, null, {
      credential: true,
    })
  }
  useEffect(() => {
    getTermsOfUse().then((res) => {
      setTermsOfuse(res.data)
    })
  }, [])
  // console.log(termsOfuse.laws)
  return (
    <>
      <h2 className='text-center text-3xl font-extrabold tracking-tight text-gray-900 mb-14 mt-10'>
        Terms Of Use
      </h2>
      <ul className='mx-72 my-4 bg-gray-50 rounded-3xl p-2 sm:p-5 xl:p-6 text-justify'>
        <article>Preamble: {termsOfuse.preamble}</article>
      </ul>
      <ul className='mx-72 my-4 bg-gray-50 rounded-3xl p-2 sm:p-5 xl:p-6 text-justify'>
        <article>Consent: {termsOfuse.consent}</article>
      </ul>
      {termsOfuse && termsOfuse.laws && (
        <ul className='mx-72 my-4 bg-gray-50 rounded-3xl p-2 sm:p-5 xl:p-6 text-justify'>
          {termsOfuse.laws.map((law, index) => (
            <article className='py-3' key={index}>
              Law {index + 1}: {law}
            </article>
          ))}
        </ul>
      )}
      <ul className='mx-72 my-4 bg-gray-50 rounded-3xl p-2 sm:p-5 xl:p-6 text-justify'>
        <article>Suggessions: {termsOfuse.suggessions}</article>
      </ul>
    </>
  )
}

export default TermsOfUse
