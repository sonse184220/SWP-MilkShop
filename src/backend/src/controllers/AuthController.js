import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import connection from '../utils/dbConnection.js';
import { sendVerificationEmail } from '../services/emailService.js';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    const email = profile.emails[0].value;

    const checkQuery = 'SELECT * FROM MEMBER WHERE Email = ?';
    connection.query(checkQuery, [email], (err, results) => {
        if (err) return done(err);

        if (results.length > 0) {
            return done(null, results[0]);
        }

        const getMaxUserIdQuery = "SELECT MAX(CAST(SUBSTR(UserID, 3) AS UNSIGNED)) AS maxUserId FROM MEMBER WHERE UserID LIKE 'UG%'";
        connection.query(getMaxUserIdQuery, (err, results) => {
            if (err) return done(err);

            const newUserId = `UG${(results[0].maxUserId ? results[0].maxUserId + 1 : 1).toString().padStart(3, '0')}`;

            const newUser = {
                UserID: newUserId,
                Name: profile.displayName || '',
                Email: email,
                Phone: '',
                Address: '',
                RewardPoints: 0,
                Verified: 1
            };

            const query = 'INSERT INTO TEMP_MEMBER (UserID, Name, Email, Phone, Address, Token) VALUES (?, ?, ?, ?, ?, ?)';
            const token = jwt.sign({ userId: newUserId }, process.env.JWT_SECRET, { expiresIn: '1h' });

            connection.query(query, [newUserId, newUser.Name, newUser.Email, newUser.Phone, newUser.Address, token], (err, result) => {
                if (err) return done(err);
                return done(null, newUser);
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

const registerUser = (userData, req, callback) => {
    const { Password, Name, Email, Phone, Address } = userData;

    const checkQuery = 'SELECT * FROM MEMBER WHERE Email = ? OR Phone = ?';
    connection.query(checkQuery, [Email, Phone], (err, results) => {
        if (err) return callback(err);

        if (results.length > 0) {
            const existingUser = results[0];
            let errorMessage = 'User already exists with ';
            if (existingUser.Email === Email) {
                errorMessage += 'this Email';
            } else if (existingUser.Phone === Phone) {
                errorMessage += 'this Phone number';
            }
            return callback(null, { message: errorMessage, status: 400 });
        }

        bcrypt.hash(Password, 10, (err, hashedPassword) => {
            if (err) return callback(err);

            const getMaxUserIdQuery = 'SELECT MAX(CAST(SUBSTR(UserID, 2) AS UNSIGNED)) AS maxUserId FROM MEMBER WHERE UserID LIKE "U%"';
            connection.query(getMaxUserIdQuery, (err, results) => {
                if (err) return callback(err);

                const newUserId = `U${(results[0].maxUserId ? results[0].maxUserId + 1 : 1).toString().padStart(3, '0')}`;

                const token = jwt.sign({ userId: newUserId }, process.env.JWT_SECRET, { expiresIn: '1h' });
                const query = 'INSERT INTO TEMP_MEMBER (UserID, Password, Name, Email, Phone, Address, Token) VALUES (?, ?, ?, ?, ?, ?, ?)';

                connection.query(query, [newUserId, hashedPassword, Name, Email, Phone, Address, token], (err, result) => {
                    if (err) return callback(err);

                    sendVerificationEmail(Email, token, newUserId, Phone, req)
                        .then(() => {
                            console.log('Verification email sent to:', Email);
                            callback(null, { message: 'User registered successfully. Verification email sent.' });
                        })
                        .catch(error => {
                            console.error('Error sending verification email:', error);
                            callback(error);
                        });
                });
            });
        });
    });
};

const loginUser = (userData, callback) => {
    const { identifier, Password } = userData;

    const query = 'SELECT * FROM MEMBER WHERE Email = ? OR Phone = ?';
    connection.query(query, [identifier, identifier], (err, results) => {
        if (err) return callback(err);

        if (results.length === 0) {
            return callback(null, { message: 'Invalid credentials', status: 401 });
        }

        const user = results[0];

        bcrypt.compare(Password, user.Password, (err, isMatch) => {
            if (err) return callback(err);

            if (!isMatch) {
                return callback(null, { message: 'Invalid credentials', status: 401 });
            }

            const token = jwt.sign({ userId: user.UserID }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const { Password, ...userWithoutPassword } = user;
            callback(null, { message: 'Login successful', token, user: userWithoutPassword });
        });
    });
};

const verifyEmail = (token, callback) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const selectQuery = 'SELECT * FROM TEMP_MEMBER WHERE Token = ?';
        connection.query(selectQuery, [token], (err, results) => {
            if (err) return callback(err);
            if (results.length === 0) return callback(null, { message: 'Invalid or expired token', status: 400 });

            const user = results[0];
            const insertQuery = 'INSERT INTO MEMBER (UserID, Password, Name, Email, Phone, Address, RewardPoints, Verified) VALUES (?, ?, ?, ?, ?, ?, 0, 1)';
            const deleteQuery = 'DELETE FROM TEMP_MEMBER WHERE UserID = ?';

            connection.query(insertQuery, [user.UserID, user.Password, user.Name, user.Email, user.Phone, user.Address], (err, result) => {
                if (err) return callback(err);

                connection.query(deleteQuery, [user.UserID], (err, result) => {
                    if (err) return callback(err);
                    callback(null, { message: 'Email verified successfully' });
                });
            });
        });
    } catch (err) {
        callback(err);
    }
};

const completeProfile = (req, callback) => {
    const { userId, name, phone, address } = req.body;
    const query = 'UPDATE MEMBER SET Name = ?, Phone = ?, Address = ? WHERE UserID = ?';
    connection.query(query, [name, phone, address, userId], (err, result) => {
        if (err) return callback(err);
        callback(null, { message: 'Profile completed successfully' });
    });
};

export {
    registerUser,
    loginUser,
    verifyEmail,
    completeProfile,
    passport
};
