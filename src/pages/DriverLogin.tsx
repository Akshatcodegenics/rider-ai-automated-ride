
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, Phone, Mail, Lock, User, MapPin, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const DriverLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    licenseNumber: '',
    vehicleType: '',
    vehicleNumber: '',
    city: ''
  });

  const [validation, setValidation] = useState({
    email: { isValid: false, message: '' },
    phone: { isValid: false, message: '' },
    password: { isValid: false, message: '' },
    license: { isValid: false, message: '' }
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

  const validateLicense = (license: string) => {
    const licenseRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,15}$/;
    const isValid = licenseRegex.test(license.toUpperCase()) || license.length >= 10;
    return {
      isValid,
      message: isValid ? 'Valid license format' : 'Please enter a valid driving license number'
    };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Real-time validation
    if (name === 'email') {
      setValidation(prev => ({ ...prev, email: validateEmail(value) }));
    } else if (name === 'phone') {
      setValidation(prev => ({ ...prev, phone: validatePhone(value) }));
    } else if (name === 'password') {
      setValidation(prev => ({ ...prev, password: validatePassword(value) }));
    } else if (name === 'licenseNumber') {
      setValidation(prev => ({ ...prev, license: validateLicense(value) }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const emailValidation = validateEmail(formData.email);
    const phoneValidation = validatePhone(formData.phone);
    const passwordValidation = validatePassword(formData.password);
    const licenseValidation = !isLogin ? validateLicense(formData.licenseNumber) : { isValid: true };

    if (!emailValidation.isValid || !phoneValidation.isValid || !passwordValidation.isValid || !licenseValidation.isValid) {
      alert('Please fix all validation errors before submitting');
      return;
    }

    console.log('Driver form submitted:', formData);
    
    if (isLogin) {
      // Simulate successful login
      localStorage.setItem('driverLoggedIn', 'true');
      localStorage.setItem('driverData', JSON.stringify(formData));
      alert('🎉 Driver logged in successfully! Redirecting to driver panel...');
      navigate('/driver-panel');
    } else {
      alert('🎉 Driver registration submitted for verification! You can now login once approved.');
      setIsLogin(true);
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
                <Car className="h-6 w-6" />
                {isLogin ? '🚗 Driver Login' : '🚕 Become a Driver'}
              </CardTitle>
              <p className="text-blue-100">
                {isLogin ? 'Welcome back, driver! 👋' : 'Join our driver community 🚀'}
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
                      <Label htmlFor="licenseNumber">Driving License Number</Label>
                      <div className="relative">
                        <Input
                          id="licenseNumber"
                          name="licenseNumber"
                          type="text"
                          placeholder="Enter license number (e.g., DL1420110012345)"
                          value={formData.licenseNumber}
                          onChange={handleInputChange}
                          className="pr-10"
                          required
                        />
                        {formData.licenseNumber && (
                          <div className="absolute right-3 top-3">
                            {getValidationIcon(validation.license)}
                          </div>
                        )}
                      </div>
                      {formData.licenseNumber && (
                        <p className={`text-xs ${validation.license.isValid ? 'text-green-600' : 'text-red-600'}`}>
                          {validation.license.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vehicleType">Vehicle Type</Label>
                      <select
                        id="vehicleType"
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select vehicle type</option>
                        <option value="taxi">🚕 Taxi</option>
                        <option value="cab">🚗 Premium Cab</option>
                        <option value="auto">🛺 Auto Rickshaw</option>
                        <option value="bike">🏍️ Bike</option>
                        <option value="suv">🚙 SUV</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                      <Input
                        id="vehicleNumber"
                        name="vehicleNumber"
                        type="text"
                        placeholder="Enter vehicle number (e.g., DL01AB1234)"
                        value={formData.vehicleNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">Operating City</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="city"
                          name="city"
                          type="text"
                          placeholder="Enter your operating city"
                          value={formData.city}
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
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
                >
                  {isLogin ? '🚗 Login to Driver Panel' : '📋 Submit Application'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:underline transition-colors"
                >
                  {isLogin ? 'Want to become a driver? 🚀 Sign up' : 'Already a driver? 🔑 Login'}
                </button>
              </div>

              {!isLogin && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <p className="text-sm text-blue-800">
                    <strong>📋 Verification Process:</strong> All driver applications undergo background checks, license validation, and vehicle inspection for safety.
                  </p>
                </div>
              )}

              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800 text-center">
                  🛡️ Your data is encrypted and secure. We follow strict privacy protocols.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DriverLogin;
