import store from '../store/reduxStore';
import { desActions } from '../store/desStore-slice';

var animationDESTimer = undefined;
let isDESAnimating = false;

function removeAnimClass(elemStrs, className) {

    for (const elemStr of elemStrs) {
        let elem = document.getElementById(elemStr);
        elem.classList.remove(className);

    }
}

function removeFade(elemStr, value) {
    let elem = document.getElementById(elemStr);
    elem.innerHTML = value;
    elem.classList.remove("fade");
}

function changeStateVal(value, stateElemStr) {
    let elem = document.getElementById(stateElemStr);

    // removing the class for leave state
    elem.classList.add("fade");

    setTimeout(removeFade, 1000, stateElemStr, value);
}

export function runNextDESStep() {

    let desStore = store.getState().des;

    let currOper = desStore.operation;
    var currAnimationIndx = desStore.currAnimationIndx;

    if (currAnimationIndx > 16) {
        store.dispatch(desActions.updateIndex(1));
        currAnimationIndx = 1;
    }

    var elemStr = "mainl" + currAnimationIndx.toString();
    var fStr = "desf";
    var outStr = "outr" + currAnimationIndx.toString();

    if (currAnimationIndx > 8) {
        elemStr = "mainr" + (currAnimationIndx % 9 +1).toString();
        fStr = "desf" + (currAnimationIndx % 9 +1).toString();
        outStr = "outl" + (currAnimationIndx % 9 +1).toString();
    }

    var mainElem = document.getElementById(elemStr);
    var outElem = document.getElementById(outStr);
    var fElem = document.getElementById(fStr);

    mainElem.classList.add('scaleAnimslow');
    if (currAnimationIndx > 8) {
        fElem.classList.add('scaleAnimslow');
    }
    outElem.classList.add('scaleAnimslow');


    var fval = 0;
    if (currAnimationIndx > 8) {
        fval = parseInt(fElem.textContent);
    }
    var newValue = parseInt(mainElem.textContent) ^ fval;
    newValue = newValue.toString();

    setTimeout(removeAnimClass, 6000, [elemStr, fStr, outStr], 'scaleAnimslow');

    setTimeout(changeStateVal, 2000, newValue, outStr);

    store.dispatch(desActions.updateIndex(currAnimationIndx + 1));
}