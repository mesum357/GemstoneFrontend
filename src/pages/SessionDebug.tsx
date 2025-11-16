import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, CheckCircle2, XCircle, AlertCircle, Cookie, Database, User, Globe, Settings } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { API_URL } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

interface SessionInfo {
  sessionId: string;
  sessionExists: boolean;
  isAuthenticated: boolean;
  user: {
    _id: string;
    email: string;
    role: string;
  } | null;
  cookieName: string;
  cookieOptions: {
    secure: boolean;
    httpOnly: boolean;
    sameSite: string;
    maxAge: number;
    expires: string | null;
    domain: string | null;
  } | null;
  requestHeaders: {
    origin: string;
    referer: string;
    'x-client-type': string;
    cookie: string;
  };
  environment: {
    nodeEnv: string;
    isRender: boolean;
    port: string;
    isProduction: boolean;
  };
  sessionStore: {
    type: string;
  };
  timestamp: string;
  setCookieHeader?: string;
  responseHeaders?: {
    'Set-Cookie': number;
    'Access-Control-Allow-Credentials': string | null;
    'Access-Control-Allow-Origin': string | null;
  };
  sessionData?: {
    cookie: {
      originalMaxAge: number;
      httpOnly: boolean;
      secure: boolean;
      sameSite: string;
      path?: string;
    } | null;
  };
}

