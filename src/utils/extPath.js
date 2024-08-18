// map ext to file icons
import { FaFilePdf } from "react-icons/fa";
import { AiOutlineFileJpg, AiFillFileZip } from "react-icons/ai";
import { IoIosDocument } from "react-icons/io";

import { SiJpeg } from "react-icons/si";
import { BsFiletypePng } from "react-icons/bs";

import { BsFiletypeMp4 } from "react-icons/bs";
import { BsFiletypeMp3 } from "react-icons/bs";
import { FaFileCsv } from "react-icons/fa";
import { BsFiletypeXlsx } from "react-icons/bs";
import { BsFiletypeJson } from "react-icons/bs";
import { SlDocs } from "react-icons/sl";
import axios from 'axios';


import { backLight } from "./color";

const fileIcons = {
    pdf: <FaFilePdf size={120} color="red" />,
    jpg: <AiOutlineFileJpg size={120} color="blue" />,
    jpeg: <SiJpeg size={120} color={backLight} />,
    png: <BsFiletypePng size={120} color="black" />,
    mp4: <BsFiletypeMp4 size={120} color="gray" />,
    mp3: <BsFiletypeMp3 size={120} color="green" />,
    xlsx: <BsFiletypeXlsx size={120} color="green" />,
    csv: <FaFileCsv size={120} color="green" />,
    json: <BsFiletypeJson size={120} color="yellow" />,
    docs: <SlDocs size={120} color="green" />,
    zip: <AiFillFileZip size={120} color="yellow" />,
    rar: <AiFillFileZip size={120} color="yellow" />,
}

export const mapExtTofile = (ext) => {
    return fileIcons[ext] || <IoIosDocument size={120} color="teal" />
}


// check for a folder or file
export const isFolderOrfile = (ext = "") => {
    if (ext) {
        return "file"
    } else {
        return "folder"
    }
}


export const downloadFile = async (url, filename) => {
    const response = await axios.get(url, { responseType: 'blob' });
    const blob = response.data;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}