
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { PrivateRouter } from './guards';
import { 
  HomePage, 
  Dashboard,
  LoginPage,
  OverviewAgenciesPage,
  CreateAgencyPage,
  AgencyPage,
  PanelAuditsPage,
  AuditPage,
  NotFoundPage,
} from './pages';

function App() {

  return (
    <>
      <Routes>
        <Route index element={ <HomePage /> } />
        <Route path='/login' element={ <LoginPage /> }/>

        <Route path='/admin/dashboard' element={ <PrivateRouter> <Dashboard/> </PrivateRouter> }/>

        <Route path='/admin/agencies/overview' element={ <PrivateRouter> <OverviewAgenciesPage/> </PrivateRouter> }/>
        <Route path='/admin/agencies/new' element={ <PrivateRouter> <CreateAgencyPage /> </PrivateRouter> }/>
        <Route path='/admin/agencies/:agencyId' element={ <PrivateRouter> <AgencyPage /> </PrivateRouter> }/>

        <Route path='/admin/audits' element={ <PrivateRouter> <PanelAuditsPage /> </PrivateRouter> }/>
        <Route path='/admin/audits/:activityId' element={<PrivateRouter> <AuditPage /> </PrivateRouter> } />

        <Route path='*' element={ <NotFoundPage /> } />
      </Routes>
    </>
  )
}

export default App
