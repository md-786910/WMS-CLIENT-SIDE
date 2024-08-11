import Axios from "../utils/axios"

export const createFile = async (fileName) => {
    return Axios.post("/create-file", { fileName })
}
export const getAllFile = async () => {
    return Axios.get("/get-all-file")
}

export const deleteFilesNameWithContent = async (fileId) => {
    return Axios.delete(`/delete-file/${fileId}`)
}

// create notebook
export const createNotebook = async (fileName) => {
    return Axios.post(`/create-notebook`, { fileName })
}

export const getAllContentNotebook = async (fileId) => {
    return Axios.get(`/get-notebook-content/${fileId}`)
}