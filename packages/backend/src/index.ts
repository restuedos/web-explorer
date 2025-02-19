import 'reflect-metadata';
import { Elysia, ValidationError } from 'elysia';
import { cors } from '@elysiajs/cors';
import { Item } from './entities/Item';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "explorer_db",
  synchronize: true,
  logging: true,
  entities: [Item],
});

const app = new Elysia()
  .use(cors({
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
  }))
  .onError(({ code, error }: { code: string; error: Error | ValidationError }) => {
    return new Response(JSON.stringify({ error: error.message }), {
      status: code === 'NOT_FOUND' ? 404 : 500
    });
  });

await AppDataSource.initialize()
  .then(async () => {
    const itemRepository = AppDataSource.getRepository(Item);

    /**
     * Fetch all items as a nested structure with sorting
     */
    app.get('/api/items', async () => {
      const items = await itemRepository.find({
        relations: ['parent'], // Fetch parent relations for hierarchy
      });

      // Build a map for faster lookup
      const itemMap = new Map<string, Item & { children: Item[] }>(
        items.map((item: Item) => [item.id, { ...item, children: [] }])
      );

      // Organize hierarchy
      const rootItems: Item[] = [];
      itemMap.forEach((item) => {
        if (item.parent?.id) {
          const parent = itemMap.get(item.parent.id);
          if (parent) parent.children.push(item);
        } else {
          rootItems.push(item);
        }
      });

      // Sort folders first, then files
      const sortItems = (items: Item[] | []) => {
        items.sort((a, b) => {
          if (a.type === 'folder' && b.type === 'file') return -1;
          if (a.type === 'file' && b.type === 'folder') return 1;
          return a.name.localeCompare(b.name);
        });
        items.forEach((item: Item) => sortItems(item.children || []));
      };

      sortItems(rootItems);
      return rootItems;
    });

    /**
     * Fetch children of a specific folder (sorted)
     */
    app.get('/api/items/:id/children', async ({ params: { id } }: { params: Item }) => {
      const children = await itemRepository.find({
        where: { parent: { id } },
      });

      if (children.length) {
        children.sort((a: Item, b: Item) => {
          if (a.type === "folder" && b.type === "file") return -1;
          if (a.type === "file" && b.type === "folder") return 1;
          return a.name.localeCompare(b.name);
        });
      }

      return children;
    });

    /**
     * Fetch file content
     */
    app.get('/api/files/:id', async ({ params: { id } }: { params: Item }) => {
      const file = await itemRepository.findOne({ where: { id } });

      if (!file || file.type !== 'file') {
        return new Response(JSON.stringify({ error: "File not found" }), { status: 404 });
      }

      return { content: file.content };
    });

    /**
     * Update file content
     */
    app.put('/api/files/:id', async ({ params: { id }, body }: { params: Item; body: { content: string } }) => {
      // if (!body?.content) {
      //   return new Response(JSON.stringify({ error: "Content is required" }), { status: 400 });
      // }

      const file = await itemRepository.findOne({ where: { id } });

      if (!file || file.type !== 'file') {
        return new Response(JSON.stringify({ error: "File not found or invalid type" }), { status: 404 });
      }

      file.content = body.content;
      await itemRepository.save(file);

      return { message: "File content updated successfully" };
    });

    /**
     * Create a new item (folder or file)
     */
    app.post('/api/items', async ({ body }: { body: Item & { parentId: string }}) => {
      if (!body?.name || !body?.type) {
        return new Response(JSON.stringify({ error: "Name and type are required" }), { status: 400 });
      }

      const item = new Item();
      item.name = body.name;
      item.type = body.type; // "folder" or "file"
      item.content = body.type === 'file' ? body.content || "" : undefined;

      if (body.parentId) {
        const parentItem = await itemRepository.findOne({ where: { id: body.parentId } });
        if (!parentItem) {
          return new Response(JSON.stringify({ error: "Parent not found" }), { status: 404 });
        }
        item.parent = parentItem;
      }

      const savedItem = await itemRepository.save(item);
      return savedItem;
    });

    /**
     * Rename an item
     */
    app.patch('/api/items/:id', async ({ params: { id }, body }: { params: Item; body: { name: string } }) => {
      if (!body?.name) {
        return new Response(JSON.stringify({ error: "New name is required" }), { status: 400 });
      }

      const item = await itemRepository.findOne({ where: { id } });
      if (!item) {
        return new Response(JSON.stringify({ error: "Item not found" }), { status: 404 });
      }

      item.name = body.name;
      await itemRepository.save(item);
      return item;
    });

    /**
     * Delete an item and its children recursively
     */
    app.delete('/api/items/:id', async ({ params: { id } }: { params: Item }) => {
      const item = await itemRepository.findOne({ where: { id } });

      if (!item) {
        return new Response(JSON.stringify({ error: "Item not found" }), { status: 404 });
      }

      await itemRepository.delete(id);
      return new Response(JSON.stringify({ message: "Item deleted successfully" }), { status: 200 });
    });

  })
  .catch((error: Error) => console.log("Database connection failed:", error));

app.listen(3000);
console.log('✅ Server running at http://localhost:3000');
