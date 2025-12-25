
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomeView from './components/Gallery/HomeView';
import AdminView from './components/Admin/AdminView';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/admin" element={<AdminView />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
