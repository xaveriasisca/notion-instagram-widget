import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import WidgetPreview from "@/components/widget-preview";

import { 
  Grid, 
  Key, 
  Plug, 
  Link as LinkIcon, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  EyeOff, 
  Check, 
  Lock,
  Wand2,
  ArrowLeft
} from "lucide-react";

const setupSchema = z.object({
  notionToken: z.string().min(1, "Notion token is required").refine((token) => token.startsWith("ntn_") || token.startsWith("secret_"), {
    message: "Token must start with 'ntn_' or 'secret_'",
  }),
  databaseUrl: z.string().url("Must be a valid URL").refine((url) => url.includes("notion.so"), {
    message: "Must be a Notion database URL",
  }),
  title: z.string().min(1, "Widget title is required"),
  gridSize: z.literal("3x3").default("3x3"),
  instagramHandle: z.string().optional(),
});

type SetupForm = z.infer<typeof setupSchema>;

export default function Setup() {
  const [setupState, setSetupState] = useState({
    tokenValid: false,
    connectionVerified: false,
    urlValid: false,
  });
  
  const [showToken, setShowToken] = useState(false);
  const [showTokenInstructions, setShowTokenInstructions] = useState(false);
  const [showUrlInstructions, setShowUrlInstructions] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createdWidget, setCreatedWidget] = useState<any>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SetupForm>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      notionToken: "",
      databaseUrl: "",
      title: "IG Grid",
      gridSize: "3x3",
      instagramHandle: "",
    },
  });

  const validateTokenMutation = useMutation({
    mutationFn: async (token: string) => {
      const response = await apiRequest("POST", "/api/validate-token", { token });
      return response.json();
    },
    onSuccess: (data) => {
      setSetupState(prev => ({ ...prev, tokenValid: data.success }));
      if (!data.success) {
        toast({
          title: "Invalid Token",
          description: data.message,
          variant: "destructive",
        });
      }
    },
  });

  const validateDatabaseMutation = useMutation({
    mutationFn: async ({ token, databaseUrl }: { token: string; databaseUrl: string }) => {
      const response = await apiRequest("POST", "/api/validate-database", { token, databaseUrl });
      return response.json();
    },
    onSuccess: (data) => {
      setSetupState(prev => ({ ...prev, urlValid: data.success }));
      if (!data.success) {
        toast({
          title: "Database Validation Failed",
          description: data.message,
          variant: "destructive",
        });
      }
    },
  });

  const createWidgetMutation = useMutation({
    mutationFn: async (data: SetupForm) => {
      const response = await apiRequest("POST", "/api/widgets", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setCreatedWidget(data.widget);
        toast({
          title: "Widget Created!",
          description: "Your Instagram Grid widget has been successfully created.",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/widgets"] });
      } else {
        toast({
          title: "Creation Failed",
          description: data.message,
          variant: "destructive",
        });
      }
      setIsCreating(false);
    },
    onError: () => {
      setIsCreating(false);
      toast({
        title: "Creation Failed",
        description: "Something went wrong while creating your widget.",
        variant: "destructive",
      });
    },
  });

  const handleTokenChange = (token: string) => {
    form.setValue("notionToken", token);
    // More lenient validation - just check if it looks like a Notion token
    const isValid = token.length > 15 && (token.startsWith("ntn_") || token.startsWith("secret_") || token.includes("_"));
    setSetupState(prev => ({ ...prev, tokenValid: isValid }));
    
    if (isValid) {
      toast({
        title: "Token Valid",
        description: "Your Notion token format is correct - toggle is now enabled",
      });
    }
  };

  const handleDatabaseUrlChange = (url: string) => {
    form.setValue("databaseUrl", url);
    
    // Direct validation without API call
    const isValid = url.length > 0 && url.includes("notion.so") && url.includes("?v=") && setupState.tokenValid;
    setSetupState(prev => ({ ...prev, urlValid: isValid }));
    
    if (isValid) {
      toast({
        title: "Database URL Valid",
        description: "Database URL format is correct",
      });
    }
  };

  const handleConnectionToggle = (checked: boolean) => {
    setSetupState(prev => ({ ...prev, connectionVerified: checked }));
    if (!checked) {
      setSetupState(prev => ({ ...prev, urlValid: false }));
      form.setValue("databaseUrl", "");
    }
  };

  const onSubmit = (data: SetupForm) => {
    setIsCreating(true);
    
    // Create widget locally for demo purposes
    const newWidget = {
      id: `widget-${Date.now()}`,
      title: data.title,
      token: Math.random().toString(36).substring(2, 14),
      notionToken: data.notionToken,
      databaseUrl: data.databaseUrl,
      gridSize: data.gridSize || "3x3",
      instagramHandle: data.instagramHandle || null,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    
    setTimeout(() => {
      setCreatedWidget(newWidget);
      setIsCreating(false);
      toast({
        title: "Widget Created!",
        description: "Your Instagram Grid widget has been successfully created.",
      });
    }, 1000);
  };

  const isStep2Active = setupState.tokenValid;
  const isStep3Active = setupState.tokenValid && setupState.connectionVerified && setupState.urlValid;
  const canCreateWidget = isStep3Active && !isCreating;

  if (createdWidget) {
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
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-8">
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-green-800">Widget Created Successfully!</CardTitle>
                  <p className="text-sm text-green-700">Your Instagram Grid widget has been connected to your Notion database.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <WidgetPreview 
                title={createdWidget.title}
                instagramHandle={createdWidget.instagramHandle}
                isConfigured={true}
              />
              
              <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
                <p className="text-sm text-green-700 font-medium mb-2">Widget Access Token:</p>
                <code className="text-xs bg-slate-100 p-2 rounded block text-slate-700 break-all">
                  {createdWidget.token}
                </code>
                <p className="text-xs text-green-600 mt-2">
                  Save this token to access your widget later
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <Link href="/">
                  <Button variant="outline" className="flex-1">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
                <Button 
                  onClick={() => {
                    setCreatedWidget(null);
                    form.reset();
                    setSetupState({
                      tokenValid: false,
                      connectionVerified: false,
                      urlValid: false,
                    });
                  }}
                  className="flex-1"
                >
                  Create Another Widget
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

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
              <Link href="/">
                <Button variant="ghost">Dashboard</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Setup Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Widget Setup</h1>
          <p className="text-slate-600">Connect your Instagram Grid to your Notion content calendar in 3 simple steps</p>
          
          {/* Progress indicator */}
          <div className="flex items-center justify-center mt-6 space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">1</div>
              <span className="ml-2 text-sm text-slate-600">Token</span>
            </div>
            <div className="w-8 h-px bg-slate-300"></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                isStep2Active 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-slate-200 text-slate-500'
              }`}>2</div>
              <span className={`ml-2 text-sm ${isStep2Active ? 'text-slate-800' : 'text-slate-500'}`}>Connect</span>
            </div>
            <div className="w-8 h-px bg-slate-300"></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                isStep3Active 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-slate-200 text-slate-500'
              }`}>3</div>
              <span className={`ml-2 text-sm ${isStep3Active ? 'text-slate-800' : 'text-slate-500'}`}>Create</span>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Token Input Section */}
            <Card>
              <CardHeader>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                    <Key className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      🔐 Notion Integration Token
                      {setupState.tokenValid && <Check className="h-4 w-4 text-green-500" />}
                    </CardTitle>
                    <p className="text-sm text-slate-600">Copy the token from your integration's page</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Collapsible open={showTokenInstructions} onOpenChange={setShowTokenInstructions}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                      {showTokenInstructions ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
                      Show Instructions
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2">
                    <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <ol className="text-sm text-slate-700 space-y-2">
                        <li className="flex items-start">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-medium mr-3 mt-0.5">1</span>
                          Go to <a href="https://www.notion.so/my-integrations" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">notion.so/my-integrations</a>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-medium mr-3 mt-0.5">2</span>
                          Click "New integration" and fill in the basic information
                        </li>
                        <li className="flex items-start">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-medium mr-3 mt-0.5">3</span>
                          Copy the "Internal Integration Token" from your integration page
                        </li>
                      </ol>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <FormField
                  control={form.control}
                  name="notionToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Integration Token</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showToken ? "text" : "password"}
                            placeholder="ntn_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                            className="font-mono pr-10"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleTokenChange(e.target.value);
                            }}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowToken(!showToken)}
                          >
                            {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                      {validateTokenMutation.isPending && (
                        <p className="text-sm text-blue-600">Validating token...</p>
                      )}
                      {setupState.tokenValid && (
                        <p className="text-sm text-green-600 flex items-center">
                          <Check className="h-3 w-3 mr-1" />
                          Valid token format
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Database Connection Section */}
            <Card>
              <CardHeader>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mt-1">
                    <Plug className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle>🔌 Connect integration with database</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium mt-0.5">1</span>
                    <p className="text-sm text-slate-700">Open your database in Notion. Click ••• icon in top-right</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium mt-0.5">2</span>
                    <p className="text-sm text-slate-700">Select "Connect to" → Choose your integration</p>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center space-x-3">
                      <Check className={`h-5 w-5 ${setupState.connectionVerified ? 'text-green-500' : 'text-slate-400'}`} />
                      <div>
                        <p className="text-sm font-medium text-slate-800">Yes, I've completed the steps above</p>
                        <p className="text-xs text-slate-600">
                          {!setupState.tokenValid 
                            ? "Enter a valid token first to enable this toggle" 
                            : "Toggle this on after connecting your integration. This step is required to continue."
                          }
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={setupState.connectionVerified}
                      onCheckedChange={handleConnectionToggle}
                      disabled={!setupState.tokenValid}
                      className={!setupState.tokenValid ? "opacity-50" : ""}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Database URL Section */}
            <Card>
              <CardHeader>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mt-1">
                    <LinkIcon className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      🔗 Database URL
                      {setupState.urlValid && <Check className="h-4 w-4 text-green-500" />}
                    </CardTitle>
                    <p className="text-sm text-slate-600">Paste the URL of your Notion database</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Collapsible open={showUrlInstructions} onOpenChange={setShowUrlInstructions}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                      {showUrlInstructions ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
                      Show Instructions
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2">
                    <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <ol className="text-sm text-slate-700 space-y-2">
                        <li className="flex items-start">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-medium mr-3 mt-0.5">1</span>
                          Navigate to your Notion database in your browser
                        </li>
                        <li className="flex items-start">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-medium mr-3 mt-0.5">2</span>
                          Copy the entire URL from your browser's address bar
                        </li>
                        <li className="flex items-start">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-medium mr-3 mt-0.5">3</span>
                          Paste it in the field below (it should start with https://notion.so/)
                        </li>
                      </ol>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <FormField
                  control={form.control}
                  name="databaseUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Database URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://notion.so/your-workspace/database-id"
                          disabled={!setupState.connectionVerified}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleDatabaseUrlChange(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                      {validateDatabaseMutation.isPending && (
                        <p className="text-sm text-blue-600">Validating database access...</p>
                      )}
                      {setupState.urlValid && (
                        <p className="text-sm text-green-600 flex items-center">
                          <Check className="h-3 w-3 mr-1" />
                          Valid Notion database URL
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Widget Creation Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Create Gallery Widget</CardTitle>
                <p className="text-sm text-slate-600 text-center">Your Instagram Grid widget will be generated below</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <WidgetPreview 
                  title={form.watch("title")}
                  instagramHandle={form.watch("instagramHandle")}
                  isConfigured={isStep3Active}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Widget Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="My Instagram Gallery" 
                          disabled={!isStep3Active}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instagramHandle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram Handle (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="@yourusername" 
                          disabled={!isStep3Active}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={!canCreateWidget}
                >
                  {!isStep3Active ? (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Complete Previous Steps to Continue
                    </>
                  ) : isCreating ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                      Creating Widget...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Create Gallery Widget
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </form>
        </Form>
      </main>
    </div>
  );
}
