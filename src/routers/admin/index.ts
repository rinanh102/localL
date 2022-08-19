import { Router } from "express";
const adminRouter: Router =  Router();

/** import */
import fileRouter from './file.router';
import userRouter from './user.router';
import dashBoardRouter from './dashboard.router';
import productRouter from './product.router';
import giftRouter from './gift.router';
import keywordRouter from './keyword.router';
import tasteRouter from './taste.router';
import snackRouter from './snack.router';
import categoriesRouter from './categories.router';
import regionRouter from './region.router';
import reviewRouter from './review.router';
import memberRouter from './member.router';
import bannerRouter from './banner.router';
import systemRouter from './system.router';

fileRouter(adminRouter);
userRouter(adminRouter);
dashBoardRouter(adminRouter);
productRouter(adminRouter);
giftRouter(adminRouter);
keywordRouter(adminRouter);
tasteRouter(adminRouter);
categoriesRouter(adminRouter);
snackRouter(adminRouter);
regionRouter(adminRouter);
reviewRouter(adminRouter);
memberRouter(adminRouter);
bannerRouter(adminRouter);
systemRouter(adminRouter);

export default adminRouter;