"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bell, Mail, MessageSquare, Shield, Info } from "lucide-react";
import { toast } from "sonner";

interface NotificationsFormProps {
  user: {
    username: string;
    email: string;
    avatar?: string;
    roles?: string[];
  };
}

export const NotificationsForm = ({ user }: NotificationsFormProps) => {
  const [isPending, setIsPending] = useState(false);
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    securityAlerts: true,
    teamUpdates: true,
    systemMaintenance: false,
    marketingEmails: false,
    weeklyReports: true,
    monthlyReports: false,
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    setIsPending(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Notification settings updated successfully");
    } catch (error) {
      toast.error("Failed to update notification settings");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="grid gap-6">
      {/* Email Notifications Card */}
      <Card className="bg-stone-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
          <CardDescription className="text-gray-400">
            Control which email notifications you receive.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-gray-300">Email Notifications</Label>
              <p className="text-sm text-gray-400">Receive notifications via email</p>
            </div>
            <Switch
              checked={notifications.emailNotifications}
              onCheckedChange={() => handleToggle('emailNotifications')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-gray-300">Security Alerts</Label>
              <p className="text-sm text-gray-400">Get notified about security events</p>
            </div>
            <Switch
              checked={notifications.securityAlerts}
              onCheckedChange={() => handleToggle('securityAlerts')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-gray-300">Team Updates</Label>
              <p className="text-sm text-gray-400">Notifications about team changes</p>
            </div>
            <Switch
              checked={notifications.teamUpdates}
              onCheckedChange={() => handleToggle('teamUpdates')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-gray-300">System Maintenance</Label>
              <p className="text-sm text-gray-400">Scheduled maintenance notifications</p>
            </div>
            <Switch
              checked={notifications.systemMaintenance}
              onCheckedChange={() => handleToggle('systemMaintenance')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications Card */}
      <Card className="bg-stone-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Bell className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription className="text-gray-400">
            Control browser and app push notifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-gray-300">Push Notifications</Label>
              <p className="text-sm text-gray-400">Receive real-time notifications in your browser</p>
            </div>
            <Switch
              checked={notifications.pushNotifications}
              onCheckedChange={() => handleToggle('pushNotifications')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Reports & Analytics Card */}
      <Card className="bg-stone-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <MessageSquare className="h-5 w-5" />
            Reports & Analytics
          </CardTitle>
          <CardDescription className="text-gray-400">
            Manage your report and analytics email preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-gray-300">Weekly Reports</Label>
              <p className="text-sm text-gray-400">Receive weekly summary reports</p>
            </div>
            <Switch
              checked={notifications.weeklyReports}
              onCheckedChange={() => handleToggle('weeklyReports')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-gray-300">Monthly Reports</Label>
              <p className="text-sm text-gray-400">Receive monthly detailed reports</p>
            </div>
            <Switch
              checked={notifications.monthlyReports}
              onCheckedChange={() => handleToggle('monthlyReports')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Marketing Communications Card */}
      <Card className="bg-stone-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Info className="h-5 w-5" />
            Marketing Communications
          </CardTitle>
          <CardDescription className="text-gray-400">
            Control marketing and promotional emails.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-gray-300">Marketing Emails</Label>
              <p className="text-sm text-gray-400">Receive promotional and marketing content</p>
            </div>
            <Switch
              checked={notifications.marketingEmails}
              onCheckedChange={() => handleToggle('marketingEmails')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences Info Card */}
      <Card className="bg-stone-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Notification Preferences</CardTitle>
          <CardDescription className="text-gray-400">
            Information about your notification settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-gray-400 text-sm">Email Address</Label>
                <p className="text-white font-medium">{user.email}</p>
              </div>
              <div>
                <Label className="text-gray-400 text-sm">Last Updated</Label>
                <p className="text-white font-medium">Today at 3:45 PM</p>
              </div>
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Notification Delivery</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Email notifications are sent to your registered email address</li>
                <li>• Push notifications appear in your browser when the app is open</li>
                <li>• Security alerts are always sent regardless of settings</li>
                <li>• You can change these settings at any time</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6"
        >
          {isPending && <Info className="animate-spin w-4 h-4 mr-2" />}
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}; 