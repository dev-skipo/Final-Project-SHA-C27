import React, { useEffect } from 'react'; // Import useEffect
import { useNavigate } from 'react-router-dom'; // For navigation
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // For Bootstrap Icons
import AnimatedSection from './AnimatedSection'; // Import the reusable component

const LandingPage = () => {
  const navigate = useNavigate(); // Hook for navigation

  // Check if the user is logged in
  const isLoggedIn = () => {
    // Replace this with your actual authentication check
    // For example, check for a token in localStorage or a state in Redux/Context
    return localStorage.getItem('token') !== null;
  };

  // Redirect to /dashboard if the user is logged in
  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/dashboard'); // Redirect to the dashboard
    }
  }, [navigate]);


  return (
    <div>
      {/* Section 1: Hero Section */}
      
        <section 
          className="d-flex align-items-center vh-100 bg-black text-white"
          style={{ padding: '20px' }}
        >
          <div className="container">
          <AnimatedSection>
            <div className="row align-items-center">
              {/* Left Side: Title, Description, and Buttons */}
              <div className="col-md-6 text-center text-md-start">
                <h1 className="display-4 mb-4">The Complete Link Aggregator You Will Ever Need.</h1>
                <p className="lead mb-4">It’s free, and takes less than a minute.</p>
                <div className="d-flex gap-3 justify-content-center justify-content-md-start">
                <a 
  href="/register" 
  className="btn btn-light rounded-pill"
>
  Create Account
</a>
<a 
  href="#" 
  className="btn btn-outline-light rounded-pill"
>
  Read More
</a>
                </div>
              </div>
              {/* Right Side: Image */}
              <div className="col-md-6 mt-4 mt-md-0">
                <img 
                  src="https://i.ibb.co/xGLW20N/1-link.png" 
                  alt="Hero" 
                  className="img-fluid rounded"
                />
              </div>
            </div>
            </AnimatedSection>
          </div>
        </section>
     

      {/* Section 2: Split Screen - Half Picture and Half Text */}
      
        <section 
          className="d-flex align-items-center"
          style={{ padding: '20px' }}
        >
          <div className="container">
          <AnimatedSection>
            <div className="row">
              {/* Left Side: Image */}
              <div className="col-md-6 d-flex align-items-center">
                <img 
                  src="https://i.ibb.co/mNNDqPF/1-link-15.png" 
                  alt="Feature" 
                  className="img-fluid rounded"
                />
              </div>
             {/* Right Side: Text and List */}
<div className="col-md-6 d-flex align-items-center">
  <div className="p-4 bg-light rounded shadow-sm">
    <h2 className="mb-4 display-5">
      Built-in analytics
    </h2>
    <p className="text-muted mb-4">
      Easy to understand, yet detailed and comprehensive analytics for all your links. GDPR, CCPA and PECR compliant.
    </p>
    {/* List */}
    <ul className="list-unstyled">
      <li className="mb-3">
        <div className="d-flex align-items-center">
          <i className="bi bi-check2 me-3 text-success fs-5"></i>
          <div>
            <strong>Countries & cities</strong>
          </div>
        </div>
      </li>
      <li className="mb-3">
        <div className="d-flex align-items-center">
        <i className="bi bi-check2 me-3 text-success fs-5"></i>
          <div>
            <strong>Referrers & UTMs</strong>
          </div>
        </div>
      </li>
      <li className="mb-3">
        <div className="d-flex align-items-center">
        <i className="bi bi-check2 me-3 text-success fs-5"></i>
          <div>
            <strong>Devices & operating systems</strong>
          </div>
        </div>
      </li>
      <li className="mb-3">
        <div className="d-flex align-items-center">
        <i className="bi bi-check2 me-3 text-success fs-5"></i>
          <div>
            <strong>Browsers, Languages</strong> 
          </div>
        </div>
      </li>
    </ul>
  </div>
</div>
            </div>
            </AnimatedSection>
          </div>
        </section>
     

      {/* Section 3: Split Screen - Half Picture and Half Text (Reversed) */}
      
        <section 
          className="d-flex align-items-center"
          style={{ padding: '20px' }}
        >
          <div className="container">
          <AnimatedSection>
            <div className="row">
              {/* Right Side: Image */}
              <div className="col-md-6 d-flex align-items-center order-md-2">
                <img 
                  src="https://i.ibb.co/xjpfhzc/1-link-9.png" 
                  alt="Feature" 
                  className="img-fluid rounded"
                />
              </div>
              {/* Left Side: Text and List */}
<div className="col-md-6 d-flex align-items-center order-md-1">
  <div className="p-4 bg-light rounded shadow-sm">
    <h2 className="mb-4 display-5">
      Bio link pages
    </h2>
    <p className="text-muted mb-4">
    Create your own unique and highly customizable bio link page with ease and simplicity.
    </p>
    {/* List */}
    <ul className="list-unstyled">
      <li className="mb-3">
        <div className="d-flex align-items-center">
        <i className="bi bi-check2 me-3 text-success fs-5"></i>
        <div>
            <strong>Custom colors & branding</strong>
          </div>
        </div>
      </li>
      <li className="mb-3">
        <div className="d-flex align-items-center">
        <i className="bi bi-check2 me-3 text-success fs-5"></i>
        <div>
            <strong>Tons of ready-to-use components</strong> 
          </div>
        </div>
      </li>
      <li className="mb-3">
        <div className="d-flex align-items-center">
        <i className="bi bi-check2 me-3 text-success fs-5"></i>
        <div>
            <strong>SEO settings</strong> 
          </div>
        </div>
      </li>
      <li className="mb-3">
        <div className="d-flex align-items-center">
        <i className="bi bi-check2 me-3 text-success fs-5"></i>
        <div>
            <strong>Password protection, sensitive content warning</strong> 
          </div>
        </div>
      </li>
    </ul>
  </div>
</div>
            </div>
            </AnimatedSection>
          </div>
        </section>
      

      {/* Section 4: Split Screen - Half Picture and Half Text */}
      
        <section 
          className="d-flex align-items-center"
          style={{ padding: '20px' }}
        >
          <div className="container">
          <AnimatedSection>
            <div className="row">
              {/* Left Side: Image */}
              <div className="col-md-6 d-flex align-items-center">
                <img 
                  src="https://i.ibb.co/JjC1rnL/1-link-8.png" 
                  alt="Feature" 
                  className="img-fluid rounded"
                />
              </div>
             {/* Right Side: Text and List */}
<div className="col-md-6 d-flex align-items-center">
  <div className="p-4 bg-light rounded shadow-sm">
    <h2 className="mb-4 display-5">
    URL Selection
    </h2>
    <p className="text-muted mb-4">
    Select from a wide variety of links to best represent you, your brand, and your content.
    </p>
    {/* List */}
    <ul className="list-unstyled">
      <li className="mb-3">
        <div className="d-flex align-items-center">
        <i className="bi bi-check2 me-3 text-success fs-5"></i>
        <div>
            <strong>Links.to/you</strong>
          </div>
        </div>
      </li>
      <li className="mb-3">
        <div className="d-flex align-items-center">
        <i className="bi bi-check2 me-3 text-success fs-5"></i>
        <div>
            <strong>Card.to/business</strong> 
          </div>
        </div>
      </li>
      <li className="mb-3">
        <div className="d-flex align-items-center">
        <i className="bi bi-check2 me-3 text-success fs-5"></i>
        <div>
            <strong>Flyer.to/event</strong> 
          </div>
        </div>
      </li>
    </ul>
  </div>
</div>
            </div>
            </AnimatedSection>
          </div>
        </section>
      

      {/* Section 5: Reviews Section */}
      
        <section 
          className="d-flex flex-column justify-content-center align-items-center vh-100 bg-black"
          style={{ padding: '20px' }}
        >
          {/* Centered Text */}
          <AnimatedSection>
          <h2 className="text-center mb-5 display-4 fw-bold text-white">Loved by 500,000+ creators</h2>
          
          {/* Review Cards */}
          <div className="container">
            <div className="row g-4">
              {/* Review Card 1 */}
              <div className="col-md-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body text-center">
                    <h5 className="card-title">Amazing Platform!</h5>
                    <p className="card-text">
                      "This platform has completely transformed how I share my work. Highly recommended!"
                    </p>
                    <p className="text-muted">- John Doe</p>
                  </div>
                </div>
              </div>
              {/* Review Card 2 */}
              <div className="col-md-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body text-center">
                    <h5 className="card-title">Easy to Use</h5>
                    <p className="card-text">
                      "I love how intuitive and user-friendly this platform is. It’s perfect for creators!"
                    </p>
                    <p className="text-muted">- Jane Smith</p>
                  </div>
                </div>
              </div>
              {/* Review Card 3 */}
              <div className="col-md-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body text-center">
                    <h5 className="card-title">Game Changer</h5>
                    <p className="card-text">
                      "A must-have tool for anyone looking to grow their online presence. Absolutely love it!"
                    </p>
                    <p className="text-muted">- Mike Johnson</p>
                  </div>
                </div>
              </div>
            </div>
           
          </div>

          
          </AnimatedSection>
        </section>
    

      {/* Section 6: Create Account and Button */}
      
        <section 
          className="d-flex justify-content-center align-items-center bg-black"
          style={{ padding: '20px' }}
        >
          {/* Container for Title and Button */}
          <AnimatedSection>
          <div className="d-flex flex-column flex-md-row align-items-center gap-3">
            {/* Title */}
            <h2 className="mb-0 fs-5 fw-bold text-center text-md-start text-light">Create your Free Account Now!</h2>
            
            {/* Button */}
            <a 
              href="/register" // Redirects to /register
              className="btn btn-light rounded-circle "
            >
              <i className="bi bi-arrow-right"></i>
            </a>
          </div>
          </AnimatedSection>
        </section>
      

      {/* Section 7: Powered by SHA-2025 */}
      
        <section 
          className="d-flex justify-content-center align-items-center vh-50 bg-black"
          style={{ padding: '20px' }}
        >
          <AnimatedSection>
          {/* Container for Title as Link */}
          <div className="d-flex flex-column align-items-center gap-3 rounded-pill">
            {/* Title as Link */}
            <a 
              href="https://socialhackersacademy.org/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white text-decoration-none"
            >
              <p className="mb-0 fs-5 text-light">Powered by SHA</p>
            </a>
          </div>
          </AnimatedSection>
        </section>
      
    </div>
  );
};

export default LandingPage;