import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./page/HomePage";
import "./App.css";
import { AiOutlinePlus } from "react-icons/ai";
import Header from "./components/Header";
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
import { Protected } from "./utils/ProtectedRoutes";
import Login from "./components/Login";
import { isAuthenticated } from "./utils/isAuth";
import NotebookPage from "./page/NotebookPage";
import Test from "./components/Test";
import StoragePage from "./page/StoragePage";

function App() {
  const navigate = useNavigate();
  const [size, setSize] = useState(0);
  // const [render, setRender] = useState(0);

  // Face lock
  const faceId = isAuthenticated();

  const fetchCart = async () => {
    try {
      const resp = await Axios.get("/getTask");
      if (resp.data.success) {
        setSize(resp.data.data.length);
      } else {
        return;
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // const handleSize = (props) => {
  //   setRender(props);
  // };
  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location]);

  return (
    <>
      {faceId && faceId?.user === String(process.env.REACT_APP_USER) && (
        <Header len={size} />
      )}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route exact element={<Protected />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-issues/:id?" element={<IssuePage />} />
          <Route path="/resolve" element={<ResolverPage />} />
          <Route path="/resolve/:id" element={<ResolveDetailPage />} />
          <Route path="/add-company" element={<CompanyPage />} />
          <Route path="/expence" element={<ExpencePage />} />
          <Route path="/alarm" element={<AlarmPage />} />
          <Route path="/learning" element={<VideoPage />} />
          <Route path="/notebook/:fileName" element={<NotebookPage />} />
          <Route path="/company/:id" element={<CompanyPage />} />
          <Route
            path="/task"
            element={<MyTaskPage
            />}
          />
          <Route
            path="/cloud-storage"
            element={<StoragePage />}
          />
          <Route
            path="/test"
            element={<Test />}
          />
        </Route>
      </Routes>

      <div className="addIssues">
        <button
          className="btn text-white"
          onClick={() => navigate("/add-issues")}
          style={{ backgroundColor: "green" }}
        >
          Add Issues &nbsp;
          <AiOutlinePlus />
        </button>
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
