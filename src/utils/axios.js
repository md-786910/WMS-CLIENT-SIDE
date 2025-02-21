import axios from "axios";

//url1 = https://wms-server-wr3u.onrender.com
//"https://d3ckitf346p739.cloudfront.net"
const render_url = "https://wms-server-wr3u.onrender.com";
const base =
  process.env.NODE_ENV === "production"
    ? "https://wms-1uq0kpc6g-md786910s-projects.vercel.app/"
    : "http://localhost:5000";

const Axios = axios.create({
  baseURL: base,
});
export default Axios;
