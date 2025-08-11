import { useParams } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Post {
  id: string;
  title: string;
  coverPhoto: string;
  date: string;
  url: string;
}

interface WidgetData {
  id: string;
  title: string;
  instagramHandle?: string;
  isActive: boolean;
}

export default function Widget() {
  const { token } = useParams<{ token: string }>();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { data: widgetData, isLoading, error } = useQuery<{ 
    success: boolean; 
    widget: WidgetData; 
    posts: Post[];
    error?: string;
  }>({
    queryKey: [`/api/widget/${token}`],
    enabled: !!token,
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
  });

  const handleRefresh = async () => {
    if (!token) return;
    
    setIsRefreshing(true);
    try {
      // Force server-side cache bypass by adding refresh parameter
      const refreshUrl = `/api/widget/${token}?refresh=true&t=${Date.now()}`;
      
      // Invalidate existing cache and fetch with refresh parameter
      await queryClient.invalidateQueries({
        queryKey: [`/api/widget/${token}`]
      });
      
      // Force new fetch with cache bypass
      await queryClient.fetchQuery({
        queryKey: [refreshUrl],
        queryFn: async () => {
          const response = await fetch(refreshUrl);
          if (!response.ok) throw new Error('Refresh failed');
          return response.json();
        },
      });
      
      // Update the main query with fresh data
      await queryClient.refetchQueries({
        queryKey: [`/api/widget/${token}`]
      });
      
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      // Add a small delay to show the loading state
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white p-4 flex items-center justify-center" style={{ minHeight: '760px', maxWidth: '640px' }}>
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading widget...</p>
        </div>
      </div>
    );
  }

  if (error || !widgetData?.success) {
    return (
      <div className="w-full bg-white p-4 flex items-center justify-center" style={{ minHeight: '760px', maxWidth: '640px' }}>
        <div className="text-center">
          <Camera className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-slate-800 mb-2">Widget not found</h2>
          <p className="text-slate-600 text-lg">The widget you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const widget = widgetData.widget;
  const posts = widgetData.posts || [];

  // Generate placeholder boxes for any missing posts (up to 9 total)
  const placeholderGradients = [
    "from-purple-400 via-pink-500 to-red-500",
    "from-blue-400 via-purple-500 to-pink-500",
    "from-green-400 via-blue-500 to-purple-500",
    "from-yellow-400 via-red-500 to-pink-500",
    "from-indigo-400 via-purple-500 to-pink-500",
    "from-pink-400 via-red-500 to-yellow-500",
    "from-teal-400 via-cyan-500 to-blue-500",
    "from-orange-400 via-pink-500 to-red-500",
    "from-cyan-400 via-blue-500 to-purple-500",
  ];

  return (
    <div className="w-full bg-white p-4 relative" style={{ minHeight: '760px', maxWidth: '640px' }}>
      <div className="w-full max-w-2xl mx-auto">
        {/* Refresh Button - Top Left */}
        <div className="absolute top-2 left-2 z-20">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 p-2 h-auto w-auto border border-transparent hover:border-slate-200 transition-all"
            title="Refresh content from Notion"
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin text-blue-500' : ''}`} />
          </Button>
        </div>
        
        {/* Last updated indicator - hidden but adds timestamp to force cache busting */}
        <div className="absolute top-1 right-1 text-xs text-transparent" data-updated={Date.now()}>
          {new Date().toISOString()}
        </div>
        
        {/* Instagram Grid */}
        <div className="grid grid-cols-3 gap-0.5 w-full relative">
          {Array.from({ length: 9 }, (_, i) => {
            const post = posts[i];
            
            if (post && post.coverPhoto) {
              // Show real image from Notion
              return (
                <div 
                  key={post.id}
                  className="w-full aspect-[4/5] shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                  title={post.title}
                >
                  <img 
                    src={post.coverPhoto} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.className += ` bg-gradient-to-br ${placeholderGradients[i]} flex items-center justify-center`;
                        parent.innerHTML += '<svg class="h-6 w-6 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>';
                      }
                    }}
                  />
                </div>
              );
            } else {
              // Show placeholder for empty slots
              return (
                <div 
                  key={`placeholder-${i}`}
                  className={`w-full aspect-[4/5] bg-gradient-to-br ${placeholderGradients[i]} flex items-center justify-center shadow-sm opacity-50`}
                >
                  <Camera className="text-white text-lg opacity-60" />
                </div>
              );
            }
          })}
        </div>
        {widgetData.error && (
          <div className="text-center mt-2">
            <p className="text-xs text-red-500">{widgetData.error}</p>
          </div>
        )}
        
        {/* Status indicator for refresh */}
        {isRefreshing && (
          <div className="absolute top-10 left-2 z-20">
            <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md">
              Updating...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}