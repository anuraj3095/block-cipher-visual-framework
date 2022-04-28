import { getSboxRowColForValue, getSboxElementAt, getInvSboxElementAt } from "./SBoxValues"

import { aesActions } from '../store/aesStore-slice';
import store from '../store/reduxStore';

var animationSubByteTimer = undefined;
let isSubByteAnimating = false;

function removeClass(elemStr, className) {
    document.getElementById(elemStr).classList.remove(className);
}

export function runNextSubBytesStep() {

    let aesStore = store.getState().aes;

    let currOper = aesStore.operation;
    var currentRowSubByte = aesStore.currRowAnimation;
    var currentColSubByte = aesStore.currColAnimation;

    if (currentColSubByte > 3) {
        store.dispatch(aesActions.updateRowCol({ newRow: currentRowSubByte + 1, newCol: 0 }));
        currentColSubByte = 0;
        currentRowSubByte += 1;
    }

    if (currentRowSubByte > 3) {

        store.dispatch(aesActions.updateRowCol({ newRow: 0, newCol: 0 }));

        clearInterval(animationSubByteTimer);
        currentRowSubByte = 0;
        currentColSubByte = 0;
        return;
    }

    var blockStr = "mainr" + currentRowSubByte.toString() + "c" + currentColSubByte.toString();
    var blockElem = document.getElementById(blockStr);

    let [row, col] = getSboxRowColForValue(blockElem.textContent);

    if (currOper == "Encryption") {
        blockElem.textContent = getSboxElementAt(row, col);
    } else {
        blockElem.textContent = getInvSboxElementAt(row, col);
    }


    let highlightAnimClass = "highlightAnimslow"
    let sboxRowId = "sboxr" + (row + 1).toString();
    let sboxColId = "sboxc" + (col + 1).toString();

    document.getElementById(sboxRowId).classList.add(highlightAnimClass);
    document.getElementById(sboxColId).classList.add(highlightAnimClass);

    setTimeout(removeClass, 1000, sboxRowId, highlightAnimClass);
    setTimeout(removeClass, 1000, sboxColId, highlightAnimClass);

    blockElem.classList.add('highlightAnim');
    setTimeout(removeClass, 1000, blockStr, "highlightAnim");

    store.dispatch(aesActions.updateRowCol({ newRow: currentRowSubByte, newCol: currentColSubByte + 1 }));
    currentColSubByte += 1;

}

export function animateSubBytes() {

    if (isSubByteAnimating) {
        clearInterval(animationSubByteTimer);
        document.getElementById("animateButtonSpan").textContent = "Animate";
        isSubByteAnimating = false;
        return
    }

    isSubByteAnimating = true;
    document.getElementById("animateButtonSpan").textContent = "Stop";
    runNextSubBytesStep()
    animationSubByteTimer = setInterval(runNextSubBytesStep, 2500);
}

export function reverseSubByteStep() {

    let aesStore = store.getState().aes

    var currentRowSubByte = aesStore.currRowAnimation;
    var currentColSubByte = aesStore.currColAnimation;

    currentColSubByte -= 1;
    store.dispatch(aesActions.updateRowCol({ newRow: currentRowSubByte, newCol: currentColSubByte }));

    if (currentColSubByte < 0) {

        currentColSubByte = 3;
        currentRowSubByte -= 1;
        store.dispatch(aesActions.updateRowCol({ newRow: currentRowSubByte, newCol: currentColSubByte }));
    }

    if (currentRowSubByte < 0) {
        currentRowSubByte = 0;
        currentColSubByte = 0;
        store.dispatch(aesActions.updateRowCol({ newRow: currentRowSubByte, newCol: currentColSubByte }));
        return;
    }

    var blockStr = "mainr" + currentRowSubByte.toString() + "c" + currentColSubByte.toString();
    var blockElem = document.getElementById(blockStr);

    blockElem.textContent = aesStore.dataState[currentColSubByte * 4 + currentRowSubByte].toString(16).padStart(2, '0');

    blockElem.classList.add('highlightAnim');
    setTimeout(removeClass, 1000, blockStr, "highlightAnim");

}