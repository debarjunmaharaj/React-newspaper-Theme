
import { AdminLayout } from '@/components/Layout/AdminLayout';
import { SiteSettings as SiteSettingsComponent } from '@/components/Admin/SiteSettings';

const Settings = () => {
  return (
    <AdminLayout>
      <SiteSettingsComponent />
    </AdminLayout>
  );
};

export default Settings;
