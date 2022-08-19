import { Router } from 'express';

import { AuthenticationAdmin, xhrRequired } from '../../utils/common';
import { createGift, editGift, deleteGift, getDetail, getListGift, searchGiftViaName, deleteGifts } from "../../controllers/gift.controller";
import {
    validatorCreateGift,
    validatorEditGift,
    validatorDeleteGift,
    validatorGetGift,
    validatorGetListGift,
    validatorSearchProductViaName,
    validatorDeleteGifts
} from '../../validators/gift.validator';

export default (giftRouter: Router): void => {
    giftRouter.route("/gift/create")
        .post(xhrRequired, AuthenticationAdmin, validatorCreateGift, createGift);
    giftRouter.route("/gift/edit")
        .put(xhrRequired, AuthenticationAdmin, validatorEditGift, editGift);
    giftRouter.route("/gift/delete")
        .delete(xhrRequired, AuthenticationAdmin, validatorDeleteGift, deleteGift);
    giftRouter.route("/gift/deletes")
        .delete(xhrRequired, AuthenticationAdmin, validatorDeleteGifts, deleteGifts);
    giftRouter.route("/gift/getDetail")
        .get(xhrRequired, AuthenticationAdmin, validatorGetGift, getDetail);
    giftRouter.route("/gift/getList")
        .get(xhrRequired, AuthenticationAdmin, validatorGetListGift, getListGift);
    giftRouter.route("/gift/searchName")
        .get(xhrRequired, AuthenticationAdmin, validatorSearchProductViaName, searchGiftViaName);
}