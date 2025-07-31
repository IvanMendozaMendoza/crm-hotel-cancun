"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search,
  Filter,
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  Clock,
  Trash2,
  Archive,
  Settings,
  Mail,
  Calendar,
  Users,
  FileText,
  Download,
  Eye,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Hardcoded notifications data
const notificationsData = {
  stats: {
    total: 156,
    unread: 23,
    today: 8,
    thisWeek: 45
  },
  notifications: [
    {
      id: 1,
      type: "success",
      title: "Report Generated Successfully",
      description: "Monthly hotel performance report has been generated and is ready for download.",
      time: "2 minutes ago",
      read: false,
      category: "reports"
    },
    {
      id: 2,
      type: "warning",
      title: "Low Occupancy Alert",
      description: "Property 'Seaside Resort' has occupancy below 60% for the next week.",
      time: "15 minutes ago",
      read: false,
      category: "alerts"
    },
    {
      id: 3,
      type: "info",
      title: "New Data Upload",
      description: "March occupancy data has been uploaded and processed successfully.",
      time: "1 hour ago",
      read: true,
      category: "data"
    },
    {
      id: 4,
      type: "success",
      title: "Booking Confirmed",
      description: "New booking confirmed for Luxury Suite at Grand Plaza Hotel.",
      time: "2 hours ago",
      read: true,
      category: "bookings"
    },
    {
      id: 5,
      type: "warning",
      title: "Maintenance Required",
      description: "Scheduled maintenance for pool area at Mountain Lodge.",
      time: "3 hours ago",
      read: false,
      category: "maintenance"
    },
    {
      id: 6,
      type: "info",
      title: "System Update",
      description: "Analytics dashboard has been updated with new features.",
      time: "1 day ago",
      read: true,
      category: "system"
    },
    {
      id: 7,
      type: "success",
      title: "Revenue Target Met",
      description: "Monthly revenue target exceeded by 15% across all properties.",
      time: "1 day ago",
      read: true,
      category: "revenue"
    },
    {
      id: 8,
      type: "warning",
      title: "Guest Feedback",
      description: "New guest feedback received for Business Center Hotel.",
      time: "2 days ago",
      read: false,
      category: "feedback"
    }
  ]
};

const NotificationsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [notifications, setNotifications] = useState(notificationsData.notifications);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="h-4 w-4" />;
      case "warning": return <AlertCircle className="h-4 w-4" />;
      case "info": return <Info className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success": return "text-white";
      case "warning": return "text-white";
      case "info": return "text-white";
      default: return "text-gray-400";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "reports": return <FileText className="h-3 w-3" />;
      case "alerts": return <AlertCircle className="h-3 w-3" />;
      case "data": return <Download className="h-3 w-3" />;
      case "bookings": return <Calendar className="h-3 w-3" />;
      case "maintenance": return <Settings className="h-3 w-3" />;
      case "system": return <Eye className="h-3 w-3" />;
      case "revenue": return <ArrowUpRight className="h-3 w-3" />;
      case "feedback": return <Users className="h-3 w-3" />;
      default: return <Bell className="h-3 w-3" />;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "all" || notification.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6 max-w-7xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-white mb-2">Notifications</h1>
                <p className="text-gray-400">Stay updated with important alerts and system notifications</p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="border-gray-700 text-white hover:bg-gray-800">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button size="sm" className="bg-gray-800 text-white hover:bg-gray-700" onClick={markAllAsRead}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark All Read
                </Button>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="px-4 lg:px-6 max-w-7xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 mb-6">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-stone-900 border-gray-700 text-white placeholder:text-gray-400"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto min-w-[120px] border-gray-700 text-white hover:bg-gray-800">
                    <Filter className="h-4 w-4 mr-2" />
                    {selectedFilter === "all" ? "All Types" : selectedFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-stone-900 border-gray-700">
                  <DropdownMenuItem onClick={() => setSelectedFilter("all")} className="text-white hover:bg-gray-800">
                    All Types
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter("reports")} className="text-white hover:bg-gray-800">
                    Reports
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter("alerts")} className="text-white hover:bg-gray-800">
                    Alerts
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter("data")} className="text-white hover:bg-gray-800">
                    Data
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter("bookings")} className="text-white hover:bg-gray-800">
                    Bookings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter("maintenance")} className="text-white hover:bg-gray-800">
                    Maintenance
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter("system")} className="text-white hover:bg-gray-800">
                    System
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter("revenue")} className="text-white hover:bg-gray-800">
                    Revenue
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter("feedback")} className="text-white hover:bg-gray-800">
                    Feedback
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-4 lg:px-6 max-w-7xl mx-auto w-full">
            <Tabs defaultValue="unread" className="space-y-6">
              <TabsList className="bg-stone-900 border-gray-700">
                <TabsTrigger value="unread" className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-gray-800">
                  Unread ({notifications.filter(n => !n.read).length})
                </TabsTrigger>
                <TabsTrigger value="all" className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-gray-800">
                  All ({notifications.length})
                </TabsTrigger>
                <TabsTrigger value="read" className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-gray-800">
                  Read ({notifications.filter(n => n.read).length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="unread" className="space-y-4">
                <Card className="bg-stone-900 border-gray-700">
                  <CardContent className="p-0">
                    {filteredNotifications.filter(n => !n.read).length > 0 ? (
                      <div className="space-y-0">
                        {filteredNotifications.filter(n => !n.read).map((notification) => (
                          <div key={notification.id} className="flex items-start gap-4 p-4 border-b border-gray-700 last:border-b-0 bg-gray-800/30">
                            <div className={`mt-1 ${getNotificationColor(notification.type)}`}>
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex-1">
                                  <h3 className="font-medium text-sm text-white">{notification.title}</h3>
                                  <p className="text-gray-400 text-sm mt-1">{notification.description}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <Badge variant="outline" className="bg-transparent border-stone-500 text-stone-600 text-xs">
                                    <div className="flex items-center gap-1">
                                      {getCategoryIcon(notification.category)}
                                      {notification.category}
                                    </div>
                                  </Badge>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="bg-stone-900 border-gray-700">
                                      <DropdownMenuItem 
                                        className="text-white hover:bg-gray-800"
                                        onClick={() => markAsRead(notification.id)}
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Mark as Read
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="text-white hover:bg-gray-800">
                                        <Archive className="h-4 w-4 mr-2" />
                                        Archive
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        className="text-red-400 hover:bg-gray-800"
                                        onClick={() => deleteNotification(notification.id)}
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {notification.time}
                                </span>
                                <Badge variant="outline" className="bg-blue-500/20 border-blue-500 text-blue-400 text-xs">
                                  New
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Bell className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No unread notifications</h3>
                        <p className="text-gray-400">You're all caught up! Check back later for new updates.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="all" className="space-y-4">
                <Card className="bg-stone-900 border-gray-700">
                  <CardContent className="p-0">
                    {filteredNotifications.length > 0 ? (
                      <div className="space-y-0">
                        {filteredNotifications.map((notification) => (
                          <div key={notification.id} className={`flex items-start gap-4 p-4 border-b border-gray-700 last:border-b-0 ${!notification.read ? 'bg-gray-800/30' : ''}`}>
                            <div className={`mt-1 ${getNotificationColor(notification.type)}`}>
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex-1">
                                  <h3 className={`font-medium text-sm ${notification.read ? 'text-gray-400' : 'text-white'}`}>
                                    {notification.title}
                                  </h3>
                                  <p className="text-gray-400 text-sm mt-1">{notification.description}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <Badge variant="outline" className="bg-transparent border-stone-500 text-stone-600 text-xs">
                                    <div className="flex items-center gap-1">
                                      {getCategoryIcon(notification.category)}
                                      {notification.category}
                                    </div>
                                  </Badge>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="bg-stone-900 border-gray-700">
                                      <DropdownMenuItem 
                                        className="text-white hover:bg-gray-800"
                                        onClick={() => markAsRead(notification.id)}
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Mark as Read
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="text-white hover:bg-gray-800">
                                        <Archive className="h-4 w-4 mr-2" />
                                        Archive
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        className="text-red-400 hover:bg-gray-800"
                                        onClick={() => deleteNotification(notification.id)}
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {notification.time}
                                </span>
                                {!notification.read && (
                                  <Badge variant="outline" className="bg-blue-500/20 border-blue-500 text-blue-400 text-xs">
                                    New
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Bell className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No notifications found</h3>
                        <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="read" className="space-y-4">
                <Card className="bg-stone-900 border-gray-700">
                  <CardContent className="p-0">
                    {filteredNotifications.filter(n => n.read).length > 0 ? (
                      <div className="space-y-0">
                        {filteredNotifications.filter(n => n.read).map((notification) => (
                          <div key={notification.id} className="flex items-start gap-4 p-4 border-b border-gray-700 last:border-b-0">
                            <div className={`mt-1 ${getNotificationColor(notification.type)}`}>
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex-1">
                                  <h3 className="font-medium text-sm text-gray-400">{notification.title}</h3>
                                  <p className="text-gray-400 text-sm mt-1">{notification.description}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <Badge variant="outline" className="bg-transparent border-stone-500 text-stone-600 text-xs">
                                    <div className="flex items-center gap-1">
                                      {getCategoryIcon(notification.category)}
                                      {notification.category}
                                    </div>
                                  </Badge>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="bg-stone-900 border-gray-700">
                                      <DropdownMenuItem className="text-white hover:bg-gray-800">
                                        <Archive className="h-4 w-4 mr-2" />
                                        Archive
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        className="text-red-400 hover:bg-gray-800"
                                        onClick={() => deleteNotification(notification.id)}
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {notification.time}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <CheckCircle className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No read notifications</h3>
                        <p className="text-gray-400">Notifications you've read will appear here.</p>
                      </div>
                    )}
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

export default NotificationsPage;
