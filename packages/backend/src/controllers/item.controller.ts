import { Elysia } from 'elysia';
import { ItemService } from '@/services/item.service';

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
        .post('/', async ({ body }) => 
          this.itemService.createItem(body)
        )
        .put('/:id/content', async ({ params, body }) => 
          this.itemService.updateFileContent(params.id, body.content)
        )
        .patch('/:id', async ({ params, body }) => 
          this.itemService.renameItem(params.id, body.name)
        )
        .delete('/:id', async ({ params }) => 
          this.itemService.deleteItem(params.id)
        )
    );
  }
}
