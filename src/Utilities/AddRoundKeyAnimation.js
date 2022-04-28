import store from '../store/reduxStore';
import { aesActions } from '../store/aesStore-slice';

var animationAddRoundKeyTimer = undefined;
let isAddRoundKeyAnimating = false;

function removeAnim() {
    console.log(document.getElementById("sboxr1").classList)
}

function removeFade(elemStr, value) {
    let elem = document.getElementById(elemStr);
    elem.innerHTML = value;
    elem.classList.remove("fade");
}

function removeAnimClass(elemStrs, className) {

    for (const elemStr of elemStrs) {
        let elem = document.getElementById(elemStr);
        elem.classList.remove(className);

    }
}

function changeStateVal(value, stateElemStr) {
    //console.log(value);
    let elem = document.getElementById(stateElemStr);

    // removing the class for leave state
    elem.classList.add("fade");

    setTimeout(removeFade, 1000, stateElemStr, value);
}

export function runAddRoundKeyNextStep() {

    let aesStore = store.getState().aes

    var currentRowAddRoundKey = aesStore.currRowAnimation;
    var currentColAddRoundKey = aesStore.currColAnimation;

    if (currentColAddRoundKey > 3) {

        currentColAddRoundKey = 0;
        currentRowAddRoundKey += 1;
        store.dispatch(aesActions.updateRowCol({ newRow: currentRowAddRoundKey, newCol: currentColAddRoundKey }));
    }

    if (currentRowAddRoundKey > 3) {
        clearInterval(animationAddRoundKeyTimer);
        store.dispatch(aesActions.updateRowCol({ newRow: 0, newCol: 0 }));
        currentRowAddRoundKey = 0;
        currentColAddRoundKey = 0;
        return;
    }

    var stateElemStr = "outputr" + currentRowAddRoundKey.toString() + "c" + currentColAddRoundKey.toString();
    var stateElemOldStr = "mainr" + currentColAddRoundKey.toString() + "c" + currentRowAddRoundKey.toString();
    var keyElemOldStr = "keyr" + currentRowAddRoundKey.toString() + "c" + currentColAddRoundKey.toString();

    var stateElem = document.getElementById(stateElemStr);
    var stateElemOld = document.getElementById(stateElemOldStr);
    var keyElem = document.getElementById(keyElemOldStr);

    stateElem.classList.add('scaleAnimslow');
    stateElemOld.classList.add('scaleAnimslow');
    keyElem.classList.add('scaleAnimslow');

    var newValue = parseInt(stateElemOld.textContent, 16) ^ parseInt(keyElem.textContent, 16);
    //console.log(newValue)
    newValue = newValue.toString(16).padStart(2, '0');
    //console.log("16 hex string - " + newValue)

    setTimeout(removeAnimClass, 6000, [stateElemOldStr, keyElemOldStr, stateElemStr], 'scaleAnimslow');

    setTimeout(changeStateVal, 2000, newValue, stateElemStr);

    store.dispatch(aesActions.updateRowCol({ newRow: currentRowAddRoundKey, newCol: currentColAddRoundKey + 1 }));
    //currentColAddRoundKey += 1;
}

export function animateAddRoundKey() {
    if (isAddRoundKeyAnimating) {
        clearInterval(animationAddRoundKeyTimer);
        document.getElementById("animateButtonSpan").textContent = "Animate";
        isAddRoundKeyAnimating = false;
        return
    }

    isAddRoundKeyAnimating = true;
    document.getElementById("animateButtonSpan").textContent = "Stop";
    runAddRoundKeyNextStep();
    animationAddRoundKeyTimer = setInterval(runAddRoundKeyNextStep, 6000);
}


export function reverseAddRoundKeyStep() {

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

    var blockStr = "outputr" + currentRowSubByte.toString() + "c" + currentColSubByte.toString();
    var blockElem = document.getElementById(blockStr);

    blockElem.textContent = "00";

    blockElem.classList.add('highlightAnim');
    setTimeout(removeAnimClass, 1000, [blockStr], "highlightAnim");

}