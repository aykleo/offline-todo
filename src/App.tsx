import { ThemeProvider } from "./hooks/theme-provider";
import TodoApp from "./todo/todo-main-page";

function App() {
  return (
    <>
      <ThemeProvider>
        <TodoApp />
      </ThemeProvider>
    </>
  );
}

export default App;
