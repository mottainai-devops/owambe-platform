import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { Gift, Star, TrendingUp } from "lucide-react";

const tierColors = {
  bronze: "bg-amber-100 text-amber-900",
  silver: "bg-gray-100 text-gray-900",
  gold: "bg-yellow-100 text-yellow-900",
  platinum: "bg-purple-100 text-purple-900",
};

const tierThresholds = {
  bronze: 0,
  silver: 1000,
  gold: 5000,
  platinum: 10000,
};

export default function LoyaltyPoints() {
  const { data: loyaltyData, isLoading } = trpc.loyalty.getPoints.useQuery();
  const { data: transactions } = trpc.loyalty.getTransactions.useQuery();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">Loading loyalty data...</p>
        </CardContent>
      </Card>
    );
  }

  if (!loyaltyData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">No loyalty data available</p>
        </CardContent>
      </Card>
    );
  }

  const currentTier = loyaltyData.tier as keyof typeof tierColors;
  const nextTierKey = Object.keys(tierThresholds).find(
    (tier, index) =>
      Object.values(tierThresholds)[index + 1] &&
      loyaltyData.lifetimePoints < Object.values(tierThresholds)[index + 1]
  ) as keyof typeof tierThresholds | undefined;

  const nextTierThreshold = nextTierKey ? tierThresholds[nextTierKey] : null;
  const progressToNextTier = nextTierThreshold
    ? Math.min(100, (loyaltyData.lifetimePoints / nextTierThreshold) * 100)
    : 100;

  return (
    <div className="space-y-6">
      {/* Main Loyalty Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Loyalty Program
          </CardTitle>
          <CardDescription>Earn points on every booking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Current Points</p>
              <p className="text-3xl font-bold text-blue-600">{loyaltyData.points}</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600 mb-1">Lifetime Points</p>
              <p className="text-3xl font-bold text-green-600">{loyaltyData.lifetimePoints}</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-600 mb-1">Current Tier</p>
              <Badge className={tierColors[currentTier]} variant="secondary">
                {currentTier.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Tier Progress */}
          {nextTierThreshold && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-sm">Progress to Next Tier</p>
                <p className="text-sm text-gray-600">
                  {loyaltyData.lifetimePoints} / {nextTierThreshold}
                </p>
              </div>
              <Progress value={progressToNextTier} className="h-2" />
              <p className="text-xs text-gray-500 mt-2">
                {nextTierThreshold - loyaltyData.lifetimePoints} points to next tier
              </p>
            </div>
          )}

          {/* Tier Benefits */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Tier Benefits</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                <Gift className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Exclusive Rewards</p>
                  <p className="text-xs text-gray-600">Redeem points for discounts and perks</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Bonus Multiplier</p>
                  <p className="text-xs text-gray-600">Earn more points with higher tiers</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      {transactions && transactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm capitalize">
                      {transaction.type} - {transaction.reason}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div
                    className={`font-bold ${
                      transaction.type === "earned" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {transaction.type === "earned" ? "+" : "-"}
                    {transaction.points}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

