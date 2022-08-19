import { Router } from 'express';

import { AuthenticationAdmin, xhrRequired } from '../../utils/common';
import { getSnacks, getSnack, deleteSnack, updateSnack, createSnack, deleteSnacks } from "../../controllers/snack.controller";
import { validatorGetListSnack, validatorGetDetailSnack, validatorCreateSnack, validatorUpdateSnack, validatorDeleteSnack, validatorDeleteSnacks } from '../../validators/snack.validator';

export default (snackRouter: Router): void => {
    snackRouter.route("/snack/getList")
        .get(xhrRequired, AuthenticationAdmin, validatorGetListSnack, getSnacks);
    snackRouter.route("/snack/getSnack")
        .get(xhrRequired, AuthenticationAdmin, validatorGetDetailSnack, getSnack);
    snackRouter.route("/snack/create")
        .post(xhrRequired, AuthenticationAdmin, validatorCreateSnack, createSnack);
    snackRouter.route("/snack/update")
        .put(xhrRequired, AuthenticationAdmin, validatorUpdateSnack, updateSnack);
    snackRouter.route("/snack/delete")
        .delete(xhrRequired, AuthenticationAdmin, validatorDeleteSnack, deleteSnack);
    snackRouter.route("/snack/deletes")
        .delete(xhrRequired, AuthenticationAdmin, validatorDeleteSnacks, deleteSnacks);
}