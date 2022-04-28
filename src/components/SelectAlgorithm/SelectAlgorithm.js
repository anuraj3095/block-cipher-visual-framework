import * as React from "react";
import "./SelectAlgorithm.css";
import FormControl, { useFormControl } from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const MAXCHARS = 16;

function SelectAlgorithm(props) {
  const [algo, setAlgo] = React.useState("");
  const [operType, setOperType] = React.useState("");
  const [textValue, setTextValue] = React.useState("");
  const [keyValue, setKeyValue] = React.useState("");

  const handleAlgoChange = (event) => {
    
    if (event.target.value === "DES") {
      setOperType("Encryption");
      setTextValue( textValue.substring(0, 8) );
      setKeyValue( keyValue.substring(0, 8) );
    }
    setAlgo(event.target.value);
  };

  const handleOperationChange = (event) => {
    setOperType(event.target.value);
  };

  const handleTextChange = (event) => {
    if (algo === "DES") {
      if (event.target.value.length <= 8) {
        setTextValue(event.target.value);
      }
    } else if (event.target.value.length <= MAXCHARS) {
      setTextValue(event.target.value);
    }
  };

  const handleKeyChange = (event) => {
    if (algo === "DES") {
      if (event.target.value.length <= 8) {
        setKeyValue(event.target.value);
      }
    } else if (event.target.value.length <= MAXCHARS) {
      setKeyValue(event.target.value);
    }
  };

  function proceedNext() { 
    props.onNextClick(textValue, keyValue, algo, operType );
  }

  function RemainingHelperText(props) {
    const { focused } = useFormControl() || {};

    const helperText = React.useMemo(() => {
      if (focused) {
        let maxStrLen = MAXCHARS;
        if (algo === "DES") maxStrLen = MAXCHARS-8;
        if (props.type === "inputtext") {
          return `Remaining characters - ${maxStrLen - textValue.length}`;
        } else {
          return `Remaining characters - ${maxStrLen - keyValue.length}`;
        }
      }

      return "";
    }, [focused]);

    return <FormHelperText>{helperText}</FormHelperText>;
  }

  return (
    <div className="select-algorithm">
      <div className="select-algorithm__textinput">
        <FormControl sx={{ m: 5, width: "100%", height: "100%" }}>
          <OutlinedInput
            placeholder="Enter text"
            value={textValue}
            onChange={handleTextChange}
          />
          <RemainingHelperText type="inputtext"/>
        </FormControl>
      </div>

      <div className="select-algorithm__keyinput">
        <FormControl sx={{ m: 5, width: "100%", height: "100%" }}>
          <OutlinedInput
            placeholder="Enter key"
            value={keyValue}
            onChange={handleKeyChange}
          />
          <RemainingHelperText type="key"/>
        </FormControl>
      </div>

      <div className="select-algorithm__selectalgo_type">
        <FormControl sx={{ ml: 5, mt:5, minWidth: 200 }}>
          <InputLabel id="select-algo-label">Select Algorithm</InputLabel>
          <Select
            labelId="select-algo-label"
            id="select-algo-label-helper"
            value={algo}
            label="Select Algorithm"
            onChange={handleAlgoChange}
          >
            <MenuItem value={"AES"}>AES</MenuItem>
            <MenuItem value={"DES"}>DES</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ ml: 5,mt:3 , minWidth: 200 }}>
          <InputLabel id="select-oper-type-label">Select Operation</InputLabel>
          <Select
            labelId="select-oper-type-label"
            id="select-oper-type-label-helper"
            value={operType}
            label="Select Algorithm"
            onChange={handleOperationChange}
          >
            <MenuItem value={"Encryption"}>Encryption</MenuItem>
            
            {algo === "AES" && <MenuItem value={"Decryption"}>Decryption</MenuItem>}
          </Select>
        </FormControl>
      </div>

      <div className="select-algorithm__right-pane"> </div>
      <div className="select-algorithm__next">
        <div onClick={proceedNext}>
          <ArrowForwardIcon
            className="select-algorithm__next__icon"
            sx={{ fontSize: 100 }}
          />
        </div>
      </div>
    </div>
  );
}

export default SelectAlgorithm;
