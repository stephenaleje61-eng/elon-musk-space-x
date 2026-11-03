/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider } from './firebase/authContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { CompaniesView } from './views/CompaniesView';
import { ProductsView } from './views/ProductsView';
import { TechnologyView } from './views/TechnologyView';
import { InvestmentView } from './views/InvestmentView';
import { CommunityView } from './views/CommunityView';
import { MessagesView } from './views/MessagesView';
import { ProfileView } from './views/ProfileView';
import { AdminView } from './views/AdminView';
import { SearchModal } from './components/SearchModal';
import { FriendRequestModal } from './components/FriendRequestModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ProductItem } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFriendModalOpen, setIsFriendModalOpen] = useState(false);

  // Scroll to top on page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleSelectProduct = (product: ProductItem) => {
    setSelectedProduct(product);
  };

  const handleSelectCompany = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setCurrentView('companies');
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-black text-white font-sans antialiased selection:bg-white selection:text-black flex flex-col">
        
        {/* Navigation */}
        <Navbar
          currentView={currentView}
          setCurrentView={setCurrentView}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenFriendModal={() => setIsFriendModalOpen(true)}
          onSelectCompany={handleSelectCompany}
        />

        {/* Main Content Router */}
        <main className="flex-1 bg-black">
          {currentView === 'home' && (
            <HomeView
              setCurrentView={setCurrentView}
              onSelectProduct={handleSelectProduct}
              onSelectCompany={handleSelectCompany}
              onOpenFriendModal={() => setIsFriendModalOpen(true)}
            />
          )}

          {currentView === 'companies' && (
            <CompaniesView
              selectedCompanyId={selectedCompanyId}
              onSelectProduct={handleSelectProduct}
            />
          )}

          {currentView === 'products' && (
            <ProductsView onSelectProduct={handleSelectProduct} />
          )}

          {currentView === 'technology' && (
            <TechnologyView />
          )}

          {currentView === 'investment' && (
            <InvestmentView />
          )}

          {currentView === 'community' && (
            <CommunityView
              onOpenFriendModal={() => setIsFriendModalOpen(true)}
              onOpenMessages={() => setCurrentView('messages')}
            />
          )}

          {currentView === 'messages' && (
            <MessagesView onOpenFriendModal={() => setIsFriendModalOpen(true)} />
          )}

          {currentView === 'profile' && (
            <ProfileView
              onOpenMessages={() => setCurrentView('messages')}
              onOpenFriendModal={() => setIsFriendModalOpen(true)}
            />
          )}

          {currentView === 'admin' && (
            <AdminView
              onOpenMessagesWithUser={(convId) => {
                setCurrentView('messages');
              }}
            />
          )}
        </main>

        {/* Global Footer */}
        <Footer
          setCurrentView={setCurrentView}
          onSelectCompany={handleSelectCompany}
          onOpenFriendModal={() => setIsFriendModalOpen(true)}
        />

        {/* Global Search Dialog */}
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectProduct={handleSelectProduct}
          onSelectCompany={handleSelectCompany}
          onNavigate={(view) => setCurrentView(view)}
        />

        {/* Friend Request Modal */}
        <FriendRequestModal
          isOpen={isFriendModalOpen}
          onClose={() => setIsFriendModalOpen(false)}
          onOpenMessages={() => setCurrentView('messages')}
        />

        {/* Product Detail Specifications Modal */}
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />

      </div>
    </AuthProvider>
  );
}
