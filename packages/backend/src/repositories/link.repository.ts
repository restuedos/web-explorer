import { AppDataSource } from '@/config/database';
import { Link } from '@/entities/Link';
import { Repository } from 'typeorm';
import crypto from 'crypto';

export class LinkRepository {
  private repo: Repository<Link>;

  constructor() {
    this.repo = AppDataSource.getRepository(Link);
  }

  async getAllLinks() {
    return this.repo.find();
  }

  async getLinkByShortenedLink(shortenedId: string) {
    return this.repo.findOne({ where: { shortenedId } });
  }

  async createLink(data: { link: string }) {
    const link = new Link();
    link.link = data.link;

    link.shortenedId = this.generateRandomString(8);
    link.shortenedLink = 'http://localhost:3000/' + link.shortenedId;

    return this.repo.save(link);
  }

  async deleteLink(id: string) {
    return this.repo.delete(id);
  }

  generateRandomString(length: number) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
  }
}
