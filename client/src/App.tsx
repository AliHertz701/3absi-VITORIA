// App.tsx
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";

// Pages
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
import AdminProducts from './pages/AdminProducts';
import AdminOrders from "./pages/AdminOrders";
import BannerAdminPage from "./pages/BannerAdminPage";
import Categories from "./pages/Categories";
import AdminAnalytics from "./pages/Analytics";

// Context providers
import { LocaleProvider } from "@/contexts/LocaleContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

function Router() {
  return (
    <Switch>

      {/* ===================== PUBLIC ROUTES ===================== */}
      <Route path="/" component={() => (
        <PublicLayout><Home /></PublicLayout>
      )} />

      <Route path="/shop" component={() => (
        <PublicLayout><Shop /></PublicLayout>
      )} />
      <Route path="/eras" component={() => (
        <PublicLayout><Shop /></PublicLayout>
      )} />

      <Route path="/product/:id" component={(props) => (
        <PublicLayout><ProductDetail {...props} /></PublicLayout>
      )} />

      <Route path="/cart" component={() => (
        <PublicLayout><Cart /></PublicLayout>
      )} />
      <Route path="/checkout" component={() => (
        <PublicLayout><Checkout /></PublicLayout>
      )} />

      <Route path="/about" component={() => (
        <PublicLayout><About /></PublicLayout>
      )} />
      <Route path="/contact" component={() => (
        <PublicLayout><Contact /></PublicLayout>
      )} />
      <Route path="/faq" component={() => (
        <PublicLayout><Faq /></PublicLayout>
      )} />
      <Route path="/terms" component={() => (
        <PublicLayout><Terms /></PublicLayout>
      )} />

      {/* Admin login (public) */}
      <Route path="/admin/login" component={AdminLogin} />

      {/* ===================== ADMIN ROUTES ===================== */}
      <Route path="/unauthorized" component={Unauthorized} />

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
              <AdminProducts />
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

      {/* ===================== CATCH ALL ===================== */}
      <Route component={() => <PublicLayout><NotFound /></PublicLayout>} />

    </Switch>
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
