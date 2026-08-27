const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI)
        .then(con => {
            console.log(`MongoDB Database connected with HOST: ${con.connection.host}`);
        })
        .catch(err => {
            console.error(`MongoDB connection failed: ${err.message}`);
        });
};

if (require.main === module) {
    require('dotenv').config({ path: './.env' });
    connectDatabase();
}

module.exports = connectDatabase;