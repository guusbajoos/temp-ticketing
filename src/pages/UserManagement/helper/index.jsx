import { isEmpty } from 'lodash';

export const headerCsv = [
  { label: 'User Name', key: 'name' },
  { label: 'Email', key: 'email' },
  { label: 'Role', key: 'roles[0].name' },
  { label: 'Team', key: 'roles[0].teams[0].name' },
  { label: 'Status', key: 'isActive' },
];

export const statusOptions = [
  { label: 'Active', value: 'true' },
  { label: 'Not Active', value: 'false' },
];

/**
 * Return single value of teams
 * @param user has prop
 * {
 *     teams: [
 *         {
 *             name: ?
 *         }
 *     ]? (not mandatory),
 *     roles: [
 *         teams: [
 *             {
 *                 name: ?
 *             }
 *         ]
 *     ]
 * }
 * @return {string|*} name value of team or empty string if not match with the condition
 */
export const firstUserTeam = (user) => {
  if (!isEmpty(user.teams)) {
    return user.teams[0].name;
  }
  if (!isEmpty(user.roles) && !isEmpty(user.roles[0].teams)) {
    return user.roles[0].teams[0].name;
  }
  return '';
};
