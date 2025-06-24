
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Share2, CreditCard, QrCode, Smartphone, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentSplitterProps {
  totalFare: number;
  onPaymentComplete: (splitDetails: SplitPayment) => void;
}

interface Rider {
  id: string;
  name: string;
  phone?: string;
  amount: number;
  hasPaid: boolean;
}

interface SplitPayment {
  totalAmount: number;
  riders: Rider[];
  splitMethod: 'equal' | 'custom';
  paymentMethod: 'upi' | 'card' | 'wallet' | 'crypto';
}

const PaymentSplitter = ({ totalFare, onPaymentComplete }: PaymentSplitterProps) => {
  const [riders, setRiders] = useState<Rider[]>([
    { id: '1', name: 'You', amount: totalFare, hasPaid: false }
  ]);
  const [splitMethod, setSplitMethod] = useState<'equal' | 'custom'>('equal');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'wallet' | 'crypto'>('upi');
  const [newRiderName, setNewRiderName] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const { toast } = useToast();

  const addRider = () => {
    if (newRiderName.trim()) {
      const newRider: Rider = {
        id: Date.now().toString(),
        name: newRiderName,
        amount: 0,
        hasPaid: false
      };
      setRiders([...riders, newRider]);
      setNewRiderName('');
      recalculateSplit([...riders, newRider]);
    }
  };

  const removeRider = (id: string) => {
    const updated = riders.filter(r => r.id !== id);
    setRiders(updated);
    recalculateSplit(updated);
  };

  const recalculateSplit = (currentRiders: Rider[]) => {
    if (splitMethod === 'equal') {
      const amountPerRider = totalFare / currentRiders.length;
      const updated = currentRiders.map(rider => ({
        ...rider,
        amount: amountPerRider
      }));
      setRiders(updated);
    }
  };

  const updateRiderAmount = (id: string, amount: number) => {
    const updated = riders.map(rider => 
      rider.id === id ? { ...rider, amount } : rider
    );
    setRiders(updated);
  };

  const toggleSplitMethod = () => {
    const newMethod = splitMethod === 'equal' ? 'custom' : 'equal';
    setSplitMethod(newMethod);
    if (newMethod === 'equal') {
      recalculateSplit(riders);
    }
  };

  const generatePaymentLink = (rider: Rider) => {
    const upiId = "merchant@upi"; // Replace with actual UPI ID
    const amount = rider.amount.toFixed(2);
    const note = `Ride split payment - ${rider.name}`;
    
    const upiLink = `upi://pay?pa=${upiId}&am=${amount}&tn=${encodeURIComponent(note)}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Pay your share',
        text: `Hi ${rider.name}, please pay ₹${amount} for our shared ride`,
        url: upiLink
      });
    } else {
      // Copy to clipboard
      navigator.clipboard.writeText(`Pay ₹${amount} via UPI: ${upiLink}`);
      toast({
        title: "Payment link copied!",
        description: `Share this with ${rider.name}`,
      });
    }
  };

  const markAsPaid = (id: string) => {
    const updated = riders.map(rider => 
      rider.id === id ? { ...rider, hasPaid: true } : rider
    );
    setRiders(updated);
    
    toast({
      title: "Payment confirmed! ✅",
      description: "Rider marked as paid",
    });
  };

  const processPayment = () => {
    const splitDetails: SplitPayment = {
      totalAmount: totalFare,
      riders,
      splitMethod,
      paymentMethod
    };
    
    onPaymentComplete(splitDetails);
    
    toast({
      title: "Payment initiated! 💳",
      description: `Processing ${paymentMethod.toUpperCase()} payment for ₹${totalFare}`,
    });
  };

  const totalSplit = riders.reduce((sum, rider) => sum + rider.amount, 0);
  const splitDifference = Math.abs(totalSplit - totalFare);
  const paidRiders = riders.filter(r => r.hasPaid).length;
  
  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'upi': return '📱';
      case 'card': return '💳';
      case 'wallet': return '👛';
      case 'crypto': return '₿';
      default: return '💰';
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-green-600" />
          Split Payment - ₹{totalFare.toFixed(2)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add rider */}
        <div className="flex gap-2">
          <Input
            placeholder="Add rider name"
            value={newRiderName}
            onChange={(e) => setNewRiderName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addRider()}
          />
          <Button onClick={addRider} size="sm">
            Add
          </Button>
        </div>

        {/* Split method toggle */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={splitMethod === 'equal' ? 'default' : 'outline'}
            onClick={toggleSplitMethod}
          >
            Equal Split
          </Button>
          <Button
            size="sm"
            variant={splitMethod === 'custom' ? 'default' : 'outline'}
            onClick={toggleSplitMethod}
          >
            Custom Split
          </Button>
        </div>

        {/* Riders list */}
        <div className="space-y-2">
          {riders.map(rider => (
            <div key={rider.id} className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-sm">{rider.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  {splitMethod === 'custom' ? (
                    <Input
                      type="number"
                      value={rider.amount}
                      onChange={(e) => updateRiderAmount(rider.id, parseFloat(e.target.value) || 0)}
                      className="w-20 h-6 text-xs"
                      step="0.01"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-green-600">
                      ₹{rider.amount.toFixed(2)}
                    </span>
                  )}
                  
                  {rider.hasPaid ? (
                    <Badge variant="default" className="text-xs bg-green-600">
                      Paid ✓
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      Pending
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex gap-1">
                {!rider.hasPaid && rider.name !== 'You' && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => generatePaymentLink(rider)}
                      title="Share payment link"
                    >
                      <Share2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markAsPaid(rider.id)}
                      title="Mark as paid"
                    >
                      ✓
                    </Button>
                  </>
                )}
                
                {rider.name !== 'You' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeRider(rider.id)}
                    className="text-red-600"
                  >
                    ×
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Split validation */}
        {splitDifference > 0.01 && (
          <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
            ⚠️ Split total (₹{totalSplit.toFixed(2)}) doesn't match fare (₹{totalFare.toFixed(2)})
          </div>
        )}

        {/* Payment status */}
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            {paidRiders} of {riders.length} riders have paid
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{ width: `${(paidRiders / riders.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Payment method selection */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Payment Method</h4>
          <div className="grid grid-cols-4 gap-2">
            {(['upi', 'card', 'wallet', 'crypto'] as const).map(method => (
              <Button
                key={method}
                size="sm"
                variant={paymentMethod === method ? 'default' : 'outline'}
                onClick={() => setPaymentMethod(method)}
                className="flex flex-col gap-1 h-auto py-2"
              >
                <span className="text-lg">{getPaymentMethodIcon(method)}</span>
                <span className="text-xs capitalize">{method}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Process payment */}
        <Button
          onClick={processPayment}
          className="w-full"
          disabled={splitDifference > 0.01}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Pay ₹{riders.find(r => r.name === 'You')?.amount.toFixed(2)} via {paymentMethod.toUpperCase()}
        </Button>

        {/* QR Code for group payment */}
        <Button
          variant="outline"
          onClick={() => setShowQRCode(!showQRCode)}
          className="w-full"
        >
          <QrCode className="h-4 w-4 mr-2" />
          Generate Group Payment QR
        </Button>

        {showQRCode && (
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-6xl mb-2">📱</div>
            <p className="text-sm text-gray-600">
              Scan with any UPI app to pay ₹{totalFare.toFixed(2)}
            </p>
            <div className="text-xs text-gray-500 mt-2">
              UPI ID: merchant@upi
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentSplitter;
