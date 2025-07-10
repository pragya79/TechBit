import React, { useState, useEffect, useRef } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../App.css';

function CreatePost({ isAuth }) {
  const [title, setTitle] = useState('');
  const [postText, setPostText] = useState('');
  const [image, setImage] = useState(null);
const [imageUrl] = useState(''); 
  const [instagram, setInstagram] = useState('');
  const [github, setGithub] = useState('');
  const quillRef = useRef(null);
  const navigate = useNavigate();
  const postCollectionRef = collection(db, 'posts');

  const uploadImageToCloudinary = async (file) => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
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
        return data.secure_url;
      } catch (error) {
        console.error('Error uploading image:', error);
        return '';
      }
    }
    return '';
  };

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const imageUrl = await uploadImageToCloudinary(file);
        if (imageUrl && quillRef.current) {
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'image', imageUrl);
        }
      }
    };
  };

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: handleImageUpload
      }
    }
  };

  const createPost = async () => {
    if (!title || !postText) {
      alert('Title and post content are required!');
      return;
    }

    const uploadedImageUrl = image ? await uploadImageToCloudinary(image) : imageUrl;
    const publicationDate = new Date().toISOString();

    await addDoc(postCollectionRef, {
      title,
      postText,
      imageUrl: uploadedImageUrl,
      instagram,
      github,
      publicationDate,
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
  }, [isAuth, navigate]);

  return (
    <div className='createPostPage'>
      <div className='cpContainer'>
        <h2>Create a New Post</h2>
        <div className='inputGp'>
          <label>Title</label>
          <input
            type='text'
            placeholder='Enter post title...'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className='inputGp'>
          <label>Content</label>
          <ReactQuill
            ref={quillRef}
            theme='snow'
            value={postText}
            onChange={setPostText}
            modules={modules}
            placeholder='Write your post content here...'
            className='quillEditor'
          />
        </div>
        <div className='inputGp'>
          <label>Featured Image (Optional)</label>
          <input
            type='file'
            accept='image/*'
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <div className='inputGp'>
          <label>Instagram Link (Optional)</label>
          <input
            type='url'
            placeholder='https://instagram.com/yourprofile'
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
          />
        </div>
        <div className='inputGp'>
          <label>GitHub Link (Optional)</label>
          <input
            type='url'
            placeholder='https://github.com/yourprofile'
            value={github}
            onChange={(e) => setGithub(e.target.value)}
          />
        </div>
        <button onClick={createPost}>Publish Post</button>
      </div>
    </div>
  );
}

export default CreatePost;