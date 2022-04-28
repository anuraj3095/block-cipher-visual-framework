import "./ControlsPanel.css";
//import SelectAlgorithm from "./components/SelectAlgorithm/SelectAlgorithm"
import {
  runShiftRowNextStep,
  animateShiftRows,
  reverseShiftRowStep,
} from "../../Utilities/ShiftRowAnimation.js";
import {
  runNextSubBytesStep,
  animateSubBytes,
  reverseSubByteStep,
} from "../../Utilities/SubBytesAnimation.js";
import {
  runAddRoundKeyNextStep,
  animateAddRoundKey,
  reverseAddRoundKeyStep,
} from "../../Utilities/AddRoundKeyAnimation";

import { Step } from "../AES/AESConstants";

import { useSelector, useDispatch } from "react-redux";
import { aesActions } from "../../store/aesStore-slice";
import { desActions } from "../../store/desStore-slice";
import {
  reverseMixColmnStep,
  runMixColmnNextStep,
} from "../../Utilities/MixColumnAnimation";
import { runNextDESStep } from "../../Utilities/DESAnimation";

function ControlsPanel(props) {
  //let currRound = useSelector((state) => state.aes.currRound);
  let currStep = useSelector((state) => state.aes.currStep);

  const currOperation = useSelector((state) => state.aes.operation);

  const dispatch = useDispatch();

  const currAlgo = props.algo;

  function doNext() {
    if (currAlgo === "AES") {
      switch (currStep) {
        case Step.SubBytes:
          runNextSubBytesStep();
          break;
        case Step.ShiftRows:
          runShiftRowNextStep();
          break;
        case Step.MixColumns:
          runMixColmnNextStep();
          break;
        case Step.AddRoundKey:
          runAddRoundKeyNextStep();
          break;
        default:
          break;
      }
    } else if (currAlgo == "DES") {

      runNextDESStep();
    }
  }

  function goPrev() {
    if (currAlgo === "AES") {
      switch (currStep) {
        case Step.SubBytes:
          reverseSubByteStep();
          break;
        case Step.ShiftRows:
          reverseShiftRowStep();
          break;
        case Step.MixColumns:
          reverseMixColmnStep();
          break;
        case Step.AddRoundKey:
          reverseAddRoundKeyStep();
          break;
        default:
          break;
      }
    }
  }

  function doNextStep() {
    if (currAlgo === "AES") {
      dispatch(aesActions.changeStep("next"));
    } else if (currAlgo === "DES") {
      dispatch(desActions.changeRound("next"));
    }
  }

  function doPrevStep() {
    if (currAlgo === "AES") {
      dispatch(aesActions.changeStep("prev"));
    } else if (currAlgo === "DES") {
      dispatch(desActions.changeRound("prev"));
    }
  }

  return (
    <div className="btn-group">
      <button onClick={doPrevStep}>Prev Step</button>
      <button onClick={goPrev}>Prev</button>
      <button>
        <span id="animateButtonSpan">Play</span>
      </button>
      <button onClick={doNext}>Next</button>
      <button onClick={doNextStep}>Next Step</button>
    </div>
  );
}

export default ControlsPanel;
