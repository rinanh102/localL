import { Request, Response } from "express";
import * as SystemSettingService from "../services/system.service";
import * as OnboardingService from "../services/onboarding.service";
import { Pipe } from "../utils/common";

/**
 * [ADMIN] get system setting via type
 * @param req
 * @param res
 * @returns
 */
export const getSettingSystem = async (req: Request, res: Response) => {
    await Pipe(res, req.body, SystemSettingService.getSettingSystem())
}

/**
 * [ADMIN] update system setting via type
 * @param req
 * @param res
 * @returns
 */
export const updateSettingSystem = async (req: Request, res: Response) => {
    await Pipe(res, req.body, SystemSettingService.updateSettingSystem(req.body));
}

/**
 * [ADMIN] get onboardings admin
 * @param req
 * @param res
 * @returns
 */
export const getOnboardingAdmin = async (req: any, res: Response) => {
    await Pipe(res, req.body, OnboardingService.getOnboardingAdmin())
}

/**
 * [ADMIN] get onboardings admin
 * @param req
 * @param res
 * @returns
 */
export const updateOnboarding = async (req: any, res: Response) => {
    await Pipe(res, req.body, OnboardingService.updateOnboarding(req.body));
}
/**
 * [APP] get Kakao URL
 * @param req
 * @param res
 * @returns
 */
 export const getKakaoUrl = async (req: Request, res: Response) => {
    await Pipe(res, req.body, SystemSettingService.getKakaoUrl())
}
