import mongoose from "mongoose";
import debug, { Debug } from "debug";
import dotenv from 'dotenv'

const log: debug.IDebugger = debug('app:mongoose-service')

dotenv.config()

class MongooseService {
    private count = 0;
    private mongooseOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }

    constructor() {
        this.connectWithRetry();
    }

    getMongoose() {
        return mongoose;
    }

    connectWithRetry = () => {
        log('Attempting MongoDB connection (will retry if fails)');
        mongoose.connect(process.env.MONGO_URL)
        .then(() => {
            log('MongoDB os Connected')
        })
        .catch((err) => {
            const retrySeconds = 5;
            log(`MongoDB connection unsuccessful (will retry #${++this
                .count} after ${retrySeconds} seconds):`, err);
                setTimeout(this.connectWithRetry, retrySeconds * 1000)
        })

    }
}

export default new MongooseService();