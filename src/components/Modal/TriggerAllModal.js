import React, { useState } from "react"
import { func } from "prop-types"
import Modal from "react-modal"
import CancelButton from "../Button/cancelButton"
import DropDownMenuWithIcon from "../Dropdown/DropDownWithMenu"
import Warning from "../Message/warning"
import { useFormik } from "formik"
import Datetime from "react-datetime"
import moment from "moment"
import * as PurchaseAPI from "../../apis/purchase"
import Swal from "sweetalert2"
import CustomLoader from "../CustomLoader/CustomLoader"
import { useHistory } from "react-router-dom"
import { customStylesModal } from "../../utils/styleFunctions"

const parseDate = (prasedDate) => {
  prasedDate = prasedDate.split("T")
  let year = prasedDate[0].split("-")[0]
  const month = prasedDate[0].split("-")[1]
  const day = prasedDate[0].split("-")[2]
  const hour = prasedDate[1].split(":")[0]
  const minute = prasedDate[1].split(":")[1]
  year = year.substring(1)
  const completeDate = `${day}/${month}/${year} ${hour}:${minute}`
  return completeDate
}

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 1,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
}
const TYPE_EAGLE = "EAGLE"
const TYPE_SNOW = "SNOW"

export default function TriggerAllModal(props) {
  let history = useHistory()
  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      type: "all",
      token: "",
      scheduleDate: new Date(),
      goldPoint: "",
    },
    validateOnChange: true,
    validate: async (values) => {
      const errors = {}
      const { token, scheduleDate, goldPoint } = values

      if (!token && !token.length) {
        errors.token = "Token must be provided"
      }

      if (!scheduleDate && !scheduleDate.length) {
        errors.dob = "Required"
      } else {
        const selectedDate = new Date(scheduleDate)
        const todaysdate = new Date()
        if (!(selectedDate.getTime() > todaysdate.getTime())) {
          errors.scheduleDate = "Time must be greater then present time"
        }
      }

      if (!goldPoint && !goldPoint.length) {
        errors.goldPoint = "Gold point must be provided"
      } else if (Math.sign(goldPoint) === 1 && goldPoint > props.goldPoint)
        errors.goldPoint = "Gold point must be less than your total gold point"

      return errors
    },

    onSubmit: (values) => {
      let parsedDate = JSON.stringify(values.scheduleDate)
      values.scheduleDate = parseDate(parsedDate)
      setLoading(true)
      PurchaseAPI.triggerForAllApi(values)
        .then((res) => {
          // console.log(res);
          setLoading(false)

          if (
            res &&
            res.data &&
            (res.data.code === 406 || res.data.code === 400)
          ) {
            Swal.fire("Error", res.data.message, "error")
          } else {
            formik.resetForm()
            Swal.fire({
              icon: "success",
              title: `Trigger Completer for schedule date,Tx Id: ${res.data.trigger.id}`,
              showDenyButton: false,
              showCancelButton: false,
              confirmButtonText: `Okay`,
            }).then((result) => {
              /* Read more about isConfirmed, isDenied below */
              if (result.isConfirmed) {
                props.reloadData()
                handleModalCallback()
                history.push("/trigger-gold-points")
              }
            })
          }
        })
        .catch((err) => {
          setLoading(false)
          Swal.fire("Error", err.message, "error")
        })
    },
  })

  function handleModalCallback() {
    props.onClose && props.onClose()
  }

  function handleCreate() {}
  function updateSelectValue(value) {
    formik.values.token = value.value
  }

  function handleDate(date) {
    let time = moment(date)

    formik.values.scheduleDate = time
  }

  function validateDate(currentDate, selectedDate) {
    let yesterday = moment().subtract(1, "day")
    return currentDate.isAfter(yesterday)
  }

  return (
    <Modal
      isOpen={true}
      contentLabel='onRequestClose Example'
      onRequestClose={handleModalCallback}
      shouldCloseOnOverlayClick={false}
      style={customStylesModal}
    >
      <div className=' '>
        <div className='flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t'>
          <h3 className='text-2xl font-semibold text-site-theme '>
            Add Trigger for GP Share to All Users
          </h3>
          <div
            className='px-6 py-2 ml-auto cursor-pointer '
            onClick={handleModalCallback}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='24'
              viewBox='0 0 24 24'
              width='24'
            >
              <path d='M0 0h24v24H0V0z' fill='none' />
              <path d='M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z' />
            </svg>
          </div>
        </div>

        <div className='overflow h-auto px-6'>
          <form onSubmit={formik.handleSubmit}>
            <div className=' '>
              <div className='py-6 '>
                <p className=' font-title  text-left  text-base md:text-base '>
                  Token :
                </p>

                <div className='mt-2  w-48 md:w-64'>
                  <DropDownMenuWithIcon
                    className={"w-64 text-gray-800"}
                    options={[
                      {
                        label: "EAGLE",
                        value: TYPE_EAGLE,
                      },
                      {
                        label: "SNOW",
                        value: TYPE_SNOW,
                      },
                    ]}
                    selectCallback={updateSelectValue}
                    placeholder={"Select Token"}
                  />
                </div>
              </div>
              {formik.touched.token && formik.errors.token && (
                <Warning message={formik.errors.token} />
              )}

              <div className='my-1'>
                <p className=' font-title  text-left  text-base md:text-base '>
                  Execution Date
                </p>

                <div className=' mt-2 w-48 md:w-64'>
                  <Datetime
                    className='border-1 h-10 p-2'
                    initialValue={formik.values.scheduleDate}
                    onChange={handleDate}
                    utc={true}
                    timeFormat='HH:mm'
                    isValidDate={validateDate}
                  />
                </div>
                {formik.touched.scheduleDate && formik.errors.scheduleDate && (
                  <Warning message={formik.errors.scheduleDate} />
                )}
              </div>

              <div className='mt-6'>
                <p className=' font-title  text-left  text-base md:text-base '>
                  Gold point
                </p>

                <div className=' mt-2 w-48 md:w-64'>
                  <input
                    type='text'
                    onChange={formik.handleChange}
                    value={formik.values.goldPoint}
                    className='border-2 py-2 w-full text-sm text-black bg-white rounded-md pl-16 focus:outline-none focus:bg-white focus:text-gray-900'
                    name='goldPoint'
                    id='goldPoint'
                    aria-describedby='goldPoint'
                    placeholder='Gold Point'
                    autoComplete='off'
                  />
                </div>
                {formik.touched.goldPoint && formik.errors.goldPoint && (
                  <Warning message={formik.errors.goldPoint} />
                )}
              </div>
            </div>
            <div className='  md:flex items-center  mb-40 mt-12 lg:mx-16'>
              <CancelButton onClick={handleModalCallback} title='Cancel' />

              <button
                type='submit'
                className='w-full  sm:w-auto inline-flex justify-center
                            text-white border-1 border-branding-text-color text-xl
                            rounded py-1.5 px-12 bg-site-theme focus:outline-none hover:shadow-lg mr-6'
              >
                Create
              </button>
            </div>
          </form>
        </div>

        {loading === true && (
          <p className='p-2 text-center'>
            <CustomLoader />
          </p>
        )}
      </div>
    </Modal>
  )
}
