import { Elysia } from 'elysia';
import { ItemController } from '@/controllers/item.controller';

export function setupRoutes(app: Elysia) {
    const itemController = new ItemController();

    return app.group('/api/v1', (router) => {
        itemController.registerRoutes(router);
        return router;
    });
}
