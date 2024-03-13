import env from 'dotenv';
env.config();
import express,{Express} from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import memberRoute from './Routing/member_route';
import postRoute from './Routing/post_route';
import authRoute from './Routing/user_route';
import commentRoute from './Routing/comments_route';
import fileRout from './Routing/Files_routes';
const initApp=()=>{
    const promise = new Promise<Express>((resolve) => {
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error:'));
        db.once('open', () => { console.log("DB connected 👍"); });
        mongoose.connect(process.env.DB_URL).then(() => {
            const app = express();
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({ extended: true }));
            app.use(cors());
            
            app.use('/member', memberRoute);
            app.use('/post', postRoute);
            app.use('/auth', authRoute);
            app.use(commentRoute);
            app.use('/file', fileRout);
            app.use("/public", express.static('public'));
            app.use("/public", express.static('dist/assets'));
            app.use('*', (req, res) => {
                res.sendFile('index.html', { root: 'dist' });
            });
            resolve(app);
    });
});
              return promise;
};






export default initApp;
