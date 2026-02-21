import AppEntry from "./containers/AppEntry";
import AppLayout from "./containers/AppLayout";
import Game from "./containers/game";

function App() {
  const buildDate = new Date(__APP_BUILD_DATE__).toLocaleDateString();

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 text-xs text-gray-500">
        Build Date👅: {buildDate}
      </div>
      <AppLayout>
        <AppEntry>
          <Game />
        </AppEntry>
      </AppLayout>
    </div>
  );
}

export default App;
