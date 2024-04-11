import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import TimeTracker from "./pages/TimeTracker";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { AuthProvider } from "./contexts/AuthProvider";
import { PrivateRoutes, PublicRoutes } from "./components/auth/PrivateRoutes";
import Uncompleted from "./pages/Uncompleted";
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
              <Route path="/main" element={<TimeTracker />} />
              <Route path="/uncompleted" element={<Uncompleted />} />
            </Route>
            <Route path="*" element={<h1>not found</h1>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
