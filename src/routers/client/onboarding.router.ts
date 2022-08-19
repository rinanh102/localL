import { Router } from 'express';
import { getOnboardings } from "../../controllers/onboarding.controller";
import { xhrRequired } from '../../utils/common';

export default (onboardingRouter: Router): void => {
    onboardingRouter.route("/onboarding/getList")
        .get(xhrRequired, getOnboardings)
}