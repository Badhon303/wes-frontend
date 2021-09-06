import React, { useEffect, useState } from "react"
import Layout from "../../components/Layout/Layout"
import Cookies from "js-cookie"
import { BASE_URL, PHOTO_URL } from "../../constants"
import UserManager from "../../libs/UserManager"
import { useHistory } from "react-router-dom"
import AvatarLogo from "../../image/avatar.png"
import ViewUserInfoModal from "../../components/Modal/ViewUserModal"
import Swal from "sweetalert2"
import Pagination from "react-js-pagination"
import Loader from "react-loader-spinner"
import ReactDataTable from "@ashvin27/react-datatable"
import * as FetchApi from "../../libs/FetchApi"
import UserCreateModal from "../../components/Modal/UserCreateModal"
import BTAccountSuccess from "../auth/btAccountSuccess"
import Modal from "react-modal"

export default function PendingUsers() {
  const userInfo = UserManager.getLoggedInUser()
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState()
  const [openUserInfoModal, setOpenUserInfoModal] = useState(false)
  const [activePage, setActivePage] = useState(1)
  const [pageChanged, setPageChanged] = useState(false) // better way?
  const [totalUser, setTotalUser] = useState(0)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState(null)
  const [searchType, setSearchType] = useState("email")
  const [openCreateUserModal, setOpenCreateUserModal] = useState(false)
  const [btc, setBtc] = useState(null)
  const [ether, setEther] = useState(null)

  let history = useHistory()

  useEffect(() => {
    if (userInfo && userInfo.role !== "admin") {
      history.push("/")
      return "<></>"
    }
  }, [])

  const handleSearchApiCall = async () => {
    setLoading(true)
    const myHeaders = new Headers()
    let searchQuery = ""

    if (searchTerm) {
      searchQuery = `${searchType}=${searchTerm}&`
    }

    myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"))
    const data = await fetch(
      `${BASE_URL}/users/${userInfo.id}/pending-users?${searchQuery}page=${activePage}`,
      {
        method: "GET",
        headers: myHeaders,
      }
    )
    const response = await data.json()

    if (response) {
      setLoading(false)
      if (response.code === 401) history.push("/signin")
      else if (response.code === 404)
        console.log("Whoops..", "No user data found", "error")
      else {
        setUsers(response.data.results)
        setTotalUser(response.data.totalResults)
        setActivePage(response.data.page)
      }
    } else console.log("Whoops..", "No user data found", "error")
  }

  const getUsersApi = async (id) => {
    setLoading(true)
    const myHeaders = new Headers()
    let searchQuery = ""

    if (id === 1 && searchTerm) {
      searchQuery = `${searchType}=${searchTerm}`
    }

    myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"))

    const data = await fetch(
      `${BASE_URL}/users?approvalStatus=approved&role=user&page=${activePage}&sortBy=createdAt:desc`,
      {
        method: "GET",
        headers: myHeaders,
      }
    )
    const response = await data.json()

    if (response) {
      setLoading(false)
      if (response.code === 401) history.push("/signin")
      else if (response.code === 404)
        console.log("Whoops..", "No user data found", "error")
      else {
        setUsers(response.results)
        setTotalUser(response.totalResults)
      }
    } else console.log("Whoops..", "No user data found", "error")
  }

  useEffect(() => {
    if (!searchTerm) {
      getUsersApi()
    }
  }, [pageChanged, searchTerm])

  // console.log(users);

  const approveUser = async (id, status = true) => {
    setLoading(true)
    const myHeaders = new Headers()

    // let formData = approvalStatus=true
    myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"))
    myHeaders.append("Content-Type", "application/json")

    const data = await fetch(`${BASE_URL}/users/${id}/change-approval-status`, {
      method: "PUT",
      body: JSON.stringify({
        approvalStatus: status === true ? "approved" : "rejected",
      }),
      headers: myHeaders,
    })
    const response = await data.json()

    if (response) {
      // console.log(response.approved, status,'adffasfdfj')
      setLoading(false)
      if (response.code === 401) history.push("/signin")
      else if (response.approved === "approved" && status === true) {
        Swal.fire("Approved", "User has been approved", "success")
        getUsersApi(1)
      } else if (status === false && response.approved === "rejected") {
        Swal.fire("Rejected", "User has been rejected", "info")
        getUsersApi(1)
      }

      if (response.code === 404)
        console.log("Whoops..", "No user data found", "error")
      else getUsersApi(1)
    } else console.log("Whoops..", "No user data found", "error")
  }

  function handleViewPendingUser(user) {
    setSelectedUser(user)

    setOpenUserInfoModal(true)
  }

  function onUserInfoModalClose() {
    setSelectedUser(null)
    setOpenUserInfoModal(false)
  }

  function handlePageChange(pageNumber) {
    setActivePage(pageNumber)
    setPageChanged(!pageChanged)
  }

  function handleSearchType(e) {
    setSearchType(e.target.value)
    // console.log(e.target.value,"search type");
  }

  function handleSearch(e) {
    if (e.target.value) {
      setSearchTerm(e.target.value)
    } else {
      setSearchTerm("")
    }
  }

  function handleDelete(userId) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff8c00",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // setLoading(true)

        deleteUser(userId)
      }
    })
  }

  function deleteUser(userId) {
    setLoading(true)
    FetchApi.sendDeleteRequest(`/users/${userId}`, {}, { credential: true })
      .then((res) => {
        if (res.ok) {
          // success
          Swal.fire("User delete", "", "success")
          getUsersApi(1)
        } else {
          // handle err
          Swal.fire("Error", res.data.message, "error")
        }
      })
      .catch((err) => {
        // something unwanted happened
        Swal.fire("Error", err.message, "error")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  function transformRecord(obj) {
    let fullName = ""
    if (obj.user.lastName) fullName = obj.user.lastName + " "
    if (obj.user.firstName) fullName = fullName + obj.user.firstName + " "
    if (obj.user.middleName) fullName = fullName + obj.user.middleName + " "

    return {
      record: obj,
      fullName: fullName,
      nickName: obj.user.nickName,
      introducerName:
        obj.introducer && obj.introducer.nickName && obj.introducer.email
          ? obj.introducer.email + "(" + obj.introducer.nickName + ")"
          : "",
      introducerId: obj.introducer ? obj.introducer.id : null,
      email: obj.user.email,
      avatar:
        obj.user.photo && obj.user.photo !== "no-photo.jpg"
          ? PHOTO_URL + obj.user.photo
          : AvatarLogo,
      approvalStatus: obj.user.approvalStatus,
      activeStatus: obj.user.userStatus,
      btcAddress: obj.btcAccount ? obj.btcAccount.address : "",
      ethAddress: obj.ethAccount ? obj.ethAccount.address : "",
    }
  }

  function showUserCreateModal() {
    setOpenCreateUserModal(true)
  }

  function handleCreateNewUser(response) {
    setOpenCreateUserModal(false)
    setBtc(response.data.data.btcAccount.privateKey.bn)
    setEther(response.data.data.ethAccount.privateKey)
  }

  function handleCreaeAccountReset() {
    setBtc(null)
    setEther(null)
  }

  if (loading) {
    return (
      <div className='flex h-screen justify-center  md:mt-32 mt-24  items-center'>
        <Loader
          type='Circles'
          color='#ff8c00'
          height={100}
          width={100}
          timeout={7000} //3 secs
          className=' inline-block align-middle absolute z-50'
        />
      </div>
    )
  }

  return (
    <Layout>
      <div className='overflow-x-auto'>
        <div className='min-w-screen min-h-screen bg-gray-100 font-sans overflow-hidden'>
          <div className='w-full px-8'>
            {loading ? (
              <div className='flex justify-center  md:mt-32 mt-24  items-center'>
                <Loader
                  type='Circles'
                  color='#ff8c00'
                  height={100}
                  width={100}
                  timeout={7000} //3 secs
                  className=' inline-block align-middle absolute z-50'
                />
              </div>
            ) : (
              <div>
                <button
                  onClick={showUserCreateModal}
                  className=' mt-3 px-4 md:h-auto h-0 bg-site-theme py-3 shadow text-white hover:shadow-2xl'
                  type='button'
                >
                  Create New User
                </button>
                <div className='bg-white shadow-md rounded my-6'>
                  <ReactDataTable
                    config={{
                      page_size: 10,
                      show_length_menu: false,
                      show_filter: true,

                      className: " px-4 py-6",
                      show_pagination: false,
                    }}
                    className='px-2  w-full h-full py-2  my-4 overflow-auto border-1 group break-words '
                    tHeadClassName=' border-1  mx-4 text-black bg-gray-100 break-word  '
                    records={users.map(transformRecord)}
                    columns={[
                      {
                        key: "fullName",
                        text: "Name",
                        className:
                          "text-black bg-white text-left px-2 w-40 break-words",
                        align: "center",
                        sortable: true,
                        TrOnlyClassName: "text-black",
                      },
                      {
                        key: "nickName",
                        text: "Nick Name",
                        className: " text-left px-2 w-24 break-words",
                        align: "center",
                        sortable: true,
                      },
                      {
                        className:
                          "text-black bg-white text-left px-2 w-40 break-words",
                        key: "introducerName",
                        text: "Introducer",
                        align: "center",
                        sortable: true,
                        cell: (obj) => {
                          return (
                            <div
                              onClick={() =>
                                handleViewPendingUser(obj.introducerId)
                              }
                              className='cursor-pointer text-left px-2 text-gray-600 w-40 hover:text-site-theme hover:underline '
                            >
                              {obj.introducerName}
                            </div>
                          )
                        },
                      },
                      {
                        key: "email",
                        text: "Email",
                        align: "center",
                        sortable: true,
                        className: " text-left px-2 break-words",
                      },
                      {
                        key: "profile",
                        text: "Profile",
                        className: " text-left px-2 w-24 break-words",
                        align: "center",
                        sortable: true,
                        cell: (obj) => {
                          return (
                            <div className='flex align-center justify-center'>
                              <div className='mr-2'>
                                <img
                                  alt='profile'
                                  className='w-12 h-12 rounded-full'
                                  src={
                                    obj.avatar !== "no-photo.jpg"
                                      ? obj.avatar
                                      : AvatarLogo
                                  }
                                />
                              </div>
                            </div>
                          )
                        },
                      },
                      {
                        key: "approvalStatus",
                        text: "Status",
                        className: " text-center px-2 w-24 break-words",
                        align: "center",

                        sortable: true,
                        cell: (obj) => {
                          return (
                            <span
                              className={
                                (obj.approvalStatus &&
                                obj.approvalStatus === "approved"
                                  ? "bg-green-600"
                                  : obj.approvalStatus &&
                                    obj.approvalStatus === "rejected"
                                  ? "bg-red-600"
                                  : "bg-yellow-600") +
                                " text-white font-bold py-1 px-3 rounded-full text-xs"
                              }
                            >
                              {obj.approvalStatus &&
                                obj.approvalStatus.charAt(0).toUpperCase() +
                                  obj.approvalStatus.slice(1)}
                            </span>
                          )
                        },
                      },
                      {
                        key: "ethAddress",
                        text: "ETH Address",
                        align: "center",
                        sortable: true,
                        className:
                          "text-gray-500 font-gibson text-base py-1 px-3 break-all ",
                      },
                      {
                        key: "btcAddress",
                        text: "BTC Address",
                        align: "center",
                        sortable: true,
                        className:
                          "text-gray-500 font-gibson text-base py-1 px-3 break-all",
                      },
                      {
                        key: "action",
                        text: "Actions",
                        sortable: true,
                        cell: (obj) => {
                          return (
                            <div className='flex item-center justify-center break-words'>
                              <div
                                onClick={() =>
                                  handleViewPendingUser(obj.record.user.id)
                                }
                                className='w-6  cursor-pointer  mr-2 transform hover:text-purple-500 hover:scale-110'
                              >
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  fill='none'
                                  viewBox='0 0 24 24'
                                  stroke='currentColor'
                                >
                                  <path
                                    stroke-linecap='round'
                                    stroke-linejoin='round'
                                    stroke-width='2'
                                    d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                                  />
                                  <path
                                    stroke-linecap='round'
                                    stroke-linejoin='round'
                                    stroke-width='2'
                                    d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                                  />
                                </svg>
                              </div>
                              <div /* Edit */
                                onClick={() => {
                                  history.push(
                                    `/user/${obj.record.user.id}/edit`
                                  )
                                }}
                                className='w-6  cursor-pointer  mr-2 transform hover:text-purple-500 hover:scale-110'
                              >
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  fill='none'
                                  viewBox='0 0 24 24'
                                  stroke='currentColor'
                                >
                                  <path
                                    stroke-linecap='round'
                                    stroke-linejoin='round'
                                    stroke-width='2'
                                    d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
                                  />
                                </svg>
                              </div>
                              <div
                                onClick={() => handleDelete(obj.record.user.id)}
                                className='w-6  cursor-pointer mr-2 transform hover:text-purple-500 hover:scale-110'
                              >
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  fill='none'
                                  viewBox='0 0 24 24'
                                  stroke='currentColor'
                                >
                                  <path
                                    stroke-linecap='round'
                                    stroke-linejoin='round'
                                    stroke-width='2'
                                    d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                                  />
                                </svg>
                              </div>
                            </div>
                          )
                        },
                      },
                    ]}
                  />
                  <div className='flex justify-end p-2'>
                    <Pagination
                      innerClass='pagination flex flex-row'
                      activeLinkClass='text-black'
                      linkClass='page-link'
                      itemClass='p-2 text-site-theme'
                      activePage={activePage}
                      itemsCountPerPage={10}
                      totalItemsCount={totalUser}
                      pageRangeDisplayed={5}
                      onChange={handlePageChange}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {openUserInfoModal && (
        <ViewUserInfoModal
          user={selectedUser}
          hideButton={true}
          onClose={onUserInfoModalClose}
          handleAccept={(userId) => {
            approveUser(userId, true)
            onUserInfoModalClose()
          }}
          handleReject={(userId) => {
            approveUser(userId, false)
            onUserInfoModalClose()
          }}
        />
      )}

      {openCreateUserModal && (
        <UserCreateModal
          showModal={openCreateUserModal}
          edit='true'
          hideButton={true}
          modalShow={() => setOpenCreateUserModal(false)}
          onClose={handleCreateNewUser}
        />
      )}

      {btc && ether && (
        <Modal
          isOpen={true}
          contentLabel='onRequestClose Example'
          onRequestClose={handleCreaeAccountReset}
          shouldCloseOnOverlayClick={false}
        >
          <div className='container w-full '>
            <div className='flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t'>
              <h3 className='text-2xl font-semibold'>Account Private Keys</h3>
              <div
                className='px-6 py-2 ml-auto cursor-pointer '
                onClick={handleCreaeAccountReset}
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

            <BTAccountSuccess btc={btc} ether={ether} hideLogin={true} />
          </div>
        </Modal>
      )}
    </Layout>
  )
}
