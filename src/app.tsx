import "./index.css";
import theme from "./flowbite-theme";
import { Flowbite } from "flowbite-react";
import { Routes, Route, Navigate } from "react-router";
import DashboardPage from "./pages";
import SignInPage from "./pages/authentication/sign-in";
import SignUpPage from "./pages/authentication/sign-up";
import UserListPage from "./pages/users/list";
import AuthProvider from "./context/auth";
import { useCookies } from "react-cookie";
import EntriesPage from "./pages/records/entries";
import AllEntriesPage from "./pages/records/date-record";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
 
import AllManagerEntriesPage from "./pages/records/manager-records";
import ManagerEntriesPage from "./pages/records/managerEntries";
import ManagerDashboardPage from "./pages/managerDashboard";
import Loading from "./components/loading";
const App = () => {
  const [cookies]=useCookies();
  return (
   
    <AuthProvider>
    <ToastContainer />
    <Flowbite theme={{ theme }}>

        <Routes>
          <Route path="/" element={cookies['token']?<DashboardPage/>:<Navigate to="/auth/sign-in"/>} index />
          <Route path="/auth/sign-in" element={<SignInPage />} />
          <Route path="/auth/manager-dashboard" element={<ManagerDashboardPage />} />
          <Route path="/auth/sign-up" element={<SignUpPage />} />
          <Route path="/loading" element={<Loading />} />
          <Route
            path="/all-entries"
            element={<AllEntriesPage />}
          />
          <Route
            path="/all-manager"
            element={<AllManagerEntriesPage />}
          />
          <Route path='/entries-by-date/:date' element={<EntriesPage/>} />
          <Route path='/managerEntries-by-date/:date' element={<ManagerEntriesPage/>} />
          <Route path="/users/list" element={<UserListPage />} />
        </Routes>
      
    </Flowbite>
    </AuthProvider>
 
  )
}

export default App