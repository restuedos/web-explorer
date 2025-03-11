import { Elysia } from 'elysia';
import { LinkService } from '@/services/link.service';
import { createLinkSchema, idParamSchema } from '@/controllers/validations/link.validation';

export class LinkController {
  private linkService: LinkService;

  constructor() {
    this.linkService = new LinkService();
  }

  registerRoutes(app: Elysia<any>) {
    return app.group('/links', (router) =>
      router
        .get('/', () => this.linkService.getAllLinks())
        .post(
          '/',
          async ({ body }) => this.linkService.createLink(body),
          { body: createLinkSchema }
        )
        .delete(
          '/:id',
          async ({ params }) => this.linkService.deleteLink(params.id),
          { params: idParamSchema }
        )
    );
  }

  async getShortenedLink(shortenedId: string) {
    return await this.linkService.getShortenedLink(shortenedId);
  }
}
