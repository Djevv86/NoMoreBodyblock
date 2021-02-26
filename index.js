module.exports = function noMoreBodyBlock(mod) {
  let enabled = true;
  const partyMembers = new Set();
  const customSPartyInfo1 = {leader: 1n, unk1: 0, unk2: 0, unk3: 0, unk4: 1};

  function setMembers(members) {
    partyMembers.clear();
    for(let i=0; i < members.length; i++) {
      if(!members[i].online) continue;
      partyMembers.add(members[i].gameId);
    }
  }

  function removeBodyBlock() {
    if (customSPartyInfo1.unk1 == 0) return;
    for (let i = partyMembers.values(), elem; !(elem = i.next()).done; ) {
      customSPartyInfo1.leader = elem.value;
      mod.toClient("S_PARTY_INFO", 1, customSPartyInfo1);
    }
  }

  function onSPartyInfo1(event) {
    customSPartyInfo1.unk1 = event.unk1;
    customSPartyInfo1.unk2 = event.unk2;
    customSPartyInfo1.unk3 = event.unk3;
    event.unk3 = 1;
    return true;
  }

  function onSPartyMemberList7(event) {
    customSPartyInfo1.unk1 = event.unk2;
    customSPartyInfo1.unk2 = event.unk3;
    customSPartyInfo1.unk3 = event.unk4;
    setMembers(event.members)
    return true;
  }

  function onSPartyMemberList8(event) {
    setMembers(event.members)
    return true;
  }

  function onRelated(event) {
    removeBodyBlock();
    return true;
  }

  function mod_enable() {
    mod.hook("S_PARTY_INFO", 1, event => onSPartyInfo1(event));
    mod.hook("S_PARTY_MEMBER_LIST", 7, event => onSPartyMemberList7(event));
    mod.hook("S_PARTY_MEMBER_LIST", 8, event => onSPartyMemberList8(event));
    mod.hook("S_USER_STATUS", 3, event => onRelated(event));
    mod.hook("S_SPAWN_USER", 16, event => onRelated(event));
    mod.hook("S_SPAWN_USER", 17, event => onRelated(event));
  }

  function mod_disable() {
    mod.unhook("S_PARTY_INFO", 1, event => onSPartyInfo1(event));
    mod.unhook("S_PARTY_MEMBER_LIST", 7, event => onSPartyMemberList7(event));
    mod.unhook("S_PARTY_MEMBER_LIST", 8, event => onSPartyMemberList8(event));
    mod.unhook("S_USER_STATUS", 3, event => onRelated(event));
    mod.unhook("S_SPAWN_USER", 16, event => onRelated(event));
    mod.unhook("S_SPAWN_USER", 17, event => onRelated(event));
  }


  function mod_toggle() {
    enabled = !enabled;
    if(enabled) mod_disable;
    else {
      mod_enable;
      removeBodyBlock();
    }
    mod.command.message("NoMore Bodyblock enabled: " + enabled);
  }

  mod.command.add('nobb', (key) => {
    key = key ? key.toLowerCase() : key;
	switch (key) {
      case "refresh": case "r":
        removeBodyBlock();
	  default:
	    mod_toggle();
	}
  });

  mod.game.on('enter_game', () => {
    if (enabled) mod_enable();
  });
}