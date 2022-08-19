import { Response } from "express";
import * as OnboardingService from '../services/onboarding.service';
import { Pipe } from "../utils/common";

/**
 * [APP] get onboardings
 * @param req
 * @param res
 * @returns
 */
export const getOnboardings = async (req: any, res: Response) => {
    await Pipe(res, req, OnboardingService.getOnboardings());
}