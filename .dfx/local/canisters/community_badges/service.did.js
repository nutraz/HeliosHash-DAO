export const idlFactory = ({ IDL }) => {
  const MemberId = IDL.Principal;
  const BadgeId = IDL.Nat;
  const Time = IDL.Int;
  const BadgeCategory = IDL.Variant({
    'Solar' : IDL.Null,
    'Cultural' : IDL.Null,
    'Achievement' : IDL.Null,
    'Language' : IDL.Null,
    'Governance' : IDL.Null,
    'Mentorship' : IDL.Null,
    'Voice' : IDL.Null,
    'Community' : IDL.Null,
  });
  const BadgeTemplate = IDL.Record({
    'id' : BadgeId,
    'descriptionEnglish' : IDL.Text,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'nameEnglish' : IDL.Text,
    'isActive' : IDL.Bool,
    'emoji' : IDL.Text,
    'owpReward' : IDL.Nat,
    'currentSupply' : IDL.Nat,
    'criteria' : IDL.Text,
    'category' : BadgeCategory,
    'maxSupply' : IDL.Opt(IDL.Nat),
  });
  const Badge = IDL.Record({
    'id' : BadgeId,
    'verified' : IDL.Bool,
    'owner' : MemberId,
    'metadata' : IDL.Opt(IDL.Text),
    'mintedAt' : Time,
    'template' : BadgeTemplate,
  });
  const Result = IDL.Variant({ 'ok' : Badge, 'err' : IDL.Text });
  return IDL.Service({
    'checkAndAwardBadges' : IDL.Func(
        [MemberId, IDL.Text, IDL.Text],
        [IDL.Vec(Badge)],
        [],
      ),
    'getAllBadgeTemplates' : IDL.Func([], [IDL.Vec(BadgeTemplate)], ['query']),
    'getBadgeLeaderboard' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(MemberId, IDL.Nat))],
        ['query'],
      ),
    'getBadgeTemplate' : IDL.Func(
        [BadgeId],
        [IDL.Opt(BadgeTemplate)],
        ['query'],
      ),
    'getCommunityStats' : IDL.Func(
        [],
        [
          IDL.Record({
            'totalBadges' : IDL.Nat,
            'mostPopularBadge' : IDL.Opt(IDL.Text),
            'raresBadge' : IDL.Opt(IDL.Text),
            'totalMembers' : IDL.Nat,
            'totalTemplates' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getMemberBadgeCount' : IDL.Func([MemberId], [IDL.Nat], ['query']),
    'getMemberBadges' : IDL.Func([MemberId], [IDL.Vec(Badge)], ['query']),
    'initializeBadges' : IDL.Func([], [], []),
    'mintBadge' : IDL.Func([BadgeId, MemberId, IDL.Text], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
