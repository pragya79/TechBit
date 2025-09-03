// Home.js
import React, { useState, useEffect, useCallback } from 'react';
import { collection, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Home({ isAuth }) {
  const [postList, setPostList] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'

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
      const posts = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setPostList(posts);
    };
    getPosts();
  }, [postCollectionRef]);

  // Apply search, filter and sort
  useEffect(() => {
    let tempPosts = [...postList];

    // Search by title
    if (searchTerm) {
      tempPosts = tempPosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== 'All') {
      tempPosts = tempPosts.filter(post => post.category === categoryFilter);
    }

    // Sort by date
    tempPosts.sort((a, b) => {
      const dateA = new Date(a.publicationDate);
      const dateB = new Date(b.publicationDate);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredPosts(tempPosts);
  }, [postList, searchTerm, categoryFilter, sortOrder]);

  const openDialog = (post) => setSelectedPost(post);
  const closeDialog = () => setSelectedPost(null);
  const editPost = (post) => navigate('/createpost', { state: { post } });

  return (
    <div className='homePage'>
      {/* Controls */}
      <div className='controls'>
        <input
          type='text'
          placeholder='Search by title...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value='All'>All Categories</option>
          <option value='Technical'>Technical</option>
          <option value='Poetry'>Poetry</option>
          <option value='Personal Experience'>Personal Experience</option>
          <option value='Interview Experience'>Interview Experience</option>
        </select>

        <button onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}>
          Sort: {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
        </button>
      </div>

      {/* Posts */}
      {filteredPosts.map((post) => (
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

      {/* Dialog */}
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
