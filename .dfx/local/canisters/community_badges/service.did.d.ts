import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Badge {
  'id' : BadgeId,
  'verified' : boolean,
  'owner' : MemberId,
  'metadata' : [] | [string],
  'mintedAt' : Time,
  'template' : BadgeTemplate,
}
export type BadgeCategory = { 'Solar' : null } |
  { 'Cultural' : null } |
  { 'Achievement' : null } |
  { 'Language' : null } |
  { 'Governance' : null } |
  { 'Mentorship' : null } |
  { 'Voice' : null } |
  { 'Community' : null };
export type BadgeId = bigint;
export interface BadgeTemplate {
  'id' : BadgeId,
  'descriptionEnglish' : string,
  'name' : string,
  'description' : string,
  'nameEnglish' : string,
  'isActive' : boolean,
  'emoji' : string,
  'owpReward' : bigint,
  'currentSupply' : bigint,
  'criteria' : string,
  'category' : BadgeCategory,
  'maxSupply' : [] | [bigint],
}
export type MemberId = Principal;
export type Result = { 'ok' : Badge } |
  { 'err' : string };
export type Time = bigint;
export interface _SERVICE {
  'checkAndAwardBadges' : ActorMethod<[MemberId, string, string], Array<Badge>>,
  'getAllBadgeTemplates' : ActorMethod<[], Array<BadgeTemplate>>,
  'getBadgeLeaderboard' : ActorMethod<[], Array<[MemberId, bigint]>>,
  'getBadgeTemplate' : ActorMethod<[BadgeId], [] | [BadgeTemplate]>,
  'getCommunityStats' : ActorMethod<
    [],
    {
      'totalBadges' : bigint,
      'mostPopularBadge' : [] | [string],
      'raresBadge' : [] | [string],
      'totalMembers' : bigint,
      'totalTemplates' : bigint,
    }
  >,
  'getMemberBadgeCount' : ActorMethod<[MemberId], bigint>,
  'getMemberBadges' : ActorMethod<[MemberId], Array<Badge>>,
  'initializeBadges' : ActorMethod<[], undefined>,
  'mintBadge' : ActorMethod<[BadgeId, MemberId, string], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
