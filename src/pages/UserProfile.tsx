
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, MapPin, CreditCard, Star, Phone, Mail, AlertTriangle, History } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const UserProfile = () => {
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    home_address: '',
    emergency_contact: ''
  });

  const [rideHistory] = useState([
    { id: 1, date: '2024-06-20', pickup: 'Connaught Place', destination: 'Airport', fare: 450, driver: 'Rajesh K.', rating: 5 },
    { id: 2, date: '2024-06-18', pickup: 'Home', destination: 'Office', fare: 120, driver: 'Priya S.', rating: 4 },
    { id: 3, date: '2024-06-15', pickup: 'Mall', destination: 'Home', fare: 180, driver: 'Amit G.', rating: 5 }
  ]);

  const [savedPayments] = useState([
    { id: 1, type: 'UPI', details: 'user@paytm', default: true },
    { id: 2, type: 'Card', details: '**** 1234', default: false }
  ]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        home_address: profile.home_address || '',
        emergency_contact: profile.emergency_contact || ''
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      const { error } = await updateProfile(formData);
      if (error) throw error;
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-2">Manage your account and ride preferences</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="rides">Ride History</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="emergency">Emergency</TabsTrigger>
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </span>
                    <Button 
                      variant={isEditing ? "default" : "outline"}
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    >
                      {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <Input
                        value={formData.full_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input value={user?.email || ''} disabled />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone Number</label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Rating</label>
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500 fill-current" />
                        <span className="font-medium">{profile?.rating || 0}</span>
                        <span className="text-sm text-gray-500">({profile?.total_rides || 0} rides)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Home Address</label>
                    <Input
                      value={formData.home_address}
                      onChange={(e) => setFormData(prev => ({ ...prev, home_address: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Enter your home address"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Emergency Contact</label>
                    <Input
                      value={formData.emergency_contact}
                      onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Emergency contact number"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rides">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Ride History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {rideHistory.map((ride) => (
                      <div key={ride.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <p className="font-medium">{ride.pickup} → {ride.destination}</p>
                          <p className="text-sm text-gray-500">{ride.date} • Driver: {ride.driver}</p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < ride.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{ride.fare}</p>
                          <Badge variant="default">Completed</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Saved Payment Methods
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {savedPayments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">{payment.type}</p>
                            <p className="text-sm text-gray-500">{payment.details}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {payment.default && <Badge variant="default">Default</Badge>}
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </div>
                    ))}
                    <Button className="w-full" variant="outline">Add New Payment Method</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="emergency">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Emergency Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="font-medium text-red-900 mb-2">SOS Emergency Button</h3>
                    <p className="text-sm text-red-700 mb-4">
                      In case of emergency, press the SOS button to immediately alert your emergency contacts and local authorities.
                    </p>
                    <Button variant="destructive" className="w-full">
                      🚨 Test SOS Alert
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Emergency Contacts</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4" />
                          <span>{formData.emergency_contact || 'Not set'}</span>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">Add Another Emergency Contact</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wallet">
              <Card>
                <CardHeader>
                  <CardTitle>Rider Wallet</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <h3 className="text-2xl font-bold text-gray-900">₹0.00</h3>
                      <p className="text-gray-600">Available Balance</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Button className="h-12">Add Money</Button>
                      <Button variant="outline" className="h-12">Transaction History</Button>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Recent Transactions</h3>
                      <div className="text-center py-8 text-gray-500">
                        <p>No transactions yet</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
