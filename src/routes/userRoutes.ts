import {Router} from 'express';
import {register, login, getProfile, updateProfile, getAllProfiles} from "../controllers/userController";
import {authenticate} from "../middleware/auth";

const router = Router();

router.post('/user/register', register);
router.post('/user/login', login);
router.get('/profile/:id', authenticate, getProfile);
router.put('/profile/:id', authenticate, updateProfile);
router.get('/profiles', getAllProfiles)

export default router
