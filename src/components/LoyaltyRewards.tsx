
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Gift, Star, Leaf, Users, Award, Coins, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Badge_ {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  progress: number;
  maxProgress: number;
  category: 'eco' | 'social' | 'safety' | 'loyalty';
}

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'free_ride' | 'upgrade' | 'cashback';
  value: number;
  available: boolean;
}

interface LoyaltyRewardsProps {
  currentPoints: number;
  onPointsUpdate: (points: number) => void;
}

const LoyaltyRewards = ({ currentPoints, onPointsUpdate }: LoyaltyRewardsProps) => {
  const [userBadges, setUserBadges] = useState<Badge_[]>([]);
  const [availableRewards, setAvailableRewards] = useState<Reward[]>([]);
  const [totalRides, setTotalRides] = useState(0);
  const [ecoRides, setEcoRides] = useState(0);
  const [referrals, setReferrals] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    initializeBadges();
    initializeRewards();
    loadUserStats();
  }, []);

  const initializeBadges = () => {
    const badges: Badge_[] = [
      {
        id: 'first_ride',
        name: 'First Ride',
        description: 'Complete your first ride',
        icon: '🚗',
        earned: totalRides > 0,
        progress: Math.min(totalRides, 1),
        maxProgress: 1,
        category: 'loyalty'
      },
      {
        id: 'frequent_rider',
        name: 'Frequent Rider',
        description: 'Complete 50 rides',
        icon: '🔥',
        earned: totalRides >= 50,
        progress: Math.min(totalRides, 50),
        maxProgress: 50,
        category: 'loyalty'
      },
      {
        id: 'eco_warrior',
        name: 'Eco Warrior',
        description: 'Take 20 eco-friendly rides',
        icon: '🌱',
        earned: ecoRides >= 20,
        progress: Math.min(ecoRides, 20),
        maxProgress: 20,
        category: 'eco'
      },
      {
        id: 'social_butterfly',
        name: 'Social Butterfly',
        description: 'Refer 10 friends',
        icon: '👥',
        earned: referrals >= 10,
        progress: Math.min(referrals, 10),
        maxProgress: 10,
        category: 'social'
      },
      {
        id: 'night_owl',
        name: 'Night Owl',
        description: 'Take 15 rides after 10 PM',
        icon: '🦉',
        earned: false,
        progress: 3,
        maxProgress: 15,
        category: 'loyalty'
      },
      {
        id: 'safety_first',
        name: 'Safety First',
        description: 'Maintain 5-star safety rating for 30 rides',
        icon: '🛡️',
        earned: false,
        progress: 12,
        maxProgress: 30,
        category: 'safety'
      }
    ];
    setUserBadges(badges);
  };

  const initializeRewards = () => {
    const rewards: Reward[] = [
      {
        id: 'discount_10',
        name: '10% Off Next Ride',
        description: 'Get 10% discount on your next booking',
        pointsCost: 100,
        type: 'discount',
        value: 10,
        available: true
      },
      {
        id: 'free_ride_50',
        name: 'Free Ride (₹50)',
        description: 'Free ride credit up to ₹50',
        pointsCost: 500,
        type: 'free_ride',
        value: 50,
        available: true
      },
      {
        id: 'upgrade_suv',
        name: 'Free SUV Upgrade',
        description: 'Upgrade to SUV at no extra cost',
        pointsCost: 200,
        type: 'upgrade',
        value: 0,
        available: true
      },
      {
        id: 'cashback_100',
        name: '₹100 Cashback',
        description: 'Get ₹100 cashback to your wallet',
        pointsCost: 800,
        type: 'cashback',
        value: 100,
        available: true
      },
      {
        id: 'discount_25',
        name: '25% Off Next Ride',
        description: 'Get 25% discount on your next booking',
        pointsCost: 250,
        type: 'discount',
        value: 25,
        available: true
      },
      {
        id: 'free_ride_100',
        name: 'Free Ride (₹100)',
        description: 'Free ride credit up to ₹100',
        pointsCost: 1000,
        type: 'free_ride',
        value: 100,
        available: true
      }
    ];
    setAvailableRewards(rewards);
  };

  const loadUserStats = () => {
    // Load from localStorage or default values
    const stats = JSON.parse(localStorage.getItem('userRideStats') || '{}');
    setTotalRides(stats.totalRides || 5);
    setEcoRides(stats.ecoRides || 2);
    setReferrals(stats.referrals || 1);
  };

  const redeemReward = (reward: Reward) => {
    if (currentPoints >= reward.pointsCost) {
      const newPoints = currentPoints - reward.pointsCost;
      onPointsUpdate(newPoints);
      
      // Save redeemed reward
      const redeemedRewards = JSON.parse(localStorage.getItem('redeemedRewards') || '[]');
      redeemedRewards.push({
        ...reward,
        redeemedAt: new Date().toISOString()
      });
      localStorage.setItem('redeemedRewards', JSON.stringify(redeemedRewards));
      
      toast({
        title: "Reward Redeemed! 🎉",
        description: `You've redeemed: ${reward.name}`,
      });
    } else {
      toast({
        title: "Insufficient Points",
        description: `You need ${reward.pointsCost - currentPoints} more points`,
        variant: "destructive"
      });
    }
  };

  const getRewardIcon = (type: Reward['type']) => {
    switch (type) {
      case 'discount': return '🏷️';
      case 'free_ride': return '🆓';
      case 'upgrade': return '⬆️';
      case 'cashback': return '💰';
      default: return '🎁';
    }
  };

  const getBadgeColor = (category: Badge_['category']) => {
    switch (category) {
      case 'eco': return 'bg-green-100 text-green-800';
      case 'social': return 'bg-blue-100 text-blue-800';
      case 'safety': return 'bg-yellow-100 text-yellow-800';
      case 'loyalty': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const earnedBadges = userBadges.filter(badge => badge.earned);
  const nextLevelPoints = Math.ceil((currentPoints + 1) / 100) * 100;
  const progressToNextLevel = ((currentPoints % 100) / 100) * 100;

  return (
    <div className="space-y-6">
      {/* Points Overview */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">{currentPoints}</h3>
              <p className="text-purple-100">Loyalty Points</p>
            </div>
            <div className="text-4xl">🏆</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to next level</span>
              <span>{progressToNextLevel.toFixed(0)}%</span>
            </div>
            <Progress value={progressToNextLevel} className="bg-purple-300" />
            <p className="text-xs text-purple-100">
              {nextLevelPoints - currentPoints} points to next level
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-600" />
            Achievements ({earnedBadges.length}/{userBadges.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {userBadges.map(badge => (
              <div
                key={badge.id}
                className={`p-3 rounded-lg border-2 transition-all ${
                  badge.earned 
                    ? 'border-yellow-300 bg-yellow-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-2xl ${badge.earned ? '' : 'grayscale opacity-50'}`}>
                    {badge.icon}
                  </span>
                  <div className="flex-1">
                    <h4 className={`text-sm font-medium ${badge.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                      {badge.name}
                    </h4>
                    <Badge variant="secondary" className={`text-xs ${getBadgeColor(badge.category)}`}>
                      {badge.category}
                    </Badge>
                  </div>
                </div>
                
                <p className={`text-xs mb-2 ${badge.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                  {badge.description}
                </p>
                
                {!badge.earned && (
                  <div className="space-y-1">
                    <Progress value={(badge.progress / badge.maxProgress) * 100} className="h-1" />
                    <p className="text-xs text-gray-500">
                      {badge.progress}/{badge.maxProgress}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rewards Store */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-green-600" />
            Rewards Store
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {availableRewards.map(reward => (
              <div
                key={reward.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getRewardIcon(reward.type)}</span>
                  <div>
                    <h4 className="font-medium text-sm">{reward.name}</h4>
                    <p className="text-xs text-gray-600">{reward.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        <Coins className="h-3 w-3 mr-1" />
                        {reward.pointsCost} points
                      </Badge>
                      {reward.value > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          ₹{reward.value} value
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button
                  size="sm"
                  onClick={() => redeemReward(reward)}
                  disabled={currentPoints < reward.pointsCost}
                  className={currentPoints >= reward.pointsCost ? '' : 'opacity-50'}
                >
                  Redeem
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Earn More Points */}
      <Card className="border-0 shadow-lg border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Target className="h-5 w-5" />
            Earn More Points
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-xl">🚗</span>
              <span className="text-sm font-medium">Complete a ride</span>
            </div>
            <Badge variant="secondary">+50 points</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌱</span>
              <span className="text-sm font-medium">Choose eco-friendly option</span>
            </div>
            <Badge variant="secondary">+25 points</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-xl">👥</span>
              <span className="text-sm font-medium">Refer a friend</span>
            </div>
            <Badge variant="secondary">+100 points</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-xl">⭐</span>
              <span className="text-sm font-medium">Rate your ride 5 stars</span>
            </div>
            <Badge variant="secondary">+10 points</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoyaltyRewards;
