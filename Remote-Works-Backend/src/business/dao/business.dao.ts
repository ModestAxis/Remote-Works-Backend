import mongooseService from '../../common/services/mongoose.service';
import shortid from 'shortid';
import debug from 'debug';
import { CreateBusinessDto } from '../dto/create.business.dto';
import { PatchBusinessDto } from '../dto/patch.business.dto';
import { PutBusinessDto } from '../dto/put.business.dto';
import { PermissionFlag } from '../../common/middleware/common.permissionflag.enum';


const log: debug.IDebugger = debug('app:in-memory-dao');

class BusinessDao {
    
    Schema = mongooseService.getMongoose().Schema;

    businessSchema = new this.Schema(
        {
            _id: String,

            "name": {
                "type": "String"
            },
            "email": {
                "type": "String"
            },
            "password": {
                "type": "String",
                "select": false
            },
            "img": {
                "type": "Mixed"
            },
            "description": {
                "type": "String"
            },
            "permissionFlags": {
                "type": "Number"
            },
            "job_postings": {
                "type": [
                    "Mixed"
                ]
            }

        }, { id: false }
    )

    Business = mongooseService.getMongoose().model('business', this.businessSchema, 'business');

    constructo() {
        log('Created new instance of BusinessDao')
    }

    async addBusiness( businessFields: CreateBusinessDto) {
        const businessId = shortid.generate();
        const business = new this.Business({
            _id: businessId,
            ...businessFields,
            permissionFlags: PermissionFlag.VALIDATED_COMPANY,
        });
        await business.save();
        return business._id;
    }

    async getBusinessByEmail (email: string) {
        return this.Business.findOne({ email: email })
    }
    
    async getBusinessById(businessId: string) {
        return this.Business.findOne({ _id: businessId }).exec();
      }
    
      async getBusiness(limit = 25, page = 0) {
        return this.Business.find()
          .limit(limit)
          .skip(limit * page)
          .exec();
      }
    
      async updateBusinessById(
        businessId: string,
        businessFields: PatchBusinessDto | PutBusinessDto
    ) {
      
    const existingBusiness = await this.Business.findOneAndUpdate(
            { _id: businessId },
            { $set: businessFields },
            { new: true }
        ).exec();
    
        console.log(existingBusiness);
    
        return existingBusiness;
    }
    
    async removeBusinessById(businessId: string) {
      return this.Business.deleteOne({ _id: businessId }).exec();
    }
    
    async getBusinessByEmailWithPassword(email: string) {
      return this.Business.findOne({ email: email })
          .select('_id email permissionFlags + password')
          .exec();
    }

    
}

export default new BusinessDao();