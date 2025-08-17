import {Router} from 'express';
import { loginUser, logoutUser, registerUser } from '../controllers/user.Controller.js';
import { upload } from '../middlewares/mutler.Middleware.js';
import { verifyJWT } from '../middlewares/auth.Middleware.js';

const router = Router();
router.route('/register').post(
    upload.fields([
        { 
            name: 'avatar',
            maxCount: 1
        },
        { 
            name: 'coverImage',
            maxCount: 1
        }
    ]),
    registerUser
);
router.route('/login').post(loginUser);

//secured Routes
router.route('/logout').post(verifyJWT, logoutUser)


export default router;