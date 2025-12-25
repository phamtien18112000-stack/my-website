import React from 'react';
import Hero from '../components/Hero';
import StatsBar from '../components/StatsBar';
import CampaignList from '../components/CampaignList';
import Features from '../components/Features';

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <StatsBar />
      <CampaignList />
      <Features />
    </>
  );
};

export default HomePage;