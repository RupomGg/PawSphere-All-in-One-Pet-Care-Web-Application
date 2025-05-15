import { Children, StrictMode } from 'react'
import { createRoot, ReactDOM } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './component/Root/Root.jsx';
import Home from './component/Home/Home.jsx';
import Login from './component/Login/Login.jsx';
import Register from './component/Register/Register.jsx';
import Authprovider from './provider/Authprovider.jsx';
// import Projectlist from './component/Projectlist/Projectlist.jsx';
import InvestorDash from './component/Dashboard/UserHome.jsx';
import Investorprofile from './component/Profile/UserProfile.jsx';
// import EntrepreneurDash from './component/Dashboard/EntrepreneurDash.jsx';
// import Addproject from './component/Projectlist/Addproject.jsx';
// import Project from './component/Projectlist/Project.jsx';
// import View from './component/Projectlist/View.jsx';
// import EntroProjectView from './component/Projectlist/ViewEntroProject.jsx';
// import ViewEntroProject from './component/Projectlist/ViewEntroProject.jsx';
import StaffDash from './component/Dashboard/AdminHome.jsx';
import InvestorUpdate from './component/Profile/InvestorUpdate.jsx';
import Addpet from './component/Addpet/Addpet.jsx';
import Pets from './component/Addpet/Pets.jsx';
import PetDetails from './component/Addpet/PetDetails.jsx';
import UserHome from './component/Dashboard/UserHome.jsx';
import AdminHome from './component/Dashboard/AdminHome.jsx';
import UserProfile from './component/Profile/UserProfile.jsx';
import EditPetProfile from './component/Edit Pet Profile/editPetProfile.jsx';
import Notification from './component/Notification/Notification.jsx';
import Adoption from './component/Adoption/Adoption.jsx';
import LostOrfound from './component/LostOrFound/LostOrfound.jsx';
import Reviews from './component/Reviews/Reviews'; //rupom



const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    children: [
      { path: "/", element: <Home></Home> },
      { path: "/register", element: <Register></Register> },
      { path: "/login", element: <Login></Login> },
      // { path: "/projectlist", element: <Projectlist></Projectlist>, 
      //   // loader:() => fetch('http://localhost:3000/create-project')
      // },
      { path: "/admin-home", element: <AdminHome></AdminHome> },
      { path: "/user-home", element: <UserHome></UserHome> },
      { path: "/userprofile", element: <UserProfile></UserProfile> },
      { path: "/user-edit-profile", element: <InvestorUpdate></InvestorUpdate> },
      // { path: "/entrepreneur-dashboard", element: <EntrepreneurDash></EntrepreneurDash> },
      { path: "/addpet", element: <Addpet></Addpet> },
      { path: "/pets", element: <Pets></Pets> },
      { path: "/pet/:id", element: <PetDetails></PetDetails> },
      {
        path: '/edit-pet/:id',
        element: <EditPetProfile />

      },
      //  alvee
      {
        path: '/notification',
        element: <Notification></Notification>

      },
      { path: "/adoption", element: <Adoption></Adoption> },
      { path: "/lostorfound", element: <LostOrfound></LostOrfound> },
      // alvee end
      { path: "/reviews", element: <Reviews /> }, //rupom





      // { path: "/project", element: <Project></Project> },
      // { path: "/view/:id", element: <View></View> ,
      //   loader: async ({params}) => {
      //     try {
      //       const response = await fetch(`http://localhost:3000/create-project/${params.id}`);
      //       if (!response.ok) {
      //         throw new Error('Failed to fetch project data');
      //       }
      //       return response.json();
      //     } catch (error) {
      //       console.error(error);
      //       return { error: 'Failed to load project data' };
      //     }
      //   }

      // },
      // { path: "/entroprojectview/:id", element: <ViewEntroProject></ViewEntroProject> ,
      //   loader: async ({params}) => {
      //     try {
      //       const response = await fetch(`http://localhost:3000/edit-project/${params.id}`);
      //       if (!response.ok) {
      //         throw new Error('Failed to fetch project data');
      //       }
      //       return response.json();
      //     } catch (error) {
      //       console.error(error);
      //       return { error: 'Failed to load project data' };
      //     }
      //   }

      // },
    ],
  },

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Authprovider>
      <RouterProvider router={router} />
    </Authprovider>

  </StrictMode>,
)

