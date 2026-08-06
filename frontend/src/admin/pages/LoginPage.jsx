import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Music, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useAuth } from '../AuthContext';
import { errorMessage } from '../../lib/api';

const LoginPage = () => {
  const { user, checking, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
      </div>
    );
  }

  // Already signed in - go where they were headed, or to the dashboard.
  if (user) {
    return <Navigate to={location.state?.from || '/admin'} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await signIn(email, password);
      navigate(location.state?.from || '/admin', { replace: true });
    } catch (err) {
      setError(errorMessage(err, 'Could not sign in.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center mx-auto mb-5">
            <Music className="w-7 h-7 text-[#0a0a0a]" />
          </div>
          <h1 className="font-display text-2xl text-[#f5f5f0]">Content Manager</h1>
          <p className="text-[#f5f5f0]/40 text-sm mt-1">
            Sign in to update your website
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-[#151515] border border-[#f5f5f0]/5 p-6 space-y-5"
        >
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 p-3 rounded-lg bg-red-500/10 border border-red-500/30"
            >
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <div>
            <Label
              htmlFor="email"
              className="text-[#f5f5f0]/70 font-mono text-xs tracking-wider uppercase mb-2 block"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#0a0a0a] border-[#f5f5f0]/10 text-[#f5f5f0] h-11"
            />
          </div>

          <div>
            <Label
              htmlFor="password"
              className="text-[#f5f5f0]/70 font-mono text-xs tracking-wider uppercase mb-2 block"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#0a0a0a] border-[#f5f5f0]/10 text-[#f5f5f0] h-11"
            />
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-amber-500 hover:bg-amber-400 text-[#0a0a0a] h-11 font-mono text-xs tracking-wider uppercase"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
