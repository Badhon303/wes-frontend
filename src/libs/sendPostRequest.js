import axios from "axios";
import BASE_API_URL from "../apis/baseApi";
// import componentRoute from "../applicationRoutes/routes";

export default function sendPostRequest(apiData, successCallback, errorCallback) {
    axios.post(BASE_API_URL, apiData).then(response => {
        if (doesAuthErrorExists(response)) {
            document.location.href = componentRoute.login.url;
        }
        else {
            successCallback(response);
        }
    }).catch(error => {
        // console.log(error);
        if (errorCallback !== undefined) {
            errorCallback(error);
        }
    });
}

export async function sendPostRequestSync(apiData) {
    return await new Promise((resolve, reject) => {
        sendPostRequest(apiData, function (response) {
            resolve(response.data.data);
        }, function (error) {
            reject(error);
        });
    });
}

function doesAuthErrorExists(response) {
    return response.data.errors !== undefined && JSON.parse(response.data.errors[0].message).code === 401;

}
