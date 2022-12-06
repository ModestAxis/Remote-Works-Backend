import app from '../../index';
import supertest from 'supertest';
import { expect } from 'chai';
import shortid from 'shortid';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({path:"../../.env"});

declare global {
    namespace NodeJS {
      interface ProcessEnv {
        PORT: Number;
        MONGO_URL: string;
        JWT_SECRET:string;
      }
    }
  }

let firstUserIdTest = '';

const firstUserBody = {
    email: `testytest${shortid.generate()}@test.com`,
    password: `!thisIsaStrongPassword!`,
};

let accessToken = '';
let refreshToken = '';
const tempFirstName = 'Arnaud';
const tempFirstName2 = 'Maxime';
const tempFirstName3 = 'Michael';

describe('user and auth endpoints', function () {
    
    let request: supertest.SuperAgentTest;
    
    before(function () {

        request = supertest.agent(app);
    });

    after(function(done) {
        //shutdown server and close Atlas Connection tell mocha we are done
        app.close(()=> {
            mongoose.connection.close(done);
        });
    });

    it('should allow POST to /users', async function () {
        
        const res = await request.post('/users').send(firstUserBody);

        expect(res.status).to.equal(201);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
        expect(res.body.id).to.be.a('string');
        firstUserIdTest = res.body.id
    })

    it('should allow Post to /auth', async function () {
        const res = await request.post('/auth').send(firstUserBody);
        expect(res.status).to.equal(201);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
        expect(res.body.accessToken).to.be.a('string');
        accessToken = res.body.accessToken;
        refreshToken = res.body.refreshToken;
    })

    it('should allow GET from /users/:userId with an access token', async function () {
        const res = await request
            .get(`/users/${firstUserIdTest}`)
            .set({ Authorization: `Bearer ${accessToken}`})
            .send();
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
        expect(res.body._id).to.be.a('string');
        expect(res.body._id).to.equal(firstUserIdTest);
        expect(res.body.email).to.equal(firstUserBody.email);

    })

    describe('testing with valid access token', function () {
        
        it('should disallow GET from /users', async function() {
            const res = await request
                .get('/users')
                .set({ Authorization: `Bearer ${accessToken}`})
                .send();
            expect(res.status).to.equal(403);
        })
    })
    it('should allow PATCH to /users/:id add user Name and Last Name', async function () {
        const res = await request
        .patch(`/users/${firstUserIdTest}`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({
            first_name: tempFirstName,
            last_name: tempFirstName2
        });
        expect(res.status).to.equal(204);
    });
    it('should allow a GET from /users/:userId and should have a new full name', async function () {
        const res = await request
            .get(`/users/${firstUserIdTest}`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
        expect(res.body._id).to.be.a('string');
        expect(res.body.first_name).to.equal(tempFirstName);
        expect(res.body.last_name).to.equal(tempFirstName2);
        expect(res.body.email).to.equal(firstUserBody.email);
        expect(res.body._id).to.equal(firstUserIdTest);
    });
    it('should allow PATCH to /users/:id to change user First Name', async function () {
        const res = await request
        .patch(`/users/${firstUserIdTest}`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({
            first_name: tempFirstName3
            
        });
        expect(res.status).to.equal(204);
    });
    
    it('should allow a GET from /users/:userId and should have a new First Name', async function () {
        const res = await request
            .get(`/users/${firstUserIdTest}`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
        expect(res.body._id).to.be.a('string');
        expect(res.body.first_name).to.equal(tempFirstName3);
        expect(res.body.last_name).to.equal(tempFirstName2);
        expect(res.body.email).to.equal(firstUserBody.email);
        expect(res.body._id).to.equal(firstUserIdTest);
    });
    
    it('should allow a DELETE from /users/:userId', async function () {
        const res = await request
            .delete(`/users/${firstUserIdTest}`)
            .set({ Authorization: `Bearer ${accessToken}` })
            .send();
        expect(res.status).to.equal(204);
    });


});