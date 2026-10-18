const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

const dotenv = require('dotenv');
dotenv.config({ path: './config/.env' })

const app = require('./app');
const connectDatabase = require('./config/database')
const cloudinary = require('cloudinary');



connectDatabase();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

cloudinary.api.ping()
    .then(result => {
        console.log('✅ Cloudinary connected:', result);
    })
    .catch(error => {
        console.error('❌ Cloudinary connection failed:', error.message);
    });

app.listen(process.env.PORT, () => {
    console.log(`server started on port:' ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
});