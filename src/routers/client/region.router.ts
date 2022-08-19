import { Router } from 'express';
import { AuthenticationClient, xhrRequired } from '../../utils/common';
import { getRegions, getDistrictsOfRegion } from "../../controllers/region.controller";
import { validatorGetDistrictsOfRegion } from "../../validators/region.validator";

export default (regionRouter: Router): void => {
    regionRouter.route("/regions")
        .get(xhrRequired, AuthenticationClient, getRegions);
    regionRouter.route("/regions/districts")
        .get(xhrRequired, AuthenticationClient, validatorGetDistrictsOfRegion, getDistrictsOfRegion);
}