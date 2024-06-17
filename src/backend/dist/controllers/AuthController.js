// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { poolConnect } from '../utils/dbConnection.js'; // Ensure correct import of the connection object
// import { sendVerificationEmail } from '../services/EmailService.js';
// import dotenv from 'dotenv';

// dotenv.config();

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: '/api/auth/google/callback'
// }, async (accessToken, refreshToken, profile, done) => {
//     const email = profile.emails[0].value;

//     try {
//         const [results] = await poolConnect.query('SELECT * FROM MEMBER WHERE Email = ?', [email]);

//         if (results.length > 0) {
//             return done(null, results[0]);
//         }

//         const [maxUserIdResults] = await poolConnect.query("SELECT MAX(CAST(SUBSTR(UserID, 3) AS UNSIGNED)) AS maxUserId FROM MEMBER WHERE UserID LIKE 'UG%'");
//         const newUserId = `UG${(maxUserIdResults[0].maxUserId ? maxUserIdResults[0].maxUserId + 1 : 1).toString().padStart(3, '0')}`;

//         const newUser = {
//             UserID: newUserId,
//             Name: profile.displayName || '',
//             Email: email,
//             Phone: '',
//             Address: '',
//             RewardPoints: 0,
//             Verified: 1
//         };

//         const token = jwt.sign({ userId: newUserId }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         await poolConnect.query('INSERT INTO TEMP_MEMBER (UserID, Name, Email, Phone, Address, Token) VALUES (?, ?, ?, ?, ?, ?)', 
//             [newUserId, newUser.Name, newUser.Email, newUser.Phone, newUser.Address, token]);

//         return done(null, newUser);
//     } catch (err) {
//         return done(err);
//     }
// }));

// passport.serializeUser((user, done) => {
//     done(null, user.UserID);
// });

// passport.deserializeUser(async (id, done) => {
//     try {
//         const [results] = await poolConnect.query('SELECT * FROM MEMBER WHERE UserID = ?', [id]);
//         done(null, results[0]);
//     } catch (err) {
//         done(err);
//     }
// });

// const registerUser = async (userData, req) => {
//     const { Password, Name, Email, Phone, Address } = userData;

//     try {
//         const [results] = await poolConnect.query('SELECT * FROM MEMBER WHERE Email = ? OR Phone = ?', [Email, Phone]);

//         if (results.length > 0) {
//             const existingUser = results[0];
//             let errorMessage = 'User already exists with ';
//             if (existingUser.Email === Email) {
//                 errorMessage += 'this Email';
//             } else if (existingUser.Phone === Phone) {
//                 errorMessage += 'this Phone number';
//             }
//             return { message: errorMessage, status: 400 };
//         }

//         const hashedPassword = await bcrypt.hash(Password, 10);
//         const [maxUserIdResults] = await poolConnect.query('SELECT MAX(CAST(SUBSTR(UserID, 2) AS UNSIGNED)) AS maxUserId FROM MEMBER WHERE UserID LIKE "U%"');
//         const newUserId = `U${(maxUserIdResults[0].maxUserId ? maxUserIdResults[0].maxUserId + 1 : 1).toString().padStart(3, '0')}`;

//         const token = jwt.sign({ userId: newUserId }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         await poolConnect.query('INSERT INTO TEMP_MEMBER (UserID, Password, Name, Email, Phone, Address, Token) VALUES (?, ?, ?, ?, ?, ?, ?)', 
//             [newUserId, hashedPassword, Name, Email, Phone, Address, token]);

//         await sendVerificationEmail(Email, token, newUserId, Phone, req);
//         console.log('Verification email sent to:', Email);
//         return { message: 'User registered successfully. Verification email sent.' };
//     } catch (err) {
//         throw err;
//     }
// };

// const loginUser = async (userData) => {
//     const { identifier, Password } = userData;

//     try {
//         const [results] = await poolConnect.query('SELECT * FROM MEMBER WHERE Email = ? OR Phone = ?', [identifier, identifier]);

//         if (results.length === 0) {
//             return { message: 'Invalid credentials', status: 401 };
//         }

//         const user = results[0];
//         const isMatch = await bcrypt.compare(Password, user.Password);

//         if (!isMatch) {
//             return { message: 'Invalid credentials', status: 401 };
//         }

//         const token = jwt.sign({ userId: user.UserID }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         const { Password: userPassword, ...userWithoutPassword } = user;
//         return { message: 'Login successful', token, user: userWithoutPassword };
//     } catch (err) {
//         throw err;
//     }
// };

// const verifyEmail = async (token) => {
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const userId = decoded.userId;

//         const [results] = await poolConnect.query('SELECT * FROM TEMP_MEMBER WHERE Token = ?', [token]);
//         if (results.length === 0) {
//             return { message: 'Invalid or expired token', status: 400 };
//         }

//         const user = results[0];
//         await poolConnect.query('INSERT INTO MEMBER (UserID, Password, Name, Email, Phone, Address, RewardPoints, Verified) VALUES (?, ?, ?, ?, ?, ?, 0, 1)', 
//             [user.UserID, user.Password, user.Name, user.Email, user.Phone, user.Address]);
//         await poolConnect.query('DELETE FROM TEMP_MEMBER WHERE UserID = ?', [user.UserID]);
//         return { message: 'Email verified successfully' };
//     } catch (err) {
//         throw err;
//     }
// };

// const completeProfile = async (req) => {
//     const { userId, name, phone, address } = req.body;

//     try {
//         await poolConnect.query('UPDATE MEMBER SET Name = ?, Phone = ?, Address = ? WHERE UserID = ?', 
//             [name, phone, address, userId]);
//         return { message: 'Profile completed successfully' };
//     } catch (err) {
//         throw err;
//     }
// };

// export {
//     registerUser,
//     loginUser,
//     verifyEmail,
//     completeProfile,
//     passport
// };