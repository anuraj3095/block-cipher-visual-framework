import "./App.css";
import * as React from "react";
import SelectAlgorithm from "./components/SelectAlgorithm/SelectAlgorithm";
import AlgoVisualization from "./components/AlgoVisualization/AlgoVisualization";
import { doAESEncryption, doAESDecryption } from "./Utilities/AESCalculation";
import { doDESEncryption } from "./Utilities/DESCalculation";

import { useDispatch } from 'react-redux';
import { aesActions } from './store/aesStore-slice';

function App() {
  const [appState, setAppState] = React.useState("selectAlgo");
  const [algorithm, setAlgorithm] = React.useState("AES");
  const dispatch = useDispatch();

  function onNextClickHandler(textData, keyData, algo, operation) {

    // just some defaults to make life easier
    if (!algo) {
      algo = "AES" ;
    }
    
    if (!operation) {
      operation = "Encryption"
    }

    setAlgorithm(algo);
    if (algo === "AES" && operation === "Encryption") {
      doAESEncryption(textData, keyData);
      setAppState("showAlgo");
      dispatch(aesActions.updateOperation(operation));
    }
    else if (algo === "AES" && operation === "Decryption"){
      doAESDecryption(textData, keyData);
      setAppState("showAlgo");
      dispatch(aesActions.updateOperation(operation));
    }
    else if (algo === "DES" && operation === "Encryption") {
      doDESEncryption(textData, keyData);
      setAppState("showAlgo");
      //dispatch(aesActions.updateOperation(operation));
    }
  }

  return (
    <div className="main-app">
      {appState === "selectAlgo" ? 
      <SelectAlgorithm onNextClick={onNextClickHandler}/> : 
      <AlgoVisualization algo={algorithm} />}
    </div>
  );
}

export default App;
