import axios from "axios";

// const base = process.env.NODE_ENV === "production"?:"http://localhost:5000"

const Axios = axios.create({
    baseURL: 'http://localhost:5000',
});
export default Axios
