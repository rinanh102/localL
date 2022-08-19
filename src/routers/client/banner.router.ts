import { Router } from 'express';
import { getTitle, getBanners } from "../../controllers/banner.controller";
import { AuthenticationClient, xhrRequired } from '../../utils/common';
import { validatorGetBanner } from '../../validators/banners.validator';

export default (bannerRouter: Router): void => {
    bannerRouter.route("/main/title")
        .get(xhrRequired, AuthenticationClient, getTitle)
    bannerRouter.route("/main/banners")
        .get(xhrRequired, AuthenticationClient, validatorGetBanner, getBanners)
}
