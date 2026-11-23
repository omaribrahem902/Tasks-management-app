import { Toaster } from "react-hot-toast";
import AppRoutes from "./AppRoutes";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <AppRoutes />
    </>
  );
}

export default App;
