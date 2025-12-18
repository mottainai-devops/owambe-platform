import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import { Link } from "wouter";

export default function SuperAdmin() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Check if user is admin
  const { data: analytics, isLoading: analyticsLoading } = trpc.admin.analytics.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>Please sign in with an admin account</CardDescription>
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

  if (analyticsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You do not have admin privileges</CardDescription>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <Link href="/">
              <Button variant="outline">Back to Platform</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 lg:w-auto">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="partners">Partners</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="tickets">Support</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <DashboardOverview analytics={analytics} />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <UsersManagement />
          </TabsContent>

          {/* Partners Tab */}
          <TabsContent value="partners">
            <PartnersManagement />
          </TabsContent>

          {/* Agents Tab */}
          <TabsContent value="agents">
            <AgentsManagement />
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content">
            <ContentModeration />
          </TabsContent>

          {/* Tickets Tab */}
          <TabsContent value="tickets">
            <SupportTickets />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <PlatformSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Dashboard Overview Component
function DashboardOverview({ analytics }: { analytics: any }) {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-3xl">₦{((analytics.platform.totalRevenue || 0) / 100).toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Bookings</CardDescription>
            <CardTitle className="text-3xl">{analytics.platform.totalBookings?.toLocaleString() || 0}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-3xl">{analytics.users.total?.toLocaleString() || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-green-600">+{analytics.users.newThisMonth || 0} this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Partners</CardDescription>
            <CardTitle className="text-3xl">{analytics.platform.totalPartners?.toLocaleString() || 0}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Agents</CardDescription>
            <CardTitle className="text-3xl">{analytics.agents.total?.toLocaleString() || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-blue-600">{analytics.agents.pending || 0} pending approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20">
            Approve Partners
          </Button>
          <Button variant="outline" className="h-20">
            Review Content
          </Button>
          <Button variant="outline" className="h-20">
            Process Payouts
          </Button>
          <Button variant="outline" className="h-20">
            View Reports
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Users Management Component
function UsersManagement() {
  const { data: users, isLoading } = trpc.admin.users.list.useQuery({ limit: 50, offset: 0 });

  if (isLoading) return <div>Loading users...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Manage all platform users</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users && users.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user: any) => (
                    <tr key={user.id}>
                      <td className="px-4 py-3">{user.name || "N/A"}</td>
                      <td className="px-4 py-3">{user.email || "N/A"}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{user.role}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No users found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Partners Management Component
function PartnersManagement() {
  const { data: partners, isLoading, refetch } = trpc.admin.partners.list.useQuery({});
  const approveMutation = trpc.admin.partners.approve.useMutation({
    onSuccess: () => refetch(),
  });
  const rejectMutation = trpc.admin.partners.reject.useMutation({
    onSuccess: () => refetch(),
  });

  if (isLoading) return <div>Loading partners...</div>;

  const pendingPartners = partners?.filter((p: any) => p.status === "pending") || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Partner Management</CardTitle>
        <CardDescription>{pendingPartners.length} pending approval</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingPartners.length > 0 ? (
            pendingPartners.map((partner: any) => (
              <div key={partner.id} className="border rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{partner.companyName}</h4>
                  <p className="text-sm text-gray-600">{partner.businessType}</p>
                  <p className="text-xs text-gray-500">{partner.contactEmail}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => approveMutation.mutate({ partnerId: partner.id })}
                    disabled={approveMutation.isPending}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => rejectMutation.mutate({ partnerId: partner.id, reason: "Not meeting criteria" })}
                    disabled={rejectMutation.isPending}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No pending partners</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Agents Management Component
function AgentsManagement() {
  const { data: agents, isLoading, refetch } = trpc.admin.agents.list.useQuery({});
  const { data: withdrawals, refetch: refetchWithdrawals } = trpc.admin.agents.withdrawals.useQuery();
  const approveMutation = trpc.admin.agents.approve.useMutation({
    onSuccess: () => refetch(),
  });

  if (isLoading) return <div>Loading agents...</div>;

  const pendingAgents = agents?.filter((a: any) => a.status === "pending") || [];

  return (
    <div className="space-y-6">
      {/* Pending Agents */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Approvals</CardTitle>
          <CardDescription>{pendingAgents.length} pending approval</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingAgents.length > 0 ? (
              pendingAgents.map((agent: any) => (
                <div key={agent.id} className="border rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{agent.businessName || "Individual Agent"}</h4>
                    <p className="text-sm text-gray-600">Code: {agent.agentCode}</p>
                    <p className="text-xs text-gray-500">{agent.city}, {agent.state}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => approveMutation.mutate({ agentId: agent.id })}
                    disabled={approveMutation.isPending}
                  >
                    Approve
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No pending agents</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pending Withdrawals */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Withdrawals</CardTitle>
          <CardDescription>{withdrawals?.length || 0} withdrawal requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {withdrawals && withdrawals.length > 0 ? (
              withdrawals.map((withdrawal: any) => (
                <div key={withdrawal.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">₦{(withdrawal.amount / 100).toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{withdrawal.bankName} - {withdrawal.accountNumber}</p>
                      <p className="text-xs text-gray-500">{withdrawal.accountName}</p>
                    </div>
                    <Button size="sm">Process</Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No pending withdrawals</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Content Moderation Component
function ContentModeration() {
  const { data: content, isLoading } = trpc.admin.content.pending.useQuery();

  if (isLoading) return <div>Loading content...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Moderation</CardTitle>
        <CardDescription>Review and approve pending content</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {content && (
            <>
              {content.events.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Pending Events ({content.events.length})</h3>
                  <div className="space-y-2">
                    {content.events.map((event: any) => (
                      <div key={event.id} className="border rounded p-3 flex justify-between items-center">
                        <span>{event.title}</span>
                        <Button size="sm">Approve</Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {content.venues.length === 0 && content.hotels.length === 0 && content.vendors.length === 0 && content.events.length === 0 && (
                <p className="text-center text-gray-500 py-8">No pending content</p>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Support Tickets Component
function SupportTickets() {
  const { data: tickets, isLoading } = trpc.admin.tickets.list.useQuery({});

  if (isLoading) return <div>Loading tickets...</div>;

  const openTickets = tickets?.filter((t: any) => t.status === "open") || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Support Tickets</CardTitle>
        <CardDescription>{openTickets.length} open tickets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {openTickets.length > 0 ? (
            openTickets.map((ticket: any) => (
              <div key={ticket.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{ticket.subject}</h4>
                    <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{ticket.category}</span>
                      <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">{ticket.priority}</span>
                    </div>
                  </div>
                  <Button size="sm">View</Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No open tickets</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Platform Settings Component
function PlatformSettings() {
  const { data: commissionRates } = trpc.admin.commissionRates.list.useQuery();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Commission Rates</CardTitle>
          <CardDescription>Manage platform commission rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {commissionRates && commissionRates.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entity</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {commissionRates.map((rate: any) => (
                      <tr key={rate.id}>
                        <td className="px-4 py-3 capitalize">{rate.entityType}</td>
                        <td className="px-4 py-3 capitalize">{rate.productType}</td>
                        <td className="px-4 py-3">
                          {rate.rateType === "percentage" ? `${rate.rateValue / 100}%` : `₦${rate.rateValue / 100}`}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">{rate.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No commission rates configured</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

