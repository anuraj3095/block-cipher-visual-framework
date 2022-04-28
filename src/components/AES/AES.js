import "./AES.css";
//import SelectAlgorithm from "./components/SelectAlgorithm/SelectAlgorithm"
import Matrix from "../Matrix/Matrix";
import SboxAES from "./SboxAES";
import InvSboxAES from "./InvSboxAES";
import { Step, } from "./AESConstants";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";
import { aesActions } from '../../store/aesStore-slice';


function AES(props) {
  
  let emptyHexList = useSelector((state) => state.aes.emptyData);
  //console.log(emptyHexList);
  let multipltyList = ["02", "03", "01", "01", "01", "02", "03", "01", "01", "01", "02", "03", "03", "01", "01", "02"];
  let currStep = useSelector((state) => state.aes.currStep);
  let currDataHexList = useSelector((state) => state.aes.dataState);
  let currKeyHexList = useSelector((state) => state.aes.keyState);
  let currOperation = useSelector((state) => state.aes.operation)
  const dispatch = useDispatch();

  if (currOperation !="Encryption" ) {
    multipltyList = ["0E", "0B", "0D", "09", "09", "0E", "0B","0D","0D", "09", "0E", "0B", "0B","0D", "09", "0E"];
  }

  useEffect(() => {   
    if (currOperation == "Encryption") {
      dispatch(aesActions.gotoStep({newStep: Step.AddRoundKey, newRound:0}));
    }else {
      dispatch(aesActions.gotoStep({newStep: Step.AddRoundKey, newRound:1}));
    }
  }, []);
  return (
        <div className="aes-center-env ">

          <Matrix type = "main" switchRowColmn={true} data={currDataHexList}/>

          {currStep === Step.AddRoundKey && <div>+</div>}

          {currStep === Step.MixColumns && <div>x</div>}

          {currStep === Step.AddRoundKey && <Matrix type="key" switchRowColmn={false} data={currKeyHexList}/>}

          {currStep === Step.MixColumns && <Matrix type="multiply" switchRowColmn={false} data={multipltyList}/>}

          {(currStep === Step.AddRoundKey || currStep === Step.MixColumns ) && <div>=</div>}

          {currStep === Step.AddRoundKey && <Matrix type="output" switchRowColmn={false} data={emptyHexList}/>}

          {currStep === Step.MixColumns && <Matrix type="output" switchRowColmn={false} data={emptyHexList}/>}

          {currStep === Step.SubBytes && currOperation === "Encryption" && <SboxAES />}
          {currStep === Step.SubBytes && currOperation != "Encryption"  && <InvSboxAES /> }

        </div>
  
  );
}

export default AES;
