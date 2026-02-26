import { BrowserRouter } from "react-router-dom";
import AppEntry from "./containers/AppEntry";
import AppRoutes from "./AppRoutes";

function App() {
  const buildDate = new Date(__APP_BUILD_DATE__).toLocaleDateString();

  return (
    <BrowserRouter>
      <div className="relative">
        <div className="absolute top-0 left-0 text-xs text-gray-500">
          Build Date👅: {buildDate}
        </div>
        <AppEntry>
          <AppRoutes />
        </AppEntry>
      </div>
    </BrowserRouter>
  );
}

export default App;
