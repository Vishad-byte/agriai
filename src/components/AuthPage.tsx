import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Loader2, ArrowRight, Github, Chrome } from 'lucide-react';

interface InputFieldProps {
  id: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  icon: React.ReactNode;
  showPasswordToggle?: boolean;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

interface AuthPageProps {
  onAuthSuccess?: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });

  // Animated background blobs
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Reset form when switching between login/signup
  useEffect(() => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: ''
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [isLogin]);

  const InputField: React.FC<InputFieldProps> = ({ 
    id, 
    type, 
    value, 
    onChange, 
    label, 
    icon, 
    showPasswordToggle = false 
  }) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [inputType, setInputType] = useState<string>(type);

    // Update input type based on password visibility
    useEffect(() => {
      if (type === 'password') {
        if (id === 'password') {
          setInputType(showPassword ? 'text' : 'password');
        } else if (id === 'confirmPassword') {
          setInputType(showConfirmPassword ? 'text' : 'password');
        }
      }
    }, [showPassword, showConfirmPassword, type, id]);

    const handlePasswordToggle = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (id === 'password') {
        setShowPassword(!showPassword);
      } else if (id === 'confirmPassword') {
        setShowConfirmPassword(!showConfirmPassword);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    };

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    return (
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-cyan-400 transition-colors duration-300 z-10 pointer-events-none">
            {icon}
          </div>
          <input
            id={id}
            type={inputType}
            value={value}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoComplete={
              id === 'email' ? 'email' :
              id === 'password' ? 'current-password' :
              id === 'confirmPassword' ? 'new-password' :
              id === 'fullName' ? 'name' : 'off'
            }
            className={`
              w-full bg-gray-900/70 backdrop-blur-sm border border-gray-700/50 rounded-xl
              px-12 py-4 text-white placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50
              transition-all duration-300 group-hover:border-gray-600/70
              ${isFocused || value ? 'pt-6 pb-2' : 'pt-4 pb-4'}
            `}
            placeholder={isFocused || value ? '' : label}
          />
          <label
            htmlFor={id}
            className={`
              absolute left-12 transition-all duration-300 pointer-events-none
              ${isFocused || value 
                ? 'top-2 text-xs text-cyan-400 font-medium' 
                : 'top-1/2 -translate-y-1/2 text-gray-400'
              }
            `}
          >
            {label}
          </label>
          {showPasswordToggle && (
            <button
              type="button"
              onClick={handlePasswordToggle}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors duration-300 z-20"
              tabIndex={-1}
            >
              {(id === 'password' ? showPassword : showConfirmPassword) ? 
                <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Basic validation
    if (!formData.email || !formData.password) {
      alert('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log(isLogin ? 'Login' : 'Signup', {
        email: formData.email,
        password: formData.password,
        ...(isLogin ? {} : { fullName: formData.fullName })
      });
      
      // Call success callback if provided
      onAuthSuccess?.();
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const switchToLogin = () => {
    setIsLogin(true);
  };

  const switchToSignup = () => {
    setIsLogin(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/30 to-blue-600/30 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/20 to-teal-600/20 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${-mousePosition.x * 0.05}px, ${-mousePosition.y * 0.05}px)`
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-full blur-2xl animate-bounce"
          style={{
            transform: `translate(-50%, -50%) translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gray-900/40 backdrop-blur-2xl border border-gray-700/50 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
          {/* Card Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-emerald-500/5 rounded-3xl" />
          <div className="absolute -top-px left-20 right-20 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
          
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-2xl mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-2xl blur-lg opacity-50 animate-pulse" />
                <div className="relative text-white text-2xl font-bold">
                  {isLogin ? '🔐' : '🚀'}
                </div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-200 to-emerald-200 bg-clip-text text-transparent mb-2">
                {isLogin ? 'Welcome Back' : 'Join Us Today'}
              </h1>
              <p className="text-gray-400">
                {isLogin ? 'Sign in to your account to continue' : 'Create your account to get started'}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-gray-800/50 backdrop-blur-sm rounded-2xl p-1 mb-8 relative">
              <div 
                className={`absolute top-1 bottom-1 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl transition-transform duration-300 ease-out ${
                  isLogin ? 'left-1 right-1/2' : 'left-1/2 right-1'
                }`}
              />
              <button
                type="button"
                onClick={switchToLogin}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors duration-300 relative z-10 ${
                  isLogin ? 'text-white' : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={switchToSignup}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors duration-300 relative z-10 ${
                  !isLogin ? 'text-white' : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {!isLogin && (
                <InputField
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange('fullName')}
                  label="Full Name"
                  icon={<User size={20} />}
                />
              )}
              
              <InputField
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                label="Email Address"
                icon={<Mail size={20} />}
              />
              
              <InputField
                id="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange('password')}
                label="Password"
                icon={<Lock size={20} />}
                showPasswordToggle={true}
              />
              
              {!isLogin && (
                <InputField
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  label="Confirm Password"
                  icon={<Lock size={20} />}
                  showPasswordToggle={true}
                />
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold py-4 rounded-xl
                         hover:from-cyan-400 hover:to-emerald-400 transform hover:scale-[1.02] active:scale-[0.98]
                         transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                         shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center justify-center space-x-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Divider
            <div className="flex items-center my-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
              <span className="mx-4 text-gray-400 text-sm">or continue with</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
            </div> */}

            {/* Social Login */}
            {/* <div className="grid grid-cols-2 gap-4 mb-8">
              <button 
                type="button"
                className="flex items-center justify-center space-x-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl py-3 px-4
                           hover:bg-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group"
              >
                <Github className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
                <span className="text-gray-400 group-hover:text-white transition-colors duration-300">GitHub</span>
              </button>
              <button 
                type="button"
                className="flex items-center justify-center space-x-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl py-3 px-4
                           hover:bg-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group"
              >
                <Chrome className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
                <span className="text-gray-400 group-hover:text-white transition-colors duration-300">Google</span>
              </button>
            </div> */}

            {/* Footer Links */}
            <div className="text-center space-y-3">
              {isLogin ? (
                <>
                  <button 
                    type="button"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 text-sm font-medium hover:underline"
                  >
                    Forgot your password?
                  </button>
                  <p className="text-gray-400 text-sm">
                    Don't have an account?{' '}
                    <button 
                      type="button"
                      onClick={switchToSignup}
                      className="text-emerald-400 hover:text-emerald-300 font-medium hover:underline transition-colors duration-300"
                    >
                      Sign up for free
                    </button>
                  </p>
                </>
              ) : (
                <p className="text-gray-400 text-sm">
                  Already have an account?{' '}
                  <button 
                    type="button"
                    onClick={switchToLogin}
                    className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline transition-colors duration-300"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-full blur-sm animate-bounce" 
             style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-sm animate-bounce" 
             style={{ animationDelay: '1s', animationDuration: '2.5s' }} />
      </div>
    </div>
  );
};

export default AuthPage;