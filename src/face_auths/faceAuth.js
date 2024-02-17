import faceIO from "@faceio/fiojs";
import { removeSpinner, toastWarning } from "../utils/action";

const faceio = new faceIO(process.env.REACT_APP_FACE_ID); // Get the application Public ID at https://console.faceio.net.

async function enrollNewUser() {
  const userInfo = await faceio.enroll({
    locale: "auto", // Default user locale
    payload: {
      /* The payload we want to associate with this particular user which is forwarded back to us upon future authentication of this user.*/
      whoami: 845432, // Dummy ID linked to this particular user
      email: "mdashif.test@gmail.com",
    },
  });
  console.log(userInfo);
}
async function authenticateUser(event) {
  try {
    const userData = await faceio.authenticate({
      locale: "auto", // Default user locale
    });
    localStorage.setItem("faceAuth", JSON.stringify(userData));

    setTimeout(() => {
      window.location.href = "/";
    }, 600);
  } catch (error) {
    removeSpinner(event, "LOGIN");
    handleError(error);
  }
}

function handleError(errCode) {
  const fioErrs = faceio.fetchAllErrorCodes();

  switch (errCode) {
    case fioErrs.PERMISSION_REFUSED:
      toastWarning("Access to the Camera stream was denied by the end user");
      break;
    case fioErrs.NO_FACES_DETECTED:
      toastWarning(
        "No faces were detected during the enroll or authentication process"
      );
      break;
    case fioErrs.UNRECOGNIZED_FACE:
      toastWarning("Unrecognized face on this application's Facial Index");
      break;
    case fioErrs.MANY_FACES:
      toastWarning("Two or more faces were detected during the scan process");
      break;
    case fioErrs.FACE_DUPLICATION:
      toastWarning(
        "User enrolled previously (facial features already recorded). Cannot enroll again!"
      );
      break;
    case fioErrs.MINORS_NOT_ALLOWED:
      toastWarning("Minors are not allowed to enroll on this application!");
      break;
    case fioErrs.PAD_ATTACK:
      toastWarning(
        "Presentation (Spoof) Attack (PAD) detected during the scan process"
      );
      break;
    case fioErrs.FACE_MISMATCH:
      toastWarning(
        "Calculated Facial Vectors of the user being enrolled do not matches"
      );
      break;
    case fioErrs.WRONG_PIN_CODE:
      toastWarning("Wrong PIN code supplied by the user being authenticated");
      break;

    default:
      toastWarning("Invalid PIN code supplied by the user");

    // ...
    // Refer to the boilerplate at: https://gist.github.com/symisc/34203d2811a39f2a871373abc6dd1ce9
    // for the list of all possible error codes.
  }
}

export { enrollNewUser, authenticateUser };
