import { useEffect, useRef, useState } from "react";
import arrowUp from "./../imgs/arrow-up.svg";
import arrowDown from "./../imgs/arrow-down.svg";
import icons from "./../imgs/icons.svg";
import threeDots from "./../imgs/three-dots.svg";

import incode from './../incode';

export function FrontId({ session, onSuccess, onError }) {
    const containerRef = useRef();
    const isMounted = useRef(false);
  
    useEffect(() => {
      if (isMounted.current) {
        return;
      }
      incode.renderCamera("front", containerRef.current, {
        onSuccess,
        onError,
        token: session,
        numberOfTries: -1,
        showTutorial: true,
        showCustomCameraPermissionScreen: true,
        showDoublePermissionsRequest: true,
      });
  
      isMounted.current = true;
    }, [onSuccess, onError, session]);
  
    return <div ref={containerRef}></div>;
  }
  
  export function BackId({ session, onSuccess, onError }) {
    const containerRef = useRef();
    const isMounted = useRef(false);
  
    useEffect(() => {
      if (isMounted.current) {
        return;
      }
      incode.renderCamera("back", containerRef.current, {
        onSuccess,
        onError: onError,
        token: session,
        numberOfTries: -1,
        showTutorial: true,
        showCustomCameraPermissionScreen: true,
        showDoublePermissionsRequest: true,
      });
  
      isMounted.current = true;
    }, [onSuccess, onError, session]);
  
    return <div ref={containerRef}></div>;
  }
  
  export function ProcessId({ session, onSuccess }) {
    useEffect(() => {
      incode.processId({ token: session.token }).then(() => {
        onSuccess();
      });
    }, [onSuccess, session]);
  
    return <p>Processing...</p>;
  }
  
  export function Selfie({ session, onSuccess, onError }) {
    const containerRef = useRef();
    const isMounted = useRef(false);
  
    useEffect(() => {
      if (isMounted.current) {
        return;
      }
      incode.renderCamera("selfie", containerRef.current, {
        onSuccess,
        onError: onError,
        token: session,
        numberOfTries: 3,
        showTutorial: true,
        showCustomCameraPermissionScreen: true,
        showDoublePermissionsRequest: true,
      });
      isMounted.current = true;
    }, [onSuccess, onError, session]);
  
    return <div ref={containerRef}></div>;
  }
  
  export function FaceMatch({ session, onSuccess, onError, liveness, userExists }) {
    const containerRef = useRef();
  
    useEffect(() => {
      incode.renderFaceMatch(containerRef.current, {
        onSuccess,
        onError,
        token: session,
        liveness,
        userExists,
      });
    }, [onSuccess, onError, session, liveness, userExists]);
  
    return <div ref={containerRef}></div>;
  }
  
  export function Conference({ session, onSuccess, onError }) {
    const [status, setStatus] = useState();
    const containerRef = useRef();
    const isMounted = useRef(false);
  
    useEffect(() => {
      if (isMounted.current) {
        return;
      }
      incode.renderConference(
        containerRef.current,
        {
          token: session,
        },
        {
          onSuccess: (status) => {
            setStatus(status);
          },
          onError: (error) => {
            console.log("error", error);
            setStatus(error);
          },
          onLog: (...params) => console.log("onLog", ...params),
        }
      );
      isMounted.current = true;
    }, [onSuccess, onError, session]);
  
    if (status) {
      return <p>Finished with status {status}</p>;
    }
  
    return <div ref={containerRef}></div>;
  }
  
  export function VideoSelfie({ session, onSuccess, onError }) {
    const containerRef = useRef();
    const isMounted = useRef(false);
  
    useEffect(() => {
      if (isMounted.current) {
        return;
      }
      incode.renderVideoSelfie(
        containerRef.current,
        {
          token: session,
          showTutorial: true,
          modules: ["selfie", "front", "back", "speech"], // you can add 'poa' and 'questions',
          speechToTextCheck: true, // this is the check for the speech
        },
        {
          onSuccess: (status) => {
            alert("speech detected");
          },
          onError: (error) => {
            console.log("error", error);
          },
          onLog: (...params) => console.log("onLog", ...params),
        }
      );
      isMounted.current = true;
    }, [onSuccess, onError, session]);
  
    return <div ref={containerRef}></div>;
  }
  
  export function usePermissions() {
    const [state, setState] = useState("unkwown");
  
    useEffect(() => {
      try {
        navigator.permissions
          .query({ name: "camera" })
          .then(function (result) {
            setState(result.state);
          })
          .catch(() => {
            setState("unkwown");
          });
      } catch (e) {
        setState("unkwown");
      }
    }, []);
  
    return state;
  }

  // This only works for Android, you need to handle iOS
  export function ResetPermissions({ onTryAgain }) {
    return (
      <div className="reset-permissions">
        <h1>Follow the next steps:</h1>
        <ul>
          <li>
            <span className="number">1</span> <p>Tap the 3 dots</p>{" "}
            <img className="three-dots" alt="three dots" src={threeDots} />
            <img
              className="arrow-up"
              src={arrowUp}
              alt="arrow pointing to the three dots"
            />
          </li>
          <li>
            <span className="number">2</span> <p>Tap this icon</p>{" "}
            <img
              src={arrowDown}
              className="arrow-down"
              alt="arrow pointing to icon with i"
            />
            <div>
              <img src={icons} alt="bar icons" />
            </div>
          </li>
          <li>
            <span className="number">3</span>{" "}
            <p>
              Tap in <span className="blue">"Site settings"</span>
            </p>
          </li>
          <li>
            <span className="number">4</span>{" "}
            <span className="blue">Allow Permission</span>{" "}
            <p style={{ marginLeft: 10 }}>to Camera</p>
          </li>
        </ul>
        <div className="button-container">
          <button onClick={onTryAgain}>Try Again</button>
        </div>
      </div>
    );
  }
  
  export function RetrySteps({ session, onSuccess, onError, numberOfTries }) {
    const containerRef = useRef();
    const isMounted = useRef(false);
  
    useEffect(() => {
      if (isMounted.current) {
        return;
      }
      incode.renderRetrySteps(
        containerRef.current,
        {
          token: session,
          numberOfTries,
        },
        {
          onSuccess,
          onError,
        }
      );
      isMounted.current = true;
    }, [onSuccess, onError, session, numberOfTries]);
  
    return <div ref={containerRef}></div>;
  }