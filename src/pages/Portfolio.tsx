import React, { useState } from 'react';
import { X } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Work' },
    { id: 'tourists', name: 'Tourists' },
    { id: 'landscapes', name: 'Landscapes' },
    { id: 'local-life', name: 'Local Life' },
    { id: 'desert', name: 'Desert Adventures' },
  ];

  const portfolioItems = [
    {
      id: 1,
      category: 'tourists',
      image: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      title: 'Couple Photography in Djerba'
    },
    {
      id: 2,
      category: 'landscapes',
      image: 'https://images.pexels.com/photos/1001435/pexels-photo-1001435.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      title: 'Sahara Desert Sunset'
    },
    {
      id: 3,
      category: 'local-life',
      image: 'https://images.pexels.com/photos/1320714/pexels-photo-1320714.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      title: 'Traditional Tunisian Market'
    },
    {
      id: 4,
      category: 'desert',
      image: 'https://images.pexels.com/photos/1320686/pexels-photo-1320686.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      title: 'Camel Trekking Adventure'
    },
    {
      id: 5,
      category: 'tourists',
      image: 'https://images.pexels.com/photos/1320683/pexels-photo-1320683.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      title: 'Family Beach Session'
    },
    {
      id: 6,
      category: 'landscapes',
      image: 'https://images.pexels.com/photos/1320688/pexels-photo-1320688.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      title: 'Mediterranean Coastline'
    },
    {
      id: 7,
      category: 'local-life',
      image: 'https://images.pexels.com/photos/1320712/pexels-photo-1320712.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      title: 'Artisan at Work'
    },
    {
      id: 8,
      category: 'desert',
      image: 'https://images.pexels.com/photos/1320715/pexels-photo-1320715.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      title: 'Stargazing in the Sahara'
    },
    {
      id: 9,
      category: 'tourists',
      image: 'https://images.pexels.com/photos/1320687/pexels-photo-1320687.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      title: 'Wedding Photography'
    },
    {
      id: 10,
      category: 'landscapes',
      image: 'https://images.pexels.com/photos/1320689/pexels-photo-1320689.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      title: 'Oasis Reflection'
    },
    {
      id: 11,
      category: 'local-life',
      image: 'https://images.pexels.com/photos/1320713/pexels-photo-1320713.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      title: 'Traditional Architecture'
    },
    {
      id: 12,
      category: 'desert',
      image: 'https://images.pexels.com/photos/1320716/pexels-photo-1320716.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      title: 'Dunes at Dawn'
    },
  ];

  const filteredItems = selectedCategory === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-6">Portfolio</h1>
              <p className="text-xl text-orange-100 max-w-2xl mx-auto">
                Explore my photography work capturing the beauty of Tunisia and creating memories for visitors from around the world
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-orange-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-600'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <AnimatedSection key={item.id} delay={index * 100}>
                <div 
                  className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                  onClick={() => setSelectedImage(item.image)}
                >
                  <div className="aspect-w-4 aspect-h-3 h-64">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-200"
            >
              <X className="h-6 w-6 text-white" />
            </button>
            <img
              src={selectedImage}
              alt="Portfolio item"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;