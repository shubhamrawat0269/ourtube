import { Link } from "react-router-dom";
import Navbar from "./components/custom/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Link to={`/signin`} className="pr-2 text-base underline">
        Login
      </Link>
      <Link to={`/signup`} className="pr-2 text-base underline">
        Register
      </Link>
    </>
  );
}

export default App;
