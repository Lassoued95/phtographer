import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send, Clock, CheckCircle, Star } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import ReviewForm from '../components/ReviewForm';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'contact' | 'review'>('contact');
  const [reviews, setReviews] = useState([
    {
      name: "Sarah Johnson",
      location: "UK Tourist",
      text: "Amazing photos of our Djerba vacation! Professional and creative.",
      rating: 5,
    },
    {
      name: "Hotel Djerba Plaza",
      location: "Tourism Partner",
      text: "Excellent promotional content that boosted our bookings significantly.",
      rating: 5,
    },
    {
      name: "Marco Rossi",
      location: "Italian Traveler",
      text: "Captured the essence of Tunisia beautifully. Highly recommended!",
      rating: 5,
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleReviewSubmit = (review: { name: string; location: string; text: string; rating: number }) => {
    setReviews([review, ...reviews]);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'lassouedmohamed2004@gmail.com',
      link: 'mailto:lassouedmohamed2004@gmail.com'
    },
    {
      icon: Phone,
      title: 'Phone / WhatsApp',
      value: '+216 25 740 872',
      link: 'tel:+21625740872'
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Djerba, Tunisia',
      link: 'https://maps.google.com/?q=Djerba,Tunisia'
    },
    {
      icon: Clock,
      title: 'Response Time',
      value: 'Within 24 hours',
      link: null
    }
  ];

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-6">Get in Touch</h1>
              <p className="text-xl text-red-100 max-w-2xl mx-auto">
                Ready to capture your perfect moments in Tunisia? Let's discuss your project and create something beautiful together.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('contact')}
                className={`py-4 px-6 font-medium transition-all duration-200 border-b-2 ${
                  activeTab === 'contact'
                    ? 'border-red-600 text-red-600 dark:text-red-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Contact Me
              </button>
              <button
                onClick={() => setActiveTab('review')}
                className={`py-4 px-6 font-medium transition-all duration-200 border-b-2 flex items-center ${
                  activeTab === 'review'
                    ? 'border-red-600 text-red-600 dark:text-red-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Star className="h-4 w-4 mr-2" />
                Leave a Review
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      {activeTab === 'contact' && (
        <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <AnimatedSection>
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 transition-colors duration-300">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    Send a Message
                  </h2>
                  
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Thank you for reaching out. I'll get back to you within 24 hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="contact-name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200"
                            placeholder="Your full name"
                          />
                        </div>
                        <div>
                          <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="contact-email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="contact-phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200"
                            placeholder="+216 12 345 678"
                          />
                        </div>
                        <div>
                          <label htmlFor="contact-service" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Service Interested In
                          </label>
                          <select
                            id="contact-service"
                            name="service"
                            value={formData.service}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200"
                          >
                            <option value="">Select a service</option>
                            <option value="tourist-photoshoot">Tourist Photo Shoot</option>
                            <option value="promotional-video">Promotional Video</option>
                            <option value="photo-editing">Photo Editing</option>
                            <option value="social-media">Social Media Content</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Message *
                        </label>
                        <textarea
                          id="contact-message"
                          name="message"
                          required
                          rows={6}
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200 resize-none"
                          placeholder="Tell me about your project, preferred dates, and any specific requirements..."
                        ></textarea>
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-lg transition-all duration-300 flex items-center justify-center transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        Send Message
                        <Send className="ml-2 h-5 w-5" />
                      </button>
                    </form>
                  )}
                </div>
              </AnimatedSection>

              {/* Contact Information */}
              <AnimatedSection delay={200}>
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                      Contact Information
                    </h2>
                    <div className="space-y-6">
                      {contactInfo.map((info, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                              <info.icon className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {info.title}
                            </h3>
                            {info.link ? (
                              <a
                                href={info.link}
                                target={info.link.startsWith('https') ? '_blank' : undefined}
                                rel={info.link.startsWith('https') ? 'noopener noreferrer' : undefined}
                                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
                              >
                                {info.value}
                              </a>
                            ) : (
                              <span className="text-gray-600 dark:text-gray-300">
                                {info.value}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Booking */}
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-100 dark:border-red-800 transition-colors duration-300">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Quick Booking
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      For faster response, especially for urgent bookings, reach out via WhatsApp.
                    </p>
                    <a
                      href="https://wa.me/21612345678"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <MessageSquare className="mr-2 h-5 w-5" />
                      WhatsApp Me
                    </a>
                  </div>

                  {/* FAQ */}
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600 transition-colors duration-300">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Frequently Asked Questions
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <strong className="text-gray-900 dark:text-white">
                          How far in advance should I book?
                        </strong>
                        <p className="text-gray-600 dark:text-gray-300">
                          I recommend booking at least 1-2 weeks in advance, especially during peak tourist season.
                        </p>
                      </div>
                      <div>
                        <strong className="text-gray-900 dark:text-white">
                          Do you travel outside of Djerba?
                        </strong>
                        <p className="text-gray-600 dark:text-gray-300">
                          Yes, I'm available for shoots across Tunisia. Travel fees may apply for distant locations.
                        </p>
                      </div>
                      <div>
                        <strong className="text-gray-900 dark:text-white">
                          What's included in the photo packages?
                        </strong>
                        <p className="text-gray-600 dark:text-gray-300">
                          All packages include professional editing, high-resolution files, and an online gallery for sharing.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
      )}

      {/* Review Section */}
      {activeTab === 'review' && (
        <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Review Form */}
              <AnimatedSection>
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 transition-colors duration-300">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    Share Your Experience
                  </h2>
                  <ReviewForm onSubmit={handleReviewSubmit} />
                </div>
              </AnimatedSection>

              {/* Recent Reviews */}
              <AnimatedSection delay={200}>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    Recent Reviews
                  </h2>
                  <div className="space-y-6">
                    {reviews.slice(0, 3).map((review, index) => (
                      <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                        <div className="flex items-center mb-4">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          "{review.text}"
                        </p>
                        <div>
                          <div className="text-gray-900 dark:text-white font-semibold">
                            {review.name}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400 text-sm">
                            {review.location}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Contact;