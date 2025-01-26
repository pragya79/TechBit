import React, { useEffect,useCallback, useState } from 'react';
import { collection, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase-config';
import '../App.css';

function Home({ isAuth }) {
  const [postList, setPostList] = useState([]);
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
  }, [deletePost,postCollectionRef]);

  return (
    <div className='homePage'>
      {postList.map((post) => {
        return (
          <div className='post' key={post.id}>
            <div className='postHeader'>
              <div className='title'>
                <h2>{post.title}</h2>
              </div>
              <div className='deletePost'>
                {isAuth && post.author.id === auth.currentUser.uid && (
                  <button onClick={() => deletePost(post.id)}>&#128465;</button>
                )}
              </div>
            </div>
            <div className='postTextContainer'>{post.postText}</div>
            {post.imageUrl && (
              <div className='postImageContainer'>
                <img src={post.imageUrl} alt='Post' />
              </div>
            )}
            <h4>~ {post.author.name}</h4>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
