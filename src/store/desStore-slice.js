import { createSlice } from "@reduxjs/toolkit";
import { DES_getDataState } from "../Utilities/DESCalculation";


const tempData = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"]
const initialDESState = {
    dataStateL: tempData.slice(),
    dataStateR: tempData.slice(),
    dataStateF: tempData.slice(),
    keyState: tempData.slice(),
    operation: "Encryption",
    currRound :1, 
    currAnimationIndx : 1 ,
    emptyData : tempData.slice() };


    const desSlice = createSlice({
        name: "des",
        initialState: initialDESState,
        reducers: {
            updateOperation(state, action){
              state.operation = action.payload;
            },
            updateIndex(state, action) {
                state.currAnimationIndx = action.payload;
            },
            gotoRound(state, action) {
              
                state.currRound =  action.payload.newRound;

                state.dataStateL = DES_getDataState("L" + state.currRound, "");
                state.dataStateR = DES_getDataState("R" + state.currRound, "");
                state.dataStateF = DES_getDataState("F" + state.currRound, "");
                state.currAnimationIndx = 1;

                state.emptyData = tempData.slice()
            },
            changeRound(state, action) {
                if (action.payload === "next") {
                    if (state.currRound  == 16) {
                        return;
                    }
                    state.currRound += 1;
                } else {
                    if (state.currRound  == 1) {
                        return;
                    }
                    state.currRound -= 1;
                }
                state.dataStateL = DES_getDataState("L" + state.currRound, "");
                state.dataStateR = DES_getDataState("R" + state.currRound, "");
                state.dataStateF = DES_getDataState("F" + state.currRound, "");
                state.currAnimationIndx = 1;
              }
        },
    });
    

export const desActions = desSlice.actions;

export default desSlice.reducer;
