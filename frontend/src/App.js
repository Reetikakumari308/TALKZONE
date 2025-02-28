import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/Pages/HomePage';
import ChatPage from './components/Pages/ChatPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
