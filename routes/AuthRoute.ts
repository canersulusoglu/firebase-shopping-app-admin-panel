import { Router } from 'express'
import { AuthController } from '../controllers'

const router = Router();

/**
 * Routing for Auth
 */
const authController = new AuthController();

router.post("/login", (req, res) => authController.login(req, res));
router.post("/logout", (req, res) => authController.logout(req, res));
router.post("/loginControl", (req, res) => authController.loginControl(req, res));

export default router;