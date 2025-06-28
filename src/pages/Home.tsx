import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Camera, MapPin, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import ReviewList from '../components/ReviewList';

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    'assets/images/bg/bg5.jpeg',
    'assets/images/bg/bg1.jpg',
    'assets/images/bg/bg3.jpg',
    'assets/images/bg/bg4.jpeg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const nextImage = () => {
    setCurrentImageIndex(currentImageIndex === heroImages.length - 1 ? 0 : currentImageIndex + 1);
  };

  const prevImage = () => {
    setCurrentImageIndex(currentImageIndex === 0 ? heroImages.length - 1 : currentImageIndex - 1);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section with Slideshow */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url('${image}')` }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        ))}

        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200 backdrop-blur-sm"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200 backdrop-blur-sm"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentImageIndex ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="flex items-center justify-center mb-6">
              <MapPin className="h-6 w-6 text-orange-400 mr-2" />
              <span className="text-orange-400 font-medium">Djerba, Tunisia</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Capturing
              <span className="text-orange-400 block">Tunisia's Beauty</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
              Freelance photographer & creative based in Djerba, Tunisia.<br />
              Specializing in tourist photography, landscapes, and digital content creation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/portfolio"
                className="inline-flex items-center px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                View My Work
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg backdrop-blur-sm transition-all duration-300 border border-white/20 hover:border-white/30"
              >
                Book a Session
                <Camera className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Work Preview */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Featured Work
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                A glimpse into the diverse photography services I offer across Djerba and Tunisia
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[{
              title: "Tourist Photography",
              image: "/assets/images/tourists/1.jpg",
              delay: 0
            }, {
              title: "Horse & Camel Riding",
              image: "/assets/images/bg/bg4.jpeg",
              delay: 200
            }, {
              title: "Luxury Villas",
              image: "/assets/images/villas/5.JPG",
              delay: 400
            }, {
              title: "Nature",
              image: "/assets/images/bg/bg3.jpg",
              delay: 600
            }].map((item, index) => (
              <AnimatedSection key={index} delay={item.delay}>
                <div className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="aspect-w-4 aspect-h-3 h-64">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-white font-semibold text-lg">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={800}>
            <div className="text-center mt-12">
              <Link
                to="/portfolio"
                className="inline-flex items-center px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                View Full Portfolio
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                My Services
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Professional photography and creative services tailored to your needs
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{
              title: "Tourist Photo Shoots",
              description: "Capture your vacation memories with professional photography sessions",
              delay: 0
            }, {
              title: "Promotional Videos",
              description: "High-quality video content for hotels, restaurants, and travel agencies",
              delay: 200
            }, {
              title: "Social Media Content",
              description: "Engaging visual content for your social media platforms",
              delay: 400
            }].map((service, index) => (
              <AnimatedSection key={index} delay={service.delay}>
                <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {service.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={600}>
            <div className="text-center mt-12">
              <Link
                to="/services"
                className="inline-flex items-center px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                View All Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Dynamic Reviews */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                What Clients Say
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Trusted by tourists and businesses across Tunisia
              </p>
            </div>
          </AnimatedSection>

          <ReviewList />

          <AnimatedSection delay={600}>
            <div className="text-center mt-12">
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Leave a Review
                <Star className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Home;