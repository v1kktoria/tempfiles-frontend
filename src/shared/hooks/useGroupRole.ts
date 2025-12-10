import { useAppDispatch, useAppSelector } from "./hooks";
import { fetchMyRoleInGroup } from "../../store/slices/groupSlice";
import { useEffect } from "react";

export const useGroupRole = (groupId?: string) => {
  const dispatch = useAppDispatch();
  const { userRoles } = useAppSelector((s) => s.groups);

  useEffect(() => {
    if (groupId && !userRoles[groupId]) {
      dispatch(fetchMyRoleInGroup(groupId));
    }
  }, [groupId, userRoles, dispatch]);

  if (!groupId) {
    return {
      role: null,
      isAdmin: false,
      isLoading: false,
    };
  }

  const role = userRoles[groupId];
  const isAdmin = role === "GROUP_ADMIN";

  return {
    role,
    isAdmin,
    isLoading: !role,
  };
};
