/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import ThoughtForm from 'components/ThoughtForm/ThoughtForm';
import ThoughtCard from 'components/ThoughtCard/ThoughtCard';
import styles from './Feed.module.css';

const Feed = () => {
  // One state for the api response which will be the feed with thoughts
  // when map through in the ThoughtCard component:
  // And another for the loading message
  const [page, setPage] = useState(1);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(false);

  // A separate function for the GET request to the api
  // being invoked in the useEffect hook further down
  // when this component is mounted (in the App.jsx)
  const fetchThoughts = () => {
    setLoading(true);
    fetch(`https://happy-thoughts-api-5gwus5mtja-lz.a.run.app/thoughts?page=${page}&perPage=10`)
      .then((res) => res.json())
      .then((data) => setFeed(data.response))
      .catch((error) => console.error(error))

    setFeed((prev) => [...prev, ...feed])
    console.log(...feed)
    setLoading(false);
  };

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop + 1
       >= document.documentElement.scrollHeight) {
      setLoading(true)
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchThoughts();
  }, [page]);

  // Mounting the two "main" components
  // and passing setThoughtsFeed to both of them
  // because it will be needed for dealing with
  // new posts posted with the ThoughtForm
  // and also for when you like a post with the
  // LikeButton mounted in the ThoughtCard component
  return (
    <section className={styles.feedGrid}>
      <ThoughtForm setFeed={setFeed} />
      <ThoughtCard feed={feed} setFeed={setFeed} />
      {loading && <h3>❤️ Loading ❤️</h3>}
    </section>
  );
};

export default Feed;