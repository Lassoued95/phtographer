// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';

import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import ReviewList from './components/ReviewList';

import { ReviewProvider } from './contexts/ReviewContext';

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

function App() {
  return (
    <ThemeProvider>
      <CopilotKit publicApiKey="ck_pub_d078adb7bceae61d9df17f78c32ec1f0">
        <ReviewProvider>
          <Router>
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
              <Navbar />
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/reviews" element={<ReviewList />} />
              </Routes>

              {/* Chatbot with business info */}
              <CopilotPopup
                labels={{
                  title: "Ask about photography services",
                }}
              />
            </div>
          </Router>
        </ReviewProvider>
      </CopilotKit>
    </ThemeProvider>
  );
}

export default App;
