"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTime = exports.generateKey = exports.replaceSpecialChar = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
const replaceSpecialChar = (str) => {
    const correspondence = {
        'é': 'e',
        'è': 'e',
        'ê': 'e',
        'ë': 'e',
        'à': 'a',
        'â': 'a',
        'ä': 'a',
        'ô': 'o',
        'ö': 'o',
        'û': 'u',
        'ü': 'u',
        'ç': 'c',
        '\'': '_',
        ' ': '_',
    };
    const regex = /[éèêëàâäôöûüç' ]/g;
    const newStr = str.replace(regex, (match) => correspondence[match]);
    return newStr;
};
exports.replaceSpecialChar = replaceSpecialChar;
const generateKey = (keyLength = 8) => node_crypto_1.default.randomBytes(keyLength).toString('base64url');
exports.generateKey = generateKey;
const generateTime = (duration) => {
    const time = new Date();
    const temp = duration.split(":");
    time.setHours(parseInt(temp[0]));
    time.setMinutes(parseInt(temp[1]));
    time.setSeconds(parseInt(temp[2]));
    return time;
};
exports.generateTime = generateTime;
