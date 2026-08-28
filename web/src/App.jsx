
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { PrivateRouter } from './guards';
import { 
  Dashboard, 
  DashboardAdmin,
  LoginPage,
  AgenciesPage,
  OverviewAgenciesPage,
  CreateAgencyPage,
  UpdateAgencyPage,
  NotFoundPage
} from './pages';

function App() {

  return (
    <>
      <Routes>
        <Route index element={ <Dashboard /> } />
        <Route path='/login' element={ <LoginPage /> }/>

        <Route path='/admin/dashboard' element={ <PrivateRouter> <DashboardAdmin/> </PrivateRouter> }/>

        <Route path='/admin/agencies' element={ <PrivateRouter> <AgenciesPage/> </PrivateRouter> }/>
        <Route path='/admin/agencies/overview' element={ <PrivateRouter> <OverviewAgenciesPage/> </PrivateRouter> }/>
        <Route path='/admin/agencies/new' element={ <PrivateRouter> <CreateAgencyPage /> </PrivateRouter> }/>
        <Route path='/admin/agencies/:agencyId/update' element={ <PrivateRouter> <UpdateAgencyPage /> </PrivateRouter> }/>

        <Route path='*' element={ <NotFoundPage /> } />
      </Routes>
    </>
  )
}

export default App
