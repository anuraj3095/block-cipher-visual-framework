export const Step = {
    SubBytes: 'SubBytes',
    ShiftRows: 'ShiftRows',
    MixColumns: 'MixColumns',
    AddRoundKey: 'AddRoundKey'
};

const StepIndx = {
    SubBytes: 0,
    ShiftRows: 1,
    MixColumns: 2,
    AddRoundKey: 3
}



const stepArray = [Step.SubBytes, Step.ShiftRows, Step.MixColumns, Step.AddRoundKey]

export function getNextAESStep(curStep, specialRound, operation) {

    let stepIndx = StepIndx[curStep];

    if (operation == "Encryption" && specialRound && curStep == Step.ShiftRows) {
        return stepArray[(stepIndx + 2 + 4) % 4];
    }

    if (operation == "Decryption" && specialRound && curStep == Step.AddRoundKey) {
        return stepArray[(stepIndx - 2 + 4) % 4];
    }


    if (operation == "Encryption") {
        return stepArray[(stepIndx + 1 + 4) % 4];
    } else {
        return stepArray[(stepIndx - 1 + 4) % 4];
    }

}

export function getPrevAESStep(curStep, specialRound, operation) {

    let stepIndx = StepIndx[curStep];

    if (operation == "Encryption" && specialRound && curStep == Step.AddRoundKey) {
        return stepArray[(stepIndx - 2 + 4) % 4];
    }

    if (operation == "Decryption" && specialRound && curStep == Step.ShiftRows) {
        return stepArray[(stepIndx + 2 + 4) % 4];
    }

    if (operation == "Encryption") {
        return stepArray[(stepIndx - 1 + 4) % 4];
    } else {
        return stepArray[(stepIndx + 1 + 4) % 4];
    }
}

export function getStepIndex(step) {
    return StepIndx[step] + 1;
}

export const atomicSteps = [16, 4, 1, 1]