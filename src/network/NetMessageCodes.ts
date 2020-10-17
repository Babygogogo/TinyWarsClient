
namespace TinyWars.Network {
export enum Codes {
MsgCommonHeartbeat = 0,
MsgCommonError = 1,
MsgCommonServerDisconnect = 2,
MsgCommonLatestConfigVersion = 3,
MsgCommonGetServerStatus = 4,
MsgUserRegister = 20,
MsgUserLogin = 21,
MsgUserLogout = 22,
MsgUserGetPublicInfo = 23,
MsgUserGetOnlineUsers = 24,
MsgUserSetNickname = 25,
MsgUserSetDiscordId = 26,
MsgMapGetEnabledExtraDataList = 40,
MsgMapGetExtraData = 41,
MsgMapGetRawData = 42,
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
MsgMmDeleteMap = 101,
MsgMmGetReviewingMaps = 102,
MsgMmReviewMap = 103,
MsgMmGetReviewingWarRuleList = 104,
MsgMmReviewWarRule = 105,
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
MsgMcrGetUnjoinedRoomInfoList = 151,
MsgMpwCommonGetWarInfoList = 160,
MsgMpwCommonContinueWar = 161,
MsgMpwCommonSerializeWar = 162,
MsgMpwCommonHandleBoot = 163,
MsgMpwCommonBroadcastGameStart = 164,
MsgMpwCommonSyncWar = 165,
MsgMpwWatchMakeRequest = 180,
MsgMpwWatchHandleRequest = 181,
MsgMpwWatchDeleteWatcher = 182,
MsgMpwWatchGetUnwatchedWarInfos = 183,
MsgMpwWatchGetOngoingWarInfos = 184,
MsgMpwWatchGetRequestedWarInfos = 185,
MsgMpwWatchGetWatchedWarInfos = 186,
MsgMpwWatchContinueWar = 187,
MsgMpwActionPlayerBeginTurn = 200,
MsgMpwActionPlayerEndTurn = 201,
MsgMpwActionPlayerSurrender = 202,
MsgMpwActionPlayerProduceUnit = 203,
MsgMpwActionPlayerDeleteUnit = 204,
MsgMpwActionPlayerVoteForDraw = 205,
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
MsgRmrSetMaxConcurrentCount = 260,
MsgRmrGetRoomInfoList = 261,
MsgRmrSetBannedCoIdList = 262,
MsgRmrSetSelfSettings = 263,
}}
