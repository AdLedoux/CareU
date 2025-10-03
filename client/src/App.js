import { Route, Routes } from "react-router-dom";
import NotFound from "./pages/notFound/NotFound";
import Home from "./pages/home/home";
import Layout from "./componenets/layout/layout";
import Login from "./pages/login/login";


function App() {
  return (
    <Routes>
      {/* these are inner pages, to get in here, you have to be authenticated */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
      </Route>

      {/* this is outer pages, user can see it whithout authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
