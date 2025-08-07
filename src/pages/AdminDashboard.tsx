
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Bus, DollarSign, TrendingUp } from 'lucide-react';
import CustomLineChart from '@/components/ui/CustomLineChart';
import CustomBarChart from '@/components/ui/CustomBarChart';
import CustomPieChart from '@/components/ui/CustomPieChart';

export default function AdminDashboard() {
  const stats = [
    { title: 'Total Bookings', value: '15,420', icon: TrendingUp },
    { title: 'Total Revenue', value: '462M FCFA', icon: DollarSign },
    { title: 'Active Users', value: '8,750', icon: Users },
    { title: 'Active Buses', value: '210', icon: Bus }
  ];

  // Mock data for charts
  const bookingsTrend = [
    { month: 'Jan', bookings: 1200 },
    { month: 'Feb', bookings: 1400 },
    { month: 'Mar', bookings: 1800 },
    { month: 'Apr', bookings: 1600 },
    { month: 'May', bookings: 2000 },
    { month: 'Jun', bookings: 2100 },
    { month: 'Jul', bookings: 1700 },
    { month: 'Aug', bookings: 2200 },
    { month: 'Sep', bookings: 1950 },
    { month: 'Oct', bookings: 2300 },
    { month: 'Nov', bookings: 2500 },
    { month: 'Dec', bookings: 2700 },
  ];
  const popularRoutes = [
    { route: 'Douala-Yaounde', count: 1200 },
    { route: 'Bamenda-Douala', count: 950 },
    { route: 'Yaounde-Buea', count: 800 },
    { route: 'Bafoussam-Yaounde', count: 700 },
    { route: 'Limbe-Bamenda', count: 600 },
  ];
  const revenueByAgency = [
    { agency: 'KamerWays Express', revenue: 120000000 },
    { agency: 'TransCam', revenue: 90000000 },
    { agency: 'Express Union', revenue: 70000000 },
    { agency: 'BucaVoyage', revenue: 50000000 },
  ];

  // Fallback UI for web users if charts can't render
  const isChartSupported = typeof window !== 'undefined';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Bookings Trend (Line Chart)</CardTitle>
            </CardHeader>
            <CardContent>
              {isChartSupported ? (
                <CustomLineChart data={bookingsTrend} xKey="month" yKey="bookings" label="Bookings" />
              ) : (
                <div className="text-center text-muted-foreground">Chart not supported in this environment.</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Popular Routes (Bar Chart)</CardTitle>
            </CardHeader>
            <CardContent>
              {isChartSupported ? (
                <CustomBarChart data={popularRoutes} xKey="route" yKey="count" label="Bookings" />
              ) : (
                <div className="text-center text-muted-foreground">Chart not supported in this environment.</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Agency (Pie Chart)</CardTitle>
            </CardHeader>
            <CardContent>
              {isChartSupported ? (
                <CustomPieChart data={revenueByAgency} dataKey="revenue" nameKey="agency" />
              ) : (
                <div className="text-center text-muted-foreground">Chart not supported in this environment.</div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Admin dashboard with analytics and management tools.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}