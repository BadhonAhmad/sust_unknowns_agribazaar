import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaSearch, FaHeart, FaShoppingCart, FaUser } from 'react-icons/fa';
import axios from 'axios';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import ScrollAnimationWrapper from '@/components/Layout/ScrollAnimationWrapper';
import Head from 'next/head'; // Import the Head component
import { useChat } from '@/hooks/useChat';

// Define the Product interface for type safety
interface Product {
  id: number;
  productname: string;
  description: string;
  image: string;
  rating: number;
  ownername: string;
  price: number;
  category: string;
  quantity:string;
  ownerid:string;
}

export default function BrowseProducts() {
  const router = useRouter();
  const { chat, error, createOrGetChat } = useChat();
  // State to manage search term and selected category for filtering products
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // State to manage the counts for wishlist and cart (replace with actual logic)
  const [wishlistCount, setWishlistCount] = useState<number>(2);
  const [cartCount, setCartCount] = useState<number>(3);

  // State to manage the fetched products and loading state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch the role of the user from localStorage
  //const role = localStorage.getItem('role');

  // useEffect hook to fetch all products when the component mounts
  
  useEffect(() => {

    const fetchOwnerProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/getallproduct');
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerProducts();
  }, []);

  // Redirect to farmer dashboard if the user role is 'farmer'
 /* useEffect(() => {
    if (role === 'farmer') {
      router.push('/farmerdashboard');
    }
  }, [role]);*/

  // Handle the search term change event
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle the category selection change event
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  // Handle viewing the details of a specific product
  const handleViewDetails = (id: number) => {
    router.push(`/product-details?id=${id}`);
  };

  // Filter products based on search term and selected category
 // Filter products based on search term and selected category
const filteredProducts = products.filter((product) => {
  const matchesCategory = selectedCategory
    ? product.category === selectedCategory
    : true;

  // Ensure productname and description are not null or undefined
  const matchesSearchTerm =
    (product.productname && product.productname.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));

  return matchesCategory && matchesSearchTerm;
});


  return (
    <>
      {/* Head component to set the page title and favicon */}
      <Head>
        <title>Products | AgriBazaar</title>
        <link rel="icon" href="/assets/logo.png" />
      </Head>
      <div className="bg-sky-100 min-h-screen flex flex-col">
        <Header />
        <ScrollAnimationWrapper>
          {/* Search bar section */}
          <div className="max-w-7xl mx-auto mt-24 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              {/* Agribazaar Logo */}
              <div className="flex items-center">
                <img
                  src="/assets/logo.png"
                  alt="Agribazaar Logo"
                  width={80}
                  height={80}
                />
              </div>

              {/* Search bar */}
              <div className="flex-grow flex items-center bg-white rounded-full shadow-lg overflow-hidden max-w-2xl mx-auto">
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="px-4 py-2 border-r bg-gray-100 text-gray-700 rounded-l-full"
                  aria-label="Select category"
                >
                  <option value="">All Categories</option>
                  {/* Other options */}
                </select>
                <input
                  type="text"
                  placeholder="Search for Products..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full px-4 py-2 border-none focus:outline-none rounded-r-full"
                  aria-label="Search for products"
                />
                <button
                  className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors duration-300"
                  onClick={() => console.log('Searching...')}
                  aria-label="Search"
                >
                  <FaSearch />
                </button>
              </div>
            </div>
          </div>
        </ScrollAnimationWrapper>

        {/* Main content section */}
        <ScrollAnimationWrapper>
          <main className="flex-grow max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden relative group hover:shadow-xl transition-shadow duration-300"
                >
                  <img
                    src={product.image}
                    alt={product.productname}
                    className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {product.productname}
                    </h2>
                    <p className="text-gray-600 mt-2 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-gray-800 font-bold mt-2">
                      ${product.price}
                    </p>
                    <div className="flex items-center mt-2">
                      <p className="text-yellow-500 mr-2">
                        {product.rating} ⭐
                      </p>
                      <span className="text-sm text-gray-500">
                        ({product.rating})
                      </span>
                    </div>
                  </div>
                  {/* Overlay with action buttons on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition-colors duration-300"
                      onClick={async () => {
                        // Add to cart functionality
                        try {
                          const response = await axios.post('/api/cart', {
                            id: product.id,
                            image: product.image,
                            productname: product.productname,
                            price: product.price,
                            description: product.description,
                            category: product.category,
                            quantity: product.quantity,
                            email: localStorage.getItem('email')
                          });
                          console.log('Product added to cart:', response.data);
                          setCartCount((count) => count + 1);
                          alert('Product added to cart!');
                        } catch (err) {
                          console.error('Error adding product to cart:', err);
                        }
                      }}
                    >
                      Add to Cart
                    </button>

                    <button
                      className="bg-white text-green-600 px-3 py-1 rounded-lg text-sm hover:text-green-700 transition-colors duration-300"
                      onClick={() => handleViewDetails(product.id)}
                    >
                      View Details
                    </button>
                    <button className="bg-white text-green-600 px-3 py-1 rounded-lg text-sm hover:text-green-700 transition-colors duration-300"
                        onClick={() => {
                          try {
                           
                        
                            const user1Id = product.ownerid;
                            const user2Id = localStorage.getItem('id');
                            if (user1Id && user2Id) {
                              createOrGetChat(user1Id, user2Id);
                            } else {
                              alert('Please enter both User IDs.');
                            }
                          } catch (error) {
                            console.error('Error creating or getting chat:', error);
                          }
                        }}
                
                    >
                      Contact Farmer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </ScrollAnimationWrapper>
        <Footer />
      </div>
    </>
  );
}
