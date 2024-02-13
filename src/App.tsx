import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import TimeTracker from "./pages/TimeTracker";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { AuthProvider } from "./contexts/AuthProvider";
import { PrivateRoutes, PublicRoutes } from "./components/auth/PrivateRoutes";
export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicRoutes />}>
              <Route index element={<Home />} />
            </Route>
            <Route element={<PrivateRoutes />}>
              <Route path="/app" element={<TimeTracker />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
