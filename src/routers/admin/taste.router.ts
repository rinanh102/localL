import { Router } from 'express';
import { AuthenticationAdmin, xhrRequired } from '../../utils/common';
import { getTastes } from "../../controllers/taste.controller";

export default (tasteRouter: Router): void => {
    tasteRouter.route("/taste/getList")
        .get(xhrRequired, AuthenticationAdmin, getTastes);
}