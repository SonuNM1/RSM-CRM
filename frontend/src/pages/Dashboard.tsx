import DashboardLayout from '@/components/DashboardLayout'
import { useAuth } from '@/context/AuthContext'
import React from 'react'
import SuperAdminDashboard from './Dashboard/SuperAdminDashboard';
import AdminDashboard from './Dashboard/AdminDashboard';
import EmailDashboard from './Dashboard/EmailDashboard';
import BdeDashboard from './Dashboard/BdeDashboard';
import FullPageLoader from '@/components/FullPageLoader';
import { title } from 'process';

const Dashboard = () => {

  const {user, loading} = useAuth() ; 

  if(loading){
    return <FullPageLoader/>
  }

  if(!user) return null ; 

  let DashboardComponent ; 

  switch(user.role) {
     case "Super_Admin":
      DashboardComponent = <SuperAdminDashboard />;
      break ;

    case "Admin":
      DashboardComponent = <AdminDashboard />;
      break ;

    case "Email_Executive":
      DashboardComponent = <EmailDashboard />;
      break ;

    case "BDE_Executive":
      DashboardComponent = <BdeDashboard />;
      break ; 

    default: 
      return <div>Unauthorized</div>
  }

  return (
    <DashboardLayout title="Dashboard">
      {DashboardComponent}
    </DashboardLayout>
  )
}

export default Dashboard
