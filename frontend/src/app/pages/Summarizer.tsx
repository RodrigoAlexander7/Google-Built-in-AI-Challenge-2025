import React, { useState } from 'react';
import Navbar from '../components/layout/NavBar';
import Footer from '../components/layout/Footer';
import Sidebar from '../components/layout/Sidebar';

const Sumarizer = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="app">
      <Navbar/>
      <div className="main-container">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={closeSidebar} 
        />

      </div>
      <Footer />
    </div>
  );
};

export default Sumarizer;