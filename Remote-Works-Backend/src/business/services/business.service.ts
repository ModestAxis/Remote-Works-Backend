import { CRUD } from '../../common/interfaces/crud.interface'
import { CreateBusinessDto } from '../dto/create.business.dto';
import { PutBusinessDto } from '../dto/put.business.dto';
import { PatchBusinessDto } from './../dto/patch.business.dto';
import BusinessDao from '../dao/business.dao';

class BusinessService implements CRUD {
    
    async create(resource: CreateBusinessDto) {
        return BusinessDao.addBusiness(resource);
    }

    async deleteById(id: string) {
        return BusinessDao.removeBusinessById(id);
    }

    async list(limit: number, page: number) {
        return BusinessDao.getBusiness(limit, page);
    }

    async patchById(id: string, resource: PatchBusinessDto) {
        return BusinessDao.updateBusinessById(id, resource);
    }

    async readById(id: string) {
        console.log("in readby id " + id)
        return BusinessDao.getBusinessById(id);
    }

    async putById(id: string, resource: PutBusinessDto) {
        return BusinessDao.updateBusinessById(id, resource);
    }

    async getBusinessByEmail(email: string) {
        return BusinessDao.getBusinessByEmail(email);
    }
    
    async getBusinessByEmailWithPassword(email: string) {
        return BusinessDao.getBusinessByEmailWithPassword(email);
    }
}

export default new BusinessService();