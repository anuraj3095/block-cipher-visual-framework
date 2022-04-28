import "./AlgoVisualization.css";
import { TextField } from "@mui/material";
import AES from "../AES/AES";
import DES from "../DES/DES";
import SideMenu from "../SideMenu/SideMenu";
import ControlsPanel from "../ControlsPanel/ControlsPanel";


function AlgoVisualisation(props) {

  var pcode = `AES is a symmetrix block cipher, that works with 12b bits of data with varying key sizes of 128, 192 and 256 bits. Plaintext data is arranegd in a 4x4 matrix and several operation are performed in multiple rounds transforming and exrypting the data.`;

  return (
    <div>
      <SideMenu algo={props.algo} />
      <div className="algo-visual">

        {props.algo === "AES" && <AES />}

        {props.algo === "DES" && <DES />}
        <div className="algo-info">
          <TextField sx={{ mt: 5, height: "100%" }}
            InputProps={{
                    readOnly: true
                  }}
            id="filled-multiline-static"
            label="Description"
            multiline
            fullWidth 
            minRows={8}
            maxRows={8}
            defaultValue={pcode}
            variant="filled"
          />
        </div>

      <ControlsPanel algo={props.algo}/>
      </div>
    </div>
  );
}

export default AlgoVisualisation;
