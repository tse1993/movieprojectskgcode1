import { Eye, EyeOff, Film, Star, Users, Bookmark } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../assets/ui/card";
import { Button } from "../../assets/ui/button";
import { Input } from "../../assets/ui/input";
import { Label } from "../../assets/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../assets/ui/tabs";

/** @typedef {import("../../assets/types/pagesProps/loginViewProps").LoginViewProps} LoginViewProps */

/** @param {LoginViewProps & {
 *  error: string,
 *  isLoading: boolean,
 *  forgotPasswordMessage: string,
 *  onForgotPassword: () => void,
 *  onClearForgotMessage: () => void
 * }} props */
export default function LoginView({
  showPassword,
  onToggleShowPassword,
  loginForm,
  setLoginForm,
  registerForm,
  setRegisterForm,
  onLoginSubmit,
  onRegisterSubmit,
  features,
  error,
  isLoading,
  // NEW forgot password props
  forgotPasswordMessage,
  onForgotPassword,
  onClearForgotMessage,
}) {
  const iconMap = { Film, Star, Users, Bookmark };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Marketing Content */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start space-x-3">
              <img src="/Logo/skg_logo4.png" alt="MoviePulse Logo" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-medium leading-tight font-cursive" >
              Feel the pulse of movie!
            </h2>
            <p className="text-xl text-muted-foreground max-w-lg">
              Discover your next favorite film with curated movie recommendations, personalized watchlists, and detailed reviews.
              Start your cinematic journey today.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = iconMap[feature.icon] || Film;
              return (
                <div key={index} className="flex items-start space-x-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Benefits */}
          <div className="flex justify-center lg:justify-start space-x-8 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">✨</div>
              <div className="text-sm text-muted-foreground">Curated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">🎯</div>
              <div className="text-sm text-muted-foreground">Personalized</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">🚀</div>
              <div className="text-sm text-muted-foreground">Fast & Easy</div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle>Welcome to MoviePulse</CardTitle>
              <CardDescription>
                Sign in to your account or create a new one to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="register">Sign Up</TabsTrigger>
                </TabsList>

                {/* Login */}
                <TabsContent value="login" className="space-y-4 mt-6">
                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                      {error}
                    </div>
                  )}
                  <form onSubmit={onLoginSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginForm.email}
                        onChange={(e) => {
                          setLoginForm((prev) => ({ ...prev, email: e.target.value }));
                          onClearForgotMessage && onClearForgotMessage();
                        }}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={loginForm.password}
                          onChange={(e) =>
                            setLoginForm((prev) => ({ ...prev, password: e.target.value }))
                          }
                          required
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={onToggleShowPassword}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>

                  <div className="text-center">
                    <Button
                      variant="link"
                      size="sm"
                      type="button"
                      onClick={onForgotPassword}
                      disabled={isLoading}
                    >
                      Forgot your password?
                    </Button>
                    {forgotPasswordMessage && (
                      <p
                        className={`text-sm mt-2 ${
                          forgotPasswordMessage.includes("sent")
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {forgotPasswordMessage}
                      </p>
                    )}
                  </div>
                </TabsContent>

                {/* Register */}
                <TabsContent value="register" className="space-y-4 mt-6">
                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                      {error}
                    </div>
                  )}
                  <form onSubmit={onRegisterSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Full Name</Label>
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={registerForm.name}
                        onChange={(e) =>
                          setRegisterForm((prev) => ({ ...prev, name: e.target.value }))
                        }
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        value={registerForm.email}
                        onChange={(e) =>
                          setRegisterForm((prev) => ({ ...prev, email: e.target.value }))
                        }
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Create a password (min 6 characters)"
                        value={registerForm.password}
                        onChange={(e) =>
                          setRegisterForm((prev) => ({ ...prev, password: e.target.value }))
                        }
                        required
                        disabled={isLoading}
                        minLength={6}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password">Confirm Password</Label>
                      <Input
                        id="register-confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={registerForm.confirmPassword}
                        onChange={(e) =>
                          setRegisterForm((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                  <p className="text-xs text-center text-muted-foreground">
                    By creating an account, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}