import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { Overview } from "./pages/Overview";
import { Holdings } from "./pages/Holdings";
import { Activity } from "./pages/Activity";
import { Rankings } from "./pages/Rankings";

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