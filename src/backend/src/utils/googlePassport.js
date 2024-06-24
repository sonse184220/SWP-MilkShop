import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { connection } from '../utils/dbConnection.js';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:4500/api/google/callback'
}, (accessToken, refreshToken, profile, done) => {
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

        const getMaxUserIdQuery = 'SELECT MAX(CAST(SUBSTR(UserID, 2) AS UNSIGNED)) AS maxUserId FROM MEMBER WHERE UserID LIKE "U%"';
        connection.query(getMaxUserIdQuery, (err, results) => {
            if (err) return done(err);

            const newUserId = `U${(results[0].maxUserId ? results[0].maxUserId + 1 : 1).toString().padStart(3, '0')}`;

            const insertQuery = 'INSERT INTO MEMBER (UserID, Name, Email, Phone, Address, RewardPoints, Verified) VALUES (?, ?, ?, ?, ?, ?, 0)';
            connection.query(insertQuery, [newUserId, newUser.Name, newUser.Email, newUser.Phone, newUser.Address, newUser.RewardPoints], (err, result) => {
                if (err) return done(err);

                const token = jwt.sign({ userId: newUserId }, process.env.JWT_SECRET, { expiresIn: '1h' });
                return done(null, { ...newUser, UserID: newUserId });
            });
        });
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.UserID);
});

passport.deserializeUser((id, done) => {
    const query = 'SELECT * FROM MEMBER WHERE UserID = ?';
    connection.query(query, [id], (err, results) => {
        if (err) return done(err);
        done(null, results[0]);
    });
});

export default passport;
