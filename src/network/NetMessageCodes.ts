
namespace TinyWars.Network {
export enum Codes {
MsgCommonHeartbeat = 0,
MsgCommonError = 1,
MsgCommonServerDisconnect = 2,
MsgCommonLatestConfigVersion = 3,
MsgCommonGetServerStatus = 4,
MsgCommonGetRankList = 5,
MsgUserRegister = 20,
MsgUserLogin = 21,
MsgUserLogout = 22,
MsgUserGetPublicInfo = 23,
MsgUserGetOnlineUsers = 24,
MsgUserSetNickname = 25,
MsgUserSetDiscordId = 26,
MsgUserSetPrivilege = 27,
MsgUserSetPassword = 28,
MsgUserGetSettings = 29,
MsgUserSetSettings = 30,
MsgMapGetEnabledBriefDataList = 40,
MsgMapGetEnabledRawDataList = 41,
MsgMapGetBriefData = 42,
MsgMapGetRawData = 43,
MsgMeGetMapDataList = 60,
MsgMeGetMapData = 61,
MsgMeSubmitMap = 62,
MsgMeSubmitWarRule = 63,
MsgMeGetSubmittedWarRuleList = 64,
MsgChatAddMessage = 80,
MsgChatGetAllMessages = 81,
MsgChatUpdateReadProgress = 82,
MsgChatGetAllReadProgressList = 83,
MsgMmSetMapAvailability = 100,
MsgMmSetMapEnabled = 101,
MsgMmGetReviewingMaps = 102,
MsgMmReviewMap = 103,
MsgMmGetReviewingWarRuleList = 104,
MsgMmReviewWarRule = 105,
MsgMmSetMapTag = 106,
MsgReplaySetRating = 120,
MsgReplayGetInfoList = 121,
MsgReplayGetData = 122,
MsgMcrCreateRoom = 140,
MsgMcrExitRoom = 141,
MsgMcrJoinRoom = 142,
MsgMcrDeleteRoom = 143,
MsgMcrSetReady = 144,
MsgMcrDeletePlayer = 145,
MsgMcrSetSelfSettings = 146,
MsgMcrSetWarRule = 147,
MsgMcrStartWar = 148,
MsgMcrGetJoinedRoomInfoList = 149,
MsgMcrGetRoomInfo = 150,
MsgMcrGetJoinableRoomInfoList = 151,
MsgMpwCommonGetMyWarInfoList = 160,
MsgMpwCommonContinueWar = 161,
MsgMpwCommonSyncWar = 162,
MsgMpwCommonHandleBoot = 163,
MsgMpwCommonBroadcastGameStart = 164,
MsgMpwWatchMakeRequest = 180,
MsgMpwWatchHandleRequest = 181,
MsgMpwWatchDeleteWatcher = 182,
MsgMpwWatchGetUnwatchedWarInfos = 183,
MsgMpwWatchGetOngoingWarInfos = 184,
MsgMpwWatchGetRequestedWarInfos = 185,
MsgMpwWatchGetWatchedWarInfos = 186,
MsgMpwWatchContinueWar = 187,
MsgMpwActionSystemBeginTurn = 200,
MsgMpwActionSystemCallWarEvent = 201,
MsgMpwActionSystemDestroyPlayerForce = 202,
MsgMpwActionSystemEndWar = 203,
MsgMpwActionPlayerEndTurn = 211,
MsgMpwActionPlayerSurrender = 212,
MsgMpwActionPlayerProduceUnit = 213,
MsgMpwActionPlayerDeleteUnit = 214,
MsgMpwActionPlayerVoteForDraw = 215,
MsgMpwActionUnitWait = 220,
MsgMpwActionUnitBeLoaded = 221,
MsgMpwActionUnitCaptureTile = 222,
MsgMpwActionUnitAttackTile = 223,
MsgMpwActionUnitAttackUnit = 224,
MsgMpwActionUnitDropUnit = 225,
MsgMpwActionUnitBuildTile = 226,
MsgMpwActionUnitDive = 227,
MsgMpwActionUnitSurface = 228,
MsgMpwActionUnitJoinUnit = 229,
MsgMpwActionUnitLaunchFlare = 230,
MsgMpwActionUnitLaunchSilo = 231,
MsgMpwActionUnitProduceUnit = 232,
MsgMpwActionUnitSupplyUnit = 233,
MsgMpwActionUnitLoadCo = 234,
MsgMpwActionUnitUseCoSkill = 235,
MsgScrCreateWar = 240,
MsgScrGetSaveSlotInfoList = 241,
MsgScrContinueWar = 242,
MsgScrSaveWar = 243,
MsgScrCreateCustomWar = 244,
MsgScrDeleteWar = 245,
MsgMrrSetMaxConcurrentCount = 260,
MsgMrrGetMaxConcurrentCount = 261,
MsgMrrGetMyRoomPublicInfoList = 262,
MsgMrrGetRoomPublicInfo = 263,
MsgMrrDeleteRoom = 264,
MsgMrrSetBannedCoIdList = 265,
MsgMrrSetSelfSettings = 266,
MsgBroadcastGetMessageList = 280,
MsgBroadcastAddMessage = 281,
MsgBroadcastDeleteMessage = 282,
MsgBroadcastDoBroadcast = 283,
MsgChangeLogGetMessageList = 300,
MsgChangeLogAddMessage = 301,
MsgChangeLogModifyMessage = 302,
MsgMtrCreateRoom = 320,
MsgMtrExitRoom = 321,
MsgMtrJoinRoom = 322,
MsgMtrDeleteRoom = 323,
MsgMtrSetReady = 324,
MsgMtrDeletePlayer = 325,
MsgMtrSetSelfSettings = 326,
MsgMtrStartWar = 327,
MsgMtrGetJoinedRoomInfoList = 328,
MsgMtrGetRoomInfo = 329,
MsgMtrGetJoinableRoomInfoList = 330,
}}
