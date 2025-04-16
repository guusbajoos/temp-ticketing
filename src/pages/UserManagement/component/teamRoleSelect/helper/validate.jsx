import { buildTeamAndRole } from './roleteam';

/**
 * validation structure message
 * @type {{duplicate: {errorMessage: string}}}
 */
const validation = {
  duplicate: {
    errorMessage: 'Team dan role tidak boleh sama',
  },
};

/**
 * validate duplication in team roles select box
 * @param teamRoles with the following props
 * {
 *     role: {
 *         selectID,
 *     },
 *     team: {
 *         selectID
 *     }
 * }
 * @param form antUI form
 * @return {{}}
 */
export const validateTeamRoleSelect = (teamRoles, form) => {
  // iterate over all the select box
  const keys = teamRoles.map(function (item) {
    return {
      key:
        form.getFieldValue(item.role.selectID) +
        ':' +
        form.getFieldValue(item.team.selectID),
      roleSelect: item.role.selectID,
    };
  });
  let objValidation = {};
  keys.forEach(function (k) {
    if (validateDuplicateTeamRole(teamRoles, form, k.key)) {
      objValidation[k.roleSelect] = {
        status: 'error',
        help: validation.duplicate.errorMessage,
      };
    } else {
      objValidation[k.roleSelect] = {
        status: undefined,
        help: undefined,
      };
    }
  });
  return objValidation;
};

const validateDuplicateTeamRole = (teamRoles, form, checked) => {
  const currentTeamAndRoles = buildTeamAndRole(teamRoles, form);
  var valueArr = currentTeamAndRoles.map(function (item) {
    const data = item.teams.flat();
    return data.map(function (d) {
      return item.name + ':' + d.name;
    });
  });
  const flatten = valueArr.flat();
  const duplicates = flatten.filter(function (fl) {
    return fl === checked;
  });
  return duplicates.length > 1;
};
