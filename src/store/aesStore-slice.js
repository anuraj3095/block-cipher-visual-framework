import { createSlice } from "@reduxjs/toolkit";
import { Step, getNextAESStep, getPrevAESStep, getStepIndex } from "../components/AES/AESConstants";
import { AES_getDataState, AES_getKeyState } from "../Utilities/AESCalculation";

const tempData = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"]
const initialAESState = {
   dataState: tempData.slice(),
   keyState: tempData.slice(),
   operation: "Encryption",
    currRound :0, 
    currStep : Step.SubBytes, 
  currRowAnimation : 0 ,
   currColAnimation : 0, 
   emptyData : tempData.slice() };

const aesSlice = createSlice({
    name: "aes",
    initialState: initialAESState,
    reducers: {
        updateOperation(state, action){
          state.operation = action.payload;
        },
        updateRowCol(state, action) {
            state.currRowAnimation = action.payload.newRow;
            state.currColAnimation =  action.payload.newCol;
        },
        gotoStep(state, action) {
          
            state.currStep = action.payload.newStep;
            state.currRound =  action.payload.newRound;

            let stepIndx = getStepIndex(state.currStep)
            state.dataState = AES_getDataState(state.currRound, stepIndx);
            if (state.operation === "Encryption")  {
              state.keyState = AES_getKeyState(state.currRound);
            } else {
              state.keyState = AES_getKeyState(state.currRound-1);
            }

            state.currRowAnimation = 0 
            state.currColAnimation = 0

            state.emptyData = tempData.slice()
        },
        changeStep(state, action) {
            let changedStep = state.currStep;
            let changedRound = state.currRound;
            let currOper = state.operation;
            let specialRound = false;

            if (state.currRound === 10 && currOper=== "Encryption"){
              specialRound = true;
            } 

            if (state.currRound === 1 && currOper=== "Decryption"){
              specialRound = true;
            }

            if (action.payload === "next") {

              changedStep = getNextAESStep(state.currStep, specialRound, currOper);
              if (changedStep === Step.SubBytes && currOper=== "Encryption") {
                changedRound += 1;
              }

              if (changedStep === Step.AddRoundKey && currOper=== "Decryption") {
                changedRound += 1;
              }

              if (currOper === "Encryption" && state.currRound === 10 && state.currStep === Step.AddRoundKey) {
                return;
              }
              if (currOper === "Decryption" && state.currRound === 11 && state.currStep === Step.AddRoundKey) {
                return;
              }

            } else{

              // previous
              if (currOper === "Encryption" && state.currRound === 0) {
                return;
              }

              
              if (currOper === "Decryption" && state.currRound === 1 && state.currStep === Step.AddRoundKey) {
                return;
              }

              changedStep = getPrevAESStep(state.currStep,specialRound, currOper);
              
              if (changedStep === Step.AddRoundKey && currOper=== "Encryption") {
                changedRound -= 1;
              } 

              if (changedStep === Step.SubBytes && currOper=== "Decryption") {
                changedRound -= 1;
              } 
            }
            
            state.currStep = changedStep;
            state.currRound = changedRound;

            state.emptyData = tempData.slice()

            let stepIndx = getStepIndex(state.currStep)
            state.dataState = AES_getDataState(state.currRound, stepIndx);
            if (state.operation === "Encryption")  {
              state.keyState = AES_getKeyState(state.currRound);
            } else {
              state.keyState = AES_getKeyState(state.currRound-1);
            }

            state.currRowAnimation = 0 
            state.currColAnimation = 0
          }
    },
});

export const aesActions = aesSlice.actions;

export default aesSlice.reducer;
