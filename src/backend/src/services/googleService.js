import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import { connection } from '../utils/dbConnection.js';
import dotenv from 'dotenv';

dotenv.config();

export class GoogleService {
    constructor() {
        passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback'
        }, this.verifyCallback));

        passport.serializeUser((user, done) => {
            done(null, user.TempMemberID);
        });

        passport.deserializeUser((id, done) => {
            const query = 'SELECT * FROM TEMP_MEMBER WHERE TempMemberID = ?';
            connection.query(query, [id], (err, results) => {
                if (err) return done(err);
                done(null, results[0]);
            });
        });
    }

    verifyCallback = (accessToken, refreshToken, profile, done) => {
        const email = profile.emails[0].value;

        const checkQuery = 'SELECT * FROM MEMBER WHERE Email = ?';
        connection.query(checkQuery, [email], (err, results) => {
            if (err) return done(err);

            if (results.length > 0) {
                return done(null, results[0]);
            }

            const newUser = {
                Name: profile.displayName || '',
                Email: email,
                Phone: '',
                Address: '',
                RewardPoints: 0,
                Verified: 1
            };

            const query = 'INSERT INTO TEMP_MEMBER (Name, Email, Phone, Address, Token) VALUES (?, ?, ?, ?, ?)';
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

            connection.query(query, [newUser.Name, newUser.Email, newUser.Phone, newUser.Address, token], (err, result) => {
                if (err) return done(err);
                return done(null, { ...newUser, TempMemberID: result.insertId });
            });
        });
    }
}
