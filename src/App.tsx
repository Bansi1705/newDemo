import { RouterProvider } from "react-router-dom";
import "./App.css";
import "./Context/ThemeContext.css";
import { Routing } from "./Components/Routing";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./Context/ThemeContext";

function App() {
  return (
    <>
      <ThemeProvider>
        <RouterProvider router={Routing} />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          rtl={false}
          pauseOnFocusLoss={true}
          draggable={true}
          pauseOnHover={true}
          theme="colored"
        />
      </ThemeProvider>
    </>
  );
}
export default App;
