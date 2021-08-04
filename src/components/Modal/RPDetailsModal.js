import React, { useEffect, useState } from "react";
import { func } from "prop-types";
import Modal from "react-modal";
import { getReadableTime } from "../../utils/times";
import Pagination from "react-js-pagination";
import Cookies from "js-cookie";
import { BASE_URL } from "../../constants";
import Swal from "sweetalert2";
import UserManager from "../../libs/UserManager";
import CustomLoader from "../CustomLoader/CustomLoader";

const customStyles = {
  content: {
    backgroundColor: "#ffffff",
    boxShadow: "0 0 0 50vmax rgba(0,0,0,.5)",
  },
};
export default function RPDetailsModal(props) {
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [totalUser, setTotalUser] = useState(props.totalUser);
  const [pageChanged, setPageChanged] = useState(false);
  const [triggeredUsers, setUserDetailsForAll] = useState([]);
  const userInfo = UserManager.getLoggedInUser();

  // console.log(props.id, "id");
  useEffect(() => {
    if (props.type === "single" && props.id) {
      GPDetailsForOneApi(props.id); //.then(() => console.log(""))
    }
    if (props.type === "all" && props.id) {
      GPDetailsForAllApi(props.id); //.then(() => console.log(""))
    }
  }, [activePage, props.id, props.type]);

  const GPDetailsForAllApi = async (id) => {
    if (userInfo && Cookies.get("access-token")) {
      setLoading(true);
      const myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        "Bearer " + Cookies.get("access-token")
      );

      const data = await fetch(
        `${BASE_URL}/gold-point/trigger/fetch-trigger/${id}?page=${activePage}&limit=10`,
        {
          method: "GET",
          headers: myHeaders,
        }
      );
      const response = await data.json();
      // console.log(response, "res");

      if (response && response.code === 404) {
        setLoading(false);
        Swal.fire("Whoops..", response.message, "error");
      } else if (response) {
        setLoading(false);
        if (response.code === 401) history.push("/signin");
        else if (response.code === 404)
          Swal.fire("Whoops..", "No user data found", "error");
        else {
          setUserDetailsForAll(response.trigger);
        }
      } else Swal.fire("Whoops..", "No  data found", "error");
    }
  };
  const GPDetailsForOneApi = async (id) => {
    if (userInfo && Cookies.get("access-token")) {
      setLoading(true);
      const myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        "Bearer " + Cookies.get("access-token")
      );

      const data = await fetch(
        `${BASE_URL}/gold-point/trigger/fetch-trigger-single/${id}?page=${activePage}&limit=10`,
        {
          method: "GET",
          headers: myHeaders,
        }
      );
      const response = await data.json();
      // console.log(response, "res");

      if (response && response.code === 404) {
        setLoading(false);
        Swal.fire("Whoops..", response.message, "error");
      } else if (response) {
        setLoading(false);
        if (response.code === 401) history.push("/signin");
        else if (response.code === 404)
          Swal.fire("Whoops..", "No user data found", "error");
        else {
          setUserDetailsForAll(response.trigger);
          setTotalUser(response.totalResults);
          // console.log(response, "are");
        }
      } else Swal.fire("Whoops..", "No  data found", "error");
    }
  };

  function handleModalCallback() {
    props.onClose && props.onClose();
  }

  function handlePageChange(pageNumber) {
    setActivePage(pageNumber);
    setPageChanged(!pageChanged);
  }

  return (
    <Modal
      isOpen={true}
      contentLabel="onRequestClose Example"
      onRequestClose={handleModalCallback}
      shouldCloseOnOverlayClick={false}
      style={customStyles}
    >
      <div className="">
        {loading && <CustomLoader />}

        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
          <h3 className="text-2xl font-semibold text-site-theme ">
            Trigger Details
          </h3>
          <div
            className="px-6 py-2 ml-auto cursor-pointer "
            onClick={handleModalCallback}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 0 24 24"
              width="24"
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
          </div>
        </div>

        <div className="my-6 w-full">
          <div className="bg-white shadow px-4 md:px-10 pt-4 md:pt-7 pb-5 overflow-auto">
            <table className="w-full whitespace-nowrap ">
              <thead>
                <tr className="bg-site-theme  text-white font-bold h-16 w-full text-sm leading-none border">
                  <th className=" text-left pl-4">Full Name</th>
                  <th className=" l text-left pl-4">Nick Name</th>
                  <th className=" text-left pl-4">Email</th>
                  <th className=" text-left pl-4">GP Before Trigger</th>
                  <th className=" text-left pl-4">Received GP Amount</th>

                  <th className=" text-left pl-4">GP After Trigger</th>

                  <th className=" text-left pl-4">Created At</th>
                  <th className=" text-left pl-4">Updated At</th>
                </tr>
              </thead>

              {triggeredUsers && triggeredUsers.length ? (
                triggeredUsers.map((result) => (
                  <tbody className="w-full">
                    <tr className="h-20 text-sm leading-none text-gray-800 bg-white hover:bg-gray-100 border-b border-t border-gray-300 shadow ">
                      <td className="pl-4">
                        <p className="text-sm font-medium leading-none text-gray-800 break-all  ">
                          {result.user && result.user.fullName}
                        </p>
                      </td>

                      <td className="pl-4">
                        <p className="text-xs leading-3 text-gray-600 mt-2 break-all">
                          {result.user && result.user.nickName}
                        </p>
                      </td>

                      <td className="pl-4">
                        <p className="text-xs leading-3 text-gray-600 mt-2 break-all">
                          {result.user && result.user.email}
                        </p>
                      </td>
                      <td className="pl-4">
                        <p className="text-xs leading-3 text-gray-600 mt-2 break-all">
                          {result.goldPointBeforeTrigger}
                        </p>
                      </td>

                      <td className="pl-4">
                        <p className="text-xs leading-3 text-gray-600 mt-2 break-all">
                          {result.receivedGoldPointAmount}
                        </p>
                      </td>

                      <td className="pl-4">
                        <p className="text-xs leading-3 text-gray-600 mt-2 break-all">
                          {result.goldPointAfterTrigger}{" "}
                        </p>
                      </td>

                      <td className="pl-4">
                        <p className="text-xs leading-3 text-gray-600 mt-2 break-all">
                          {result.createdAt
                            ? getReadableTime(result.createdAt)
                            : ""}{" "}
                        </p>
                      </td>
                      <td className="pl-4">
                        <p className="text-xs leading-3 text-gray-600 mt-2 break-all">
                          {" "}
                          {result.updatedAt
                            ? getReadableTime(result.updatedAt)
                            : ""}{" "}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                ))
              ) : (
                <div />
              )}
            </table>
            <div className="flex justify-end p-2">
              <Pagination
                innerClass="pagination flex flex-row"
                activeLinkClass="text-black"
                linkClass="page-link"
                itemClass="p-2 text-site-theme"
                activePage={activePage}
                itemsCountPerPage={10}
                totalItemsCount={totalUser}
                pageRangeDisplayed={6}
                onChange={handlePageChange}
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleModalCallback}
          className="mb-40 mt-12 flex items-center flex-cols mx-auto rounded text-center px-12 py-3 bg-site-theme text-white shadow hover:shadow-xl text-base font-bold"
        >
          {" "}
          Close{" "}
        </button>
      </div>
    </Modal>
  );
}
