import store from '../store/reduxStore';
import { aesActions } from '../store/aesStore-slice';

let shiftRowAnimationTimer = undefined;
var isShiftRowAnimating = false;

function removeShiftRowAnim(currentRow) {
    let c0 = document.getElementById("mainr" + currentRow + "c0");
    c0.classList.remove('translateAroundAnimslow');
    let c1 = document.getElementById("mainr" + currentRow + "c1");
    c1.classList.remove('translateSideAnimSlow');
    let c2 = document.getElementById("mainr" + currentRow + "c2");
    c2.classList.remove('translateSideAnimSlow');
    let c3 = document.getElementById("mainr" + currentRow + "c3");
    c3.classList.remove('translateSideAnimSlow');

    let c0val = c0.textContent;
    let c1val = c1.textContent;
    let c2val = c2.textContent;
    let c3val = c3.textContent;

    c0.textContent = c1val
    c1.textContent = c2val
    c2.textContent = c3val
    c3.textContent = c0val

}

function translateToLeftShiftRow(elemClassStr) {
    document.getElementById(elemClassStr).classList.add('translateSideAnimSlow');
}


function shiftOneElem(currentRow) {

    let elemClassStr = "mainr" + currentRow.toString() + "c0";
    document.getElementById(elemClassStr).classList.add('translateAroundAnimslow');

    let currCol = 1
    let initialTimeout = 1200;
    while (currCol < 4) {
        elemClassStr = "mainr" + currentRow.toString() + "c" + (currCol).toString()
        setTimeout(translateToLeftShiftRow, initialTimeout, elemClassStr);
        initialTimeout += 1200;
        currCol++;
    }

    setTimeout(removeShiftRowAnim, initialTimeout + 1000, currentRow);
}

function removeAnimClass(elemStrs, className) {

    for (const elemStr of elemStrs) {
        let elem = document.getElementById(elemStr);
        elem.classList.remove(className);

    }
}

export function runShiftRowNextStep() {

    let aesStore = store.getState().aes

    var currShiftRow = aesStore.currRowAnimation;
    if (currShiftRow == 0) { currShiftRow = 1; }

    if (currShiftRow >= 4) {
        currShiftRow = 1;
        store.dispatch(aesActions.updateRowCol({ newRow: currShiftRow, newCol: 0 }));
        return;
    }

    let initialTimeout = 0;

    for (let i = 0; i < currShiftRow; i++) {
        setTimeout(shiftOneElem, initialTimeout, currShiftRow, i);
        initialTimeout += 6000;
    }

    if (isShiftRowAnimating) {
        clearInterval(shiftRowAnimationTimer);
        if (currShiftRow < 3) {
            shiftRowAnimationTimer = setInterval(runShiftRowNextStep, 6000 * currShiftRow);
        } else {
            document.getElementById("animateButtonSpan").textContent = "Animate";
            isShiftRowAnimating = false;
        }
    }
    currShiftRow++;
    store.dispatch(aesActions.updateRowCol({ newRow: currShiftRow, newCol: 0 }));


    //animationTimer = setInterval(translateToLeft, 1200, 1);
}

export function animateShiftRows() {
    if (isShiftRowAnimating) {
        clearInterval(shiftRowAnimationTimer);
        document.getElementById("animateButtonSpan").textContent = "Animate";
        isShiftRowAnimating = false;
        return
    }

    isShiftRowAnimating = true;
    document.getElementById("animateButtonSpan").textContent = "Stop";
    runShiftRowNextStep();
    //animationTimer = setInterval(runNextStep, 6000 * row);
}


export function reverseShiftRowStep() {

    let aesStore = store.getState().aes

    var currentRowShiftRow = aesStore.currRowAnimation;

    currentRowShiftRow -= 1;

    if (currentRowShiftRow < 1) {
        currentRowShiftRow = 1;
        store.dispatch(aesActions.updateRowCol({ newRow: currentRowShiftRow, newCol: 0 }));
        return;
    }
    store.dispatch(aesActions.updateRowCol({ newRow: currentRowShiftRow, newCol: 0 }));
    for (let col = 0; col < 4; col++) {
        var blockStr = "mainr" + currentRowShiftRow.toString() + "c" + col.toString();
        var blockElem = document.getElementById(blockStr);
        blockElem.textContent = aesStore.dataState[col * 4 + currentRowShiftRow].toString(16).padStart(2, '0');
        blockElem.classList.add('highlightAnim');
        setTimeout(removeAnimClass, 1000, [blockStr], "highlightAnim");
    }


}