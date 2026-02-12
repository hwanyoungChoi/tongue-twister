import AppEntry from "./containers/AppEntry";
import AppLayout from "./containers/AppLayout";

function App() {
  return (
    <AppLayout>
      <AppEntry>
        <main>
          <h1 className="text-3xl font-one-pop">궁중 숭늉 중</h1>
        </main>
      </AppEntry>
    </AppLayout>
  );
}

export default App;
