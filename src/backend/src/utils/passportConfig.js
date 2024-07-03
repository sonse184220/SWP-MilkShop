import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';
import { connection } from './dbConnection.js';

dotenv.config();

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(options, (jwtPayload, done) => {
    const query = 'SELECT * FROM user WHERE UserID = ?';
    connection.query(query, [jwtPayload.userId], (err, results) => {
        if (err) {
            return done(err, false);
        }
        if (results.length > 0) {
            return done(null, results[0]);
        } else {
            return done(null, false);
        }
    });
}));

export default passport;
