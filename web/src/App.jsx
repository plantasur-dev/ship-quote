
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { PrivateRouter } from './guards';
import { 
  Dashboard, 
  DashboardAdmin,
  LoginPage,
  AgenciesPage
} from './pages';

function App() {

  return (
    <>
      <Routes>
        <Route index element={ <Dashboard /> } />
        <Route path='/login' element={ <LoginPage /> }/>

        <Route path='/admin' element={ <PrivateRouter> <DashboardAdmin/> </PrivateRouter> }/>
        <Route path='/admin/agencies' element={ <PrivateRouter> <AgenciesPage/> </PrivateRouter> }/>
      </Routes>
    </>
  )
}

export default App
