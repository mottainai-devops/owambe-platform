import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import EventDetail from "./pages/EventDetail";
import Vendors from "./pages/Vendors";
import VendorDetail from "./pages/VendorDetail";
import Dashboard from "./pages/Dashboard";
import SocialEnhanced from "./pages/SocialEnhanced";
import Events from "./pages/Events";
import Venues from "./pages/Venues";
import Hotels from "./pages/Hotels";
import Social from "./pages/Social";
import MyBookings from "./pages/MyBookings";
import PartnerDashboard from "./pages/PartnerDashboard";
import SuperAdmin from "./pages/SuperAdmin";
import AgentDashboard from "./pages/AgentDashboard";
import Checkout from "./pages/Checkout";
import PaymentVerify from "./pages/PaymentVerify";
import VenueDetail from "./pages/VenueDetail";
import HotelDetail from "./pages/HotelDetail";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/events/:id" component={EventDetail} />
      <Route path="/venues/:id" component={VenueDetail} />
      <Route path="/hotels/:id" component={HotelDetail} />
      <Route path="/vendors" component={Vendors} />
      <Route path="/vendors/:id" component={VendorDetail} />
      <Route path={"/events"} component={Events} />
      <Route path={"/venues"} component={Venues} />
      <Route path={"/hotels"} component={Hotels} />
        <Route path="/social" component={SocialEnhanced} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path={"/bookings"} component={MyBookings} />      <Route path={"/partner"} component={PartnerDashboard} />
      <Route path={"/admin"} component={SuperAdmin} />
      <Route path={"/agent"} component={AgentDashboard} />
      <Route path="/checkout/:bookingId" component={Checkout} />
      <Route path="/payment/verify" component={PaymentVerify} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
