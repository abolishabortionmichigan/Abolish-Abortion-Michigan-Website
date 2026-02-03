'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Newspaper, FileText, RefreshCw, ArrowUpRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getDashboardStats } from '@/lib/actions/dashboard-actions';
import { DashboardStats } from '@/types';

const quickActions = [
  {
    icon: Mail,
    label: 'View Inquiries',
    href: '/admin/dashboard/inquiries',
    color: 'bg-blue-500/10 text-blue-600',
  },
  {
    icon: Newspaper,
    label: 'Manage News',
    href: '/admin/dashboard/news',
    color: 'bg-green-500/10 text-green-600',
  },
];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const stats = [
    {
      title: 'Total Inquiries',
      value: data?.totalInquiries ?? 0,
      description: 'Contact form submissions',
      icon: <Mail size={20} />,
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      title: 'Pending Inquiries',
      value: data?.pendingInquiries ?? 0,
      description: 'Awaiting response',
      icon: <Mail size={20} />,
      color: 'bg-yellow-500/10 text-yellow-600',
    },
    {
      title: 'News Articles',
      value: data?.totalNews ?? 0,
      description: 'Published and draft articles',
      icon: <Newspaper size={20} />,
      color: 'bg-green-500/10 text-green-600',
    },
    {
      title: 'Petition Signatures',
      value: data?.totalSignatures ?? 0,
      description: 'People who signed the petition',
      icon: <FileText size={20} />,
      color: 'bg-purple-500/10 text-purple-600',
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getDashboardStats();
      if ('error' in res) {
        setError(true);
      } else {
        setData(res);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span className="ml-2">Refresh</span>
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 flex items-center justify-between">
          <p>Error fetching dashboard data. Please try again.</p>
          <Button variant="outline" size="sm" onClick={fetchData}>
            Retry
          </Button>
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          {quickActions.map((action, i) => (
            <Link key={i} href={action.href} className="flex-1 min-w-[200px]">
              <div className="group flex items-center justify-between p-4 rounded-xl border hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`${action.color} p-3 rounded-lg`}>
                    <action.icon size={20} />
                  </div>
                  <span className="font-medium">{action.label}</span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.color}`}>{stat.icon}</div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-10 w-20 mb-1" />
              ) : (
                <div className="text-3xl font-bold">{stat.value}</div>
              )}
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
