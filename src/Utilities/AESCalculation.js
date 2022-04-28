import { getElemFromSbox, getElemFromSboxInv } from "./SBoxValues"

var AES_ShiftRowTab = [0, 5, 10, 15, 4, 9, 14, 3, 8, 13, 2, 7, 12, 1, 6, 11];

var AES_ShiftRowTab_Inv = new Array(16);
for (let i = 0; i < 16; i++)
    AES_ShiftRowTab_Inv[AES_ShiftRowTab[i]] = i;

var AES_xtime = new Array(256);

for (let i = 0; i < 128; i++) {
    AES_xtime[i] = i << 1;
    AES_xtime[128 + i] = (i << 1) ^ 0x1b;
}
var AES_KeyStates = {}
var AES_DataStates = {}

export function AES_getXtime() {
    return AES_xtime
}

function AES_SubBytes(state, oper) {

    if (oper === "Encryption") {
        for (let i = 0; i < 16; i++)
            state[i] = getElemFromSbox(state[i]);
    } else {
        for (let i = 0; i < 16; i++)
            state[i] = getElemFromSboxInv(state[i]);
    }
}

function AES_AddRoundKey(state, rkey) {
    for (let i = 0; i < 16; i++)
        state[i] ^= rkey[i];
}

function AES_ShiftRows(state, shifttab) {
    var h = [].concat(state);
    for (let i = 0; i < 16; i++)
        state[i] = h[shifttab[i]];
}

function AES_MixColumns(state) {
    for (var i = 0; i < 16; i += 4) {
        var s0 = state[i + 0],
            s1 = state[i + 1];
        var s2 = state[i + 2],
            s3 = state[i + 3];
        var h = s0 ^ s1 ^ s2 ^ s3;
        state[i + 0] ^= h ^ AES_xtime[s0 ^ s1];
        state[i + 1] ^= h ^ AES_xtime[s1 ^ s2];
        state[i + 2] ^= h ^ AES_xtime[s2 ^ s3];
        state[i + 3] ^= h ^ AES_xtime[s3 ^ s0];
    }
}

function AES_MixColumns_Inv(state) {
    for (var i = 0; i < 16; i += 4) {
        var s0 = state[i + 0],
            s1 = state[i + 1];
        var s2 = state[i + 2],
            s3 = state[i + 3];
        var h = s0 ^ s1 ^ s2 ^ s3;
        var xh = AES_xtime[h];
        var h1 = AES_xtime[AES_xtime[xh ^ s0 ^ s2]] ^ h;
        var h2 = AES_xtime[AES_xtime[xh ^ s1 ^ s3]] ^ h;
        state[i + 0] ^= h1 ^ AES_xtime[s0 ^ s1];
        state[i + 1] ^= h2 ^ AES_xtime[s1 ^ s2];
        state[i + 2] ^= h1 ^ AES_xtime[s2 ^ s3];
        state[i + 3] ^= h2 ^ AES_xtime[s3 ^ s0];
    }
}

function AES_expandKey(key) {
    var kl = 16,
        ks, Rcon = 1;
    ks = 16 * (10 + 1);

    for (var i = kl; i < ks; i += 4) {
        var temp = key.slice(i - 4, i);
        if (i % kl === 0) {
            temp = new Array(getElemFromSbox(temp[1]) ^ Rcon, getElemFromSbox(temp[2]),
                getElemFromSbox(temp[3]), getElemFromSbox(temp[0]));
            if ((Rcon <<= 1) >= 256)
                Rcon ^= 0x11b;
        } else if ((kl > 24) && (i % kl === 16))
            temp = new Array(getElemFromSbox(temp[0]), getElemFromSbox(temp[1]),
                getElemFromSbox(temp[2]), getElemFromSbox(temp[3]));
        for (var j = 0; j < 4; j++)
            key[i + j] = key[i + j - kl] ^ temp[j];
    }
}

function AES_captureRoundKeys(key) {

    for (var i = 0; i < key.length; i += 16) {
        AES_KeyStates[i / 16] = key.slice(i, i + 16)
    }
}

function AES_captureAESState(data, round, step) {
    let stateKey = round.toString() + step.toString();
    AES_DataStates[stateKey] = data.slice();
}

