import { Grid, Camera } from "lucide-react";

interface WidgetPreviewProps {
  title?: string;
  instagramHandle?: string;
  isConfigured?: boolean;
}

export default function WidgetPreview({ 
  title = "Instagram Grid Widget", 
  instagramHandle,
  isConfigured = false 
}: WidgetPreviewProps) {
  const gridCols = 3;
  const gridRows = 3;
  const totalImages = 9;

  if (!isConfigured) {
    return (
      <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
        <div className="w-full h-64 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center mb-4">
          <div className="text-center">
            <Camera className="h-12 w-12 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-500 font-medium">Widget Preview Placeholder</p>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">Your widget preview will appear here</h3>
        <p className="text-sm text-slate-500">Fill out the form to get started</p>
      </div>
    );
  }

  const gradients = [
    "from-purple-400 via-pink-500 to-red-500",
    "from-blue-400 via-purple-500 to-pink-500",
    "from-green-400 via-blue-500 to-purple-500",
    "from-yellow-400 via-red-500 to-pink-500",
    "from-indigo-400 via-purple-500 to-pink-500",
    "from-pink-400 via-red-500 to-yellow-500",
    "from-teal-400 via-cyan-500 to-blue-500",
    "from-orange-400 via-pink-500 to-red-500",
    "from-cyan-400 via-blue-500 to-purple-500",
    "from-lime-400 via-green-500 to-emerald-500",
    "from-rose-400 via-pink-500 to-purple-500",
    "from-amber-400 via-orange-500 to-red-500",
    "from-emerald-400 via-teal-500 to-cyan-500",
    "from-violet-400 via-purple-500 to-indigo-500",
    "from-sky-400 via-blue-500 to-indigo-500",
    "from-fuchsia-400 via-pink-500 to-rose-500"
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
      <div className="grid grid-cols-3 gap-2 w-full max-w-sm mx-auto mb-4">
        {Array.from({ length: totalImages }, (_, i) => (
          <div 
            key={i}
            className={`aspect-[4/5] bg-gradient-to-br ${gradients[i % gradients.length]} rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow`}
          >
            <Camera className="text-white text-lg" />
          </div>
        ))}
      </div>
      
      <h3 className="text-lg font-semibold text-slate-700 mb-1">{title}</h3>
      {instagramHandle && (
        <p className="text-sm text-slate-500 mb-2">{instagramHandle}</p>
      )}
      <p className="text-xs text-slate-400">
        3x3 grid • Widget successfully created and connected to Notion
      </p>
    </div>
  );
}
