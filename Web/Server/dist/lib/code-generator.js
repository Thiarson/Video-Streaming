"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerifCode = void 0;
const generateVerifCode = () => {
    return Math.floor(Math.random() * 9000) + 1000;
};
exports.generateVerifCode = generateVerifCode;
