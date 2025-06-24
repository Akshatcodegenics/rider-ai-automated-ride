
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, Edit2, Heart, ThumbsUp } from "lucide-react";

interface Review {
  id: string;
  name: string;
  rating: number;
  review: string;
  date: string;
  verified: boolean;
  likes: number;
  avatar: string;
}

const CustomerReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      name: 'Priya Sharma',
      rating: 5,
      review: 'Amazing service! The AI-powered booking is incredibly smooth and the drivers are always professional. Love the eco-friendly options too!',
      date: '2024-01-15',
      verified: true,
      likes: 24,
      avatar: '👩‍💼'
    },
    {
      id: '2',
      name: 'Rajesh Kumar',
      rating: 5,
      review: 'Best ride booking app I have used. The real-time tracking and safety features give me peace of mind. Highly recommended!',
      date: '2024-01-14',
      verified: true,
      likes: 18,
      avatar: '👨‍💻'
    },
    {
      id: '3',
      name: 'Ananya Patel',
      rating: 4,
      review: 'Great experience overall. The voice booking feature is fantastic, and I love earning loyalty points. Sometimes the wait time is a bit longer during peak hours.',
      date: '2024-01-13',
      verified: true,
      likes: 15,
      avatar: '👩‍🎓'
    },
    {
      id: '4',
      name: 'Vikram Singh',
      rating: 5,
      review: 'Exceptional service! The payment splitting feature made it so easy when traveling with friends. The app is user-friendly and efficient.',
      date: '2024-01-12',
      verified: true,
      likes: 21,
      avatar: '👨‍🔬'
    }
  ]);

  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    review: ''
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editReview, setEditReview] = useState({ rating: 5, review: '' });

  const handleSubmitReview = () => {
    if (!newReview.name || !newReview.review) {
      alert('Please fill in all fields');
      return;
    }

    const review: Review = {
      id: Date.now().toString(),
      name: newReview.name,
      rating: newReview.rating,
      review: newReview.review,
      date: new Date().toISOString().split('T')[0],
      verified: false,
      likes: 0,
      avatar: '👤'
    };

    setReviews([review, ...reviews]);
    setNewReview({ name: '', rating: 5, review: '' });
    alert('Thank you for your review! 🌟');
  };

  const handleEditReview = (id: string) => {
    const review = reviews.find(r => r.id === id);
    if (review) {
      setEditingId(id);
      setEditReview({ rating: review.rating, review: review.review });
    }
  };

  const handleUpdateReview = () => {
    if (!editReview.review) {
      alert('Please enter a review');
      return;
    }

    setReviews(reviews.map(review => 
      review.id === editingId 
        ? { ...review, rating: editReview.rating, review: editReview.review }
        : review
    ));
    
    setEditingId(null);
    setEditReview({ rating: 5, review: '' });
    alert('Review updated successfully! ✅');
  };

  const handleLikeReview = (id: string) => {
    setReviews(reviews.map(review => 
      review.id === id 
        ? { ...review, likes: review.likes + 1 }
        : review
    ));
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          🌟 Customer Reviews & Testimonials
        </h2>
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            {renderStars(Math.round(averageRating))}
            <span className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
          </div>
          <div className="text-gray-600">
            Based on {reviews.length} reviews
          </div>
        </div>
      </div>

      {/* Add Review Form */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Share Your Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              placeholder="Your Name"
              value={newReview.name}
              onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
            />
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Rating:</span>
              {renderStars(newReview.rating, true, (rating) => 
                setNewReview({ ...newReview, rating })
              )}
            </div>
          </div>
          <Textarea
            placeholder="Tell us about your experience with our ride booking service..."
            value={newReview.review}
            onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
            rows={4}
          />
          <Button 
            onClick={handleSubmitReview}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Submit Review ✨
          </Button>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="grid gap-6">
        {reviews.map((review) => (
          <Card key={review.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              {editingId === review.id ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Rating:</span>
                    {renderStars(editReview.rating, true, (rating) => 
                      setEditReview({ ...editReview, rating })
                    )}
                  </div>
                  <Textarea
                    value={editReview.review}
                    onChange={(e) => setEditReview({ ...editReview, review: e.target.value })}
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleUpdateReview} size="sm">
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{review.avatar}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">{review.name}</h4>
                          {review.verified && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                              ✓ Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditReview(review.id)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed">{review.review}</p>
                  
                  <div className="flex items-center justify-between pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLikeReview(review.id)}
                      className="flex items-center gap-2 text-gray-500 hover:text-blue-600"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{review.likes}</span>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <Card className="border-0 shadow-lg text-center p-6">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {reviews.filter(r => r.rating === 5).length}
          </div>
          <div className="text-gray-600">5-Star Reviews</div>
        </Card>
        <Card className="border-0 shadow-lg text-center p-6">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {reviews.filter(r => r.verified).length}
          </div>
          <div className="text-gray-600">Verified Reviews</div>
        </Card>
        <Card className="border-0 shadow-lg text-center p-6">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {reviews.reduce((sum, r) => sum + r.likes, 0)}
          </div>
          <div className="text-gray-600">Total Likes</div>
        </Card>
      </div>
    </div>
  );
};

export default CustomerReviews;
