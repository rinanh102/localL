import { Router } from 'express';

import { AuthenticationAdmin, xhrRequired } from '../../utils/common';
import { getMemberGraphs, getReviews, getGifts, getProducts, searchDashBoard } from "../../controllers/dashboard.controllter";
import { validatorGetMemberGraphsFile, validatorSearchDashBoard } from '../../validators/dashboard.validator';

export default (dashboardRouter: Router): void => {
    dashboardRouter.route("/dashboard/getMembers")
        .get(xhrRequired, AuthenticationAdmin, validatorGetMemberGraphsFile, getMemberGraphs);
    dashboardRouter.route("/dashboard/getReviews")
        .get(xhrRequired, AuthenticationAdmin, getReviews);
    dashboardRouter.route("/dashboard/getGifts")
        .get(xhrRequired, AuthenticationAdmin, getGifts);
    dashboardRouter.route("/dashboard/getProducts")
        .get(xhrRequired, AuthenticationAdmin, getProducts);
    dashboardRouter.route("/dashboard/search")
        .get(xhrRequired, AuthenticationAdmin, validatorSearchDashBoard, searchDashBoard);
}