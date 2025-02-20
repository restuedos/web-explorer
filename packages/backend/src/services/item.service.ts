import { Item } from '@/entities/Item';
import { ItemRepository } from '@/repositories/item.repository';

export class ItemService {
  private itemRepository: ItemRepository;

  constructor() {
    this.itemRepository = new ItemRepository();
  }

  async getAllItems() {
    const items = await this.itemRepository.getAllItems();

    // Use a map for quick access and organize hierarchy
    const itemMap = new Map<string, Item & { children: Item[] }>();
    const rootItems: Item[] = [];

    items.forEach((item) => {
      itemMap.set(item.id, { ...item, children: [] });
    });

    itemMap.forEach((item) => {
      if (item.parent?.id) {
        itemMap.get(item.parent.id)?.children.push(item);
      } else {
        rootItems.push(item);
      }
    });

    // Sort function to prioritize folders over files
    const sortItems = (items: Item[]): void => {
      items.sort((a, b) =>
        a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'folder' ? -1 : 1
      );
      items.forEach((item) => sortItems(item.children || []));
    };

    sortItems(rootItems);
    return rootItems;
  }

  async getChildren(id: string) {
    return this.itemRepository.getChildren(id);
  }

  async getFileContent(id: string) {
    const file = await this.itemRepository.getItemById(id);
    if (!file || file.type !== 'file') {
      throw new Error('File not found');
    }
    return { content: file.content };
  }

  async searchItems(query: string) {
    if (!query) {
      throw new Error('Search query is required');
    }
    return this.itemRepository.searchItems(query);
  }

  async updateFileContent(id: string, content: string) {
    return this.itemRepository.updateFileContent(id, content);
  }

  async createItem(data: { name: string; type: 'folder' | 'file'; parentId?: string; content?: string }) {
    return this.itemRepository.createItem(data);
  }

  async renameItem(id: string, name: string) {
    return this.itemRepository.renameItem(id, name);
  }

  async deleteItem(id: string) {
    return this.itemRepository.deleteItem(id);
  }
}
