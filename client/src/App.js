import { Route, Routes } from "react-router-dom";
import Layout from "./componenets/layout/layout";

import Home from "./pages/home/home";

import Login from "./pages/login/login";
import Register from "./pages/register/register";
import NotFound from "./pages/notFound/NotFound";

function App() {
  return (
    <Routes>
      {/* these are inner pages, to get in here, you have to be authenticated */}
      <Route path="/home" element={<Layout />}>
        <Route index element={<Home />} />
      </Route>

      {/* this is outer pages, user can see it whithout authentication */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
