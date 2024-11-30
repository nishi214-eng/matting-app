"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortName = void 0;
const sortName = (name1, name2) => {
    let nameArray = [name1, name2];
    // 日本語に基づいてソート
    nameArray.sort((a, b) => a.localeCompare(b, 'ja'));
    return nameArray;
};
exports.sortName = sortName;
