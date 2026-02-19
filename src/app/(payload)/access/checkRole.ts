import { Access, Where } from 'payload';

/**
 * Role Checkers
 */
export const isAdmin = (user: any) => user?.role === 'admin' || user?.role === 'manager';
export const isProjectAdmin = (user: any) => user?.role === 'project-admin';
export const isProjectManager = (user: any) => user?.role === 'project-manager';
export const isProjectStaff = (user: any) => isProjectAdmin(user) || isProjectManager(user);

/**
 * 1. God Mode: YPSL Admins and Managers
 * Full access to everything.
 */
export const isYPSLAdmin: Access = ({ req: { user } }) => {
  return isAdmin(user);
};

/**
 * 2. User Management Access
 * YPSL Admins can manage everyone.
 * Project Admins can only manage Project Managers within their own project.
 */
export const canManageUsers: Access = ({ req: { user } }) => {
  if (isAdmin(user)) return true;
  if (isProjectAdmin(user)) return true;
  return false;
};

/**
 * 3. User Collection Filter (Row-Level Security)
 * YPSL Admins see everyone.
 * Project Admins see ONLY Project Managers of their assigned project.
 */
export const filterUsersByProject: Access = ({ req: { user } }) => {
  if (isAdmin(user)) return true;

  if (user) {
    const conditions: Where[] = [
      {
        id: {
          equals: user.id,
        },
      },
    ];

    if (isProjectAdmin(user) && user?.project) {
      conditions.push({
        and: [
          {
            project: {
              equals: user.project,
            },
          },
          {
            role: {
              equals: 'project-manager',
            },
          },
        ],
      });
    }

    return {
      or: conditions,
    };
  }

  return false;
};

/**
 * 4. General Content Filter (Events, Blog, etc.)
 * YPSL Admins see everything.
 * Project staff see only their own project data.
 */
export const filterByProject: Access = ({ req: { user } }) => {
  if (isAdmin(user)) return true;

  if (user?.project && isProjectStaff(user)) {
    return {
      project: {
        equals: user.project,
      },
    };
  }

  return false;
};

/**
 * Sidebar Hidden Helpers
 */
export const hideIfNotAdmin = ({ user }: { user: any }) => !isAdmin(user);
export const hideIfProjectStaff = ({ user }: { user: any }) => isProjectStaff(user);
export const hideIfProjectManager = ({ user }: { user: any }) => isProjectManager(user);
export const canSeeUserManagement = ({ user }: { user: any }) => isAdmin(user) || isProjectAdmin(user);