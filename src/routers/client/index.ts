import { Router } from "express";
const clientRouter: Router = Router();

/** import */
import fileRouter from './file.router';
import userRouter from './user.router';
import onboardingRouter from './onboarding.router';
import systemSettingRouter from './systemSetting.router';
import keywordRouter from './keyword.router';
import bannerRouter from './banner.router';
import giftRouter from './gift.router';
import productRouter from './product.router';
import reviewRouter from './review.router';
import likeRouter from './like.router'
import categoryRouter from './categories.router';
import searchHistoryRouter from './searchHistory.router';
import mypageRouter from './mypage.router';
import regionRouter from './region.router';

userRouter(clientRouter);
fileRouter(clientRouter);
onboardingRouter(clientRouter);
systemSettingRouter(clientRouter);
keywordRouter(clientRouter);
bannerRouter(clientRouter);
giftRouter(clientRouter);
productRouter(clientRouter);
reviewRouter(clientRouter);
likeRouter(clientRouter);
categoryRouter(clientRouter);
searchHistoryRouter(clientRouter);
mypageRouter(clientRouter);
regionRouter(clientRouter);


export default clientRouter;