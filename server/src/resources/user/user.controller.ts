import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpExecption from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/user/user.validation';
import UserService from '@/resources/user/user.service';

class PostController implements Controller {
    public path = '/users';
    public router = Router();
    private UserService = new UserService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/signup`,
            validationMiddleware(validate.signUp),
            this.signUp
        );
        this.router.post(
            `${this.path}/login`,
            validationMiddleware(validate.signIn),
            this.signIn
        );
    }

    private signUp = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { title, body } = req.body;
            const post = await this.UserService.signUp(title, body);
            res.status(201).json({post});

        } catch (err) {
            const e = err as Error;
            next( new HttpExecption(400, e.message));
        }
    };

    private signIn = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { email, password } = req.body;
            const token = await this.UserService.signIn(email, password);
            res.status(200).send({ token });
        } catch (err) {
            const e = err as Error;
            next(new HttpExecption(400, e.message));
        }
    };
}

export default PostController;