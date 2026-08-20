import React, { useEffect } from 'react';
import AnimatedSection from './AnimatedSection';

export default function GoogleReviews() {
  const [reviewCount, setReviewCount] = React.useState<number>(22);

  useEffect(() => {
    if (!document.querySelector('script[data-elfsight-platform]')) {
      const script = document.createElement('script');
      script.src = 'https://elfsightcdn.com/platform.js';
      script.async = true;
      script.setAttribute('data-elfsight-platform', 'true');
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (typeof data.googleReviewCount === 'number') {
          setReviewCount(data.googleReviewCount);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    let injected = false;

    const applyTheme = () => {
      const allElements = document.querySelectorAll('*');
      allElements.forEach((el) => {
        if (el.shadowRoot) {
          // Inject dark theme stylesheet (once per shadow root)
          if (!el.shadowRoot.querySelector('#weipa-dark-theme-style')) {
            const style = document.createElement('style');
            style.id = 'weipa-dark-theme-style';
            style.textContent = `
* {
color: #FFFFFF !important;
}

div,
section,
article,
span,
p,
h1,
h2,
h3,
h4,
h5,
h6 {
color: #FFFFFF !important;
}

a {
color: #60A5FA !important;
}
.eEAvqJ{
display: none !important;
}

.lmCBpO path {
    fill: rgb(34 64 213) !important;
}

.kMYDlG{
display: none !important;
}
.fkPBQm {
  background-color: rgb(11, 17, 24) !important;
  border: 1px solid rgba(10, 115, 255, 0.3) !important;
}

.kjjOse{
  background-color: #0b1118 !important;
  border: 1px solid #ffffff14 !important;
}

.hmneiu{
    color: rgb(255, 255, 255);
}

button {
background: #1D4ED8 !important;
color: #FFFFFF !important;
border: none !important;
}

.eJuEGV path {
  fill: #0a73ff !important;
}

.swiper-slide{
width: 350px !important;
}


svg {
fill: currentColor !important;
}
`;
            style.id = 'weipa-dark-theme-style';
            el.shadowRoot.appendChild(style);
            injected = true;
          }
        }
      });
    };

    applyTheme();
    const interval = setInterval(applyTheme, 150);

    const observer = new MutationObserver(applyTheme);
    observer.observe(document.body, { childList: true, subtree: true });

    // Stop polling after widget has fully loaded (5s is generous)
    const stopPolling = setTimeout(() => clearInterval(interval), 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(stopPolling);
      observer.disconnect();
    };
  }, []);

  return (
    <section className="google-reviews-section">
      <div className="container" style={{ padding: '50px 0' }}>
        <AnimatedSection animation="fade-up">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="section-badge" style={{ justifyContent: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#0a73ff" stroke="#0a73ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star" aria-hidden="true">
                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
              </svg>
              Based on {reviewCount} Google Reviews
            </div>
            <h2 className="section-title">WHAT OUR CUSTOMERS SAY</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Trusted by vehicle owners across Weipa and Far North Queensland. Rated 5.0 Stars based on {reviewCount} Google Reviews.
            </p>
          </div>
        </AnimatedSection>
        
        {/* Elfsight Google Reviews Widget */}
        <AnimatedSection animation="fade-up" delay={150}>
          <div className="elfsight-app-870693bb-046b-46e5-b2e2-d8ecd3a75971" data-elfsight-app-lazy></div>
        </AnimatedSection>
      </div>
    </section>
  );
}