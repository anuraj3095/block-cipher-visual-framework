import "./SideMenu.css";
//import SelectAlgorithm from "./components/SelectAlgorithm/SelectAlgorithm"
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import MenuIcon from "@mui/icons-material/Menu";
import NumberIcon from "../NumberIcon/NumberIcon";

import { useSelector, useDispatch } from 'react-redux';
import { aesActions } from '../../store/aesStore-slice';
import { desActions } from '../../store/desStore-slice';

import { useState } from "react";
import { Step } from "../AES/AESConstants";

function SideMenu(props) {


  let aesCurrRound = useSelector((state) => state.aes.currRound); 
  let aesCurrStep = useSelector((state) => state.aes.currStep);

  let desCurrRound = useSelector((state) => state.des.currRound);
  
  let currRound = aesCurrRound; 
  let currStep = aesCurrStep;
  
  const dispatch = useDispatch();
  const currAlgo = props.algo;

  if (currAlgo === "DES") {
    currRound = desCurrRound;
  }

  const currOperation = useSelector((state) => state.aes.operation);

  function handleStepChange(round, step) {
    dispatch(aesActions.gotoStep({newStep: step, newRound:round}));

  }

  function handleDESStepChange(round) {
   dispatch(desActions.gotoRound({newRound:round}));

  }

  

  function showDESRounds() {
    var rounds = [];

    for (let i = 1; i <= 16; i++) { 

      let highlightRound = false;
      let styleColor = { color: "#FCD13A" };

      if (currRound === i ) {
        highlightRound = true;
      }

      rounds.push(

          <MenuItem
            key={i}
            icon={<NumberIcon number={i} highlight={highlightRound} />}
            onClick={() => handleDESStepChange(i)}
          >
            {"Round " + (i)}
          </MenuItem>
      );

    }

    return rounds;
  }

  function showAESRounds() {
    var rounds = [];

    for (let i = 0; i < 12; i++) {

      let highlightRound = false;
      let styleColor = { color: "#FCD13A" };
      //let defaultColor = { color: "#FFFFFF" };
      let [addRoundKeyStyle, mixColumnsStyle, shiftRowStyle, subBytesStyle] = [
        {},
        {},
        {},
        {},
      ];

      if (currRound === i ) {
        highlightRound = true;

       
        switch (currStep) {
          case Step.AddRoundKey:
            addRoundKeyStyle = styleColor;
            break;
          case Step.MixColumns:
            mixColumnsStyle = styleColor;
            break;
          case Step.ShiftRows:
            shiftRowStyle = styleColor;
            break;
          case Step.SubBytes:
            subBytesStyle = styleColor;
            break; 
          default:
            break
        }
      }

      if ( currOperation == "Encryption"){

        if (i === 11){
          continue;
        }
        if (i === 0 ) {
          rounds.push(
            <SubMenu
            title={"Round " + (i)}
            key={i}
            icon={<NumberIcon number={i} highlight={highlightRound} />}
            >
              <MenuItem
              style={addRoundKeyStyle}
              onClick={() => handleStepChange(0, Step.AddRoundKey)}
              >
              AddRoundKey Step
              </MenuItem>
            </SubMenu>
          );
        }

        else if (i < 10) {

            rounds.push(
              <SubMenu
                title={"Round " + (i)}
                key={i}
                icon={<NumberIcon number={i} highlight={highlightRound} />}
              >
                <MenuItem
                  style={subBytesStyle}
                  onClick={() => handleStepChange(i, Step.SubBytes)}
                >
                  SubBytes Step
                </MenuItem>
                <MenuItem
                  style={shiftRowStyle}
                  onClick={() => handleStepChange(i, Step.ShiftRows)}
                >
                  ShiftRow Step
                </MenuItem>
                <MenuItem
                  style={mixColumnsStyle}
                  onClick={() => handleStepChange(i, Step.MixColumns)}
                >
                  MixColumns Step
                </MenuItem>
                <MenuItem
                  style={addRoundKeyStyle}
                  onClick={() => handleStepChange(i, Step.AddRoundKey)}
                >
                  AddRoundKey Step
                </MenuItem>
              </SubMenu>
            );
        }
        else {
          rounds.push(
            <SubMenu
              title={"Round " + (i)}
              key={i}
              icon={<NumberIcon number={i} highlight={highlightRound} />}
              
            >
              <MenuItem
                style={subBytesStyle}
                onClick={() => handleStepChange(i, Step.SubBytes)}
              >
                SubBytes Step
              </MenuItem>

              <MenuItem
                style={shiftRowStyle}
                onClick={() => handleStepChange(i, Step.ShiftRows)}
              >
                ShiftRow Step
              </MenuItem>
        
              <MenuItem
                style={addRoundKeyStyle}
                onClick={() => handleStepChange(i, Step.AddRoundKey)}
              >
                AddRoundKey Step
              </MenuItem>
            </SubMenu>
          );
        }
      } else {
          let newi = i;

          if (newi === 0){
            continue;
          }
          // decryption stuff here
        if (newi === 1 ) {
          rounds.push(
            <SubMenu
              title={"Round " + (newi)}
              key={newi}
              icon={<NumberIcon number={newi} highlight={highlightRound} />}
            >

              <MenuItem
                style={addRoundKeyStyle}
                onClick={() => handleStepChange(newi, Step.AddRoundKey)}
              >
                AddRoundKey Step
              </MenuItem>

              <MenuItem
                style={shiftRowStyle}
                onClick={() => handleStepChange(newi, Step.ShiftRows)}
              >
                Inv ShiftRow Step
              </MenuItem>

              <MenuItem
                style={subBytesStyle}
                onClick={() => handleStepChange(newi, Step.SubBytes)}
              >
                Inv SubBytes Step
              </MenuItem>
            </SubMenu>
          );
        }

       else if (newi > 1 && newi < 11) {

            rounds.push(
              <SubMenu
                title={"Round " + (newi)}
                key={newi}
                icon={<NumberIcon number={newi} highlight={highlightRound} />}
              >

                <MenuItem
                  style={addRoundKeyStyle}
                  onClick={() => handleStepChange(newi, Step.AddRoundKey)}
                >
                  AddRoundKey Step
                </MenuItem>

                <MenuItem
                  style={mixColumnsStyle}
                  onClick={() => handleStepChange(newi, Step.MixColumns)}
                >
                  Inv MixColumns Step
                </MenuItem>

                <MenuItem
                  style={shiftRowStyle}
                  onClick={() => handleStepChange(newi, Step.ShiftRows)}
                >
                  Inv ShiftRow Step
                </MenuItem>

                <MenuItem
                  style={subBytesStyle}
                  onClick={() => handleStepChange(newi, Step.SubBytes)}
                >
                  Inv SubBytes Step
                </MenuItem>
              </SubMenu>
            );
        }
        else {
          rounds.push(
            <SubMenu
              title={"Round " + (newi)}
              key={newi}
              icon={<NumberIcon number={newi} highlight={highlightRound} />}
              
            >
              <MenuItem
                style={addRoundKeyStyle}
                onClick={() => handleStepChange(newi, Step.AddRoundKey)}
              >
                AddRoundKey Step
              </MenuItem>
            </SubMenu>
          );
        }
      }
  }
    return rounds;
  }

  function showRounds() {

    if (currAlgo === "AES") {
      return showAESRounds();
    } else if (currAlgo === "DES") {
      return showDESRounds();
    } 
  }

  let [menuIsCollapsed, setMenuIsCollapsed] = useState(true);

  function handleMenuPress() {
    setMenuIsCollapsed(!menuIsCollapsed);
  }

  return (
    <div className="side-menu">

      <ProSidebar collapsed={menuIsCollapsed}>
        <Menu
          iconShape="square"
          subMenuBullets={true}
          popperArrow={true}
          innerSubMenuArrows={true}
        >
          <MenuItem   icon={<MenuIcon />}  onClick={handleMenuPress}>
            Menu
          </MenuItem>
          { showRounds()}
        </Menu>
      </ProSidebar>
    </div>
  );
}

export default SideMenu;
