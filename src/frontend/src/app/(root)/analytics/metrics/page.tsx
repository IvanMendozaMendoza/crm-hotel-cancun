"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Target,
  Users,
  FileText,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download,
  Filter,
  Zap,
  Shield,
  Database,
  Building,
  Bed,
  DollarSign,
  Star,
  MapPin,
  TrendingUpIcon,
  Hotel,
  CreditCard,
  Wifi,
  Car,
  UtensilsCrossed
} from "lucide-react";

// Hardcoded hotel metrics data
const hotelMetricsData = {
  kpis: {
    occupancyRate: 87.5,
    averageDailyRate: 245.50,
    revenuePerAvailableRoom: 214.81,
    totalRevenue: 2847000,
    guestSatisfaction: 4.6,
    bookingConversionRate: 23.4,
    repeatGuestRate: 68.5,
    averageLengthOfStay: 3.2
  },
  trends: {
    monthly: [
      { month: "Jan", occupancy: 75, adr: 220, revpar: 165, bookings: 890 },
      { month: "Feb", occupancy: 78, adr: 225, revpar: 175, bookings: 920 },
      { month: "Mar", occupancy: 82, adr: 230, revpar: 188, bookings: 980 },
      { month: "Apr", occupancy: 85, adr: 235, revpar: 199, bookings: 1020 },
      { month: "May", occupancy: 88, adr: 240, revpar: 211, bookings: 1080 },
      { month: "Jun", occupancy: 92, adr: 245, revpar: 225, bookings: 1150 },
      { month: "Jul", occupancy: 95, adr: 250, revpar: 237, bookings: 1220 },
      { month: "Aug", occupancy: 87, adr: 245, revpar: 214, bookings: 1247 }
    ]
  },
  businessMetrics: {
    revenue: {
      roomRevenue: 1980000,
      foodBeverage: 450000,
      spaServices: 180000,
      parking: 75000,
      otherServices: 167000
    },
    costs: {
      laborCosts: 850000,
      utilities: 180000,
      maintenance: 120000,
      marketing: 95000,
      otherExpenses: 150000
    }
  },
  guestMetrics: {
    demographics: {
      businessTravelers: 45,
      leisureTravelers: 35,
      internationalGuests: 20
    },
    preferences: {
      roomType: {
        standard: 40,
        deluxe: 35,
        suite: 25
      },
      amenities: {
        wifi: 98,
        parking: 75,
        restaurant: 82,
        spa: 45,
        pool: 68
      }
    },
    satisfaction: {
      overall: 4.6,
      cleanliness: 4.7,
      service: 4.5,
      location: 4.8,
      value: 4.4
    }
  }
};

const MetricsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  const getTrendColor = (value: number, threshold: number = 0) => {
    return value > threshold ? "text-green-600" : "text-red-600";
  };

  const getTrendIcon = (value: number, threshold: number = 0) => {
    return value > threshold ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />;
  };

  const getMetricColor = (value: number, good: number, excellent: number) => {
    if (value >= excellent) return "text-green-600";
    if (value >= good) return "text-yellow-600";
    return "text-red-600";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-foreground mb-2">Performance Metrics</h1>
                <p className="text-muted-foreground">Comprehensive hotel business metrics and performance indicators</p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Key Performance Indicators */}
          <div className="px-4 lg:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Occupancy Rate</CardTitle>
                  <Bed className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{hotelMetricsData.kpis.occupancyRate}%</div>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +2.3% from last month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Average Daily Rate</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">${hotelMetricsData.kpis.averageDailyRate}</div>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +$12.50 from last month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">RevPAR</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">${hotelMetricsData.kpis.revenuePerAvailableRoom}</div>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +$8.75 from last month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Guest Satisfaction</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{hotelMetricsData.kpis.guestSatisfaction}/5.0</div>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +0.2 from last month
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content Tabs */}
          <div className="px-4 lg:px-6">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="guests">Guests</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Key Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Key Performance Indicators
                      </CardTitle>
                      <CardDescription>
                        Core hotel performance metrics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-foreground">Booking Conversion Rate</span>
                          <Badge variant="outline">
                            {hotelMetricsData.kpis.bookingConversionRate}%
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-foreground">Repeat Guest Rate</span>
                          <Badge variant="outline">
                            {hotelMetricsData.kpis.repeatGuestRate}%
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-foreground">Average Length of Stay</span>
                          <Badge variant="outline">
                            {hotelMetricsData.kpis.averageLengthOfStay} nights
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-foreground">Total Revenue</span>
                          <Badge variant="outline">
                            {formatCurrency(hotelMetricsData.kpis.totalRevenue)}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Guest Demographics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Guest Demographics
                      </CardTitle>
                      <CardDescription>
                        Guest type distribution
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(hotelMetricsData.guestMetrics.demographics).map(([type, percentage], index) => (
                          <div key={type} className="flex items-center justify-between">
                            <span className="text-foreground capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-muted rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    index === 0 ? 'bg-blue-500' : 
                                    index === 1 ? 'bg-green-500' : 'bg-purple-500'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-foreground font-medium text-sm">{percentage}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Revenue Tab */}
              <TabsContent value="revenue" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Revenue Breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Breakdown</CardTitle>
                      <CardDescription>
                        Revenue distribution by service type
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(hotelMetricsData.businessMetrics.revenue).map(([service, amount], index) => (
                          <div key={service} className="flex items-center justify-between">
                            <span className="text-foreground capitalize">{service.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-muted rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    index === 0 ? 'bg-blue-500' : 
                                    index === 1 ? 'bg-green-500' : 
                                    index === 2 ? 'bg-purple-500' : 
                                    index === 3 ? 'bg-orange-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${(amount / hotelMetricsData.businessMetrics.revenue.roomRevenue) * 100}%` }}
                                />
                              </div>
                              <span className="text-foreground font-medium text-sm">{formatCurrency(amount)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Cost Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Cost Analysis</CardTitle>
                      <CardDescription>
                        Operational cost breakdown
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(hotelMetricsData.businessMetrics.costs).map(([cost, amount], index) => (
                          <div key={cost} className="flex items-center justify-between">
                            <span className="text-foreground capitalize">{cost.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-muted rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    index === 0 ? 'bg-red-500' : 
                                    index === 1 ? 'bg-orange-500' : 
                                    index === 2 ? 'bg-yellow-500' : 
                                    index === 3 ? 'bg-purple-500' : 'bg-blue-500'
                                  }`}
                                  style={{ width: `${(amount / hotelMetricsData.businessMetrics.costs.laborCosts) * 100}%` }}
                                />
                              </div>
                              <span className="text-foreground font-medium text-sm">{formatCurrency(amount)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Guests Tab */}
              <TabsContent value="guests" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Room Type Preferences */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Room Type Preferences</CardTitle>
                      <CardDescription>
                        Guest room type selection
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(hotelMetricsData.guestMetrics.preferences.roomType).map(([type, percentage], index) => (
                          <div key={type} className="flex items-center justify-between">
                            <span className="text-foreground capitalize">{type}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-muted rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    index === 0 ? 'bg-blue-500' : 
                                    index === 1 ? 'bg-green-500' : 'bg-purple-500'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-foreground font-medium text-sm">{percentage}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Guest Satisfaction */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Guest Satisfaction</CardTitle>
                      <CardDescription>
                        Satisfaction ratings by category
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(hotelMetricsData.guestMetrics.satisfaction).map(([category, rating], index) => (
                          <div key={category} className="flex items-center justify-between">
                            <span className="text-foreground capitalize">{category}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-muted rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    rating >= 4.5 ? 'bg-green-500' : 
                                    rating >= 4.0 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${(rating / 5) * 100}%` }}
                                />
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-foreground font-medium text-sm">{rating}</span>
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Amenities Usage */}
                <Card>
                  <CardHeader>
                    <CardTitle>Amenities Usage</CardTitle>
                    <CardDescription>
                      Guest amenity utilization rates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {Object.entries(hotelMetricsData.guestMetrics.preferences.amenities).map(([amenity, usage], index) => (
                        <div key={amenity} className="text-center">
                          <div className="flex justify-center mb-2">
                            {amenity === 'wifi' && <Wifi className="h-8 w-8 text-blue-500" />}
                            {amenity === 'parking' && <Car className="h-8 w-8 text-green-500" />}
                            {amenity === 'restaurant' && <UtensilsCrossed className="h-8 w-8 text-orange-500" />}
                            {amenity === 'spa' && <Star className="h-8 w-8 text-purple-500" />}
                            {amenity === 'pool' && <Target className="h-8 w-8 text-cyan-500" />}
                          </div>
                          <p className="text-foreground text-sm capitalize mb-1">{amenity}</p>
                          <p className="text-foreground font-bold">{usage}%</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Trends Tab */}
              <TabsContent value="trends" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Monthly Performance Trends
                    </CardTitle>
                    <CardDescription>
                      Key metrics trends over the last 8 months
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-8 gap-4 h-32 items-end">
                      {hotelMetricsData.trends.monthly.map((month, index) => (
                        <div key={index} className="flex flex-col items-center gap-2">
                          <div className="flex flex-col gap-1 w-full">
                            <div 
                              className="bg-green-500 rounded-t"
                              style={{ height: `${(month.occupancy / 100) * 100}%` }}
                            />
                            <div 
                              className="bg-blue-500"
                              style={{ height: `${(month.adr / 300) * 100}%` }}
                            />
                            <div 
                              className="bg-purple-500"
                              style={{ height: `${(month.revpar / 300) * 100}%` }}
                            />
                            <div 
                              className="bg-orange-500 rounded-b"
                              style={{ height: `${(month.bookings / 1500) * 100}%` }}
                            />
                          </div>
                          <span className="text-muted-foreground text-xs">{month.month}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span className="text-muted-foreground text-sm">Occupancy %</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span className="text-muted-foreground text-sm">ADR</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded"></div>
                        <span className="text-muted-foreground text-sm">RevPAR</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded"></div>
                        <span className="text-muted-foreground text-sm">Bookings</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsPage; 