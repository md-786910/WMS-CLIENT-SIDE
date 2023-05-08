import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./page/HomePage";
import "./App.css";
import { AiOutlinePlus } from "react-icons/ai"
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useNavigate } from "react-router-dom";
import IssuePage from "./page/IssuePage";
import { ToastContainer } from "react-toastify";
import ResolverPage from "./page/ResolvePage";
import CompanyPage from "./page/CompanyPage";
import MyTaskPage from "./page/MyTaskPage";
import Axios from "./utils/axios";
import ResolveDetailPage from "./page/ResolveDetailPage";
import ExpencePage from "./page/ExpencePage";
import VideoPage from "./page/VideoPage";
import AlarmPage from "./page/AlarmPage";

function App() {
  const navigate = useNavigate();
  const [size, setSize] = useState(0);
  const [render, setRender] = useState(0);


  const fetchCart = async () => {
    try {
      const resp = await Axios.get("/getTask")
      if (resp.data.success) {
        setSize(resp.data.data.length)
      } else {
        return;
      }
    } catch (error) {
      alert(error.message)
    }
  }


  const handleSize = (props) => {
    setRender(props)
  }
  useEffect(() => {
    fetchCart();
  }, [render])

  return (
    <>
      <Header len={size} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add-issues" element={<IssuePage />} />
        <Route path="/resolve" element={<ResolverPage />} />
        <Route path="/resolve/:id" element={<ResolveDetailPage />} />
        <Route path="/add-company" element={<CompanyPage />} />
        <Route path="/expence" element={<ExpencePage />} />
        <Route path="/alarm" element={<AlarmPage />} />
        <Route path="/learning" element={<VideoPage />} />
        <Route path="/company/:id" element={<CompanyPage />} />
        <Route path="/task" element={<MyTaskPage handleSize={handleSize} />} />
      </Routes>
      <div className="addIssues">
        <button className="btn text-white" onClick={() => navigate("/add-issues")} style={{ backgroundColor: "green" }}>Add Issues
          &nbsp;
          <AiOutlinePlus />
        </button>
      </div>
      <ToastContainer />

      <Footer />
    </>
  );
}

export default App;
