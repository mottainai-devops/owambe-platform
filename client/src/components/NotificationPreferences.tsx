import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function NotificationPreferences() {
  const { data: settings, isLoading } = trpc.notifications.getSettings.useQuery();
  const updateSettingsMutation = trpc.notifications.updateSettings.useMutation({
    onSuccess: () => {
      toast.success("Notification preferences updated!");
    },
    onError: (error) => {
      toast.error("Failed to update preferences", {
        description: error.message,
      });
    },
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    bookingUpdates: true,
    paymentUpdates: true,
    promotions: true,
    reviews: true,
    messages: true,
  });

  useEffect(() => {
    if (settings) {
      setPreferences({
        emailNotifications: settings.emailNotifications ?? true,
        smsNotifications: settings.smsNotifications ?? false,
        pushNotifications: settings.pushNotifications ?? true,
        bookingUpdates: settings.bookingUpdates ?? true,
        paymentUpdates: settings.paymentUpdates ?? true,
        promotions: settings.promotions ?? true,
        reviews: settings.reviews ?? true,
        messages: settings.messages ?? true,
      });
    }
  }, [settings]);

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    updateSettingsMutation.mutate(preferences);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">Loading preferences...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Customize how and when you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Notification Channels */}
        <div>
          <h3 className="font-semibold mb-4">Notification Channels</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label htmlFor="email-toggle" className="font-medium cursor-pointer">
                  Email Notifications
                </Label>
                <p className="text-sm text-gray-600">Receive updates via email</p>
              </div>
              <input
                id="email-toggle"
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={() => handleToggle("emailNotifications")}
                className="w-5 h-5 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label htmlFor="sms-toggle" className="font-medium cursor-pointer">
                  SMS Notifications
                </Label>
                <p className="text-sm text-gray-600">Receive updates via text message</p>
              </div>
              <input
                id="sms-toggle"
                type="checkbox"
                checked={preferences.smsNotifications}
                onChange={() => handleToggle("smsNotifications")}
                className="w-5 h-5 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label htmlFor="push-toggle" className="font-medium cursor-pointer">
                  Push Notifications
                </Label>
                <p className="text-sm text-gray-600">Receive browser notifications</p>
              </div>
              <input
                id="push-toggle"
                type="checkbox"
                checked={preferences.pushNotifications}
                onChange={() => handleToggle("pushNotifications")}
                className="w-5 h-5 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Notification Types */}
        <div>
          <h3 className="font-semibold mb-4">Notification Types</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label htmlFor="booking-toggle" className="font-medium cursor-pointer">
                  Booking Updates
                </Label>
                <p className="text-sm text-gray-600">Updates about your bookings</p>
              </div>
              <input
                id="booking-toggle"
                type="checkbox"
                checked={preferences.bookingUpdates}
                onChange={() => handleToggle("bookingUpdates")}
                className="w-5 h-5 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label htmlFor="payment-toggle" className="font-medium cursor-pointer">
                  Payment Updates
                </Label>
                <p className="text-sm text-gray-600">Confirmations and receipts</p>
              </div>
              <input
                id="payment-toggle"
                type="checkbox"
                checked={preferences.paymentUpdates}
                onChange={() => handleToggle("paymentUpdates")}
                className="w-5 h-5 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label htmlFor="promotions-toggle" className="font-medium cursor-pointer">
                  Promotions & Offers
                </Label>
                <p className="text-sm text-gray-600">Special deals and discounts</p>
              </div>
              <input
                id="promotions-toggle"
                type="checkbox"
                checked={preferences.promotions}
                onChange={() => handleToggle("promotions")}
                className="w-5 h-5 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label htmlFor="reviews-toggle" className="font-medium cursor-pointer">
                  Review Notifications
                </Label>
                <p className="text-sm text-gray-600">When you receive new reviews</p>
              </div>
              <input
                id="reviews-toggle"
                type="checkbox"
                checked={preferences.reviews}
                onChange={() => handleToggle("reviews")}
                className="w-5 h-5 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label htmlFor="messages-toggle" className="font-medium cursor-pointer">
                  Messages
                </Label>
                <p className="text-sm text-gray-600">New messages from other users</p>
              </div>
              <input
                id="messages-toggle"
                type="checkbox"
                checked={preferences.messages}
                onChange={() => handleToggle("messages")}
                className="w-5 h-5 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={updateSettingsMutation.isPending}
          className="w-full"
        >
          {updateSettingsMutation.isPending ? "Saving..." : "Save Preferences"}
        </Button>
      </CardContent>
    </Card>
  );
}

