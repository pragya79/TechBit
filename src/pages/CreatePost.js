// CreatePost.js
import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase-config';
import { useNavigate, useLocation } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { debounce } from 'lodash';
import DOMPurify from 'dompurify';
import '../App.css';

const MemoizedQuill = memo(ReactQuill);

function CreatePost({ isAuth }) {
  const location = useLocation();
  const existingPost = location.state?.post || null; // 👈 Get post object if editing
  const [title, setTitle] = useState(existingPost ? existingPost.title : '');
  const [postText, setPostText] = useState(existingPost ? existingPost.postText : '');
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(existingPost ? existingPost.imageUrl : '');
  const [fileUrl, setFileUrl] = useState(existingPost ? existingPost.fileUrl : '');
  const [instagram, setInstagram] = useState(existingPost ? existingPost.instagram : '');
  const [github, setGithub] = useState(existingPost ? existingPost.github : '');
  const [category, setCategory] = useState(existingPost ? existingPost.category : 'Technical');
  const quillRef = useRef(null);
  const navigate = useNavigate();
  const postCollectionRef = collection(db, 'posts');

  useEffect(() => {
    if (!isAuth) navigate('/');
  }, [isAuth, navigate]);

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'blog-site');
      try {
        const response = await fetch('https://api.cloudinary.com/v1_1/du7j4qpni/image/upload', { method: 'POST', body: formData });
        const data = await response.json();
        return data.secure_url;
      } catch (error) {
        console.error('Error uploading image:', error);
        return '';
      }
    }
    return '';
  };

  // Upload general file to Cloudinary
  const uploadFileToCloudinary = async (file) => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'blog-site');
      try {
        const response = await fetch('https://api.cloudinary.com/v1_1/du7j4qpni/raw/upload', { method: 'POST', body: formData });
        const data = await response.json();
        return data.secure_url;
      } catch (error) {
        console.error('Error uploading file:', error);
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
      if (file && quillRef.current) {
        const imageUrl = await uploadImageToCloudinary(file);
        const quill = quillRef.current.getEditor();
        let range = quill.getSelection() || { index: quill.getLength() - 1, length: 0 };
        quill.insertEmbed(range.index, 'image', imageUrl);
        quill.setSelection(range.index + 1, 0);
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
      handlers: { image: handleImageUpload }
    }
  };

  const debouncedSetPostText = useCallback(
    debounce((value) => setPostText(value), 300),
    [setPostText]
  );

  const handleSubmit = async () => {
    if (!title || !postText) {
      alert('Title and content are required!');
      return;
    }

    const cleanPostText = DOMPurify.sanitize(postText, {
      ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'ol', 'ul', 'li', 'strong', 'em', 'u', 's', 'a', 'img'],
      ALLOWED_ATTR: ['href', 'src'],
      FORBID_TAGS: ['span'],
    });

    const uploadedImageUrl = image ? await uploadImageToCloudinary(image) : imageUrl;
    const uploadedFileUrl = file ? await uploadFileToCloudinary(file) : fileUrl;
    const publicationDate = new Date().toISOString();

    try {
      if (existingPost) {
        // ✅ Update existing post
        const postDoc = doc(db, 'posts', existingPost.id);
        await updateDoc(postDoc, {
          title,
          postText: cleanPostText,
          imageUrl: uploadedImageUrl,
          fileUrl: uploadedFileUrl,
          instagram,
          github,
          category,
          publicationDate
        });
      } else {
        // ✅ Create new post
        await addDoc(postCollectionRef, {
          title,
          postText: cleanPostText,
          imageUrl: uploadedImageUrl,
          fileUrl: uploadedFileUrl,
          instagram,
          github,
          category,
          publicationDate,
          author: { name: auth.currentUser?.displayName, id: auth.currentUser?.uid }
        });
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  return (
    <div className='createPostPage'>
      <div className='cpContainer'>
        <h2>{existingPost ? 'Edit Post' : 'Create a New Post'}</h2>

        {/* Title */}
        <div className='inputGp'>
          <label>Title</label>
          <input type='text' placeholder='Enter post title...' value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        {/* Content */}
        <div className='inputGp'>
          <label>Content</label>
          <MemoizedQuill
            ref={quillRef}
            theme='snow'
            value={postText}
            onChange={debouncedSetPostText}
            modules={modules}
            placeholder='Write your post content here...'
            className='quillEditor'
          />
        </div>

        {/* Featured Image */}
        <div className='inputGp'>
          <label>Featured Image (Optional)</label>
          <input type='file' accept='image/*' onChange={(e) => setImage(e.target.files[0])} />
          {imageUrl && !image && <p>📷 Current Image: <a href={imageUrl} target="_blank" rel="noopener noreferrer">View</a></p>}
        </div>

        {/* General File */}
        <div className='inputGp'>
          <label>Attach File (Optional)</label>
          <input type='file' onChange={(e) => setFile(e.target.files[0])} />
          {file?.name && <p>📂 Selected: {file.name}</p>}
          {fileUrl && !file && <p>📎 Current File: <a href={fileUrl} target="_blank" rel="noopener noreferrer">Download</a></p>}
        </div>

        {/* Category */}
        <div className='inputGp'>
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Technical">Technical</option>
            <option value="Poetry">Poetry</option>
            <option value="Personal Experience">Personal Experience</option>
            <option value="Interview Experience">Interview Experience</option>
          </select>
        </div>

        {/* Instagram */}
        <div className='inputGp'>
          <label>Instagram Link (Optional)</label>
          <input type='url' placeholder='https://instagram.com/yourprofile' value={instagram} onChange={(e) => setInstagram(e.target.value)} />
        </div>

        {/* GitHub */}
        <div className='inputGp'>
          <label>GitHub Link (Optional)</label>
          <input type='url' placeholder='https://github.com/yourprofile' value={github} onChange={(e) => setGithub(e.target.value)} />
        </div>

        <button onClick={handleSubmit}>{existingPost ? 'Update Post' : 'Publish Post'}</button>
      </div>
    </div>
  );
}

export default CreatePost;
