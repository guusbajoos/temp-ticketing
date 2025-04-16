import { isEmpty } from 'lodash'

export const teamsToPropCollection = (teams, targetProp, propCallback) => {
    return teams.map((team) => {
        let obj = {}
        obj[targetProp] = !isEmpty(propCallback)
            ? propCallback(team[targetProp])
            : team[targetProp]
        return obj
    })
}
