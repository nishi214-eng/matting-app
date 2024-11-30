"use strict";
// features/uploadFile.ts
//userIdとuploadTypeで識別する
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const storage_1 = require("firebase/storage");
const firebase_1 = require("../infra/firebase");
const uuid_1 = require("uuid");
const uploadFile = (file, userId, uploadType) => __awaiter(void 0, void 0, void 0, function* () {
    if (!file)
        return null;
    const fileRef = (0, storage_1.ref)(firebase_1.storage, `uploads/${userId}/${uploadType}/${(0, uuid_1.v4)()}_${file.name}`); // ユーザーIDとアップロードタイプに基づいてパスを作成
    try {
        yield (0, storage_1.uploadBytes)(fileRef, file);
        const downloadURL = yield (0, storage_1.getDownloadURL)(fileRef);
        return downloadURL;
    }
    catch (error) {
        console.error('File upload error:', error);
        throw new Error('File upload failed');
    }
});
exports.uploadFile = uploadFile;
