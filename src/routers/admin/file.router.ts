import { Router } from 'express';
import { xhrRequired, AuthenticationAdmin } from '../../utils/common';
import { uploadFile, deleteFile, deleteFiles, deleteFilesViaAdmin } from "../../controllers/file.controller";
import { UploadImage } from '../../libs/multer';
import { validatorDeleteFile, validatorDeleteFiles } from '../../validators/file.validator';

export default (fileRouter: Router): void => {
    fileRouter.route("/file/upload")
        .post(xhrRequired, AuthenticationAdmin, UploadImage.single("file"), uploadFile)
    fileRouter.route("/file/delete")
        .delete(xhrRequired, AuthenticationAdmin, validatorDeleteFile, deleteFile)
    fileRouter.route("/file/background")
        .delete(deleteFiles)
    fileRouter.route("/file/deletes")
        .delete(xhrRequired, AuthenticationAdmin, validatorDeleteFiles, deleteFilesViaAdmin)
}