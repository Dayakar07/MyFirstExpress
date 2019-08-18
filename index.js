const Http = require('http');
const app = require('./app');


const Server = Http.createServer(app);

const port = process.env.PORT || 3001;

Server.listen(port, () => {

    console.log(`server listening on port ${port}`);

})