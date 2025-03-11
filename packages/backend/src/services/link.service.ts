import { Link } from '@/entities/Link';
import { LinkRepository } from '@/repositories/link.repository';

export class LinkService {
  private linkRepository: LinkRepository;

  constructor() {
    this.linkRepository = new LinkRepository();
  }

  async getAllLinks() {
    return await this.linkRepository.getAllLinks();
  }

  async getShortenedLink(shortenedId: string) {
    const link = await this.linkRepository.getLinkByShortenedLink(shortenedId);
    return link?.link;
  }

  async createLink(data: { link: string }) {
    return this.linkRepository.createLink(data);
  }

  async deleteLink(id: string) {
    return this.linkRepository.deleteLink(id);
  }
}
