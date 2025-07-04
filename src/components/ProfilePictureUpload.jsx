// import React, { useState } from 'react';
// import axios from '../axiosConfig';

// const ProfilePictureUpload = ({ currentUser, onUpdate }) => {
//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState(currentUser.profilePicture || '');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       if (!selectedFile.type.startsWith('image/')) {
//         setError('Only image files are allowed');
//         return;
//       }
//       if (selectedFile.size > 5 * 1024 * 1024) {
//         setError('File size must be less than 5MB');
//         return;
//       }
//       setFile(selectedFile);
//       setPreview(URL.createObjectURL(selectedFile));
//       setError('');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) return;

//     setLoading(true);
//     setError('');
//     const formData = new FormData();
//     formData.append('profilePicture', file);

//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post('/api/users/me/profile-picture', formData, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       onUpdate(response.data.profilePicture);
//       alert('Profile picture updated successfully!');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to upload image');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="profile-upload-container mt-4">
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <input
//             type="file"
//             id="profilePicture"
//             onChange={handleFileChange}
//             accept="image/jpeg, image/png"
//             className="file-input"
//             disabled={loading}
//           />
//           <label htmlFor="profilePicture" className="file-label">
//             {loading ? 'Uploading...' : 'Change Photo'}
//           </label>
//         </div>
//         {preview && (
//           <div className="preview-container">
//             <img src={preview} alt="Preview" className="profile-preview" />
//           </div>
//         )}
//         {error && <div className="error-message">{error}</div>}
//         <button 
//           type="submit" 
//           disabled={loading || !file}
//           className="upload-button"
//         >
//           {loading ? 'Uploading...' : 'Upload Picture'}
//         </button>
//       </form>
//       <style jsx>{`
//         .profile-upload-container {
//           margin-top: 1rem;
//         }
//         .preview-container {
//           margin: 10px 0;
//           text-align: center;
//         }
//         .profile-preview {
//           width: 100px;
//           height: 100px;
//           border-radius: 50%;
//           object-fit: cover;
//           border: 2px solid #eee;
//         }
//         .file-input {
//           display: none;
//         }
//         .file-label {
//           display: inline-block;
//           padding: 8px 12px;
//           background: #4CAF50;
//           color: white;
//           border-radius: 4px;
//           cursor: pointer;
//           margin-bottom: 10px;
//         }
//         .upload-button {
//           background: #2196F3;
//           color: white;
//           border: none;
//           padding: 8px 16px;
//           border-radius: 4px;
//           cursor: pointer;
//           font-size: 14px;
//         }
//         .upload-button:disabled {
//           background: #cccccc;
//           cursor: not-allowed;
//         }
//         .error-message {
//           color: #f44336;
//           margin: 10px 0;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ProfilePictureUpload;