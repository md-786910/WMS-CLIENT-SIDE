import Axios from "../utils/axios"

export const createFile = async (fileName) => {
    return Axios.post("/create-file", { fileName })
}
export const getAllFile = async () => {
    return Axios.get("/get-all-file")
}

export const orderNotebookFiles = async (payload) => {
    return Axios.patch("/order-notebook-files", payload)
}

export const updateNotebookFileName = async (fileId, fileName) => {
    return Axios.patch(`/notebook-files/${fileId}`, {
        fileName
    })
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

// upload files
export const uploadFiles = async (file, isFolderContains = false, folderId = null) => {
    return Axios.post(`/upload-files?isFolderContain=${isFolderContains}&folderId=${folderId}`, file, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
export const getFileMultiple = async (folderId) => {
    return Axios.get(`/get-multiple-files/${folderId}`)
}
export const createFolder = async (folderName) => {
    return Axios.post('/create-folder', { folderName })
}
export const getFolders = async () => {
    return Axios.get('/get-folder')
}
export const deleteFilesDocs = async (fileId) => {
    return Axios.delete('/delete-file-docs/' + fileId)
}
export const deleteFolderWithFiles = async (folderId) => {
    return Axios.delete('/delete-folder-with-files/' + folderId)
}
