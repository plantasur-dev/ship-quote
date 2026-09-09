
import './App.css';
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { PrivateRouter } from './guards';
import { HomePage, NotFoundPage } from './pages';
import { LoadingScreen } from './components/ui';

const LoginPage = lazy(() => import('./pages/admin/auth/login-page'));
const Dashboard = lazy(() => import('./pages/admin/dashboard/dashboard-page'));
const OverviewAgenciesPage = lazy(() => import('./pages/admin/agencies/overview-agencies-page'));
const CreateAgencyPage = lazy(() => import('./pages/admin/agencies/create-agency-page'));
const AgencyPage = lazy(() => import('./pages/admin/agencies/agency-page'));
const PanelAuditsPage = lazy(() => import('./pages/admin/audits/panel-audits-page'));
const AuditPage = lazy(() => import('./pages/admin/audits/audit-page'));

const LoadingSuspense = () => (
  <div className="flex min-h-screen items-center justify-center">
    <LoadingScreen />
  </div>);

function App() {

  return (
    <Suspense fallback={ <LoadingSuspense /> }>
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
    </Suspense>
  )
}

export default App
