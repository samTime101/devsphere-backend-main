import type { Request, Response } from 'express';

export class AdminAuthController {
    async login(req: Request, res: Response) {
        res.json({
            message: 'Admin login endpoint',
        });
    }

    async logout(req: Request, res: Response) {
        res.json({
            message: 'Admin logout endpoint',
        });
    }
}

export default new AdminAuthController();
