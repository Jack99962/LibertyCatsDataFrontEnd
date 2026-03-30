import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";

const Overview = lazy(() => import("./pages/Overview").then((m) => ({ default: m.Overview })));
const Holdings = lazy(() => import("./pages/Holdings").then((m) => ({ default: m.Holdings })));
const Activity = lazy(() => import("./pages/Activity").then((m) => ({ default: m.Activity })));
const Rankings = lazy(() => import("./pages/Rankings").then((m) => ({ default: m.Rankings })));

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Overview },
      { path: "holdings", Component: Holdings },
      { path: "activity", Component: Activity },
      { path: "rankings", Component: Rankings },
    ],
  },
]);