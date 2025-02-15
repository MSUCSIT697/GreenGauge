import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";

/* function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App; */

export default function App() {
  return (
    <div>
      <Navbar />
      <Dashboard />
    </div>
  );
}