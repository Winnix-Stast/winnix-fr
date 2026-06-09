import { useAuthStore } from "@/presentation/auth/store/useAuthStore";

export type AppPermission =
  | "create:tournament"
  | "read:tournament"
  | "update:tournament"
  | "delete:tournament"
  | "create:tournament-edition"
  | "read:tournament-edition"
  | "update:tournament-edition"
  | "delete:tournament-edition"
  | "manage:tournament_teams"
  | "create:team"
  | "read:team"
  | "update:team"
  | "delete:team"
  | "create:match"
  | "read:match"
  | "update:match"
  | "delete:match"
  | "create:inscription"
  | "read:inscription"
  | "update:inscription"
  | "delete:inscription"
  | "request:inscription"
  | "sponsor:tournament"
  | "join:team"
  | "manage:sports"
  | (string & {});

export const usePermission = () => {
  const { user, activeRole } = useAuthStore();

  const can = (permission: AppPermission): boolean => {
    if (!user || !activeRole || !user.roleEntities) return false;

    // Buscar la entidad de rol correspondiente al rol activo
    const activeRoleEntity = user.roleEntities.find(
      (role: any) => role.name === activeRole
    );

    if (!activeRoleEntity || !activeRoleEntity.permissions) return false;

    // Comprobar si el nombre del permiso buscado existe en la lista de permisos de este rol
    return activeRoleEntity.permissions.some(
      (p: any) => p.name === permission
    );
  };

  const canAll = (permissions: AppPermission[]): boolean => {
    return permissions.every((p) => can(p));
  };

  const canAny = (permissions: AppPermission[]): boolean => {
    return permissions.some((p) => can(p));
  };

  return {
    can,
    canAll,
    canAny,
    activeRole,
  };
};
