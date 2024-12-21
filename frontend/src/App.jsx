import { Route, Routes } from "react-router-dom";
import "./App.css";
import Register from "./components/register/Register";
import Login from "./components/login/Login";
import Home from "./components/home/Home";
import NewJob from "./components/NewJob/NewJob.jsx";
import JobDesc from "./components/jobDesc/JobDesc";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/newJob" element={<NewJob />} />
        <Route path="/editJob/:id" element={<NewJob />} />
        <Route path="/jobDesc/:id" element={<JobDesc />} />
      </Routes>
    </>
  );
}

export default App;
