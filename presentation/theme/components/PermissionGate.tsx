import React from 'react';
import { AppPermission, usePermission } from '@/presentation/hooks/auth/usePermission';

interface PermissionGateProps {
  permission: AppPermission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  permission,
  children,
  fallback = null,
}) => {
  const { can } = usePermission();

  if (!can(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
