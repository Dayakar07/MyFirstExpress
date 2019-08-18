const mongoose = require('mongoose');
const config = require('./env.json');

mongoose.connect(`mongodb+srv://Dayakar:${config.env.MongooseDbPwd}@mymongo-ikfx6.mongodb.net/test?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useCreateIndex: true,
}).then().catch(error => console.log(error));

module.exports = mongoose;