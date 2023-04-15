import axios from "axios";

const base = process.env.NODE_ENV === "production" ? "https://wms-server-wr3u.onrender.com" : "http://localhost:5000"

const Axios = axios.create({
    baseURL: base
});
export default Axios
