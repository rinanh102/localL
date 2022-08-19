import { Router } from 'express';
import { xhrRequired, AuthenticationAdmin } from '../../utils/common';
import { createKeyword, deleteKeyword } from "../../controllers/keyword.controller";
import { validatorCreateKeyword, validatorDeleteKeyword } from '../../validators/keyword.validator';

export default (keywordRouter: Router): void => {
    keywordRouter.route("/keyword/create")
        .post(xhrRequired, AuthenticationAdmin, validatorCreateKeyword, createKeyword)
    keywordRouter.route("/keyword/delete")
        .delete(xhrRequired, AuthenticationAdmin, validatorDeleteKeyword, deleteKeyword)
}