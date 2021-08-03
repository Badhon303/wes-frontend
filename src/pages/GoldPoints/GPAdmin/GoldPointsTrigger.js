import React, { useEffect, useState } from "react";
import UserManager from "../../../libs/UserManager";
import { isLoggedIn } from "../../../libs/AuthManager";
import { useHistory } from "react-router-dom";
import CustomLoader from "../../../components/CustomLoader/CustomLoader";
import Cookies from "js-cookie";
import { BASE_URL } from "../../../constants";
import Swal from "sweetalert2";
import Pagination from "react-js-pagination";
import GeneralButton from "../../../components/Button/generalButton";
import TriggerAllModal from "../../../components/Modal/TriggerAllModal";
import TriggerOneModal from "../../../components/Modal/TriggerAllOne";
import DropDownMenuWithIcon from "../../../components/Dropdown/DropDownWithMenu";
import RPDetailsModal from "../../../components/Modal/RPDetailsModal";

export default function GoldPointsTrigger() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [triggerAll, setTriggerAll] = useState(false);
  const [triggerOne, setTriggerOne] = useState(false);
  const userInfo = UserManager.getLoggedInUser();
  const isUserLoggedIn = isLoggedIn();
  const [activePage, setActivePage] = useState(1);
  const [totalUser, setTotalUser] = useState(0);
  const [pageChanged, setPageChanged] = useState(false);
  const [orderDetailsModal, setOrderDetailsModal] = useState(false);
  const [userType, setUserType] = useState("all");
  const [triggeredUsers, setTriggeredUsers] = useState([]);
  const [triggeredUsersAll, setTriggeredUsersAll] = useState([]);
  const [goldPoint, setGoldPoint] = useState(null);
  const [detailsId, setDetailsId] = useState(null);
  const [totalUserOfDetailsId, setTotalUserOfDetailsId] = useState(0);

  if (!isUserLoggedIn) {
    history.push("/signin");
  }

  useEffect(() => {
    getTriggerApi();
  }, []);

  useEffect(() => {
    getTriggerApi();
  }, [activePage, userType]);

  useEffect(() => {
    let point = getGoldPointApi();
  }, []);

  const getGoldPointApi = async () => {
    if (userInfo && Cookies.get("access-token")) {
      const myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        "Bearer " + Cookies.get("access-token")
      );

      const data = await fetch(`${BASE_URL}/gold-point/total-gp`, {
        method: "GET",
        headers: myHeaders,
      });
      const response = await data.json();
      //   console.log(response);

      if (response) {
        if (response.code === 401) history.push("/signin");
        else if (response.code === 404)
          Swal.fire("Whoops..", "No  data found", "error");
        else {
          setGoldPoint(response.totalGP);
        }
      } else Swal.fire("Whoops..", "No data found", "error");
    }
  };

  function handlePageChange(pageNumber) {
    setActivePage(pageNumber);
    setPageChanged(!pageChanged);
  }

  const getTriggerApi = async () => {
    if (userInfo && Cookies.get("access-token")) {
      setLoading(true);
      const myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        "Bearer " + Cookies.get("access-token")
      );

      const data = await fetch(
        `${BASE_URL}/gold-point/trigger/history-${userType}?page=${activePage}&limit=10&sortBy=-createdAt`,
        {
          method: "GET",
          headers: myHeaders,
        }
      );
      const response = await data.json();
      console.log(response, "res");

      if (response && response.code === 404) {
        setLoading(false);
        Swal.fire("Whoops..", response.message, "error");
      } else if (response) {
        setLoading(false);
        if (response.code === 401) history.push("/signin");
        else if (response.code === 404)
          Swal.fire("Whoops..", "No user data found", "error");
        else {
          if (userType === "single") setTriggeredUsers(response.results);
          if (userType === "all") setTriggeredUsersAll(response.results);
          setTotalUser(response.totalResults);
        }
      } else Swal.fire("Whoops..", "No  data found", "error");
    }
  };

  function orderDetailsModalClose() {
    setOrderDetailsModal(!orderDetailsModal);
    setDetailsId(null);
    setTotalUserOfDetailsId(0);
  }

  function handleOrderDetails(id, usersNumber, status, type) {
    if (status === "success" && type === "all") {
      setDetailsId(id);
      setTotalUserOfDetailsId(usersNumber);
      setOrderDetailsModal(!orderDetailsModal);
    } else if (status === "success" && type === "single") {
      setDetailsId(id);
      setTotalUserOfDetailsId(usersNumber);
      setOrderDetailsModal(!orderDetailsModal);
    }
  }

  function handleTriggerAll() {
    setTriggerAll(!triggerAll);
  }

  function handleTriggerOne() {
    setTriggerOne(!triggerOne);
  }

  function updateSelectValue(value) {
    setUserType(value.value);
  }

  const deleteUserApi = async (id) => {
    if (userInfo && Cookies.get("access-token")) {
      setLoading(true);

      const myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        "Bearer " + Cookies.get("access-token")
      );

      const data = await fetch(`${BASE_URL}/gold-point/trigger/${id}`, {
        method: "delete",
        headers: myHeaders,
      });
      const response = await data.json();

      if (response) {
        setLoading(false);

        if (response.code === 401) history.push("/signin");
        else if (response.code === 404)
          Swal.fire("Whoops..", "No  data found", "error");
        else {
          Swal.fire("Delete Succeed.", "Trigger Delete Succeed", "success");

          getTriggerApi();
          return true;
        }
      } else Swal.fire("Whoops..", "No data found", "error");
    }
  };

  function handleDelteTrigger(id) {
    Swal.fire({
      title: "Delete Trigger?",
      text: "Confirm to delete this trigger",
      confirmButtonColor: "#ff8c00",
      confirmButtonText: "Confirm",
      showCancelButton: true,
      cancelButtonText: "Cancel",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let abc = deleteUserApi(id);
      } else if (result.isDenied) {
      }
    });
  }

  return (
    <div>
      <main className="flex justify-center ">
        {loading && <CustomLoader />}
        <div className="w-full bg-white p-2 md:p-2">
          <div className=" w-full px-2 md:px-8 py-2 md:py-2">
            <p className="text-xl font-semibold py-4 ">Actions:</p>
            <div className="mt-2 mb-6 flex ">
              <GeneralButton title="Add Trigger" onClick={handleTriggerAll} />

              <GeneralButton title="Insert" onClick={handleTriggerOne} />
            </div>
            <div className="py-6 ">
              <p className=" font-title  text-left  text-base md:text-base ">
                User Type
              </p>

              <div className="mt-2  w-48 md:w-64">
                <DropDownMenuWithIcon
                  defaultValue="All Users"
                  className={"w-64 text-gray-800"}
                  options={[
                    {
                      label: "All Users",
                      value: "all",
                    },
                    {
                      label: "Single",
                      value: "single",
                    },
                  ]}
                  selectCallback={updateSelectValue}
                  placeholder={"Select User Type"}
                />
              </div>
            </div>
            {userType === "all" ? (
              <div>
                <div className="bg-white  w-full my-2 border-1 block shadow ">
                  <div className="bg-site-theme text-white w-full flex flex-row justify-between px-4 py-4 items-center text-sm md:text-base group overflow-auto">
                    <p
                      className="w-32 text-10px md:text-sm text-white font-semibold
                              "
                    >
                      Trigger Id
                    </p>

                    <p className="w-20  text-10px md:text-sm text-white font-semibold">
                      Token
                    </p>

                    <p className="w-32 text-10px md:text-sm text-white font-semibold">
                      Execution Date
                    </p>

                    <p className="w-24  text-10px md:text-sm text-white font-semibold">
                      GP Per Token
                    </p>

                    <div className="w-24 text-10px md:text-sm text-white font-semibold">
                      Total GP
                    </div>
                    <div className="w-32 text-10px md:text-sm text-white font-semibold">
                      Number of Users
                    </div>

                    <p className="w-30 text-10px md:text-sm text-white font-semibold">
                      Status
                    </p>
                  </div>
                </div>
                {triggeredUsersAll && triggeredUsersAll.length ? (
                  triggeredUsersAll.map((result) => (
                    <div className="bg-white  w-full my-2 border-1 block shadow hover:shadow-xl">
                      <div className="w-full flex justify-between px-4 py-4 items-center text-sm md:text-base group">
                        {result.status === "success" ? (
                          <p
                            className="w-32 break-words group-hover:underline cursor-pointer group-hover:text-site-theme md:font-medium"
                            onClick={() =>
                              handleOrderDetails(
                                result.id,
                                result.numberOfUsers,
                                result.status,
                                "all"
                              )
                            }
                          >
                            {result.id}
                          </p>
                        ) : (
                          <p className=" w-32 break-words md:font-medium">
                            {result.id}
                          </p>
                        )}

                        <p className=" w-20  text-10px md:text-sm text-gray-900 break-all">
                          {result.token}
                        </p>

                        <p className="w-32 text-left text-10px md:text-sm text-gray-900 break-all">
                          {result.executionDate}
                        </p>

                        <p className="w-24 text-10px md:text-sm text-gray-900 break-all ">
                          {result.gpPerToken ? result.gpPerToken : "-"}
                        </p>

                        <p className="w-24 text-10px md:text-sm text-gray-900  break-all ">
                          {result.totalGP ? result.totalGP : "-"}
                        </p>

                        <p className="w-30 text-10px md:text-sm text-gray-900  break-all ">
                          {result.numberOfUsers ? result.numberOfUsers : "-"}
                        </p>

                        {result && result.status === "success" && (
                          <div className="w-30  rounded bg-gray-600 p-1 text-center bg-green-600 px-4 text-white text-10px md:text-base">
                            Successful
                          </div>
                        )}
                        {result && result.status === "failed" && (
                          <div className="w-30  rounded bg-gray-600 p-1 text-center bg-site-theme px-4 text-white text-10px md:text-base">
                            Failed
                          </div>
                        )}
                        {result && result.status === "pending" && (
                          <button
                            onClick={() => handleDelteTrigger(result.id)}
                            className="w-30  hover:shadow-lg focus:outline-none outline-none   rounded bg-red-400 text-white py-1 text-center  px-8 text-10px md:text-base"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div />
                )}
              </div>
            ) : (
              <div />
            )}

            {userType === "single" ? (
              <div>
                <div className="bg-white  w-full my-2 border-1 block shadow ">
                  <div className="bg-site-theme text-white  font-bold flex flex-row justify-between px-4 py-4 items-center text-sm md:text-base group w-full">
                    <p
                      className="w-32 break-words text-10px md:text-sm
                              "
                    >
                      Trigger Id
                    </p>
                    <p className="w-20 text-10px md:text-sm">Full Name</p>
                    <p className="w-20 text-10px md:text-sm ">Nick Name</p>
                    <p className="w-48 text-10px md:text-sm ">Email</p>
                    <div className="w-32 text-10px md:text-sm ">
                      Total Gold Point
                    </div>
                    <p className="w-32 text-10px md:text-sm ">Status</p>
                  </div>
                </div>

                {triggeredUsers && triggeredUsers.length ? (
                  triggeredUsers.map((result) => (
                    <div className="bg-white  w-full my-2 border-1 block shadow hover:shadow-xl overflow-auto">
                      <div className="flex flex-row justify-between px-4 py-4 items-center text-sm md:text-base group">
                        {result.status === "success" ? (
                          <p
                            onClick={() =>
                              handleOrderDetails(
                                result.triggerId,
                                result.numberOfUsers,
                                result.status,
                                "single"
                              )
                            }
                            className=" break-words w-32 group-hover:underline cursor-pointer group-hover:text-site-theme md:font-medium"
                          >
                            {result.triggerId}
                          </p>
                        ) : (
                          <p className="break-words w-32 md:font-medium">
                            {result.triggerId}
                          </p>
                        )}

                        <p className="w-32 text-10px md:text-sm text-gray-900 break-all">
                          {result.user && result.user.fullName}
                        </p>

                        <p className="w-20 text-10px md:text-sm text-gray-900 break-all">
                          {result.user && result.user.nickName}
                        </p>

                        <p className="w-48 text-10px md:text-sm text-gray-900  break-all ">
                          {result.user && result.user.email}
                        </p>

                        <p className="w-32 text-10px md:text-sm text-gray-900 underline break-all  ">
                          {result.totalGoldPoint}
                        </p>

                        {result && result.status === "success" && (
                          <div className="w-32 rounded bg-gray-600 p-1 text-center bg-green-600 px-4 text-white text-10px md:text-base">
                            Successful
                          </div>
                        )}
                        {result && result.status === "failed" && (
                          <div className="w-32 rounded bg-gray-600 p-1 text-center bg-site-theme px-4 text-white text-10px md:text-base">
                            Failed
                          </div>
                        )}
                        {result && result.status === "pending" && (
                          <div
                            className="w-32 hover:shadow-lg focus:outline-none outline-none rounded
                                                bg-red-400 text-white p-1 text-center px-4 text-10px md:text-base"
                          >
                            Pending
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p />
                )}
              </div>
            ) : (
              <div />
            )}

            {(triggeredUsersAll && triggeredUsersAll.length) ||
            (triggeredUsers && triggeredUsers.length) ? (
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
            ) : (
              <div />
            )}

            {orderDetailsModal === true && detailsId && (
              <RPDetailsModal
                type={userType}
                hideButton={false}
                id={detailsId}
                totalUser={totalUserOfDetailsId}
                onClose={orderDetailsModalClose}
              />
            )}

            {triggerAll === true && triggerOne === false && (
              <TriggerAllModal
                goldPoint={goldPoint}
                hideButton={false}
                reloadData={() => getTriggerApi()}
                onClose={() => setTriggerAll(false)}
              />
            )}

            {triggerAll === false && triggerOne === true && (
              <TriggerOneModal
                goldPoint={goldPoint}
                hideButton={false}
                reloadData={() => getTriggerApi()}
                onClose={() => setTriggerOne(false)}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
