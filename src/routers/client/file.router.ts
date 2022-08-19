import { Router } from 'express';
import { AuthenticationClient, xhrRequired } from '../../utils/common';
import { uploadFile, deleteFile, uploadImage  } from "../../controllers/file.controller";
import { UploadImage } from '../../libs/multer';
import { validatorDeleteFile } from '../../validators/file.validator';

export default (fileRouter: Router): void => {
    fileRouter.route("/file/upload")
        .post(xhrRequired, AuthenticationClient, UploadImage.single("file"), uploadImage)
    fileRouter.route("/file")
        .delete(xhrRequired, AuthenticationClient, validatorDeleteFile, deleteFile)
}