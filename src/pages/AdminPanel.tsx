
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Car, TrendingUp, Settings, MessageSquare, FileText, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";

const AdminPanel = () => {
  const [stats] = useState({
    totalUsers: 1250,
    totalDrivers: 450,
    activeRides: 45,
    todayRevenue: 125000,
    pendingDrivers: 12
  });

  const [drivers] = useState([
    { id: 1, name: 'Rajesh Kumar', vehicle: 'Maruti Swift', status: 'pending', rating: 4.5 },
    { id: 2, name: 'Priya Sharma', vehicle: 'Honda City', status: 'verified', rating: 4.8 },
    { id: 3, name: 'Amit Singh', vehicle: 'Hyundai i20', status: 'rejected', rating: 3.2 }
  ]);

  const [activeRides] = useState([
    { id: 1, rider: 'Anita Patel', driver: 'Vikram Gupta', pickup: 'Connaught Place', destination: 'Airport', fare: 450 },
    { id: 2, rider: 'Rohit Mehta', driver: 'Sunita Devi', pickup: 'Karol Bagh', destination: 'CP Metro', fare: 120 }
  ]);

  const [tickets] = useState([
    { id: 1, user: 'Deepak Kumar', subject: 'Payment Issue', priority: 'high', status: 'open' },
    { id: 2, user: 'Kavya Reddy', subject: 'Driver Behaviour', priority: 'medium', status: 'resolved' }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your ride-sharing platform</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Drivers</p>
                    <p className="text-2xl font-bold">{stats.totalDrivers}</p>
                  </div>
                  <Car className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Rides</p>
                    <p className="text-2xl font-bold">{stats.activeRides}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Today's Revenue</p>
                    <p className="text-2xl font-bold">₹{stats.todayRevenue.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending Approvals</p>
                    <p className="text-2xl font-bold">{stats.pendingDrivers}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="drivers" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="drivers">Drivers</TabsTrigger>
              <TabsTrigger value="rides">Live Rides</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="promos">Promos</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>

            <TabsContent value="drivers">
              <Card>
                <CardHeader>
                  <CardTitle>Driver Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {drivers.map((driver) => (
                      <div key={driver.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <Car className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{driver.name}</p>
                            <p className="text-sm text-gray-500">{driver.vehicle}</p>
                            <p className="text-sm">⭐ {driver.rating}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={driver.status === 'verified' ? 'default' : driver.status === 'pending' ? 'secondary' : 'destructive'}>
                            {driver.status}
                          </Badge>
                          {driver.status === 'pending' && (
                            <div className="space-x-2">
                              <Button size="sm" variant="outline" className="text-green-600">Approve</Button>
                              <Button size="sm" variant="outline" className="text-red-600">Reject</Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rides">
              <Card>
                <CardHeader>
                  <CardTitle>Live Rides Monitor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeRides.map((ride) => (
                      <div key={ride.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{ride.rider} → {ride.driver}</p>
                          <p className="text-sm text-gray-500">{ride.pickup} → {ride.destination}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{ride.fare}</p>
                          <Badge variant="default">In Progress</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Revenue Chart Placeholder</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Ride Heatmap</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Heatmap Placeholder</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="promos">
              <Card>
                <CardHeader>
                  <CardTitle>Promo Code Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button>Create New Promo Code</Button>
                    <div className="space-y-2">
                      <div className="p-4 border rounded-lg">
                        <p className="font-medium">FIRST50</p>
                        <p className="text-sm text-gray-500">50% off first ride - Used 1250 times</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="support">
              <Card>
                <CardHeader>
                  <CardTitle>Support Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tickets.map((ticket) => (
                      <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{ticket.subject}</p>
                          <p className="text-sm text-gray-500">From: {ticket.user}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={ticket.priority === 'high' ? 'destructive' : 'secondary'}>
                            {ticket.priority}
                          </Badge>
                          <Badge variant={ticket.status === 'open' ? 'secondary' : 'default'}>
                            {ticket.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle>Content Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button className="w-full">Edit FAQs</Button>
                    <Button className="w-full" variant="outline">Update Privacy Policy</Button>
                    <Button className="w-full" variant="outline">Manage Terms of Service</Button>
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

export default AdminPanel;
