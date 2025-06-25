import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Shield, Lock, CheckCircle, MapPin, Car } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Payment = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [paymentType, setPaymentType] = useState<'subscription' | 'ride'>('subscription');

  useEffect(() => {
    // Check if there's a pending booking
    const pendingBooking = localStorage.getItem('pendingBooking');
    if (pendingBooking) {
      const booking = JSON.parse(pendingBooking);
      setBookingData(booking);
      setPaymentType('ride');
    }
  }, []);

  const plans = [
    {
      id: 'basic',
      name: '🥉 Basic Plan',
      price: '$9.99',
      period: '/month',
      features: ['💰 10% discount on rides', '📱 Basic app features', '🎯 Standard booking']
    },
    {
      id: 'premium',
      name: '🥈 Premium Plan',
      price: '$19.99',
      period: '/month',
      features: ['💰 25% discount on rides', '🤖 AI automated booking', '👩‍💼 Female driver preference', '⚡ Priority booking']
    },
    {
      id: 'enterprise',
      name: '🥇 Enterprise Plan',
      price: '$39.99',
      period: '/month',
      features: ['💰 40% discount on rides', '🎯 Unlimited rides', '🚗 Premium vehicles only', '📞 24/7 support', '💼 Business features']
    }
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      
      if (paymentType === 'ride') {
        localStorage.removeItem('pendingBooking');
        alert(`🎉 Ride Payment Successful! 
        
✅ Your ride is booked and paid
🚗 Driver will arrive in 5-8 minutes
📱 Track your ride in real-time
💳 Paid: ₹${bookingData?.finalFare?.toFixed(2)}`);
        navigate('/');
      } else {
        alert('🎉 Subscription Payment Successful! \n\n✅ Your subscription is now active\n💳 Card ending in ' + cardNumber.slice(-4) + '\n📅 Next billing: ' + new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString());
      }
    }, 3000);
  };

  const handleCancel = () => {
    localStorage.removeItem('pendingBooking');
    navigate('/book-ride');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Navbar />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              💳 {paymentType === 'ride' ? 'Complete Your Ride Payment' : 'Payment & Subscription'}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {paymentType === 'ride' 
                ? 'Secure payment for your booked ride with advanced safety features'
                : 'Choose your plan and enjoy premium Rider benefits with secure payment processing'
              }
            </p>
          </div>

          {paymentType === 'ride' && bookingData && (
            <div className="mb-8">
              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-6 w-6 text-blue-600" />
                    Ride Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Pickup:</span>
                        <span className="text-gray-700">{bookingData.pickup}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-red-600" />
                        <span className="font-medium">Destination:</span>
                        <span className="text-gray-700">{bookingData.destination}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Vehicle:</span>
                        <Badge variant="secondary">{bookingData.vehicleType.toUpperCase()}</Badge>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Total Fare</div>
                        <div className="text-3xl font-bold text-green-600">₹{bookingData.finalFare?.toFixed(2)}</div>
                      </div>
                      {bookingData.femaleDriverPreference && (
                        <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                          👩‍💼 Female Driver Preferred
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Plan Selection - Only show for subscription payments */}
            {paymentType === 'subscription' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 Choose Your Plan</h2>
                
                {plans.map((plan) => (
                  <Card 
                    key={plan.id}
                    className={`border-2 cursor-pointer transition-all duration-300 hover:shadow-xl ${
                      selectedPlan === plan.id 
                        ? 'border-blue-600 bg-blue-50 shadow-lg' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-blue-600">{plan.price}</span>
                            <span className="text-gray-500">{plan.period}</span>
                          </div>
                        </div>
                        {selectedPlan === plan.id && (
                          <CheckCircle className="h-6 w-6 text-blue-600" />
                        )}
                      </div>
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Payment Form */}
            <Card className="border-0 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <CreditCard className="h-6 w-6" />
                  💳 Secure Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-2 p-4 bg-green-50 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-green-800">🔒 256-bit SSL encryption</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-lg font-semibold">💳 Card Number</Label>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="mt-2 h-12 text-lg"
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-lg font-semibold">📅 Expiry Date</Label>
                      <Input
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="mt-2 h-12 text-lg"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label className="text-lg font-semibold">🔒 CVV</Label>
                      <Input
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="mt-2 h-12 text-lg"
                        maxLength={4}
                        type="password"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-lg font-semibold">👤 Cardholder Name</Label>
                    <Input
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="mt-2 h-12 text-lg"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg text-gray-700">Total Amount:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {paymentType === 'ride' 
                        ? `₹${bookingData?.finalFare?.toFixed(2)}`
                        : `${plans.find(p => p.id === selectedPlan)?.price}/month`
                      }
                    </span>
                  </div>

                  <Button 
                    size="lg"
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg py-6 mb-4"
                    disabled={!cardNumber || !expiryDate || !cvv || !cardName || isProcessing}
                    onClick={handlePayment}
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        💳 Processing Payment...
                      </div>
                    ) : (
                      <>
                        <Lock className="h-5 w-5 mr-2" />
                        {paymentType === 'ride' ? '🚗 Pay for Ride' : '🚀 Subscribe Now'}
                      </>
                    )}
                  </Button>

                  {paymentType === 'ride' && (
                    <Button 
                      variant="outline"
                      size="lg"
                      className="w-full"
                      onClick={handleCancel}
                    >
                      Cancel Booking
                    </Button>
                  )}
                </div>

                <div className="text-center text-sm text-gray-500">
                  🔒 Your payment information is secure and encrypted
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">💡 Why Choose Rider Premium?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <span className="text-4xl mb-4 block">💰</span>
                <h3 className="text-xl font-semibold mb-2">Save Money</h3>
                <p className="text-gray-600">Up to 40% discount on all rides</p>
              </div>
              <div className="text-center">
                <span className="text-4xl mb-4 block">⚡</span>
                <h3 className="text-xl font-semibold mb-2">Priority Access</h3>
                <p className="text-gray-600">Skip the queue with priority booking</p>
              </div>
              <div className="text-center">
                <span className="text-4xl mb-4 block">🤖</span>
                <h3 className="text-xl font-semibold mb-2">AI Features</h3>
                <p className="text-gray-600">Automated booking and smart matching</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Payment;
