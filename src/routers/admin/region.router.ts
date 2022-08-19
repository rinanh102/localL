import { Router } from 'express';
import { AuthenticationAdmin, xhrRequired } from '../../utils/common';
import { getRegions, getCities, getDistricts } from "../../controllers/region.controller";
import { validatorGetDistrictsOfRegion } from '../../validators/region.validator';

export default (regionRouter: Router): void => {
    regionRouter.route("/region/getList")
        .get(xhrRequired, AuthenticationAdmin, getRegions);
    regionRouter.route("/region/cities")
        .get(xhrRequired, AuthenticationAdmin, getCities);
    regionRouter.route("/region/districts")
        .get(xhrRequired, AuthenticationAdmin, validatorGetDistrictsOfRegion, getDistricts);
}