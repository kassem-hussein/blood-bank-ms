import { BrowserRouter as Router,Routes, Route } from 'react-router-dom'
import { AddBloodUnit, AddDonor, AddTest, BloodUnits, Donors, EditBloodUnit, EditDonor, EditTest, Home, Login, ShowBloodUnit, ShowDonor, ShowTest, Tests,Imports,AddImport, ShowImport, EditImport, Exports, AddExport, ShowExport, EditExport, Users, AddUser, EditUser, ChangePassword, NotFound, ServerError, CheckBlood, ClientHome } from './pages'
import { Auth,Client,Guest } from './Layouts'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'
import { useSelector } from 'react-redux'
import './App.css'

function App() {
  const { isAuthenticated,user } = useSelector(state => state.user)
  return (
    <Router>
      <ToastContainer position="top-right" style={{fontFamily:'Cairo'}} autoClose={3000} />
      <Routes>
          {
            isAuthenticated ?
            <Route element= {<Auth/>}>
                <Route path='/' index  element={<Home/>}/>
                {
                  user.role == 'admin' || user.role == 'user'?
                  <>
                    <Route path='/blood-units'  element={<BloodUnits/>}/>
                    <Route path='/blood-units/new'  element={<AddBloodUnit/>}/>
                    <Route path='/blood-units/:id'  element={<ShowBloodUnit/>}/>
                    <Route path='/blood-units/:id/edit'  element={<EditBloodUnit/>}/> 
                    <Route path='/donors' element ={<Donors/>}/>
                    <Route path='/donors/new' element={<AddDonor/>}/>
                    <Route path='/donors/:id' element={<ShowDonor/>}/>
                    <Route path='/donors/:id/edit' element={<EditDonor/>}/>
                    <Route path='/imports' element={<Imports/>}/> 
                    <Route path='/imports/new' element={<AddImport/>}/>
                    <Route path='/imports/:id' element={<ShowImport/>} />
                    <Route path='/imports/:id/edit' element={<EditImport/>}/>
                    <Route path='/exports/' element={<Exports/>}/>
                    <Route path='/exports/new' element={<AddExport/>}/>
                    <Route path='/exports/:id' element={<ShowExport/>}/>
                    <Route path='/exports/:id/edit' element={<EditExport/>}/>
                  </> :''
                }
                
                {
                  user.role == 'admin' || user.role == 'doctor'?
                  <>
                    <Route path='/tests' element={<Tests/>}/>
                    <Route path='/tests/new' element={<AddTest/>}/>
                    <Route path='/tests/:id' element={<ShowTest/>}/>
                    <Route path='/tests/:id/edit' element={<EditTest/>}/>
                  </> :''
                }
               
                {
                  user.role == 'admin'?
                  <>
                    <Route path='/users' element={<Users/>} />
                    <Route path='/users/new' element={<AddUser/>} />
                    <Route path='/users/:id/edit' element={<EditUser/>} />
                  </> :''
                }
                <Route path='/change-password' element={<ChangePassword/>} />
            </Route>
            : 
            <Route element={<Guest/>}>
                <Route path='/login'  element={<Login/>}/>
            </Route>
          }

          <Route element={<Client/>}>
            <Route path='/'  element={<ClientHome/>}/>  
            <Route path='check-blood'  element={<CheckBlood/>}/>
            <Route path="/500" element={<ServerError />} />
            <Route path="*" element={<NotFound />} />
          </Route>
      </Routes>
    </Router>
  )
}

export default App
