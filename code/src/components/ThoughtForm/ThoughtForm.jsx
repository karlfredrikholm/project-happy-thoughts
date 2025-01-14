/* eslint-disable indent */
import React, { useState } from 'react';
import { API_URL } from 'components/utils/api';
import styles from './ThoughtForm.module.css';

const ThoughtForm = ({ loading, setFeed }) => {
  const [thought, setThought] = useState('');
  const [tooShortThought, setTooShortThought] = useState('');
  const maxChars = 140;
  const [remainingChars, setRemainingChars] = useState(maxChars);

  // Two things had to be handled when the textarea input changes:
  // On form submit the input value/thought state
  // will be used in the POST request further down.
  // But since it's an onChange event it's also used for
  // counting down characters left while something is being typed in.
  // That's why I put both of these things in the same function.
  const handleInputChange = (event) => {
    const input = event.target.value;
    setThought(input);
    setRemainingChars(maxChars - input.length);
    if (remainingChars < 135) {
      setTooShortThought('');
    }
  };

  const handleTooShortThought = () => {
    if (!thought.trim().length) {
      setTooShortThought('Nothing? 😢');
    } else if (thought.trim().length < 5) {
      setTooShortThought('Too short! ☺️');
    }
    setTimeout(() => setTooShortThought(''), 2000);
  };

  // A function for empyting the textarea input after post request is done
  // and resetting the remaining characters counter to 140
  const handleInputCleanup = () => {
    setThought('');
    setRemainingChars(maxChars);
  };

  // Post request when clicking the send-button in the form
  const handleFormSubmit = (event) => {
    event.preventDefault();
    fetch(API_URL('thoughts'), {
      method: 'POST',
      body: JSON.stringify({ message: thought }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => res.json())
      .then((newThought) => {
        if (!newThought.success) {
          handleTooShortThought();
        } else {
          setFeed((previousThoughts) => [newThought.response, ...previousThoughts]);
          setTooShortThought('')
        }
      })
      .catch((error) => console.error(error))
      .finally(handleInputCleanup);
  };

  return (
    <form onSubmit={handleFormSubmit} className={styles.thoughtForm}>
      <label htmlFor="thought-input">
        <h1 className={styles.thoughtFormHeading}>What&apos;s making you happy right now?</h1>
        <textarea
          id="thought-input"
          maxLength={maxChars}
          onChange={handleInputChange}
          placeholder="Type happy thought..."
          value={thought} />
      </label>
      <div className={styles.sendButtonAndCharsContainer}>
        {loading
          ? <h3 className={styles.loading}>❤️ Loading ❤️</h3>
          : <button
              className={styles.sendButton}
              type="submit"><span role="img" aria-label="heart">❤️</span>Send Happy Thought <span role="img" aria-label="heart">❤️</span>
            </button>}
        <div className={styles.charsAndTooShortContainer}>
          {/* if you haven't typed 5 or more characters the counter will be red, else gray */}
          <p className={remainingChars > 135 ? styles.notEnoughChars : styles.remainingChars}>
            {remainingChars}<span className={styles.remainingChars}> / 140</span>
          </p>
          <p className={styles.tooShort}>{tooShortThought}</p>
        </div>
      </div>
    </form>
  );
};

export default ThoughtForm;
