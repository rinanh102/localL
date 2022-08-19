import { Router } from 'express';
import { AuthenticationClient, xhrRequired } from '../../utils/common';
import { getGifts, getGiftDetail, updateTotalClick } from '../../controllers/gift.controller';
import { validatorGetGifts, validatorGetGift, validatorUpdateTotalClick } from "../../validators/gift.validator";

export default (giftRouter: Router): void => {
    giftRouter.route("/main/gifts")
        .get(xhrRequired, AuthenticationClient, validatorGetGifts, getGifts)
    giftRouter.route("/main/gift/detail")
        .get(xhrRequired, AuthenticationClient, validatorGetGift, getGiftDetail)
    giftRouter.route("/gift/total-click")
        .get(xhrRequired, AuthenticationClient, validatorUpdateTotalClick, updateTotalClick);
}