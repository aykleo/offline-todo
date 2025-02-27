import { ThemeProvider } from "./hooks/theme-provider";
import { requestPermissions } from "./lib/capacitor-notifications";
import TodoApp from "./todo/todo-main-page";

function App() {
  requestPermissions();

  return (
    <>
      <ThemeProvider>
        <TodoApp />
      </ThemeProvider>
    </>
  );
}

export default App;
