require('dotenv').config();

const express = require('express');
const connectToDiscoveryServer = require('./utils/configs/discovery');
const getAuthAndPutCurrentUserAuthToBody = require('./utils/middlewares/getAuthAndPutCurrentUserAuthToBody');
const router = require('./routes');

const PORT = process.env.PORT || 3006;
const app = express();

app.use(express.json());
app.use(getAuthAndPutCurrentUserAuthToBody);

app.use(process.env.APP_PATH || '/api/v1/comments', router);

connectToDiscoveryServer();

const server = app.listen(PORT, () => {
    console.log(`Express app listening at http://localhost:${PORT}`);
});