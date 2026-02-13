import AppEntry from "./containers/AppEntry";
import AppLayout from "./containers/AppLayout";
import Game from "./containers/game";

function App() {
  return (
    <AppLayout>
      <AppEntry>
        <Game />
      </AppEntry>
    </AppLayout>
  );
}

export default App;
