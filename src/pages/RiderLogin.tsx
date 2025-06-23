import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, Mail, Lock, MapPin, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const RiderLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    emergencyContact: '',
    homeAddress: ''
  });

  const [validation, setValidation] = useState({
    email: { isValid: false, message: '' },
    phone: { isValid: false, message: '' },
    password: { isValid: false, message: '' }
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    return {
      isValid,
      message: isValid ? 'Valid email' : 'Please enter a valid email address'
    };
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,15}$/;
    const isValid = phoneRegex.test(phone) && phone.length >= 10;
    return {
      isValid,
      message: isValid ? 'Valid phone number' : 'Please enter a valid phone number (10+ digits)'
    };
  };

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    const isValid = hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isLongEnough;
    
    let message = '';
    if (!isLongEnough) message = 'Password must be at least 8 characters';
    else if (!hasUpperCase) message = 'Password must contain uppercase letter';
    else if (!hasLowerCase) message = 'Password must contain lowercase letter';
    else if (!hasNumbers) message = 'Password must contain a number';
    else if (!hasSpecialChar) message = 'Password must contain special character';
    else message = 'Strong password';

    return { isValid, message };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Real-time validation
    if (name === 'email') {
      setValidation(prev => ({ ...prev, email: validateEmail(value) }));
    } else if (name === 'phone') {
      setValidation(prev => ({ ...prev, phone: validatePhone(value) }));
    } else if (name === 'password') {
      setValidation(prev => ({ ...prev, password: validatePassword(value) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate all fields
    const emailValidation = validateEmail(formData.email);
    const phoneValidation = validatePhone(formData.phone);
    const passwordValidation = validatePassword(formData.password);

    if (!emailValidation.isValid || !phoneValidation.isValid || !passwordValidation.isValid) {
      toast.error('Please fix all validation errors before submitting');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('🎉 Logged in successfully!');
          navigate('/book-ride');
        }
      } else {
        const { error } = await signUp(formData.email, formData.password, {
          full_name: formData.name,
          phone: formData.phone,
          emergency_contact: formData.emergencyContact,
          home_address: formData.homeAddress,
          role: 'rider'
        });
        
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('🎉 Account created successfully! Please check your email for verification.');
          setIsLogin(true);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getValidationIcon = (validation: { isValid: boolean }) => {
    if (validation.isValid) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-2xl animate-fade-in">
            <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <User className="h-6 w-6" />
                {isLogin ? '🚗 Rider Login' : '🎯 Join Rider'}
              </CardTitle>
              <p className="text-blue-100">
                {isLogin ? 'Welcome back! 👋' : 'Create your account 🚀'}
              </p>
            </CardHeader>
            
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 pr-10"
                      required
                    />
                    {formData.email && (
                      <div className="absolute right-3 top-3">
                        {getValidationIcon(validation.email)}
                      </div>
                    )}
                  </div>
                  {formData.email && (
                    <p className={`text-xs ${validation.email.isValid ? 'text-green-600' : 'text-red-600'}`}>
                      {validation.email.message}
                    </p>
                  )}
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pl-10 pr-10"
                        required
                      />
                      {formData.phone && (
                        <div className="absolute right-3 top-3">
                          {getValidationIcon(validation.phone)}
                        </div>
                      )}
                    </div>
                    {formData.phone && (
                      <p className={`text-xs ${validation.phone.isValid ? 'text-green-600' : 'text-red-600'}`}>
                        {validation.phone.message}
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-16"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-8 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    {formData.password && (
                      <div className="absolute right-3 top-3">
                        {getValidationIcon(validation.password)}
                      </div>
                    )}
                  </div>
                  {formData.password && (
                    <p className={`text-xs ${validation.password.isValid ? 'text-green-600' : 'text-red-600'}`}>
                      {validation.password.message}
                    </p>
                  )}
                </div>

                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Emergency Contact</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="emergencyContact"
                          name="emergencyContact"
                          type="tel"
                          placeholder="Emergency contact number"
                          value={formData.emergencyContact}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="homeAddress">Home Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="homeAddress"
                          name="homeAddress"
                          type="text"
                          placeholder="Enter your home address"
                          value={formData.homeAddress}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
                >
                  {loading ? 'Processing...' : (isLogin ? '🚗 Login & Book Ride' : '🎯 Create Account')}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:underline transition-colors"
                >
                  {isLogin ? "Don't have an account? 🚀 Sign up" : 'Already have an account? 🔑 Login'}
                </button>
              </div>

              {!isLogin && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <p className="text-sm text-green-800">
                    <strong>🛡️ Safety First:</strong> Your emergency contact will be notified during rides for your safety.
                  </p>
                </div>
              )}

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800 text-center">
                  🔒 Your data is encrypted and secure. We never share your personal information.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RiderLogin;
