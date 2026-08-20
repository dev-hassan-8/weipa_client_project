import { Navigate } from 'react-router-dom';

export default function BackofficeIndex() {
  return <Navigate to="/admin/dashboard" replace />;
}
