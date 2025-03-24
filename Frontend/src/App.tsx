import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import HowItWorks from "./components/HowItWorks";
import routes from "tempo-routes";
import Resources from "./components/Resources";
import Practice from "./components/Practice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Lazy load the interview page
const Interview = lazy(() => import("./pages/interview"));

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/interview/:jobId" element={<Interview />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/practice" element={<Practice />} />
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        <ToastContainer
          position="top-right" // Position of the toast notifications
          autoClose={3000} // Auto-close after 3 seconds
          hideProgressBar={false} // Show progress bar
          newestOnTop={false} // Older toasts on top
          closeOnClick // Close toast on click
          rtl={false} // Left-to-right layout
          pauseOnFocusLoss // Pause auto-close when window loses focus
          draggable // Allow dragging to dismiss
          pauseOnHover // Pause auto-close on hover
          theme="light" // Use light theme (can also use "dark" or "colored")
        />
      </>
    </Suspense>
  );
}

export default App;
