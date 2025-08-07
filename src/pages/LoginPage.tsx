import React, { useState } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff, Bus, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { defaultCredentials } from '@/lib/mock-data';

export default function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');


  // Redirect based on user role after login
  if (isAuthenticated && user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (user.role === 'customer') {
      return <Navigate to="/bookings" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      toast({
        title: 'Success!',
        description: 'You have been logged in successfully.',
      });
    } catch (error) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (type: 'admin' | 'customer') => {
    const credentials = defaultCredentials[type];
    setEmail(credentials.email);
    setPassword(credentials.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-bus-accent/5 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="p-3 bg-primary rounded-xl">
              <Bus className="h-8 w-8 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold gradient-text">KamerWays</span>
          </Link>
          <h1 className="text-2xl font-bold">{t('auth.login')}</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to your account to access your bookings and more
          </p>
        </div>

        {/* Quick Login Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:shadow-brand transition-all" onClick={() => quickLogin('admin')}>
            <CardContent className="p-4 text-center">
              <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="font-medium text-sm">{t('auth.adminLogin')}</p>
              <p className="text-xs text-muted-foreground">admin@kamerways.com</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-brand transition-all" onClick={() => quickLogin('customer')}>
            <CardContent className="p-4 text-center">
              <User className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="font-medium text-sm">{t('auth.customerLogin')}</p>
              <p className="text-xs text-muted-foreground">john.doe@email.com</p>
            </CardContent>
          </Card>
        </div>

        {/* Login Form */}
        <Card className="shadow-brand-medium">
          <CardHeader>
            <CardTitle>{t('auth.login')}</CardTitle>
            <CardDescription>
              Enter your credentials below to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : t('auth.loginButton')}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Demo Credentials:</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Admin:</span> admin@kamerways.com / admin123
              </div>
              <div>
                <span className="font-medium">Customer:</span> john.doe@email.com / customer123
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}