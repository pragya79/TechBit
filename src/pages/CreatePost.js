import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { debounce } from 'lodash';
import DOMPurify from 'dompurify';
import '../App.css';

const MemoizedQuill = memo(ReactQuill);

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

  useEffect(() => {
    console.log("CreatePost rendered, state:", { title, postText, image, instagram, github, isAuth });
  }, [title, postText, image, instagram, github, isAuth]);

  useEffect(() => {
    console.log("CreatePost isAuth:", isAuth);
    console.log("quillRef:", quillRef.current);
    if (!isAuth) {
      console.log("Redirecting to / because isAuth is false");
      navigate('/');
    }
  }, [isAuth, navigate]);

  const uploadImageToCloudinary = async (file) => {
    if (file) {
      console.log("Uploading image:", file.name);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'blog-site');
      try {
        const response = await fetch(
          'https://api.cloudinary.com/v1_1/du7j4qpni/image/upload',
          { method: 'POST', body: formData }
        );
        const data = await response.json();
        console.log("Cloudinary response:", data);
        return data.secure_url;
      } catch (error) {
        console.error('Error uploading image:', error);
        return '';
      }
    }
    return '';
  };

  const handleImageUpload = async () => {
    try {
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
            let range = quill.getSelection();
            if (!range) {
              const length = quill.getLength();
              range = { index: length - 1, length: 0 };
            }
            quill.insertEmbed(range.index, 'image', imageUrl);
            quill.setSelection(range.index + 1, 0);
          } else {
            console.error("Image upload failed or quillRef is null");
          }
        }
      };
    } catch (error) {
      console.error("handleImageUpload error:", error);
    }
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

  const debouncedSetPostText = useCallback(
    debounce((value) => {
      console.log("ReactQuill content:", value);
      setPostText(value);
    }, 300),
    [setPostText] // Fixed: Includes setPostText in dependencies
  );

  const createPost = async () => {
    if (!title || !postText) {
      alert('Title and post content are required!');
      return;
    }
    const cleanPostText = DOMPurify.sanitize(postText, {
      ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'ol', 'ul', 'li', 'strong', 'em', 'u', 's', 'a', 'img'],
      ALLOWED_ATTR: ['href', 'src'],
      FORBID_TAGS: ['span'],
    });
    const uploadedImageUrl = image ? await uploadImageToCloudinary(image) : imageUrl;
    const publicationDate = new Date().toISOString();
    try {
      console.log("Saving postText:", cleanPostText);
      await addDoc(postCollectionRef, {
        title,
        postText: cleanPostText,
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
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

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
          <MemoizedQuill
            ref={quillRef}
            theme='snow'
            value={postText}
            onChange={debouncedSetPostText}
            modules={modules}
            placeholder='Write your post content here...'
            className='quillEditor'
            readOnly={false}
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