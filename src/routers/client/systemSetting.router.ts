import { Router } from 'express';
import { getSettingSystem, getKakaoUrl } from "../../controllers/system.controller";
import { xhrRequired } from '../../utils/common';

export default (systemSettingRouter: Router): void => {
    systemSettingRouter.route("/systemSetting/getDetail")
        .get(xhrRequired, getSettingSystem)
    systemSettingRouter.route("/systemSetting/kakaoUrl")
        .get(xhrRequired, getKakaoUrl)
}