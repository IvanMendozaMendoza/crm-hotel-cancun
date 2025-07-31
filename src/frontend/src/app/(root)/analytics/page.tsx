"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download,
  Filter,
  Building,
  Bed,
  DollarSign,
  Star,
  MapPin
} from "lucide-react";

// Hardcoded hotel analytics data
const hotelAnalyticsData = {
  overview: {
    totalProperties: 156,
    activeBookings: 2847,
    totalRevenue: 2847000,
    avgOccupancyRate: 87.5,
    avgDailyRate: 245.50,
    totalGuests: 12470,
    monthlyGrowth: 12.8,
    customerSatisfaction: 4.6
  },
  recentActivity: [
    {
      id: 1,
      type: "booking_confirmed",
      title: "New booking confirmed",
      description: "Luxury Suite booked for 5 nights",
      time: "2 hours ago",
      status: "success"
    },
    {
      id: 2,
      type: "data_uploaded",
      title: "New data file uploaded",
      description: "March occupancy data processed",
      time: "4 hours ago",
      status: "info"
    },
    {
      id: 3,
      type: "revenue_alert",
      title: "Revenue target exceeded",
      description: "Monthly revenue 15% above target",
      time: "6 hours ago",
      status: "warning"
    },
    {
      id: 4,
      type: "guest_feedback",
      title: "Guest feedback received",
      description: "5-star review from recent guest",
      time: "1 day ago",
      status: "success"
    }
  ],
  propertyStats: {
    byType: [
      { type: "Luxury Hotels", count: 45, percentage: 29 },
      { type: "Boutique Hotels", count: 38, percentage: 24 },
      { type: "Resorts", count: 32, percentage: 21 },
      { type: "Business Hotels", count: 25, percentage: 16 },
      { type: "Budget Hotels", count: 16, percentage: 10 }
    ],
    byLocation: [
      { location: "Urban", count: 67, percentage: 43 },
      { location: "Suburban", count: 45, percentage: 29 },
      { location: "Rural", count: 28, percentage: 18 },
      { location: "Airport", count: 16, percentage: 10 }
    ],
    monthlyPerformance: [
      { month: "Jan", occupancy: 75, revenue: 2100000, guests: 8900 },
      { month: "Feb", occupancy: 78, revenue: 2250000, guests: 9200 },
      { month: "Mar", occupancy: 82, revenue: 2400000, guests: 9800 },
      { month: "Apr", occupancy: 85, revenue: 2550000, guests: 10200 },
      { month: "May", occupancy: 88, revenue: 2700000, guests: 10800 },
      { month: "Jun", occupancy: 92, revenue: 2850000, guests: 11500 },
      { month: "Jul", occupancy: 95, revenue: 3000000, guests: 12200 },
      { month: "Aug", occupancy: 87, revenue: 2847000, guests: 12470 }
    ]
  },
  businessMetrics: {
    revenuePerProperty: 18250,
    avgBookingValue: 1250,
    repeatGuestRate: 68.5,
    topPerformingProperties: [
      { name: "Grand Plaza Hotel", revenue: 450000, occupancy: 94, rating: 4.8 },
      { name: "Seaside Resort", revenue: 420000, occupancy: 92, rating: 4.7 },
      { name: "Business Center Hotel", revenue: 380000, occupancy: 89, rating: 4.6 },
      { name: "Mountain Lodge", revenue: 350000, occupancy: 87, rating: 4.5 },
      { name: "City Boutique Hotel", revenue: 320000, occupancy: 85, rating: 4.4 }
    ]
  },
  operationalMetrics: {
    avgCheckInTime: 3.2,
    avgCheckOutTime: 2.8,
    maintenanceResponseTime: 1.5,
    housekeepingEfficiency: 96.2
  }
};

const AnalyticsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "text-white";
      case "warning": return "text-white";
      case "error": return "text-white";
      case "info": return "text-white";
      default: return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle className="h-4 w-4" />;
      case "warning": return <AlertCircle className="h-4 w-4" />;
      case "error": return <AlertCircle className="h-4 w-4" />;
      case "info": return <Eye className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
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
                <h1 className="text-2xl font-semibold text-white mb-2">Hotel Analytics Overview</h1>
                <p className="text-gray-400">Track your hotel portfolio performance and business insights</p>
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

          {/* Key Metrics Cards */}
          <div className="px-4 lg:px-6 max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-stone-900 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{formatCurrency(hotelAnalyticsData.overview.totalRevenue)}</div>
                  <div className="flex items-center text-xs text-white mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +{hotelAnalyticsData.overview.monthlyGrowth}% from last month
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-stone-900 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Occupancy Rate</CardTitle>
                  <Bed className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{hotelAnalyticsData.overview.avgOccupancyRate}%</div>
                  <div className="flex items-center text-xs text-white mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +2.3% from last month
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-stone-900 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Active Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{hotelAnalyticsData.overview.activeBookings}</div>
                  <div className="flex items-center text-xs text-white mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +156 from last month
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-stone-900 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Avg Daily Rate</CardTitle>
                  <Target className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">${hotelAnalyticsData.overview.avgDailyRate}</div>
                  <div className="flex items-center text-xs text-white mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +$12.50 from last month
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
                <TabsTrigger value="properties" className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-gray-800">Properties</TabsTrigger>
                <TabsTrigger value="revenue" className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-gray-800">Revenue</TabsTrigger>
                <TabsTrigger value="operations" className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-gray-800">Operations</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Property Distribution */}
                  <Card className="bg-stone-900 border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Building className="h-5 w-5" />
                        Property Distribution
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Portfolio breakdown by property type
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {hotelAnalyticsData.propertyStats.byType.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${
                                index === 0 ? "bg-gray-400" : 
                                index === 1 ? "bg-gray-500" : 
                                index === 2 ? "bg-gray-600" : 
                                index === 3 ? "bg-gray-700" : "bg-gray-800"
                              }`} />
                              <span className="text-white">{item.type}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">{item.count}</span>
                              <span className="text-gray-400 text-sm">({item.percentage}%)</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card className="bg-stone-900 border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Activity className="h-5 w-5" />
                        Recent Activity
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Latest updates and business activities
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {hotelAnalyticsData.recentActivity.map((activity) => (
                          <div key={activity.id} className="flex items-start gap-3">
                            <div className={`mt-1 ${getStatusColor(activity.status)}`}>
                              {getStatusIcon(activity.status)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium text-sm">{activity.title}</p>
                              <p className="text-gray-400 text-xs">{activity.description}</p>
                              <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Monthly Performance Chart */}
                <Card className="bg-stone-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <BarChart3 className="h-5 w-5" />
                      Monthly Performance Trends
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Occupancy, revenue, and guest trends over the last 8 months
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-8 gap-4 h-32 items-end">
                      {hotelAnalyticsData.propertyStats.monthlyPerformance.map((month, index) => (
                        <div key={index} className="flex flex-col items-center gap-2">
                          <div className="flex flex-col gap-1 w-full">
                            <div 
                              className="bg-gray-400 rounded-t"
                              style={{ height: `${(month.occupancy / 100) * 100}%` }}
                            />
                            <div 
                              className="bg-gray-500"
                              style={{ height: `${(month.revenue / 3000000) * 100}%` }}
                            />
                            <div 
                              className="bg-gray-600 rounded-b"
                              style={{ height: `${(month.guests / 12500) * 100}%` }}
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
                        <span className="text-gray-400 text-sm">Revenue</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-600 rounded"></div>
                        <span className="text-gray-400 text-sm">Guests</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Properties Tab */}
              <TabsContent value="properties" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Property Types */}
                  <Card className="bg-stone-900 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Properties by Type</CardTitle>
                      <CardDescription className="text-gray-400">
                        Distribution of properties across different categories
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {hotelAnalyticsData.propertyStats.byType.map((type, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-white">{type.type}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-gray-400 h-2 rounded-full"
                                  style={{ width: `${type.percentage}%` }}
                                />
                              </div>
                              <span className="text-white font-medium text-sm">{type.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Location Distribution */}
                  <Card className="bg-stone-900 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Properties by Location</CardTitle>
                      <CardDescription className="text-gray-400">
                        Geographic distribution of properties
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {hotelAnalyticsData.propertyStats.byLocation.map((location, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-white">{location.location}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-gray-500 h-2 rounded-full"
                                  style={{ width: `${location.percentage}%` }}
                                />
                              </div>
                              <span className="text-white font-medium text-sm">{location.count}</span>
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
                  {/* Revenue Metrics */}
                  <Card className="bg-stone-900 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Revenue Metrics</CardTitle>
                      <CardDescription className="text-gray-400">
                        Key revenue performance indicators
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-white">Revenue per Property</span>
                          <Badge variant="outline" className="border-gray-600 text-white">
                            {formatCurrency(hotelAnalyticsData.businessMetrics.revenuePerProperty)}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white">Average Booking Value</span>
                          <Badge variant="outline" className="border-gray-600 text-white">
                            {formatCurrency(hotelAnalyticsData.businessMetrics.avgBookingValue)}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white">Repeat Guest Rate</span>
                          <Badge variant="outline" className="border-gray-600 text-white">
                            {hotelAnalyticsData.businessMetrics.repeatGuestRate}%
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white">Customer Satisfaction</span>
                          <Badge variant="outline" className="border-gray-600 text-white">
                            {hotelAnalyticsData.overview.customerSatisfaction}/5.0
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Performing Properties */}
                  <Card className="bg-stone-900 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Top Performing Properties</CardTitle>
                      <CardDescription className="text-gray-400">
                        Highest revenue generating properties
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {hotelAnalyticsData.businessMetrics.topPerformingProperties.map((property, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div>
                              <p className="text-white font-medium">{property.name}</p>
                              <p className="text-gray-400 text-sm">{property.occupancy}% occupancy</p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="border-gray-600 text-white">
                                {formatCurrency(property.revenue)}
                              </Badge>
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="h-3 w-3 text-gray-400 fill-current" />
                                <span className="text-gray-400 text-xs">{property.rating}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Operations Tab */}
              <TabsContent value="operations" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* System Performance */}
                  <Card className="bg-stone-900 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Operational Efficiency</CardTitle>
                      <CardDescription className="text-gray-400">
                        Key operational performance metrics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white text-sm">Check-in Time (avg)</span>
                            <span className="text-white text-sm">{hotelAnalyticsData.operationalMetrics.avgCheckInTime} min</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gray-400 h-2 rounded-full"
                              style={{ width: `${(hotelAnalyticsData.operationalMetrics.avgCheckInTime / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white text-sm">Check-out Time (avg)</span>
                            <span className="text-white text-sm">{hotelAnalyticsData.operationalMetrics.avgCheckOutTime} min</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gray-500 h-2 rounded-full"
                              style={{ width: `${(hotelAnalyticsData.operationalMetrics.avgCheckOutTime / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white text-sm">Maintenance Response</span>
                            <span className="text-white text-sm">{hotelAnalyticsData.operationalMetrics.maintenanceResponseTime} hours</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gray-600 h-2 rounded-full"
                              style={{ width: `${(hotelAnalyticsData.operationalMetrics.maintenanceResponseTime / 3) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white text-sm">Housekeeping Efficiency</span>
                            <span className="text-white text-sm">{hotelAnalyticsData.operationalMetrics.housekeepingEfficiency}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gray-700 h-2 rounded-full"
                              style={{ width: `${hotelAnalyticsData.operationalMetrics.housekeepingEfficiency}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Guest Satisfaction */}
                  <Card className="bg-stone-900 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Guest Satisfaction</CardTitle>
                      <CardDescription className="text-gray-400">
                        Customer satisfaction and feedback metrics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-white">Overall Rating</span>
                          <Badge variant="outline" className="border-gray-600 text-white">
                            {hotelAnalyticsData.overview.customerSatisfaction}/5.0
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white">5-Star Reviews</span>
                          <span className="text-white font-medium">68%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white">4-Star Reviews</span>
                          <span className="text-white font-medium">24%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white">Response Rate</span>
                          <span className="text-white font-medium">94%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white">Recommendation Rate</span>
                          <span className="text-white font-medium">89%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
