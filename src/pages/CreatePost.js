import React, { useState, useEffect } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function CreatePost({ isAuth }) {
  const [title, setTitle] = useState('');
  const [postText, setPostText] = useState('');
  const [image, setImage] = useState(null); 
  const [imageUrl, setImageUrl] = useState(''); 

  const postCollectionRef = collection(db, 'posts');
  let navigate = useNavigate();

  const uploadImageToCloudinary = async () => {
    if (image) {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', 'blog-site'); 

      try {
        const response = await fetch(
          'https://api.cloudinary.com/v1_1/du7j4qpni/image/upload',
          {
            method: 'POST',
            body: formData,
          }
        );
        const data = await response.json();
        setImageUrl(data.secure_url); 
        return data.secure_url;
      } catch (error) {
        console.error('Error uploading image:', error);
        return '';
      }
    }
    return '';
  };

  const createPost = async () => {
    if (!title || !postText) { 
      alert('Title and post content both are required!');
      return;
    }
  
    if (!image && !imageUrl) { 
      alert('Please upload an image!');
      return;
    }
  
    const uploadedImageUrl = image ? await uploadImageToCloudinary() : imageUrl;
  
    await addDoc(postCollectionRef, {
      title: title,
      postText: postText,
      imageUrl: uploadedImageUrl, 
      author: {
        name: auth.currentUser?.displayName,
        id: auth.currentUser?.uid,
      },
    });
  
    navigate('/'); 
  };
  

  useEffect(() => {
    if (!isAuth) {
      navigate('/');
    }
  }, []);

  return (
    <div className='createPostPage'>
      <div className='cpContainer'>
        <h2>Create A Post</h2>
        <div className='inputGp'>
          <label>Title:</label>
          <input
            type='text'
            placeholder='Title...'
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className='inputGp'>
          <label>Post:</label>
          <textarea
            placeholder='What do you wanna write about...?'
            onChange={(e) => setPostText(e.target.value)}
          />
        </div>
        <div className='inputGp'>
          <label>Upload image:</label>
          <input
            type='file'
            accept='image/*'
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <button onClick={createPost}>Post</button>
      </div>
    </div>
  );
}

export default CreatePost;
