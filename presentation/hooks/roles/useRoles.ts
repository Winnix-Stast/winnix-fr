import { AuthAdapter, Role } from "@/core/auth/auth.adapter";
import { createQueryKeyFactory, QUERY_PRESETS, useQueryAdapter } from "@/helpers/adapters/queryAdapter";

export const rolesKeys = createQueryKeyFactory("roles");

export const useRoles = () => {
    return useQueryAdapter<Role[], Error>(
        rolesKeys.lists(),
        AuthAdapter.getRoles,
        {
            ...QUERY_PRESETS.SEMI_STATIC,
        }
    );
};
