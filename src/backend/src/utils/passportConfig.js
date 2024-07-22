import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';
import { poolConnect, connection } from './dbConnection.js';

dotenv.config();

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:4500/api/google/callback'
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;
            const query = 'SELECT * FROM user WHERE Email = ?';
            const [results] = await poolConnect.query(query, [email]);

            if (results.length > 0) {
                const user = results[0];
                return done(null, user);
            } else {
                const newUser = {
                    Email: email,
                    Name: profile.displayName
                };
                return done(null, newUser);
            }
        } catch (err) {
            return done(err, null);
        }
    }
));


passport.serializeUser((user, done) => {
    done(null, user.Email);
});

passport.deserializeUser(async (email, done) => {
    try {
        const query = 'SELECT * FROM user WHERE Email = ?';
        const [results] = await poolConnect.query(query, [email]);
        done(null, results[0]);
    } catch (err) {
        done(err, null);
    }
});

export default passport;
