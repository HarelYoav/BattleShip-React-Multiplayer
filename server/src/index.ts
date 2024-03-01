import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import validateEnv from '@/utils/validateEnv';
import PostController from '@/resources/user/user.controller';

validateEnv();

const app = new App([
    new PostController()
], Number(5000));

app.listen();
