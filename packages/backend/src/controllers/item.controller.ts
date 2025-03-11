import { Elysia } from 'elysia';
import { ItemService } from '@/services/item.service';
import {
  createItemSchema,
  updateFileContentSchema,
  renameItemSchema,
  idParamSchema,
} from '@/controllers/validations/item.validation';

export class ItemController {
  private itemService: ItemService;

  constructor() {
    this.itemService = new ItemService();
  }

  registerRoutes(app: Elysia<any>) {
    return app.group('/items', (router) =>
      router
        .get('/', () => this.itemService.getAllItems())
        .get('/:id/children', ({ params }) =>
          this.itemService.getChildren(params.id)
        )
        .get('/:id/content', ({ params }) =>
          this.itemService.getFileContent(params.id)
        )
        .get('/search', ({ query }) =>
          this.itemService.searchItems(query.q || '')
        )
        .post(
          '/',
          async ({ body }) => this.itemService.createItem(body),
          { body: createItemSchema }
        )
        .put(
          '/:id/content',
          async ({ params, body }) =>
            this.itemService.updateFileContent(params.id, body.content),
          {
            params: idParamSchema,
            body: updateFileContentSchema,
          }
        )
        .patch(
          '/:id',
          async ({ params, body }) =>
            this.itemService.renameItem(params.id, body.name),
          {
            params: idParamSchema,
            body: renameItemSchema,
          }
        )
        .delete('/:id', async ({ params }) =>
          this.itemService.deleteItem(params.id)
        )
    );
  }
}
