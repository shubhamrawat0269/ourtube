import { Link } from "react-router-dom";

function App() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello world !</h1>
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
