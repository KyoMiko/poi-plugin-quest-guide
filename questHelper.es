import questData from './quests-scn.json'

let questMap = new Map();
let idMap = new Map();
let lowerCaseMap = new Map();

for (const key in questData) {
    if (Object.hasOwnProperty.call(questData, key)) {
        const quest = questData[key];
        questMap.set(quest.code, quest.pre)
        idMap.set(quest.code, key)
        lowerCaseMap.set(quest.code.toLowerCase(),quest.code)
    }
}

export {questMap,idMap,lowerCaseMap}
