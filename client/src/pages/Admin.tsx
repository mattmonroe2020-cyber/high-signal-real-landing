import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { 
  Users, 
  TrendingUp, 
  Mail, 
  Calendar,
  BarChart3,
  ArrowLeft,
  RefreshCw,
  Loader2,
  Eye,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#A86030", "#C47A4A", "#D99A6A", "#E8B98A", "#F5D5AA"];

export default function Admin() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  
  const { data: leads, isLoading: leadsLoading, refetch: refetchLeads } = trpc.admin.getLeads.useQuery(
    undefined,
    { enabled: isAuthenticated && user?.role === "admin" }
  );
  
  const { data: analytics, isLoading: analyticsLoading, refetch: refetchAnalytics } = trpc.admin.getAnalytics.useQuery(
    undefined,
    { enabled: isAuthenticated && user?.role === "admin" }
  );

  const processEmails = trpc.admin.processEmailQueue.useMutation({
    onSuccess: (data) => {
      toast.success(`Processed ${data.processed} emails: ${data.sent} sent, ${data.failed} failed`);
      refetchLeads();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateBookingStatus = trpc.admin.updateBookingStatus.useMutation({
    onSuccess: () => {
      toast.success("Booking status updated");
      refetchLeads();
      refetchAnalytics();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleRefresh = () => {
    refetchLeads();
    refetchAnalytics();
    toast.success("Data refreshed");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>Please log in to access the admin dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild className="btn-copper">
              <a href={getLoginUrl()}>Log In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this page.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild variant="outline">
              <Link href="/">Return Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isLoading = leadsLoading || analyticsLoading;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Site
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => processEmails.mutate()} 
            disabled={processEmails.isPending}
            className="mr-2"
          >
            <Mail className={`h-4 w-4 mr-2 ${processEmails.isPending ? "animate-spin" : ""}`} />
            Process Emails
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </header>

      <main className="container py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics?.totalLeads || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Playbook downloads</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Page Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics?.totalPageViews || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Total visits</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics?.totalBookings || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Discovery calls booked</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{(analytics?.conversionRate || 0).toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">Lead to booking</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="leads" className="space-y-6">
          <TabsList>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Leads Tab */}
          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <CardTitle>Lead Management</CardTitle>
                <CardDescription>View and manage all leads from the playbook download form.</CardDescription>
              </CardHeader>
              <CardContent>
                {leadsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : leads && leads.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Stage</TableHead>
                          <TableHead>ND</TableHead>
                          <TableHead>Emails Sent</TableHead>
                          <TableHead>Booked</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leads.map((lead) => (
                          <TableRow key={lead.id}>
                            <TableCell className="font-medium">{lead.firstName}</TableCell>
                            <TableCell>
                              <a href={`mailto:${lead.email}`} className="text-primary hover:underline">
                                {lead.email}
                              </a>
                            </TableCell>
                            <TableCell>{lead.company || "-"}</TableCell>
                            <TableCell>
                              {lead.stage ? (
                                <Badge variant="secondary">{lead.stage}</Badge>
                              ) : "-"}
                            </TableCell>
                            <TableCell>
                              {lead.isNeurodivergent ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{lead.emailsSent}/4</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Switch
                                checked={lead.hasBookedCall || false}
                                onCheckedChange={(checked) => 
                                  updateBookingStatus.mutate({ leadId: lead.id, hasBookedCall: checked })
                                }
                              />
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(lead.createdAt).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No leads yet. Share your landing page to start collecting leads!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Leads by Stage</CardTitle>
                  <CardDescription>Distribution of leads by funding stage</CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics?.leadsByStage && analytics.leadsByStage.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={analytics.leadsByStage}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ stage, count }) => `${stage}: ${count}`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="stage"
                        >
                          {analytics.leadsByStage.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                      <p>No data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Leads by Source</CardTitle>
                  <CardDescription>Where your leads are coming from</CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics?.leadsBySource && analytics.leadsBySource.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.leadsBySource}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="source" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#A86030" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                      <p>No data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Event Summary</CardTitle>
                  <CardDescription>Recent activity on your landing page</CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics?.recentEvents && analytics.recentEvents.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {analytics.recentEvents.map((event, index) => (
                        <div key={index} className="bg-secondary/50 p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold text-primary">{event.count}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {event.eventType.replace(/_/g, " ")}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No events recorded yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
