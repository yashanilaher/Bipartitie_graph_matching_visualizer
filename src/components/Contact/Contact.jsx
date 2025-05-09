import React from 'react';
import './Contact.css';
import photo1 from './photo.jpg'; // Replace with actual photo paths
import photo2 from './photo.jpg'; // Replace with actual photo paths
import { FaLinkedin } from 'react-icons/fa'; // LinkedIn icon

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
          <a 
            href="https://www.linkedin.com/in/yash-aher-274010285/" 
            // target="_blank" 
            // rel="noopener noreferrer" 
            className="linkedin-link"
          >
            <FaLinkedin /> LinkedIn
          </a>
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
          <a 
            href="https://www.linkedin.com/in/mohammed-yassin-4a4a28319/" 
            // target="_blank" 
            // rel="noopener noreferrer" 
            className="linkedin-link"
          >
            <FaLinkedin /> LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}

export default Contact;
