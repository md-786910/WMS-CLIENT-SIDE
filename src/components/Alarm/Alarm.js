import React, { useEffect, useState } from "react";
import { backDark } from "../../utils/color";
import { SpinnerRole } from "../../utils/action";
import { Col, Row } from "react-bootstrap";
import Countdown from "react-countdown";
import alarm from "./audio.mp3";
import addNotification from "react-push-notification"
import { Notifications } from 'react-push-notification';

function Alarm() {

const [rand,setRand] = useState(0)
const[int,setInt] = useState(0)
  const [data, setData] = useState([
    {
      title: "1 Minute",
      interval: 1000 * 10,
      id: 1,
      puchIn: false,
      notfication: true,
      email: true,
    },
    {
      title: "1 Hours",
      interval: 3600 * 1000,
      id: 2,
      puchIn: false,
      notfication: true,
      email: true,
    },
    {
      title: "1.5 Hours",
      interval: 5400 * 1000,
      id: 3,
      puchIn: false,
      notfication: true,
      email: true,
    },
    {
      title: "2 Hours",
      interval: 7200 * 1000,
      id: 4,
      puchIn: false,
      notfication: true,
      email: true,
    },
  ]);
  const [loader, setLoader] = useState(false);

const audio = new Audio(alarm)
  // add task

  function punchInBtn(id, interval) {
    const jsonAlarm = JSON.parse(localStorage.getItem("alarm"));
    const filterAlarm = jsonAlarm.filter((e) => e.id === id);
    filterAlarm[0].puchIn = true;

    setInt(interval);

    localStorage.setItem("alarm", JSON.stringify(jsonAlarm));
    setRand(Math.random());
  }
  const resetAlarm = (id) => {
    audio.pause()
    const jsonAlarm = JSON.parse(localStorage.getItem("alarm"));
    const filterAlarm = jsonAlarm.filter((e) => e.id === id);
    filterAlarm[0].puchIn = false;

    setInt(0)
    localStorage.setItem("alarm", JSON.stringify(jsonAlarm));
    setRand(Math.random())


  };

const notOpen = ()=>{
  alert("hi")
  addNotification({
    title: 'Take a Break - 15 minutes',
    subtitle: 'This is a subtitle',
    message: 'This is a very long message',
    theme: 'darkblue',
    native: true // when using native, your OS will handle theming.
});
}


  // Renderer callback with condition
const renderer = ({ hours, minutes, seconds, completed }) => {
   if (completed) {
      audio.play()
  
      return <Timer interval={int}/>
    } else {
      document.title = `${hours}:${minutes}:${seconds}`
      return <span>{hours}:{minutes}:{seconds}</span>;
    }
  };

  function Timer({interval}){
    return  <Countdown date={Date.now() + parseInt(interval)} renderer={renderer}
    />
    
  }

  useEffect(() => {
    const jsonAlarm = JSON.parse(localStorage.getItem("alarm"));
    setData(jsonAlarm)
    // eslint-disable-next-line
  }, [rand]);


  useEffect(() => {
    // new Audio(alarm).play()
    localStorage.setItem("alarm", JSON.stringify(data));
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <section>
        <div className="companyStatus issResolveCon">
          <div
            style={{ background: backDark, padding: ".5em", color: "white" }}
          >
            <h2>My alarm {loader && <SpinnerRole />}</h2><Notifications/>
          </div>
          <div className="divider"></div>

          <div class="card">
            <div class="card-header ">
              <div>
                <label for="exampleFormControlInput1" class="form-label">
                  <strong>Add alarm</strong>
                </label>
                <button onClick={notOpen}>open</button>
              </div>
            </div>

            <Row>
              {data?.map((d, index) => {
                return (
                  <Col lg={3} key={index}>
                    <div class="card-body1 my-3 mx-3">
                      <div class="card mb-3">
                        <div class="card-header">
                          <h5>#Task - {index + 1}</h5>
                        </div>
                        <div class="card-body">
                          <p class="card-title">
                            <strong>Time Interval:</strong>{" "}
                            <strong>
                              <h3>{d.title}</h3>
                            </strong>
                          </p>
                         {
                            d.puchIn &&  <p>
                            <strong>
                              Remaining Time :
                                  <Timer interval={d.interval}/>
                            </strong>
                          </p>
                         }
                          <div className="mt-3">
                            <button
                              className="btn btn-success"
                              onClick={(e) => punchInBtn(d.id,d.interval)}
                              disabled={d.puchIn}
                            >
                              Punch In
                            </button>
                            {
                                d.puchIn &&<button
                                className="btn mx-3 btn-danger"
                                onClick={(e) => resetAlarm(d.id)}
                              >
                                Reset
                              </button>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </div>
        </div>
      </section>
    </>
  );
}

export default Alarm;
