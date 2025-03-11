import { Elysia } from 'elysia';
import { ItemController } from '@/controllers/item.controller';
import { LinkController } from '@/controllers/link.controller';

export function setupRoutes(app: Elysia) {
    const itemController = new ItemController();
    const linkController = new LinkController();

    app.get('/:shortenedId', async ({ params }) => {
        const originalUrl = await linkController.getShortenedLink(params.shortenedId);

        if (!originalUrl) {
            throw new Error('Shortened Link not found')
        }
        return new Response(null, {
            status: 302,
            headers: { Location: originalUrl }
        });
    })

    return app.group('/api/v1', (router: any) => {
        itemController.registerRoutes(router);
        linkController.registerRoutes(router);

        return router;
    });
}
