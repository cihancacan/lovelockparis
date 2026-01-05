'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  BarChart3, 
  Target,
  ShieldCheck,
  Clock,
  Eye,
  Percent,
  Calculator,
  Zap,
  Crown,
  Sparkles
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

type UserLock = {
  id: number;
  zone: string;
  skin: string;
  content_text: string;
  status: string;
  price: number;
  views_count: number;
  created_at: string;
};

export default function SellPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [userLocks, setUserLocks] = useState<UserLock[]>([]);
  const [selectedLockId, setSelectedLockId] = useState<number | null>(null);
  const [salePrice, setSalePrice] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [platformCommission] = useState(0.30); // 30%

  useEffect(() => {
    if (user) {
      loadUserLocks();
    }
  }, [user]);

  const loadUserLocks = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('locks')
        .select('*')
        .eq('owner_id', user.id)
        .eq('status', 'Active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUserLocks(data || []);
      if (data && data.length > 0) {
        setSelectedLockId(data[0].id);
        // Suggérer un prix de vente basé sur le prix d'achat
        const suggestedPrice = data[0].price * 2; // Double du prix d'achat
        setSalePrice(suggestedPrice.toFixed(2));
      }
    } catch (error) {
      console.error('Error loading user locks:', error);
      toast.error('Error loading your locks');
    }
  };

  const selectedLock = userLocks.find(lock => lock.id === selectedLockId);

  const calculateEarnings = () => {
    const price = parseFloat(salePrice) || 0;
    const commission = price * platformCommission;
    const earnings = price - commission;
    return { price, commission, earnings };
  };

  const handleListForSale = async () => {
    if (!user || !selectedLockId) {
      toast.error('Please select a lock');
      return;
    }

    const price = parseFloat(salePrice);
    if (isNaN(price) || price < 29.99) {
      toast.error('Minimum sale price is $29.99');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('locks')
        .update({
          status: 'For_Sale',
          golden_asset_price: price,
          sale_description: description.trim() || null
        })
        .eq('id', selectedLockId)
        .eq('owner_id', user.id);

      if (error) throw error;

      toast.success('Lock listed for sale successfully!');
      
      // Rediriger vers la page boost
      setTimeout(() => {
        router.push(`/boost/${selectedLockId}`);
      }, 1500);

    } catch (error) {
      console.error('Error listing lock:', error);
      toast.error('Error listing lock for sale');
    } finally {
      setLoading(false);
    }
  };

  const getRecommendedPrice = () => {
    if (!selectedLock) return 0;
    
    const basePrice = selectedLock.price || 29.99;
    const recommendations = [
      { label: 'Quick Sale', multiplier: 1.5, color: 'text-blue-600' },
      { label: 'Standard', multiplier: 2.0, color: 'text-emerald-600' },
      { label: 'Premium', multiplier: 3.0, color: 'text-amber-600' },
      { label: 'Collector', multiplier: 5.0, color: 'text-purple-600' }
    ];
    
    return recommendations;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-sm font-bold uppercase tracking-wider mb-6 shadow-lg">
              <DollarSign className="h-5 w-5" />
              SELL YOUR DIGITAL ASSET
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Turn Your Lock into <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Profit</span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              List your digital love lock on our marketplace. Reach 85,000+ collectors worldwide.
              Average sale price: 3x purchase price.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">3x</div>
                <div className="text-slate-300">Average Profit</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">72h</div>
                <div className="text-slate-300">Avg. Sale Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">85K+</div>
                <div className="text-slate-300">Buyers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: Listing Form */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="border-2 border-slate-200">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">List Your Lock for Sale</h2>
                  
                  {/* Step 1: Select Lock */}
                  <div className="mb-8">
                    <Label className="text-lg font-semibold text-slate-900 mb-4 block">
                      1. Select Lock to Sell
                    </Label>
                    {userLocks.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userLocks.map((lock) => (
                          <Card 
                            key={lock.id}
                            className={`cursor-pointer border-2 transition-all ${
                              selectedLockId === lock.id 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                            onClick={() => {
                              setSelectedLockId(lock.id);
                              const suggestedPrice = lock.price * 2;
                              setSalePrice(suggestedPrice.toFixed(2));
                            }}
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-bold text-slate-900">Lock #{lock.id}</div>
                                  <div className="text-sm text-slate-600">{lock.zone} • {lock.skin}</div>
                                </div>
                                <Badge variant="outline">
                                  ${lock.price?.toFixed(2) || '29.99'}
                                </Badge>
                              </div>
                              <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
                                <div className="flex items-center gap-1">
                                  <Eye className="h-4 w-4" /> {lock.views_count || 0} views
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" /> 
                                  {new Date(lock.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card className="border-2 border-dashed border-slate-300">
                        <CardContent className="p-8 text-center">
                          <DollarSign className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                          <h3 className="text-xl font-bold text-slate-900 mb-2">No Locks Available</h3>
                          <p className="text-slate-600 mb-6">
                            You need to own at least one lock to sell it.
                          </p>
                          <Button onClick={() => router.push('/purchase')}>
                            <DollarSign className="h-4 w-4 mr-2" /> Buy Your First Lock
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Step 2: Set Price */}
                  {selectedLock && (
                    <>
                      <div className="mb-8">
                        <Label className="text-lg font-semibold text-slate-900 mb-4 block">
                          2. Set Your Sale Price
                        </Label>
                        
                        <div className="mb-6">
                          <div className="text-sm text-slate-600 mb-2">Purchase Price</div>
                          <div className="text-xl font-bold text-slate-900">
                            ${selectedLock.price?.toFixed(2) || '29.99'}
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <Label htmlFor="sale-price" className="block text-sm font-medium text-slate-700 mb-2">
                            Your Sale Price (USD)
                          </Label>
                          <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                            <Input
                              id="sale-price"
                              type="number"
                              min="29.99"
                              step="0.01"
                              value={salePrice}
                              onChange={(e) => setSalePrice(e.target.value)}
                              className="pl-12 text-lg"
                              placeholder="299.99"
                            />
                          </div>
                          <div className="text-sm text-slate-500 mt-2">
                            Minimum: $29.99 • Recommended: ${(selectedLock.price * 2).toFixed(2)} (2x purchase price)
                          </div>
                        </div>

                        {/* Price Recommendations */}
                        <div>
                          <div className="text-sm font-medium text-slate-700 mb-3">Price Recommendations:</div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {getRecommendedPrice().map((rec) => (
                              <Card 
                                key={rec.label}
                                className="border border-slate-200 hover:border-blue-300 cursor-pointer"
                                onClick={() => {
                                  const price = (selectedLock.price || 29.99) * rec.multiplier;
                                  setSalePrice(price.toFixed(2));
                                }}
                              >
                                <CardContent className="p-3 text-center">
                                  <div className={`text-lg font-bold ${rec.color} mb-1`}>
                                    ${((selectedLock.price || 29.99) * rec.multiplier).toFixed(2)}
                                  </div>
                                  <div className="text-xs text-slate-600">{rec.label}</div>
                                  <div className="text-xs text-slate-500">{rec.multiplier}x</div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Step 3: Description */}
                      <div className="mb-8">
                        <Label className="text-lg font-semibold text-slate-900 mb-4 block">
                          3. Add Description (Optional)
                        </Label>
                        <Textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Tell buyers why this lock is special... (e.g., 'Lucky number 777', 'Perfect anniversary date', 'Rare early edition')"
                          rows={4}
                          className="resize-none"
                        />
                      </div>

                      {/* Earnings Calculator */}
                      <Card className="mb-8 border-2 border-emerald-100">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Calculator className="h-5 w-5 text-emerald-600" />
                            Your Earnings Calculator
                          </h3>
                          
                          {salePrice && !isNaN(parseFloat(salePrice)) && (
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-slate-700">Sale Price</span>
                                <span className="font-bold text-slate-900">${parseFloat(salePrice).toFixed(2)}</span>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <span className="text-slate-700">
                                  Platform Commission (30%)
                                </span>
                                <span className="font-bold text-rose-600">
                                  -${calculateEarnings().commission.toFixed(2)}
                                </span>
                              </div>
                              
                              <div className="pt-4 border-t border-slate-200">
                                <div className="flex justify-between items-center">
                                  <span className="text-lg font-bold text-slate-900">You Earn</span>
                                  <span className="text-2xl font-bold text-emerald-600">
                                    ${calculateEarnings().earnings.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                              
                              {selectedLock.price && (
                                <div className="pt-4 border-t border-slate-200">
                                  <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600">Return on Investment</span>
                                    <span className={`font-bold ${
                                      calculateEarnings().earnings > selectedLock.price 
                                        ? 'text-emerald-600' 
                                        : 'text-amber-600'
                                    }`}>
                                      {((calculateEarnings().earnings / selectedLock.price - 1) * 100).toFixed(1)}%
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Action Buttons */}
                      <div className="space-y-4">
                        <Button 
                          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                          size="lg"
                          onClick={handleListForSale}
                          disabled={loading}
                        >
                          {loading ? 'Listing...' : (
                            <>
                              <DollarSign className="h-5 w-5 mr-2" />
                              List for Sale ${salePrice || '0.00'}
                            </>
                          )}
                        </Button>
                        
                        <div className="text-center text-sm text-slate-500">
                          <ShieldCheck className="inline h-4 w-4 mr-1" />
                          Secure transaction • Funds protected • 24/7 support
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Boost Recommendation */}
              {selectedLock && (
                <Card className="border-2 border-amber-200 bg-amber-50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-xl">
                        <Zap className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Boost Your Sale!</h3>
                        <p className="text-slate-700 mb-4">
                          Boosted locks sell 5x faster and for 30% higher prices. 
                          Get featured at the top of the marketplace.
                        </p>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-amber-600">5x</div>
                            <div className="text-xs text-slate-600">Faster Sale</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-emerald-600">+30%</div>
                            <div className="text-xs text-slate-600">Higher Price</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-600">85K+</div>
                            <div className="text-xs text-slate-600">Views</div>
                          </div>
                        </div>
                        <Button 
                          className="w-full bg-gradient-to-r from-amber-500 to-orange-500"
                          onClick={() => router.push(`/boost/${selectedLockId}`)}
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Boost from $19.99
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column: Tips & Stats */}
            <div className="space-y-8">
              {/* Selling Tips */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">💡 Selling Tips</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900">Price Competitively</div>
                        <div className="text-sm text-slate-600">2-3x purchase price sells fastest</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <BarChart3 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900">Use Meaningful Numbers</div>
                        <div className="text-sm text-slate-600">777, 1313, 2024 sell for premium</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900">Boost for Visibility</div>
                        <div className="text-sm text-slate-600">$19.99 boost returns 5x on average</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Market Stats */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">📈 Market Statistics</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-slate-600">Average Sale Price</div>
                      <div className="text-2xl font-bold text-slate-900">$149.50</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Average Days Listed</div>
                      <div className="text-xl font-bold text-slate-900">4.2 days</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Sell-Through Rate</div>
                      <div className="text-xl font-bold text-emerald-600">92%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Success Story */}
              <Card className="border-2 border-emerald-200">
                <CardContent className="p-6">
                  <Badge className="mb-4 bg-gradient-to-r from-emerald-500 to-emerald-600">
                    <Crown className="h-3 w-3 mr-1" /> SUCCESS STORY
                  </Badge>
                  <div className="text-lg font-bold text-slate-900 mb-2">
                    Lock #777 sold for $12,500
                  </div>
                  <div className="text-sm text-slate-600 mb-4">
                    Purchased for $149 • VIP Boost $99.99 • Sold in 48 hours
                  </div>
                  <div className="text-2xl font-bold text-emerald-600">
                    +8,288% return
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-6">Ready to Turn $29.99 into Thousands?</h2>
            <p className="text-xl text-slate-300 mb-10">
              Join thousands of smart sellers in our exclusive marketplace. 
              Average seller earns $850 per month.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                onClick={() => router.push('/marketplace')}
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                Explore Marketplace
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                onClick={() => router.push('/purchase')}
              >
                <DollarSign className="h-5 w-5 mr-2" />
                Buy to Resell
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
