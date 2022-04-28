import { AES_getXtime } from "./AESCalculation";
import store from '../store/reduxStore';
import { aesActions } from '../store/aesStore-slice';

var animationMixColmnTimer = undefined;
let isMixColmnAnimating = false;

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

export function runMixColmnNextStep() {


    let aesStore = store.getState().aes

    var currentRowMixColmn = aesStore.currRowAnimation;
    var currentColMixColmn = aesStore.currColAnimation;

    if (currentColMixColmn > 3) {
        store.dispatch(aesActions.updateRowCol({ newRow: currentRowMixColmn + 1, newCol: 0 }));
        currentColMixColmn = 0;
        currentRowMixColmn += 1;
    }

    if (currentRowMixColmn > 3) {

        store.dispatch(aesActions.updateRowCol({ newRow: 0, newCol: 0 }));

        clearInterval(animationMixColmnTimer);
        currentRowMixColmn = 0;
        currentColMixColmn = 0;
        return;
    }

    var stateElemStr = "outputr" + currentRowMixColmn.toString() + "c" + currentColMixColmn.toString();

    var stateElemOldStr1 = "mainr0c" + currentColMixColmn.toString();
    var stateElemOldStr2 = "mainr1c" + currentColMixColmn.toString();
    var stateElemOldStr3 = "mainr2c" + currentColMixColmn.toString();
    var stateElemOldStr4 = "mainr3c" + currentColMixColmn.toString();

    var multiplyElemStr1 = "multiplyr" + currentRowMixColmn.toString() + "c0";
    var multiplyElemStr2 = "multiplyr" + currentRowMixColmn.toString() + "c1";
    var multiplyElemStr3 = "multiplyr" + currentRowMixColmn.toString() + "c2";
    var multiplyElemStr4 = "multiplyr" + currentRowMixColmn.toString() + "c3";

    var stateElem = document.getElementById(stateElemStr);

    var stateElemOld1 = document.getElementById(stateElemOldStr1);
    var stateElemOld2 = document.getElementById(stateElemOldStr2);
    var stateElemOld3 = document.getElementById(stateElemOldStr3);
    var stateElemOld4 = document.getElementById(stateElemOldStr4);

    var mulElem1 = document.getElementById(multiplyElemStr1);
    var mulElem2 = document.getElementById(multiplyElemStr2);
    var mulElem3 = document.getElementById(multiplyElemStr3);
    var mulElem4 = document.getElementById(multiplyElemStr4);

    stateElem.classList.add('scaleAnimslow');

    stateElemOld1.classList.add('scaleAnimslow');
    stateElemOld2.classList.add('scaleAnimslow');
    stateElemOld3.classList.add('scaleAnimslow');
    stateElemOld4.classList.add('scaleAnimslow');

    mulElem1.classList.add('scaleAnimslow');
    mulElem2.classList.add('scaleAnimslow');
    mulElem3.classList.add('scaleAnimslow');
    mulElem4.classList.add('scaleAnimslow');

    var newValue = 55;
    //console.log(newValue)
    var s0 = parseInt(stateElemOld1.textContent, 16),
        s1 = parseInt(stateElemOld2.textContent, 16);
    var s2 = parseInt(stateElemOld3.textContent, 16),
        s3 = parseInt(stateElemOld4.textContent, 16);
    var h = s0 ^ s1 ^ s2 ^ s3;

    const AES_xtime = AES_getXtime();
    let newState = [s0, s1, s2, s3]
    newState[0] ^= h ^ AES_xtime[s0 ^ s1];
    newState[1] ^= h ^ AES_xtime[s1 ^ s2];
    newState[2] ^= h ^ AES_xtime[s2 ^ s3];
    newState[3] ^= h ^ AES_xtime[s3 ^ s0];


    newValue = newState[currentRowMixColmn];
    newValue = newValue.toString(16).padStart(2, '0');
    console.log(newState)
    setTimeout(changeStateVal, 2000, newValue, stateElemStr);

    setTimeout(removeAnimClass, 6000, [stateElemOldStr1, stateElemOldStr2, stateElemOldStr3, stateElemOldStr4], "scaleAnimslow");
    setTimeout(removeAnimClass, 6000, [multiplyElemStr1, multiplyElemStr2, multiplyElemStr3, multiplyElemStr4], "scaleAnimslow");

    store.dispatch(aesActions.updateRowCol({ newRow: currentRowMixColmn, newCol: currentColMixColmn + 1 }));
    //currentColMixColmn += 1;
}

export function animateMixColmn() {
    if (isMixColmnAnimating) {
        clearInterval(animationMixColmnTimer);
        document.getElementById("animateButtonSpan").textContent = "Animate";
        isMixColmnAnimating = false;
        return
    }

    isMixColmnAnimating = true;
    document.getElementById("animateButtonSpan").textContent = "Stop";
    runMixColmnNextStep();
    animationMixColmnTimer = setInterval(runMixColmnNextStep, 6000);
}

export function reverseMixColmnStep() {

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