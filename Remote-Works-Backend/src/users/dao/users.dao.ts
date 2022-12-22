import { Application } from 'express';
import mongooseService from '../../common/services/mongoose.service';
import shortid from 'shortid';
import debug from 'debug';
import { CreateUserDto } from '../dto/create.user.dto';
import { PatchUserDto } from '../dto/patch.user.dto';
import { PutUserDto } from '../dto/put.user.dto';
import { PermissionFlag } from '../../common/middleware/common.permissionflag.enum';



const log: debug.IDebugger = debug('app:user-in-memory-dao');

class UsersDao {

  Schema = mongooseService.getMongoose().Schema;

  userSchema = new this.Schema(
    {
      _id: String,

      "first_name": {
        "type": "String"
      },
      "last_name": {
        "type": "String"
      },
      "timezone": {
        "type": "String"
      },
      "country": {
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
      "cv": {
        "type": "Mixed"
      },
      "website": {
        "type": "String"
      },
      "git_url": {
        "type": "String"
      },

      "permissionFlags": {
        "type": "Number"
      },

      "experiences": {
        "type": [
          "Mixed"
        ]
      },
      applications : [String]

    }, { id: false }
  )

  User = mongooseService.getMongoose().model('users', this.userSchema, 'users');


  constructor() {
    log('Created new instance of UsersDao');
  }

  async addUser(userFields: CreateUserDto) {
    const userId = shortid.generate();
    const user = new this.User({
      _id: userId,
      ...userFields,
      permissionFlags: PermissionFlag.VALIDATED_USER,
    });
    await user.save();
    return user._id;
  }

  async getUserByEmail(email: string) {
    return this.User.findOne({ email: email }).exec();
  }

  async getUserById(userId: string) {
    return this.User.findOne({ _id: userId }).exec();
  }

  async getUsers(limit = 25, page = 0) {
    return this.User.find()
      .limit(limit)
      .skip(limit * page)
      .exec();
  }

  async updateUserById(
    userId: string,
    userFields: PatchUserDto | PutUserDto
) {
  
const existingUser = await this.User.findOneAndUpdate(
        { _id: userId },
        { $set: userFields },
        { new: true }
    ).exec();

    console.log(existingUser);

    return existingUser;
}

async updateUserApplications(userId: string, applicationId: string) {
  let user : any = await this.getUserById(userId);
  user.applications.push(applicationId);
  return this.updateUserById(userId, user);
} 

async removeUserById(userId: string) {
  return this.User.deleteOne({ _id: userId }).exec();
}

async getUserByEmailWithPassword(email: string) {
  return this.User.findOne({ email: email })
      .select('_id email permissionFlags + password')
      .exec();
}

}

export default new UsersDao();