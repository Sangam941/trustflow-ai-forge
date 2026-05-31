import { createBrowserRouter, Outlet } from "react-router-dom";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AppLayout } from "@/layouts/AppLayout";

// Public pages
import HomePage from "@/pages/public/HomePage";
import AboutPage from "@/pages/public/AboutPage";
import FeaturesPage from "@/pages/public/FeaturesPage";
import LoginPage from "@/pages/public/LoginPage";
import RegisterPage from "@/pages/public/RegisterPage";
import OnboardingPage from "@/pages/public/OnboardingPage";

// Merchant pages
import MerchantDashboardPage from "@/pages/merchant/DashboardPage";
import CreditScorePage from "@/pages/merchant/CreditScorePage";
import PayBillsPage from "@/pages/merchant/PayBillsPage";
import LoanApplicationPage from "@/pages/merchant/LoanApplicationPage";
import AiCoachPage from "@/pages/merchant/AiCoachPage";
import ProfilePage from "@/pages/merchant/ProfilePage";

// Admin pages
import AdminDashboardPage from "@/pages/admin/DashboardPage";
import MerchantsPage from "@/pages/admin/MerchantsPage";
import MerchantDetailsPage from "@/pages/admin/MerchantDetailsPage";
import LoanReviewsPage from "@/pages/admin/LoanReviewsPage";
import PortfolioPage from "@/pages/admin/PortfolioPage";
import RiskAnalysisPage from "@/pages/admin/RiskAnalysisPage";
import SettingsPage from "@/pages/admin/SettingsPage";

import NotFoundPage from "@/pages/public/NotFoundPage";

export const router = createBrowserRouter([
  // Public pages with PublicLayout (header + footer)
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/features", element: <FeaturesPage /> },
    ],
  },

  // Auth pages (no shared layout wrapper)
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/onboarding", element: <OnboardingPage /> },

  // Merchant portal
  {
    path: "/merchant",
    element: <AppLayout role="merchant" />,
    children: [
      { path: "dashboard", element: <MerchantDashboardPage /> },
      { path: "credit-score", element: <CreditScorePage /> },
      { path: "pay-bills", element: <PayBillsPage /> },
      { path: "loan-application", element: <LoanApplicationPage /> },
      { path: "ai-coach", element: <AiCoachPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },

  // Admin portal
  {
    path: "/admin",
    element: <AppLayout role="admin" />,
    children: [
      { path: "dashboard", element: <AdminDashboardPage /> },
      { path: "merchants", element: <MerchantsPage /> },
      { path: "merchant-details/:id", element: <MerchantDetailsPage /> },
      { path: "loan-reviews", element: <LoanReviewsPage /> },
      { path: "portfolio", element: <PortfolioPage /> },
      { path: "risk-analysis", element: <RiskAnalysisPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },

  // 404 fallback
  { path: "*", element: <NotFoundPage /> },
]);
