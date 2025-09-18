
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Bell, Repeat, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScheduledRide {
  id: string;
  pickup: string;
  destination: string;
  date: string;
  time: string;
  isRecurring: boolean;
  recurringDays?: string[];
  reminderMinutes: number;
  vehicleType: string;
  estimatedFare: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
}

interface RideSchedulerProps {
  pickup: string;
  destination: string;
  estimatedFare: number;
  selectedVehicle: string;
}

const RideScheduler = ({ pickup, destination, estimatedFare, selectedVehicle }: RideSchedulerProps) => {
  const [scheduledRides, setScheduledRides] = useState<ScheduledRide[]>([]);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    date: '',
    time: '',
    isRecurring: false,
    recurringDays: [] as string[],
    reminderMinutes: 15
  });
  const { toast } = useToast();

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const scheduleRide = () => {
    if (!pickup || !destination || !scheduleForm.date || !scheduleForm.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newRide: ScheduledRide = {
      id: Date.now().toString(),
      pickup,
      destination,
      date: scheduleForm.date,
      time: scheduleForm.time,
      isRecurring: scheduleForm.isRecurring,
      recurringDays: scheduleForm.recurringDays,
      reminderMinutes: scheduleForm.reminderMinutes,
      vehicleType: selectedVehicle,
      estimatedFare,
      status: 'scheduled'
    };

    const updated = [...scheduledRides, newRide];
    setScheduledRides(updated);
    localStorage.setItem('scheduledRides', JSON.stringify(updated));
    
    // Set reminder
    setRideReminder(newRide);
    
    toast({
      title: "Ride Scheduled! 📅",
      description: `Your ride is scheduled for ${scheduleForm.date} at ${scheduleForm.time}`,
    });

    setIsScheduling(false);
    setScheduleForm({
      date: '',
      time: '',
      isRecurring: false,
      recurringDays: [],
      reminderMinutes: 15
    });
  };

  const setRideReminder = (ride: ScheduledRide) => {
    const rideDateTime = new Date(`${ride.date}T${ride.time}`);
    const reminderTime = new Date(rideDateTime.getTime() - (ride.reminderMinutes * 60 * 1000));
    const now = new Date();

    if (reminderTime > now) {
      const timeUntilReminder = reminderTime.getTime() - now.getTime();
      
      setTimeout(() => {
        if (Notification.permission === 'granted') {
          new Notification(`Ride Reminder - ${ride.reminderMinutes} minutes`, {
            body: `Your ride from ${ride.pickup} to ${ride.destination} is scheduled for ${ride.time}`
          });
        }
        
        toast({
          title: `🚗 Ride Reminder`,
          description: `Your ride is in ${ride.reminderMinutes} minutes!`,
        });
      }, timeUntilReminder);
    }
  };

  const cancelScheduledRide = (id: string) => {
    const updated = scheduledRides.map(ride => 
      ride.id === id ? { ...ride, status: 'cancelled' as const } : ride
    );
    setScheduledRides(updated);
    localStorage.setItem('scheduledRides', JSON.stringify(updated));
    
    toast({
      title: "Ride Cancelled",
      description: "Your scheduled ride has been cancelled",
    });
  };

  const toggleRecurringDay = (day: string) => {
    setScheduleForm(prev => ({
      ...prev,
      recurringDays: prev.recurringDays.includes(day)
        ? prev.recurringDays.filter(d => d !== day)
        : [...prev.recurringDays, day]
    }));
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  React.useEffect(() => {
    requestNotificationPermission();
    const saved = localStorage.getItem('scheduledRides');
    if (saved) {
      setScheduledRides(JSON.parse(saved));
    }
  }, []);

  const upcomingRides = scheduledRides.filter(ride => 
    ride.status === 'scheduled' && new Date(`${ride.date}T${ride.time}`) > new Date()
  );

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Schedule Rides
          </div>
          <Button
            size="sm"
            onClick={() => setIsScheduling(!isScheduling)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isScheduling ? 'Cancel' : 'Schedule'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Schedule form */}
        {isScheduling && (
          <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={scheduleForm.date}
                  onChange={(e) => setScheduleForm(prev => ({ ...prev, date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Time</label>
                <Input
                  type="time"
                  value={scheduleForm.time}
                  onChange={(e) => setScheduleForm(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Reminder (minutes before)</label>
              <Input
                type="number"
                value={scheduleForm.reminderMinutes}
                onChange={(e) => setScheduleForm(prev => ({ ...prev, reminderMinutes: parseInt(e.target.value) || 15 }))}
                min="5"
                max="120"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={scheduleForm.isRecurring}
                  onChange={(e) => setScheduleForm(prev => ({ ...prev, isRecurring: e.target.checked }))}
                />
                <label htmlFor="recurring" className="text-sm font-medium">
                  Recurring ride
                </label>
              </div>
              
              {scheduleForm.isRecurring && (
                <div className="flex gap-1 flex-wrap">
                  {daysOfWeek.map(day => (
                    <Button
                      key={day}
                      size="sm"
                      variant={scheduleForm.recurringDays.includes(day) ? "default" : "outline"}
                      onClick={() => toggleRecurringDay(day)}
                      className="text-xs"
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={scheduleRide} className="flex-1">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Ride
              </Button>
            </div>
          </div>
        )}

        {/* Upcoming rides */}
        {upcomingRides.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Upcoming Rides</h4>
            {upcomingRides.map(ride => (
              <div key={ride.id} className="p-3 border rounded-lg bg-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">{ride.pickup} → {ride.destination}</div>
                  <Badge variant="secondary">
                    ₹{ride.estimatedFare.toFixed(0)}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {ride.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {ride.time}
                  </div>
                  <div className="flex items-center gap-1">
                    <Bell className="h-3 w-3" />
                    {ride.reminderMinutes}m reminder
                  </div>
                  {ride.isRecurring && (
                    <div className="flex items-center gap-1">
                      <Repeat className="h-3 w-3" />
                      Recurring
                    </div>
                  )}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => cancelScheduledRide(ride.id)}
                  className="mt-2 text-red-600 hover:text-red-700"
                >
                  Cancel
                </Button>
              </div>
            ))}
          </div>
        )}

        {upcomingRides.length === 0 && !isScheduling && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No scheduled rides</p>
            <p className="text-xs">Schedule rides for later convenience</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RideScheduler;
