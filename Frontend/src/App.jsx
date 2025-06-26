import "./App.css";
import ApplyForm from "./pages/Applyform";
import Applyjob from "./pages/Applynow";
import Resume from "./pages/Resume";
import { Approute } from "./routes/Approute";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <main className="">
      {/* <Applyjob/> */}
      {/* <ApplyForm/> */}
      <Toaster/>
      <Approute/>
      {/* <Resume/> */}
    </main>
  );
}

export default App;
