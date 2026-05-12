import Header from "./partials/Header";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <>
      <div className="app">
        <Header />
        <main className="main">
          <Outlet />
        </main>
      </div>
    </>
  );
}
