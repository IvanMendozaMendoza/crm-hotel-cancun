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
    revpar: 214.81,
    totalRevenue: 2847000,
    guestSatisfaction: 4.6,
    bookingConversionRate: 23.4,
    repeatGuestRate: 68.5,
    avgLengthOfStay: 3.2
  },
  trends: {
    monthly: [
      { month: "Jan", occupancy: 75, adr: 220, revpar: 165, bookings: 890 },
      { month: "Feb", occupancy: 78, adr: 225, revpar: 175, bookings: 920 },
      { month: "Mar", occupancy: 82, adr: 230, revpar: 188, bookings: 980 },
      { month: "Apr", occupancy: 85, adr: 235, revpar: 199, bookings: 1020 },
      { month: "May", occupancy: 88, adr: 240, revpar: 211, bookings: 1080 },
      { month: "Jun", occupancy: 92, adr: 245, revpar: 225, bookings: 1150 }
    ]
  },
  businessMetrics: {
    revenueBreakdown: [
      { category: "Room Revenue", amount: 1980000, percentage: 70 },
      { category: "Food & Beverage", amount: 450000, percentage: 16 },
      { category: "Spa Services", amount: 180000, percentage: 6 },
      { category: "Parking", amount: 75000, percentage: 3 },
      { category: "Other Services", amount: 167000, percentage: 5 }
    ],
    costAnalysis: [
      { category: "Labor Costs", amount: 850000, percentage: 60 },
      { category: "Utilities", amount: 180000, percentage: 13 },
      { category: "Maintenance", amount: 120000, percentage: 8 },
      { category: "Marketing", amount: 95000, percentage: 7 },
      { category: "Other Expenses", amount: 150000, percentage: 12 }
    ]
  },
  guestMetrics: {
    roomPreferences: [
      { type: "Standard", percentage: 40 },
      { type: "Deluxe", percentage: 35 },
      { type: "Suite", percentage: 25 }
    ],
    satisfaction: [
      { category: "Overall", rating: 4.6 },
      { category: "Cleanliness", rating: 4.7 },
      { category: "Service", rating: 4.5 },
      { category: "Location", rating: 4.8 },
      { category: "Value", rating: 4.4 }
    ],
    amenitiesUsage: [
      { name: "WiFi", usage: 98, icon: <Wifi className="h-6 w-6 text-gray-400" /> },
      { name: "Parking", usage: 75, icon: <Car className="h-6 w-6 text-gray-400" /> },
      { name: "Restaurant", usage: 82, icon: <UtensilsCrossed className="h-6 w-6 text-gray-400" /> },
      { name: "Spa", usage: 45, icon: <Star className="h-6 w-6 text-gray-400" /> },
      { name: "Pool", usage: 68, icon: <Target className="h-6 w-6 text-gray-400" /> }
    ]
  }
};

const MetricsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "text-white";
      case "down": return "text-white";
      default: return "text-gray-400";
    }
  };

  const getMetricColor = (value: number, threshold: number) => {
    return value >= threshold ? "text-white" : "text-gray-400";
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
          <div className="px-4 lg:px-6 max-w-7xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-white mb-2">Hotel Performance Metrics</h1>
                <p className="text-gray-400">Comprehensive hotel business metrics and performance indicators</p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="border-gray-700 text-white hover:bg-gray-800">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="border-gray-700 text-white hover:bg-gray-800">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Key Performance Indicators */}
          <div className="px-4 lg:px-6 max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-stone-900 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Occupancy Rate</CardTitle>
                  <Bed className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{hotelMetricsData.kpis.occupancyRate}%</div>
                  <div className="flex items-center text-xs text-white mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +2.3% from last month
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-stone-900 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Average Daily Rate</CardTitle>
                  <DollarSign className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">${hotelMetricsData.kpis.averageDailyRate}</div>
                  <div className="flex items-center text-xs text-white mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +$12.50 from last month
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-stone-900 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">RevPAR</CardTitle>
                  <Target className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">${hotelMetricsData.kpis.revpar}</div>
                  <div className="flex items-center text-xs text-white mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +$8.76 from last month
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-stone-900 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Guest Satisfaction</CardTitle>
                  <Star className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{hotelMetricsData.kpis.guestSatisfaction}/5.0</div>
                  <div className="flex items-center text-xs text-white mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +0.2 from last month
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content Tabs */}
          <div className="px-4 lg:px-6 max-w-7xl mx-auto w-full">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-stone-900 border-gray-700">
                <TabsTrigger value="overview" className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-gray-800">Overview</TabsTrigger>
                <TabsTrigger value="revenue" className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-gray-800">Revenue</TabsTrigger>
                <TabsTrigger value="guests" className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-gray-800">Guests</TabsTrigger>
                <TabsTrigger value="trends" className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-gray-800">Trends</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Key Performance Indicators */}
                  <Card className="bg-stone-900 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Key Performance Indicators</CardTitle>
                      <CardDescription className="text-gray-400">
                        Core hotel performance metrics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-white">Total Revenue</span>
                          <Badge variant="outline" className="border-gray-600 text-white">
                            {formatCurrency(hotelMetricsData.kpis.totalRevenue)}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white">Booking Conversion Rate</span>
                          <Badge variant="outline" className="border-gray-600 text-white">
                            {hotelMetricsData.kpis.bookingConversionRate}%
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white">Repeat Guest Rate</span>
                          <Badge variant="outline" className="border-gray-600 text-white">
                            {hotelMetricsData.kpis.repeatGuestRate}%
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white">Average Length of Stay</span>
                          <Badge variant="outline" className="border-gray-600 text-white">
                            {hotelMetricsData.kpis.avgLengthOfStay} nights
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Guest Demographics */}
                  <Card className="bg-stone-900 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Guest Demographics</CardTitle>
                      <CardDescription className="text-gray-400">
                        Guest profile and preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-white">Business Travelers</span>
                          <span className="text-white font-medium">45%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white">Leisure Travelers</span>
                          <span className="text-white font-medium">38%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white">International Guests</span>
                          <span className="text-white font-medium">17%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white">Average Age</span>
                          <span className="text-white font-medium">42 years</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white">Family Groups</span>
                          <span className="text-white font-medium">23%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Revenue Tab */}
              <TabsContent value="revenue" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Revenue Breakdown */}
                  <Card className="bg-stone-900 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Revenue Breakdown</CardTitle>
                      <CardDescription className="text-gray-400">
                        Revenue by category and source
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {hotelMetricsData.businessMetrics.revenueBreakdown.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-white">{item.category}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-gray-400 h-2 rounded-full"
                                  style={{ width: `${item.percentage}%` }}
                                />
                              </div>
                              <span className="text-white font-medium text-sm">{formatCurrency(item.amount)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Cost Analysis */}
                  <Card className="bg-stone-900 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Cost Analysis</CardTitle>
                      <CardDescription className="text-gray-400">
                        Operational costs and efficiency
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {hotelMetricsData.businessMetrics.costAnalysis.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-white">{item.category}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-gray-500 h-2 rounded-full"
                                  style={{ width: `${item.percentage}%` }}
                                />
                              </div>
                              <span className="text-white font-medium text-sm">{formatCurrency(item.amount)}</span>
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
                  <Card className="bg-stone-900 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Room Type Preferences</CardTitle>
                      <CardDescription className="text-gray-400">
                        Guest room type selection
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {hotelMetricsData.guestMetrics.roomPreferences.map((room, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-white">{room.type}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-gray-400 h-2 rounded-full"
                                  style={{ width: `${room.percentage}%` }}
                                />
                              </div>
                              <span className="text-white font-medium text-sm">{room.percentage}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Guest Satisfaction */}
                  <Card className="bg-stone-900 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Guest Satisfaction</CardTitle>
                      <CardDescription className="text-gray-400">
                        Satisfaction ratings by category
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {hotelMetricsData.guestMetrics.satisfaction.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-white">{item.category}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-gray-500 h-2 rounded-full"
                                  style={{ width: `${(item.rating / 5) * 100}%` }}
                                />
                              </div>
                              <span className="text-white font-medium text-sm">{item.rating}/5</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Amenities Usage */}
                <Card className="bg-stone-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Amenities Usage</CardTitle>
                    <CardDescription className="text-gray-400">
                      Guest amenity utilization rates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                      {hotelMetricsData.guestMetrics.amenitiesUsage.map((amenity, index) => (
                        <div key={index} className="flex flex-col items-center text-center">
                          <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mb-2">
                            {amenity.icon}
                          </div>
                          <span className="text-white text-sm font-medium">{amenity.name}</span>
                          <span className="text-gray-400 text-xs">{amenity.usage}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Trends Tab */}
              <TabsContent value="trends" className="space-y-6">
                <Card className="bg-stone-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Monthly Performance Trends</CardTitle>
                    <CardDescription className="text-gray-400">
                      Key metrics over the last 6 months
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-6 gap-4 h-32 items-end">
                      {hotelMetricsData.trends.monthly.map((month, index) => (
                        <div key={index} className="flex flex-col items-center gap-2">
                          <div className="flex flex-col gap-1 w-full">
                            <div 
                              className="bg-gray-400 rounded-t"
                              style={{ height: `${(month.occupancy / 100) * 100}%` }}
                            />
                            <div 
                              className="bg-gray-500"
                              style={{ height: `${(month.adr / 300) * 100}%` }}
                            />
                            <div 
                              className="bg-gray-600"
                              style={{ height: `${(month.revpar / 250) * 100}%` }}
                            />
                            <div 
                              className="bg-gray-700 rounded-b"
                              style={{ height: `${(month.bookings / 1000) * 100}%` }}
                            />
                          </div>
                          <span className="text-gray-400 text-xs">{month.month}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-400 rounded"></div>
                        <span className="text-gray-400 text-sm">Occupancy %</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-500 rounded"></div>
                        <span className="text-gray-400 text-sm">ADR</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-600 rounded"></div>
                        <span className="text-gray-400 text-sm">RevPAR</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-700 rounded"></div>
                        <span className="text-gray-400 text-sm">Bookings</span>
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