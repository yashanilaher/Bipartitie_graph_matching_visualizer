import React from 'react';
import './Contact.css';
import yash from './yash.jpeg'; // Replace with actual photo paths
import yassin from './yassin.jpg'; // Replace with actual photo paths
import { FaLinkedin } from 'react-icons/fa'; // LinkedIn icon

function Contact() {
  return (
    <div className='Creators'>
      <div className='Creator-Card'>
        <div className="image">
          <img src={yash} alt="Yash Aher" />
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
          <img src={yassin} alt="Co-Creator" />
        </div>
        <div className='About'>
          <h1>Mohammed Yassin</h1>
          <h2>yassin17363@gmail.com</h2>
          <h2>Contact @ 8848240578</h2>
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
