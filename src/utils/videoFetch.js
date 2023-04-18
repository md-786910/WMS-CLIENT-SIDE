
// import axios from "axios";
/**
 * Sample JavaScript code for youtube.playlistItems.list
 * See instructions for running APIs Explorer code samples locally:
 * https://developers.google.com/explorer-help/code-samples#javascript
 */

// function authenticate() {
//     return window.gapi.auth2.getAuthInstance()
//         .signIn({ scope: "https://www.googleapis.com/auth/youtube.readonly" })
//         .then(function () { console.log("Sign-in successful"); },
//             function (err) { console.error("Error signing in", err); });
// }

// function loadClient() {
//     window.gapi.client.setApiKey("AIzaSyC5Y2wKpR34IxoU8MrtT9cxhHCNL_2OjzM");
//     return window.gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
//         .then(function () { console.log("GAPI client loaded for API"); },
//             function (err) { console.error("Error loading GAPI client for API", err); });
// }


// Make sure the client is loaded and sign-in is complete before calling this method.
// export const execute = () => {
//     return window.gapi.client.youtube.playlistItems.list({
//         "part": [
//             "id",
//             "snippet"
//         ],
//         "maxResults": 200,
//         "playlistId": "PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA"
//     })
//         .then(function (response) {
//             // Handle the results here (response.result has the parsed body).
//             console.log("Response", response);
//         },
//             function (err) { console.error("Execute error", err); });
// }



// const KEY = "";

// export const getPlayListItems = async () => {
//     const result = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
//         params: {
//             part: 'id,snippet',
//             maxResults: 300,
//             playlistId: "PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA",
//             key: "AIzaSyC2ESbGXLx8RWd8AdMhdkjRwpOsSYTepOU"
//         }
//     });
//     return result.data;
// };




// window.gapi.load("client:auth2", function () {
//     window.gapi.auth2.init({ client_id: "488981765006-b2od7184d51f2s8ou3c85kb3e2imdcra.apps.googleusercontent.com" });
// });
// authenticate().then(loadClient)
// <button onclick="authenticate().then(loadClient)">authorize and load</button>
// <button onclick="execute()">execute</button>
