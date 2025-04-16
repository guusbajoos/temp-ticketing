import _, { isEmpty } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

/**
 * SelectID separator to separate betweeen
 * [PREFIX], [team.ID], [RANDOM VALUE]
 * @type {string}
 */
const SelectIDSeparator = '__';
const SelectIDPrefix = {
  team: 'team_select_id',
  role: 'role_select_id',
};

/**
 * SelectType types
 * @type {{role: number, team: number}}
 */
export const SelectType = {
  team: 0,
  role: 1,
};

/**
 * produce this structure
 * roles:[
 *    {
 *        name: <rolename>,
 *        teams: [
 *            {
 *                name: <teamName>,
 *            }
 *        ]
 *    }
 * ]
 * @param teamRoles
 * @param form
 * @return {*}
 */
export const buildTeamAndRole = (teamRoles, form) => {
  const selectedTeamAndRoles = teamRoles.map(function (item) {
    return {
      name: form.getFieldValue(item.role.selectID),
      id: item.role.id,
      teams: [
        {
          name: form.getFieldValue(item.team.selectID),
          id: item.team.id,
        },
      ],
    };
  });
  //   const grouped = _.chain(selectedTeamAndRoles)
  //     .groupBy('name')
  //     .map((value, key) => ({
  //       name: key,
  //       teams: value.map(function (e) {
  //         return e.teams;
  //       }),
  //     }))
  //     .value();
  const teamAndRoles = selectedTeamAndRoles.map(function (item) {
    item.teams = item.teams.flat();
    return item;
  });

  return teamAndRoles;
};

/**
 * returns string construct from parts of selectID
 * @param selectID with format [PREFIX]__[team.ID]__[UUID]
 * @param includedAttributes which attribute wants to include in new constructed string
 * @return {string|undefined}
 */
export const stringSelectID = (
  selectID,
  includedAttributes = ['prefix', 'teamID']
) => {
  const parts = selectID.split(SelectIDSeparator);
  if (isEmpty(parts) || parts.length !== 3) {
    return undefined;
  }

  const obj = {
    prefix: parts[0],
    teamID: parseInt(parts[1]),
    uuidString: parts[2],
  };

  let result = includedAttributes.map(function (attr) {
    return obj[attr];
  });

  return result.join(SelectIDSeparator);
};

/**
 * build selectID key
 * @param teamID team.id
 * @param {SelectType} selectType
 * @return {string|undefined}
 */
export const buildSelectID = (teamID, selectType) => {
  const randomStr = uuidv4();
  if (selectType === SelectType.team) {
    return [SelectIDPrefix.team, teamID, randomStr].join(SelectIDSeparator);
  } else if (selectType === SelectType.role) {
    return [SelectIDPrefix.role, teamID, randomStr].join(SelectIDSeparator);
  }
  return undefined;
};
