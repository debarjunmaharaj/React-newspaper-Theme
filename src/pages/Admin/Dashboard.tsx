
import { AdminLayout } from '@/components/Layout/AdminLayout';
import { Dashboard as DashboardComponent } from '@/components/Admin/Dashboard';

const Dashboard = () => {
  return (
    <AdminLayout>
      <DashboardComponent />
    </AdminLayout>
  );
};

export default Dashboard;
