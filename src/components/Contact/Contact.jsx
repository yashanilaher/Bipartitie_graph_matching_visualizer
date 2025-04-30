import React from 'react';
import './Contact.css';
import photo1 from './photo.jpg'; // You can replace with different photos if needed
import photo2 from './photo.jpg'; // Using same image for demo

function Contact() {
  return (
    <div className='Creators'>
      <div className='Creator-Card'>
        <div className="image">
          <img src={photo1} alt="Yash Aher" />
        </div>
        <div className='About'>
          <h1>Yash Anil Aher</h1>
          <h2>142201035@smail.iitpkd.ac.in</h2>
          <h2>Contact @ 6764839404</h2>
        </div>
      </div>

      <div className='Creator-Card'>
        <div className="image">
          <img src={photo2} alt="Co-Creator" />
        </div>
        <div className='About'>
          <h1>Mohammed Yassin</h1>
          <h2>janedoe@email.com</h2>
          <h2>Contact @ 9876543210</h2>
        </div>
      </div>
    </div>
  );
}

export default Contact;
