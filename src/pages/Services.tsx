import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Camera, 
  Video, 
  Edit, 
  Share2, 
  Code, 
  MapPin, 
  Clock, 
  Star,
  ArrowRight,
  Check
} from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

const Services = () => {
  const services = [
    {
      icon: Camera,
      title: 'Tourist Photo Shoots',
      description: 'Professional photography sessions for couples, families, and groups visiting Tunisia',
      price: 'From 80 TND',
      duration: '1-2 hours',
      features: [
        '30-50 edited photos',
        'Multiple locations',
        'Professional lighting',
        'Quick turnaround (48h)',
        'High-resolution files'
      ]
    },
    {
      icon: Video,
      title: 'Promotional Videos',
      description: 'High-quality video content for hotels, restaurants, and travel agencies',
      price: 'From 200 TND',
      duration: '1-3 days',
      features: [
        'Professional videography',
        'Drone footage included',
        'Color grading & editing',
        'Multiple formats',
        'Commercial license'
      ]
    },
    {
      icon: Edit,
      title: 'Photo Editing & Retouching',
      description: 'Professional post-processing to enhance your photos',
      price: 'From 10 TND per photo',
      duration: '24-48 hours',
      features: [
        'Color correction',
        'Exposure adjustment',
        'Background removal',
        'Skin retouching',
        'Artistic effects'
      ]
    },
    {
      icon: Share2,
      title: 'Social Media Content',
      description: 'Engaging visual content tailored for your social media platforms',
      price: 'From 50 TND',
      duration: '1-2 days',
      features: [
        'Instagram-ready content',
        'Story templates',
        'Hashtag research',
        'Content calendar',
        'Multiple formats'
      ]
    },
    {
      icon: Code,
      title: 'Website Development',
      description: 'Custom websites for small businesses in the tourism industry',
      price: 'From 500 TND',
      duration: '1-2 weeks',
      features: [
        'Responsive design',
        'SEO optimization',
        'Content management',
        'Booking integration',
        'Maintenance included'
      ]
    }
  ];

  const packages = [
    {
      name: 'Tourist Essential',
      price: '120 TND',
      description: 'Perfect for couples and small groups',
      features: [
        '2-hour photo session',
        '40 edited photos',
        '2 locations',
        'Online gallery',
        'Mobile optimized'
      ]
    },
    {
      name: 'Business Promo',
      price: '400 TND',
      description: 'Ideal for hotels and restaurants',
      features: [
        'Photo + video package',
        'Drone footage',
        'Social media content',
        'Commercial license',
        'Rush delivery'
      ]
    },
    {
      name: 'Complete Branding',
      price: '800 TND',
      description: 'Full digital presence solution',
      features: [
        'Photography package',
        'Website development',
        'Social media setup',
        'SEO optimization',
        '3 months support'
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-6">Services</h1>
              <p className="text-xl text-teal-100 max-w-3xl mx-auto">
                Professional photography and creative services to help you capture memories and grow your business in Tunisia
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {services.map((service, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center">
                        <service.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {service.description}
                      </p>
                      <div className="flex items-center space-x-6 mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-teal-600">
                            {service.price}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">{service.duration}</span>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center space-x-2">
                            <Check className="h-4 w-4 text-teal-600" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Popular Packages
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Choose from our carefully crafted packages or customize your own
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <AnimatedSection key={index} delay={index * 200}>
                <div className={`bg-white dark:bg-gray-900 rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  index === 1 ? 'transform scale-105 border-2 border-teal-600' : ''
                }`}>
                  {index === 1 && (
                    <div className="text-center mb-4">
                      <span className="bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {pkg.name}
                    </h3>
                    <div className="text-4xl font-bold text-teal-600 mb-2">
                      {pkg.price}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {pkg.description}
                    </p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <Check className="h-5 w-5 text-teal-600" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/contact"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition-colors duration-300 flex items-center justify-center"
                  >
                    Book Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Availability */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Based in Djerba, Covering All Tunisia
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  While I'm based in beautiful Djerba, I'm available for shoots across Tunisia. 
                  Whether you're visiting the Sahara Desert, exploring Tunis, or enjoying the 
                  Mediterranean coast, I'll capture your perfect moments.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-teal-600" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Primary location: Djerba Island
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="h-5 w-5 text-teal-600" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Available for travel across Tunisia
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-teal-600" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Quick response within 24 hours
                    </span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={200}>
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                  alt="Djerba Photography"
                  className="rounded-lg shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-lg"></div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Book Your Session?
            </h2>
            <p className="text-xl text-teal-100 mb-8">
              Let's create something beautiful together. Contact me to discuss your project 
              and get a personalized quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-4 bg-white text-teal-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                Get in Touch
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="https://wa.me/21612345678"
                className="inline-flex items-center px-8 py-4 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-800 transition-colors duration-300"
              >
                WhatsApp
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Services;