import axios from "axios";

//url1 = https://wms-server-wr3u.onrender.com

const base =
  process.env.NODE_ENV === "production"
    ? "https://d3ckitf346p739.cloudfront.net"
    : "http://localhost:5000";

const Axios = axios.create({
  baseURL: base,
});
export default Axios;
