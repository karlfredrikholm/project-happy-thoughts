/* eslint-disable no-underscore-dangle */
import React from 'react';
import styles from './LikeButton.module.css';

const LikeButton = ({ postedThought, postedThoughtId, thoughtsFeed, setThoughtsFeed }) => {
  // this function maps through the thoughts and adds
  // 1 like to the thought with the matching ID of
  // the liked thought, and then updates the feed:
  const handleMessageLiked = (likedThought) => {
    const updatedThoughtsFeed = thoughtsFeed.map((item) => {
      if (item._id === likedThought) {
        item.hearts += 1
      }
      return item
    });
    setThoughtsFeed(updatedThoughtsFeed);
  };
  // when clicking the like button a post request to that particular thought
  // is sent and then we invoke the handleMessageLiked function
  const handleLikeButtonClick = () => {
    fetch(`https://happy-thoughts-technigo.herokuapp.com/thoughts/${postedThoughtId}/like`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' }
    }).then(() => {
      handleMessageLiked(postedThoughtId);
    });
  };

  return (
    <button
    // if the posted thought has no likes background is gray, else pink
      className={postedThought.hearts === 0 ? styles.likeButton : styles.clickedLikeButton}
      onClick={handleLikeButtonClick}
      type="button">
      <span role="img" aria-label="heart">❤️</span>
    </button>
  );
};

export default LikeButton;