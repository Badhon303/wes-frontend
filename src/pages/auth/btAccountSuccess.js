import { Link } from "react-router-dom"
import isValidEmail from "../../libs/validator/email"
import React, { useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { toast } from "../../components/Toast/toast"
import { DownloadIcon } from "../../components/IconsSvg/svgIcons"

const REDIRECT_AFTER_SIGNUP = "profile/verify"

const validate = (values) => {
  const errors = {}
  const { nickName, password, email } = values

  if (!nickName) {
    errors.nickName = "Required"
  } else if (!/^[a-zA-Z]+$/i.test(values.nickName)) {
    errors.nickName = "Nickname contains characters only"
  }
  // else if (!(nickName.length >= 3 && nickName.length < 30)) {
  //     errors.nickName = 'Must be greater than 3 and less than 30 characters';
  // }

  if (!password) {
    errors.password = "Required"
  }
  // else if (!(password.length >= 3 && password.length < 9)) {
  //     errors.password = 'Must be between 4 to 8 characters and at least 1 character and 1 numeric number ';
  // }
  else if (
    !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{4,8}$/i.test(values.password)
  ) {
    errors.password =
      "Must be between 4 to 8 characters and at least 1 character and 1 numeric number"
  }

  if (!email) {
    errors.email = "Required"
  } else if (!isValidEmail(email)) {
    errors.email = "Invalid email address"
  }

  return errors
}

function getQueryParams() {
  let url = window.location.href.split("#")[0]
  let queryString = url.substring(url.indexOf("?") + 1)
  return queryString.split("&").map((q) => q.split("="))
}

function BTAccountSuccess({ btc, ether, hideLogin }) {
  const [copier, setCopier] = useState(false)
  const etherAddress = ether ? ether : ""
  const bitcoinAddress = btc ? btc : ""

  const downloadBitcoin = () => {
    const element = document.createElement("a")
    const file = new Blob([bitcoinAddress], {
      type: "text/plain;charset=utf-8",
    })
    element.href = URL.createObjectURL(file)
    element.download = "Bitcoin_privatekey.txt"
    document.body.appendChild(element)
    element.click()
  }

  const downloadEther = () => {
    const element = document.createElement("a")
    const file = new Blob([etherAddress], { type: "text/plain;charset=utf-8" })
    element.href = URL.createObjectURL(file)
    element.download = "Ethereum_privatekey.txt"
    document.body.appendChild(element)
    element.click()
  }

  return (
    <div className='bg-white rounded-t-xl  w-full md:w-90 xl:w-90 2xl:w-70 md:border-t-1  items-center justify-center md:mx-auto '>
      <div className='py-6 px-3 md:px-0 lg:px-0 xl:px-0 lg:w-70 sm:w-full md:w-90 xl:w-70 items-center justify-center md:mx-auto  '>
        <div className='mx-auto p-4  mt-12 bg-white  border-1  border-gray-400 rounded-2xl'>
          <div className='px-6 py-4'>
            <p className='text-title text-md font-medium font-gibson'>Ether</p>

            <div className=' mt-2 bg-white shadow border-1 flex rounded-l-lg  rounded-r-0 w-full flex  flex-row'>
              <div className='text-gradians md:text-base text-sm px-6  font-bold py-2 word-break justify-self-start break-all '>
                {" "}
                {etherAddress}{" "}
              </div>
              <div
                onClick={downloadEther}
                className='ml-auto   flex  items-center px-3 bg-site-theme outline-none focus:outline-none shadow focus:shadow-xl hover:shadow cursor-pointer '
              >
                <DownloadIcon />
              </div>
              <CopyToClipboard
                text={etherAddress}
                onCopy={() => setCopier(true)}
              >
                <button
                  onClick={() => toast.success("Copied", "bottomLeft", 1000)}
                  className='flex items-center px-3 bg-site-theme outline-none focus:outline-none shadow focus:shadow-xl '
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    height='24px'
                    viewBox='0 0 24 24'
                    width='24px'
                    fill='#000000'
                  >
                    <path d='M0 0h24v24H0z' fill='none' />
                    <path d='M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z' />
                  </svg>
                </button>
              </CopyToClipboard>
            </div>

            <p className='pt-6 text-title text-md font-medium font-gibson'>
              Bitcoin
            </p>

            <div className=' mt-2 bg-white shadow border-1 flex rounded-l-lg  rounded-r-0 w-full flex  flex-row'>
              <div className='text-gradians md:text-base text-sm px-6  font-bold py-2 word-break justify-self-start break-all'>
                {" "}
                {bitcoinAddress}{" "}
              </div>
              <div
                onClick={downloadBitcoin}
                className='ml-auto   flex  items-center px-3 bg-site-theme outline-none focus:outline-none shadow focus:shadow-xl hover:shadow cursor-pointer '
              >
                <DownloadIcon />
              </div>
              <CopyToClipboard
                text={bitcoinAddress}
                onCopy={() => setCopier(true)}
              >
                <button
                  onClick={() => toast.success("Copied", "bottomLeft", 1000)}
                  className='flex items-center px-3 bg-site-theme outline-none focus:outline-none shadow focus:shadow-xl '
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    height='24px'
                    viewBox='0 0 24 24'
                    width='24px'
                    fill='#000000'
                  >
                    <path d='M0 0h24v24H0z' fill='none' />
                    <path d='M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z' />
                  </svg>
                </button>
              </CopyToClipboard>
            </div>

            <p className='pt-6 text-red-600 text-center text-base'>
              This is an only one time ,you will be seeing the private key.
              <br />
              Copy and save the key. <br />
              A verification email has been sent to your email address. <br />
              Account will be created after the verification completed.
            </p>

            {!hideLogin && (
              <div className='mt-4  flex justify-center'>
                <div>
                  <span className='text-base pr-2  '>
                    Already have account?
                  </span>{" "}
                  <Link
                    className='text-site-theme hover:underline hover:text-red-400'
                    to='/signin'
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BTAccountSuccess
