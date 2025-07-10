import React, { useEffect, useCallback, useState } from 'react';
import { collection, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase-config';
import '../App.css';

function Home({ isAuth }) {
  const [postList, setPostList] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const postCollectionRef = collection(db, 'posts');

  const deletePost = useCallback(async (id) => {
    const postDoc = doc(db, 'posts', id);
    await deleteDoc(postDoc);
  }, []); 

  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postCollectionRef);
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc?.id })));
    };
    getPosts();
  }, [deletePost, postCollectionRef]);

  const openDialog = (post) => {
    setSelectedPost(post);
  };

  const closeDialog = () => {
    setSelectedPost(null);
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
                <button onClick={(e) => { e.stopPropagation(); deletePost(post.id); }}>
                  <span className="deleteIcon">🗑</span>
                </button>
              )}
            </div>
          </div>
          <div className='postTextContainer'>{post.postText}</div>
          {post.imageUrl && (
            <div className='postImageContainer'>
              <img src={post.imageUrl} alt='Post' />
            </div>
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
              <div className='dialogText'>{selectedPost.postText}</div>
              {selectedPost.imageUrl && (
                <div className='dialogImageContainer'>
                  <img src={selectedPost.imageUrl} alt='Post' />
                </div>
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