const SessionDebug = () => {
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [sessionHistory, setSessionHistory] = useState<SessionInfo[]>([]);
  const { toast } = useToast();

  const fetchSessionInfo = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/auth/checksession`, {
        credentials: 'include',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.session) {
        setSessionInfo(data.session);
        setLastChecked(new Date());
        
        // Add to history (keep last 5)
        setSessionHistory(prev => [data.session, ...prev.slice(0, 4)]);
        
        toast({
          title: "Session Info Retrieved",
          description: "Successfully fetched session debugging information",
        });
      } else {
        throw new Error(data.message || 'Failed to fetch session info');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch session information';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-fetch on mount
    fetchSessionInfo();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      fetchSessionInfo();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatMaxAge = (ms: number) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${days}d ${hours}h ${minutes}m`;
  };

  const getSameSiteColor = (sameSite: string) => {
    if (sameSite === 'none') return 'bg-blue-500';
    if (sameSite === 'lax') return 'bg-yellow-500';
    if (sameSite === 'strict') return 'bg-red-500';
    return 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">Session Debug Dashboard</h1>
          <p className="text-muted-foreground">
            Detailed session and cookie debugging information
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex gap-4 items-center">
          <Button onClick={fetchSessionInfo} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Session Info
              </>
            )}
          </Button>
          {lastChecked && (
            <span className="text-sm text-muted-foreground">
              Last checked: {lastChecked.toLocaleTimeString()}
            </span>
          )}
        </div>

        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-5 h-5" />
                <p className="font-semibold">Error: {error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {sessionInfo && (
          <div className="grid gap-6">
            {/* Session Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Session Status
                </CardTitle>
                <CardDescription>Current session information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Session ID</p>
                    <p className="font-mono text-sm break-all">{sessionInfo.sessionId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Session Exists</p>
                    {sessionInfo.sessionExists ? (
                      <Badge className="bg-green-500">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Yes
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="w-3 h-3 mr-1" />
                        No
                      </Badge>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Authenticated</p>
                    {sessionInfo.isAuthenticated ? (
                      <Badge className="bg-green-500">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Yes
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="w-3 h-3 mr-1" />
                        No
                      </Badge>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Timestamp</p>
                    <p className="text-sm">{formatDate(sessionInfo.timestamp)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Information */}
            {sessionInfo.user && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    User Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="font-medium">{sessionInfo.user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Role</p>
                      <Badge>{sessionInfo.user.role}</Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">User ID</p>
                      <p className="font-mono text-sm">{sessionInfo.user._id}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cookie Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="w-5 h-5" />
                  Cookie Information
                </CardTitle>
                <CardDescription>Session cookie configuration and status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sessionInfo.setCookieHeader && (
                  <div className="mb-4 p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Set-Cookie Header (From Server)</p>
                    {sessionInfo.setCookieHeader === 'Not Set - This is the problem!' ? (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <p className="font-medium text-sm">⚠️ Cookie is NOT being set by server!</p>
                      </div>
                    ) : (
                      <div className="bg-background p-2 rounded border">
                        <p className="font-mono text-xs break-all">{sessionInfo.setCookieHeader}</p>
                      </div>
                    )}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Cookie Name</p>
                  <p className="font-mono text-sm">{sessionInfo.cookieName}</p>
                </div>

                {sessionInfo.cookieOptions && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Secure</p>
                      {sessionInfo.cookieOptions.secure ? (
                        <Badge className="bg-green-500">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          HTTPS Only
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Not Required
                        </Badge>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">HttpOnly</p>
                      {sessionInfo.cookieOptions.httpOnly ? (
                        <Badge className="bg-green-500">Enabled</Badge>
                      ) : (
                        <Badge variant="destructive">Disabled</Badge>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">SameSite</p>
                      <Badge className={getSameSiteColor(sessionInfo.cookieOptions.sameSite)}>
                        {sessionInfo.cookieOptions.sameSite || 'Not Set'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Max Age</p>
                      <p className="text-sm">{formatMaxAge(sessionInfo.cookieOptions.maxAge)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Expires</p>
                      <p className="text-sm">
                        {sessionInfo.cookieOptions.expires 
                          ? formatDate(sessionInfo.cookieOptions.expires)
                          : 'Not Set'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Domain</p>
                      <p className="text-sm font-mono">
                        {sessionInfo.cookieOptions.domain || 'Default (Current Domain)'}
                      </p>
                    </div>
                  </div>
                )}

                {sessionInfo.requestHeaders.cookie && sessionInfo.requestHeaders.cookie !== 'no cookies' && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Cookie Header (Raw)</p>
                    <div className="bg-muted p-3 rounded-md">
                      <p className="font-mono text-xs break-all">{sessionInfo.requestHeaders.cookie}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Request Headers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Request Headers
                </CardTitle>
                <CardDescription>HTTP headers sent with the request</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Origin</p>
                    <p className="text-sm font-mono">{sessionInfo.requestHeaders.origin || 'Not Set'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Referer</p>
                    <p className="text-sm font-mono break-all">{sessionInfo.requestHeaders.referer || 'Not Set'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">X-Client-Type</p>
                    <p className="text-sm">{sessionInfo.requestHeaders['x-client-type'] || 'Not Set'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Environment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Environment Information
                </CardTitle>
                <CardDescription>Server environment configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">NODE_ENV</p>
                    <Badge variant={sessionInfo.environment.nodeEnv === 'production' ? 'default' : 'secondary'}>
                      {sessionInfo.environment.nodeEnv}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Is Render</p>
                    {sessionInfo.environment.isRender ? (
                      <Badge className="bg-green-500">Yes</Badge>
                    ) : (
                      <Badge variant="secondary">No</Badge>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Port</p>
                    <p className="text-sm">{sessionInfo.environment.port || 'Not Set'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Is Production</p>
                    {sessionInfo.environment.isProduction ? (
                      <Badge className="bg-green-500">Yes</Badge>
                    ) : (
                      <Badge variant="secondary">No</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Session Store */}
            <Card>
              <CardHeader>
                <CardTitle>Session Store</CardTitle>
                <CardDescription>Session storage backend information</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Store Type</p>
                  <p className="text-sm font-mono">{sessionInfo.sessionStore.type}</p>
                </div>
              </CardContent>
            </Card>

            {/* Response Headers */}
            {sessionInfo.responseHeaders && (
              <Card>
                <CardHeader>
                  <CardTitle>Response Headers</CardTitle>
                  <CardDescription>CORS and cookie-related response headers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Set-Cookie Headers Count</p>
                      <p className="text-sm">{sessionInfo.responseHeaders['Set-Cookie'] || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Access-Control-Allow-Credentials</p>
                      <p className="text-sm">{sessionInfo.responseHeaders['Access-Control-Allow-Credentials'] || 'Not Set'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Access-Control-Allow-Origin</p>
                      <p className="text-sm font-mono break-all">{sessionInfo.responseHeaders['Access-Control-Allow-Origin'] || 'Not Set'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Session History */}
            {sessionHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Session History</CardTitle>
                  <CardDescription>Recent session checks (for persistence tracking)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sessionHistory.map((session, index) => (
                      <div key={index} className="border rounded-md p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Check #{sessionHistory.length - index}</span>
                          <span className="text-xs text-muted-foreground">{formatDate(session.timestamp)}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Session ID: </span>
                            <span className="font-mono">{session.sessionId.substring(0, 20)}...</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Authenticated: </span>
                            {session.isAuthenticated ? (
                              <Badge variant="default" className="text-xs">Yes</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">No</Badge>
                            )}
                          </div>
                          <div>
                            <span className="text-muted-foreground">User: </span>
                            <span>{session.user?.email || 'None'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Persistence Check */}
            {sessionHistory.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Session Persistence Analysis</CardTitle>
                  <CardDescription>Comparing session IDs across requests</CardDescription>
                </CardHeader>
                <CardContent>
                  {sessionHistory[0].sessionId === sessionHistory[1]?.sessionId ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="w-5 h-5" />
                      <p className="font-medium">✅ Session is persistent - Same session ID across requests</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="w-5 h-5" />
                      <p className="font-medium">⚠️ Session is NOT persistent - Different session IDs detected</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {!sessionInfo && !loading && !error && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No session information available. Click "Refresh Session Info" to fetch.
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SessionDebug;

