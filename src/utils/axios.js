import axios from "axios";

//url = https://tiny-jade-goshawk-belt.cyclic.app
//url1 = https://wms-server-wr3u.onrender.com


const base = process.env.NODE_ENV === "production" ? "https://tiny-jade-goshawk-belt.cyclic.app" : "http://localhost:5000"

const Axios = axios.create({
  baseURL: base,
});
export default Axios;
