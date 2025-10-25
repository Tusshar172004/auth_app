import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import AuthPage from './pages/Auth';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/" element={
        <PrivateRoute>
          <div className="p-4">
            <h1 className="text-2xl font-bold">Welcome to Dashboard</h1>
          
          </div>
        </PrivateRoute>
      } />
    </Routes>
  );
}

export default App;
