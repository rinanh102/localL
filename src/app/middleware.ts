import  { Application } from 'express';
import BodyParser from 'body-parser';
import CookieParser from 'cookie-parser';
import UserAgent from 'express-useragent';
import Cors from 'cors';
import Logger from 'morgan';

export default async (app: Application): Promise<any> => {
	// Parse URL data
	app.use(CookieParser());
    app.use(Cors());
	app.use(BodyParser.json());
	app.use(BodyParser.urlencoded({ extended: true }));
	app.use(UserAgent.express());
	app.use(Logger('common'));
};