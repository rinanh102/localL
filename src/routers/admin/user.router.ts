import { Router } from 'express';
import { xhrRequired } from '../../utils/common';
import { loginWithEmailAdmin } from "../../controllers/user.controller";
import { validatorLoginWithEmailAdmin } from "../../validators/user.validator";

export default (userRouter: Router): void => {
    userRouter.route("/user/login")
        .post(xhrRequired, validatorLoginWithEmailAdmin, loginWithEmailAdmin);
}