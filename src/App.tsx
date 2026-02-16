import AppEntry from "./containers/AppEntry";
import AppLayout from "./containers/AppLayout";
import Game from "./containers/game";

function App() {
  const buildDate = new Date(__APP_BUILD_DATE__).toLocaleString();

  return (
    <div className="relative">
      <div className="absolute bottom-2 left-2 text-xs text-gray-500">
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
