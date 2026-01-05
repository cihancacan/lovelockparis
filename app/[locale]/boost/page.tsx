'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Crown, 
  Trophy, 
  Target, 
  Zap, 
  Eye, 
  TrendingUp,
  CheckCircle,
  XCircle,
  DollarSign,
  Clock,
  BarChart3,
  Users,
  ShieldCheck
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

type BoostPackage = {
  id: 'basic' | 'premium' | 'vip';
  title: string;
  price: number;
  duration: number;
  position: string;
  features: string[];
  color: string;
  badge: string;
};

type UserLock = {
  id: number;
  content_text: string;
  golden_asset_price: number;
  views_count: number;
  status: string;
};

export default function BoostPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState<'basic' | 'premium' | 'vip'>('basic');
  const [userLocks, setUserLocks] = useState<UserLock[]>([]);
  const [selectedLockId, setSelectedLockId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const boostPackages: BoostPackage[] = [
    {
      id: 'basic',
      title: 'Basic Boost',
      price: 19.99,
      duration: 7,
      position: 'Top 50 Rotation',
      features: [
        '7 days featured placement',
        'Top 50 positions (rotating)',
        '+200% average views increase',
        'Basic badge on listing',
        'Email notifications to buyers'
      ],
      color: 'from-blue-500 to-cyan-500',
      badge: 'BOOSTED'
    },
    {
      id: 'premium',
      title: 'Premium Boost',
      price: 49.99,
      duration: 14,
      position: 'Top 10 Fixed',
      features: [
        '14 days premium placement',
        'Fixed position in Top 10',
        '+500% average views increase',
        'Premium crown badge',
        'Priority email notifications',
        'Featured in weekly newsletter',
        'Social media mention'
      ],
      color: 'from-amber-500 to-orange-500',
      badge: 'PREMIUM'
    },
    {
      id: 'vip',
      title: 'VIP Featured',
      price: 99.99,
      duration: 30,
      position: 'Top 3 + Banner',
      features: [
        '30 days VIP placement',
        'Fixed Top 3 position',
        'Special banner on marketplace',
        '+1000% average views increase',
        'VIP trophy badge',
        'Homepage feature (24 hours)',
        'Social media campaign',
        'Email blast to 85K+ collectors',
        'Analytics dashboard access'
      ],
      color: 'from-purple-600 to-pink-600',
      badge: 'VIP FEATURED'
    }
  ];

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
        .select('id, content_text, golden_asset_price, views_count, status')
        .eq('owner_id', user.id)
        .eq('status', 'Active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUserLocks(data || []);
      if (data && data.length > 0) {
        setSelectedLockId(data[0].id);
      }
    } catch (error) {
      console.error('Error loading user locks:', error);
      toast.error('Error loading your locks');
    } finally {
      setLoading(false);
    }
  };

  const handleBoostPurchase = async () => {
    if (!user) {
      toast.error('Please login to boost your lock');
      router.push('/login');
      return;
    }

    if (!selectedLockId) {
      toast.error('Please select a lock to boost');
      return;
    }

    const selectedPackageData = boostPackages.find(p => p.id === selectedPackage);
    if (!selectedPackageData) return;

    // Redirect to checkout
    router.push(`/checkout?type=boost&lock_id=${selectedLockId}&package=${selectedPackage}&price=${selectedPackageData.price}`);
  };

  const calculateProjectedViews = (currentViews: number, packageId: string) => {
    const multipliers = {
      basic: 3, // +200%
      premium: 6, // +500%
      vip: 11 // +1000%
    };
    return currentViews * (multipliers[packageId as keyof typeof multipliers] || 1);
  };

  const calculateProjectedPrice = (currentPrice: number, packageId: string) => {
    const multipliers = {
      basic: 1.5, // +50%
      premium: 2.5, // +150%
      vip: 4 // +300%
    };
    return currentPrice * (multipliers[packageId as keyof typeof multipliers] || 1);
  };

  const selectedLock = userLocks.find(lock => lock.id === selectedLockId);
  const selectedPackageData = boostPackages.find(p => p.id === selectedPackage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full text-sm font-bold uppercase tracking-wider mb-6 shadow-lg">
              <Zap className="h-5 w-5" />
              BOOST YOUR SALES
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Featured</span> in Marketplace
            </h1>
            
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Increase visibility, attract more buyers, and sell your digital lock for higher prices.
              Featured locks sell 5x faster at 3x higher prices.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">5x</div>
                <div className="text-slate-300">Faster Sales</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">3x</div>
                <div className="text-slate-300">Higher Prices</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">85K+</div>
                <div className="text-slate-300">Collectors</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: Package Selection */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Select Boost Package</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {boostPackages.map((pkg) => (
                    <Card 
                      key={pkg.id}
                      className={`cursor-pointer border-2 transition-all hover:scale-105 ${
                        selectedPackage === pkg.id 
                          ? `border-${pkg.id === 'basic' ? 'blue' : pkg.id === 'premium' ? 'amber' : 'purple'}-500 shadow-2xl` 
                          : 'border-slate-200'
                      }`}
                      onClick={() => setSelectedPackage(pkg.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className={`text-lg font-bold text-slate-900 mb-1`}>{pkg.title}</div>
                            <Badge className={`bg-gradient-to-r ${pkg.color} text-white`}>
                              {pkg.id === 'vip' ? <Trophy className="h-3 w-3 mr-1" /> : 
                               pkg.id === 'premium' ? <Crown className="h-3 w-3 mr-1" /> : 
                               <Sparkles className="h-3 w-3 mr-1" />}
                              {pkg.badge}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-slate-900">${pkg.price}</div>
                            <div className="text-sm text-slate-500">one-time</div>
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                            <Target className="h-4 w-4" /> {pkg.position}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Clock className="h-4 w-4" /> {pkg.duration} days
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          {pkg.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-slate-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        <Button 
                          className={`w-full mt-6 bg-gradient-to-r ${pkg.color} hover:opacity-90`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPackage(pkg.id);
                          }}
                        >
                          {selectedPackage === pkg.id ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" /> Selected
                            </>
                          ) : (
                            'Select Package'
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Select Lock */}
              {userLocks.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Select Lock to Boost</h3>
                  <RadioGroup 
                    value={selectedLockId?.toString()} 
                    onValueChange={(value) => setSelectedLockId(parseInt(value))}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {userLocks.map((lock) => (
                      <div key={lock.id}>
                        <RadioGroupItem 
                          value={lock.id.toString()} 
                          id={`lock-${lock.id}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`lock-${lock.id}`}
                          className="flex items-center justify-between p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-blue-300 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center text-lg font-bold text-blue-700">
                              #{lock.id}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">
                                ${lock.golden_asset_price?.toFixed(2) || '29.99'}
                              </div>
                              <div className="text-sm text-slate-500">
                                {lock.views_count || 0} views
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-slate-500">Current</div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {userLocks.length === 0 && (
                <Card className="border-2 border-dashed border-slate-300">
                  <CardContent className="p-8 text-center">
                    <Sparkles className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Locks Available</h3>
                    <p className="text-slate-600 mb-6">
                      You need to own at least one lock to boost it.
                    </p>
                    <Button onClick={() => router.push('/purchase')}>
                      <DollarSign className="h-4 w-4 mr-2" /> Buy Your First Lock
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column: Preview & Projections */}
            <div className="space-y-8">
              {/* Preview Card */}
              <Card className="sticky top-24 border-2 border-slate-200">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Boost Preview</h3>
                  
                  {selectedLock && selectedPackageData ? (
                    <>
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="font-bold text-slate-900">Lock #{selectedLock.id}</div>
                          <Badge className={`bg-gradient-to-r ${selectedPackageData.color} text-white`}>
                            {selectedPackageData.badge}
                          </Badge>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <div className="text-sm text-slate-500 mb-1">Current Views</div>
                            <div className="flex items-center gap-2">
                              <Eye className="h-4 w-4 text-slate-400" />
                              <span className="font-bold">{selectedLock.views_count || 0}</span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-slate-500 mb-1">Projected Views</div>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-emerald-500" />
                              <span className="font-bold text-emerald-600">
                                {calculateProjectedViews(selectedLock.views_count || 0, selectedPackage).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-slate-500 mb-1">Current Price</div>
                            <div className="font-bold text-slate-900">
                              ${selectedLock.golden_asset_price?.toFixed(2) || '29.99'}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-slate-500 mb-1">Projected Sale Price</div>
                            <div className="font-bold text-emerald-600">
                              ${calculateProjectedPrice(selectedLock.golden_asset_price || 29.99, selectedPackage).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-6 border-t border-slate-200">
                        <div className="flex justify-between items-center mb-6">
                          <div>
                            <div className="text-sm text-slate-500">Boost Cost</div>
                            <div className="text-2xl font-bold text-slate-900">
                              ${selectedPackageData.price}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-slate-500">Duration</div>
                            <div className="text-lg font-bold text-slate-900">
                              {selectedPackageData.duration} days
                            </div>
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                          size="lg"
                          onClick={handleBoostPurchase}
                        >
                          <Sparkles className="h-5 w-5 mr-2" />
                          Boost Now ${selectedPackageData.price}
                        </Button>
                        
                        <div className="mt-4 text-center text-sm text-slate-500">
                          <ShieldCheck className="inline h-4 w-4 mr-1" />
                          30-day money-back guarantee
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Sparkles className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-600">Select a lock and package to see preview</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Success Stories */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Success Stories</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-emerald-100 to-emerald-50 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                        #777
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Sold for $12,500</div>
                        <div className="text-sm text-slate-500">VIP Boost • 3x return on boost</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-amber-100 to-amber-50 rounded-full flex items-center justify-center text-amber-600 font-bold">
                        #1313
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Sold for $2,499</div>
                        <div className="text-sm text-slate-500">Premium Boost • 5x return on boost</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-16 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-10">ROI Calculator</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-emerald-600 mb-4">450%</div>
                  <div className="font-bold text-slate-900 mb-2">Average Return</div>
                  <div className="text-sm text-slate-600">On VIP boosts</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-amber-600 mb-4">72h</div>
                  <div className="font-bold text-slate-900 mb-2">Average Sale Time</div>
                  <div className="text-sm text-slate-600">For boosted locks</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-purple-600 mb-4">85%</div>
                  <div className="font-bold text-slate-900 mb-2">Sell-Through Rate</div>
                  <div className="text-sm text-slate-600">Within 30 days</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
