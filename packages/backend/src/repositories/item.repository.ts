import { AppDataSource } from '@/config/database';
import { Item } from '@/entities/Item';
import { Repository } from 'typeorm';

export class ItemRepository {
  private repo: Repository<Item>;

  constructor() {
    this.repo = AppDataSource.getRepository(Item);
  }

  async getAllItems() {
    return this.repo.find({ relations: ['parent'] });
  }

  async getChildren(id: string) {
    return this.repo.find({ where: { parent: { id } } });
  }

  async getItemById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async searchItems(query: string) {
    return await this.repo
      .createQueryBuilder('item')
      .where('LOWER(item.name) LIKE LOWER(:query)', { query: `%${query}%` })
      .orderBy(`CASE WHEN item.type = 'folder' THEN 1 ELSE 2 END`, 'ASC')
      .addOrderBy('LENGTH(item.name)', 'ASC')
      .addOrderBy('item.name', 'ASC')
      .getMany();
  }

  async updateFileContent(id: string, content: string) {
    const file = await this.getItemById(id);
    if (!file || file.type !== 'file') {
      throw new Error('File not found or invalid type');
    }
    file.content = content;
    return this.repo.save(file);
  }

  async createItem(data: { name: string; type: 'folder' | 'file'; parentId?: string; content?: string }) {
    const item = new Item();
    item.name = data.name;
    item.type = data.type;
    item.content = data.type === 'file' ? data.content || '' : undefined;

    if (data.parentId) {
      const parent = await this.getItemById(data.parentId);
      if (!parent) {
        throw new Error('Parent not found');
      }
      item.parent = parent;
    }

    return this.repo.save(item);
  }

  async renameItem(id: string, name: string) {
    const item = await this.getItemById(id);
    if (!item) {
      throw new Error('Item not found');
    }
    item.name = name;
    return this.repo.save(item);
  }

  async deleteItem(id: string) {
    return this.repo.delete(id);
  }
}
