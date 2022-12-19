import PostingDao from "../dao/posting.dao";
import { CRUD } from "../../common/interfaces/crud.interface";
import { CreatePostingsDto } from '../dto/create.postings.dto'
import { PutPostingsDto } from '../dto/put.postings.dto';
import { PatchPostingsDto } from '../dto/patch.postings.dto'

class PostingsService implements CRUD {
    
    async create(resource: CreatePostingsDto) {
        return PostingDao.addPostings(resource);
    }

    async deleteById(id: string) {
        return PostingDao.removePostingsById(id);
    }

    async listBusinessPostings(businessId: string) {
        return PostingDao.getBusinessPostingsById(businessId);
    }

    async list(limit: number, page: number) {
        return PostingDao.getPostings(limit, page);
    }

    async putById (id: string, resource: PutPostingsDto) {
        return PostingDao.updatePostingsById(id, resource);
    };

    async patchById (id: string, resource: PatchPostingsDto) {
        return PostingDao.updatePostingsById(id, resource);
    };

    async readById(id: string) {
        return PostingDao.getPostingsById(id);
    };
}

export default new PostingsService