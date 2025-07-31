"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Download, 
  Eye, 
  Share2, 
  MoreVertical,
  Filter,
  Search,
  Calendar,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Building,
  Bed,
  Star,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Hardcoded hotel reports data
const reportsData = {
  reportStats: {
    totalReports: 156,
    totalDownloads: 2847,
    avgReportSize: 2.3,
    thisMonth: 12
  },
  recentReports: [
    {
      id: 1,
      title: "Monthly Hotel Performance Report",
      type: "Performance",
      status: "Generated",
      description: "Comprehensive analysis of hotel occupancy, revenue, and guest satisfaction metrics",
      date: "2024-08-15",
      downloads: 45,
      size: "2.4 MB"
    },
    {
      id: 2,
      title: "Quarterly Revenue Analysis",
      type: "Analytics",
      status: "Technical",
      description: "Detailed revenue breakdown by property type and geographic location",
      date: "2024-08-12",
      downloads: 38,
      size: "3.1 MB"
    },
    {
      id: 3,
      title: "Guest Satisfaction Survey Results",
      type: "Survey",
      status: "Generated",
      description: "Analysis of guest feedback, ratings, and satisfaction trends",
      date: "2024-08-10",
      downloads: 52,
      size: "1.8 MB"
    },
    {
      id: 4,
      title: "Operational Efficiency Report",
      type: "Operations",
      status: "Generated",
      description: "Staff performance, maintenance metrics, and operational costs analysis",
      date: "2024-08-08",
      downloads: 29,
      size: "2.7 MB"
    }
  ],
  reportTemplates: [
    {
      id: 1,
      title: "Weekly Summary",
      frequency: "Weekly",
      description: "Weekly overview of key hotel metrics and performance indicators",
      lastGenerated: "2024-08-10"
    },
    {
      id: 2,
      title: "Monthly Performance",
      frequency: "Monthly",
      description: "Comprehensive monthly analysis of hotel operations and financial performance",
      lastGenerated: "2024-08-01"
    },
    {
      id: 3,
      title: "Quarterly Review",
      frequency: "Quarterly",
      description: "Quarterly business review with strategic insights and recommendations",
      lastGenerated: "2024-07-01"
    },
    {
      id: 4,
      title: "Annual Report",
      frequency: "Annually",
      description: "Complete annual performance review and strategic planning document",
      lastGenerated: "2024-01-01"
    }
  ]
};

const ReportsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Generated": return "bg-transparent border border-stone-500 text-stone-600";
      case "Technical": return "bg-transparent border border-stone-500 text-stone-600";
      case "Pending": return "bg-transparent border border-stone-500 text-stone-600";
      case "Failed": return "bg-transparent border border-stone-500 text-stone-600";
      default: return "bg-transparent border border-stone-500 text-stone-600";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Performance": return "bg-transparent border border-stone-500 text-stone-600";
      case "Analytics": return "bg-transparent border border-stone-500 text-stone-600";
      case "Survey": return "bg-transparent border border-stone-500 text-stone-600";
      case "Operations": return "bg-transparent border border-stone-500 text-stone-600";
      default: return "bg-transparent border border-stone-500 text-stone-600";
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case "Weekly": return "bg-transparent border border-stone-500 text-stone-600";
      case "Monthly": return "bg-transparent border border-stone-500 text-stone-600";
      case "Quarterly": return "bg-transparent border border-stone-500 text-stone-600";
      case "Annually": return "bg-transparent border border-stone-500 text-stone-600";
      default: return "bg-transparent border border-stone-500 text-stone-600";
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6 max-w-7xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-foreground mb-2">Reports</h1>
                <p className="text-muted-foreground">Generate and manage detailed hotel performance reports and analytics</p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </div>

          {/* Report Statistics */}
          <div className="px-4 lg:px-6 max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Reports</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{reportsData.reportStats.totalReports}</div>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +12 this month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Downloads</CardTitle>
                  <Download className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{reportsData.reportStats.totalDownloads}</div>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +12% from last month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg Report Size</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{reportsData.reportStats.avgReportSize} MB</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    Optimized for quick loading
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{reportsData.reportStats.thisMonth}</div>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +3 from last month
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="px-4 lg:px-6 max-w-7xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 mb-6">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto min-w-[120px]">
                    <Filter className="h-4 w-4 mr-2" />
                    {selectedType === "all" ? "All Types" : selectedType}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedType("all")}>
                    All Types
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedType("Performance")}>
                    Performance
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedType("Analytics")}>
                    Analytics
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedType("Survey")}>
                    Survey
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedType("Operations")}>
                    Operations
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-4 lg:px-6 max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
              {/* Recent Reports */}
              <div className="xl:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Reports</CardTitle>
                    <CardDescription>
                      Latest generated reports and analytics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reportsData.recentReports.map((report) => (
                        <div key={report.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                              <h3 className="font-medium text-foreground truncate">{report.title}</h3>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className={getTypeColor(report.type)}>
                                  {report.type}
                                </Badge>
                                <Badge variant="outline" className={getStatusColor(report.status)}>
                                  {report.status}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{report.description}</p>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {report.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Download className="h-3 w-3" />
                                {report.downloads} downloads
                              </span>
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                {report.size}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Report</DropdownMenuItem>
                                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Report Templates */}
                <Card>
                  <CardHeader>
                    <CardTitle>Report Templates</CardTitle>
                    <CardDescription>
                      Pre-configured report templates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {reportsData.reportTemplates.map((template) => (
                        <div key={template.id} className="p-5 border rounded-lg">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <h4 className="font-medium text-foreground">{template.title}</h4>
                            <Badge variant="outline" className={getFrequencyColor(template.frequency)}>
                              {template.frequency}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm mb-4">{template.description}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="text-xs text-muted-foreground">
                              Last: {template.lastGenerated}
                            </span>
                            <Button size="sm" className="w-full sm:w-auto">
                              Generate
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Create Custom Report
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Reports
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Reports
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage; 