// Home.js
import React, { useState, useEffect, useCallback } from 'react';
import { collection, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Home({ isAuth }) {
  const [postList, setPostList] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const postCollectionRef = collection(db, 'posts');
  const navigate = useNavigate();

  const deletePost = useCallback(async (id) => {
    const postDoc = doc(db, 'posts', id);
    await deleteDoc(postDoc);
    // Refresh posts after deletion
    const data = await getDocs(postCollectionRef);
    setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  }, [postCollectionRef]);

  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postCollectionRef);
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getPosts();
  }, [postCollectionRef]);

  const openDialog = (post) => setSelectedPost(post);
  const closeDialog = () => setSelectedPost(null);

  const editPost = (post) => {
    navigate('/createpost', { state: { post } }); 
  };

  return (
    <div className='homePage'>
      {postList.map((post) => (
        <div className='post' key={post.id} onClick={() => openDialog(post)}>
          <div className='postHeader'>
            <div className='title'>
              <h2>{post.title}</h2>
            </div>
            <div className='deletePost'>
              {isAuth && post.author.id === auth.currentUser.uid && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); editPost(post); }}
                    style={{ marginRight: '10px' }}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deletePost(post.id); }}
                  >
                    🗑
                  </button>
                </>
              )}
            </div>
          </div>

          <div className='postTextContainer' dangerouslySetInnerHTML={{ __html: post.postText }} />

          {post.category && (
            <p style={{ fontStyle: 'italic', color: '#2563eb', marginTop: '8px' }}>
              Category: {post.category}
            </p>
          )}

          {post.imageUrl && (
            <div className='postImageContainer'>
              <img src={post.imageUrl} alt='Post' />
            </div>
          )}

          {post.fileUrl && (
            <div style={{ marginTop: '10px' }}>
              <a href={post.fileUrl} target='_blank' rel='noopener noreferrer'>
                📎 Download Attached File
              </a>
            </div>
          )}

          {post.publicationDate && (
            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '5px' }}>
              Published: {new Date(post.publicationDate).toLocaleString()}
            </p>
          )}

          <div className='postFooter'>
            <h4>~ {post.author.name}</h4>
          </div>
        </div>
      ))}

      {selectedPost && (
        <div className='dialogOverlay'>
          <div className='dialog'>
            <div className='dialogHeader'>
              <h2>{selectedPost.title}</h2>
              <button className='closeDialogBtn' onClick={closeDialog}>✖</button>
            </div>
            <div className='dialogContent'>
              <div className='dialogText' dangerouslySetInnerHTML={{ __html: selectedPost.postText }} />

              {selectedPost.category && (
                <p style={{ fontStyle: 'italic', color: '#2563eb', marginTop: '8px' }}>
                  Category: {selectedPost.category}
                </p>
              )}

              {selectedPost.imageUrl && (
                <div className='dialogImageContainer'>
                  <img src={selectedPost.imageUrl} alt='Post' />
                </div>
              )}

              {selectedPost.fileUrl && (
                <div style={{ marginTop: '10px' }}>
                  <a href={selectedPost.fileUrl} target='_blank' rel='noopener noreferrer'>
                    📎 Download Attached File
                  </a>
                </div>
              )}

              {selectedPost.publicationDate && (
                <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '5px' }}>
                  Published: {new Date(selectedPost.publicationDate).toLocaleString()}
                </p>
              )}

              <div className='dialogFooter'>
                <h4>~ {selectedPost.author.name}</h4>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
