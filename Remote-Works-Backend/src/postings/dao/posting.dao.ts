import mongooseService from '../../common/services/mongoose.service';
import shortid from 'shortid';
import debug from 'debug';
import { CreatePostingsDto } from '../dto/create.postings.dto'
import { PutPostingsDto } from '../dto/put.postings.dto';
import { PatchPostingsDto } from '../dto/patch.postings.dto'
import businessDao from '../../business/dao/business.dao';

const log: debug.IDebugger = debug('app:postings-in-memory-dao');

class PostingsDao {
    Schema = mongooseService.getMongoose().Schema;

    postingsSchema = new this.Schema(
        {
            _id : String,

            "job_title": {
                "type": "String"
            },
            "timezone": {
                "type": "String"
            },
            "field": {
                "type": "String"
            },
            "country": {
                "type": "String"
            },
            created_date : Date,
            "description": {
                "type": "String"
            },
            "salary": {
                "type": "String"
            },
            start_date : Date,
            isContract: Boolean,
            contract_length_in_months: Number,
            isRenewable: Boolean,
            isPromoted: Boolean,
            "requirement": {
                "type": "String"
            },
            "business_id": {
                "type": "String"
            },
            "business_name": {
                "type": "String"
            },
            applicants_id: [String]
           
        }, { id : false}
    )

    Postings = mongooseService.getMongoose().model('postings', this.postingsSchema, 'postings');

    constructor() {
        log('Created new instance of PostingsDao')
    }

    async addPostings(postingsFields: CreatePostingsDto) {
        const postingsId = shortid.generate();
        const postings = new this.Postings({
            _id: postingsId,
            created_date: new Date(),
            ...postingsFields,
        })
        console.log("in posting DAO Biz Id" + postings.business_id)
        console.log("in posting DAO post Id" + postings._id)
        await businessDao.updateBusinessJobPostings(postings.business_id!, postings._id)
        await postings.save();
        return postings._id;
    }

    async getPostingsById(postingsId: string) {
        return this.Postings.findById(postingsId).exec();
    }

    async updatePostingsById(
        postingsId: string,
        postingsFields: PatchPostingsDto | PutPostingsDto
    ) {
        const existingPostings = await this.Postings.findOneAndUpdate(
            { _id:postingsId },
            { $set: postingsFields},
            { new: true }
        ).exec();

        console.log(existingPostings);

        return existingPostings;
    }

    async getBusinessPostingsById(businessId: string) {
        return this.Postings.find({business_id : businessId}).exec()
    }

    async removePostingsById(postingsId: string) {
        return this.Postings.deleteOne({ _id: postingsId }).exec()
    }

    async getPostings(limit = 25, page = 0) {
        return this.Postings.find()
            .limit(limit)
            .skip(limit*page)
            .exec();
    }


}

export default new PostingsDao();