import { Navigate, Route, Routes } from 'react-router';
import { Header } from './components/Header/Header';
import { MainNav } from './components/MainNav/MainNav';
import { CURRENT_CUSTOMER_ID } from './config/constants';
import { ROUTES } from './config/routes';
import { LoanEstimatorPage } from './pages/LoanEstimatorPage/LoanEstimatorPage';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';
import { SpendingInsightsPage } from './pages/SpendingInsightsPage/SpendingInsightsPage';
import { useGetCustomerProfileQuery } from './services/spendingApi';
import { Footer, Main } from './App.styles';

export default function App() {
  const { data: profile } = useGetCustomerProfileQuery(CURRENT_CUSTOMER_ID);

  return (
    <>
      <Header customerName={profile?.name} navigation={<MainNav />} />
      <Main>
        <Routes>
          <Route path="/" element={<Navigate to={ROUTES.spendingInsights} replace />} />
          <Route path={ROUTES.spendingInsights} element={<SpendingInsightsPage customerId={CURRENT_CUSTOMER_ID} />} />
          <Route path={ROUTES.loanEstimator} element={<LoanEstimatorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Main>
      <Footer>Concept project for a job application. All data is mocked; not affiliated with Capitec Bank.</Footer>
    </>
  );
}
