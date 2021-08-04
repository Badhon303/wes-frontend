import * as FetchApi from "../libs/FetchApi";
import { BASE_URL } from "../constants";

export function updateProfile(data) {
  return sendPostRequest("/users/" + data.id);
}

export function getUseDetails() {
  //http://localhost:3000/v1/users/604630d5a214a781a1ee7b68

  FetchApi.sendPutRequest(
    `${BASE_URL}/users/${user.id}/upload-profile-photo`,
    data,
    { credentials: true }
  )
    .then((res) => {
      // console.log("response",res);
      // Router.push(REDIRECT_AFTER_VERIFICATION);
      // setShowModal(!showModal)
      // props.profilePictureCallback(false)
    })
    .catch((err) => {
      // if (err.response.status === 422) {
      //     // Handle server-side validation errors
      // } else {
      //     // Swal.fire(response.status); // Show more specific message
      // }
      // Swal.fire('Whoops..', err.response.message, 'error');
      // console.log(err)
      // setShowModal(!showModal)
      // props.profilePictureCallback(false)
    });

  return sendGetRequest();
}
