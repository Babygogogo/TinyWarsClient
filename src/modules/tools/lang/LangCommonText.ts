
import TwnsLangTextType     from "./LangTextType";

namespace TwnsLangCommonText {
    import LangTextType = TwnsLangTextType.LangTextType;

    export const LangCommonText: { [type: number]: string [] } = {
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Long strings.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        [LangTextType.A0000]: [
            "登陆成功，祝您游戏愉快！",
            "Logged in successfully!",
        ],
        [LangTextType.A0001]: [
            "账号不符合要求，请检查后重试",
            "Invalid account.",
        ],
        [LangTextType.A0002]: [
            "昵称不符合要求，请检查后重试",
            "Invalid nickname.",
        ],
        [LangTextType.A0003]: [
            "密码不符合要求，请检查后重试",
            "Invalid password.",
        ],
        [LangTextType.A0004]: [
            "注册成功，正在自动登陆…",
            "Register successfully! Now logging in...",
        ],
        [LangTextType.A0005]: [
            "您已成功退出登陆，欢迎再次进入游戏。",
            "Logout successfully.",
        ],
        [LangTextType.A0006]: [
            "您的账号被异地登陆，您已自动下线。",
            "Someone logged in with your account!",
        ],
        [LangTextType.A0007]: [
            "已成功连接服务器。",
            "Connected to server successfully.",
        ],
        [LangTextType.A0008]: [
            "连接服务器失败，正在重新连接…",
            "Failed to connect to server. Now reconnecting...",
        ],
        [LangTextType.A0009]: [
            "您的网络连接不稳定，请尝试改善",
            "The network connection is not stable.",
        ],
        [LangTextType.A0010]: [
            "没有符合条件的地图，请更换条件再试",
            "No maps found.",
        ],
        [LangTextType.A0011]: [
            "正在查找地图",
            "Searching for maps...",
        ],
        [LangTextType.A0012]: [
            "已找到符合条件的地图",
            "Maps found.",
        ],
        [LangTextType.A0013]: [
            "发生网络错误，请重新登陆。",
            "Network went wrong. Please re-login.",
        ],
        [LangTextType.A0014]: [
            "发生网络错误，请稍后再试。亦可尝试刷新浏览器。",
            "Network went wrong. Please try again later or refresh the browser.",
        ],
        [LangTextType.A0015]: [
            "已成功创建战局，请等待其他玩家加入",
            "The war is created successfully.",
        ],
        [LangTextType.A0016]: [
            "已成功退出房间",
            "Quit successfully.",
        ],
        [LangTextType.A0017]: [
            "密码不正确，请检查后重试",
            "Invalid password.",
        ],
        [LangTextType.A0018]: [
            "已成功加入房间。",
            "Joined successfully.",
        ],
        [LangTextType.A0019]: [
            "该房间已被销毁。",
            "The room has been destroyed.",
        ],
        [LangTextType.A0020]: [
            `服务器维护中，请稍后登陆`,
            `The server is under maintenance. Please wait and login later.`,
        ],
        [LangTextType.A0021]: [
            `正在读取战局数据，请稍候`,
            `Downloading the war data. Please wait.`,
        ],
        [LangTextType.A0022]: [
            `恭喜您获得本局的胜利！\n即将回到大厅…`,
            `Congratulations!`,
        ],
        [LangTextType.A0023]: [
            `很遗憾您已战败，请再接再厉！\n即将回到大厅…`,
            `Good luck next war!`,
        ],
        [LangTextType.A0024]: [
            `您确定要结束回合吗？`,
            `Are you sure to end your turn?`,
        ],
        [LangTextType.A0025]: [
            `您确定要返回大厅吗？`,
            `Are you sure to go to the lobby?`,
        ],
        [LangTextType.A0026]: [
            `您确定要投降吗？`,
            `Are you sure to resign?`,
        ],
        [LangTextType.A0027]: [
            `请先选中您想要删除的部队，再进行此操作`,
            `Please select the unit you want to delete with the cursor before doing this.`,
        ],
        [LangTextType.A0028]: [
            `您只能删除您自己的未行动的部队`,
            `You can delete your own idle units only.`,
        ],
        [LangTextType.A0029]: [
            `是否确定要删除此部队？`,
            `Are you sure to delete the selected unit?`,
        ],
        [LangTextType.A0030]: [
            `所有玩家都已同意和局，战局结束！\n即将回到大厅...`,
            `The game ends in draw!`,
        ],
        [LangTextType.A0031]: [
            `您确定要求和吗？`,
            `Are you sure to request a drawn game?`,
        ],
        [LangTextType.A0032]: [
            `您确定要同意和局吗？`,
            `Are you sure to agree the request from your opponent for a drawn game?`,
        ],
        [LangTextType.A0033]: [
            `您确定要拒绝和局吗？`,
            `Are you sure to decline the request from your opponent for a drawn game?`,
        ],
        [LangTextType.A0034]: [
            `已有玩家求和，请先决定是否同意（通过菜单选项操作）`,
            `There is a request for a drawn game. Please decide whether to agree it before ending your turn.`,
        ],
        [LangTextType.A0035]: [
            `战局已结束，即将回到大厅…`,
            `The war is ended. Going back to the lobby...`,
        ],
        [LangTextType.A0036]: [
            `检测到战局数据错误，已自动与服务器成功同步`,
            `The war is synchronized successfully.`,
        ],
        [LangTextType.A0037]: [
            `发生未知错误，正在返回大厅...`,
            `Something wrong happened! Going back to the lobby...`,
        ],
        [LangTextType.A0038]: [
            `战局数据已同步`,
            `The war is synchronized successfully.`,
        ],
        [LangTextType.A0039]: [
            `数据加载中，请稍后重试`,
            `Now loading, please wait and retry.`,
        ],
        [LangTextType.A0040]: [
            `数据加载中，请稍候...`,
            `Now loading, please wait...`,
        ],
        [LangTextType.A0041]: [
            `回放已播放完毕`,
            `The replay is completed.`,
        ],
        [LangTextType.A0042]: [
            `已处于战局初始状态，无法切换到上一回合`,
            `Can't rewind because it's the beginning of the replay.`,
        ],
        [LangTextType.A0043]: [
            `已处于战局结束状态，无法切换到下一回合`,
            `Can't forward because it's the end of the replay.`,
        ],
        [LangTextType.A0044]: [
            `当前正在回放玩家动作，请待其结束后重试`,
            `Now replaying an action. Please wait until it ends.`,
        ],
        [LangTextType.A0045]: [
            `已成功切换回合`,
            `Turn switched.`,
        ],
        [LangTextType.A0046]: [
            `请求中，请稍候`,
            `Now requesting, please wait...`,
        ],
        [LangTextType.A0047]: [
            `昵称已更改`,
            `Your nickname is changed successfully`,
        ],
        [LangTextType.A0048]: [
            `Discord ID 不正确，请检查后重试`,
            `Invalid discord ID.`,
        ],
        [LangTextType.A0049]: [
            `Discord ID 已更改`,
            `Your discord ID is changed successfully`,
        ],
        [LangTextType.A0050]: [
            `您尚未选择任何CO。`,
            `You have chosen no CO.`,
        ],
        [LangTextType.A0051]: [
            `是否确定要创建战局？`,
            `Are you sure to create the game?`,
        ],
        [LangTextType.A0052]: [
            `是否确定要加入战局？`,
            `Are you sure to join the game?`,
        ],
        [LangTextType.A0053]: [
            `该功能正在开发中，敬请期待`,
            `This feature is under development...`,
        ],
        [LangTextType.A0054]: [
            `您确定要发动CO POWER吗？`,
            `Are you sure to activate the CO POWER?`,
        ],
        [LangTextType.A0055]: [
            `当前有其他操作可选。您确定要直接待机吗？`,
            `Another action is available. Are you sure to make the unit wait?`,
        ],
        [LangTextType.A0056]: [
            `未知错误，请拖动截图发给作者，谢谢`,
            `Error! Please make a screenshot and send it to the developing group.`,
        ],
        [LangTextType.A0057]: [
            `禁用此项会清空您当前选择的CO（您可以重新选择一个）。确定要禁用吗？`,
            `You have chosen a CO that is banned by your current selection. Are you sure to continue the ban?`,
        ],
        [LangTextType.A0058]: [
            `您确定要发动SUPER POWER吗？`,
            `Are you sure to activate the SUPER POWER?`,
        ],
        [LangTextType.A0059]: [
            `已成功修改地图可用性`,
            `The availability has been changed successfully.`,
        ],
        [LangTextType.A0060]: [
            `已发出观战请求，对方同意后即可观战`,
            `Requested. You can watch the game when accepted.`,
        ],
        [LangTextType.A0061]: [
            `请求已处理`,
            `Handled.`,
        ],
        [LangTextType.A0062]: [
            `已删除指定观战者`,
            `The selected watcher is removed`,
        ],
        [LangTextType.A0063]: [
            `注:任意条件均可留空,等同于忽略该查找条件`,
            `Tips: You can leave any of the filters blank. Those filters will be ignored.`,
        ],
        [LangTextType.A0064]: [
            `双击玩家名称，可以查看其详细信息`,
            `Touch a name to see the player's profile.`,
        ],
        [LangTextType.A0065]: [
            `本页设置对局内所有玩家都生效`,
            `The settings affect all players in the game.`,
        ],
        [LangTextType.A0066]: [
            `昵称可使用任意字符，长度不小于4位`,
            `You can use any character for the nickname, and the nickname should consist of at least 4 characters.`,
        ],
        [LangTextType.A0067]: [
            `输入正确的Discord ID，并加入以下游戏频道即可实时收到游戏相关消息，如回合轮转等。`,
            `By entering your correct discord ID and joining the following discord server you can receive tinywars-related information, including turn notification.`,
        ],
        [LangTextType.A0068]: [
            `可点击以下各个文字以更改设置`,
            `Touch texts below to change the settings.`,
        ],
        [LangTextType.A0069]: [
            `请为参赛玩家设置至少两个队伍`,
            `Please set at least two teams for players.`,
        ],
        [LangTextType.A0070]: [
            `您选择的存档位置非空，其内容将被覆盖。确定要继续创建战局吗？`,
            `The save slot is not empty and will be overwritten. Are you sure to create the game?`,
        ],
        [LangTextType.A0071]: [
            `您的存档将被覆盖。确定要存档吗？`,
            `Your save slot will be overwritten. Are you sure to continue?`,
        ],
        [LangTextType.A0072]: [
            `您当前的进度将会丢失。确定要读档吗？`,
            `Your current progress will be lost. Are you sure to continue?`,
        ],
        [LangTextType.A0073]: [
            `已成功存档`,
            `Game saved successfully.`,
        ],
        [LangTextType.A0074]: [
            `确定要重新载入所有地图吗？`,
            `Are you sure to reload all maps?`,
        ],
        [LangTextType.A0075]: [
            `地图重载成功`,
            `Successfully reloaded all maps.`,
        ],
        [LangTextType.A0076]: [
            `您无法删除最后一个部队`,
            `You can't delete your last unit.`,
        ],
        [LangTextType.A0077]: [
            `您没有可用于建造部队的建筑。`,
            `You don't have any buildings that can produce units.`,
        ],
        [LangTextType.A0078]: [
            `加载中，请稍候`,
            `Now loading`,
        ],
        [LangTextType.A0079]: [
            [
                `确定要把其他地图合并到当前选中的目标地图吗？`,
                `注：`,
                `1.合并后，原地图将不再可用，但相关战局/回放仍可正常运作`,
                `2.其统计数据（如胜负场数）将被累计到目标地图中`,
                `3.若有多个图可以合并，请重复操作几次`,
            ].join("\n"),
            [
                `Untranslated...`,
                `确定要把其他地图合并到当前选中的目标地图吗？`,
                `注：`,
                `1.合并后，原地图将不再可用，但相关战局/回放仍可正常运作`,
                `2.其统计数据（如胜负场数）将被累计到目标地图中`,
                `3.若有多个图可以合并，请重复操作几次`,
            ].join("\n"),
        ],
        [LangTextType.A0080]: [
            [
                `确定要删除此地图吗？`,
                `删除后，此地图将不再可用，但相关战局/回放仍可正常运作。`,
            ].join("\n"),
            [
                `Untranslated...`,
                `确定要删除此地图吗？`,
                `删除后，此地图将不再可用，但相关战局/回放仍可正常运作。`,
            ].join("\n"),
        ],
        [LangTextType.A0081]: [
            `已成功删除地图`,
            `The map has been deleted successfully`,
        ],
        [LangTextType.A0082]: [
            `确定要保存此地图吗？`,
            `Are you sure to save the map?`,
        ],
        [LangTextType.A0083]: [
            `此地图存在以下问题，暂不能提审，但可以正常保存以备后续编辑。`,
            `This map is not playable (see below), but you can save it and edit it later.`,
        ],
        [LangTextType.A0084]: [
            `您已提审过其他地图。若提审此地图，则其他地图将被自动撤销提审。确定要继续吗？`,
            `You have submitted some other maps for review. If you submit this map, the submitted maps will not be reviewed. Are you sure to continue?`,
        ],
        [LangTextType.A0085]: [
            `已成功保存地图`,
            `The map has been saved.`,
        ],
        [LangTextType.A0086]: [
            `注：若新的宽高小于当前宽高，则超出的图块会被裁剪掉（以左上角为原点）`,
            `Warning: If width/height is set lower than the current value, right & bottom map area exceeding the limit will be deleted.`,
        ],
        [LangTextType.A0087]: [
            `您输入的宽高不合法，请检查`,
            `The W/H is not valid.`,
        ],
        [LangTextType.A0088]: [
            `注：偏移后超出范围的图块会被裁剪（以左上角为原点）`,
            `Warning: Data that out of range will be dismissed! The origin point is at the upper left corner.`,
        ],
        [LangTextType.A0089]: [
            `您确定要填充整个地图吗？`,
            `Are you sure to fill the map?`,
        ],
        [LangTextType.A0090]: [
            `您确定要让过审此地图吗？`,
            `Are you sure to accept the map?`,
        ],
        [LangTextType.A0091]: [
            `您确定要拒审此地图吗？`,
            `Are you sure to reject the map?`,
        ],
        [LangTextType.A0092]: [
            `您已成功过审该地图。`,
            `You have accepted the map successfully.`,
        ],
        [LangTextType.A0093]: [
            `您已成功拒审该地图。`,
            `You have rejected the map successfully.`,
        ],
        [LangTextType.A0094]: [
            `请输入拒审理由`,
            `Please write down the reason for the rejection`,
        ],
        [LangTextType.A0095]: [
            `您确定要导入此地图吗？`,
            `Are you sure to import this map?`,
        ],
        [LangTextType.A0096]: [
            `至少需要保留一个预设规则`,
            `There must be at least one preset rule.`,
        ],
        [LangTextType.A0097]: [
            `确定要删除这个预设规则吗？`,
            `Are you sure to delete this preset rule?`,
        ],
        [LangTextType.A0098]: [
            `输入的值无效，请重试`,
            `Invalid value. Please retry.`,
        ],
        [LangTextType.A0099]: [
            `无法创建更多的预设规则`,
            `You can't create more rules. `,
        ],
        [LangTextType.A0100]: [
            `此地图没有预设规则`,
            `This map has no preset rules.`,
        ],
        [LangTextType.A0101]: [
            `此选项已被预设规则锁定，无法修改`,
            `This setting is locked because a preset rule is chosen.`,
        ],
        [LangTextType.A0102]: [
            `这是一局自定义规则的游戏，请确保您已经理解了所有的规则设定。\n确定要加入这局游戏吗？`,
            `Please make sure that you have recognized all the custom rules before joining this game.\nAre you sure to continue?`,
        ],
        [LangTextType.A0103]: [
            `有玩家正在进行操作，请等待该操作结束后重试`,
            `A player is taking a move. Please retry when the move ends`,
        ],
        [LangTextType.A0104]: [
            `模拟战已成功创建。您可以通过单人模式进入该战局。`,
            `The simulation war is created successfully.`,
        ],
        [LangTextType.A0105]: [
            `请输入您对此地图的评价以及改进建议，可留空`,
            `Please leave your comment here if any.`,
        ],
        [LangTextType.A0106]: [
            `已成功评分`,
            `Rated successfully.`,
        ],
        [LangTextType.A0107]: [
            `已成功创建模拟战。您想现在就开始游玩吗？`,
            `The simulation war has been created successfully. Do you want to play it now?`,
        ],
        [LangTextType.A0108]: [
            `开启作弊模式后，您可以随意修改战局上的各种数据。开启作弊模式后，将无法再取消。\n确定要开启吗？`,
            `You can modify most of the game data if cheating is enabled. However, you can't disable it after enabling it.\nAre you sure to continue?`,
        ],
        [LangTextType.A0109]: [
            `请先把CO搭载到部队上`,
            `Please board your CO first.`,
        ],
        [LangTextType.A0110]: [
            `您确定要让AI来控制这个势力吗？`,
            `Are you sure to make the A.I. to take control of the force?`,
        ],
        [LangTextType.A0111]: [
            `您确定要自行控制这个势力吗？`,
            `Are you sure to take control of the force?`,
        ],
        [LangTextType.A0112]: [
            `有棋子正在移动中，请稍候再试`,
            `A unit is moving. Please retry later.`,
        ],
        [LangTextType.A0113]: [
            `您确定要切换该部队的行动状态吗？`,
            `Are you sure to switch the unit's action state?`,
        ],
        [LangTextType.A0114]: [
            `您确定要切换该部队的下潜状态吗？`,
            `Are you sure to switch the unit's diving state?`,
        ],
        [LangTextType.A0115]: [
            `请联系babygogogo以解决问题`,
            `Please refer to babygogogo.`,
        ],
        [LangTextType.A0116]: [
            `战局已开始，并已进入您的回合。要现在就进入战局吗？`,
            `The war has started and it's your turn now. Do you want to play it now?`,
        ],
        [LangTextType.A0117]: [
            `注：清空后，所有地形都会被设置为平原，所有部队都会被删除！`,
            `Caution: All tiles will be set as plain and all units will be deleted!`,
        ],
        [LangTextType.A0118]: [
            `设计者名称不合法`,
            `Invalid MapDesigner.`,
        ],
        [LangTextType.A0119]: [
            `地图名称不合法`,
            `Invalid MapName.`,
        ],
        [LangTextType.A0120]: [
            `地图英文名称不合法`,
            `Invalid English MapName.`,
        ],
        [LangTextType.A0121]: [
            `请确保至少有两名玩家，且没有跳过势力颜色`,
            `Invalid forces.`,
        ],
        [LangTextType.A0122]: [
            `部队数据不合法`,
            `Invalid units.`,
        ],
        [LangTextType.A0123]: [
            `地形数据不合法`,
            `Invalid tiles.`,
        ],
        [LangTextType.A0124]: [
            `预设规则未设置或不合法`,
            `Preset rules are not set or invalid.`,
        ],
        [LangTextType.A0125]: [
            `要现在就进入战局吗？`,
            `Do you want to play it now?`,
        ],
        [LangTextType.A0126]: [
            `您确定要退出此房间吗？`,
            `Are you sure to exit the room?`,
        ],
        [LangTextType.A0127]: [
            `您已被请出此房间。`,
            `You have been removed from the room.`,
        ],
        [LangTextType.A0128]: [
            `请先取消您的准备状态`,
            `Please cancel the "ready" state first.`,
        ],
        [LangTextType.A0129]: [
            `您确定要使用自定义规则吗？`,
            `Are you sure to use a custom rule?`,
        ],
        [LangTextType.A0130]: [
            `您必须保留"无CO"选项。`,
            `The 'No CO' option must be available.`,
        ],
        [LangTextType.A0131]: [
            `请尽量同时提供中英文名，以英文逗号分隔`,
            `Please write down a Chinese Name and an English name if possible. Use a , as a separator.`,
        ],
        [LangTextType.A0132]: [
            `请设定您愿意同时进行的排位赛的数量上限（设置为0等同于您不参加对应模式的排位赛）。`,
            `Please set the maximum number of ranking matches you are willing to play at the same time. Setting it to 0 is equivalent to not participating in ranking matches.`
        ],
        [LangTextType.A0133]: [
            `正在等待对战各方禁用CO。`,
            `Waiting for the COs to be banned from all sides.`,
        ],
        [LangTextType.A0134]: [
            `正在等待对战各方选择CO和势力颜色并进入准备状态。`,
            `Waiting for all the players to be ready for the game.`,
        ],
        [LangTextType.A0135]: [
            `您尚未禁用任何CO。`,
            `You have not banned any COs.`,
        ],
        [LangTextType.A0136]: [
            `您已选择不禁用任何CO。`,
            `You have chosen not to ban any COs.`,
        ],
        [LangTextType.A0137]: [
            `进入准备状态后，您将无法再次修改CO和势力颜色设定。确定要继续吗？`,
            `You can't change your CO and color settings after being ready. Are you sure to continue?`,
        ],
        [LangTextType.A0138]: [
            `确定要禁用这些CO吗？`,
            `Are you sure to ban these COs?`,
        ],
        [LangTextType.A0139]: [
            `确定要不禁用任何CO吗？`,
            `Are you sure to ban no CO?`,
        ],
        [LangTextType.A0140]: [
            `确定要删除当前存档吗？（注：其他存档不受影响；您可以继续游玩当前游戏并存档）`,
            `Are you sure to clear the current save slot?`,
        ],
        [LangTextType.A0141]: [
            `已成功删除存档。`,
            `The save slot has been cleared.`,
        ],
        [LangTextType.A0142]: [
            `此地图已被修改，需要先保存吗？`,
            `The map has been modified. Do you want to save the map?`,
        ],
        [LangTextType.A0143]: [
            `此地图已被修改，确定不保存直接退出吗？`,
            `The map has been modified. Are you sure to exit anyway?`,
        ],
        [LangTextType.A0144]: [
            `请输入存档备注以便于区分，可留空`,
            `Please input a comment for the save slot.`,
        ],
        [LangTextType.A0145]: [
            `房间已满员`,
            `The room is full of players.`,
        ],
        [LangTextType.A0146]: [
            `战局数据不合法，请检查后重试`,
            `The war data is invalid. Please check and retry.`,
        ],
        [LangTextType.A0147]: [
            `新密码与确认密码不相同，请检查后重试`,
            `The new password is different from the confirm password.`,
        ],
        [LangTextType.A0148]: [
            `已成功修改密码。`,
            `Your password has been changed successfully.`
        ],
        [LangTextType.A0149]: [
            `您确定要删除此房间吗？`,
            `Are you sure to delete this room?`
        ],
        [LangTextType.A0150]: [
            `正在加载图片\n请耐心等候`,
            `Now loading\nPlease wait...`,
        ],
        [LangTextType.A0151]: [
            `已成功修改地图标签`,
            `The map tag has been updated successfully.`,
        ],
        [LangTextType.A0152]: [
            `您正在观战的玩家已被击败。\n即将回到大厅…`,
            `The player that you are watching has lost.`,
        ],
        [LangTextType.A0153]: [
            `请把错误码告知开发组`,
            `Please notify the developing group.`,
        ],
        [LangTextType.A0154]: [
            `已成功提交更新日志。`,
            `The change log has been updated successfully.`,
        ],
        [LangTextType.A0155]: [
            `输入内容太短，请检查`,
            `The texts are too short.`,
        ],
        [LangTextType.A0156]: [
            `您最少需要填写一种语言的内容`,
            `You have to write down at least one of the text.`,
        ],
        [LangTextType.A0157]: [
            `已成功修改用户权限`,
            `The user privilege has been updated successfully.`,
        ],
        [LangTextType.A0158]: [
            `事件数据不存在，请删除本事件`,
            `The event data doesn't exist. Please delete it.`,
        ],
        [LangTextType.A0159]: [
            `此事件尚未设定条件节点`,
            `The event contains no condition node.`,
        ],
        [LangTextType.A0160]: [
            `条件节点的数据不存在。请删除此条件节点。`,
            `The condition node data doesn't exist. Please delete it.`,
        ],
        [LangTextType.A0161]: [
            `此条件节点不包含任何子条件和子条件节点。`,
            `The condition node contains no condition nor sub node.`,
        ],
        [LangTextType.A0162]: [
            `所有子条件和子节点都成立时，此节点成立。`,
            `The condition node is true if ALL of the sub conditions and/or sub nodes are true.`,
        ],
        [LangTextType.A0163]: [
            `任意子条件或子节点成立时，此节点成立。`,
            `The condition node is true if ANY of the sub conditions and/or sub nodes is true.`,
        ],
        [LangTextType.A0164]: [
            `条件数据不存在，请删除本条件`,
            `The condition data doesn't exist. Please delete it.`,
        ],
        [LangTextType.A0165]: [
            `条件数据不合法，请编辑修正`,
            `The condition data is not valid. Please edit it.`,
        ],
        [LangTextType.A0166]: [
            `数据出错，请删除本项`,
            `Error. Please delete this line.`,
        ],
        [LangTextType.A0167]: [
            `此事件尚未设定动作。请至少设定一个动作。`,
            `The event contains no action. Please add at least one action.`,
        ],
        [LangTextType.A0168]: [
            `动作数据不存在，请删除本动作`,
            `The action data doesn't exist. Please delete this action.`,
        ],
        [LangTextType.A0169]: [
            `动作中部分部队的数据不合法`,
            `Some of the unit data in the action is not valid.`,
        ],
        [LangTextType.A0170]: [
            `事件数量已达上限`,
            `There are too many events already.`,
        ],
        [LangTextType.A0171]: [
            `您确定要删除事件吗？`,
            `Are you sure to delete this event?`,
        ],
        [LangTextType.A0172]: [
            `您确定要删除该条件节点吗？`,
            `Are you sure to delete the condition node?`,
        ],
        [LangTextType.A0173]: [
            `条件节点数量已达上限`,
            `There are too many condition nodes already.`,
        ],
        [LangTextType.A0174]: [
            `条件数量已达上限`,
            `There are too many conditions already.`,
        ],
        [LangTextType.A0175]: [
            `您确定要删除该条件吗？`,
            `Are you sure to delete the condition?`,
        ],
        [LangTextType.A0176]: [
            `您确定要删除该动作吗？`,
            `Are you sure to delete the action?`,
        ],
        [LangTextType.A0177]: [
            `此动作数据出错，请删除`,
            `There is something wrong with the action. Please delete it.`,
        ],
        [LangTextType.A0178]: [
            `事件中的动作数量已达上限`,
            `There are too many actions in the event already.`,
        ],
        [LangTextType.A0179]: [
            `无法替换节点，因为这样做会造成循环引用`,
            `Can't replace the node because of circular reference.`,
        ],
        [LangTextType.A0180]: [
            `事件包含的动作太多，请删除一些动作。`,
            `There are too many actions in this event. Please delete some of them.`,
        ],
        [LangTextType.A0181]: [
            `数值不合法，请修改。`,
            `The value is illegal. Please modify it.`,
        ],
        [LangTextType.A0182]: [
            `此地图已包含太多事件，请删除一些。`,
            `The map contains too many events. Please delete some of them.`,
        ],
        [LangTextType.A0183]: [
            `此地图已包含太多条件节点，请删除一些。`,
            `The map contains too many condition nodes. Please delete some of them.`,
        ],
        [LangTextType.A0184]: [
            `此地图已包含太多事件动作，请删除一些。`,
            `The map contains too many actions. Please delete some of them.`,
        ],
        [LangTextType.A0185]: [
            `此地图已包含太多条件，请删除一些。`,
            `The map contains too many conditions. Please delete some of them.`,
        ],
        [LangTextType.A0186]: [
            `此条件在同一事件中重复出现。请删除重复的条件。`,
            `There are duplicated conditions in the same event. Please remove the duplication.`,
        ],
        [LangTextType.A0187]: [
            `此条件数据出错，请删除`,
            `There is something wrong with the condition. Please delete it.`,
        ],
        [LangTextType.A0188]: [
            `未被引用的条件节点、条件、动作都将被删除。您确定要继续吗？`,
            `All of the unused condition nodes, conditions and actions will be deleted. Are you sure to continue?`,
        ],
        [LangTextType.A0189]: [
            `此动作已包含太多部队`,
            `There are too many units in this action.`,
        ],
        [LangTextType.A0190]: [
            `您确定要清空所有部队吗？`,
            `Are you sure to delete all the units?`,
        ],
        [LangTextType.A0191]: [
            `此动作包含的部队的数量不合法`,
            `The total number of the units is invalid.`,
        ],
        [LangTextType.A0192]: [
            `未设置是否会被其他部队阻挡`,
            `'Blockable By Unit' has not been set.`,
        ],
        [LangTextType.A0193]: [
            `未设置是否自动寻找有效地形`,
            `'NeedMovableTile' has not been set.`,
        ],
        [LangTextType.A0194]: [
            `再次点击返回将退出游戏`,
            `Click the go back button again to exit the game.`,
        ],
        [LangTextType.A0195]: [
            `感谢您游玩Tiny Wars!`,
            `Thank you for playing Tiny Wars!`,
        ],
        [LangTextType.A0196]: [
            `您的浏览器不支持播放背景音乐`,
            `BGM is not supported by your browser.`,
        ],
        [LangTextType.A0197]: [
            `地图已保存，但数据不合法，因而无法提审`,
            `The map has been saved, however the data is invalid for review.`,
        ],
        [LangTextType.A0198]: [
            `您可以通过地图编辑器和模拟战来创建自由模式房间。`,
            `You can create rooms via the map editor or the simulation wars.`,
        ],
        [LangTextType.A0199]: [
            `请确保地图上至少有两个存活的势力`,
            `Please ensure that there're at least 2 alive forces.`,
        ],
        [LangTextType.A0200]: [
            `创建自由模式游戏失败`,
            `Failed to create the free mode game.`,
        ],
        [LangTextType.A0201]: [
            `将离开战局并前往创建自由模式房间的页面。\n您确定要继续吗？`,
            `You have to leave the war scene (you can enter it again later) in order to create the free mode room.\nAre you sure to continue?`,
        ],
        [LangTextType.A0202]: [
            `已有其他玩家选择该势力`,
            `The force has been chosen by another player.`,
        ],
        [LangTextType.A0203]: [
            `已有其他玩家选择该颜色`,
            `The color has been chosen by another player.`,
        ],
        [LangTextType.A0204]: [
            `该势力不可选`,
            `The force is unavailable.`,
        ],
        [LangTextType.A0205]: [
            `无法撤销准备状态`,
            `It's not allowed to cancel the "ready" state.`,
        ],
        [LangTextType.A0206]: [
            [
                `一旦进入准备状态，您将无法反悔，也无法修改您的CO和颜色设定。`,
                `确定要继续吗？`,
                ``,
                `注：正式开局前，您的对手不会知道您选择了哪个CO。`,
            ].join(`\n`),
            [
                `Once you're ready, you can not undo nor change your CO and/or color.`,
                `Are you sure to continue?`,
                ``,
                `Tips: Your opponent(s) will not know which CO you have chosen until the game starts.`,
            ].join(`\n`),
        ],
        [LangTextType.A0207]: [
            `您已准备就绪，无法再修改各项设定`,
            `You're in the ready state and can no longer change the settings.`,
        ],
        [LangTextType.A0208]: [
            `您确定要不使用任何CO吗？`,
            `Are you sure to use no CO?`,
        ],
        [LangTextType.A0209]: [
            `排位模式下无法修改势力`,
            `It's not allowed to change your force in ranking matches.`,
        ],
        [LangTextType.A0210]: [
            `请禁用CO`,
            `Please ban COs for the match.`
        ],
        [LangTextType.A0211]: [
            `请选择您的CO和颜色，并进入准备就绪状态`,
            `Please choose your CO and color, and then set ready for the match.`,
        ],
        [LangTextType.A0212]: [
            `玩家序号不合法`,
            `The index of the player is invalid.`,
        ],
        [LangTextType.A0213]: [
            `玩家状态不合法`,
            `The state of the player is invalid.`,
        ],
        [LangTextType.A0214]: [
            `"存活"状态下，玩家可以正常行动。可以从其他状态切换到本状态（死而复生）。`,
            `In the Alive state, players can do anything as usual. It's possible to make a (Being) Defeated player Alive again.`,
        ],
        [LangTextType.A0215]: [
            `"即将战败"状态下，玩家无法行动。除非有其他事件把玩家状态改为"存活"，否则系统将自动清除所有该玩家的部队，建筑将变为中立，且状态将变为已战败。`,
            `In the Being Defeated state, players can not do anything. His/her troops will be cleared, and buildings will be neutral, unless his/her state is changed to be Alive.`,
        ],
        [LangTextType.A0216]: [
            `"已战败"状态下，玩家无法行动。如果玩家是直接从存活状态切换到已战败状态，则其部队和建筑所有权都会残留。`,
            `In the Being Defeated state, players can not do anything. If his/her previous state is Alive, his/her troops will remain.`,
        ],
        [LangTextType.A0217]: [
            `所有数值设定与《高级战争：毁灭之日》保持一致。`,
            `All data of units and tiles is the same as Advance Wars: Days of Ruin.`,
        ],
        [LangTextType.A0218]: [
            `此版本引入了高战1/2/DS的CO（比如Andy）。这些CO仍然具有全局效果，并由zhaotiantong进行了平衡。使用了由NGC6240设计的兵种数据。`,
            `COs from AW 1/2/DS (Andy for example) are introduced into this version. They still have global effects and are rebalanced by zhaotiantong. Units are rebalanced by NGC6240.`,
        ],
        [LangTextType.A0219]: [
            `注意：各版本的玩家数据不互通。您可能需要重新注册账户。`,
            `Note: The user data is not interchangeable between the versions. You may need to register again.`,
        ],
        [LangTextType.A0220]: [
            `您已选择由自己控制此势力，无法修改为AI控制。`,
            `You have chosen to use this force.`,
        ],
        [LangTextType.A0221]: [
            `此规则已被设定为不可用于合作模式，因此无法修改此选项。`,
            `The war rule is not available for the Coop mode. Please change that first.`,
        ],
        [LangTextType.A0222]: [
            `无法切换控制权，因为其他势力都由AI控制。`,
            `All other forces are controlled by the A.I. already.`,
        ],
        [LangTextType.A0223]: [
            `请确保此地图已包含预设规则。`,
            `Please make sure that there is at least one preset war rule.`,
        ],
        [LangTextType.A0224]: [
            `这是《高级战争》1、2、DS版的网络对战版，独立于Tiny Wars。主要开发维护者：Amarriner、Walker、Matsuzen。`,
            `This is a web version of Advance Wars 1/2/Dual Strike, and is independent of Tiny Wars. Mainly developed/maintained by Amarriner, Walker and Matsuzen.`,
        ],
        [LangTextType.A0225]: [
            `您确定要继续吗？`,
            `Are you sure to continue?`,
        ],
        [LangTextType.A0226]: [
            `您确定要跳过剧情吗？`,
            `Are you sure to skip the story?`,
        ],

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Short strings.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        [LangTextType.B0000]: [
            "创建房间",
            "Create Rooms",
        ],
        [LangTextType.B0001]: [
            "无",
            "None",
        ],
        [LangTextType.B0002]: [
            "基本设置",
            "Basic Settings",
        ],
        [LangTextType.B0003]: [
            "高级设置",
            "Advanced Settings",
        ],
        [LangTextType.B0004]: [
            "红",
            "Red",
        ],
        [LangTextType.B0005]: [
            "蓝",
            "Blue",
        ],
        [LangTextType.B0006]: [
            "黄",
            "Yellow",
        ],
        [LangTextType.B0007]: [
            "黑",
            "Black",
        ],
        [LangTextType.B0008]: [
            "A队",
            "Team A",
        ],
        [LangTextType.B0009]: [
            "B队",
            "Team B",
        ],
        [LangTextType.B0010]: [
            "C队",
            "Team C",
        ],
        [LangTextType.B0011]: [
            "D队",
            "Team D",
        ],
        [LangTextType.B0012]: [
            "是",
            "Yes",
        ],
        [LangTextType.B0013]: [
            "否",
            "No",
        ],
        [LangTextType.B0014]: [
            "天",
            "d",
        ],
        [LangTextType.B0015]: [
            "时",
            "h",
        ],
        [LangTextType.B0016]: [
            "分",
            "m",
        ],
        [LangTextType.B0017]: [
            "秒",
            "s",
        ],
        [LangTextType.B0018]: [
            "行动次序",
            "Force",
        ],
        [LangTextType.B0019]: [
            "队伍",
            "Team",
        ],
        [LangTextType.B0020]: [
            "战争迷雾",
            "FoW",
        ],
        [LangTextType.B0021]: [
            "回合限时",
            "Time Limit",
        ],
        [LangTextType.B0022]: [
            "退出房间",
            "Exit Game"
        ],
        [LangTextType.B0023]: [
            "加入房间",
            "Join Room"
        ],
        [LangTextType.B0024]: [
            "继续战斗",
            "Continue",
        ],
        [LangTextType.B0025]: [
            `连接已断开`,
            `Disconnected`,
        ],
        [LangTextType.B0026]: [
            `确定`,
            `Confirm`,
        ],
        [LangTextType.B0027]: [
            `倒计时`,
            `Countdown`,
        ],
        [LangTextType.B0028]: [
            `即将超时`,
            `Timeout soon`,
        ],
        [LangTextType.B0029]: [
            `读取中`,
            `Now loading`,
        ],
        [LangTextType.B0030]: [
            `中立`,
            `Neutral`,
        ],
        [LangTextType.B0031]: [
            `玩家`,
            `Player`,
        ],
        [LangTextType.B0032]: [
            `金钱`,
            `Fund`,
        ],
        [LangTextType.B0033]: [
            `能量`,
            `Energy`,
        ],
        [LangTextType.B0034]: [
            `胜利`,
            `Win`,
        ],
        [LangTextType.B0035]: [
            `失败`,
            `Defeat`,
        ],
        [LangTextType.B0036]: [
            `结束回合`,
            `End Turn`,
        ],
        [LangTextType.B0037]: [
            `装载`,
            `load`,
        ],
        [LangTextType.B0038]: [
            `合流`,
            `Join`,
        ],
        [LangTextType.B0039]: [
            `攻击`,
            `Attack`,
        ],
        [LangTextType.B0040]: [
            `占领`,
            `Capture`,
        ],
        [LangTextType.B0041]: [
            `下潜`,
            `Dive`,
        ],
        [LangTextType.B0042]: [
            `上浮`,
            `Surface`,
        ],
        [LangTextType.B0043]: [
            `建造`,
            `Build`,
        ],
        [LangTextType.B0044]: [
            `补给`,
            `Supply`,
        ],
        [LangTextType.B0045]: [
            `发射`,
            `Launch`,
        ],
        [LangTextType.B0046]: [
            `卸载`,
            `Drop`,
        ],
        [LangTextType.B0047]: [
            `照明`,
            `Flare`,
        ],
        [LangTextType.B0048]: [
            `发射导弹`,
            `Silo`,
        ],
        [LangTextType.B0049]: [
            `制造`,
            `Produce`,
        ],
        [LangTextType.B0050]: [
            `待机`,
            `Wait`,
        ],
        [LangTextType.B0051]: [
            `生产材料已耗尽`,
            `No material`,
        ],
        [LangTextType.B0052]: [
            `没有空闲的装载位置`,
            `No empty load slot`,
        ],
        [LangTextType.B0053]: [
            `资金不足`,
            `Insufficient fund`,
        ],
        [LangTextType.B0054]: [
            `返回大厅`,
            `Go to lobby`,
        ],
        [LangTextType.B0055]: [
            `投降`,
            `Resign`,
        ],
        [LangTextType.B0056]: [
            `已战败`,
            `Defeat`
        ],
        [LangTextType.B0057]: [
            `日`,
            `Day`,
        ],
        [LangTextType.B0058]: [
            `月`,
            `Month`,
        ],
        [LangTextType.B0059]: [
            `年`,
            `Year`,
        ],
        [LangTextType.B0060]: [
            `排位积分`,
            `RankScore`,
        ],
        [LangTextType.B0061]: [
            `列兵`,
            `Lv.0`,
        ],
        [LangTextType.B0062]: [
            `上等兵`,
            `Lv.1`,
        ],
        [LangTextType.B0063]: [
            `下士`,
            `Lv.2`,
        ],
        [LangTextType.B0064]: [
            `中士`,
            `Lv.3`,
        ],
        [LangTextType.B0065]: [
            `上士`,
            `Lv.4`,
        ],
        [LangTextType.B0066]: [
            `军士长`,
            `Lv.5`,
        ],
        [LangTextType.B0067]: [
            `少尉`,
            `Lv.6`,
        ],
        [LangTextType.B0068]: [
            `中尉`,
            `Lv.7`,
        ],
        [LangTextType.B0069]: [
            `上尉`,
            `Lv.8`,
        ],
        [LangTextType.B0070]: [
            `少校`,
            `Lv.9`,
        ],
        [LangTextType.B0071]: [
            `中校`,
            `Lv.10`,
        ],
        [LangTextType.B0072]: [
            `上校`,
            `Lv.11`,
        ],
        [LangTextType.B0073]: [
            `大校`,
            `Lv.12`,
        ],
        [LangTextType.B0074]: [
            `少将`,
            `Lv.13`,
        ],
        [LangTextType.B0075]: [
            `中将`,
            `Lv.14`,
        ],
        [LangTextType.B0076]: [
            `上将`,
            `Lv.15`,
        ],
        [LangTextType.B0077]: [
            `攻`,
            `Deal`,
        ],
        [LangTextType.B0078]: [
            `反`,
            `Take`,
        ],
        [LangTextType.B0079]: [
            `费用`,
            `Cost`,
        ],
        [LangTextType.B0080]: [
            `高级`,
            `Advanced`,
        ],
        [LangTextType.B0081]: [
            `删除部队`,
            `Delete Unit`,
        ],
        [LangTextType.B0082]: [
            `和局`,
            `Drawn Game`,
        ],
        [LangTextType.B0083]: [
            `求和`,
            `Request Draw`,
        ],
        [LangTextType.B0084]: [
            `同意和局`,
            `Agree Draw`,
        ],
        [LangTextType.B0085]: [
            `拒绝和局`,
            `Decline Draw`,
        ],
        [LangTextType.B0086]: [
            `回合中`,
            `In Turn`,
        ],
        [LangTextType.B0087]: [
            `战局已结束`,
            `Game Ended`,
        ],
        [LangTextType.B0088]: [
            `提示`,
            `Message`,
        ],
        [LangTextType.B0089]: [
            `刷新战局`,
            `Refresh`,
        ],
        [LangTextType.B0090]: [
            `行动数`,
            `Actions`,
        ],
        [LangTextType.B0091]: [
            `回合数`,
            `Turns`,
        ],
        [LangTextType.B0092]: [
            `观看回放`,
            `Replays`,
        ],
        [LangTextType.B0093]: [
            `回放已结束`,
            `The replay is completed.`,
        ],
        [LangTextType.B0094]: [
            `开始回合`,
            `Begin turn`,
        ],
        [LangTextType.B0095]: [
            `生产`,
            `Produce`,
        ],
        [LangTextType.B0096]: [
            `提议和局`,
            `Propose a draw`,
        ],
        [LangTextType.B0097]: [
            `发起攻击`,
            `Launch an attack`,
        ],
        [LangTextType.B0098]: [
            `装载部队`,
            `Load a unit`,
        ],
        [LangTextType.B0099]: [
            `建造建筑`,
            `Build a building`,
        ],
        [LangTextType.B0100]: [
            `占领建筑`,
            `Capture a building`,
        ],
        [LangTextType.B0101]: [
            `部队下潜`,
            `Unit dive`,
        ],
        [LangTextType.B0102]: [
            `卸载部队`,
            `Drop unit(s)`,
        ],
        [LangTextType.B0103]: [
            `部队合流`,
            `Join units`,
        ],
        [LangTextType.B0104]: [
            `发射照明弹`,
            `Launch a flare`,
        ],
        [LangTextType.B0105]: [
            `发射导弹`,
            `Launch a silo`,
        ],
        [LangTextType.B0106]: [
            `生产舰载机`,
            `Produce a seaplane`,
        ],
        [LangTextType.B0107]: [
            `补给部队`,
            `Supply unit(s)`,
        ],
        [LangTextType.B0108]: [
            `部队上浮`,
            `Unit surface`,
        ],
        [LangTextType.B0109]: [
            `部队移动`,
            `Unit move`,
        ],
        [LangTextType.B0110]: [
            `发生未知错误`,
            `Something errors`,
        ],
        [LangTextType.B0111]: [
            `中立玩家`,
            `Neutral`,
        ],
        [LangTextType.B0112]: [
            `步兵`,
            `Inf`,
        ],
        [LangTextType.B0113]: [
            `反坦克兵`,
            `Mech`,
        ],
        [LangTextType.B0114]: [
            `履带`,
            `Tank`,
        ],
        [LangTextType.B0115]: [
            `轮胎A`,
            `TireA`,
        ],
        [LangTextType.B0116]: [
            `轮胎B`,
            `TireB`,
        ],
        [LangTextType.B0117]: [
            `飞行`,
            `Air`,
        ],
        [LangTextType.B0118]: [
            `航行`,
            `Ship`,
        ],
        [LangTextType.B0119]: [
            `运输`,
            `Trans`,
        ],
        [LangTextType.B0120]: [
            `全部`,
            `All`,
        ],
        [LangTextType.B0121]: [
            `陆军`,
            `Ground`,
        ],
        [LangTextType.B0122]: [
            `海军`,
            `Naval`,
        ],
        [LangTextType.B0123]: [
            `空军`,
            `Air`,
        ],
        [LangTextType.B0124]: [
            `陆军&海军`,
            `Ground & Naval`,
        ],
        [LangTextType.B0125]: [
            `陆军&空军`,
            `Ground & Air`,
        ],
        [LangTextType.B0126]: [
            `近战`,
            `Direct`,
        ],
        [LangTextType.B0127]: [
            `远程`,
            `Indirect`,
        ],
        [LangTextType.B0128]: [
            `步行`,
            `Foot`,
        ],
        [LangTextType.B0129]: [
            `步兵系`,
            `Inf`,
        ],
        [LangTextType.B0130]: [
            `车辆系`,
            `Vehicle`,
        ],
        [LangTextType.B0131]: [
            `近战机械`,
            `DirectMachine`,
        ],
        [LangTextType.B0132]: [
            `运输系`,
            `Transport`,
        ],
        [LangTextType.B0133]: [
            `大型船只`,
            `LargeNaval`,
        ],
        [LangTextType.B0134]: [
            `直升机`,
            `Copter`,
        ],
        [LangTextType.B0135]: [
            `坦克`,
            `Tank`,
        ],
        [LangTextType.B0136]: [
            `空军除舰载机`,
            `AirExceptSeaplane`,
        ],
        [LangTextType.B0137]: [
            `多人对战`,
            `Multi Player`,
        ],
        [LangTextType.B0138]: [
            `单人模式`,
            `Single Player`,
        ],
        [LangTextType.B0139]: [
            `CO搭乘`,
            `CO Board`,
        ],
        [LangTextType.B0140]: [
            `CO信息`,
            `CO Info`,
        ],
        [LangTextType.B0141]: [
            `无限`,
            `Infinity`,
        ],
        [LangTextType.B0142]: [
            `发动COP`,
            `Power`,
        ],
        [LangTextType.B0143]: [
            `帮助`,
            `Help`,
        ],
        [LangTextType.B0144]: [
            `发动SCOP`,
            `SCOP`,
        ],
        [LangTextType.B0145]: [
            `选择CO`,
            `Choose a CO`,
        ],
        [LangTextType.B0146]: [
            `返回`,
            `Back`,
        ],
        [LangTextType.B0147]: [
            `CO系统规则`,
            `CO Rules`,
        ],
        [LangTextType.B0148]: [
            `切换语言`,
            `Change Language`,
        ],
        [LangTextType.B0149]: [
            `更改昵称`,
            `Change Nickname`,
        ],
        [LangTextType.B0150]: [
            `更改Discord ID`,
            `Change Discord ID`,
        ],
        [LangTextType.B0151]: [
            `查看在线玩家`,
            `Online Players`,
        ],
        [LangTextType.B0152]: [
            `部队列表`,
            `Units`,
        ],
        [LangTextType.B0153]: [
            `寻找建筑`,
            `Building`,
        ],
        [LangTextType.B0154]: [
            `取消`,
            `Cancel`,
        ],
        [LangTextType.B0155]: [
            `菜单`,
            `Menu`,
        ],
        [LangTextType.B0156]: [
            `资金`,
            `Fund`,
        ],
        [LangTextType.B0157]: [
            `收入`,
            `Income`,
        ],
        [LangTextType.B0158]: [
            `建筑数`,
            `Buildings`,
        ],
        [LangTextType.B0159]: [
            `能量`,
            `Energy`,
        ],
        [LangTextType.B0160]: [
            `部队数`,
            `Units`,
        ],
        [LangTextType.B0161]: [
            `部队价值`,
            `Units Value`,
        ],
        [LangTextType.B0162]: [
            `姓名`,
            `Name`,
        ],
        [LangTextType.B0163]: [
            `设计者`,
            `Designer`,
        ],
        [LangTextType.B0164]: [
            `搭载费用`,
            `Boarding Cost`,
        ],
        [LangTextType.B0165]: [
            `Zone范围`,
            `Zone Radius`,
        ],
        [LangTextType.B0166]: [
            `Zone扩张能量值`,
            `ZoneExpandingEnergy`,
        ],
        [LangTextType.B0167]: [
            `能量消耗`,
            `Energy Cost`,
        ],
        [LangTextType.B0168]: [
            `势力`,
            `Force`,
        ],
        [LangTextType.B0169]: [
            `我的履历`,
            `Profile`,
        ],
        [LangTextType.B0170]: [
            `账号`,
            `Account`,
        ],
        [LangTextType.B0171]: [
            `密码`,
            `Password`,
        ],
        [LangTextType.B0172]: [
            `记住密码`,
            `Remember Password`,
        ],
        [LangTextType.B0173]: [
            `登录`,
            `Login`,
        ],
        [LangTextType.B0174]: [
            `注册`,
            `Register`,
        ],
        [LangTextType.B0175]: [
            `昵称`,
            `Nickname`,
        ],
        [LangTextType.B0176]: [
            `打开地形动画`,
            `Tile Animation On`,
        ],
        [LangTextType.B0177]: [
            `关闭地形动画`,
            `Tile Animation Off`,
        ],
        [LangTextType.B0178]: [
            `初始资金`,
            `Initial Fund`,
        ],
        [LangTextType.B0179]: [
            `收入倍率%`,
            `Income Multiplier %`,
        ],
        [LangTextType.B0180]: [
            `装载CO时获得能量%`,
            `Energy Gain % on Load CO`,
        ],
        [LangTextType.B0181]: [
            `能量增速%`,
            `Energy Growth Multiplier %`,
        ],
        [LangTextType.B0182]: [
            `移动力加成`,
            `Movement Bonus`,
        ],
        [LangTextType.B0183]: [
            `攻击力加成%`,
            `Offense Bonus %`,
        ],
        [LangTextType.B0184]: [
            `视野加成`,
            `Vision Bonus`,
        ],
        [LangTextType.B0185]: [
            `房间名称`,
            `Game Name`,
        ],
        [LangTextType.B0186]: [
            `房间密码`,
            `Game Password`,
        ],
        [LangTextType.B0187]: [
            `附言`,
            `Comment`,
        ],
        [LangTextType.B0188]: [
            `回合限时`,
            `Boot Timer`,
        ],
        [LangTextType.B0189]: [
            `幸运下限%`,
            `Min Luck %`,
        ],
        [LangTextType.B0190]: [
            `幸运上限%`,
            `Max Luck %`,
        ],
        [LangTextType.B0191]: [
            `回合`,
            `Turn`,
        ],
        [LangTextType.B0192]: [
            `管理地图`,
            `Map Management`,
        ],
        [LangTextType.B0193]: [
            `可用性`,
            `Availability`,
        ],
        [LangTextType.B0194]: [
            `注册时间`,
            `Registration`,
        ],
        [LangTextType.B0195]: [
            `上次登陆时间`,
            `Last Login`,
        ],
        [LangTextType.B0196]: [
            `在线总时长`,
            `Online Time`,
        ],
        [LangTextType.B0197]: [
            `登陆次数`,
            `Login Times`,
        ],
        [LangTextType.B0198]: [
            `明战排位积分`,
            `Std Rank Score`,
        ],
        [LangTextType.B0199]: [
            `雾战排位积分`,
            `FoW Rank Score`,
        ],
        [LangTextType.B0200]: [
            `多人自由对战`,
            `MP Custom Games`,
        ],
        [LangTextType.B0201]: [
            `历史战绩`,
            `History`,
        ],
        [LangTextType.B0202]: [
            `3人局`,
            `3P`,
        ],
        [LangTextType.B0203]: [
            `4人局`,
            `4P`,
        ],
        [LangTextType.B0204]: [
            `关闭`,
            `Close`,
        ],
        [LangTextType.B0205]: [
            `多人游戏`,
            `Multi Player`,
        ],
        [LangTextType.B0206]: [
            `观战`,
            `Watch`,
        ],
        [LangTextType.B0207]: [
            `发起请求`,
            `Make Request`,
        ],
        [LangTextType.B0208]: [
            `处理请求`,
            `Handle Request`,
        ],
        [LangTextType.B0209]: [
            `暂无请求`,
            `No Requests`,
        ],
        [LangTextType.B0210]: [
            `暂无战局`,
            `No Wars`,
        ],
        [LangTextType.B0211]: [
            `无`,
            `No`,
        ],
        [LangTextType.B0212]: [
            `已请求`,
            `Requested`,
        ],
        [LangTextType.B0213]: [
            `正在观战`,
            `Watching`,
        ],
        [LangTextType.B0214]: [
            `同意`,
            `Accept`,
        ],
        [LangTextType.B0215]: [
            `拒绝`,
            `Decline`,
        ],
        [LangTextType.B0216]: [
            `自己`,
            `Self`,
        ],
        [LangTextType.B0217]: [
            `对手`,
            `Opponent`,
        ],
        [LangTextType.B0218]: [
            `已观战他人`,
            `Watching Others`,
        ],
        [LangTextType.B0219]: [
            `删除观战者`,
            `Delete Watcher`,
        ],
        [LangTextType.B0220]: [
            `删除`,
            `Delete`,
        ],
        [LangTextType.B0221]: [
            `保留`,
            `Keep`,
        ],
        [LangTextType.B0222]: [
            `继续观战`,
            `Continue`,
        ],
        [LangTextType.B0223]: [
            `战局信息`,
            `War Info`,
        ],
        [LangTextType.B0224]: [
            `玩家信息`,
            `Player Info`,
        ],
        [LangTextType.B0225]: [
            `地图名称`,
            `Map Name`,
        ],
        [LangTextType.B0226]: [
            `战局ID`,
            `War ID`,
        ],
        [LangTextType.B0227]: [
            `选择地图`,
            `Select a Map`,
        ],
        [LangTextType.B0228]: [
            `查找`,
            `Search`,
        ],
        [LangTextType.B0229]: [
            `玩家数量`,
            `Players`,
        ],
        [LangTextType.B0230]: [
            `更换CO`,
            `Change CO`,
        ],
        [LangTextType.B0231]: [
            `我的回合`,
            `My Turn`,
        ],
        [LangTextType.B0232]: [
            `玩家`,
            `Players`,
        ],
        [LangTextType.B0233]: [
            `全部显示`,
            `Show All`,
        ],
        [LangTextType.B0234]: [
            `查找回放`,
            `Search Replay`,
        ],
        [LangTextType.B0235]: [
            `回放ID`,
            `Replay ID`,
        ],
        [LangTextType.B0236]: [
            `在线玩家列表`,
            `Online Players List`,
        ],
        [LangTextType.B0237]: [
            `当前在线人数`,
            `Online Players`
        ],
        [LangTextType.B0238]: [
            `可用CO`,
            `Available COs`,
        ],
        [LangTextType.B0239]: [
            `最大`,
            `Max.`,
        ],
        [LangTextType.B0240]: [
            `指挥官信息`,
            `CO Info`,
        ],
        [LangTextType.B0241]: [
            `暂无回放`,
            `No Replays`,
        ],
        [LangTextType.B0242]: [
            `新昵称`,
            `New nickname`,
        ],
        [LangTextType.B0243]: [
            `新ID`,
            `New ID`,
        ],
        [LangTextType.B0244]: [
            `切换玩家`,
            `Next Player`,
        ],
        [LangTextType.B0245]: [
            `房间设定总览`,
            `Overview Room Settings`,
        ],
        [LangTextType.B0246]: [
            `进入战局`,
            `Enter Game`,
        ],
        [LangTextType.B0247]: [
            `上个回合`,
            `Prev. Turn`,
        ],
        [LangTextType.B0248]: [
            `下个回合`,
            `Next Turn`,
        ],
        [LangTextType.B0249]: [
            `开始回放`,
            `Start Replays`,
        ],
        [LangTextType.B0250]: [
            `暂停回放`,
            `Pause Replays`,
        ],
        [LangTextType.B0251]: [
            `作者`,
            `Designer`,
        ],
        [LangTextType.B0252]: [
            `游玩次数`,
            `Games Played`,
        ],
        [LangTextType.B0253]: [
            `评分`,
            `Rating`,
        ],
        [LangTextType.B0254]: [
            `单人明战`,
            `Free Battle`,
        ],
        [LangTextType.B0255]: [
            `存档编号`,
            `Save Slot`,
        ],
        [LangTextType.B0256]: [
            `电脑`,
            `COM`,
        ],
        [LangTextType.B0257]: [
            `War Room`,
            `War Room`,
        ],
        [LangTextType.B0258]: [
            `选择`,
            `Select`,
        ],
        [LangTextType.B0259]: [
            `选择存档位置`,
            `Select Save Slot`,
        ],
        [LangTextType.B0260]: [
            `存档`,
            `Save Game`,
        ],
        [LangTextType.B0261]: [
            `读档`,
            `Load Game`,
        ],
        [LangTextType.B0262]: [
            `重载所有地图`,
            `Reload Maps`,
        ],
        [LangTextType.B0267]: [
            `详细信息`,
            `Detailed Info`,
        ],
        [LangTextType.B0268]: [
            `合并地图`,
            `Merge Maps`,
        ],
        [LangTextType.B0269]: [
            `无可合并的地图`,
            `No Maps`,
        ],
        [LangTextType.B0270]: [
            `删除地图`,
            `Delete Map`,
        ],
        [LangTextType.B0271]: [
            `地图编辑器`,
            `Map Editor`,
        ],
        [LangTextType.B0272]: [
            `地图列表`,
            `Map List`,
        ],
        [LangTextType.B0273]: [
            `未提审`,
            `Not Reviewed`,
        ],
        [LangTextType.B0274]: [
            `审核中`,
            `Reviewing`,
        ],
        [LangTextType.B0275]: [
            `被拒审`,
            `Rejected`,
        ],
        [LangTextType.B0276]: [
            `已过审`,
            `Accepted`,
        ],
        [LangTextType.B0277]: [
            `未命名`,
            `Unnamed`,
        ],
        [LangTextType.B0278]: [
            `无数据`,
            `No Data`,
        ],
        [LangTextType.B0279]: [
            `新地图`,
            `New Map`,
        ],
        [LangTextType.B0280]: [
            `模式`,
            `Mode`,
        ],
        [LangTextType.B0281]: [
            `绘制部队`,
            `Draw Unit`,
        ],
        [LangTextType.B0282]: [
            `绘制地形基底`,
            `Draw Tile Base`,
        ],
        [LangTextType.B0283]: [
            `绘制地形物体`,
            `Draw Tile Object`,
        ],
        [LangTextType.B0284]: [
            `删除部队`,
            `Del Unit`,
        ],
        [LangTextType.B0285]: [
            `删除地形物体`,
            `Del Tile Object`,
        ],
        [LangTextType.B0286]: [
            `预览`,
            `Preview`,
        ],
        [LangTextType.B0287]: [
            `保存地图`,
            `Save Map`,
        ],
        [LangTextType.B0288]: [
            `读取地图`,
            `Load Map`,
        ],
        [LangTextType.B0289]: [
            `提审`,
            `Submit for review`,
        ],
        [LangTextType.B0290]: [
            `调整大小`,
            `Resize`,
        ],
        [LangTextType.B0291]: [
            `当前宽高`,
            `Current W/H`,
        ],
        [LangTextType.B0292]: [
            `新的宽高`,
            `New W/H`,
        ],
        [LangTextType.B0293]: [
            `地图偏移`,
            `Map Offset`,
        ],
        [LangTextType.B0294]: [
            `全图填充`,
            `Fill Map`,
        ],
        [LangTextType.B0295]: [
            `审核地图`,
            `Review Maps`,
        ],
        [LangTextType.B0296]: [
            `过审`,
            `Accept`,
        ],
        [LangTextType.B0297]: [
            `拒审`,
            `Reject`,
        ],
        [LangTextType.B0298]: [
            `地图信息`,
            `Map Info`,
        ],
        [LangTextType.B0299]: [
            `地图英文名称`,
            `Map English Name`,
        ],
        [LangTextType.B0300]: [
            `地图尺寸`,
            `Map Size`,
        ],
        [LangTextType.B0301]: [
            `可见性`,
            `Visibility`,
        ],
        [LangTextType.B0302]: [
            `地形基底`,
            `Tile Bases`,
        ],
        [LangTextType.B0303]: [
            `地形物体`,
            `Tile Objects`,
        ],
        [LangTextType.B0304]: [
            `部队`,
            `Units`,
        ],
        [LangTextType.B0305]: [
            `拒审理由`,
            `Reason for Rejection`,
        ],
        [LangTextType.B0306]: [
            `对称性`,
            `Symmetry`,
        ],
        [LangTextType.B0307]: [
            `自动绘制地形`,
            `Auto Draw Tile`,
        ],
        [LangTextType.B0308]: [
            `上下对称`,
            `U to D`,
        ],
        [LangTextType.B0309]: [
            `左右对称`,
            `L to R`,
        ],
        [LangTextType.B0310]: [
            `旋转对称`,
            `Rotational`,
        ],
        [LangTextType.B0311]: [
            `左上右下对称`,
            `UL to DR`,
        ],
        [LangTextType.B0312]: [
            `右上左下对称`,
            `UR to DL`,
        ],
        [LangTextType.B0313]: [
            `导入`,
            `Import`,
        ],
        [LangTextType.B0314]: [
            `预设规则`,
            `Preset Rules`,
        ],
        [LangTextType.B0315]: [
            `规则名称`,
            `Rule Name`,
        ],
        [LangTextType.B0316]: [
            `规则英文名`,
            `Rule English Name`,
        ],
        [LangTextType.B0317]: [
            `修改`,
            `Modify`,
        ],
        [LangTextType.B0318]: [
            `规则`,
            `Rule`,
        ],
        [LangTextType.B0319]: [
            `值域`,
            `Range`,
        ],
        [LangTextType.B0320]: [
            `新增`,
            `Add`,
        ],
        [LangTextType.B0321]: [
            `自定义`,
            `Custom`,
        ],
        [LangTextType.B0322]: [
            `无`,
            `Empty`,
        ],
        [LangTextType.B0323]: [
            `只能使用数字`,
            `Digits only`,
        ],
        [LangTextType.B0324]: [
            `暂无预览`,
            `No Preview`,
        ],
        [LangTextType.B0325]: [
            `模拟战`,
            `Simulation`,
        ],
        [LangTextType.B0326]: [
            `评审意见`,
            `Comments`,
        ],
        [LangTextType.B0327]: [
            `服务器状态`,
            `Server Status`,
        ],
        [LangTextType.B0328]: [
            `账号总数`,
            `Accounts`,
        ],
        [LangTextType.B0329]: [
            `在线总时长`,
            `Online Time`,
        ],
        [LangTextType.B0330]: [
            `新增账号数`,
            `New Accounts`,
        ],
        [LangTextType.B0331]: [
            `活跃账号数`,
            `Active Accounts`,
        ],
        [LangTextType.B0332]: [
            `无可用选项`,
            `No available options`,
        ],
        [LangTextType.B0333]: [
            `建筑统计`,
            `Buildings`,
        ],
        [LangTextType.B0334]: [
            `基础伤害表`,
            `Base Damage Chart`,
        ],
        [LangTextType.B0335]: [
            `攻击(主)`,
            `ATK(main)`,
        ],
        [LangTextType.B0336]: [
            `攻击(副)`,
            `ATK(sub)`,
        ],
        [LangTextType.B0337]: [
            `受击(主)`,
            `DEF(main)`,
        ],
        [LangTextType.B0338]: [
            `受击(副)`,
            `DEF(sub)`,
        ],
        [LangTextType.B0339]: [
            `HP`,
            `HP`,
        ],
        [LangTextType.B0340]: [
            `移动力`,
            `Movement`,
        ],
        [LangTextType.B0341]: [
            `造价`,
            `Production Cost`,
        ],
        [LangTextType.B0342]: [
            `燃料`,
            `Fuel`,
        ],
        [LangTextType.B0343]: [
            `燃料消耗量`,
            `Fuel Consumption`,
        ],
        [LangTextType.B0344]: [
            `耗尽燃料时自毁`,
            `Explodes without fuel`,
        ],
        [LangTextType.B0345]: [
            `攻击距离`,
            `Attack Range`,
        ],
        [LangTextType.B0346]: [
            `移动后攻击`,
            `Run & hit`,
        ],
        [LangTextType.B0347]: [
            `建筑材料`,
            `Build Material`,
        ],
        [LangTextType.B0348]: [
            `生产材料`,
            `Production Material`,
        ],
        [LangTextType.B0349]: [
            `照明弹`,
            `Flare Ammo`,
        ],
        [LangTextType.B0350]: [
            `主武器弹药`,
            `Primary Weapon Ammo`,
        ],
        [LangTextType.B0351]: [
            `移动基础消耗表`,
            `Base Move Cost Chart`,
        ],
        [LangTextType.B0352]: [
            `防御加成`,
            `Defense Bonus`,
        ],
        [LangTextType.B0353]: [
            `资金收入`,
            `Income`,
        ],
        [LangTextType.B0354]: [
            `视野范围`,
            `Vision Range`,
        ],
        [LangTextType.B0355]: [
            `对全体玩家生效`,
            `For all players`,
        ],
        [LangTextType.B0356]: [
            `雾战中隐蔽部队`,
            `Hide units in FoW`,
        ],
        [LangTextType.B0357]: [
            `被占领即失败`,
            `Defeat if captured`,
        ],
        [LangTextType.B0358]: [
            `生产部队`,
            `Produce Unit`,
        ],
        [LangTextType.B0359]: [
            `全局攻防加成`,
            `Global ATK/DEF Bonus`,
        ],
        [LangTextType.B0360]: [
            `部队维修量`,
            `Repair Amount`,
        ],
        [LangTextType.B0361]: [
            `占领点数`,
            `Capture Point`,
        ],
        [LangTextType.B0362]: [
            `建筑点数`,
            `Build Point`,
        ],
        [LangTextType.B0363]: [
            `我的评分`,
            `My Rating`,
        ],
        [LangTextType.B0364]: [
            `全服评分`,
            `Global Rating`,
        ],
        [LangTextType.B0365]: [
            `评分`,
            `Set Rating`,
        ],
        [LangTextType.B0366]: [
            `开启作弊模式`,
            `Cheating`,
        ],
        [LangTextType.B0367]: [
            `状态`,
            `Status`,
        ],
        [LangTextType.B0368]: [
            `已行动`,
            `Waiting`,
        ],
        [LangTextType.B0369]: [
            `空闲`,
            `Idle`,
        ],
        [LangTextType.B0370]: [
            `晋升等级`,
            `Promotion`,
        ],
        [LangTextType.B0371]: [
            `下潜中`,
            `Diving`,
        ],
        [LangTextType.B0372]: [
            `最近`,
            `Recent`,
        ],
        [LangTextType.B0373]: [
            `公共(英语)`,
            `Public(EN)`,
        ],
        [LangTextType.B0374]: [
            `系统频道`,
            `System`,
        ],
        [LangTextType.B0375]: [
            `字数太多`,
            `Too many characters`,
        ],
        [LangTextType.B0376]: [
            `频道`,
            `Channel`,
        ],
        [LangTextType.B0377]: [
            `组队`,
            `Team`,
        ],
        [LangTextType.B0378]: [
            `私聊`,
            `Private`,
        ],
        [LangTextType.B0379]: [
            `全局`,
            `Global`,
        ],
        [LangTextType.B0380]: [
            `聊天列表`,
            `Chat List`,
        ],
        [LangTextType.B0381]: [
            `暂无消息`,
            `No Message`,
        ],
        [LangTextType.B0382]: [
            `发送`,
            `Send`,
        ],
        [LangTextType.B0383]: [
            `聊天`,
            `Chat`
        ],
        [LangTextType.B0384]: [
            `公共(中文)`,
            `Public(CN)`,
        ],
        [LangTextType.B0385]: [
            `原版`,
            `Legacy`,
        ],
        [LangTextType.B0386]: [
            `新版`,
            `New`,
        ],
        [LangTextType.B0387]: [
            `常规`,
            `Regular`,
        ],
        [LangTextType.B0388]: [
            `增量`,
            `Incremental`,
        ],
        [LangTextType.B0389]: [
            `初始时间`,
            `Initial Time`,
        ],
        [LangTextType.B0390]: [
            `增量时间`,
            `Incremental Time`,
        ],
        [LangTextType.B0391]: [
            `清空`,
            `Clear`,
        ],
        [LangTextType.B0392]: [
            `游戏已开始`,
            `Game Started`,
        ],
        [LangTextType.B0393]: [
            `玩家昵称`,
            `User Nickname`,
        ],
        [LangTextType.B0394]: [
            `CO名称`,
            `CO Name`,
        ],
        [LangTextType.B0395]: [
            `玩家列表`,
            `Players List`,
        ],
        [LangTextType.B0396]: [
            `超时告负`,
            `Boot`,
        ],
        [LangTextType.B0397]: [
            `势力颜色`,
            `Color`,
        ],
        [LangTextType.B0398]: [
            `房间信息`,
            `Room Info`,
        ],
        [LangTextType.B0399]: [
            `修改规则`,
            `Modify Rules`,
        ],
        [LangTextType.B0400]: [
            `删除房间`,
            `Delete Room`,
        ],
        [LangTextType.B0401]: [
            `开战`,
            `Start Game`,
        ],
        [LangTextType.B0402]: [
            `准备就绪`,
            `Ready`,
        ],
        [LangTextType.B0403]: [
            `禁用CO数量`,
            `Banned COs Number`,
        ],
        [LangTextType.B0404]: [
            `排位赛`,
            `Ranking Match`,
        ],
        [LangTextType.B0405]: [
            `房间`,
            `Room`,
        ],
        [LangTextType.B0406]: [
            `规则可用性`,
            `Rule Availability`,
        ],
        [LangTextType.B0407]: [
            `玩家规则列表`,
            `Player Rule List`,
        ],
        [LangTextType.B0408]: [
            `排位赛(雾战)`,
            `Ranking Match FoW`,
        ],
        [LangTextType.B0409]: [
            `单人自定义游戏`,
            `SP Custom Games`,
        ],
        [LangTextType.B0410]: [
            `我的房间`,
            `My Rooms`,
        ],
        [LangTextType.B0411]: [
            `踢出`,
            `Kick Off`,
        ],
        [LangTextType.B0412]: [
            `数量`,
            `Number`,
        ],
        [LangTextType.B0413]: [
            `设定战局数量`,
            `Set Games Number`,
        ],
        [LangTextType.B0414]: [
            `房间状态`,
            `Room Status`,
        ],
        [LangTextType.B0415]: [
            `排位明战`,
            `Rank Std`,
        ],
        [LangTextType.B0416]: [
            `排位雾战`,
            `Rank FoW`,
        ],
        [LangTextType.B0417]: [
            `自由明战`,
            `Custom Std`,
        ],
        [LangTextType.B0418]: [
            `自由雾战`,
            `Custom FoW`,
        ],
        [LangTextType.B0419]: [
            `地图编辑器`,
            `Map Editor`,
        ],
        [LangTextType.B0420]: [
            `删除存档`,
            `Delete War`,
        ],
        [LangTextType.B0421]: [
            `已搭载CO`,
            `CO on board`,
        ],
        [LangTextType.B0422]: [
            `战斗`,
            `Fight`,
        ],
        [LangTextType.B0423]: [
            `信息`,
            `Info`,
        ],
        [LangTextType.B0424]: [
            `控制者`,
            `Controller`,
        ],
        [LangTextType.B0425]: [
            `CO`,
            `CO`,
        ],
        [LangTextType.B0426]: [
            `修改密码`,
            `Change Password`,
        ],
        [LangTextType.B0427]: [
            `旧密码`,
            `Old Password`,
        ],
        [LangTextType.B0428]: [
            `新密码`,
            `New Password`,
        ],
        [LangTextType.B0429]: [
            `确认密码`,
            `Confirm Password`,
        ],
        [LangTextType.B0430]: [
            `SetPath模式`,
            `Set Path Mode`,
        ],
        [LangTextType.B0431]: [
            `已启用`,
            `Enabled`,
        ],
        [LangTextType.B0432]: [
            `已禁用`,
            `Disabled`,
        ],
        [LangTextType.B0433]: [
            `启用`,
            `Enable`,
        ],
        [LangTextType.B0434]: [
            `禁用`,
            `Disable`,
        ],
        [LangTextType.B0435]: [
            `未上榜`,
            `No Rank`,
        ],
        [LangTextType.B0436]: [
            `排位积分榜`,
            `Rank List`,
        ],
        [LangTextType.B0437]: [
            `标准`,
            `Standard`,
        ],
        [LangTextType.B0438]: [
            `雾战`,
            `Fog of War`,
        ],
        [LangTextType.B0439]: [
            `能否下潜`,
            `Can Dive`,
        ],
        [LangTextType.B0440]: [
            `部队属性表`,
            `Units Info`,
        ],
        [LangTextType.B0441]: [
            `标准图池`,
            `Standard Maps`,
        ],
        [LangTextType.B0442]: [
            `雾战图池`,
            `Fog Maps`,
        ],
        [LangTextType.B0443]: [
            `多人房间`,
            `MP Room`,
        ],
        [LangTextType.B0444]: [
            `设置标签`,
            `Set Tags`,
        ],
        [LangTextType.B0445]: [
            `地图标签`,
            `Map Tags`,
        ],
        [LangTextType.B0446]: [
            `忽略`,
            `Ignored`,
        ],
        [LangTextType.B0447]: [
            `查找地图`,
            `Search Maps`,
        ],
        [LangTextType.B0448]: [
            `需要密码`,
            `Password required`,
        ],
        [LangTextType.B0449]: [
            `输入密码`,
            `Input Password`,
        ],
        [LangTextType.B0450]: [
            `势力被摧毁`,
            `'s force is destroyed`,
        ],
        [LangTextType.B0451]: [
            `触发事件`,
            `An event is triggered.`,
        ],
        [LangTextType.B0452]: [
            `错误码`,
            `Error`,
        ],
        [LangTextType.B0453]: [
            `意见反馈`,
            `Complaint`,
        ],
        [LangTextType.B0454]: [
            `新增日志`,
            `Add Log`,
        ],
        [LangTextType.B0455]: [
            `中文`,
            `In Chinese`,
        ],
        [LangTextType.B0456]: [
            `英文`,
            `In English`,
        ],
        [LangTextType.B0457]: [
            `更新日志`,
            `Change Log`,
        ],
        [LangTextType.B0458]: [
            `设定地图名称`,
            `Edit Map Name`,
        ],
        [LangTextType.B0459]: [
            `设定规则名称`,
            `Edit Rule Name`,
        ],
        [LangTextType.B0460]: [
            `设置权限`,
            `Set Privilege`,
        ],
        [LangTextType.B0461]: [
            `战局事件列表`,
            `War Event List`,
        ],
        [LangTextType.B0462]: [
            `战局事件ID`,
            `War Event ID`,
        ],
        [LangTextType.B0463]: [
            `上移`,
            `Up`,
        ],
        [LangTextType.B0464]: [
            `下移`,
            `Down`,
        ],
        [LangTextType.B0465]: [
            `编辑`,
            `Edit`,
        ],
        [LangTextType.B0466]: [
            `已添加`,
            `Added`,
        ],
        [LangTextType.B0467]: [
            `添加`,
            `Add`,
        ],
        [LangTextType.B0468]: [
            `添加事件到规则`,
            `Add War Event To Rule`,
        ],
        [LangTextType.B0469]: [
            `战局事件`,
            `War Event`,
        ],
        [LangTextType.B0470]: [
            `事件列表`,
            `Event List`,
        ],
        [LangTextType.B0471]: [
            `存活`,
            `Alive`,
        ],
        [LangTextType.B0472]: [
            `已战败`,
            `Defeated`,
        ],
        [LangTextType.B0473]: [
            `即将战败`,
            `Being Defeated`,
        ],
        [LangTextType.B0474]: [
            `准备阶段`,
            `Standby Phase`,
        ],
        [LangTextType.B0475]: [
            `主要阶段`,
            `Main Phase`,
        ],
        [LangTextType.B0476]: [
            `事件在每个玩家回合的触发次数上限`,
            `Upper limit of trigger times per player's turn`,
        ],
        [LangTextType.B0477]: [
            `事件在整局游戏中的触发次数上限`,
            `Upper limit of trigger times per game`,
        ],
        [LangTextType.B0478]: [
            `修改事件名称`,
            `Edit Event Name`,
        ],
        [LangTextType.B0479]: [
            `删除事件`,
            `Delete Event`,
        ],
        [LangTextType.B0480]: [
            `替换`,
            `Replace`,
        ],
        [LangTextType.B0481]: [
            `删除条件节点`,
            `Delete Condition Node`,
        ],
        [LangTextType.B0482]: [
            `切换与/或`,
            `ALL/ANY`,
        ],
        [LangTextType.B0483]: [
            `+子条件`,
            `Sub Cond.`,
        ],
        [LangTextType.B0484]: [
            `+子节点`,
            `Sub Node`,
        ],
        [LangTextType.B0485]: [
            `删除条件`,
            `Delete Condition`,
        ],
        [LangTextType.B0486]: [
            `删除动作`,
            `Delete Action`,
        ],
        [LangTextType.B0487]: [
            `克隆`,
            `Clone`,
        ],
        [LangTextType.B0488]: [
            `条件节点`,
            `Condition Node`,
        ],
        [LangTextType.B0489]: [
            `子节点`,
            `Sub Node`,
        ],
        [LangTextType.B0490]: [
            `子条件`,
            `Sub Condition`,
        ],
        [LangTextType.B0491]: [
            `替换条件节点`,
            `Replace Condition Node`,
        ],
        [LangTextType.B0492]: [
            `引用`,
            `Reference`,
        ],
        [LangTextType.B0493]: [
            `无错误`,
            `No Error`,
        ],
        [LangTextType.B0494]: [
            `重置条件节点`,
            `Reset Node`,
        ],
        [LangTextType.B0495]: [
            `修改名称`,
            `Modify Name`,
        ],
        [LangTextType.B0496]: [
            `新增动作`,
            `Add Action`,
        ],
        [LangTextType.B0497]: [
            `新增事件`,
            `Add Event`,
        ],
        [LangTextType.B0498]: [
            `删除多余数据`,
            `Delete Redundancy`,
        ],
        [LangTextType.B0499]: [
            `删除节点`,
            `Delete Node`,
        ],
        [LangTextType.B0500]: [
            `替换条件`,
            `Replace Condition`,
        ],
        [LangTextType.B0501]: [
            `修改条件`,
            `Modify Condition`,
        ],
        [LangTextType.B0502]: [
            `条件`,
            `Condition`,
        ],
        [LangTextType.B0503]: [
            `使用中`,
            `In Use`,
        ],
        [LangTextType.B0504]: [
            `当前回合数等于...`,
            `The current turn equals to ...`,
        ],
        [LangTextType.B0505]: [
            `当前回合数大于...`,
            `The current turn is greater than ...`,
        ],
        [LangTextType.B0506]: [
            `当前回合数小于...`,
            `The current turn is less than ...`,
        ],
        [LangTextType.B0507]: [
            `当前回合数的余数等于...`,
            `The current turn's remainder equals to ...`,
        ],
        [LangTextType.B0508]: [
            `当前的回合阶段是...`,
            `The current turn phase is ...`,
        ],
        [LangTextType.B0509]: [
            `处于当前回合的玩家序号等于...`,
            `The current player index equals to ...`,
        ],
        [LangTextType.B0510]: [
            `处于当前回合的玩家序号大于...`,
            `The current player index is greater than ...`,
        ],
        [LangTextType.B0511]: [
            `处于当前回合的玩家序号小于...`,
            `The current player index is less than ...`,
        ],
        [LangTextType.B0512]: [
            `事件的发生次数等于...`,
            `The event occurred times equals to ...`,
        ],
        [LangTextType.B0513]: [
            `事件的发生次数大于...`,
            `The event occurred times is greater than ...`,
        ],
        [LangTextType.B0514]: [
            `事件的发生次数小于...`,
            `The event occurred times is less than ...`,
        ],
        [LangTextType.B0515]: [
            `玩家的状态是...`,
            `The player's state is ...`,
        ],
        [LangTextType.B0516]: [
            `切换类型`,
            `Change Type`,
        ],
        [LangTextType.B0517]: [
            `取反`,
            `Is Not`,
        ],
        [LangTextType.B0518]: [
            `除数`,
            `Divider`,
        ],
        [LangTextType.B0519]: [
            `余数`,
            `Remainder`,
        ],
        [LangTextType.B0520]: [
            `切换`,
            `Switch`,
        ],
        [LangTextType.B0521]: [
            `玩家序号`,
            `Player Index`,
        ],
        [LangTextType.B0522]: [
            `次数`,
            `Times`,
        ],
        [LangTextType.B0523]: [
            `玩家状态`,
            `Player State`,
        ],
        [LangTextType.B0524]: [
            `部队总数`,
            `Total number of the units`,
        ],
        [LangTextType.B0525]: [
            `部队类型`,
            `Unit Type`,
        ],
        [LangTextType.B0526]: [
            `行动状态`,
            `Action State`,
        ],
        [LangTextType.B0527]: [
            `部队ID`,
            `Unit ID`,
        ],
        [LangTextType.B0528]: [
            `装载部队ID`,
            `Loader ID`,
        ],
        [LangTextType.B0529]: [
            `建筑中`,
            `Building`,
        ],
        [LangTextType.B0530]: [
            `占领中`,
            `Capturing`,
        ],
        [LangTextType.B0531]: [
            `坐标`,
            `Coordinate`,
        ],
        [LangTextType.B0532]: [
            `是否会被部队阻挡`,
            `Blockable By Unit`,
        ],
        [LangTextType.B0533]: [
            `修改动作`,
            `Modify Action`,
        ],
        [LangTextType.B0534]: [
            `自动寻找合适的地形`,
            `Auto Find Suitable Tile`,
        ],
        [LangTextType.B0535]: [
            `新增部队`,
            `Add Unit`,
        ],
        [LangTextType.B0536]: [
            `单人雾战`,
            `Free Battle`,
        ],
        [LangTextType.B0537]: [
            `QQ群`,
            `QQ Group`,
        ],
        [LangTextType.B0538]: [
            `Discord`,
            `Discord`,
        ],
        [LangTextType.B0539]: [
            `GitHub`,
            `GitHub`,
        ],
        [LangTextType.B0540]: [
            `声音设定`,
            `Sound Settings`,
        ],
        [LangTextType.B0541]: [
            `音乐`,
            `BGM`,
        ],
        [LangTextType.B0542]: [
            `音效`,
            `SFX`,
        ],
        [LangTextType.B0543]: [
            `默认`,
            `Default`,
        ],
        [LangTextType.B0544]: [
            `上一首BGM`,
            `Previous BGM`,
        ],
        [LangTextType.B0545]: [
            `下一首BGM`,
            `Next BGM`,
        ],
        [LangTextType.B0546]: [
            `明战排位`,
            `Std Rank`,
        ],
        [LangTextType.B0547]: [
            `雾战排位`,
            `FoW Rank`,
        ],
        [LangTextType.B0548]: [
            `明战`,
            `Std`,
        ],
        [LangTextType.B0549]: [
            `雾战`,
            `FoW`,
        ],
        [LangTextType.B0550]: [
            `胜`,
            `Win`,
        ],
        [LangTextType.B0551]: [
            `负`,
            `Lose`,
        ],
        [LangTextType.B0552]: [
            `平`,
            `Draw`,
        ],
        [LangTextType.B0553]: [
            `胜率`,
            `Win %`,
        ],
        [LangTextType.B0554]: [
            `排位`,
            `Ranking`,
        ],
        [LangTextType.B0555]: [
            `无名`,
            `No Name`,
        ],
        [LangTextType.B0556]: [
            `多人自由房间`,
            `MP Free Room`,
        ],
        [LangTextType.B0557]: [
            `自由模式`,
            `Free Mode`,
        ],
        [LangTextType.B0558]: [
            `分辨率设定`,
            `Resolution Settings`,
        ],
        [LangTextType.B0559]: [
            `UI缩放倍率`,
            `UI Scale`,
        ],
        [LangTextType.B0560]: [
            `设置`,
            `Settings`,
        ],
        [LangTextType.B0561]: [
            `打开`,
            `On`,
        ],
        [LangTextType.B0562]: [
            `关闭`,
            `Off`,
        ],
        [LangTextType.B0563]: [
            `使用中文`,
            `Use Chinese`,
        ],
        [LangTextType.B0564]: [
            `使用英文`,
            `Use English`,
        ],
        [LangTextType.B0565]: [
            `热度`,
            `Popularity`,
        ],
        [LangTextType.B0566]: [
            `下一步`,
            `Next`,
        ],
        [LangTextType.B0567]: [
            `重置`,
            `Reset`,
        ],
        [LangTextType.B0568]: [
            `最小热度`,
            `Min. Popularity`,
        ],
        [LangTextType.B0569]: [
            `最低评分`,
            `Min. Rating`,
        ],
        [LangTextType.B0570]: [
            `雾战标签`,
            `FoW Tagged`,
        ],
        [LangTextType.B0571]: [
            `房间设置`,
            `Room Settings`,
        ],
        [LangTextType.B0572]: [
            `选择势力`,
            `Choose a Force`,
        ],
        [LangTextType.B0573]: [
            `选择颜色`,
            `Choose a Color`,
        ],
        [LangTextType.B0574]: [
            `计时模式`,
            `Timer Mode`,
        ],
        [LangTextType.B0575]: [
            `自定义`,
            `Customize`,
        ],
        [LangTextType.B0576]: [
            `D2D`,
            `D2D`,
        ],
        [LangTextType.B0577]: [
            `COP`,
            `COP`,
        ],
        [LangTextType.B0578]: [
            `SCOP`,
            `SCOP`,
        ],
        [LangTextType.B0579]: [
            `积分`,
            `Score`,
        ],
        [LangTextType.B0580]: [
            `加入房间`,
            `Join Rooms`,
        ],
        [LangTextType.B0581]: [
            `选择房间`,
            `Choose a Room`,
        ],
        [LangTextType.B0582]: [
            `暂无房间`,
            `No Rooms`,
        ],
        [LangTextType.B0583]: [
            `加入`,
            `Join`,
        ],
        [LangTextType.B0584]: [
            `棋盘网格线`,
            `Border Lines`,
        ],
        [LangTextType.B0585]: [
            `显示棋盘格子`,
            `Show Border`,
        ],
        [LangTextType.B0586]: [
            `您的势力颜色`,
            `Your Force Color`,
        ],
        [LangTextType.B0587]: [
            `您的CO`,
            `Your CO`,
        ],
        [LangTextType.B0588]: [
            `我的战局`,
            `My Wars`,
        ],
        [LangTextType.B0589]: [
            `选择战局`,
            `Choose a war`,
        ],
        [LangTextType.B0590]: [
            `禁用CO`,
            `Ban COs`,
        ],
        [LangTextType.B0591]: [
            `已禁用CO`,
            `Banned COs`,
        ],
        [LangTextType.B0592]: [
            `禁用CO阶段倒计时`,
            `Ban CO Phase Countdown`,
        ],
        [LangTextType.B0593]: [
            `准备阶段倒计时`,
            `Standby Phase Countdown`,
        ],
        [LangTextType.B0594]: [
            `预览地图`,
            `Preview Maps`,
        ],
        [LangTextType.B0595]: [
            `标准地图`,
            `Standard Maps`,
        ],
        [LangTextType.B0596]: [
            `雾战地图`,
            `FoW Maps`,
        ],
        [LangTextType.B0597]: [
            `切换`,
            `Switch`,
        ],
        [LangTextType.B0598]: [
            `选择回放`,
            `Choose a Replay`,
        ],
        [LangTextType.B0599]: [
            `战局类型`,
            `War Type`,
        ],
        [LangTextType.B0600]: [
            `回合数和行动数`,
            `Turns and Actions`,
        ],
        [LangTextType.B0601]: [
            `结束时间`,
            `End Time`,
        ],
        [LangTextType.B0602]: [
            `刷新`,
            `Refresh`,
        ],
        [LangTextType.B0603]: [
            `自定义模式`,
            `Custom Mode`,
        ],
        [LangTextType.B0604]: [
            `游戏设置`,
            `Game Settings`,
        ],
        [LangTextType.B0605]: [
            `存档备注`,
            `Save Comment`,
        ],
        [LangTextType.B0606]: [
            `存档编号`,
            `Save Slot`,
        ],
        [LangTextType.B0607]: [
            `电脑`,
            `A.I.`,
        ],
        [LangTextType.B0608]: [
            `更换控制者`,
            `Controller`,
        ],
        [LangTextType.B0609]: [
            `更换颜色`,
            `Change Color`,
        ],
        [LangTextType.B0610]: [
            `自定义明战`,
            `Custom Std`,
        ],
        [LangTextType.B0611]: [
            `自定义雾战`,
            `Custom FoW`,
        ],
        [LangTextType.B0612]: [
            `模拟战明战`,
            `Simulation Std`,
        ],
        [LangTextType.B0613]: [
            `模拟战雾战`,
            `Simulation FoW`,
        ],
        [LangTextType.B0614]: [
            `单人排位游戏`,
            `SP Ranking Games`,
        ],
        [LangTextType.B0615]: [
            `替换动作`,
            `Replace Action`,
        ],
        [LangTextType.B0616]: [
            `动作`,
            `Action`,
        ],
        [LangTextType.B0617]: [
            `增加部队`,
            `Add Unit(s)`,
        ],
        [LangTextType.B0618]: [
            `修改玩家状态`,
            `Modify a Player's State`,
        ],
        [LangTextType.B0619]: [
            `多人合作自定义游戏`,
            `Coop Custom Games`,
        ],
        [LangTextType.B0620]: [
            `切换游戏版本`,
            `Switch Game Version`,
        ],
        [LangTextType.B0621]: [
            `原版`,
            `Legacy Version`,
        ],
        [LangTextType.B0622]: [
            `测试版`,
            `Test Version`,
        ],
        [LangTextType.B0623]: [
            `当前版本`,
            `Current Version`,
        ],
        [LangTextType.B0624]: [
            `中文`,
            `Chinese`,
        ],
        [LangTextType.B0625]: [
            `英文`,
            `English`,
        ],
        [LangTextType.B0626]: [
            `找回密码`,
            `Forget?`,
        ],
        [LangTextType.B0627]: [
            `语言`,
            `Language`,
        ],
        [LangTextType.B0628]: [
            `贴图`,
            `Texture`,
        ],
        [LangTextType.B0629]: [
            `部队动画`,
            `Unit Animation`,
        ],
        [LangTextType.B0630]: [
            `地形动画`,
            `Tile Animation`,
        ],
        [LangTextType.B0631]: [
            `切换BGM`,
            `Switch BGM`,
        ],
        [LangTextType.B0632]: [
            `Wandering Path`,
            `Wandering Path`,
        ],
        [LangTextType.B0633]: [
            `Design Time`,
            `Design Time`,
        ],
        [LangTextType.B0634]: [
            `We Will Prevail`,
            `We Will Prevail`,
        ],
        [LangTextType.B0635]: [
            `Hope Never Dies`,
            `Hope Never Dies`,
        ],
        [LangTextType.B0636]: [
            `Lost Memories`,
            `Lost Memories`,
        ],
        [LangTextType.B0637]: [
            `Proud Soldier`,
            `Proud Soldier`,
        ],
        [LangTextType.B0638]: [
            `Days of Ruin`,
            `Days of Ruin`,
        ],
        [LangTextType.B0639]: [
            `Rutty`,
            `Rutty`,
        ],
        [LangTextType.B0640]: [
            `用户ID`,
            `User ID`,
        ],
        [LangTextType.B0641]: [
            `由AI控制`,
            `Controlled by A.I.`,
        ],
        [LangTextType.B0642]: [
            `AI使用的CO`,
            `CO for A.I.`,
        ],
        [LangTextType.B0643]: [
            `合作房间`,
            `Coop Room`,
        ],
        [LangTextType.B0644]: [
            `合作模式中AI的CO`,
            `CO for A.I. in Coop`,
        ],
        [LangTextType.B0645]: [
            `合作模式中由AI控制`,
            `Controlled by A.I. in Coop`,
        ],
        [LangTextType.B0646]: [
            `合作模式`,
            `Coop Mode`,
        ],
        [LangTextType.B0647]: [
            `我`,
            `Me`,
        ],
        [LangTextType.B0648]: [
            `其他玩家`,
            `Others`,
        ],
        [LangTextType.B0649]: [
            `Advance Wars by Web`,
            `Advance Wars by Web`,
        ],
        [LangTextType.B0650]: [
            `返回地图列表`,
            `Go to Map List`,
        ],
        [LangTextType.B0651]: [
            `返回回放列表`,
            `Go to Replay List`,
        ],
        [LangTextType.B0652]: [
            `返回战局列表`,
            `Go to War List`,
        ],
        [LangTextType.B0653]: [
            `Supreme Logician`,
            `Supreme Logician`,
        ],
        [LangTextType.B0654]: [
            `Goddess of Revenge`,
            `Goddess of Revenge`,
        ],
        [LangTextType.B0655]: [
            `Hero of Legend`,
            `Hero of Legend`,
        ],
        [LangTextType.B0656]: [
            `Flight of the Coward`,
            `Flight of the Coward`,
        ],
        [LangTextType.B0657]: [
            `Madman's Reign`,
            `Madman's Reign`,
        ],
        [LangTextType.B0658]: [
            `Cruel Rose`,
            `Cruel Rose`,
        ],
        [LangTextType.B0659]: [
            `Puppet Master`,
            `Puppet Master`,
        ],
        [LangTextType.B0660]: [
            `Power Up`,
            `Power Up`,
        ],
        [LangTextType.B0661]: [
            `删除地形装饰物`,
            `Del Tile Decorator`,
        ],
        [LangTextType.B0662]: [
            `绘制地形装饰物`,
            `Draw Tile Decorator`,
        ],
        [LangTextType.B0663]: [
            `陆地边角`,
            `Land Corner`,
        ],
        [LangTextType.B0664]: [
            `地形装饰物`,
            `Tile Decorator`,
        ],
        [LangTextType.B0665]: [
            `跳过`,
            `Skip`,
        ],

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        [LangTextType.B1000]: [
            `平原`,
            `Plain`,
        ],
        [LangTextType.B1001]: [
            `河流`,
            `River`,
        ],
        [LangTextType.B1002]: [
            `海洋`,
            `Sea`,
        ],
        [LangTextType.B1003]: [
            `沙滩`,
            `Beach`,
        ],
        [LangTextType.B1004]: [
            `道路`,
            `Road`,
        ],
        [LangTextType.B1005]: [
            `桥梁`,
            `BridgeOnPlain`,
        ],
        [LangTextType.B1006]: [
            `桥梁`,
            `BridgeOnRiver`,
        ],
        [LangTextType.B1007]: [
            `桥梁`,
            `BridgeOnBeach`,
        ],
        [LangTextType.B1008]: [
            `桥梁`,
            `BridgeOnSea`,
        ],
        [LangTextType.B1009]: [
            `森林`,
            `Wood`,
        ],
        [LangTextType.B1010]: [
            `高山`,
            `Mountain`,
        ],
        [LangTextType.B1011]: [
            `荒野`,
            `Wasteland`,
        ],
        [LangTextType.B1012]: [
            `废墟`,
            `Ruins`,
        ],
        [LangTextType.B1013]: [
            `火堆`,
            `Fire`,
        ],
        [LangTextType.B1014]: [
            `巨浪`,
            `Rough`,
        ],
        [LangTextType.B1015]: [
            `迷雾`,
            `MistOnSea`,
        ],
        [LangTextType.B1016]: [
            `礁石`,
            `Reef`,
        ],
        [LangTextType.B1017]: [
            `等离子`,
            `Plasma`,
        ],
        [LangTextType.B1018]: [
            `超级等离子`,
            `GreenPlasma`,
        ],
        [LangTextType.B1019]: [
            `陨石`,
            `Meteor`,
        ],
        [LangTextType.B1020]: [
            `导弹井`,
            `Silo`,
        ],
        [LangTextType.B1021]: [
            `空导弹井`,
            `EmptySilo`,
        ],
        [LangTextType.B1022]: [
            `指挥部`,
            `Headquarters`,
        ],
        [LangTextType.B1023]: [
            `城市`,
            `City`,
        ],
        [LangTextType.B1024]: [
            `指挥塔`,
            `CommandTower`,
        ],
        [LangTextType.B1025]: [
            `雷达`,
            `Radar`,
        ],
        [LangTextType.B1026]: [
            `工厂`,
            `Factory`,
        ],
        [LangTextType.B1027]: [
            `机场`,
            `Airport`,
        ],
        [LangTextType.B1028]: [
            `海港`,
            `Seaport`,
        ],
        [LangTextType.B1029]: [
            `临时机场`,
            `TempAirport`,
        ],
        [LangTextType.B1030]: [
            `临时海港`,
            `TempSeaport`,
        ],
        [LangTextType.B1031]: [
            `迷雾`,
            `MistOnPlain`,
        ],
        [LangTextType.B1032]: [
            `迷雾`,
            `MistOnRiver`,
        ],
        [LangTextType.B1033]: [
            `迷雾`,
            `MistOnBeach`,
        ],

        [LangTextType.B1200]: [
            `步兵`,
            `Infantry`,
        ],
        [LangTextType.B1201]: [
            `反坦克兵`,
            `Mech`,
        ],
        [LangTextType.B1202]: [
            `摩托兵`,
            `Bike`,
        ],
        [LangTextType.B1203]: [
            `侦察车`,
            `Recon`,
        ],
        [LangTextType.B1204]: [
            `照明车`,
            `Flare`,
        ],
        [LangTextType.B1205]: [
            `防空车`,
            `AntiAir`,
        ],
        [LangTextType.B1206]: [
            `轻型坦克`,
            `Tank`,
        ],
        [LangTextType.B1207]: [
            `中型坦克`,
            `MediumTank`,
        ],
        [LangTextType.B1208]: [
            `弩级坦克`,
            `WarTank`,
        ],
        [LangTextType.B1209]: [
            `自走炮`,
            `Artillery`,
        ],
        [LangTextType.B1210]: [
            `反坦克炮`,
            `AntiTank`,
        ],
        [LangTextType.B1211]: [
            `火箭炮`,
            `Rockets`,
        ],
        [LangTextType.B1212]: [
            `防空导弹车`,
            `Missiles`,
        ],
        [LangTextType.B1213]: [
            `工程车`,
            `Rig`,
        ],
        [LangTextType.B1214]: [
            `战斗机`,
            `Fighter`,
        ],
        [LangTextType.B1215]: [
            `轰炸机`,
            `Bomber`,
        ],
        [LangTextType.B1216]: [
            `攻击机`,
            `Duster`,
        ],
        [LangTextType.B1217]: [
            `武装直升机`,
            `BattleCopter`,
        ],
        [LangTextType.B1218]: [
            `运输直升机`,
            `TransportCopter`,
        ],
        [LangTextType.B1219]: [
            `舰载机`,
            `Seaplane`,
        ],
        [LangTextType.B1220]: [
            `战列舰`,
            `Battleship`,
        ],
        [LangTextType.B1221]: [
            `航母`,
            `Carrier`,
        ],
        [LangTextType.B1222]: [
            `潜艇`,
            `Submarine`,
        ],
        [LangTextType.B1223]: [
            `驱逐舰`,
            `Cruiser`,
        ],
        [LangTextType.B1224]: [
            `登陆舰`,
            `Lander`,
        ],
        [LangTextType.B1225]: [
            `炮舰`,
            `Gunboat`,
        ],

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Format strings.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        [LangTextType.F0000]: [
            "地图名称: %s",
            "Map name: %s",
        ],
        [LangTextType.F0001]: [
            "作者: %s",
            "Designer: %s",
        ],
        [LangTextType.F0002]: [
            "人数: %s",
            "Players: %s",
        ],
        [LangTextType.F0003]: [
            "全服评分: %s",
            "Rating: %s",
        ],
        [LangTextType.F0004]: [
            "全服游玩次数: %s",
            "Games played: %s",
        ],
        [LangTextType.F0005]: [
            "战争迷雾: %s",
            "Fog: %s",
        ],
        [LangTextType.F0006]: [
            `%d个部队尚未行动。`,
            `%d unit(s) is(are) idle.`
        ],
        [LangTextType.F0007]: [
            `%d个%s空闲，位置：%s。`,
            `%d %s(s) is(are) idle. Position(s): %s.`
        ],
        [LangTextType.F0008]: [
            `玩家[%s]已投降！`,
            `Player [%s] has resigned!`,
        ],
        [LangTextType.F0009]: [
            `%s 的履历`,
            `%s's Profile`,
        ],
        [LangTextType.F0010]: [
            `%d胜`,
            `Win: %d`,
        ],
        [LangTextType.F0011]: [
            `%d负`,
            `Lose: %d`,
        ],
        [LangTextType.F0012]: [
            `%d平`,
            `Draw: %d`,
        ],
        [LangTextType.F0013]: [
            `玩家[%s]已战败！`,
            `Player [%s] is defeated!`,
        ],
        [LangTextType.F0014]: [
            `玩家[%s]的最后一个部队耗尽燃料而坠毁，因而战败！`,
            `Player [%s] is defeated!`,
        ],
        [LangTextType.F0015]: [
            `玩家[%s]的所有部队均被消灭，因而战败！`,
            `Player [%s] is defeated!`,
        ],
        [LangTextType.F0016]: [
            `玩家[%s]的指挥部被占领，因而战败！`,
            `Player [%s] is defeated!`,
        ],
        [LangTextType.F0017]: [
            `P%d [%s] 已拒绝和局！`,
            `P%d [%s] declines to end the game in draw!`,
        ],
        [LangTextType.F0018]: [
            `P%d [%s] 已同意和局！`,
            `P%d [%s] agrees to end the game in draw!`,
        ],
        [LangTextType.F0019]: [
            `P%d [%s] 求和！`,
            `P%d [%s] requests to end the game in draw!`,
        ],
        [LangTextType.F0020]: [
            `最多%d字，可留空`,
            `%d characters for maximum, optional`,
        ],
        [LangTextType.F0021]: [
            `最多%d位数字，可留空`,
            `%d digits for maximum, optional`,
        ],
        [LangTextType.F0022]: [
            `%s (p%d) 回合正式开始！！`,
            `It's %s (p%d)'s turn!!`,
        ],
        [LangTextType.F0023]: [
            `地图的总格子数必须小于%d，否则不能提审`,
            `The number of the tiles must be less than %d, or the map can't be submitted for review.`,
        ],
        [LangTextType.F0024]: [
            `修改时间: %s`,
            `Modify Time: %s`,
        ],
        [LangTextType.F0025]: [
            `要和玩家"%s"私聊吗？`,
            `Do you want to make a private chat with %s?`,
        ],
        [LangTextType.F0026]: [
            `数据加载中，请%s秒后重试`,
            `Now loading, please wait %ds and retry.`,
        ],
        [LangTextType.F0027]: [
            `"%s"上的一局多人对战已经正式开始！`,
            `A game on "%s" has started!`
        ],
        [LangTextType.F0028]: [
            `玩家[%s]因超时而告负！`,
            `Player [%s] has ran out of time!`,
        ],
        [LangTextType.F0029]: [
            `您确定要踢掉玩家"%s"吗？`,
            `Are you sure to kick off the player '%s'?`,
        ],
        [LangTextType.F0030]: [
            `%s (p%d) 回合结束。`,
            `%s (p%d) has ended the turn!!`,
        ],
        [LangTextType.F0031]: [
            `您最多只能禁用%d名CO。`,
            `You can only ban up to %d COs.`,
        ],
        [LangTextType.F0032]: [
            `请把名称长度控制在%d个字符以内。`,
            `Please limit the length of the name to %d characters.`
        ],
        [LangTextType.F0033]: [
            `启用SetPath模式后，在指定部队移动路线时，您需要连续点击两次目标格子才能呼出操作菜单。这会增加操作量，但同时也便于指定移动路线，这在雾战中尤其有用。\n您确定要启用吗？\n（当前状态：%s）`,
            `While the Set Path mode is enabled, you have to double click (or touch) a tile in order to make the unit action panel appear when you are moving units. This mode can be useful especially in FoW.\nAre you sure to enable it? \n(Current status: %s)`,
        ],
        [LangTextType.F0034]: [
            `最多输入%d个字符，请检查`,
            `Please limit the text length to %d characters.`,
        ],
        [LangTextType.F0035]: [
            `事件#%d发生次数等于%d`,
            `Event #%d occurred times == %d`,
        ],
        [LangTextType.F0036]: [
            `事件#%d发生次数不等于%d`,
            `Event #%d occurred times != %d`,
        ],
        [LangTextType.F0037]: [
            `事件#%d发生次数大于%d`,
            `Event #%d occurred times > %d`,
        ],
        [LangTextType.F0038]: [
            `事件#%d发生次数小于等于%d`,
            `Event #%d occurred times <= %d`,
        ],
        [LangTextType.F0039]: [
            `事件#%d发生次数小于%d`,
            `Event #%d occurred times < %d`,
        ],
        [LangTextType.F0040]: [
            `事件#%d发生次数大于等于%d`,
            `Event #%d occurred times >= %d`,
        ],
        [LangTextType.F0041]: [
            `玩家P%d的当前状态 == %s`,
            `The state of the player P%d == %s`,
        ],
        [LangTextType.F0042]: [
            `玩家P%d的当前状态 != %s`,
            `The state of the player P%d != %s`,
        ],
        [LangTextType.F0043]: [
            `当前是玩家P%d的回合`,
            `It's P%d's turn currently.`,
        ],
        [LangTextType.F0044]: [
            `当前不是玩家P%d的回合`,
            `It's not P%d's turn currently.`
        ],
        [LangTextType.F0045]: [
            `处于当前回合的玩家序号大于%d`,
            `The player index in the current turn > %d.`,
        ],
        [LangTextType.F0046]: [
            `处于当前回合的玩家序号小于等于%d`,
            `The player index in the current turn <= %d.`,
        ],
        [LangTextType.F0047]: [
            `处于当前回合的玩家序号小于%d`,
            `The player index in the current turn < %d.`,
        ],
        [LangTextType.F0048]: [
            `处于当前回合的玩家序号大于等于%d`,
            `The player index in the current turn >= %d.`,
        ],
        [LangTextType.F0049]: [
            `当前的回合数等于%d`,
            `The current turn == %d.`,
        ],
        [LangTextType.F0050]: [
            `当前的回合等于%d`,
            `The current turn != %d.`,
        ],
        [LangTextType.F0051]: [
            `当前的回合数大于%d`,
            `The current turn > %d.`,
        ],
        [LangTextType.F0052]: [
            `当前的回合数小于等于%d`,
            `The current turn <= %d.`,
        ],
        [LangTextType.F0053]: [
            `当前的回合数小于%d`,
            `The current turn < %d.`,
        ],
        [LangTextType.F0054]: [
            `当前的回合数大于等于%d`,
            `The current turn >= %d.`,
        ],
        [LangTextType.F0055]: [
            `当前的回合数除以 %d 的余数 == %d`,
            `The current turn mod %d == %d.`,
        ],
        [LangTextType.F0056]: [
            `当前的回合数除以 %d 的余数 != %d`,
            `The current turn mod %d != %d.`,
        ],
        [LangTextType.F0057]: [
            `当前的回合阶段 == %s`,
            `The current turn phase == %s.`,
        ],
        [LangTextType.F0058]: [
            `当前的回合阶段 != %s`,
            `The current turn phase != %s.`,
        ],
        [LangTextType.F0059]: [
            `在地图上增加部队: %s`,
            `Add units on map: %s`,
        ],
        [LangTextType.F0060]: [
            `当前正在使用条件节点%s。确定要用新的空节点代替它吗？`,
            `The condition node %s is being used. Are you sure to replace it by a new empty one?`,
        ],
        [LangTextType.F0061]: [
            `此条件节点中包含了重复的节点%s。请删除重复的节点。`,
            `There are duplicated sub nodes %s in the node. Please remove the duplication.`,
        ],
        [LangTextType.F0062]: [
            `此条件节点中包含了重复的条件%s。请删除重复的条件。`,
            `There are duplicated condition %s in the node. Please remove the duplication.`,
        ],
        [LangTextType.F0063]: [
            `已删除%d个节点、%d个条件和%d个动作。`,
            `%d nodes, %d conditions and %d actions have been deleted.`,
        ],
        [LangTextType.F0064]: [
            `%s无效`,
            `The %s is invalid.`,
        ],
        [LangTextType.F0065]: [
            `您是否希望前往 %s 网站?`,
            `Do you want to go to the %s website?`,
        ],
        [LangTextType.F0066]: [
            `设置玩家 P%d 的状态为 %s`,
            `Set P%d's state as %s.`,
        ],
        [LangTextType.F0067]: [
            `无法在 %s 上放置部队。`,
            `It's not allowed to place units on %s.`,
        ],
        [LangTextType.F0068]: [
            `请输入数字，最多 %d 位`,
            `Please enter a number, up to %d digits.`,
        ],

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Rich strings.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        [LangTextType.R0000]: [
            [
                `本选项影响您在回合中的行动顺序，以及您所属的队伍（由地图规则设定）`,
                ``,
                `战局中，属于同一队伍的玩家共享视野，部队能够相互穿越，不能相互攻击/装载/用后勤车补给。`,
                `此外，可以使用队友的建筑来维修/补给自己的部队（消耗自己的金钱），但不能占领队友的建筑。`,
                ``,
                `预览地图时，各个势力的颜色与行动顺序的对应关系如下（您可以在创建/加入房间时选择您想要的颜色）：`,
                `红=1，蓝=2，黄=3，黑=4`,
                ``,
                `默认为当前可用选项中的第一项。`,
            ].join("\n"),

            [
                `This option determines your turn order and your team. `,
                ``,
                `In the game players in the same team share the vision. Their troops will not block and attack each other. It is not possible to supply your allies' troops with Rigs or load into allies' transports. `,
                `You may use allies' properties to repair (use your own funds) and supply your troops and you cannot capture allies' properties`,
                ``,
                `When previewing the map, the colors of the forces correspond to the order of action as follows (you can choose the color you want when creating/adding rooms)`,
                `Red = 1, Blue = 2, Yellow = 3, Black = 4`,
                ``,
                `By default you will be given the first choice among the available ones.`,
            ].join("\n"),
        ],

        [LangTextType.R0001]: [
            [
                `本选项影响您部队和建筑的外观（颜色）。`,
            ].join("\n"),

            [
                `This option determines the color of your troops and properties.`,
            ].join("\n"),
        ],

        [LangTextType.R0002]: [
            [
                `本选项影响战局是明战或雾战。`,
                ``,
                `明战下，您可以观察到整个战场的情况。雾战下，您只能看到自己军队的视野内的战场情况。`,
                `雾战难度相对较大。如果您是新手，建议先通过明战熟悉游戏系统，再尝试雾战模式。`,
                ``,
                `默认为“否”（即明战）。`,
            ].join("\n"),

            [
                `This option determines whether this game is FOW or not. `,
                ``,
                `When FOW is off you have the view of the whole battlefield. When FOW is on you can only see the battlefield within the vision of your troops. `,
                `FOW is relatively difficult and it is recommended that new players should start from no FOW to learn the basics of the game before advancing to FOW mode. `,
                ``,
                `By default this option is disabled (no FOW). `,
            ].join("\n"),
        ],

        [LangTextType.R0003]: [
            [
                `本选项影响所有玩家的每回合的时限。`,
                ``,
                `如果某个玩家的回合时间超出了限制，则服务器将自动为该玩家执行投降操作。`,
                `当战局正式开始，或某个玩家结束回合后，则服务器自动开始下个玩家回合的倒计时（无论该玩家是否在线）。`,
                `当前有“常规”和“增量”两种计时模式可选。`,
                ``,
                `常规计时：每回合的可用时间是固定不变的。`,
                ``,
                `增量计时：玩家每回合可用的时间将受到前面回合所消耗的时间的影响。此模式有两个参数，分别为“初始时间”和“增量时间”。`,
                `第一回合，玩家拥有的时间就是“初始时间”。`,
                `第二及后续所有回合，玩家拥有的时间=上一个回合的剩余时间+（上回合结束时的剩余部队数*增量时间）。`,
                ``,
                `默认为“常规计时-3天”。`,
            ].join("\n"),

            [
                `This option determines the boot timer, aka time available for each turn. `,
                ``,
                `If a player hits the boot timer, the player will resign automatically. `,
                `When the game starts, or a player ends his turn, the timer of the first (or the next) player will start to countdown, no matter that player is online or not. `,
                `Currently, there are two timing modes available: regular and incremental.`,
                ``,
                `Regular timing: the available time for each round is fixed.`,
                ``,
                `Incremental timing: The time available for each round will be affected by the time consumed in the previous round. This mode has two parameters, namely "Initial Time" and "Incremental Time".`,
                `For the first round, the time the player has is "Initial Time".`,
                `For the second round and all subsequent rounds, the time the player has equals the remaining time of the previous round plus (the number of troops remaining in the previous round multiplies the "increment time").`,
                ``,
                `By default this option is selected as "regular timer with 3 days per round". `,
            ].join("\n"),
        ],

        [LangTextType.R0004]: [
            [
                `CO能够搭乘到部队中，并改变临近区域的部队的战斗能力。此外，部分CO能通过战斗积累能量，并以此释放强大的power，从而进一步制造优势。`,
                `CO详细规则如下：`,
                `- CO需要搭乘到部队中才能发挥作用，包括日常能力和power（如果有的话）。power又分为COP和SCOP两种`,
                `- 同一势力，CO无法同时搭乘到两个或以上的部队中`,
                `- CO只能在工厂、机场、海港、大本营进行搭乘，其中工厂可搭乘陆军，机场可搭乘空军，海港可搭乘海军，大本营可搭乘任意类型部队`,
                `- CO搭乘前，目标部队必须是未行动的状态，且正处在可搭乘的地形上；搭乘后部队可以再次行动`,
                `- 若自己回合内，CO所在部队被摧毁（无论是自毁还是被击毁），则当回合内无法再搭乘`,
                `- 搭乘需要花费资金，数量为目标部队原价的特定百分比值（各个CO的比例可能不同）`,
                `- 搭乘瞬间，目标部队立刻升到满级，且CO日常能力立刻生效`,
                `- CO的日常能力，通常情况下只对CO所在部队的特定距离（即CO zone，下称COZ）内的部队生效；若有例外，以CO技能描述为准`,
                `- 若CO所在部队被装载，则COZ消失，直到该部队被卸载到地图上`,
                `- 只有部分CO有能量和COP/SCOP，具体以CO描述为准`,
                `- 处于我方COZ内的我方部队对任意敌方部队发起攻击，造成伤害时会累积我方能量，每打掉1HP则增加1能量，与部队价值无关；自身受伤时不积累能量`,
                `- 处于我方COZ内的敌方部队对任意我方部队发起攻击，我方部队反击造成对方受伤时会累积我方能量，累积规则同上`,
                `- 部分CO可以扩张COZ，以"zone扩张能量值"列表决定；能量每达到列表中的一个值，则COZ+1。也就是说，如果该列表为空，则COZ无法扩张；如果列表有三个数值，则COZ最多可以扩张三次`,
                `- 有能量的CO，其能量最大值是SCOP所需能量及"zone扩张能量值"中的最大值`,
                `- COP/SCOP（如果有的话）需要消耗相应的能量才能发动；发动后，直到我方下回合开始之前，我方能量无法累积`,
                `- 若能量足够，CO所在部队可以在未行动时发动COP/SCOP；发动COP/SCOP需要消耗该部队的行动机会，也就是说不能发动后再攻击（但是允许移动后发COP/SCOP）`,
                `- COP/SCOP持续一回合，直到我方下回合开始时消失；其效果对全地图所有部队都生效（即使在视野外），具体以CO技能描述为准`,
                `- COP/SCOP生效期间，日常能力失效`,
                `- 即使发动过COP/SCOP，能量累积速度也不变`,
                `- 若CO所在部队被击毁，则能量清零；若该CO正在发动COP/SCOP，则该COP/SCOP效果立刻消失`,
            ].join("\n\n"),

            [
                `COs can board onto the troops and provide buffs for troops around. Besides, some COs can charge CO power metre in the battle and use CO power to achieve a bigger advantage. `,
                `The detailed rules of COs are listed below: `,
                `01. COs needs to board onto the troops to use their d2d abilities and powers. Powers may include cop and sp. `,
                `02. There can be only 1 CO for each side. `,
                `03. COs can board onto troops from bases, airports, ports and HQs. Bases are for land forces. Airports are for air forces. Ports are for navies while COs can board onto any troops from HQs. `,
                `04. COs can only board onto troops ready to move. Troops can move again after that. `,
                `05. If unit with CO on board is destroyed in your turn(i.e. killed by counter attack & crash after using up fuels), COs cannot board onto another unit in that turn. `,
                `06. It takes funds for CO to board onto troops, which equals to a modifier(CO specific) multiplied by the cost of the full HP unit. `,
                `07. Upon the boarding of CO the unit got veteran status and CO's d2d takes effect at once. `,
                `08. In usual cases CO's d2d works only on troops within the CO zone. `,
                `09. If units with CO on board are loaded the CO zone will not appear until it is unloaded again. `,
                `10. Only certain COs got cop and scop. `,
                `11. CO power metre is charged when units within CO zone deal damage to enemy units. 1 HP damage is converted to 1 unit of metre charge. `,
                `12. CO metre can also be charged by counterattack if target enemy units are in the COZ. The rule is the same as above. `,
                `13. Some COs can expand their CO zone, which is showed in the coz expansion chart. COZ expands by 1 tile for reaching a number in the chart. The coz cannot be expanded if the chart is "--". The coz can be expanded for 3 times if there are 3 numbers in the chart (a/b/c). `,
                `14. The maximum amount of metre of a CO is the larger number of SCOP cost and the largest COZ expansion cost. `,
                `15. COP/SCOP takes corresponding amount of power to activate. The power metre cannot be charged when cop/scop is active. `,
                `16. To activate COP/SCOP the unit with CO on board should be ready to move. You may use power after moving, but it is not possible to do so after attacking. `,
                `17. COP/SCOP lasts a turn, which means it ends at the beginning of your next turn. It works on all units in the map. `,
                `18. When COP/SCOP is active d2d does not work. `,
                `19. After using COP/SCOP the power metre charges at the same rate. `,
                `20. If units with CO on board are destroyed the power metre is reset to 0. If a COP/SCOP is active the COP/SCOP will also end.`,
            ].join("\n\n"),
        ],

        [LangTextType.R0005]: [
            [
                `1.账号和密码都只能使用数字、字母、下划线，长度不小于6位`,
                ``,
                `2.昵称可使用任意字符，长度不小于4位`,
                ``,
                `3.注册后，账号不可修改，密码和昵称可修改`,
            ].join("\n"),

            [
                `1. Usernames and passwords should only consist of numbers, english characters and "_". It should not be shorter than 6 characters. `,
                ``,
                `2. You can use any characters for nickname. The length should be no shorter than 4 characters. `,
                ``,
                `3. After the registry you cannot change your username, but the password and nickname can be changed.`,
            ].join("\n"),
        ],

        [LangTextType.R0006]: [
            [
                `模拟战是一种辅助您进行战局规划/地图测试的工具。`,
                `该工具允许您把当前所见到的战局信息原样复制到单人战局中。您可以在该单人战局中随意操作，还可以无限制地存档、读档，直到您找到最好的走法为止。`,
                `在该模式下，游戏规则仍然正常生效。换言之，您可以结束回合，或者做其他任何常规操作，游戏会为您正常结算相关数据。`,
                ``,
                `另：上帝模式开发中，敬请期待！`,
            ].join("\n"),
            [
                `Simulation (or Move Planner) is a tool to plan game moves and test maps.`,
                `It enables you to copy the game screen to a single player game. You may move any unit and save/load for unlimited times till you're satisfied with the move.`,
                `In this mode the game rule works normally. For example, you may end your turn and the fund will be added as usual.`,
                ``,
                `Sandbox Mode (where you can set unit HP for a better planning purpose) is now under development, and it may be online SOOOON.`,
            ].join("\n"),
        ],

        [LangTextType.R0007]: [
            [
                `自由模式是一个多人对战模式，但与常规模式不同的是，您可以以任意战局局面为战局起点。`,
                `常见的应用场景包括：`,
                `1. 自行任意设计地图并直接用于对战，而不必经过审核`,
                `2. 从某个回放的某个步骤直接开打，以便探讨战局发展的各种可能性`,
                ``,
                `自由模式的战绩不会计入您的履历，您可以无忧无虑地轻松游戏。`,
            ].join(`\n`),
            [
                `The Free Mode is a multi-player mode. But unlike Normal Mode you can start the game from any game state.`,
                `Examples include:`,
                `1. Design a custom map and use the map for battles, skipping the map review process.`,
                `2. Start a game from a certain step of a replay to study the possibilities.`,
                ``,
                `The results of the Free Mode will not affect the statistics in your profile. Just relax and enjoy :)`,
            ].join(`\n`),
        ],

        [LangTextType.R0008]: [
            [
                `合作模式是一个多人游戏模式。`,
                `与常规模式不同的是，AI会参与游戏。您可以与AI和/或其他玩家组队，对抗其他AI和/或玩家。`,
            ].join(`\n`),
            [
                `The Coop Mode is a multi-player mode.`,
                `Unlike the Normal Mode, A.I. plays in this mode. You can team up with A.I. and/or other players to play against other A.I. and/or players.`,
            ].join(`\n`),
        ],
    };
}

export default TwnsLangCommonText;
