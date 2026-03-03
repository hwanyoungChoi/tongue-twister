import { RouterProvider } from "react-router-dom";
import router from "./router";
import AppEntry from "./containers/AppEntry";

function App() {
  const buildDate = new Date(__APP_BUILD_DATE__).toLocaleDateString();

  return (
    <AppEntry>
      {/* AppEntry wraps the entire routed application */}
      <div className="relative">
        <div className="absolute top-0 right-0 text-xs text-gray-500 z-100 font-one-pop">
          Ver. {buildDate}
        </div>
        <RouterProvider router={router} />{" "}
        {/* All routes are now under RouterProvider */}
      </div>
    </AppEntry>
  );
}

export default App;
