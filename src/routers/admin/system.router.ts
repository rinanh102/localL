import { Router } from 'express';

import { AuthenticationAdmin, xhrRequired } from '../../utils/common';
import { getSettingSystem, updateSettingSystem, getOnboardingAdmin, updateOnboarding } from "../../controllers/system.controller";
import { validatorUpdateSettingFile, validatorUpdateOnboardingFile } from '../../validators/system.validator';

export default (reviewRouter: Router): void => {
    reviewRouter.route("/system/get")
        .get(xhrRequired, AuthenticationAdmin, getSettingSystem);
    reviewRouter.route("/system/getOnboarding")
        .get(xhrRequired, AuthenticationAdmin, getOnboardingAdmin);
    reviewRouter.route("/system/update")
        .put(xhrRequired, AuthenticationAdmin, validatorUpdateSettingFile, updateSettingSystem);
    reviewRouter.route("/system/updateOnboarding")
        .put(xhrRequired, AuthenticationAdmin, validatorUpdateOnboardingFile, updateOnboarding);
}