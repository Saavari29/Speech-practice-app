import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Uploads from './pages/Uploads';
import Analysis from './pages/Analysis';
import History from './pages/History';
import Layout from "./components/Layout";

function App(){
  return(
    <BrowserRouter>
    <Routes>
      <Route path= "/" element= {<Login />} />
      <Route path= "/login" element= {<Login />} />
      <Route path= "/signup" element= {<Signup />} />
      <Route path= "/uploads" element= {<Layout> <Uploads/></Layout>} />
      <Route path= "/analysis/:speechId" element= {<Layout> <Analysis/></Layout>} />
      <Route path="/history" element={<Layout><History/></Layout>} />

    </Routes>
    </BrowserRouter>
  );
}

export default App;