function AES_performEncryption(block, key) {
    var l = key.length;
    AES_captureAESState(block, 0, 4)
    AES_AddRoundKey(block, key.slice(0, 16));

    for (var i = 16; i < l - 16; i += 16) {
        AES_captureAESState(block, i / 16, 1)
        AES_SubBytes(block, "Encryption");

        AES_captureAESState(block, i / 16, 2)
        AES_ShiftRows(block, AES_ShiftRowTab);

        AES_captureAESState(block, i / 16, 3)
        AES_MixColumns(block);

        AES_captureAESState(block, i / 16, 4)
        AES_AddRoundKey(block, key.slice(i, i + 16));

        //printStateInHex(block, i/16)
    }

    AES_captureAESState(block, 10, 1)
    AES_SubBytes(block, "Encryption");

    AES_captureAESState(block, 10, 2)
    AES_ShiftRows(block, AES_ShiftRowTab);

    AES_captureAESState(block, 10, 4)
    AES_AddRoundKey(block, key.slice(i, l));

    AES_captureAESState(block, "final ", "state")
}

function AES_performDecryption(block, key) {
    var l = key.length;

    AES_captureAESState(block, 1, 4)
    AES_AddRoundKey(block, key.slice(0, 16));

    AES_captureAESState(block, 1, 2)
    AES_ShiftRows(block, AES_ShiftRowTab_Inv);

    AES_captureAESState(block, 1, 1)
    AES_SubBytes(block, "Decryption");

    for (var i = 16; i < l - 16; i += 16) {
        AES_captureAESState(block, i / 16 + 1, 4)
        AES_AddRoundKey(block, key.slice(i, i + 16));

        AES_captureAESState(block, i / 16 + 1, 3)
        AES_MixColumns_Inv(block);

        AES_captureAESState(block, i / 16 + 1, 2)
        AES_ShiftRows(block, AES_ShiftRowTab_Inv);

        AES_captureAESState(block, i / 16 + 1, 1)
        AES_SubBytes(block, "Decryption");
    }

    AES_captureAESState(block, 11, 4)
    AES_AddRoundKey(block, key.slice(l - 16, l));

    AES_captureAESState(block, "final ", "state")
}

function converTextToHex(str) {

    str = str.padEnd(16);
    let hexData = []

    for (var i = 0; i < str.length; i++) {
        hexData.push(str.charCodeAt(i));
    }
    return hexData;
}

function printKeyInHex(key, keyNumber) {
    console.log("\nRoundKey - start");
    let str = ""
    for (var i = 0; i < 16; i++) {

        str += key[i].toString(16).padStart(2, "0");
        str += ", "

        if ((i + 1) % 4 === 0) {
            console.log(str);
            str = "";
        }
    }
}

function printStateInHex(state, stateRound) {
    console.log("\nState - " + stateRound);
    let str = ""
    for (var i = 0; i < 16; i++) {

        str += state[i].toString(16).padStart(2, "0");
        str += ", "

        if ((i + 1) % 4 === 0) {
            console.log(str);
            str = "";
        }
    }
}

export function doAESEncryption(input, key) {

    input = converTextToHex(input);

    //console.log(key);
    key = converTextToHex(key);
    //printKeyInHex(key)

    AES_expandKey(key);
    AES_captureRoundKeys(key);
    AES_performEncryption(input, key);
    printStateInHex(input, "Final Encrypted Text")

    //console.log(AES_KeyStates);
    //console.log(AES_DataStates);

}

export function doAESDecryption(input, key) {

    input = converTextToHex(input);

    //console.log(key);
    key = converTextToHex(key);
    //printKeyInHex(key)

    AES_expandKey(key);

    let dkey = [];

    for (let i = 176; i > 0; i -= 16) {
        const k = key.slice(i - 16, i);
        dkey.push(...k);
    }
    AES_captureRoundKeys(dkey);
    AES_performDecryption(input, dkey);
    printStateInHex(input, "Final Decrypted Text")

    //console.log(AES_KeyStates);
    //console.log(AES_DataStates);

}

export function AES_getDataState(round, step) {
    let stateKey = round.toString() + step.toString();
    return AES_DataStates[stateKey];
}

export function AES_getKeyState(round) {
    return AES_KeyStates[round];
}