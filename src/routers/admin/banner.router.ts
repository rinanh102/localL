import { Router } from 'express';

import { AuthenticationAdmin, xhrRequired } from '../../utils/common';
import { getBannerAdmin, updateBannerAdmin } from "../../controllers/banner.controller";
import { validatorGetBanner, validatorUpdateBanner } from '../../validators/banners.validator';

export default (bannerRouter: Router): void => {
    bannerRouter.route("/banner/getList")
        .get(xhrRequired, AuthenticationAdmin, validatorGetBanner, getBannerAdmin);
    bannerRouter.route("/banner/updateList")
        .put(xhrRequired, AuthenticationAdmin, validatorGetBanner, validatorUpdateBanner, updateBannerAdmin);
}