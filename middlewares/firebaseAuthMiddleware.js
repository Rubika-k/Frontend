// import admin from 'firebase-admin';

// // Initialize Firebase Admin SDK if not already initialized
// if (!admin.apps.length) {
//   admin.initializeApp();
// }

// const auth = async (req, res, next) => {
//   const token = req.headers.authorization?.split('Bearer ')[1];
//   if (!token) {
//     return res.status(401).json({ message: 'No token provided' });
//   }
//   try {
//     const decodedToken = await admin.auth().verifyIdToken(token);
//     req.user = decodedToken;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };

// export default auth;