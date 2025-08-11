import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Grid, Plus, Calendar, Instagram, Copy, Check, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface Widget {
  id: string;
  token: string;
  title: string;
  gridSize: string;
  instagramHandle?: string;
  isActive: boolean;
  createdAt: string;
}

export default function Home() {
  const [copiedWidgetId, setCopiedWidgetId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { data: widgetsData, isLoading } = useQuery<{ success: boolean; widgets: Widget[] }>({
    queryKey: ["/api/widgets"],
  });

  const widgets = widgetsData?.widgets || [];

  const getWidgetUrl = (token: string) => {
    return `${window.location.origin}/widget/${token}`;
  };

  const copyWidgetUrl = async (token: string, widgetId: string) => {
    const url = getWidgetUrl(token);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedWidgetId(widgetId);
      toast({
        title: "Widget URL copied!",
        description: "You can now paste this URL in Notion to embed your widget.",
      });
      setTimeout(() => setCopiedWidgetId(null), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please manually copy the URL from the text field.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Grid className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-slate-800">xav agency widgets</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-slate-600 hover:text-slate-800 transition-colors">Widgets</a>
              <a href="#" className="text-slate-600 hover:text-slate-800 transition-colors">Documentation</a>
              <a href="#" className="text-slate-600 hover:text-slate-800 transition-colors">Support</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Connect Instagram to Notion
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Create beautiful Instagram Grid widgets that sync with your Notion content calendar tables
          </p>
          <Link href="/setup">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Plus className="h-5 w-5 mr-2" />
              Create New Widget
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Instagram className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Instagram Grid</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Create beautiful grid layouts that showcase your Instagram content in a clean, organized format.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Notion Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Connect directly to your Notion content calendar databases for seamless content management.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Grid className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Easy Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Simple 3-step wizard to connect your Notion database and create your widget in minutes.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Existing Widgets */}
        {widgets.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Your Widgets</h2>
              <Link href="/setup">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Another
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="h-4 bg-slate-200 rounded animate-pulse mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded animate-pulse w-2/3"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-24 bg-slate-200 rounded animate-pulse"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {widgets.map((widget) => (
                  <Card key={widget.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="truncate">{widget.title}</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          widget.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {widget.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </CardTitle>
                      <p className="text-sm text-slate-600">
                        {widget.gridSize} • {widget.instagramHandle || 'No handle'}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 rounded-lg h-24 flex items-center justify-center mb-4">
                        <Grid className="h-8 w-8 text-white" />
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-slate-700 mb-1 block">
                            Widget URL for Notion Embed
                          </label>
                          <div className="flex items-center space-x-2">
                            <Input
                              value={getWidgetUrl(widget.token)}
                              readOnly
                              className="text-xs font-mono"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyWidgetUrl(widget.token, widget.id)}
                              className="flex-shrink-0"
                            >
                              {copiedWidgetId === widget.id ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(getWidgetUrl(widget.token), '_blank')}
                              className="text-xs"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Preview
                            </Button>
                          </div>
                          <span className="text-xs text-slate-500">
                            {new Date(widget.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {widgets.length === 0 && !isLoading && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Grid className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No widgets yet</h3>
              <p className="text-slate-600 mb-6">Create your first Instagram Grid widget to get started</p>
              <Link href="/setup">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Widget
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                <Grid className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-slate-600">xav agency widgets</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-slate-500">
              <a href="#" className="hover:text-slate-700 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-700 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-slate-700 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
