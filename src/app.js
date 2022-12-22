const express = require('express');
const bodyParser = require('body-parser');
const {sequelize, Profile} = require('./model')
const {getProfile} = require('./middleware/getProfile')
const {getProfileContract, getProfileContracts} = require('./controllers/contracts')
const {getUnpaidJobs, payJob} = require('./controllers/jobs')
const {deposit} = require('./controllers/balances')
const {getBestProfession,getBestClient} = require('./controllers/admin')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)



app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/contracts/:id',getProfile ,getProfileContract);
app.get('/contracts',getProfile ,getProfileContracts);

app.get('/jobs/unpaid',getProfile ,getUnpaidJobs);
app.post('/jobs/:job_id/pay',getProfile ,payJob);

app.post('/balances/deposit/:userId',getProfile,deposit);

app.get('/admin/best-profession',getProfile,getBestProfession);
app.get('/admin/best-client',getProfile,getBestClient);

module.exports = app;
