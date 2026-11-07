import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddChange from './pages/AddChange';
import EditChange from './pages/EditChange';
import GenerateNotes from './pages/GenerateNotes';
import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddChange />} />
          <Route path="/edit/:id" element={<EditChange />} />
          <Route path="/generate" element={<GenerateNotes />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

