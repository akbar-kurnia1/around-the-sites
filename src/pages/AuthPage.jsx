import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthScreen from '../components/AuthScreen';
import Toast from '../components/Toast';
import { useAuth } from '../hooks/useAuth';

export default function AuthPage({ toast, showToast, auth }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();

  return (
    <div className="relative">
      <AuthScreen
        isRegistering={isRegistering} setIsRegistering={setIsRegistering}
        email={email} setEmail={setEmail}
        password={password} setPassword={setPassword}
        handleAuthSubmit={(e) => auth.handleAuthSubmit(e, isRegistering, email, password, setAuthError)} 
        authError={authError} setAuthError={setAuthError}
        setShowLogin={() => navigate('/')} 
      />
      <Toast toast={toast} />
    </div>
  );
}
