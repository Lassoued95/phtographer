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
import { useBusinessInfo } from './hooks/useCopilotReadable';

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

// Component to initialize business info for CopilotKit
const BusinessInfoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useBusinessInfo();
  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider>
      <CopilotKit 
        publicApiKey="ck_pub_d078adb7bceae61d9df17f78c32ec1f0"
        instructions={`
          You are a helpful assistant for Djerba Lens, a professional photography business in Djerba, Tunisia. 

          IMPORTANT GUIDELINES:
          - Always be professional, friendly, and enthusiastic about photography
          - Provide specific information about services, pricing, and contact details when asked
          - Encourage potential clients to contact Mohamed for bookings
          - If asked about availability, remind them to book 1-2 weeks in advance
          - For urgent requests, recommend WhatsApp for faster response
          - Always mention that services are exclusively in Djerba, Tunisia
          - Be knowledgeable about local photography spots and Tunisian culture
          - Help with booking questions, service details, and general photography advice

          CONTACT INFO TO REMEMBER:
          - Email: djerbatnsphoto@gmail.com
          - Phone/WhatsApp: +216 25 740 872
          - Instagram: @djerbatns
          - Location: Djerba, Tunisia only
          - Response time: Within 24 hours

          SERVICES SUMMARY:
          - Tourist photo shoots (couples, families, groups)
          - Promotional videos for businesses
          - Photo editing and retouching
          - Social media content creation
          - Villa and real estate photography

          Always end conversations by encouraging them to contact Mohamed directly for bookings or specific questions.
        `}
      >
        <BusinessInfoProvider>
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

                {/* Enhanced Chatbot with business context */}
                <CopilotPopup
                  labels={{
                    title: "Ask about Djerba Lens Photography",
                    initial: "Hi! I'm here to help you with information about our photography services in Djerba. Ask me about:\n\n📸 Photo sessions & packages\n📞 Contact & booking info\n🏝️ Best photo spots in Djerba\n💰 Pricing & availability\n\nHow can I help you today?",
                  }}
                  instructions="You are representing Djerba Lens photography business. Be helpful, professional, and always encourage direct contact with Mohamed for bookings."
                />
              </div>
            </Router>
          </ReviewProvider>
        </BusinessInfoProvider>
      </CopilotKit>
    </ThemeProvider>
  );
}

export default App;