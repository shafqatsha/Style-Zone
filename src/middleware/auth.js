import jwt from 'jsonwebtoken'
import User from '../models/User.js';

export default async (req, res, next) => {
    let token = req.get('Authorization');
    if(token && token?.indexOf('Bearer') > -1){
        token = token.split(' ')[1];

        try {
            const decodedToken = jwt.verify(token, 'shafqat_-_sha_-_45');
            if(!decodedToken){
                const error = new Error('Not authorized.');
                error.statusCode = 401;
                throw error;                
            }
            const user =await User.findById(decodedToken.user_id);
            req.user = user;
            next();
        } catch (error) {
            error.statusCode = 500;
            throw error
        }
    }else {
        const error = new Error('Not authorized.');
        error.statusCode = 401;
        throw error;
    }
};
