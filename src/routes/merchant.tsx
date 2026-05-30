import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppLayout } from "@/layouts/AppLayout";

export const Route = createFileRoute("/merchant")({
  component: () => <AppLayout role="merchant"><Outlet /></AppLayout>,
});
