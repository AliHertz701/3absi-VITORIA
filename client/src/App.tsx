// App.tsx
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import About from "@/pages/About";
import Contact from "./pages/Contact";
import Faq from "./pages/Faq";
import Terms from "./pages/Terms";
import AdminLogin from './pages/login';
import AdminDashboard from './pages/Dashboard';
import Unauthorized from './pages/Unauthorized';
import AdminLayout from './layouts/AdminLayout';
import AdminProducts from './pages/AdminProducts'; // Add this import
import AdminOrders from "./pages/AdminOrders";
import BannerAdminPage from "./pages/BannerAdminPage";
import Categories from "./pages/Categories";
import AdminAnalytics from "./pages/Analytics";
// Import providers
import { LocaleProvider } from "@/contexts/LocaleContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Switch>
          {/* Public routes */}
          <Route path="/" component={Home} />
          <Route path="/shop" component={Shop} />
          <Route path="/eras" component={Shop} />
          <Route path="/product/:id" component={ProductDetail} />
          <Route path="/cart" component={Cart} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/faq" component={Faq} />
          <Route path="/terms" component={Terms} />
          <Route path="/admin/login" component={AdminLogin} />

          {/* Admin routes */}
          <Route path="/unauthorized" component={Unauthorized} />
          
          {/* Protected admin routes with AdminLayout */}
          <Route path="/admin/dashboard">
            {() => (
              <ProtectedRoute adminOnly>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            )}
          </Route>
          
          <Route path="/admin/products">
            {() => (
              <ProtectedRoute adminOnly>
                <AdminLayout>
                  <AdminProducts /> {/* Updated to use AdminProducts */}
                </AdminLayout>
              </ProtectedRoute>
            )}
          </Route>
          
          <Route path="/admin/orders">
            {() => (
              <ProtectedRoute adminOnly>
                <AdminLayout>
                <AdminOrders />
                </AdminLayout>
              </ProtectedRoute>
            )}
          </Route>
          
          <Route path="/admin/banners/new">
            {() => (
              <ProtectedRoute adminOnly>
                <AdminLayout>
                  <BannerAdminPage />
                </AdminLayout>
              </ProtectedRoute>
            )}
          </Route>
          
          <Route path="/admin/analytics">
            {() => (
              <ProtectedRoute adminOnly>
                <AdminLayout>
                  <AdminAnalytics />
                </AdminLayout>
              </ProtectedRoute>
            )}
          </Route>
          
          <Route path="/admin/categories">
            {() => (
              <ProtectedRoute adminOnly>
                <AdminLayout>
                  <Categories />
                </AdminLayout>
              </ProtectedRoute>
            )}
          </Route>
          
          <Route path="/admin/profile">
            {() => (
              <ProtectedRoute adminOnly>
                <AdminLayout>
                  <div>Profile</div>
                </AdminLayout>
              </ProtectedRoute>
            )}
          </Route>

          {/* Catch all */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LocaleProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LocaleProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;