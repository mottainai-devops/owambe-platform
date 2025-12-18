import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Link } from "wouter";
import { Copy, TrendingUp, Users, Wallet, DollarSign, Target, Package } from "lucide-react";

export default function AgentDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Check if user is an agent
  const { data: agentStatus, isLoading: statusLoading } = trpc.agent.isAgent.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: dashboard, isLoading: dashboardLoading } = trpc.agent.dashboard.useQuery(undefined, {
    enabled: isAuthenticated && agentStatus?.isAgent,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Agent Access Required</CardTitle>
            <CardDescription>Please sign in to access the agent dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">Go to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (statusLoading || dashboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading agent dashboard...</p>
        </div>
      </div>
    );
  }

  // If not an agent, show application form
  if (!agentStatus?.isAgent) {
    return <AgentApplicationForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
              <p className="text-sm text-gray-600">
                Agent Code: <span className="font-mono font-semibold">{dashboard?.agent?.agentCode}</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-500">Tier</p>
                <p className="font-semibold capitalize">{dashboard?.agent?.tier}</p>
              </div>
              <Link href="/">
                <Button variant="outline">Back to Platform</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="commissions">Commissions</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <OverviewTab dashboard={dashboard} />
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <ProductsTab />
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals">
            <ReferralsTab agentCode={dashboard?.agent?.agentCode} />
          </TabsContent>

          {/* Commissions Tab */}
          <TabsContent value="commissions">
            <CommissionsTab />
          </TabsContent>

          {/* Wallet Tab */}
          <TabsContent value="wallet">
            <WalletTab />
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers">
            <CustomersTab />
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance">
            <PerformanceTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Agent Application Form
function AgentApplicationForm() {
  const [formData, setFormData] = useState({
    businessName: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    country: "Nigeria",
    bankName: "",
    accountNumber: "",
    accountName: "",
  });

  const applyMutation = trpc.agent.applyToBeAgent.useMutation({
    onSuccess: () => {
      alert("Application submitted successfully! We'll review and get back to you soon.");
      window.location.reload();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Become an Owambe Agent</CardTitle>
            <CardDescription>
              Join our agent network and earn commissions by promoting events, venues, hotels, and vendors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">Business Name (Optional)</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="Your business name"
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="+234 XXX XXX XXXX"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Lagos"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="Lagos"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-4">Bank Details (for commission payouts)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="bankName">Bank Name *</Label>
                    <Input
                      id="bankName"
                      required
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      placeholder="GTBank"
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountNumber">Account Number *</Label>
                    <Input
                      id="accountNumber"
                      required
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      placeholder="0123456789"
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountName">Account Name *</Label>
                    <Input
                      id="accountName"
                      required
                      value={formData.accountName}
                      onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={applyMutation.isPending}>
                {applyMutation.isPending ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Overview Tab
function OverviewTab({ dashboard }: { dashboard: any }) {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Wallet Balance</CardDescription>
              <Wallet className="h-4 w-4 text-gray-400" />
            </div>
            <CardTitle className="text-3xl">₦{((dashboard?.wallet?.balance || 0) / 100).toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">
              Pending: ₦{((dashboard?.wallet?.pendingBalance || 0) / 100).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Total Earnings</CardDescription>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </div>
            <CardTitle className="text-3xl">₦{((dashboard?.wallet?.totalEarned || 0) / 100).toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600">
              This month: ₦{((dashboard?.stats?.monthlyCommissions || 0) / 100).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Total Referrals</CardDescription>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </div>
            <CardTitle className="text-3xl">{dashboard?.stats?.totalReferrals || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-blue-600">{dashboard?.stats?.convertedReferrals || 0} converted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Conversion Rate</CardDescription>
              <Target className="h-4 w-4 text-gray-400" />
            </div>
            <CardTitle className="text-3xl">{dashboard?.stats?.conversionRate?.toFixed(1) || 0}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">
              {dashboard?.stats?.monthlyReferrals || 0} referrals this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20" onClick={() => {}}>
            Generate Referral Link
          </Button>
          <Button variant="outline" className="h-20">
            View Products
          </Button>
          <Button variant="outline" className="h-20">
            Request Withdrawal
          </Button>
          <Button variant="outline" className="h-20">
            Add Customer
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Products Tab
function ProductsTab() {
  const { data: products, isLoading } = trpc.agent.products.all.useQuery();

  if (isLoading) return <div>Loading products...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Available Products</CardTitle>
          <CardDescription>Browse and promote these products to earn commissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="events" className="space-y-4">
            <TabsList>
              <TabsTrigger value="events">Events ({products?.events?.length || 0})</TabsTrigger>
              <TabsTrigger value="venues">Venues ({products?.venues?.length || 0})</TabsTrigger>
              <TabsTrigger value="hotels">Hotels ({products?.hotels?.length || 0})</TabsTrigger>
              <TabsTrigger value="vendors">Vendors ({products?.vendors?.length || 0})</TabsTrigger>
            </TabsList>

            <TabsContent value="events" className="space-y-4">
              {products?.events?.map((event: any) => (
                <ProductCard key={event.id} product={event} type="event" />
              ))}
            </TabsContent>

            <TabsContent value="venues" className="space-y-4">
              {products?.venues?.map((venue: any) => (
                <ProductCard key={venue.id} product={venue} type="venue" />
              ))}
            </TabsContent>

            <TabsContent value="hotels" className="space-y-4">
              {products?.hotels?.map((hotel: any) => (
                <ProductCard key={hotel.id} product={hotel} type="hotel" />
              ))}
            </TabsContent>

            <TabsContent value="vendors" className="space-y-4">
              {products?.vendors?.map((vendor: any) => (
                <ProductCard key={vendor.id} product={vendor} type="vendor" />
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function ProductCard({ product, type }: { product: any; type: string }) {
  const createReferralMutation = trpc.agent.referrals.create.useMutation({
    onSuccess: (data) => {
      const link = `${window.location.origin}/${type}s/${product.id}?ref=${data.referralCode}`;
      navigator.clipboard.writeText(link);
      alert("Referral link copied to clipboard!");
    },
  });

  return (
    <div className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50">
      <div className="flex-1">
        <h4 className="font-semibold">{product.title || product.name || product.businessName}</h4>
        <p className="text-sm text-gray-600 mt-1">
          {product.description?.substring(0, 100)}...
        </p>
        <p className="text-sm font-semibold text-blue-600 mt-2">
          ₦{((product.price || product.pricePerDay || product.pricePerNight || product.basePrice || 0) / 100).toLocaleString()}
        </p>
      </div>
      <Button
        size="sm"
        onClick={() => createReferralMutation.mutate({ productType: type as any, productId: product.id })}
        disabled={createReferralMutation.isPending}
      >
        <Copy className="h-4 w-4 mr-2" />
        Get Link
      </Button>
    </div>
  );
}

// Referrals Tab
function ReferralsTab({ agentCode }: { agentCode: string }) {
  const { data: referrals, isLoading } = trpc.agent.referrals.list.useQuery();

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Referrals</CardTitle>
        <CardDescription>{referrals?.length || 0} total referrals</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : referrals && referrals.length > 0 ? (
          <div className="space-y-4">
            {referrals.map((ref: any) => (
              <div key={ref.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-mono text-sm font-semibold">{ref.referralCode}</p>
                    <p className="text-sm text-gray-600 capitalize">{ref.productType}</p>
                    <p className="text-xs text-gray-500 mt-1">{ref.clickCount} clicks</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        ref.conversionStatus === "converted"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {ref.conversionStatus}
                    </span>
                    {ref.commissionAmount && (
                      <p className="text-sm font-semibold text-green-600 mt-2">
                        ₦{(ref.commissionAmount / 100).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No referrals yet. Start promoting products!</p>
        )}
      </CardContent>
    </Card>
  );
}

// Commissions Tab
function CommissionsTab() {
  const { data: commissions, isLoading } = trpc.agent.commissions.list.useQuery();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commission History</CardTitle>
        <CardDescription>{commissions?.length || 0} commission records</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : commissions && commissions.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {commissions.map((comm: any) => (
                  <tr key={comm.id}>
                    <td className="px-4 py-3 text-sm">
                      {new Date(comm.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm capitalize">{comm.productType}</td>
                    <td className="px-4 py-3 text-sm">₦{(comm.bookingAmount / 100).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-green-600">
                      ₦{(comm.commissionAmount / 100).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          comm.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : comm.status === "approved"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {comm.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No commissions yet</p>
        )}
      </CardContent>
    </Card>
  );
}

// Wallet Tab
function WalletTab() {
  const { data: wallet } = trpc.agent.wallet.get.useQuery();
  const { data: transactions } = trpc.agent.wallet.transactions.useQuery();
  const { data: withdrawals } = trpc.agent.wallet.withdrawals.useQuery();
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);

  return (
    <div className="space-y-6">
      {/* Wallet Balance */}
      <Card>
        <CardHeader>
          <CardTitle>Wallet Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">Available Balance</p>
              <p className="text-3xl font-bold text-green-600">
                ₦{((wallet?.balance || 0) / 100).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Balance</p>
              <p className="text-3xl font-bold text-yellow-600">
                ₦{((wallet?.pendingBalance || 0) / 100).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Earned</p>
              <p className="text-3xl font-bold text-blue-600">
                ₦{((wallet?.totalEarned || 0) / 100).toLocaleString()}
              </p>
            </div>
          </div>
          <Button className="mt-6" onClick={() => setShowWithdrawForm(!showWithdrawForm)}>
            Request Withdrawal
          </Button>
        </CardContent>
      </Card>

      {/* Withdrawal Form */}
      {showWithdrawForm && <WithdrawalForm onClose={() => setShowWithdrawForm(false)} />}

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions && transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.slice(0, 10).map((tx: any) => (
                <div key={tx.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium capitalize">{tx.transactionType}</p>
                    <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleString()}</p>
                  </div>
                  <p
                    className={`font-semibold ${
                      tx.transactionType === "credit" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {tx.transactionType === "credit" ? "+" : "-"}₦{(tx.amount / 100).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No transactions yet</p>
          )}
        </CardContent>
      </Card>

      {/* Withdrawal History */}
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
        </CardHeader>
        <CardContent>
          {withdrawals && withdrawals.length > 0 ? (
            <div className="space-y-3">
              {withdrawals.map((wd: any) => (
                <div key={wd.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">₦{(wd.amount / 100).toLocaleString()}</p>
                      <p className="text-sm text-gray-600">
                        {wd.bankName} - {wd.accountNumber}
                      </p>
                      <p className="text-xs text-gray-500">{new Date(wd.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        wd.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : wd.status === "processing"
                          ? "bg-blue-100 text-blue-800"
                          : wd.status === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {wd.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No withdrawals yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function WithdrawalForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    amount: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    withdrawalMethod: "bank_transfer" as const,
  });

  const withdrawMutation = trpc.agent.wallet.withdraw.useMutation({
    onSuccess: () => {
      alert("Withdrawal request submitted successfully!");
      onClose();
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    withdrawMutation.mutate({
      ...formData,
      amount: parseFloat(formData.amount) * 100, // Convert to cents
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Withdrawal</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount (₦)</Label>
            <Input
              id="amount"
              type="number"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="10000"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                required
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                required
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                required
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={withdrawMutation.isPending}>
              {withdrawMutation.isPending ? "Processing..." : "Submit Request"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Customers Tab
function CustomersTab() {
  const { data: customers, isLoading } = trpc.agent.customers.list.useQuery();

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Customers</CardTitle>
        <CardDescription>{customers?.length || 0} customers</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : customers && customers.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bookings</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers.map((customer: any) => (
                  <tr key={customer.id}>
                    <td className="px-4 py-3">{customer.customerName}</td>
                    <td className="px-4 py-3 text-sm">
                      <div>{customer.customerEmail}</div>
                      <div className="text-gray-500">{customer.customerPhone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 capitalize">
                        {customer.leadStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">{customer.totalBookings}</td>
                    <td className="px-4 py-3">₦{(customer.totalSpent / 100).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No customers yet</p>
        )}
      </CardContent>
    </Card>
  );
}

// Performance Tab
function PerformanceTab() {
  const { data: performance } = trpc.agent.performance.useQuery({ days: 30 });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance Analytics</CardTitle>
          <CardDescription>Last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Daily Conversions Chart Placeholder */}
            <div>
              <h4 className="font-semibold mb-4">Daily Conversions</h4>
              <div className="h-64 border rounded flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">Chart visualization coming soon</p>
              </div>
            </div>

            {/* Product Breakdown */}
            <div>
              <h4 className="font-semibold mb-4">Product Type Breakdown</h4>
              {performance?.productBreakdown && performance.productBreakdown.length > 0 ? (
                <div className="space-y-3">
                  {performance.productBreakdown.map((item: any) => (
                    <div key={item.productType} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium capitalize">{item.productType}</p>
                        <p className="text-sm text-gray-500">{item.count} conversions</p>
                      </div>
                      <p className="font-semibold">₦{((item.revenue || 0) / 100).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No data available</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

