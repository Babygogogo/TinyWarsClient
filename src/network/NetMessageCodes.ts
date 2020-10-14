
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
MsgMcwCommonGetWarInfoList = 160,
MsgMcwCommonContinueWar = 161,
MsgMcwCommonSerializeWar = 162,
MsgMcwCommonHandleBoot = 163,
MsgMcwCommonBroadcastGameStart = 164,
MsgMcwCommonSyncWar = 165,
MsgMcwWatchMakeRequest = 180,
MsgMcwWatchHandleRequest = 181,
MsgMcwWatchDeleteWatcher = 182,
MsgMcwWatchGetUnwatchedWarInfos = 183,
MsgMcwWatchGetOngoingWarInfos = 184,
MsgMcwWatchGetRequestedWarInfos = 185,
MsgMcwWatchGetWatchedWarInfos = 186,
MsgMcwWatchContinueWar = 187,
MsgMcwActionPlayerBeginTurn = 200,
MsgMcwActionPlayerEndTurn = 201,
MsgMcwActionPlayerSurrender = 202,
MsgMcwActionPlayerProduceUnit = 203,
MsgMcwActionPlayerDeleteUnit = 204,
MsgMcwActionPlayerVoteForDraw = 205,
MsgMcwActionUnitWait = 220,
MsgMcwActionUnitBeLoaded = 221,
MsgMcwActionUnitCaptureTile = 222,
MsgMcwActionUnitAttackTile = 223,
MsgMcwActionUnitAttackUnit = 224,
MsgMcwActionUnitDropUnit = 225,
MsgMcwActionUnitBuildTile = 226,
MsgMcwActionUnitDive = 227,
MsgMcwActionUnitSurface = 228,
MsgMcwActionUnitJoinUnit = 229,
MsgMcwActionUnitLaunchFlare = 230,
MsgMcwActionUnitLaunchSilo = 231,
MsgMcwActionUnitProduceUnit = 232,
MsgMcwActionUnitSupplyUnit = 233,
MsgMcwActionUnitLoadCo = 234,
MsgMcwActionUnitUseCoSkill = 235,
MsgScrCreateWar = 240,
MsgScrGetSaveSlotInfoList = 241,
MsgScrContinueWar = 242,
MsgScrSaveWar = 243,
MsgScrCreateCustomWar = 244,
}}
