require('dotenv').config();

const express = require('express');
const connectToDiscoveryServer = require('./utils/configs/discovery');
const getAuthAndPutCurrentUserAuthToBody = require('./utils/middlewares/getAuthAndPutCurrentUserAuthToBody');
const mapHealthStatusRoute = require('./utils/eureka/healthStatusRoute');

const PORT = process.env.PORT || 3006;
const app = express();

app.use(express.json());
app.use(getAuthAndPutCurrentUserAuthToBody);

connectToDiscoveryServer();

const server = app.listen(PORT,()=>{
    console.log(`Express app listening at http://localhost:${PORT}`);
});