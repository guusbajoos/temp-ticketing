import { isEmpty } from 'lodash';
import { convertOptions } from '../../../../../utils';
import { buildSelectID, SelectType, stringSelectID } from './roleteam';

/**
 * Create select box compliance object
 * @param userRoles roles of user
 * @param rolesByTeam mapped of team has roles
 * @param teamList list of team
 * @param isTeamSelected flag set on parent component
 * @param roleBySelectedTeam selected team roles
 * @return {*[]}
 */
export const renderSelectBox = (
  userRoles,
  rolesByTeam,
  teamList,
  isTeamSelected,
  roleBySelectedTeam
) => {
  // let selectBoxes = [];
  if (isEmpty(userRoles) || isEmpty(rolesByTeam)) {
    return [];
  }
  let roleTeamSelectDatas = [];
  userRoles.forEach(function (userRole) {
    if (!isEmpty(userRole.teams)) {
      userRole.teams.forEach(function (team) {
        const teamSelectID = buildSelectID(team.id, SelectType.team);
        const roleSelectID = buildSelectID(team.id, SelectType.role);
        const roleKey = stringSelectID(roleSelectID);
        const roleTeamSelectData = {
          team: {
            selectID: teamSelectID,
            initialValue: team.name,
            options: convertOptions(teamList.currentElements, 'name'),
            id: team.id,
          },
          role: {
            id: userRole.id,
            selectID: roleSelectID,
            initialValue: !isTeamSelected ? userRole.name : undefined,
            options: !isEmpty(roleBySelectedTeam[roleKey])
              ? convertOptions(roleBySelectedTeam[roleKey], 'name')
              : [],
          },
        };
        roleTeamSelectDatas.push(roleTeamSelectData);
      });
    }
  });

  return roleTeamSelectDatas;
};
