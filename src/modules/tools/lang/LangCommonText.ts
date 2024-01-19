// import TwnsLangTextType     from "./LangTextType";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Lang {
    export const LangCommonText: { [type: number]: string[] } = {
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Long strings.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        [LangTextType.A0000]: [
            "登陆成功，祝您游戏愉快！",
            "Logged in successfully!",
            "Acesso feito com sucesso",
        ],
        [LangTextType.A0001]: [
            "账号不符合要求，请检查后重试",
            "Invalid username.",
            "Nome de usuário inválido."
        ],
        [LangTextType.A0002]: [
            "昵称不符合要求，请检查后重试",
            "Invalid display name.",
            "Nome de exibição inválido."
        ],
        [LangTextType.A0003]: [
            "密码不符合要求，请检查后重试",
            "Invalid password.",
            "Senha inválida",
        ],
        [LangTextType.A0004]: [
            "注册成功，正在自动登陆…",
            "Registered successfully! Now logging in...",
            "Registro feito com sucesso! Realizando primeiro acesso...",
        ],
        [LangTextType.A0005]: [
            "您已成功退出登陆，欢迎再次进入游戏。",
            "Logout successful.",
            "Acesso encerrado com sucesso."
        ],
        [LangTextType.A0006]: [
            "您的账号被异地登陆，您已自动下线。",
            "Someone logged in with your account!",
            "Alguém acessou sua conta!"
        ],
        [LangTextType.A0007]: [
            "已成功连接服务器。",
            "Connected to server successfully.",
            "Conexão estabelecida com sucesso.",
        ],
        [LangTextType.A0008]: [
            "连接服务器失败，正在重新连接…",
            "Failed to connect to server. Now reconnecting...",
            "Falha de conexão. Tentando reconectar...",
        ],
        [LangTextType.A0009]: [
            "您的网络连接不稳定，请尝试改善",
            "The network connection is not stable.",
            "A conexão encontra-se instável.",
        ],
        [LangTextType.A0010]: [
            "没有符合条件的地图",
            "No maps found.",
            "Não foram encontrados mapas.",
        ],
        [LangTextType.A0011]: [
            "正在查找地图",
            "Searching for maps...",
            "Buscando mapas...",
        ],
        [LangTextType.A0012]: [
            "已找到符合条件的地图",
            "Maps found.",
            "Mapas encontrados.",
        ],
        [LangTextType.A0013]: [
            "发生网络错误，请重新登陆。",
            "Connection failed. Please re-login.",
            "Conexão não estabelecida. Por favor, realize novo acesso."
        ],
        [LangTextType.A0014]: [
            "发生网络错误，请稍后再试。亦可尝试刷新浏览器。",
            "Connection failed. Try refreshing the page or coming back later.",
            "Conexão não estabelecida. Tente atualizar a página ou volte mais tarde."
        ],
        [LangTextType.A0015]: [
            "已成功创建房间，请等待其他玩家加入",
            "The room has been created. Please wait for other players to join in.",
            "A sala foi criada. Por favor, aguarde outros jogadores entrarem nela."
        ],
        [LangTextType.A0016]: [
            "已成功退出房间",
            "Quit successfully.",
            "Encerrado com sucesso.",
            // Quit what?
        ],
        [LangTextType.A0017]: [
            "密码不正确，请检查后重试",
            "Invalid password.",
            "Senha inválida",
        ],
        [LangTextType.A0018]: [
            "已成功加入房间。",
            "Joined room.",
            "Sala acessada."
        ],
        [LangTextType.A0019]: [
            "该房间已被销毁。",
            "The room has been destroyed.",
            "Sala foi desfeita.",
        ],
        [LangTextType.A0020]: [
            `服务器维护中，请稍后登陆`,
            `The server is under maintenance. Please wait and login later.`,
            `Servidor em manutenção. Aguarde o fim desta para poder acessar.`,
        ],
        [LangTextType.A0021]: [
            `正在读取战局数据，请稍候`,
            `Downloading the match data. Please wait.`,
            `Baixando dados da partida. Por favor, aguarde.`,
            // What is a "war data"? Does it refer to matches played?
        ],
        [LangTextType.A0022]: [
            `恭喜您获得本局的胜利！\n即将回到大厅…`,
            `Victory!`,
            `Vitória!`,
        ],
        [LangTextType.A0023]: [
            `很遗憾您已战败，请再接再厉！\n即将回到大厅…`,
            `Better luck next time.`,
            `Melhor sorte da próxima vez.`,
        ],
        [LangTextType.A0024]: [
            `您确定要结束回合吗？`,
            `End turn?`,
            `Encerrar turno?`,
        ],
        [LangTextType.A0025]: [
            `您确定要返回大厅吗？`,
            `Return to the lobby?`,
            `Retornar ao lobby?`,
        ],
        [LangTextType.A0026]: [
            `您确定要投降吗？`,
            `Are you sure you want to resign?`,
            `Está certo de que quer desistir da partida?`,
        ],
        [LangTextType.A0027]: [
            `请先选中您想要删除的部队，再进行此操作`,
            `First select the desired unit with the cursor to have it deleted.`,
            `Primeiro selecione com o cursor a unidade que se deseja deletar.`,
        ],
        [LangTextType.A0028]: [
            `您只能删除您自己的未行动的部队`,
            `You can delete your own idle units only.`,
            `Apenas sua unidades ociosas podem ser deletadas.`,
        ],
        [LangTextType.A0029]: [
            `是否确定要删除此部队？`,
            `Delete selected unit?`,
            `Apagar a unidade selecionada?`,
        ],
        [LangTextType.A0030]: [
            `所有玩家都已同意和局，战局结束！\n即将回到大厅...`,
            `The game has ended in draw.`,
            `A partida terminou em empate.`,
        ],
        [LangTextType.A0031]: [
            `您确定要求和吗？`,
            `Are you sure you want to request a drawn game?`,
            `Está certo de que deseja propor um empate?`,
        ],
        [LangTextType.A0032]: [
            `您确定要同意和局吗？`,
            `Are you sure you agree with ending the match in a draw?`,
            `Está certo de que concorda com a proposta de encerrar a partida em empate?`,
        ],
        [LangTextType.A0033]: [
            `您确定要拒绝和局吗？`,
            `Are you sure you want to decline ending the match in a draw?`,
            `Está certo de que deseja recusar a proposta de encerrar a partida em empate?`,
        ],
        [LangTextType.A0034]: [
            `已有玩家求和，请先决定是否同意（通过菜单选项操作）`,
            `Your opponent has requested a draw. Please decide whether to accept it before ending your turn.`,
            `Seu oponente propôs um empate. Por favor, decida se irá aceitá-lo antes de encerar seu turno.`,
        ],
        [LangTextType.A0035]: [
            `战局已结束，即将回到大厅…`,
            `The match has ended. Returning to the lobby...`,
            `A partida foi encerrada. Retornando ao lobby...`,
        ],
        [LangTextType.A0036]: [
            `检测到战局数据错误，已自动与服务器成功同步`,
            `The match was synchronized successfully.`,
            `A partida foi sincornizada com sucesso.`,
        ],
        [LangTextType.A0037]: [
            `发生未知错误，正在返回大厅...`,
            `There was an error. Returning to the lobby...`,
            `Houve uma falha. Retornando ao lobby...`,
        ],
        [LangTextType.A0038]: [
            `战局数据已同步`,
            `The match was synchronized successfully.`,
            `A partida foi sincornizada com sucesso.`,
        ],
        [LangTextType.A0039]: [
            `数据加载中，请稍后重试`,
            `Now loading. Please wait and retry.`,
            `Carregando. Por favor, aguarde e tente novamente.`,
            // If something is being loaded, why does one need to "retry"?
        ],
        [LangTextType.A0040]: [
            `数据加载中，请稍候...`,
            `Now loading, please wait...`,
            `Carregando, por favor aguarde...`,
        ],
        [LangTextType.A0041]: [
            `回放已播放完毕`,
            `This is the end of the replay.`,
            `Este é o fim do replay.`,
        ],
        [LangTextType.A0042]: [
            `已处于战局初始状态，无法切换到上一回合`,
            `Can't rewind because it's the beginning of the replay.`,
            `Não é possível voltar pois este é o início do replay.`,
        ],
        [LangTextType.A0043]: [
            `已处于战局结束状态，无法切换到下一回合`,
            `Can't forward because it's the end of the replay.`,
            `Não é possível avançar pois este é o fim do replay.`,
        ],
        [LangTextType.A0044]: [
            `当前正在回放玩家动作，请待其结束后重试`,
            `Now replaying an action. Please wait until it ends.`,
            `Agora reproduzindo uma ação. Aguarde o término desta.`,
        ],
        [LangTextType.A0045]: [
            `已成功切换回合`,
            `Turn switched.`,
            `Turno alterado.`,
        ],
        [LangTextType.A0046]: [
            `请求中，请稍候`,
            `Now requesting, please wait...`,
            `Solicitando, aguarde...`,
        ],
        [LangTextType.A0047]: [
            `昵称已更改`,
            `Display name changed successfully.`,
            `Nome de exibição alterado com sucesso.`,

        ],
        [LangTextType.A0048]: [
            `Discord ID 不正确，请检查后重试`,
            `Invalid discord ID.`,
            `ID do Discord inválido.`,
        ],
        [LangTextType.A0049]: [
            `Discord相关设置已更改`,
            `Discord settings changed successfully.`,
            `Configurações do Discord alteradas com sucesso.`,
        ],
        [LangTextType.A0050]: [
            `您尚未选择任何CO。`,
            `You have chosen no CO.`,
            `Você não selecionou um Comandante`,
        ],
        [LangTextType.A0051]: [
            `是否确定要创建战局？`,
            `Create a game with the current settings?`,
            `Criar uma partida com as configurações atuais?`,
            // This is a confirmation if the game has been correctly setup, right?
        ],
        [LangTextType.A0052]: [
            `是否确定要加入战局？`,
            `Are you sure you want to join the game?`,
            `Está certo de que deseja integrar esta partida?`,
        ],
        [LangTextType.A0053]: [
            `该功能正在开发中，敬请期待`,
            `This feature is still under development...`,
            `Este recurso ainda está sendo desenvolvido...`,
        ],
        [LangTextType.A0054]: [
            `您确定要发动CO POWER吗？`,
            `Activate CO POWER?`,
            `Ativar o Poder do Comandante?`,
        ],
        [LangTextType.A0055]: [
            `当前有其他操作可选。您确定要直接待机吗？`,
            `Another action is available. Are you sure you want to make the unit wait?`,
            `Outra ação é possível. Está certo de que deseja que esta unidade aguarde?`,
        ],
        [LangTextType.A0056]: [
            `未知错误，请拖动截图发给作者，谢谢`,
            `There was an error. Please send a screenshot of it to the developers.`,
            `Houve um erro. Por favor, envie uma captura de tela deste para os desenvolvedores.`,
        ],
        [LangTextType.A0057]: [
            `禁用此项会清空您当前选择的CO（您可以重新选择一个）。确定要禁用吗？`,
            `You've chosen a CO that you've also banned. Revert its ban?`,
            `Você escolheu um Comandante que você também baniu. Reverter este banimento?`,
            // Rephrased the question.
        ],
        [LangTextType.A0058]: [
            `您确定要发动SUPER POWER吗？`,
            `Activate the SUPER POWER?`,
            `Ativar o Super Poder do Comandante?`,
        ],
        [LangTextType.A0059]: [
            `已成功修改地图可用性`,
            `Availability changed successfully.`,
            `Disponibilidade alterada com sucesso.`,
        ],
        [LangTextType.A0060]: [
            `已发出观战请求，对方同意后即可观战`,
            `Requested. You can watch the game when it is accepted.`,
            `Solicitação feita. Você poderá assistir a partida quando esta for aceita.`,
        ],
        [LangTextType.A0061]: [
            `请求已处理`,
            `Request accepted.`,
            `Solicitação aprovada.`,
        ],
        [LangTextType.A0062]: [
            `已删除指定观战者`,
            `The selected viewer is removed.`,
            `O espectador selecionado foi removido.`,
        ],
        [LangTextType.A0063]: [
            `注:任意条件均可留空,等同于忽略该查找条件`,
            `Tip: You can leave any of the filters blank. Those filters will be ignored.`,
            `Dica: O preenchimento de quaisquer campos é opcional. Filtros em branco serão desprezados.`,
        ],
        [LangTextType.A0064]: [
            `双击玩家名称，可以查看其详细信息`,
            `Select a player's name to see their profile.`,
            `Selecione o nome de um jogador para ver o perfil deste.`,
        ],
        [LangTextType.A0065]: [
            `本页设置对局内所有玩家都生效`,
            `The settings affect all players in the game.`,
            `As configurações afetam a todos os jogadores na partida.`,
        ],
        [LangTextType.A0066]: [
            `昵称可使用任意字符，长度不小于4位`,
            `A display name must consist any combination of 4 or more characters.`,
            `Um nome de exibição deve ser composto por alguma combinação de 4 ou mais caracteres.`,
        ],
        [LangTextType.A0067]: [
            [
                `输入正确的Discord ID，并加入以下游戏频道即可实时收到游戏相关消息，如回合轮转等。`,
                `Discord ID 是一串17或18位的纯数字。要获取该ID，您需要前往您的Discord用户设置，打开开发者模式，然后可以在个人账号信息页面中找到它。`,
                `Discord ID 对所有打开了开发者模式的discord用户都是公开的（无论您本人是否打开开发者模式），因此不存在隐私和安全问题。`,
            ].join(`\n`),
            [
                `By entering a valid Discord ID you can, by joining our Discord server, receive notifications of in-game events, such as when your turns come up.`,
                `A Discord ID consists of a string 17 to 18 characters long. To get it you must first go to your Discord User Settings -> App Settings -> Advanced and turn on the "Developer Mode" option. After that the option "Copy User ID" will appear in a menu that appears when you click your profile picture.`,
                `The Discord ID is a public information available to every other user that has the Developer Mode enabled and, as such, sharing it does not infringe on your Discord account security or your personal privacy in any way.`,
            ].join(`\n`),
            [
                `Ao prover um Discord ID válido você pode, ao participar de nosso servidor do Discord, receber notificações de eventos no jogo, tal qual quando chegam seus turnos.`,
                `Um Discord ID consiste em uma cadeia de 17 a 18 caracteres. Para obtê-la você necessita antes dirigir-se à suas Configurações de Usuário no Discord -> Config. do Aplicativo -> Avançado e habilitar a opção "Modo Desenvolvedor". Após isso a opção "Copiar ID do usuário" figurará em um menu que aparece quando você clica em sua imagem de perfil.`,
                `O Discord ID é uma informação pública disponível a todos os demais usuários que tiverem o Modo Desenvolvedor habilitado e, portanto, compartilhá-la não infringe na segurança de sua conta no Discord ou pode expor sua privacidade de qualquer forma.`,
            ].join(`\n`),
        ],
        [LangTextType.A0068]: [
            `可点击以下各个文字以更改设置`,
            `Touch texts below to change the settings.`,
            `Selecione os textos abaixo para alterar configurações.`,
        ],
        [LangTextType.A0069]: [
            `请为参赛玩家设置至少两个队伍`,
            `Set at least two opposing teams.`,
            `Configure pelo menos dois times oponentes entre si.`,
        ],
        [LangTextType.A0070]: [
            `您选择的存档位置非空，其内容将被覆盖。确定要继续创建战局吗？`,
            `The save slot is not empty and will be overwritten. Are you sure you want to create the game?`,
            `Este espaço para gravação não está vazio e será sobrescrito. Continuar com a criação da partida?`,
        ],
        [LangTextType.A0071]: [
            `您的存档将被覆盖。确定要存档吗？`,
            `Your save slot will be overwritten. Continue?`,
            `Este espaço para gravação será sobrescrito. Continuar?`,
        ],
        [LangTextType.A0072]: [
            `您当前的进度将会丢失。确定要读档吗？`,
            `Your current progress will be lost. Continue?`,
            `Seu atual progresso será perdido. Continuar?`,
        ],
        [LangTextType.A0073]: [
            `已成功存档`,
            `Game saved successfully.`,
            `Partida salva com sucesso.`,
        ],
        [LangTextType.A0074]: [
            `确定要重新载入所有地图吗？`,
            `Reload all maps?`,
            `Recarregar todos os mapas?`,
        ],
        [LangTextType.A0075]: [
            `地图重载成功`,
            `Successfully reloaded all maps.`,
            `M̀apas carregados com sucesso.`,
        ],
        [LangTextType.A0076]: [
            `您无法删除最后一个部队`,
            `You can't delete your last unit.`,
            `Você não pode deletar sua última unidade.`,
        ],
        [LangTextType.A0077]: [
            `您没有可用于建造部队的建筑。`,
            `You don't have any buildings that can produce units.`,
            `Você não possui quaisquer propriedades que possam produzir novas unidades.`,
        ],
        [LangTextType.A0078]: [
            `加载中，请稍候`,
            `Now loading`,
            `Carregando`,
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
            [
                `Não traduzido...`,
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
            [
                `Não traduzido...`,
                `确定要删除此地图吗？`,
                `删除后，此地图将不再可用，但相关战局/回放仍可正常运作。`,
            ].join("\n"),
        ],
        [LangTextType.A0081]: [
            `已成功删除地图`,
            `The map has been deleted successfully`,
            `Mapa apagado com sucesso`,
        ],
        [LangTextType.A0082]: [
            `确定要保存此地图吗？`,
            `Are you sure you want to save the map?`,
            `Está certo de que quer gravar este mapa?`,
        ],
        [LangTextType.A0083]: [
            `此地图存在以下问题，暂不能提审，但可以正常保存以备后续编辑。`,
            `This map is not playable (see why below), but you can save it and edit it later.`,
            `Este mapa não é jogável (veja o porquê abaixo), mas você pode gravá-lo e continuar modificando este depois.`,
        ],
        [LangTextType.A0084]: [
            `您已提审过其他地图。若提审此地图，则其他地图将被自动撤销提审。确定要继续吗？`,
            `You have submitted some other maps for review. As such, if you submit this map for review, the other submitted maps will not be reviewed. Continue?`,
            `Você já submeteu outros mapas para avaliação. Assim sendo, se você submeter este mapa para análise, seus outros mapas não serão avaliados. Continuar?`,
        ],
        [LangTextType.A0085]: [
            `已成功保存地图`,
            `The map has been saved.`,
            `O mapa foi salvo.`,
        ],
        [LangTextType.A0086]: [
            `注：若新的宽高小于当前宽高，则超出的图块会被裁剪掉（以左上角为原点）`,
            `Warning: Setting width or height values lower than the current ones implies that portions of the map will be cut off from the right and bottom, respectively.`,
            `Atenção: definir valores de largura ou altura inferiores aos atuais implicar descartar porções do mapa à direita e abaixo, respectivamente.`,
        ],
        [LangTextType.A0087]: [
            `您输入的宽高不合法，请检查`,
            `The Width/Height values provided are not valid.`,
            `Os valores de largura/altura providos não são válidos.`,

        ],
        [LangTextType.A0088]: [
            `注：偏移后超出范围的图块会被裁剪（以左上角为原点）`,
            `Warning: Values that are out of range will be ignored! Remember that the origin of the coordenates is at the upper left corner.`,
            `Atenção: Valores que estiverem além do limite estabelecido serão ignorados. Lembre-se de que a origem das coordenadas encontra-se no canto superior esquerdo.`,
        ],
        [LangTextType.A0089]: [
            `您确定要填充整个地图吗？`,
            `Are you sure you want to apply this fill to the map?`,
            `Está certo de que quer aplicar este preenchimento sobre o mapa?`,
        ],
        [LangTextType.A0090]: [
            `您确定要让过审此地图吗？`,
            `Are you sure you want to accept the map?`,
            `Está certo de que quer aceitar o mapa?`,
        ],
        [LangTextType.A0091]: [
            `您确定要拒审此地图吗？`,
            `Are you sure you want to reject the map?`,
            `Está certo de que quer rejeitar o mapa?`,
        ],
        [LangTextType.A0092]: [
            `您已成功过审该地图。`,
            `Map accepted.`,
            `Mapa aceito.`,
        ],
        [LangTextType.A0093]: [
            `您已成功拒审该地图。`,
            `Map rejected.`,
            `Mapa rejeitado.`,
        ],
        [LangTextType.A0094]: [
            `请输入拒审理由`,
            `Please write down your justification for the rejection`,
            `Por favor, descreva uma justificativa para a rejeição`,
        ],
        [LangTextType.A0095]: [
            `您确定要导入此地图吗？`,
            `Import this map?`,
            `Importar este mapa?`,
        ],
        [LangTextType.A0096]: [
            `至少需要保留一个预设规则`,
            `There must be at least one preset rule for this map.`,
            `Falta definir pelo menos uma regra padrão para este mapa.`,
        ],
        [LangTextType.A0097]: [
            `确定要删除这个预设规则吗？`,
            `Delete this preset rule?`,
            `Apagar esta regra padão?`,
        ],
        [LangTextType.A0098]: [
            `输入的值无效，请重试`,
            `Invalid value. Please retry.`,
            `Valor inválido. Por favor, tente novamente.`,
        ],
        [LangTextType.A0099]: [
            `无法创建更多的预设规则`,
            `You can't create more rules.`,
            `Não é possível criar mais regras.`,
        ],
        [LangTextType.A0100]: [
            `此地图没有预设规则`,
            `This map has no preset rules.`,
            `Este mapa não possui regras padrão.`,
        ],
        [LangTextType.A0101]: [
            `此选项已被预设规则锁定，无法修改`,
            `This setting is locked because a preset rule is chosen.`,
            `Esta configuração está bloqueada porque uma regra padrão foi escolhida.`,
        ],
        [LangTextType.A0102]: [
            `这是一局自定义规则的游戏，请确保您已经理解了所有的规则设定。\n确定要加入这局游戏吗？`,
            `Make sure that you approve of all the custom rules before joining this game.\nContinue?`,
            `Certifique-se de que concorda com todas as regras modificadas antes de decidir participar desta partida.\nContinuar?`,
        ],
        [LangTextType.A0103]: [
            `有玩家正在进行操作，请等待该操作结束后重试`,
            `A player is taking a move. Please retry when the move ends`,
            `Um jogador está realizando um movimento. Por favor, tente novamente quando esta acabar`,
        ],
        [LangTextType.A0104]: [
            `模拟战已成功创建。您可以通过单人模式进入该战局。`,
            `A simulation of this game was created successfully.`,
            `Uma simulação desta partida foi criada com sucesso.`,
        ],
        [LangTextType.A0105]: [
            `请输入您对此地图的评价以及改进建议，可留空`,
            `Please leave your comment here, if any.`,
            `Por favor, deixe aqui seu comentário, se este houver.`,
        ],
        [LangTextType.A0106]: [
            `已成功评分`,
            `Rated successfully.`,
            `Avaliado com sucesso.`,
        ],
        [LangTextType.A0107]: [
            `已成功创建模拟战。您想现在就开始游玩吗？`,
            `The simulation has been created successfully. Do you want to play it now?`,
            `Simulação criada com sucesso. Deseja realizar esta agora?`,
        ],
        [LangTextType.A0108]: [
            `开启作弊模式后，您可以随意修改战局上的各种数据。开启作弊模式后，将无法再取消。\n确定要开启吗？`,
            `You can modify most of the game data if cheating is enabled. However, you won't to disable it later.\nContinue?`,
            `Você pode modificar grande parte das informações da partida se trapaças estiverem habilitadas. Entretanto, estas não podem ser desabilidas depois.\nContinuar?`,
        ],
        [LangTextType.A0109]: [
            `请先把CO搭载到部队上`,
            `Please board your CO first.`,
            `Por favor, embarque seu Comandante primeiro.`,
        ],
        [LangTextType.A0110]: [
            `您确定要让AI来控制这个势力吗？`,
            `Are you sure you want to have an A.I. take control of the army?`,
            `Está certo de que quer que uma I.A. tome controle do exército?`,
        ],
        [LangTextType.A0111]: [
            `您确定要自行控制这个势力吗？`,
            `Do you wish to take control of the army?`,
            `Deseja tomar controle do exército?`,
        ],
        [LangTextType.A0112]: [
            `有棋子正在移动中，请稍候再试`,
            `A unit is moving. Please retry later.`,
            `Uma unidade está se movendo. Por favor, tente novamente mais tarde.`,
        ],
        [LangTextType.A0113]: [
            `您确定要切换该部队的行动状态吗？`,
            `Switch the unit's action state?`,
            `Alterar o estado de ação da unidade?`,
        ],
        [LangTextType.A0114]: [
            `您确定要切换该部队的下潜状态吗？`,
            `Switch the unit's dived state?`,
            `Alterar o estado de submersão da unidade?`,
        ],
        [LangTextType.A0115]: [
            `请联系babygogogo以解决问题`,
            `Please refer to babygogogo.`,
            `Por gentileza, informe babygogogo.`,
        ],
        [LangTextType.A0116]: [
            `战局已开始，并已进入您的回合。要现在就进入战局吗？`,
            `The match has started and it's your turn now. Do you want to play it now?`,
            `A partida se iniciou e é seu turno agora. Deseja jogar esta agora?`,
        ],
        [LangTextType.A0117]: [
            `注：清空后，所有地形都会被设置为平原，所有部队都会被删除！`,
            `Warning: All tiles will be set as plain and all units will be deleted!`,
            `Atenção: Toda a extensão do mapa será transformada em planícies e todas as unidades serão apagadas!`,
        ],
        [LangTextType.A0118]: [
            `设计者名称不合法`,
            `Invalid Map Designer.`,
            `Criador do Mapa inválido.`,
        ],
        [LangTextType.A0119]: [
            `地图名称不合法`,
            `Invalid Map Name.`,
            `Nome do mapa inválido`,
        ],
        [LangTextType.A0120]: [
            `地图英文名称不合法`,
            `Invalid English Map Name.`,
            `Nome do mapa em Inglês inválido.`,
        ],
        [LangTextType.A0121]: [
            `请确保至少有两名玩家，且没有跳过势力颜色`,
            `Invalid armies.`,
            `Exércitos inválidos.`,
        ],
        [LangTextType.A0122]: [
            `部队数据不合法`,
            `Invalid units.`,
            `Unidades inválidas.`,
        ],
        [LangTextType.A0123]: [
            `地形数据不合法`,
            `Invalid tiles.`,
            `Terreno inválido`,
        ],
        [LangTextType.A0124]: [
            `预设规则未设置或不合法`,
            `Preset rules are not set or invalid.`,
            `Regras padrão não foram configuradas ou são inválidas.`,
        ],
        [LangTextType.A0125]: [
            `要现在就进入战局吗？`,
            `Do you want to play it now?`,
            `Deseja jogar agora?`,
        ],
        [LangTextType.A0126]: [
            `您确定要退出此房间吗？`,
            `Are you sure you want to exit the room?`,
            `Está certo de que deseja deixar a sala?`,
        ],
        [LangTextType.A0127]: [
            `您已被请出此房间。`,
            `You have been removed from the room.`,
            `Você foi removido da sala.`,
        ],
        [LangTextType.A0128]: [
            `请先取消您的准备状态`,
            `Please cancel the ready state first.`,
            `Por favor, cancele o estado de prontidão antes.`,
        ],
        [LangTextType.A0129]: [
            `您确定要使用自定义规则吗？`,
            `Are you sure you want to use a custom rule?`,
            `Está certo de que deseja utilizar regras modificadas?`,
        ],
        [LangTextType.A0130]: [
            `您必须保留"无CO"选项。`,
            `The 'No CO' option must be available.`,
            `A opção de não usar um Comandante deve estar disponível.`,
        ],
        [LangTextType.A0131]: [
            `请尽量同时提供中英文名，以英文逗号分隔`,
            `Please if possible write down a name in Chinese and English. Use a comma (,) as a separator.`,
            `Por favor, se possível escreva um nome em Chinês e Inglês. Use uma vírgula (,) como separador.`,
        ],
        [LangTextType.A0132]: [
            `请设定您愿意同时进行的排位赛的数量上限（设置为0等同于您不参加对应模式的排位赛）。`,
            `Set the maximum number of ranking matches you are will"Warning: Setting width or height values lower than the current ones implies that portions of the map will be cut off from the right and bottom, respectively."ing to play concurrently. Setting it to 0 is equivalent to not participating in ranking matches.`,
            `Escolha um valor máximo de partidas que você está disposto a participar em ao mesmo tempo. Escolher o valor 0 equivale a não participar em partidas ranqueadas.`,
        ],
        [LangTextType.A0133]: [
            `正在等待对战各方禁用CO。`,
            `Waiting for the COs to be banned from all sides.`,
            `Aguardando os Comandantes serem banidos por todos os participantes.`,
        ],
        [LangTextType.A0134]: [
            `正在等待对战各方选择CO和势力颜色并进入准备状态。`,
            `Waiting for all the players to be ready for the game.`,
            `Aguardando todos os jogadores anunciarem estarem prontos para a partida.`,
        ],
        [LangTextType.A0135]: [
            `您尚未禁用任何CO。`,
            `You have not banned any COs.`,
            `Você não baniu qualquer Comandante.`,
        ],
        [LangTextType.A0136]: [
            `您已选择不禁用任何CO。`,
            `You have chosen not to ban any COs.`,
            `Você escolheu não banir qualquer Comandante.`,
        ],
        [LangTextType.A0137]: [
            `进入准备状态后，您将无法再次修改CO和势力颜色设定。确定要继续吗？`,
            `You won't be able to change your CO or army color after being ready. Continue?`,
            `Você não será capaz de alterar seu Comandante ou a cor de seu exército após ficar de prontidão. Continuar?`,
        ],
        [LangTextType.A0138]: [
            `确定要禁用这些CO吗？`,
            `Are you sure you want to ban these COs?`,
            `Está certo de que deseja banir estes Comandantes?`,
        ],
        [LangTextType.A0139]: [
            `确定要不禁用任何CO吗？`,
            `Are you sure you want to ban no CO?`,
            `Está certo de que não deseja banir qualquer Comandante?`,
        ],
        [LangTextType.A0140]: [
            `确定要删除当前存档吗？（注：其他存档不受影响；您可以继续游玩当前游戏并存档）`,
            `Are you sure you want to clear the current save slot?`,
            `Está certo de que deseja pagar este jogo salvo?`,
        ],
        [LangTextType.A0141]: [
            `已成功删除存档。`,
            `The save slot has been cleared.`,
            `Jogo apagado.`,
        ],
        [LangTextType.A0142]: [
            `此地图已被修改，需要先保存吗？`,
            `The map has been modified. Do you want to save the map?`,
            `O mapa sofreu alterações. Deseja salvá-lo?`,
        ],
        [LangTextType.A0143]: [
            `此地图已被修改，确定不保存直接退出吗？`,
            `The map has been modified. Exit without saving anyway?`,
            `O mapa dofreu alterações. Deseja sair sem salvá-las?`,
        ],
        [LangTextType.A0144]: [
            `请输入存档备注以便于区分，可留空`,
            `Optionally, name the save slot.`,
            `Opcionalmente, dê um nome a este jogo`,
        ],
        [LangTextType.A0145]: [
            `房间已满员`,
            `The room is full.`,
            `A sala está lotada.`,
        ],
        [LangTextType.A0146]: [
            `战局数据不合法，请检查后重试`,
            `The game data is invalid. Please check it before retrying.`,
            `Os dados do jogo são inválidos. Por favor, os verifique antes de tentar novamente.`,
        ],
        [LangTextType.A0147]: [
            `新密码与确认密码不相同，请检查后重试`,
            `The new password is different from the confirmation password.`,
            `A nova senha é diferente da senha de confirmação.`,
        ],
        [LangTextType.A0148]: [
            `已成功修改密码。`,
            `Password changed successfully.`,
            `Senha alterada com sucesso.`,
        ],
        [LangTextType.A0149]: [
            `您确定要删除此房间吗？`,
            `Are you sure you want to delete this room?`,
            `Tem certeza de que quer excluir esta sala?`,
        ],
        [LangTextType.A0150]: [
            `正在加载图片\n请耐心等候`,
            `Now loading\nPlease wait...`,
            `Carregando\nPor favor, aguarde...`,
        ],
        [LangTextType.A0151]: [
            `已成功修改地图标签`,
            `The map tag has been updated successfully.`,
            `A classificação do mapa foi atualizada com sucesso.`,
        ],
        [LangTextType.A0152]: [
            `您正在观战的玩家已被击败。\n即将回到大厅…`,
            `The player that were watching has lost.\n Returning to the lobby...`,
            `O jogador que você esteve assistindo foi derrotado.\nVoltando para o lobby...`,
        ],
        [LangTextType.A0153]: [
            `请把错误码告知开发组`,
            `Please notify the developers.`,
            `Por favor, notifique os desenvolvedores.`,
        ],
        [LangTextType.A0154]: [
            `已成功提交更新日志。`,
            `The changelog has been updated successfully.`,
            `O registro de alterações foi atualizado com sucesso.`,
        ],
        [LangTextType.A0155]: [
            `输入内容太短，请检查`,
            `The descriptions are too short.`,
            `As descrições são muito curtas.`,
        ],
        [LangTextType.A0156]: [
            `您最少需要填写一种语言的内容`,
            `You have to provide at least one of the texts.`,
            `Você precisa prover pelo menos um dos textos.`,
        ],
        [LangTextType.A0157]: [
            `已成功修改用户权限`,
            `The user privilege has been updated successfully.`,
            `Os privilégios do usuário foram atualizados com sucesso.`,
        ],
        [LangTextType.A0158]: [
            `事件数据不存在，请删除本事件`,
            `The event data doesn't exist. Please delete it.`,
            `Os dados do evento não existem. Por favor, exclua-o.`,
        ],
        [LangTextType.A0159]: [
            `此事件尚未设定条件节点`,
            `The event contains no condition node.`,
            `O evento não contém nenhum nó condicional.`,
        ],
        [LangTextType.A0160]: [
            `条件节点的数据不存在。请删除此条件节点。`,
            `The condition node data doesn't exist. Please delete it.`,
            `Os dados do nó condicional não existem. Por favor, exclua-o.`,
        ],
        [LangTextType.A0161]: [
            `此条件节点不包含任何子条件和子条件节点。`,
            `The condition node contains no condition nor sub node.`,
            `O nó condicional não contém qualquer condição ou subnó.`,
        ],
        [LangTextType.A0162]: [
            `所有子条件和子节点都成立时，此节点成立。`,
            `The condition node is true if ALL of the sub conditions or ALL sub nodes are true.`,
            `O nó condicional é verdadeiro se TODAS as subcondições ou TODOS subnós forem verdadeiros.`,
        ],
        [LangTextType.A0163]: [
            `任意子条件或子节点成立时，此节点成立。`,
            `The condition node is true if ANY of the sub conditions or ANY sub nodes is true.`,
            `O nó condicional é verdadeiro se QUALQUER uma das subcondições ou QUALQUER um dos subnós forem verdadeiros.`,
        ],
        [LangTextType.A0164]: [
            `条件数据不存在，请删除本条件`,
            `The condition data doesn't exist. Please delete it.`,
            `Os dados da condição não existem. Por favor, exclua-o.`,
        ],
        [LangTextType.A0165]: [
            `条件数据不合法，请编辑修正`,
            `The condition data is not valid. Please edit it.`,
            `Os dados da condição não são válidos. Por favor, altere-os.`,
        ],
        [LangTextType.A0166]: [
            `数据出错，请删除本项`,
            `Error. Please delete this line.`,
            `Erro. Por favor, exclua esta linha.`,
        ],
        [LangTextType.A0167]: [
            `此事件尚未设定动作。请至少设定一个动作。`,
            `The event contains no action. Add at least one action.`,
            `O evento não contém qualquer ação. Adicione pelo menos uma ação.`,
        ],
        [LangTextType.A0168]: [
            `动作数据不存在，请删除本动作`,
            `The action data doesn't exist. Please delete this action.`,
            `Os dados da ação não existem. Por favor, exclua esta ação.`,
        ],
        [LangTextType.A0169]: [
            `动作中部分部队的数据不合法`,
            `Some of the unit data in the action are not valid.`,
            `Alguns dos dados da unidade na ação não são válidos.`,
        ],
        [LangTextType.A0170]: [
            `事件数量已达上限`,
            `There are too many events already.`,
            `Já existem demais eventos.`,
        ],
        [LangTextType.A0171]: [
            `您确定要删除事件吗？`,
            `Are you sure you want to delete this event?`,
            `Tem certeza de que deseja excluir este evento?`,
        ],
        [LangTextType.A0172]: [
            `您确定要删除该条件节点吗？`,
            `Are you sure you want to delete the condition node?`,
            `Tem certeza de que deseja excluir o nó condicional?`,
        ],
        [LangTextType.A0173]: [
            `条件节点数量已达上限`,
            `There are too many condition nodes already.`,
            `Já existem nós condicionais demais.`,
        ],
        [LangTextType.A0174]: [
            `条件数量已达上限`,
            `There are too many conditions already.`,
            `Já existem condições demais.`,
        ],
        [LangTextType.A0175]: [
            `您确定要删除该条件吗？`,
            `Are you sure you want to delete the condition?`,
            `Tem certeza de que deseja excluir esta condição?`,
        ],
        [LangTextType.A0176]: [
            `您确定要删除该动作吗？`,
            `Are you sure you want to delete the action?`,
            `Tem certeza de que deseja excluir esta ação?`,
        ],
        [LangTextType.A0177]: [
            `此动作数据出错，请删除`,
            `There is something wrong with the action. Please delete it.`,
            `Há algo de errado com a ação. Por favor, a exclua.`,
        ],
        [LangTextType.A0178]: [
            `事件中的动作数量已达上限`,
            `There are too many actions in the event already.`,
            `Já existem ações demais no evento.`,
        ],
        [LangTextType.A0179]: [
            `无法替换节点，因为这样做会造成循环引用`,
            `Can't replace the node because of a circular reference.`,
            `Não é possível substituir o nó por causa de uma referência circular.`,
        ],
        [LangTextType.A0180]: [
            `事件包含的动作太多，请删除一些动作。`,
            `There are too many actions in this event. Please delete some of them.`,
            `Há ações demais neste evento. Por favor, exclua algumas delas.`,
        ],
        [LangTextType.A0181]: [
            `数值不合法，请修改。`,
            `The value is invalid. Please change it.`,
            `O valor é inválido. Por favor, modifique-o.`,
        ],
        [LangTextType.A0182]: [
            `此地图已包含太多事件，请删除一些。`,
            `The map contains too many events. Please delete some of them.`,
            `O mapa contém eventos demais. Por favor, exclua alguns destes.`,
        ],
        [LangTextType.A0183]: [
            `此地图已包含太多条件节点，请删除一些。`,
            `The map contains too many condition nodes. Please delete some of them.`,
            `O mapa contém nós condicionais demais. Por favor, exclua alguns destes.`,
        ],
        [LangTextType.A0184]: [
            `此地图已包含太多事件动作，请删除一些。`,
            `The map contains too many actions. Please delete some of them.`,
            `O mapa contém ações demais. Por favor, exclua algumas destas.`,
        ],
        [LangTextType.A0185]: [
            `此地图已包含太多条件，请删除一些。`,
            `The map contains too many conditions. Please delete some of them.`,
            `O mapa contém condições demais. Por favor, exclua algumas destas.`,
        ],
        [LangTextType.A0186]: [
            `此条件在同一事件中重复出现。请删除重复的条件。`,
            `There are duplicated conditions in the same event. Please remove any duplication.`,
            `Existem condições duplicadas num mesmo evento. Por favor, remova quaisquer duplicações.`,
        ],
        [LangTextType.A0187]: [
            `此条件数据出错，请删除`,
            `There is something wrong with the condition. Please delete it.`,
            `Há algo de errado com a condição. Por favor, a exclua.`,
        ],
        [LangTextType.A0188]: [
            `未被引用的条件节点、条件、动作都将被删除。您确定要继续吗？`,
            `All of the unused condition nodes, conditions and actions will be deleted. Continue?`,
            `Todos os nós condicionais, condições e ações não utilizados serão excluídos. Continuar?`,
        ],
        [LangTextType.A0189]: [
            `此动作已包含太多部队`,
            `There are too many units in this action.`,
            `Há unidades demais nesta ação.`,
        ],
        [LangTextType.A0190]: [
            `您确定要清空所有部队吗？`,
            `Are you sure you want to delete all the units?`,
            `Tem certeza de que deseja excluir todas as unidades?`,
        ],
        [LangTextType.A0191]: [
            `此动作包含的部队的数量不合法`,
            `The total number of the units is invalid.`,
            `O número total de unidades é inválido.`,
        ],
        [LangTextType.A0192]: [
            `未设置是否会被其他部队阻挡`,
            `'Blockable By Unit' has not been set.`,
            `'Bloqueável por Unidade' não foi definido.`,
        ],
        [LangTextType.A0193]: [
            `未设置是否自动寻找有效地形`,
            `'Need Movable Tile' has not been set.`,
            `'Precisa de Azulejo Móvel' não foi definido.`,
        ],
        [LangTextType.A0194]: [
            `再次点击返回将退出游戏`,
            `Click the "go back" button again to exit the game.`,
            `Clique novamente no botão "voltar" para sair do jogo.`,
        ],
        [LangTextType.A0195]: [
            `感谢您游玩Tiny Wars!`,
            `Thank you for playing Tiny Wars!`,
            `Obrigado por jogar Tiny Wars!`,
        ],
        [LangTextType.A0196]: [
            `您的浏览器不支持播放背景音乐`,
            `Your browser does not support background music.`,
            `Seu navegador não oferece suporte para música de fundo.`,
        ],
        [LangTextType.A0197]: [
            `地图已保存，但数据不合法，因而无法提审`,
            `The map has been saved, however the data is invalid for review.`,
            `O mapa foi salvo, entratanto, as especificações deste o faz inválido para avaliação.`,
        ],
        [LangTextType.A0198]: [
            `您可以通过地图编辑器和模拟战来创建自由模式房间。`,
            `You can create rooms from the map editor or simulations.`,
            `Você pode criar salas pelo editor de mapas ou à partir de simulações.`,
        ],
        [LangTextType.A0199]: [
            `请确保地图上至少有两个存活的势力`,
            `Please ensure that there're at least 2 armies in play.`,
            `Certifique-se de que existam pelo menos 2 exércitos em jogo.`,
        ],
        [LangTextType.A0200]: [
            `创建自由模式游戏失败`,
            `Failed to create a free mode game.`,
            `Falha ao criar um jogo de modo livre.`,
        ],
        [LangTextType.A0201]: [
            `将离开战局并前往创建自由模式房间的页面。\n您确定要继续吗？`,
            `You have to leave the current match (you can come back later) in order to create a free mode room.\nContinue?`,
            `Você terá que sair da atual partida (pode voltar depois) para criar uma sala de modo livre.\nContinuar?`,
        ],
        [LangTextType.A0202]: [
            `已有其他玩家选择该势力`,
            `That army has already been chosen by another player.`,
            `Este exército já foi escolhida por outro jogador.`,
        ],
        [LangTextType.A0203]: [
            `已有其他玩家选择该颜色`,
            `That color has been chosen by another player.`,
            `Esta cor já foi escolhida por outro jogador.`,
        ],
        [LangTextType.A0204]: [
            `该势力不可选`,
            `That army is unavailable.`,
            `Este exército não está disponível.`,
        ],
        [LangTextType.A0205]: [
            `无法撤销准备状态`,
            `You can't cancel when in the 'ready' state.`,
            `Não é possível cancelar quando estiver no estado 'pronto'.`,
        ],
        [LangTextType.A0206]: [
            [
                `一旦进入准备状态，您将无法反悔，也无法修改您的CO和颜色设定。`,
                `确定要继续吗？`,
                ``,
                `注：正式开局前，您的对手不会知道您选择了哪个CO。`,
            ].join(`\n`),
            [
                `Once you're ready, you cannot un-ready nor change your CO or color.`,
                `Continue?`,
                ``,
                `Note: Your opponents will not know which CO you have chosen until the game starts.`,
            ].join(`\n`),
            [
                `Uma vez pronto, você não pode desfazer nem mudar seu Comandante ou cor.`,
                `Tem certeza de que deseja continuar?`,
                ``,
                `Note: Seus oponentes não saberão qual Comandante você escolheu até o início do jogo.`,
            ].join(`\n`),
        ],
        [LangTextType.A0207]: [
            `您已准备就绪，无法再修改各项设定`,
            `You're in the ready state and can no longer change the settings.`,
            `Você está no estado de prontidão e não pode mais alterar as configurações.`,
        ],
        [LangTextType.A0208]: [
            `您确定要不使用任何CO吗？`,
            `Are you sure you want to use no CO?`,
            `Tem certeza de que deseja não usar qualquer Comandante?`,
        ],
        [LangTextType.A0209]: [
            `排位模式下无法修改势力`,
            `It's not allowed to change your army in ranking matches.`,
            `Não é permitido mudar seu exército em partidas ranqueadas.`,
        ],
        [LangTextType.A0210]: [
            `请选择您想要禁用的CO`,
            `Please choose the COs you want to ban for the match.`,
            `Por favor, escolha os Comandantes que deseja banir nesta partida.`,
        ],
        [LangTextType.A0211]: [
            `请选择您的CO和颜色，并进入准备就绪状态`,
            `Please choose your CO, color, and then press "ready" so that the match can start.`,
            `Por favor, escolha seu Comandante e cor, e então pressione "pronto" para que a partida possa começar.`,
        ],
        [LangTextType.A0212]: [
            `玩家序号不合法`,
            `The player's index is invalid.`,
            `O índice do jogador é inválido.`,
        ],
        [LangTextType.A0213]: [
            `玩家状态不合法`,
            `The state of the player is invalid.`,
            `O estado do jogador é inválido.`,
        ],
        [LangTextType.A0214]: [
            `"存活"状态下，玩家可以正常行动。可以从其他状态切换到本状态（死而复生）。`,
            `In the "Playing" state, players can act as usual. It's possible to revert a player's state from "(Being) Defeated" to "Playing".`,
            `No estado "Jogando", jogadores podem agir normalmente. É possível reverter o estado de um jogador de "(Sendo) Derrotado" para "Jogando".`,
        ],
        [LangTextType.A0215]: [
            `"即将战败"状态下，玩家无法行动。除非有其他事件把玩家状态改为"存活"，否则系统将自动清除所有该玩家的部队，建筑将变为中立，且状态将变为已战败。`,
            `In the "Being Defeated" state, players cannot act. Their troops are cleared and buildings set to neutral unless their state is changed to be "Playing".`,
            `No estado "Sendo Derrotado", os jogadores não podem agir. Suas tropas são apagadas e suas propriedades neutralizadas a menos que seu estado seja alterado para "Jogando".`,
        ],
        [LangTextType.A0216]: [
            `"已战败"状态下，玩家无法行动。如果玩家是直接从存活状态切换到已战败状态，则其部队和建筑所有权都会残留。`,
            `In the "Defeated" state, players cannot act. If their previous state was "Playing", their troops will remain.`,
            `No estado "Derrotado", jogadores não podem agir. Se o estado anterior destes era "Jogando", suas tropas permanecerão.`,
        ],
        [LangTextType.A0217]: [
            `所有数值设定与《高级战争：毁灭之日》保持一致。`,
            `All values, for units and tiles, are taken from Advance Wars: Days of Ruin.`,
            `Todos os valores, das unidades e terrenos, são os obtidos em Advance Wars: Days of Ruin.`,
        ],
        [LangTextType.A0218]: [
            `此版本引入了高战1/2/DS的CO（比如Andy）。这些CO仍然具有全局效果，并由zhaotiantong进行了平衡。使用了由NGC6240设计的兵种数据。`,
            `COs from AW 1/2/DS (like Andy, for example) are reintroduced in this version. They still produce global effects and are rebalanced by zhaotiantong, while units are rebalanced by NGC6240.`,
            `Os Comandantes de AW 1/2/DS (como Andy, por exemplo) são reintroduzidos nesta versão. Eles ainda produzem efeitos globais e foram balanceados por zhaotiantong, enquanto as unidades foram balanceadas por NGC6240.`,
        ],
        [LangTextType.A0219]: [
            `注意：各版本的玩家数据不互通。您可能需要重新注册账户。`,
            `Note: User accounts are not interchangeable between the different game versions. So you may need to register again.`,
            `Note: Contas de usuários não são intercambiáveis entre as diferentes versões do jogo. Então, talvez seja necessário registrar-se novamente.`,
        ],
        [LangTextType.A0220]: [
            `您已选择由自己控制此势力，无法修改为AI控制。`,
            `You have chosen to use this army.`,
            `Você escolheu usar este exército.`,
        ],
        [LangTextType.A0221]: [
            `此规则已被设定为不可用于合作模式，因此无法修改此选项。`,
            `The war rule is not available for the Coop mode. Please change that first.`,
            `Tal regra não está disponível para o modo Coop. Por favor, altere isso antes.`,
        ],
        [LangTextType.A0222]: [
            `无法切换控制权，因为其他势力都由AI控制。`,
            `All other armies are controlled by the A.I. already.`,
            `Todos os demais exércitos já são controladas pelo I.A.`,
        ],
        [LangTextType.A0223]: [
            `请确保此地图已包含预设规则。`,
            `Please make sure that there is at least one preset rule.`,
            `Certifique-se de que haja pelo menos uma regra predefinida.`,
        ],
        [LangTextType.A0224]: [
            `这是《高级战争》1、2、DS版的网络对战版，独立于Tiny Wars。主要开发维护者：Amarriner、Walker、Matsuzen。`,
            `This is a web version of Advance Wars 1/2/Dual Strike, independent of Tiny Wars. Developed and maintained mainly by Amarriner, Walker and Matsuzen.`,
            `Esta é uma versão web de Advance Wars 1/2/Dual Strike, independente de Tiny Wars. Desenvolvida e mantida, principalemente, por Amarriner, Walker e Matsuzen.`,
        ],
        [LangTextType.A0225]: [
            `您确定要继续吗？`,
            `Continue?`,
            `Continuar?`,
        ],
        [LangTextType.A0226]: [
            `您确定要跳过剧情吗？`,
            `Skip dialogs?`,
            `Pular diálogos?`,
        ],
        [LangTextType.A0227]: [
            `此动作包含的对话数量不合法`,
            `The number of the dialogues is invalid.`,
            `O número dos diálogos é inválido.`,
        ],
        [LangTextType.A0228]: [
            `此动作已包含太多对话`,
            `There are too many dialogues in this action.`,
            `Há diálogos demais nesta ação.`,
        ],
        [LangTextType.A0229]: [
            `此剧情不合法，无法播放`,
            `This dialogue is invalid.`,
            `Este diálogo é inválido.`,
        ],
        [LangTextType.A0230]: [
            `此对白的类型不合法`,
            `The type of this dialogue is invalid.`,
            `O tipo deste diálogo é inválido.`,
        ],
        [LangTextType.A0231]: [
            `此CO对白的数据不合法`,
            `The data of the CO dialogue is invalid.`,
            `Os dados do diálogo do Comandante são inválidos.`,
        ],
        [LangTextType.A0232]: [
            `此旁白的数据不合法`,
            `The data of the aside is invalid.`,
            `Os dados do aparte são inválidos.`,
        ],
        [LangTextType.A0233]: [
            `已有的地形装饰物会被覆盖。您确定要自动填充吗？`,
            `The current tile decorations will be overwritten. Continue with the auto fill?`,
            `As atuais decorações dos terrenos serão sobrescritas. Continuar com o preenchimento automático?`,
        ],
        [LangTextType.A0234]: [
            `导出失败，请使用chrome浏览器重试`,
            `Failed to export. Please retry with Chrome browser.`,
            `Falha na exportação. Por favor, tente novamente com o navegador Chrome.`,
        ],
        [LangTextType.A0235]: [
            `导出成功`,
            `Exported successfully.`,
            `Exportado com sucesso.`,
        ],
        [LangTextType.A0236]: [
            `导入失败，请确保剪贴板数据无误`,
            `Failed to import. Please ensure the clipboard data is valid.`,
            `Falha na importação. Por favor, certifique-se de que os dados da área de transferência são válidos.`,
        ],
        [LangTextType.A0237]: [
            `当前的地图数据将被覆盖（但存档不受影响）。您确定要继续导入吗？`,
            `The current map data will be overwritten, but the saved data will not be affected. Are you sure you want to import?`,
            `Os dados atuais do mapa serão sobrescritos, mas os dados salvos não serão afetados. Tem certeza de que deseja importar?`,
        ],
        [LangTextType.A0238]: [
            `您对地图的评分越高，该地图在您参与的排位赛中的出现率也越高。`,
            `The higher your rating, the higher the probability that the map will be selected in your ranked matches.`,
            `Quanto maior sua classificação, maior a probabilidade do mapa ser selecionado em suas partidas ranqueadas.`,
        ],
        [LangTextType.A0239]: [
            `请等待电脑回合结束后再进行此操作`,
            `Please wait until the A.I.'s turn ends.`,
            `Por favor, aguarde até o fim do turno da I.A.`,
        ],
        [LangTextType.A0240]: [
            `您在本回合内已处理过求和信息`,
            `You have already set draw in this turn.`,
            `Você já propôs um empate neste turno.`,
        ],
        [LangTextType.A0241]: [
            `已有其他玩家发起了和局请求。您是否同意该请求？`,
            `Another player has requested a drawn game. Do you want to accept the request?`,
            `Outro jogador solicitou um empate. Você deseja aceitar a solicitação?`,
        ],
        [LangTextType.A0242]: [
            `请等到您的回合再进行此操作`,
            `Please wait until your turn begins.`,
            `Por favor, espere até o seu turno começar.`,
        ],
        [LangTextType.A0243]: [
            `您确定要切换CO搭载状态吗？`,
            `Are you sure you want to switch the CO onboard state?`,
            `Tem certeza de que deseja alternar o estado de embarque do Comandante?`,
        ],
        [LangTextType.A0244]: [
            `已成功保存并提审地图`,
            `The map has been submitted for review successfully.`,
            `O mapa foi salvo e enviado com sucesso para avaliação.`,
        ],
        [LangTextType.A0245]: [
            `您已提审此地图的上一个版本。\n若继续保存此地图（不论是否提审），则上一个版本会被自动撤销提审。\n\n确定要继续吗？`,
            `You have submitted a previous version of this map for review.\nIf you proceed with saving this map, that submitted version will not be reviewed.\n\nContinue?`,
            `Você já enviou uma versão anterior deste mapa para revisão.\nSe prosseguir a salvar este mapa, esta versão enviada será automaticamente retirada da revisão.\n\nContinuar?`,
        ],
        [LangTextType.A0246]: [
            `请填写自动保存的时间间隔，单位为秒。\n若当前地图已被提审，则自动保存功能将失效。\n您可以不填写时间间隔，以此禁用自动保存功能。`,
            `Input the time interval for the auto save.\nNote that this functionality will be disabled if the current map is submitted for review.\nAlternatively, you can clear the input to cancel.`,
            `Informe o intervalo de tempo para o salvamento automático.\nNote que esta funcionalidade será desativada se o mapa atual for enviado para avaliação.\nVocê pode deixar o campo em branco para cancelar.`,
        ],
        [LangTextType.A0247]: [
            `已启用自动保存`,
            `Auto save enabled.`,
            `Salvamento automático ativado.`,
        ],
        [LangTextType.A0248]: [
            `已禁用自动保存`,
            `Auto save disabled.`,
            `Salvamento automático desativado.`,
        ],
        [LangTextType.A0249]: [
            `您将离开战局模式并进入回放（您可以随时返回）。\n确定要继续吗？`,
            `You have to leave the current match (you can return later).\nContinue?`,
            `Você precisa deixar a atual partida (você poderá retornar depois).\n Continuar?`,
        ],
        [LangTextType.A0250]: [
            `指定坐标不合法`,
            `The specified coordinates aren't valid.`,
            `As coordenadas especificadas não são válidas.`,
        ],
        [LangTextType.A0251]: [
            `指定坐标超出了地图大小`,
            `The specified coordinates are outside the map.`,
            `As coordenadas especificadas estão fora do mapa.`,
        ],
        [LangTextType.A0252]: [
            `指定天气不合法`,
            `The weather type is not valid.`,
            `O tipo de clima especificado não é válido.`,
        ],
        [LangTextType.A0253]: [
            `指定持续时间不合法`,
            `The duration is not valid.`,
            `A duração especificada não é válida.`,
        ],
        [LangTextType.A0254]: [
            `设置为0回合可使指定状态永久持续`,
            `Set the quantity of turns to 0 to make the state permanent.`,
            `Especifique a quantidade de turnos para 0 para tornar o estado permanente.`,
        ],
        [LangTextType.A0255]: [
            `指定玩家不合法`,
            `The player is not valid.`,
            `O jogador especificado não é válido.`,
        ],
        [LangTextType.A0256]: [
            `指定地形类型不合法`,
            `The tile type is invalid.`,
            `O tipo de terreno especificado é inválido.`,
        ],
        [LangTextType.A0257]: [
            `您确定要切换该部队的A.I.模式吗？`,
            `Are you sure you want to switch the unit's A.I. mode?`,
            `Tem certeza de que deseja alternar o modo de I.A. da unidade?`,
        ],
        [LangTextType.A0258]: [
            `此动作指定的对话背景不合法`,
            `The background of the dialogues is invalid.`,
            `O fundo dos diálogos especificados não é válido.`,
        ],
        [LangTextType.A0259]: [
            `已绘制的道路和桥梁的造型将被覆盖，但覆盖结果可能不会完全符合您的预期。\n建议您先保存地图再进行此操作。\n确定要调整吗？`,
            `The roads and bridges set will be overwritten, and the results may not meet your expectations completely.\nAs such, it's recommended that you save this map before continuing.\nAre you sure you want to adjust them?`,
            `As estradas e pontes colocadas serão sobrescritas, e os resultados podem não corresponder completamente às suas expectativas.\nPor isso, recomenda-se salvar este mapa antes de continuar.\nTem certeza de que deseja ajustá-los?`,
        ],
        [LangTextType.A0260]: [
            `已绘制的等离子、超级等离子的造型将被覆盖，但覆盖结果可能不会完全符合您的预期。\n建议您先保存地图再进行此操作。\n确定要调整吗？`,
            `The (super) plasmas set will be overwritten, and the results may not meet your expectations completely.\nAs such, It's recommended that you save this map before continuing.\nAre you sure you want to adjust them?`,
            `Os (super) plasmas colocados serão sobrescritos, e os resultados podem não atender completamente às suas expectativas.\nPor isso, recomenda-se salvar este mapa antes de continuar.\nTem certeza de que deseja ajustá-los?`,
        ],
        [LangTextType.A0261]: [
            `地图文件体积太大，无法保存`,
            `This map is too large to be saved.`,
            `Este mapa é grande demais para ser salvo.`,
        ],
        [LangTextType.A0262]: [
            `播放当前回合中的CO专属BGM`,
            `Play the theme of the CO who is in turn.`,
            `Reproduzir o tema do Comandante do atual turno.`,
        ],
        [LangTextType.A0263]: [
            `选择的BGM无效`,
            `The chosen BGM is invalid.`,
            `A trilha sonara escolhida não é válida.`,
        ],
        [LangTextType.A0264]: [
            `参数未设置`,
            `The parameters are not specified.`,
            `Os parâmetros não estão especificados.`,
        ],
        [LangTextType.A0265]: [
            `参数不合法`,
            `The parameters are invalid.`,
            `Os parâmetros são inválidos.`,
        ],
        [LangTextType.A0266]: [
            `请最少选择一个区域`,
            `Please select at least one location.`,
            `Por favor, selecione pelo menos uma localização.`,
        ],
        [LangTextType.A0267]: [
            `正在编辑该区域，无法将其隐藏`,
            `The location is being edited and, thus, can't be hidden.`,
            `A localização está sendo editada e, portanto, não pode ser ocultada.`,
        ],
        [LangTextType.A0268]: [
            `指定坐标已存在`,
            `These coordinates already exist.`,
            `As coordenadas especificadas já existem.`,
        ],
        [LangTextType.A0269]: [
            `该地块已有部队占据，不能绘制可攻击的地形`,
            `Can't place an attackable object on a tile already occupied by a unit.`,
            `Não é possível colocar um objeto atacável em um terreno já ocupado por uma unidade.`,
        ],
        [LangTextType.A0270]: [
            `已搭载CO`,
            `the CO is onboard`,
            `O Comandante está à bordo.`,
        ],
        [LangTextType.A0271]: [
            `未搭载CO`,
            `the CO is not onboard`,
            `O Comandante não está à bordo.`,
        ],
        [LangTextType.A0272]: [
            [
                `"存活"状态下，玩家可以正常行动。可以从其他状态切换到本状态（死而复生）。"`,
                ``,
                `"即将战败"状态下，玩家无法行动。除非有其他事件把玩家状态改为"存活"，否则系统将自动清除所有该玩家的部队，建筑将变为中立，且状态将变为已战败。`,
                ``,
                `"已战败"状态下，玩家无法行动。如果玩家是直接从存活状态切换到已战败状态，则其部队和建筑所有权都会残留。`,
            ].join(`\n`),
            [
                `In the "Playing" state, players can act as usual. It's possible to revert a player's state from "(Being) Defeated" to "Playing".`,
                ``,
                `In the "Being Defeated" state, players cannot act. Their troops are cleared and buildings set to neutral unless their state is changed to be "Playing".`,
                ``,
                `In the "Defeated" state, players cannot act. If their previous state was "Playing", their troops will remain.`,
            ].join(`\n`),
        ],
        [LangTextType.A0273]: [
            `当前无法进行此操作，请稍后再试`,
            `This operation is currently unavailable, please retry it later.`,
            `Esta operação está atualmente indisponível, por favor, tente novamente mais tarde.`,
        ],
        [LangTextType.A0274]: [
            `此部队已满载`,
            `The unit is fully loaded.`,
            `Esta unidade está totalmente abastecida.`,
        ],
        [LangTextType.A0275]: [
            `无法访问系统剪贴板`,
            `Failed to access the system clipboard.`,
            `Falha ao acessar a área de transferência do sistema.`,
        ],
        [LangTextType.A0276]: [
            `此规则已被设定为不可用于挑战模式，因此无法修改此选项。`,
            `That rule is not available for the War Room mode. Please change that first.`,
            `Esta regra não está disponível para o modo Desafios. Por favor, mude isso primeiro.`,
        ],
        [LangTextType.A0277]: [
            [
                `恭喜通关！您是否希望以此战局数据参与全服排行？`,
                `\n`,
                `注：`,
                `1. 服务器将花费一定时间来验证数据的合法性，所以排名可能不会立刻刷新。`,
                `2. 若您曾经提交过分数更高的记录，则该记录仍将保留，此次提交将被自动忽略。`,
            ].join(`\n`),
            [
                `Do you want to participate the server-wide ranking by sending the replay of your match?`,
                `\n`,
                `Note:`,
                `1. It will take some time for the server to validate the replay data, therefore updating your ranking won't be instantaneous.`,
                `2. If there is a better record of yours, that record will be kept, and this new record will be discarted.`,
            ].join(`\n`),
            [
                `Gostaria de participar no ranqueamento ao fornecer o replay da sua partida?`,
                `\n`,
                `Note:`,
                `1. Validar o replay requer algum tempo, então a atualização do seu ranqueamento não será instantânea.`,
                `2. Se houver um recorde anterior seu que seja melhor, esse será mantido e este descartado.`,
            ].join(`\n`)
        ],
        [LangTextType.A0278]: [
            `数据版本太旧，无法参与排行`,
            `The data is deprecated.`,
            `Tais dados estão defasados.`,
        ],
        [LangTextType.A0279]: [
            `已有分数更高的通关数据`,
            `There is an existing replay with a better evaluation.`,
            `Já existe um replay melhor avaliado.`,
        ],
        [LangTextType.A0280]: [
            `已成功提交回放数据，请耐心等候`,
            `The data is successfully submitted for validation.`,
            `Os dados foram enviados com sucesso para validação..`,
        ],
        [LangTextType.A0281]: [
            `分数太低，无法参与排行`,
            `The score is too low to participate in the ranking.`,
            `A pontuação baixa demais para participar do ranking.`,
        ],
        [LangTextType.A0282]: [
            [
                `您确定要提交此规则、作为本地图的全新规则吗？`,
                ``,
                `注：`,
                `1. 请务必检查各项设定，确保正确无误。`,
                `2. 此操作不会影响地图已有的各个规则。`,
                `3. 操作前请尽可能与地图原作者联系，使其清楚并同意新增此规则。`,
            ].join(`\n`),
            [
                `Do you want to submit this rule as a new one to be added to this map?`,
                ``,
                `Note:`,
                `1. Please be sure to check all settings to ensure that they are correct.`,
                `2. This operation will not affect the existing rules of the map.`,
                `3. Before doing this, try to contact the original author of the map to check if they're in agreement with adding this rule.`,
            ].join(`\n`),
            [
                `Você deseja enviar essa regra como uma nova a ser adicionada a este mapa?`,
                ``,
                `Atenção:`,
                `1. Certifique-se de verificar todas as configurações para garantir que estão corretas.`,
                `2. Esta operação não afetará as regras já existentes do mapa.`,
                `3. Antes de prosseguir, tente contato com o autor original do mapa para saber se este está em concordância com a adição dessa regra.`,
            ].join(`\n`),
        ],
        [LangTextType.A0283]: [
            `已成功新增规则`,
            `Rule added successfully.`,
            `Regra adicionada com sucesso.`,
        ],
        [LangTextType.A0284]: [
            `摧毁地块上的部队。`,
            `Destroy units on the tiles.`,
            `Destruir unidades sobre os terrenos`
        ],
        [LangTextType.A0285]: [
            [
                `若您希望地图进入游戏正式图池以供其他玩家游玩，您必须提审地图，并等待地图审核小组审核通过。`,
                `但是，本游戏对地图质量有一定要求。在对游戏机制有足够深入的理解之前，您的地图可能无法过审。`,
                ``,
                `不过，您可以通过菜单中的自由模式选项，直接使用本地图建立多人游戏，而无需通过审核。`,
            ].join("\n"),
            [
                `For a map to enter this game's official map pool, it must first be submitted for review and later approved by a mamber of the Map Committee.`,
                `As such, the map must meet some criteria of quality, that can be learned with a deeper understanding of this game's mechanics.`,
                ``,
                `Though you can still play multiplayer matches with it without it having been previously approved by using the free mode option.`,
            ].join("\n"),
            [
                `Para um mapa entrear na lista oficial de mapas deste jogo, este deve primeiro ser submetido e depois aprovado em análise de um membro do Comitê de Mapas.`,
                `Assim sendo, o mapa deverá corresponder a dados critérios de qualidade, os quais podem ser compreendidos com um aprendizado mais aprofundado das mecânicas do jogo.`,
                ``,
                `Não obstante, você ainda pode jogar partidas multijogador com este sem que este tenha sido préviamente aprovado com a opção do modo livre.`,
            ].join(`\n`),
        ],
        [LangTextType.A0286]: [
            `此操作无法撤销。您确定要继续吗？`,
            `This operation cannot be undone. Continue?`,
            `Esta operação não pode ser desfeita. Continuar?`,
        ],
        [LangTextType.A0287]: [
            `已成功修改规则可用性`,
            `Rule availability is modified successfully.`,
            `Disponibilidade da regra alterada com sucesso.`
        ],
        [LangTextType.A0288]: [
            `已保存当前状态`,
            `Current state saved successfully.`,
            `Estado atual salvo com sucesso.`,
        ],
        [LangTextType.A0289]: [
            `尚未保存任何状态`,
            `There is no saved state.`,
            `Não há estados salvos.`,
        ],
        [LangTextType.A0290]: [
            `值越大，则自动回放时每个动作之间的停顿时间越长。`,
            `The higher the value, the longer the interval between each action during automatic playback.`,
            `Quanto maior este valor, maior o intervalo entre ações na reprodução automática.`,
        ],
        [LangTextType.A0291]: [
            `必须保留最少一个规则`,
            `There must be at least one rule.`,
            `Necessita haver pelo menos uma regra.`
        ],
        [LangTextType.A0292]: [
            [
                `您确定要删除此规则吗？`,
                ``,
                `注：`,
                `1. 若此规则曾用于单机挑战模式，则相关排名、分数、回放将被清除。`,
                `2. 多人模式相关数据不会变化，回放也会保留。`,
            ].join(`\n`),
            [
                `Delete this rule?`,
                ``,
                `Note:`,
                `1. If it has been used in the war room mode, all ranking, score and replay data associated with it will be erased.`,
                `2. On the other hand, data related to multiplayer mode will not change, and the replays will be kept.`,
            ].join(`\n`),
            [
                `Apagar esta regra?`,
                ``,
                `Note:`,
                `1. Se esta foi utilizada no modo Desafios, todo o ranqueamento, pontuação e replays associados a esta serão apagados.`,
                `2. Por outro lado, quaisquer dados relacionados a partidas multijogador tidas com esta não serão alterados, e replays serão mantidos.`,
            ]
        ],
        [LangTextType.A0293]: [
            `已成功删除规则`,
            `Rule deleted.`,
            `Regra apagada.`,
        ],
        [LangTextType.A0294]: [
            `添加区域和删除区域所指定的ID有重合`,
            `Some ID specified at "Add to Location" and "Del from Location" coincide.`,
            `Alguns IDs especificados em "Adicionar a Localização" e "Deletar da Localização" coincidem.`
        ],
        [LangTextType.A0295]: [
            `地图长宽必须相同才能使用此功能`,
            `The width and height of the map is not the same.`,
            `A largura e altura do mapa não são as mesmas.`
        ],
        [LangTextType.A0296]: [
            [
                `此地图包含可用于多人排位赛的规则。请仔细检查各项设定，确保没有质量问题。`,
                ``,
                `您确定要过审此地图吗?`,
            ].join(`\n`),
            [
                `This map contains rules that can be used for ranked matches. Please check it thoroughly to ensure that there are no quality problems.`,
                ``,
                `Accept this map?`,
            ].join(`\n`),
            [
                `Este mapa contém regras que o permite ser utilizado em partidas ranqueadas. Por favor verifique-o cuidadosamente para assegurar não haverem problemas de qualidade.`,
                ``,
                `Aceitar este mapa?`,
            ]
        ],
        [LangTextType.A0297]: [
            `无法获取观战信息`,
            `Failed to load the spectating data.`,
            `Falha ao carregar dados dos espectadores.`,
        ],
        [LangTextType.A0298]: [
            `尚未设置预设规则的可用性`,
            `The availability of the preset rule has not been set.`,
            `A disponibilidade da regra padrão não foi definida.`
        ],
        [LangTextType.A0299]: [
            `您已向所有玩家发送过观战请求`,
            `You have already made requests to all players.`,
            `VocÊ tem solicitações que foram feitas a todos os jogadores.`
        ],
        [LangTextType.A0300]: [
            `暂未收到观战请求`,
            `There is no incoming request.`,
            `Não há solicitações pendentes.`
        ],
        [LangTextType.A0301]: [
            `目前无人观战`,
            `There is no spectator.`,
            `Não há espectadores.`,
        ],
        [LangTextType.A0302]: [
            `没有可用的统计数据`,
            `No statistics available.`,
            `Não há estatísticas disponíveis`,
        ],
        [LangTextType.A0303]: [
            `存档不存在，无法读取`,
            `The game data doesn't exist.`,
            `Os dados do jogo não existem.`
        ],
        [LangTextType.A0304]: [
            `自动保存失败`,
            `Auto save failed.`,
            `O salvamento automático falhou.`,
        ],
        [LangTextType.A0305]: [
            `未指定事件动作ID`,
            `No event action ID is specified.`,
            `Não há ID de um evento de ação sendo especificado.`,
        ],
        [LangTextType.A0306]: [
            `存在重复的事件动作ID`,
            `There are duplicated event action IDs.`,
            `Há pelo menos um ID de evento de ação duplicado.`,
        ],
        [LangTextType.A0307]: [
            `指定的事件动作ID无效`,
            `There is invalid event action ID.`,
            `Há pelo menos um ID de evento de ação inválido.`,
        ],
        [LangTextType.A0308]: [
            `指定的文本不合法`,
            `The specified text is not valid.`,
            `O texto especificado não é válido.`,
        ],
        [LangTextType.A0309]: [
            `禁止使用CO主动技。`,
            `Cannot Use CO Power.`,
            `Não se pode usar o Poder do Comandante.`,
        ],
        [LangTextType.A0310]: [
            `已成功修改规则名称`,
            `Rule name updated.`,
            `Nome da regra atualizado`,
        ],
        [LangTextType.A0311]: [
            `请先命名此地图标签`,
            `Name the map tag first.`,
            `Primeiro nomeie a etiqueta do mapa.`,
        ],
        [LangTextType.A0312]: [
            `已成功修改地图标签`,
            `Map tag updated.`,
        ],
        [LangTextType.A0313]: [
            `请小心修改标签设定，因为所有带有该标签的地图都会受到影响。`,
            `Please modify the settings carefully. All the tagged maps will be affected.`,
            `Por favor, modifique as configurações com cuidado. Todos os mapas marcados serão afetados.`,
        ],
        [LangTextType.A0314]: [
            `您确定要删除此槽位的所有数据吗？`,
            `Are you sure you want to delete the data in this map slot?`,
            `Tem certeza de que deseja excluir este mapa?`,

        ],
        [LangTextType.A0315]: [
            `此地图正在审核中，暂时无法删除`,
            `This map is being reviewed and, therefore, you can't delete it yet.`,
            `O mapa está sendo revisado, portanto, você não pode excluí-lo ainda.`,
        ],
        [LangTextType.A0316]: [
            `由于地图设计存在问题，所以此地图暂时不能提审`,
            `This map can't be submitted for review because of the listed design problems.`,
            `Este mapa não pode ser enviado para revisão devido ao problemas de design listados.`,
        ],
        [LangTextType.A0317]: [
            `此地图尚未保存。您确定要跳过保存吗？`,
            `This map has not been saved. Are you sure you want to skip the saving it?`,
            `Este mapa ainda não foi salvo. Tem certeza de que não deseja fazer isso agora?`,
        ],
        [LangTextType.A0318]: [
            `无法进一步撤销`,
            `Unable to undo further.`,
            `Não é possível desfazer mais.`,
        ],
        [LangTextType.A0319]: [
            `无法进一步重做`,
            `Unable to redo further.`,
            `Não é possível refazer mais.`,
        ],
        [LangTextType.A0320]: [
            `所有事件、条件、条件节点、动作都会被删除。\n您确定要继续吗？`,
            `All the events, conditions, conditional nodes and actions will be deleted.\nContinue?`,
            `Todos os eventos, condições, nós condicionais e ações serão deletados.\nContinuar?`,
        ],
        [LangTextType.A0321]: [
            `您可以通过双指缩放或滚动鼠标滚轮来缩放地图。`,
            `You can zoom the map by performing a pinching gesture or using a mouse wheel.`,
            `Você pode ampliar ou afastar o mapa realizando um gesto de pinça ou utilizando a roda de um mouse.`,
        ],
        [LangTextType.A0322]: [
            `要移动您的部队，请点击该部队，并选择一个目标地点。您可以通过滑动来指定移动路线。之后，您可以在弹出的菜单中选择想要的操作。`,
            `Select the unit you want to move, then where you want it to go. Options sometimes appear after a unit moves.`,
            `Para mover a sua unidade, clique nela e escolha onde esta deve ir. Às vezes opções aparecem após a unidade se mover.`,
        ],
        [LangTextType.A0323]: [
            `部队的最大HP是10。如果部队的HP小于10，则该数字会显示在部队图标上。如果HP降为0，则该部队会被摧毁。`,
            `Units have a maximum of 100 HP (counted from 0 to 10 by rounding up). If a unit's HP is less than 10, this number is displayed below the unit. If its HP falls to 0, the unit is destroyed.`,
            `As unidades têm um máximo de 100 HP (contados de 0 a 10 arredondando-se para cima). Se o HP de uma unidade for inferior a 10, esse número será exibido abaixo da unidade. Se o HP chegar a 0, a unidade será destruída.`,
        ],
        [LangTextType.A0324]: [
            `您和您的对手以回合的形式来移动部队。当您的部队完成行动后，可以在菜单中选择结束回合。`,
            `You and your enemy will turns moving your own units. You end your turn by selecting the option "End Turn" from the menu.`,
            `Você e seu adversário se revezam para mover suas próprias unidades. Você encerra seu turno selecionando a opção "Encerrar Turno" no menu.`,
        ],
        [LangTextType.A0325]: [
            `要发起一次近战攻击，请移动您的部队到敌方部队的相邻格子中，并选择攻击。`,
            `To perform a direct attack, have your unit move next to an enemy unit and choose "Attack".`,
            `Para realizar um ataque direto, mova uma unidade sua para o lado de uma unidade inimiga e escolha "Atacar".`,
        ],
        [LangTextType.A0326]: [
            `每当您击败一个敌人部队，您的部队会升级一次，同时提升其攻防属性。每个部队最多可以升级三次。`,
            `When you defeat an enemy unit, the unit that defeated it will have its veterancy level increase. This can yield additional attack and defense bonuses. Any given unit can rise up to 3 veterancy levels.`,
            `Ao derrotar uma unidade inimiga, a unidade que a derrotou tem seu nível de veterania aumentar. Isso pode levar a bonus de ataque e defesa adicionais. Qualquer unidade pode subir até três níveis de veterania.`,
        ],
        [LangTextType.A0327]: [
            `您可以点击画面左下方的地形小窗来打开该地形的详细属性面板。`,
            `You can view a terrain's detailed info by touching an info box found at the bottom left corner.`,
            `Você pode ver as informações detalhadas sobre um terreno tocando uma caixa de informações localizada no canto inferior esquerdo.`,
        ],
        [LangTextType.A0328]: [
            `您可以点击画面左下方的部队小窗来打开该部队的详细属性面板。`,
            `You can view an units's detailed info by touching an info box found at the bottom left corner.`,
            `Você pode ver as informações detalhadas sobre um terreno tocando uma caixa de informações localizada no canto inferior esquerdo.`,
        ],
        [LangTextType.A0329]: [
            `大多数部队都有主武器，主武器的弹药数量是有限的。弹药耗尽时，将无法以主武器进行攻击。`,
            `Most units have main weapons that can run out of ammo. Keep an eye on the ammo indicator.`,
            `A maioria das unidades possui armas principais que podem ficar sem munição. Fique de olho no indicador de munição.`,
        ],
        [LangTextType.A0330]: [
            `所有部队都有燃料，而且有可能会耗尽。部队可以在友方特定的建筑上获得燃料和弹药补给。`,
            `It is possible for a unit to run out of fuel. Units can refuel at any friendly city or bases.`,
            `É possível que uma unidade fique sem combustível. As unidades podem reabastecer em qualquer cidade ou base amiga.`,
        ],
        [LangTextType.A0331]: [
            `远程部队可以在远处对敌方发起攻击，且不受反击。但大多数远程部队无法在同一回合同时移动和攻击。`,
            `Indirect-attack units can fire over long distances without facing a counter-attack, but most of them cannot move and attack in the same turn.`,
            `Unidades de ataque indireto podem disparar a longas distâncias sem sofrer contra-ataques, mas em sua maioria estas não podem se mover e atacar no mesmo turno.`,
        ],
        [LangTextType.A0332]: [
            `您可以点击一个部队来查看它的攻击/移动/视野范围。`,
            `To see a waited unit's attack range, simply touch it. You can also view enemy attack ranges.`,
            `Para ver o alcance de ataque de uma unidade, basta tocá-la. Você também pode ver os alcances de ataque inimigos.`,
        ],
        [LangTextType.A0333]: [
            `您可以通过地形小窗和详细信息面板来查看地形给部队提供的防御力加成。`,
            `Use terrain info to see features and defenses offered by different terrain.`,
            `Use as informações sobre o terreno para ver características e defesas oferecidas por diferentes terrenos.`,
        ],
        [LangTextType.A0334]: [
            `您可以在菜单中点击部队列表按钮来查看对战各方的部队表。这可能有助于您制定战略战术。`,
            `Select "Units" from the menu to display a list constaining all of yours and your enemys' units. Use this chart to help plan your strategy.`,
            `Selecione "Unidades" no menu para exibir todas as unidades suas e de seus inimigos. Use este gráfico para ajudar a planejar sua estratégia.`,
        ],
        [LangTextType.A0335]: [
            `您可以在菜单中点击作战目标按钮来查看当前战局的胜负条件。不同战局的胜负条件有可能不同。`,
            `Select Terms from the menu to view victory conditions. These conditions vary by map.`,
            `Selecione "Termos" no menu para ver as condições de vitória. Essas condições variam de acordo com o mapa.`,
        ],
        [LangTextType.A0336]: [
            `您可以对两个负伤的同类型部队进行合流操作，从而获得一个HP更多的部队。如果两个部队等级不同，则较高的等级会被保留。`,
            `By combining an unit with a damaged unit of the same type, you can create a single unit of that type with their combined HP (maxed at 10 HP). if 2 units with different veterancy levels join, the highest level will be kept.`,
            `Ao combinar uma unidade com outra danificada do mesmo tipo, você pode criar uma única unidade com o HP combinado destas (com no máximo 10 HP). Se duas unidades com níveis diferentes de veterania se unirem, o nível mais alto será mantido.`,
        ],
        [LangTextType.A0337]: [
            `战争迷雾会阻止您看到远方的敌人部队。某些地形可以隐蔽部队，您必须从其邻近的格子来看清这些地形。`,
            `Thick, black dust makes it impossible to see enemies from a distance. Units hiding in woods or rubble can only be seen from an adjacent tile.`,
            `A densa poeira negra torna impossível ver inimigos à distância. Unidades escondidas em bosques ou destroços só podem ser vistas por unidades posicionadas adjacence a estas.`,
        ],
        [LangTextType.A0338]: [
            `高山可以给步兵和反坦克兵提供额外3格视野范围。`,
            `By placing infantries or mechs on mountains, their field of vision is increased by 3 units.`,
            `Ao posicionar infantaria ou mechs em montanhas, o campo de visão destes é aumentado em 3 unidades.`,
        ],
        [LangTextType.A0339]: [
            `在雾战中，如果您的部队在行动中撞上了隐藏的地方部队，则该部队的行动会被强行打断。`,
            `When there's Fog of War, units ambushed by trying to move into a hideout occupied by an enemy unit won't be able to act until their next turn.`,
            `Havendo Névoa da Guerra, unidades serão emboscadas ao tentarem mover-se por um esconderijo ocupado por uma unidade inimiga, e não poderão agir até seu próximo turno.`,
        ],
        [LangTextType.A0340]: [
            `照明车在雾战中特别有用。它们的照明弹可以暂时清除远处的迷雾。`,
            `Flares are suited for Fog of War conditions. Their rockets clear the fog around wherever they're fired.`,
            `Sinalizadores são adequados para condições de Guerra na Névoa. Seus foguetes dissipam a névoa no entorno de onde foram lançados.`,
        ],
        [LangTextType.A0341]: [
            `步兵、反坦克兵、摩托兵可以占领建筑。每次执行占领操作，则建筑的占领点数会减去该部队当前的HP值，减到0即可完成占领。如果部队中途离开，则必须重新开始占领。`,
            `Infantry, mechs, and bikes can capture properties by subtracting capture points from it at an amount equal to their current HP. The property is captured when it reaches 0 capture points. However, if these units leave the property they're capturing, its capture points are fully restored.`,
            `Infantaria, mechs e motos podem capturar edifícios ao subtrair destas pontos de captura em uma quantia equivalente ao seu atual HP. A propriedade é capturada quando chega a 0 pontos de captura. Etretanto, se tais unidades deixarem a propriedade que estão capturando, os pontos de captura desta são completamente recuperados.`,
        ],
        [LangTextType.A0342]: [
            `您所占有的建筑数量越多，则资金收入也越多。资金可以用于生产和维修部队。`,
            `Your earnings are increased by capturing most types of properties. The funds you've accumulated can be spent reparing or building units.`,
            `Seus ganhos aumentam quando você captura a maioria dos tipos de propriedade. Os ganhos que você acumulou consertar ou construir novas unidades.`,
        ],
        [LangTextType.A0343]: [
            `您可以在工厂中生产陆军，在机场中生产空军，在港口中生产海军。`,
            `You can spend your funds to build new land, naval, and air units at factories, ports, and airports; respectively.`,
            `Você pode usar fundos para construir novas unidades terrestres, navais e aéreas em fábricas, portos e aeroportos; respectivamente.`,
        ],
        [LangTextType.A0344]: [
            `您可以选中您的多余的部队，并在菜单中点击删除部队按钮，从而将该部队删除。`,
            `You can delete an unit by selecting it and then the "Delete Unit" option in the menu.`,
            `Você pode excluir uma unidade selecionando-a e depois a opção "Excluir Unidade" no menu.`,
        ],
        [LangTextType.A0345]: [
            `在友方指定建筑上停留的部队可以自动补充弹药、燃料，以及恢复HP（每回合2HP）。恢复HP需要消耗资金。`,
            `Some properties, when under your ownership, can restore ammo, fuel, and 2HP of units you place in them. Restoring HP, though, consumes a proportional amout of that units value from your funds.`,
            `Alguns edifícios, quando sob seu controle, podem restaurar munição, combustível e 2HP de unidades que você colocar nelas. Restaurar HP, entretanto, consome uma quantia de recursos proporcional ao valor daquela unidade.`,
        ],
        [LangTextType.A0346]: [
            `在雾战中，友方建筑可以提供视野。占领建筑总是多多益善。`,
            `During Fog of War, captured properties have a field of vision around them. The more properties you have, the greater is the area of the map that you can see.`,
            `Havendo Névoa da Guerra, edifícios capturados possuem um campo de visão me seu entorno. Quanto mais propriedades você tem, maior é a área do mapa que você pode ver.`,
        ],
        [LangTextType.A0347]: [
            `您可以把部队装载到运输部队中。不同类型的运输部队可以装载的部队的类型和数量也不同。`,
            `You can load units onto transport vehicles. Some carry a single infantry or mech unit, but others transport 2 units of any type.`,
            `Você pode embarcar unidades em veículos de transporte. Alguns transportam apenas uma unidade de infantaria ou mechs, enquanto outras transportam 2 unidades de qualquer tipo.`,
        ],
        [LangTextType.A0348]: [
            `利用运输部队，可以更快地把部队运输到更远的地方。`,
            `Use transport vehicles to carry slower units over long distances more quickly.`,
            `Use veículos de transporte para levar unidades mais lentas a longas distâncias mais rapidamente.`,
        ],
        [LangTextType.A0349]: [
            `运输直升机、工程车、炮艇、登陆舰、巡洋舰、航母都可以用来运输部队。这些部队被摧毁时，装载于其上的部队也会自动被摧毁。`,
            `T copters, rigs, gunboats, landers, cruisers, and carriers can transport other units. If a transport unit is destroyed, the unit it was carrying is also lost.`,
            `Helicópteros T, VBPTs, canhoneiras, balsas, cruzadores e porta-aviões podem transportar outras unidades. Se um veículo de transporte for destruído, a unidade transportada também o será.`,
        ],
        [LangTextType.A0350]: [
            `工程车可以给邻近部队提供弹药和燃料的补给，可以运输部队，可以建造临时机场和临时港口。`,
            `Rigs can resupply adjacent units, transport troops, and build a single temporary port or airport.`,
            `VBPTs podem abastecer unidades adjacentes, transportar tropas, e construir um único porto ou aeroporto temporário.`,
        ],
        [LangTextType.A0351]: [
            `工程车可以在平原上建造临时机场，也可以在沙滩上建造临时海港。与占领建筑类似，需要把建造点数降到0才能完成建造。`,
            `Rigs can build temporary airports on plains and temporary ports on beaches. As with capturing, construction requires 20 points.`,
            `VBPTs podem construir aeroportos temporários em planícies e portos temporários em praias. Assim como na captura, a construção requer 20 pontos.`,
        ],
        [LangTextType.A0352]: [
            `工程车最多可以同时补给邻近的4个部队，但无法恢复HP。`,
            `Rigs can resupply ammo and fuel to a maximum of 4 neighboring units at a time. However, they can't restore HP.`,
            `VBPTs podem fornecer munição e combustível para um máximo de 4 unidades adjacentes de uma vez. No entanto, eles não podem restaurar HP.`,
        ],
        [LangTextType.A0353]: [
            `一些部队可以建造临时建筑，还有一些部队可以生产新的部队。`,
            `Rigs can use construction material to build temporary bases on beaches and plains. While Carriers can even use them to build seaplanes!`,
            `VBPts podem usar material de construção para construir bases temporárias em praias e planícies. Enquanto Porta-Aviões podem usá-lo para construir hidroaviões!`,
        ],
        [LangTextType.A0354]: [
            `潜艇可以执行下潜操作。下潜后，潜艇只会被临近的地方部队发现，且只会受到敌方潜艇和巡洋舰的攻击，但会消耗大量燃料。`,
            `Only subs can dive. Diving conceals subs from the enemy but consumes a lot of fuel. Subs can be hit by other subs and cruisers while submerged.`,
            `Apenas submarinos podem mergulhar. Mergulhar esconde os submarinos do inimigo, mas consome muito combustível. Submarinos podem ser atingidos por outros submarinos e cruzadores enquanto submersos.`,
        ],
        [LangTextType.A0355]: [
            `航母可以消耗15000资金来生产舰载机。从生产后的第二回合开始，舰载机可以直接从航母中弹射出来。`,
            `Carriers can build seaplanes at a cost of 15000 G, and launch them at the following turn.`,
            `Porta-aviões podem construir hidroaviões a um custo de 15000 G, e lança-los no turno seguinte.`,
        ],
        [LangTextType.A0356]: [
            `雨天会强制进入雾战，且建筑的视野降为0，部队的视野降为1。`,
            `Visibility decreases under heavy rain, leading to harsh Fog of War conditions: units vision range is 1, while visibility near bases is zero.`,
            `A visibilidade diminui em chuvas intensas, levando a condições severas de Névoa da Guerra: o alcance do campo de visão das unidades 1, enquanto a visibilidade perto das bases é zero.`,
        ],
        [LangTextType.A0357]: [
            `雪天时，所有部队的移动力减1。`,
            `During a snowfall, the mobility of all units will drop by 1.`,
            `Durante uma nevasca, a mobilidade de todas as unidades diminuirá em 1.`,
        ],
        [LangTextType.A0358]: [
            `沙尘暴时，所有部队的攻击力减30%。`,
            `Sandstorms reduce the attack power of all units by 30%.`,
            `Tempestades de areia reduzem o poder de ataque de todas as unidades em 30%.`,
        ],
        [LangTextType.A0359]: [
            `CO Zone是指CO部队附近的范围。在这个范围内，部队的攻防获得加成，具体数值由CO决定。`,
            `The area surrounding a CO's unit is referred as a CO Zone. In this area units under that CO control can have their attack and defense capabilities be boosted.`,
            `A área ao redor da unidade do Comandante é conhecida como Zona do Comandante. Nesta área unidades sob o controle daquele Comandante estão sujeitos a terem suas capacidades de ataque e defesa aumentadas.`,
        ],
        [LangTextType.A0360]: [
            `我方部队在CO Zone里对敌方部队造成伤害时，CO能量会自动增长。随着能量增长，CO Zone的范围也会变大。`,
            `Damaging enemies from within the CO Zone accumulates "energy", seen in the CO power level. The CO Zone might expand as energy accumulates.`,
            `Causar dano a inimigos de dentro da Zona do Comandante acumula "energia", que pode ser vista na leitura de energia do Comandante. A Zona do Comandante pode expandir-se conforme energia se acumula.`,
        ],
        [LangTextType.A0361]: [
            `当CO能量达到指定值时，您可以消耗能量来激活CO主动技。`,
            `With enough energy one can use a CO Power. After using the CO Power, however, an amount of energy dissipates.`,
            `Com energia suficiente é possivel utilizar um Poder do Comandante. Após utilizá-lo, entretanto, uma quantia de energia é dissipada.`,
        ],
        [LangTextType.A0362]: [
            `您可以在总部以及生产型建筑上，通过消耗一定资金来把CO装载到部队中。该部队会直接升到三级。`,
            `You can board your CO in an unit at the HQ or at production buildings, and spending an required amount of funds. That unit will be promoted to maximum veterancy.`,
            `Você pode embarcar seu CO em unidades no QG ou em bases de produção gastando uma determinada quantia dos seus fundos. A unidade será promovida para máxima veterania.`,
        ],
        [LangTextType.A0363]: [
            `如果您的CO部队被摧毁，则已积累的能量值会消失。您可以在下回合重新装载CO。`,
            `If your CO unit was destroyed, the energy it accumulated is lost. Notwithstanding, you can load your CO into another unit on your next turn.`,
            `Se a unidade do seu Comandante for destruída, a energia acumulada por este é perdida. Não obstante, você poderá embarcá-lo noutra unidade no seu próximo turno.`,
        ],
        [LangTextType.A0364]: [
            `在单人游戏中，您可以自由地使用存档和读档功能。但在多人游戏中，您的每一步都讲自动存档，无法悔棋。`,
            `In single-player games, you can freely use the save and reload matches. However, in multiplayer games every move is automatically saved, and can't be undone.`,
            `Em jogos para um jogador, você pode usar livremente as funções de salvar e carregar partidas. No entanto, em jogos multijogador cada movimento é salvo automaticamente, e não pode ser desfeito.`,
        ],
        [LangTextType.A0365]: [
            `在单人游戏中，您可以在菜单中选择离开战局。此时的战局数据不会被保存。`,
            `In single-player games, you can choose to leave a match at any point from the menu. Doing so will not save your progresskk.`,
            `Em jogos para um jogador, você pode escolher sair da batalha no menu. Seu progresso não será salvo.`,
        ],
        [LangTextType.A0366]: [
            `您可以点击菜单中的状态按钮来查看当前对战各方的部队数、建筑数等各种数据。`,
            `You can click on the "War Info" button to view a chart with various data such as the number of units and buildings for each side in the current battle.`,
            `Você pode clicar no botão "Info. da Partida" para visualizar uma tabela com vários dados, como o número de unidades e propriedades de cada lado na batalha atual.`,
        ],
        [LangTextType.A0367]: [
            "该账号已被注册，请修改后再试",
            "That username was already registered. Please choose another one.",
            "Este nome de usuário já foi registrado. Por favor, escolha outro.",
        ],
        [LangTextType.A0368]: [
            "该昵称已被使用，请修改后再试",
            "That display name is already in use. Please choose another one.",
            "Este nome de exibição já está em uso. Por favor, escolha outro.",
        ],

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Short strings.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        [LangTextType.B0000]: [
            "创建房间",
            "Create Room",
            "Criar sala",
        ],
        [LangTextType.B0001]: [
            `无`,
            `None`,
            `Nenhum`,
        ],
        [LangTextType.B0002]: [
            "基本设置",
            "Basic Settings",
            "Configurações básicas",
        ],
        [LangTextType.B0003]: [
            "高级设置",
            "Advanced Settings",
            "Configurações Avançadas",
        ],
        [LangTextType.B0004]: [
            "红",
            "Red",
            "Vermelho",
        ],
        [LangTextType.B0005]: [
            "蓝",
            "Blue",
            "Azul",
        ],
        [LangTextType.B0006]: [
            "黄",
            "Yellow",
            "Amarelo",
        ],
        [LangTextType.B0007]: [
            "绿",
            "Green",
            "Verde",
        ],
        [LangTextType.B0008]: [
            "A队",
            "Team A",
            "Time A",
        ],
        [LangTextType.B0009]: [
            "B队",
            "Team B",
            "Time B",
        ],
        [LangTextType.B0010]: [
            "C队",
            "Team C",
            "Time C",
        ],
        [LangTextType.B0011]: [
            "D队",
            "Team D",
            "Time D",
        ],
        [LangTextType.B0012]: [
            `是`,
            `Yes`,
            `Sim`,
        ],
        [LangTextType.B0013]: [
            "否",
            "No",
            "Não",
        ],
        [LangTextType.B0014]: [
            "天",
            "d",
            "d",
        ],
        [LangTextType.B0015]: [
            "时",
            "h",
            "h",
        ],
        [LangTextType.B0016]: [
            "分",
            "m",
            "m",
        ],
        [LangTextType.B0017]: [
            "秒",
            "s",
            "s",
        ],
        [LangTextType.B0018]: [
            "行动次序",
            "Army",
            "Exército",
        ],
        [LangTextType.B0019]: [
            "队伍",
            "Team",
            "Time",
        ],
        [LangTextType.B0020]: [
            "战争迷雾",
            "FoW",
            "NdG",
        ],
        [LangTextType.B0021]: [
            "回合限时",
            "Time Limit",
            "Limite de Tempo",
        ],
        [LangTextType.B0022]: [
            "退出房间",
            "Exit Game",
            "Sair do Jogo",
        ],
        [LangTextType.B0023]: [
            "加入房间",
            "Join Room"
            "Participar",
        ],
        [LangTextType.B0024]: [
            "继续战斗",
            "Continue",
            "Continuar",
        ],
        [LangTextType.B0025]: [
            `连接已断开`,
            `Disconnected`,
            `Disconectado`,
        ],
        [LangTextType.B0026]: [
            `确定`,
            `Confirm`,
            `Confirmar`,
        ],
        [LangTextType.B0027]: [
            `倒计时`,
            `Countdown`,
            `Contagem regressiva`,
        ],
        [LangTextType.B0028]: [
            `即将超时`,
            `Timeout soon`,
            `O tempo limite está próximo`,
        ],
        [LangTextType.B0029]: [
            `读取中`,
            `Now loading`,
            `Carregando`,
        ],
        [LangTextType.B0030]: [
            `中立`,
            `Neutral`,
            `Neutro`,
        ],
        [LangTextType.B0031]: [
            `玩家`,
            `Player`,
            `Jogador`,
        ],
        [LangTextType.B0032]: [
            `资金`,
            `Fund`,
            `Reserva`,
        ],
        [LangTextType.B0033]: [
            `能量`,
            `Energy`,
            `Energia`,
        ],
        [LangTextType.B0034]: [
            `胜利`,
            `Win`,
            `Vitória`,
        ],
        [LangTextType.B0035]: [
            `失败`,
            `Defeat`,
            `Derrota`,
        ],
        [LangTextType.B0036]: [
            `结束回合`,
            `End Turn`,
            `Encerrar turno`,
        ],
        [LangTextType.B0037]: [
            `装载`,
            `Load`,
            `Carregar`,
        ],
        [LangTextType.B0038]: [
            `合流`,
            `Join`,
            `Participar`,
        ],
        [LangTextType.B0039]: [
            `攻击`,
            `Attack`,
            `Atacar`,
        ],
        [LangTextType.B0040]: [
            `占领`,
            `Capture`,
            `Capturar`,
        ],
        [LangTextType.B0041]: [
            `下潜`,
            `Dive`,
            `Mergulhar`,
        ],
        [LangTextType.B0042]: [
            `上浮`,
            `Surface`,
            `Emergir`,
        ],
        [LangTextType.B0043]: [
            `建造`,
            `Build`,
            `Construir`,
        ],
        [LangTextType.B0044]: [
            `补给`,
            `Supply`,
            `Abastecer`,
        ],
        [LangTextType.B0045]: [
            `发射`,
            `Launch`,
            `Lançar`,
        ],
        [LangTextType.B0046]: [
            `卸载`,
            `Drop`,
            `Descarregar`,
        ],
        [LangTextType.B0047]: [
            `照明`,
            `Flare`,
            `Iluminar`,
        ],
        [LangTextType.B0048]: [
            `发射导弹`,
            `Silo`,
            `Silo`,
        ],
        [LangTextType.B0049]: [
            `制造`,
            `Produce`,
            `Produzir`,
        ],
        [LangTextType.B0050]: [
            `待机`,
            `Wait`,
            `Aguardar`,
        ],
        [LangTextType.B0051]: [
            `生产材料已耗尽`,
            `No material`,
            `Sem materiais`,
        ],
        [LangTextType.B0052]: [
            `没有空闲的装载位置`,
            `No empty load slot`,
            `Sem espaço para salvar`,
        ],
        [LangTextType.B0053]: [
            `资金不足`,
            `Insufficient fund`,
            `Dinheiro insuficiente`,
        ],
        [LangTextType.B0054]: [
            `返回大厅`,
            `Go to Lobby`,
            `Ir ao Lobby`,
        ],
        [LangTextType.B0055]: [
            `投降`,
            `Resign`,
            `Desistir`,
        ],
        [LangTextType.B0056]: [
            `已战败`,
            `Defeat`,
            `Derrota`,
        ],
        [LangTextType.B0057]: [
            `日`,
            `Day`,
            `Dia`,
        ],
        [LangTextType.B0058]: [
            `月`,
            `Month`,
            `Mês`,
        ],
        [LangTextType.B0059]: [
            `年`,
            `Year`,
            `Ano`,
        ],
        [LangTextType.B0060]: [
            `排位积分`,
            `RankScore`,
            `Classificação`,
        ],
        [LangTextType.B0061]: [
            `列兵`,
            `Lv.0`,
            `Nv.0`,
        ],
        [LangTextType.B0062]: [
            `上等兵`,
            `Lv.1`,
            `Nv.1`,
        ],
        [LangTextType.B0063]: [
            `下士`,
            `Lv.2`,
            `Nv.2`,
        ],
        [LangTextType.B0064]: [
            `中士`,
            `Lv.3`,
            `Nv.3`,
        ],
        [LangTextType.B0065]: [
            `上士`,
            `Lv.4`,
            `Nv.4`,
        ],
        [LangTextType.B0066]: [
            `军士长`,
            `Lv.5`,
            `Nv.5`,
        ],
        [LangTextType.B0067]: [
            `少尉`,
            `Lv.6`,
            `Nv.6`,
        ],
        [LangTextType.B0068]: [
            `中尉`,
            `Lv.7`,
            `Nv.7`,
        ],
        [LangTextType.B0069]: [
            `上尉`,
            `Lv.8`,
            `Nv.8`,
        ],
        [LangTextType.B0070]: [
            `少校`,
            `Lv.9`,
            `Nv.9`,
        ],
        [LangTextType.B0071]: [
            `中校`,
            `Lv.10`,
            `Nv.10`,
        ],
        [LangTextType.B0072]: [
            `上校`,
            `Lv.11`,
            `Nv.11`,
        ],
        [LangTextType.B0073]: [
            `大校`,
            `Lv.12`,
            `Nv.12`,
        ],
        [LangTextType.B0074]: [
            `少将`,
            `Lv.13`,
            `Nv.13`,
        ],
        [LangTextType.B0075]: [
            `中将`,
            `Lv.14`,
            `Nv.14`,
        ],
        [LangTextType.B0076]: [
            `上将`,
            `Lv.15`,
            `Nv.15`,
        ],
        [LangTextType.B0077]: [
            `攻`,
            `Deal`,
            `Causar`,
        ],
        [LangTextType.B0078]: [
            `反`,
            `Take`,
            `Tomar`,
        ],
        [LangTextType.B0079]: [
            `费用`,
            `Cost`,
            `Custo`,
        ],
        [LangTextType.B0080]: [
            `高级`,
            `Advanced`,
            `Avançado`,
        ],
        [LangTextType.B0081]: [
            `删除部队`,
            `Delete Unit`,
            `Deletar Unidade`,
        ],
        [LangTextType.B0082]: [
            `和局`,
            `Drawn game`,
            `Jogo empatado`,
        ],
        [LangTextType.B0083]: [
            `求和`,
            `Request draw`,
            `Solicitar empate`,
        ],
        [LangTextType.B0084]: [
            `同意和局`,
            `Accept`,
            `Conceder`,
        ],
        [LangTextType.B0085]: [
            `拒绝和局`,
            `Decline`,
            `Recusar`,
        ],
        [LangTextType.B0086]: [
            `回合中`,
            `In Turn`,
            `Em turno`,
        ],
        [LangTextType.B0087]: [
            `战局已结束`,
            `Game Ended`,
            `Jogo Terminado`,
        ],
        [LangTextType.B0088]: [
            `提示`,
            `Message`,
            `Enviar mensagem`,
            // The verb or the noun? If it is a verb, it follows the current form. Otherwise it would be just "Mensagem",
        ],
        [LangTextType.B0089]: [
            `刷新战局`,
            `Refresh`,
            `Atualizar`,
        ],
        [LangTextType.B0090]: [
            `行动数`,
            `Actions`,
            `Ações`,
        ],
        [LangTextType.B0091]: [
            `回合数`,
            `Turns`,
            `Turnos`,
        ],
        [LangTextType.B0092]: [
            `观看回放`,
            `Replays`,
            `Replays`,
        ],
        [LangTextType.B0093]: [
            `回放已结束`,
            `The replay is completed.`,
            `O replay foi concluído.`,
        ],
        [LangTextType.B0094]: [
            `开始回合`,
            `Begin turn`,
            `Iniciar turno`,
        ],
        [LangTextType.B0095]: [
            `生产`,
            `Produce`,
            `Produzir`,
        ],
        [LangTextType.B0096]: [
            `提议和局`,
            `Propose a draw`,
            `Propor um empate`,
        ],
        [LangTextType.B0097]: [
            `发起攻击`,
            `Launch an attack`,
            `Iniciar um ataque`,
        ],
        [LangTextType.B0098]: [
            `装载部队`,
            `Load a unit`,
            `Embarcar uma unidade`,
        ],
        [LangTextType.B0099]: [
            `建造建筑`,
            `Build a building`,
            `Construir um edifício`,
        ],
        [LangTextType.B0100]: [
            `占领建筑`,
            `Capture a building`,
            `Capturar um edifício`,
        ],
        [LangTextType.B0101]: [
            `部队下潜`,
            `Unit dive`,
            `Mergulhar unidade`,
            // Dive unit?
        ],
        [LangTextType.B0102]: [
            `卸载部队`,
            `Drop units`,
            `Desembarcar unidades`,
        ],
        [LangTextType.B0103]: [
            `部队合流`,
            `Join units`,
            `Juntar unidades`,
        ],
        [LangTextType.B0104]: [
            `发射照明弹`,
            `Launch a flare`,
            `Lançar sinalizador`,
        ],
        [LangTextType.B0105]: [
            `发射导弹`,
            `Launch a silo`,
            `Lançar míssil`,
        ],
        [LangTextType.B0106]: [
            `生产舰载机`,
            `Produce a seaplane`,
            `Produzir hidroplano`,
        ],
        [LangTextType.B0107]: [
            `补给部队`,
            `Supply units`,
            `Abastecer unidades`,
        ],
        [LangTextType.B0108]: [
            `部队上浮`,
            `Unit surface`,
            `Emergir unidade`,
        ],
        [LangTextType.B0109]: [
            `部队移动`,
            `Unit move`,
            `Mover unidade`,
            // Move unit?
        ],
        [LangTextType.B0110]: [
            `发生未知错误`,
            `There was an error`,
            `Houve uma falha`,
        ],
        [LangTextType.B0111]: [
            `中立玩家`,
            `Neutral`,
            `Neutro`,
        ],
        [LangTextType.B0112]: [
            `步兵`,
            `Inf`,
            `Inf`,
        ],
        [LangTextType.B0113]: [
            `反坦克兵`,
            `Mech`,
            `Mech`,
        ],
        [LangTextType.B0114]: [
            `履带`,
            `Tank`,
            `Tank`,
        ],
        [LangTextType.B0115]: [
            `轮胎A`,
            `TireA`,
            `PneuA`,
        ],
        [LangTextType.B0116]: [
            `轮胎B`,
            `TireB`,
            `PneuB`,
        ],
        [LangTextType.B0117]: [
            `飞行`,
            `Air`,
            `Aéreo`,
        ],
        [LangTextType.B0118]: [
            `航行`,
            `Ship`,
            `Navio`,
        ],
        [LangTextType.B0119]: [
            `运输`,
            `Trans`,
            `Trans`,
        ],
        [LangTextType.B0120]: [
            `全部`,
            `All`,
            `Todos`,
        ],
        [LangTextType.B0121]: [
            `陆军`,
            `Ground`,
            `Terrestre`,
        ],
        [LangTextType.B0122]: [
            `海军`,
            `Naval`,
            `Naval`,
        ],
        [LangTextType.B0123]: [
            `空军`,
            `Air`,
            `Aéreo`,
        ],
        [LangTextType.B0124]: [
            `陆军&海军`,
            `Ground & Naval`,
            `Terrestre e Naval`,
        ],
        [LangTextType.B0125]: [
            `陆军&空军`,
            `Ground & Air`,
            `Terrestre e aéreo`,
        ],
        [LangTextType.B0126]: [
            `近战`,
            `Direct`,
            `Direto`,
        ],
        [LangTextType.B0127]: [
            `远程`,
            `Indirect`,
            `Indireto`,
        ],
        [LangTextType.B0128]: [
            `步行`,
            `Foot`,
            `À pé`,
        ],
        [LangTextType.B0129]: [
            `步兵系`,
            `Inf`,
            `Inf`,
        ],
        [LangTextType.B0130]: [
            `车辆系`,
            `Vehicle`,
            `Veículo`,
        ],
        [LangTextType.B0131]: [
            `近战机械`,
            `DirectMachine`,
            `MáquinaDireta`,
            // What's this?
        ],
        [LangTextType.B0132]: [
            `运输系`,
            `Transport`,
            `Transporte`,
        ],
        [LangTextType.B0133]: [
            `大型船只`,
            `LargeNaval`,
            `NavalGrande`,
        ],
        [LangTextType.B0134]: [
            `直升机`,
            `Copter`,
            `Helicóptero`,
        ],
        [LangTextType.B0135]: [
            `坦克`,
            `Tank`,
            `Tanque`,
        ],
        [LangTextType.B0136]: [
            `空军除舰载机`,
            `AirExceptSeaplane`,
            `AéreoSenãoHidroplano`,
        ],
        [LangTextType.B0137]: [
            `多人对战`,
            `Multi Player`,
            `Multi jogador`,
        ],
        [LangTextType.B0138]: [
            `单人模式`,
            `Single Player`,
            `Único jogador`,
        ],
        [LangTextType.B0139]: [
            `CO搭乘`,
            `CO Board`,
            `Comandante embarcado`,
            // CO Boarded? Board CO?
        ],
        [LangTextType.B0140]: [
            `CO信息`,
            `CO Info`,
            `Info. do Comandante`,
        ],
        [LangTextType.B0141]: [
            `无限`,
            `Infinity`,
            `Infinito`,
        ],
        [LangTextType.B0142]: [
            `Power`,
            `Power`,
            `Poder`,
        ],
        [LangTextType.B0143]: [
            `帮助`,
            `Help`,
            `Ajuda`,
        ],
        [LangTextType.B0144]: [
            `S-Power`,
            `S-Power`,
            `S-Poder`,
        ],
        [LangTextType.B0145]: [
            `选择CO`,
            `Choose a CO`,
            `Escolha um Comandante`,
        ],
        [LangTextType.B0146]: [
            `返回`,
            `Back`,
            `Voltar`,
        ],
        [LangTextType.B0147]: [
            `CO系统规则`,
            `CO Rules`,
            `Regras para Comandantes`,
        ],
        [LangTextType.B0148]: [
            `切换语言`,
            `Change Language`,
            `Alterar idioma`,
        ],
        [LangTextType.B0149]: [
            `更改昵称`,
            `Change display name`,
            `Alterar nome de exibição`,
        ],
        [LangTextType.B0150]: [
            `更改Discord ID`,
            `Change Discord ID`,
            `Alterar Discord ID`,
        ],
        [LangTextType.B0151]: [
            `查看在线玩家`,
            `Online Players`,
            `Jogadores conectados`,
        ],
        [LangTextType.B0152]: [
            `部队列表`,
            `Units`,
            `Unidades`,
        ],
        [LangTextType.B0153]: [
            `寻找建筑`,
            `Building`,
            `Edifícios`,
        ],
        [LangTextType.B0154]: [
            `取消`,
            `Cancel`,
            `Cancelar`,
        ],
        [LangTextType.B0155]: [
            `菜单`,
            `Menu`,
            `Menu`,
        ],
        [LangTextType.B0156]: [
            `资金`,
            `Fund`,
            `Recursos`,
        ],
        [LangTextType.B0157]: [
            `收入`,
            `Income`,
            `Rendimentos`,
        ],
        [LangTextType.B0158]: [
            `建筑数`,
            `Buildings`,
            `Edifícios`,
        ],
        [LangTextType.B0159]: [
            `能量`,
            `Energy`,
            `Energia`,
        ],
        [LangTextType.B0160]: [
            `部队数`,
            `Units`,
            `Unidades`,
        ],
        [LangTextType.B0161]: [
            `价值`,
            `Value`,
            `Valor`,
        ],
        [LangTextType.B0162]: [
            `名称`,
            `Name`,
            `Nome`,
        ],
        [LangTextType.B0163]: [
            `设计者`,
            `Designer`,
            `Designer`,
        ],
        [LangTextType.B0164]: [
            `搭载费用`,
            `Boarding Cost`,
            `Custo para embarcar`,
        ],
        [LangTextType.B0165]: [
            `Zone范围`,
            `Zone Radius`,
            `Raio da Zona`,
        ],
        [LangTextType.B0166]: [
            `Zone扩张能量值`,
            `Thresholds for Zone Expansion`,
            `Limiares para Expansão da Zona`,
        ],
        [LangTextType.B0167]: [
            `能量消耗`,
            `Energy Cost`,
            `Custo de Energia`,
        ],
        [LangTextType.B0168]: [
            `势力`,
            `Army`,
            `Exército`,
        ],
        [LangTextType.B0169]: [
            `我的履历`,
            `Profile`,
            `Perfil`,
        ],
        [LangTextType.B0170]: [
            `账号`,
            `Username`,
            `Nome de usuário`,
        ],
        [LangTextType.B0171]: [
            `密码`,
            `Password`,
            `Senha`,
        ],
        [LangTextType.B0172]: [
            `记住密码`,
            `Remember Password`,
            `Lembrar Senha`,
        ],
        [LangTextType.B0173]: [
            `登录`,
            `Login`,
            `Acessar`,
        ],
        [LangTextType.B0174]: [
            `注册`,
            `Register`,
            `REgistrar-se`,
        ],
        [LangTextType.B0175]: [
            `昵称`,
            `Display Name`,
            `Nome de Exibição`,
        ],
        [LangTextType.B0176]: [
            `打开地形动画`,
            `Tile Animation On`,
            `Animações do Terreno Ligadas`,
        ],
        [LangTextType.B0177]: [
            `关闭地形动画`,
            `Tile Animation Off`,
            `Animações do terreno desligadas`,
        ],
        [LangTextType.B0178]: [
            `初始资金`,
            `Initial Fund`,
            `Reservas iniciais`,
        ],
        [LangTextType.B0179]: [
            `收入倍率%`,
            `Income Multiplier (%)`,
            `Multiplicador dos Rendimentos (%)`,
        ],
        [LangTextType.B0180]: [
            `装载CO时获得能量%`,
            `Initial CO Energy (%)`,
            `Energia Inicial do Comandante (%)`,
        ],
        [LangTextType.B0181]: [
            `能量增速%`,
            `Energy Growth Multiplier %`,
            `Multiplicador de Ganho de Energia (%)`,
        ],
        [LangTextType.B0182]: [
            `移动力加成`,
            `Movement Bonus`,
            `Bonus de Movimentação`,
        ],
        [LangTextType.B0183]: [
            `攻击力加成%`,
            `Offense Bonus (%)`,
            `Bonus ofensivo (%)`,
        ],
        [LangTextType.B0184]: [
            `视野加成`,
            `Vision Bonus`,
            `Bonus de Visão`,
        ],
        [LangTextType.B0185]: [
            `房间名称`,
            `Game Name`,
            `Nome da Partida`,
        ],
        [LangTextType.B0186]: [
            `房间密码`,
            `Game Password`,
            `Senha da Partida`,
        ],
        [LangTextType.B0187]: [
            `附言`,
            `Comment`,
            `Comentário`,
        ],
        [LangTextType.B0188]: [
            `回合限时`,
            `Boot Timer`,
            `Cronômetro inicial`,
        ],
        [LangTextType.B0189]: [
            `幸运下限%`,
            `Min Luck (%)`,
            `Sorte Mín (%)`,
        ],
        [LangTextType.B0190]: [
            `幸运上限%`,
            `Max Luck (%)`,
            `Sorte Máx (%)`,
        ],
        [LangTextType.B0191]: [
            `回合`,
            `Turn`,
            `Turno`,
        ],
        [LangTextType.B0192]: [
            `管理地图`,
            `Map Management`,
            `Gerenciamento de Mapas`,
            // What is this?
        ],
        [LangTextType.B0193]: [
            `可用性`,
            `Availability`,
            `Disponibilidade`,
        ],
        [LangTextType.B0194]: [
            `注册时间`,
            `Registration`,
            `Registrado em`,
        ],
        [LangTextType.B0195]: [
            `上次登陆时间`,
            `Last Login`,
            `Último Acesso`,
        ],
        [LangTextType.B0196]: [
            `在线总时长`,
            `Online Time`,
            `Tempo conectado`,
        ],
        [LangTextType.B0197]: [
            `登陆次数`,
            `Login Times`,
            `Número de Acessos`,
        ],
        [LangTextType.B0198]: [
            `明战排位积分`,
            `Std Rating`,
            `Classificação Pdr`,
        ],
        [LangTextType.B0199]: [
            `雾战排位积分`,
            `FoW Rating`,
            `Classificação NdG`,
        ],
        [LangTextType.B0200]: [
            `多人自由对战`,
            `MP Custom Games`,
            `MP Jogos Personalizados`,
            // What is this?
        ],
        [LangTextType.B0201]: [
            `历史战绩`,
            `History`,
            `Histórico`,
        ],
        [LangTextType.B0202]: [
            `3人局`,
            `3P`,
            `3J`,
        ],
        [LangTextType.B0203]: [
            `4人局`,
            `4P`,
            `4J`,
        ],
        [LangTextType.B0204]: [
            `关闭`,
            `Close`,
            `Fechar`,
        ],
        [LangTextType.B0205]: [
            `多人游戏`,
            `Multi Player`,
            `Multi Jogador`,
        ],
        [LangTextType.B0206]: [
            `观战`,
            `Spectate Matches`,
            `Acompanhar Partidas`,
        ],
        [LangTextType.B0207]: [
            `发起请求`,
            `Make Requests`,
            `Realizar Pedidos`,
        ],
        [LangTextType.B0208]: [
            `处理请求`,
            `Handle Requests`,
            `Responder Pedidos`,
        ],
        [LangTextType.B0209]: [
            `暂无请求`,
            `No Requests`,
            `Não há Pedidos`,
        ],
        [LangTextType.B0210]: [
            `暂无战局`,
            `No Matches`,
            `Não há partidas`,
        ],
        [LangTextType.B0211]: [
            `无`,
            `No`,
            `Não`,
        ],
        [LangTextType.B0212]: [
            `已请求`,
            `Requested`,
            `Requisitado`,
        ],
        [LangTextType.B0213]: [
            `正在观战`,
            `Watching`,
            `Assistindo`,
        ],
        [LangTextType.B0214]: [
            `同意`,
            `Accept`,
            `Aceitar`,
        ],
        [LangTextType.B0215]: [
            `拒绝`,
            `Decline`,
            `Negar`,
        ],
        [LangTextType.B0216]: [
            `自己`,
            `Self`,
            `Si`,
        ],
        [LangTextType.B0217]: [
            `对手`,
            `Opponent`,
            `Oponente`,
        ],
        [LangTextType.B0218]: [
            `已观战他人`,
            `Watching Others`,
            `Assistindo Outros`,
        ],
        [LangTextType.B0219]: [
            `删除观战者`,
            `Delete Spectators`,
            `Remover Espectadores`,
        ],
        [LangTextType.B0220]: [
            `删除`,
            `Delete`,
            `Deletar`,
        ],
        [LangTextType.B0221]: [
            `保留`,
            `Keep`,
            `Manter`,
        ],
        [LangTextType.B0222]: [
            `继续`,
            `Continue`,
            `Continuar`,
        ],
        [LangTextType.B0223]: [
            `战局信息`,
            `Match Info`,
            `Info. da Partida`,
        ],
        [LangTextType.B0224]: [
            `玩家信息`,
            `Player Info`,
            `Info. dos Jogadores`,
        ],
        [LangTextType.B0225]: [
            `地图名称`,
            `Map Name`,
            `Nome do Mapa`,
        ],
        [LangTextType.B0226]: [
            `战局ID`,
            `Match ID`,
            `ID da Partida`,
        ],
        [LangTextType.B0227]: [
            `选择地图`,
            `Select a Map`,
            `Selecione um Mapa`,
        ],
        [LangTextType.B0228]: [
            `查找`,
            `Search`,
            `Buscar`,
        ],
        [LangTextType.B0229]: [
            `玩家数量`,
            `Players`,
            `Jogadores`,
        ],
        [LangTextType.B0230]: [
            `更换CO`,
            `Change CO`,
            `Alterar Comandante`,
        ],
        [LangTextType.B0231]: [
            `我的回合`,
            `My Turn`,
            `Meu Turno`,
        ],
        [LangTextType.B0232]: [
            `玩家`,
            `Players`,
            `Jogadores`,
        ],
        [LangTextType.B0233]: [
            `全部显示`,
            `Show All`,
            `Exibir Todos`,
        ],
        [LangTextType.B0234]: [
            `查找回放`,
            `Search Replay`,
            `Buscar Replay`,
        ],
        [LangTextType.B0235]: [
            `回放ID`,
            `Replay ID`,
            `ID do Replay`,
        ],
        [LangTextType.B0236]: [
            `在线玩家列表`,
            `Online Players List`,
            `Lista de Jogadores Conectados`,
        ],
        [LangTextType.B0237]: [
            `当前在线人数`,
            `Online Players`,
            `Jogadores Conectados`,
        ],
        [LangTextType.B0238]: [
            `可用CO`,
            `Available COs`,
            `Comandantes Disponíveis`,
        ],
        [LangTextType.B0239]: [
            `最大`,
            `Max.`,
            `Máx.`,
        ],
        [LangTextType.B0240]: [
            `指挥官信息`,
            `CO Info`,
            `Info. dos Comandantes`,
        ],
        [LangTextType.B0241]: [
            `暂无回放`,
            `No Replays`,
            `Sem Replays`,
        ],
        [LangTextType.B0242]: [
            `新昵称`,
            `New Display Name`,
            `Novo Nome de Exibição`,
        ],
        [LangTextType.B0243]: [
            `新ID`,
            `New ID`,
            `Novo ID`,
        ],
        [LangTextType.B0244]: [
            `切换玩家`,
            `Next Player`,
            `Pŕoximo Jogador`,
        ],
        [LangTextType.B0245]: [
            `房间设定总览`,
            `Overview Room Settings`,
            `Verificar Configurações da Sala`,
        ],
        [LangTextType.B0246]: [
            `进入战局`,
            `Enter Game`,
            `Participar da Partida`,
        ],
        [LangTextType.B0247]: [
            `上个回合`,
            `Prev. Turn`,
            `Turno Ant.`,
        ],
        [LangTextType.B0248]: [
            `下个回合`,
            `Next Turn`,
            `Próx. Turno`,
        ],
        [LangTextType.B0249]: [
            `开始`,
            `Start`,
            `Início`,
        ],
        [LangTextType.B0250]: [
            `暂停回放`,
            `Pause Replays`,
            `Pausar Replays`,
        ],
        [LangTextType.B0251]: [
            `作者`,
            `Designer`,
            `Designer`,
        ],
        [LangTextType.B0252]: [
            `游玩次数`,
            `Games Played`,
            `Partidas Concluídas`,
        ],
        [LangTextType.B0253]: [
            `评分`,
            `Rating`,
            `Nota`,
        ],
        [LangTextType.B0254]: [
            `单人明战`,
            `Free Battle`,
            `Batalha Amistosa`,
        ],
        [LangTextType.B0255]: [
            `存档编号`,
            `Save Slot`,
            `Espaço para Salvar`,
        ],
        [LangTextType.B0256]: [
            `电脑`,
            `COM`,
            `COM`,
            // What's this?
        ],
        [LangTextType.B0257]: [
            `挑战模式明战`,
            `War Room Std`,
            `Desafios Pdr`,
        ],
        [LangTextType.B0258]: [
            `选择`,
            `Select`,
            `Selecionar`,
        ],
        [LangTextType.B0259]: [
            `选择存档位置`,
            `Select Save Slot`,
            `Selecione onde Salvar`,
        ],
        [LangTextType.B0260]: [
            `存档`,
            `Save Game`,
            `Salvar Partida`,
        ],
        [LangTextType.B0261]: [
            `读档`,
            `Load Game`,
            `Carregar Partida`,
        ],
        [LangTextType.B0262]: [
            `重载所有地图`,
            `Reload Maps`,
            `Recarregar Mapas`,
        ],
        [LangTextType.B0267]: [
            `详细信息`,
            `Detailed Info`,
            `Info. Detalhada`,
        ],
        [LangTextType.B0268]: [
            `合并地图`,
            `Merge Maps`,
            `Combinar Mapas`,
        ],
        [LangTextType.B0269]: [
            `无可合并的地图`,
            `No Maps`,
            `Sem Mapas`,
        ],
        [LangTextType.B0270]: [
            `删除地图`,
            `Delete Map`,
            `Deletar Mapa`,
        ],
        [LangTextType.B0271]: [
            `地图编辑器`,
            `Map Editor`,
            `Editor de Mapas`,
        ],
        [LangTextType.B0272]: [
            `地图列表`,
            `Map List`,
            `Lista de Mapas`,
        ],
        [LangTextType.B0273]: [
            `未提审`,
            `Not Reviewed`,
            `Não Avaliado`,
        ],
        [LangTextType.B0274]: [
            `审核中`,
            `Reviewing`,
            `Avaliando`,
        ],
        [LangTextType.B0275]: [
            `被拒审`,
            `Rejected`,
            `Rejeitado`,
        ],
        [LangTextType.B0276]: [
            `已过审`,
            `Accepted`,
            `Aceito`,
        ],
        [LangTextType.B0277]: [
            `未命名`,
            `Unnamed`,
            `Sem nome`,
        ],
        [LangTextType.B0278]: [
            `无数据`,
            `No Data`,
            `Vazio`,
        ],
        [LangTextType.B0279]: [
            `新地图`,
            `New Map`,
            `Novo Mapa`,
        ],
        [LangTextType.B0280]: [
            `模式`,
            `Mode`,
            `Modo`,
        ],
        [LangTextType.B0281]: [
            `绘制部队`,
            `Place Unit`,
            `Colocar Unidade`,
        ],
        [LangTextType.B0282]: [
            `绘制地形基底`,
            `Place Tile Base`,
            `Colocar Terreno Base`,
        ],
        [LangTextType.B0283]: [
            `绘制地形物体`,
            `Place Object`,
            `Colocar Objeto`,
        ],
        [LangTextType.B0284]: [
            `删除部队`,
            `Del Unit`,
            `Del Unidade`,
        ],
        [LangTextType.B0285]: [
            `删除地形物体`,
            `Del Object`,
            `Del Objeto`,
        ],
        [LangTextType.B0286]: [
            `预览`,
            `Preview`,
            `Visualizar`,
        ],
        [LangTextType.B0287]: [
            `保存地图`,
            `Save Map`,
            `Salvar mapa`,
        ],
        [LangTextType.B0288]: [
            `读取地图`,
            `Load Map`,
            `Carregar Mapa`,
        ],
        [LangTextType.B0289]: [
            `提审`,
            `Submit for review`,
            `Enviar para avaliação`,
        ],
        [LangTextType.B0290]: [
            `调整大小`,
            `Resize`,
            `Redimencionar`,
        ],
        [LangTextType.B0291]: [
            `当前宽高`,
            `Current W/H`,
            `A/L Atuais`,
        ],
        [LangTextType.B0292]: [
            `新的宽高`,
            `New W/H`,
            `A/L Novas`,
        ],
        [LangTextType.B0293]: [
            `地图偏移`,
            `Map Offset`,
            `Deslocar Mapa`,
        ],
        [LangTextType.B0294]: [
            `全图填充`,
            `Fill Map`,
            `Preencher Mapa`,
        ],
        [LangTextType.B0295]: [
            `审核地图`,
            `Review Maps`,
            `Avaliar Mapas`,
        ],
        [LangTextType.B0296]: [
            `过审`,
            `Accept`,
            `Aceitar`,
        ],
        [LangTextType.B0297]: [
            `拒审`,
            `Reject`,
            `Rejeitar`,
        ],
        [LangTextType.B0298]: [
            `地图信息`,
            `Map Info`,
            `Info. do Mapa`,
        ],
        [LangTextType.B0299]: [
            `地图英文名称`,
            `Map English Name`,
            `Nome em Inglês do Mapa`,
        ],
        [LangTextType.B0300]: [
            `地图尺寸`,
            `Map Size`,
            `Tamanho do Mapa`,
        ],
        [LangTextType.B0301]: [
            `可见性`,
            `Visibility`,
            `Visibilidade`,
        ],
        [LangTextType.B0302]: [
            `地形基底`,
            `Tile Base`,
            `Terreno Base`,
        ],
        [LangTextType.B0303]: [
            `地形物体`,
            `Object`,
            `Objeto`,
        ],
        [LangTextType.B0304]: [
            `部队`,
            `Units`,
            `Unidades`,
        ],
        [LangTextType.B0305]: [
            `拒审理由`,
            `Reason for Rejection`,
            `Razão para Rejeição`,
        ],
        [LangTextType.B0306]: [
            `对称性`,
            `Symmetry`,
            `Simetria`,
        ],
        [LangTextType.B0307]: [
            `自动绘制地形`,
            `Auto Draw Tile`,
            `Ajustar Terreno Auto.`,
        ],
        [LangTextType.B0308]: [
            `上下对称`,
            `U to D`,
            `C a B`,
        ],
        [LangTextType.B0309]: [
            `左右对称`,
            `L to R`,
            `E a D`,
        ],
        [LangTextType.B0310]: [
            `旋转对称`,
            `Rotational`,
            `Rotacional`,
        ],
        [LangTextType.B0311]: [
            `左上右下对称`,
            `UL to DR`,
            `CE a BD`,
        ],
        [LangTextType.B0312]: [
            `右上左下对称`,
            `UR to DL`,
            `CD a BE`,
        ],
        [LangTextType.B0313]: [
            `导入`,
            `Import`,
            `Importar`,
        ],
        [LangTextType.B0314]: [
            `预设规则`,
            `Preset Rules`,
            `Regras Padrão`,
        ],
        [LangTextType.B0315]: [
            `规则名称`,
            `Rule Name`,
            `Nome da Regra`,
        ],
        [LangTextType.B0316]: [
            `规则英文名`,
            `Rule English Name`,
            `Nome da Regra (Inglês)`,
        ],
        [LangTextType.B0317]: [
            `修改`,
            `Modify`,
            `Modificar`,
        ],
        [LangTextType.B0318]: [
            `规则`,
            `Rule`,
            `Regra`,
        ],
        [LangTextType.B0319]: [
            `值域`,
            `Range`,
            `Alcance`,
        ],
        [LangTextType.B0320]: [
            `新增`,
            `Add`,
            `Adicionar`,
        ],
        [LangTextType.B0321]: [
            `自定义`,
            `Custom`,
            `Personalizado`,
        ],
        [LangTextType.B0322]: [
            `无`,
            `Empty`,
            `Vazio`,
        ],
        [LangTextType.B0323]: [
            `只能使用数字`,
            `Numbers only`,
            `Números apenas`,
        ],
        [LangTextType.B0324]: [
            `暂无预览`,
            `No Preview`,
            `Sem Prévia`,
        ],
        [LangTextType.B0325]: [
            `模拟战`,
            `Simulation`,
            `Simulação`,
        ],
        [LangTextType.B0326]: [
            `评审意见`,
            `Comments`,
            `Comentários`,
        ],
        [LangTextType.B0327]: [
            `服务器状态`,
            `Server Status`,
            `Estado do Servidor`,
        ],
        [LangTextType.B0328]: [
            `账号总数`,
            `Accounts`,
            `Contas`,
        ],
        [LangTextType.B0329]: [
            `玩家在线总时长`,
            `Users' Online Time`,
            `Tempo Online dos Usuários`,
        ],
        [LangTextType.B0330]: [
            `新增账号数`,
            `New Accounts`,
            `Novas Contas`,
        ],
        [LangTextType.B0331]: [
            `活跃账号数`,
            `Active Accounts`,
            `Contas Ativas`,
        ],
        [LangTextType.B0332]: [
            `无可用选项`,
            `No available options`,
            `Sem opções disponíveis`,
        ],
        [LangTextType.B0333]: [
            `建筑统计`,
            `Buildings`,
            `Prédios`,
        ],
        [LangTextType.B0334]: [
            `基础伤害表`,
            `Base Damage Chart`,
            `Tabela de Dano Base`,
        ],
        [LangTextType.B0335]: [
            `攻击(主)`,
            `ATK(main)`,
            `ATQ(prin)`,
        ],
        [LangTextType.B0336]: [
            `攻击(副)`,
            `ATK(sub)`,
            `ATQ(sec)`,
        ],
        [LangTextType.B0337]: [
            `受击(主)`,
            `DEF(main)`,
            `DEF(prin)`,
        ],
        [LangTextType.B0338]: [
            `受击(副)`,
            `DEF(sub)`,
            `DEF(sec)`,
        ],
        [LangTextType.B0339]: [
            `HP`,
            `HP`,
            `HP`,
        ],
        [LangTextType.B0340]: [
            `移动力`,
            `Movement`,
            `Movimento`,
        ],
        [LangTextType.B0341]: [
            `造价`,
            `Production Cost`,
            `Custo de Produção`,
        ],
        [LangTextType.B0342]: [
            `燃料`,
            `Fuel`,
            `Combustível`,
        ],
        [LangTextType.B0343]: [
            `燃料消耗量`,
            `Fuel Consumption`,
            `Consumo de Combustível`,
        ],
        [LangTextType.B0344]: [
            `耗尽燃料时自毁`,
            `Crashes without fuel`,
            `Despenca quando sem combustível`,
        ],
        [LangTextType.B0345]: [
            `攻击距离`,
            `Attack Range`,
            `Alcance de Ataque`,
        ],
        [LangTextType.B0346]: [
            `移动后攻击`,
            `Move & Atk`,
            `Move e Atq`,
        ],
        [LangTextType.B0347]: [
            `建筑材料`,
            `Build Material`,
            `Material de Cosntrução`,
        ],
        [LangTextType.B0348]: [
            `生产材料`,
            `Production Material`,
            `Material de Produção`,
        ],
        [LangTextType.B0349]: [
            `照明弹`,
            `Flare Ammo`,
            `Sinalizadores`,
        ],
        [LangTextType.B0350]: [
            `主武器弹药`,
            `Primary Weapon Ammo`,
            `Munição da Arma Primária`,
        ],
        [LangTextType.B0351]: [
            `移动基础消耗表`,
            `Base Move Cost`,
            `Custo de Movimento Base`,
        ],
        [LangTextType.B0352]: [
            `防御加成`,
            `Defense Bonus`,
            `Bonus de Defesa`,
        ],
        [LangTextType.B0353]: [
            `资金收入`,
            `Income`,
            `Rendimento`,
        ],
        [LangTextType.B0354]: [
            `视野范围`,
            `Vision Range`,
            `Alcance de Visão`,
        ],
        [LangTextType.B0355]: [
            `对全体玩家生效`,
            `For all players`,
            `Para todo jogador`,
        ],
        [LangTextType.B0356]: [
            `隐蔽部队`,
            `Hide units`,
            `Ocultar unidades`,
        ],
        [LangTextType.B0357]: [
            `被占领即失败`,
            `Defeat if captured`,
            `Derrotado se capturado`,
        ],
        [LangTextType.B0358]: [
            `生产部队`,
            `Produce Unit`,
            `Produzir Unidade`,
        ],
        [LangTextType.B0359]: [
            `全局攻防加成`,
            `Global ATK/DEF Bonus`,
            `Bonus ATQ/DEF Global`,
        ],
        [LangTextType.B0360]: [
            `部队维修量`,
            `Repair Amount`,
            `Quantia de Reparos`,
        ],
        [LangTextType.B0361]: [
            `占领点数`,
            `Capture Point`,
            `Ponto de Captura`,
        ],
        [LangTextType.B0362]: [
            `建筑点数`,
            `Build Point`,
            `Ponto de Construção`,
        ],
        [LangTextType.B0363]: [
            `我的评分`,
            `My Rating`,
            `Minha Avaliação`,
        ],
        [LangTextType.B0364]: [
            `全服评分`,
            `Global Rating`,
            `Avaliação Geral`,
        ],
        [LangTextType.B0365]: [
            `评分`,
            `Set Rating`,
            `Avaliar`,
        ],
        [LangTextType.B0366]: [
            `开启作弊模式`,
            `Cheating`,
            `Trapaceando`,
        ],
        [LangTextType.B0367]: [
            `状态`,
            `Status`,
            `Estado`,
        ],
        [LangTextType.B0368]: [
            `已行动`,
            `Waited`,
            `Aguardando`,
        ],
        [LangTextType.B0369]: [
            `空闲`,
            `Idle`,
            `Ocioso`,
        ],
        [LangTextType.B0370]: [
            `晋升等级`,
            `Promotion`,
            `Promoção`,
        ],
        [LangTextType.B0371]: [
            `下潜中`,
            `Dived`,
            `Mergulhado`,
        ],
        [LangTextType.B0372]: [
            `最近`,
            `Recent`,
            `Recente`,
        ],
        [LangTextType.B0373]: [
            `公共(英语)`,
            `Public(EN)`,
            `Publico(EN)`,
        ],
        [LangTextType.B0374]: [
            `系统频道`,
            `System`,
            `Systema`,
        ],
        [LangTextType.B0375]: [
            `字数太多`,
            `Too many characters`,
            `Caracteres demais`,
        ],
        [LangTextType.B0376]: [
            `频道`,
            `Channel`,
            `Canal`,
        ],
        [LangTextType.B0377]: [
            `队伍`,
            `Team`,
            `Time`,
        ],
        [LangTextType.B0378]: [
            `私聊`,
            `Private`,
            `Privado`,
        ],
        [LangTextType.B0379]: [
            `全局`,
            `Global`,
            `Geral`,
        ],
        [LangTextType.B0380]: [
            `聊天列表`,
            `Chat List`,
            `Conversas`,
        ],
        [LangTextType.B0381]: [
            `暂无消息`,
            `No Messages`,
            `Sem Mensagens`,
        ],
        [LangTextType.B0382]: [
            `发送`,
            `Send`,
            `Enviar`,
        ],
        [LangTextType.B0383]: [
            `聊天`,
            `Chat`,
            `Conversa`,
        ],
        [LangTextType.B0384]: [
            `公共(中文)`,
            `Public(CN)`,
            `Publico(CN)`,
        ],
        [LangTextType.B0385]: [
            `经典版`,
            `Classic`,
            `Clássico`,
        ],
        [LangTextType.B0386]: [
            `新版`,
            `New`,
            `Novo`,
        ],
        [LangTextType.B0387]: [
            `常规`,
            `Regular`,
            `Regular`,
        ],
        [LangTextType.B0388]: [
            `增量`,
            `Increment`,
            `Increment`,
        ],
        [LangTextType.B0389]: [
            `初始时间`,
            `Initial Time`,
            `Tempo Inicial`,
        ],
        [LangTextType.B0390]: [
            `部队增量时间`,
            `Time increment per Unit`,
            `Incremento de Tempo por Unidade`,
        ],
        [LangTextType.B0391]: [
            `清空`,
            `Clear`,
            `Apagar`,
        ],
        [LangTextType.B0392]: [
            `游戏已开始`,
            `Game Started`,
            `Jogo Iniciado`,
        ],
        [LangTextType.B0393]: [
            `玩家昵称`,
            `Player's Display Name`,
            `Nome de Exibição do Jogador`,
        ],
        [LangTextType.B0394]: [
            `CO名称`,
            `CO Name`,
            `Nome do Comandante`,
        ],
        [LangTextType.B0395]: [
            `玩家列表`,
            `Players List`,
            `Lista de Jogadores`,
        ],
        [LangTextType.B0396]: [
            `超时告负`,
            `Boot`,
            `Iniciar`,
            // Boot a match, or a player?
        ],
        [LangTextType.B0397]: [
            `势力颜色`,
            `Color`,
            `Cor`,
        ],
        [LangTextType.B0398]: [
            `房间信息`,
            `Room Info`,
            `Info. da Sala`,
        ],
        [LangTextType.B0399]: [
            `修改规则`,
            `Modify Rules`,
            `Modificar Regras`,
        ],
        [LangTextType.B0400]: [
            `删除房间`,
            `Delete Room`,
            `Apagar Sala`,
        ],
        [LangTextType.B0401]: [
            `开战`,
            `Start Game`,
            `Iniciar Jogo`,
        ],
        [LangTextType.B0402]: [
            `准备就绪`,
            `Ready`,
            `Pronto`,
        ],
        [LangTextType.B0403]: [
            `已禁用CO`,
            `Banned COs`,
            `Comandantes Banidos`,
        ],
        [LangTextType.B0404]: [
            `排位赛`,
            `Ranking Match`,
            `Partida Ranqueada`,
        ],
        [LangTextType.B0405]: [
            `房间`,
            `Room`,
            `Sala`,
        ],
        [LangTextType.B0406]: [
            `规则可用性`,
            `Rule Availability`,
            `Disponibilidade da Regra`,
        ],
        [LangTextType.B0407]: [
            `玩家规则列表`,
            `Player Rule List`,
            `Lista de Regras dos Jogadores`,
            // What's this??
        ],
        [LangTextType.B0408]: [
            `排位赛(雾战)`,
            `Ranking Match FoW`,
            `Partida Ranqueada NdG`,
        ],
        [LangTextType.B0409]: [
            `单人自定义游戏`,
            `SP Custom Games`,
            `SP Jogos Personalizados`,
            // What's "SP"?
        ],
        [LangTextType.B0410]: [
            `我的房间`,
            `My Rooms`,
            `Minhas Salas`,
        ],
        [LangTextType.B0411]: [
            `踢出`,
            `Kick Off`,
            `Expulsar`,
            // Kick off a player or a match?
        ],
        [LangTextType.B0412]: [
            `数量`,
            `Number`,
            `Número`,
        ],
        [LangTextType.B0413]: [
            `设定战局数量`,
            `Set Number of Games`,
            `Definir Número de Partidas`,
        ],
        [LangTextType.B0414]: [
            `房间状态`,
            `Room Status`,
            `Estado da Sala`,
        ],
        [LangTextType.B0415]: [
            `排位明战`,
            `Ranked Std`,
            `Ranqueada Pdr`,
        ],
        [LangTextType.B0416]: [
            `排位雾战`,
            `Ranked FoW`,
            `Ranqueada NdG`,
        ],
        [LangTextType.B0417]: [
            `自定义明战`,
            `Custom Std`,
            `Amistosa Pdr`,
        ],
        [LangTextType.B0418]: [
            `自定义雾战`,
            `Custom FoW`,
            `Amistosa NdG`,
        ],
        [LangTextType.B0419]: [
            `地图编辑器`,
            `Map Editor`,
            `Editor de Mapas`,
        ],
        [LangTextType.B0420]: [
            `删除存档`,
            `Delete Match`,
            `Apagar Partida`,
        ],
        [LangTextType.B0421]: [
            `已搭载CO`,
            `CO onboard`,
            `Comandante à bordo`,
        ],
        [LangTextType.B0422]: [
            `战斗`,
            `Fight`,
            `Lutar`,
        ],
        [LangTextType.B0423]: [
            `信息`,
            `Info`,
            `Info.`,
        ],
        [LangTextType.B0424]: [
            `控制者`,
            `Controller`,
            `Controlador`,
        ],
        [LangTextType.B0425]: [
            `CO`,
            `CO`,
            `Comandante`,
        ],
        [LangTextType.B0426]: [
            `修改密码`,
            `Change Password`,
            `Alterar Senha`,
        ],
        [LangTextType.B0427]: [
            `旧密码`,
            `Old Password`,
            `Senha Anterior`,
        ],
        [LangTextType.B0428]: [
            `新密码`,
            `New Password`,
            `Nova Senha`,
        ],
        [LangTextType.B0429]: [
            `确认密码`,
            `Confirm Password`,
            `Confirmar Senha`,
        ],
        [LangTextType.B0430]: [
            `SetPath模式`,
            `Set Path Mode`,
            `Definir Modo de Navegação`,
        ],
        [LangTextType.B0431]: [
            `已启用`,
            `Enabled`,
            `Ativado`,
        ],
        [LangTextType.B0432]: [
            `已禁用`,
            `Disabled`,
            `Desativado`,
        ],
        [LangTextType.B0433]: [
            `启用`,
            `Enable`,
            `Ativar`,
        ],
        [LangTextType.B0434]: [
            `禁用`,
            `Disable`,
            `Desativar`,
        ],
        [LangTextType.B0435]: [
            `未上榜`,
            `No Rank`,
            `Sem Classificação`,
        ],
        [LangTextType.B0436]: [
            `排位积分榜`,
            `Leaderboard`,
            `Tabela de Classificação`,
        ],
        [LangTextType.B0437]: [
            `标准`,
            `Standard`,
            `Padrão`,
        ],
        [LangTextType.B0438]: [
            `雾战`,
            `Fog of War`,
            `Névoa da Guerra`,
        ],
        [LangTextType.B0439]: [
            `能否下潜`,
            `Can Dive`,
            `Pode Mergulhar`,
        ],
        [LangTextType.B0440]: [
            `部队属性表`,
            `Units Info`,
            `Info. das Unidades`,
        ],
        [LangTextType.B0441]: [
            `标准图池`,
            `Standard Maps`,
            `Mapas Padrão`,
        ],
        [LangTextType.B0442]: [
            `雾战图池`,
            `Fog Maps`,
            `Mapas com Névoa`,
        ],
        [LangTextType.B0443]: [
            `多人房间`,
            `MP Room`,
            `Sala MP`,
            // What's "MP"?
        ],
        [LangTextType.B0444]: [
            `设置标签`,
            `Set Tags`,
            `Definir Categorias`,
        ],
        [LangTextType.B0445]: [
            `地图标签`,
            `Map Tags`,
            `Categorias do Mapa`,
        ],
        [LangTextType.B0446]: [
            `忽略`,
            `Ignored`,
            `Ignorado`,
        ],
        [LangTextType.B0447]: [
            `查找地图`,
            `Search Maps`,
            `Buscar Mapas`,
        ],
        [LangTextType.B0448]: [
            `需要密码`,
            `Password required`,
            `Senha requerida`,
        ],
        [LangTextType.B0449]: [
            `输入密码`,
            `Input Password`,
            `Colocar Senha`,
        ],
        [LangTextType.B0450]: [
            `势力被摧毁`,
            `'s army is destroyed`,
            ` teve seu exército destruído`,
        ],
        [LangTextType.B0451]: [
            `触发事件`,
            `An event is triggered.`,
            `Um evento é disparado`,
        ],
        [LangTextType.B0452]: [
            `错误码`,
            `Error`,
            `Erro`,
        ],
        [LangTextType.B0453]: [
            `意见反馈`,
            `Complaint`,
            `Reclamação`,
        ],
        [LangTextType.B0454]: [
            `新增消息`,
            `Add Message`,
            `Adicionar Mensagem`,
        ],
        [LangTextType.B0455]: [
            `中文`,
            `In Chinese`,
            `Em Chinês`,
        ],
        [LangTextType.B0456]: [
            `英文`,
            `In English`,
            `Em Inglês`,
        ],
        [LangTextType.B0457]: [
            `更新日志`,
            `Changelog`,
            `Histórico de Mudanças`,
        ],
        [LangTextType.B0458]: [
            `设定地图名称`,
            `Edit Map Name`,
            `Alterar Nome do Mapa`,
        ],
        [LangTextType.B0459]: [
            `设定规则名称`,
            `Edit Rule Name`,
            `Alterar Nome da Regra`,
        ],
        [LangTextType.B0460]: [
            `设置权限`,
            `Set Privilege`,
            `Definir Privilégios`,
        ],
        [LangTextType.B0461]: [
            `战局事件列表`,
            `Event List`,
            `Lista de Eventos`,
        ],
        [LangTextType.B0462]: [
            `战局事件ID`,
            `Event ID`,
            `ID do Evento`,
        ],
        [LangTextType.B0463]: [
            `上移`,
            `Up`,
            `Cima`,
        ],
        [LangTextType.B0464]: [
            `下移`,
            `Down`,
            `Baixo`,
        ],
        [LangTextType.B0465]: [
            `编辑`,
            `Edit`,
            `Modificar`,
        ],
        [LangTextType.B0466]: [
            `已添加`,
            `Added`,
            `Adicionado`,
        ],
        [LangTextType.B0467]: [
            `添加`,
            `Add`,
            `Adicionar`,
        ],
        [LangTextType.B0468]: [
            `添加事件到规则`,
            `Add Event To Rule`,
            `Adicionar Evento à Regra`,
        ],
        [LangTextType.B0469]: [
            `战局事件`,
            `Event`,
            `Evento`,
        ],
        [LangTextType.B0470]: [
            `事件列表`,
            `Event List`,
            `Lista de Eventos`,
        ],
        [LangTextType.B0471]: [
            `存活`,
            `Playing`,
            `Jogando`,
        ],
        [LangTextType.B0472]: [
            `已战败`,
            `Defeated`,
            `Derrotado`,
        ],
        [LangTextType.B0473]: [
            `即将战败`,
            `Being Defeated`,
            `Sendo Derrotado`,
        ],
        [LangTextType.B0474]: [
            `准备阶段`,
            `Standby Phase`,
            `Fase de Prontidão`,
        ],
        [LangTextType.B0475]: [
            `主要阶段`,
            `Main Phase`,
            `Fase Principal`,
        ],
        [LangTextType.B0476]: [
            `事件在每个玩家回合的触发次数上限`,
            `Upper limit of trigger times per player's turn`,
            `Limite superior de vezes disparado por turno do jogador`,
        ],
        [LangTextType.B0477]: [
            `事件在整局游戏中的触发次数上限`,
            `Upper limit of trigger times per game`,
            `Limite superior de vezes disparado por jogo`,
        ],
        [LangTextType.B0478]: [
            `修改事件名称`,
            `Edit Event Name`,
            `Modificar Nome do Evento`,
        ],
        [LangTextType.B0479]: [
            `删除事件`,
            `Delete Event`,
            `Deletar Evento`,
        ],
        [LangTextType.B0480]: [
            `替换`,
            `Replace`,
            `Substituir`,
        ],
        [LangTextType.B0481]: [
            `删除条件节点`,
            `Delete Conditional Node`,
            `Deletar Nó Condinional`,
        ],
        [LangTextType.B0482]: [
            `切换与/或`,
            `ALL/ANY`,
            `TODO/QUALQUER`,
        ],
        [LangTextType.B0483]: [
            `+子条件`,
            `Sub Cond.`,
            `Sub Cond.`,
        ],
        [LangTextType.B0484]: [
            `+子节点`,
            `Sub Node`,
            `Sub Nó`,
        ],
        [LangTextType.B0485]: [
            `删除条件`,
            `Delete Condition`,
            `Deletar Condição`,
        ],
        [LangTextType.B0486]: [
            `删除动作`,
            `Delete Action`,
            `Deletar Ação`,
        ],
        [LangTextType.B0487]: [
            `浅克隆`,
            `Shallow Clone`,
            `Clone Superficial`,
        ],
        [LangTextType.B0488]: [
            `条件节点`,
            `Conditional Node`,
            `Nó Conditional`,
        ],
        [LangTextType.B0489]: [
            `子节点`,
            `Sub Node`,
            `Sub Nó`,
        ],
        [LangTextType.B0490]: [
            `子条件`,
            `Sub Condition`,
            `Sub Condição`,
        ],
        [LangTextType.B0491]: [
            `替换条件节点`,
            `Replace Conditional Node`,
            `Substituit Nó Condicional`,
        ],
        [LangTextType.B0492]: [
            `引用`,
            `Reference`,
            `Referência`,
        ],
        [LangTextType.B0493]: [
            `无错误`,
            `No Error`,
            `Sem Erros`,
        ],
        [LangTextType.B0494]: [
            `重置条件节点`,
            `Reset Node`,
            `Resetar Nó`,
        ],
        [LangTextType.B0495]: [
            `修改名称`,
            `Modify Name`,
            `Modificar Nome`,
        ],
        [LangTextType.B0496]: [
            `新增动作`,
            `Add Action`,
            `Adicionar Ação`,
        ],
        [LangTextType.B0497]: [
            `新增事件`,
            `Add Event`,
            `Adicionar Evento`,
        ],
        [LangTextType.B0498]: [
            `删除多余数据`,
            `Delete Redundancy`,
            `Deletar Redundância`,
        ],
        [LangTextType.B0499]: [
            `删除节点`,
            `Delete Node`,
            `Deletar Nó`,
        ],
        [LangTextType.B0500]: [
            `替换条件`,
            `Replace Condition`,
            `Trocar Condição`,
        ],
        [LangTextType.B0501]: [
            `修改条件`,
            `Modify Condition`,
            `Modificar Condição`,
        ],
        [LangTextType.B0502]: [
            `条件`,
            `Condition`,
            `Condição`,
        ],
        [LangTextType.B0503]: [
            `使用中`,
            `In Use`,
            `Em Uso`,
        ],
        [LangTextType.B0504]: [
            `当前回合数等于...`,
            `The current turn equals to ...`,
            `O atual turno é...`,
        ],
        [LangTextType.B0505]: [
            `当前回合数大于...`,
            `The current turn is greater than ...`,
            `O turno atual é maior que...`,
        ],
        [LangTextType.B0506]: [
            `当前回合数小于...`,
            `The current turn is less than ...`,
            `O turno atual é menor que...`,
        ],
        [LangTextType.B0507]: [
            `当前回合数的余数等于...`,
            `The current turn's remainder equals to ...`,
            `O resto do atual turno equivale a...`,
        ],
        [LangTextType.B0508]: [
            `当前的回合阶段是...`,
            `The current turn phase is ...`,
            `A fase do atual turno é...`,
        ],
        [LangTextType.B0509]: [
            `处于当前回合的玩家序号等于...`,
            `The current player index equals to ...`,
            `O índice do jogador atual equiale à...`,
        ],
        [LangTextType.B0510]: [
            `处于当前回合的玩家序号大于...`,
            `The current player index is greater than ...`,
            `O índice do atual jogador é maior que...`,
        ],
        [LangTextType.B0511]: [
            `处于当前回合的玩家序号小于...`,
            `The current player index is less than ...`,
            `O índice do atual jogador é menor que...`,
        ],
        [LangTextType.B0512]: [
            `事件的发生次数等于...`,
            `The event occurred times equals to ...`,
            `O evento ocorreu um número de vezes igual a...`,
        ],
        [LangTextType.B0513]: [
            `事件的发生次数大于...`,
            `The event occurred times is greater than ...`,
            `O evento ocorreu um número de vezes maior que...`,
        ],
        [LangTextType.B0514]: [
            `事件的发生次数小于...`,
            `The event occurred times is less than ...`,
            `O evento ocorreu um número de vezes menor que...`,
        ],
        [LangTextType.B0515]: [
            `玩家的状态是...`,
            `The player's state is ...`,
            `O estado do jogador é...`,
        ],
        [LangTextType.B0516]: [
            `切换类型`,
            `Change Type`,
            `Alterar Tipo`,
        ],
        [LangTextType.B0517]: [
            `取反`,
            `Is Not`,
            `Não é`,
        ],
        [LangTextType.B0518]: [
            `除数`,
            `Divider`,
            `Divisor`,
        ],
        [LangTextType.B0519]: [
            `余数`,
            `Remainder`,
            `Resto`,
        ],
        [LangTextType.B0520]: [
            `切换`,
            `Switch`,
            `Trocar`,
            // As in "Switch/Case"?
        ],
        [LangTextType.B0521]: [
            `玩家序号`,
            `Player Index`,
            `Índice do Jogador`,
        ],
        [LangTextType.B0522]: [
            `次数`,
            `Times`,
            `Vezes`,
        ],
        [LangTextType.B0523]: [
            `玩家状态`,
            `Player State`,
            `Estado do Jogador`,
        ],
        [LangTextType.B0524]: [
            `部队总数`,
            `Total number of the units`,
            `Número total de unidades`,
        ],
        [LangTextType.B0525]: [
            `部队类型`,
            `Unit Type`,
            `Tipo de Unidade`,
        ],
        [LangTextType.B0526]: [
            `行动状态`,
            `Action State`,
            `Estado da Ação`,
        ],
        [LangTextType.B0527]: [
            `部队ID`,
            `Unit ID`,
            `ID da Unidade`,
        ],
        [LangTextType.B0528]: [
            `装载部队ID`,
            `Loader ID`,
            `ID do Transporte`,
            // Loader as in "Unit being loaded"?
        ],
        [LangTextType.B0529]: [
            `建筑中`,
            `Building`,
            `Edifício`,
        ],
        [LangTextType.B0530]: [
            `占领中`,
            `Capturing`,
            `Capturando`,
        ],
        [LangTextType.B0531]: [
            `坐标`,
            `Coordinate`,
            `Coordenada`,
        ],
        [LangTextType.B0532]: [
            `是否会被部队阻挡`,
            `Blockable By Unit`,
            `Bloqueável por Unidade`,
        ],
        [LangTextType.B0533]: [
            `修改动作`,
            `Modify Action`,
            `Modificar Ação`,
        ],
        [LangTextType.B0534]: [
            `自动寻找合适的地形`,
            `Auto Find Suitable Tile`,
            `Encontrar Terreno Adequado Auto.`,
        ],
        [LangTextType.B0535]: [
            `新增部队`,
            `Add Unit`,
            `Adicionar Unidade`,
        ],
        [LangTextType.B0536]: [
            `单人雾战`,
            `Free Battle`,
            `Batalha livre`,
        ],
        [LangTextType.B0537]: [
            `QQ群`,
            `QQ Group`,
            `Grupo QQ`,
        ],
        [LangTextType.B0538]: [
            `Discord`,
            `Discord`,
            `Discord`,
        ],
        [LangTextType.B0539]: [
            `GitHub`,
            `GitHub`,
            `GitHub`,
        ],
        [LangTextType.B0540]: [
            `声音设定`,
            `Sound Settings`,
            `Configurações de Som`,
        ],
        [LangTextType.B0541]: [
            `音乐`,
            `BGM`,
            `Música`,
        ],
        [LangTextType.B0542]: [
            `音效`,
            `SFX`,
            `Efeitos`,
        ],
        [LangTextType.B0543]: [
            `默认`,
            `Default`,
            `Padrão`,
        ],
        [LangTextType.B0544]: [
            `上一首BGM`,
            `Previous BGM`,
            `Música Anterior`,
        ],
        [LangTextType.B0545]: [
            `下一首BGM`,
            `Next BGM`,
            `Música Seguinte`,
        ],
        [LangTextType.B0546]: [
            `明战排位`,
            `Std Rank`,
            `Classificação Pdr`,
        ],
        [LangTextType.B0547]: [
            `雾战排位`,
            `FoW Rank`,
            `Classificação NdG`,
        ],
        [LangTextType.B0548]: [
            `明战`,
            `Std`,
            `Pdr`,
        ],
        [LangTextType.B0549]: [
            `雾战`,
            `FoW`,
            `NdG`,
        ],
        [LangTextType.B0550]: [
            `胜`,
            `Win`,
            `Vitória`,
        ],
        [LangTextType.B0551]: [
            `负`,
            `Lose`,
            `Derrota`,
        ],
        [LangTextType.B0552]: [
            `平`,
            `Draw`,
            `Empate`,
        ],
        [LangTextType.B0553]: [
            `胜率`,
            `Win (%)`,
            `Vitórias (%)`,
        ],
        [LangTextType.B0554]: [
            `排位`,
            `Ranking`,
            `Classificação`,
        ],
        [LangTextType.B0555]: [
            `无名`,
            `No Name`,
            `Sem Nome`,
        ],
        [LangTextType.B0556]: [
            `多人自由房间`,
            `MP Free Room`,
            `Sala Livre MP`,
        ],
        [LangTextType.B0557]: [
            `自由模式`,
            `Free Mode`,
            `Modo Livre`,
        ],
        [LangTextType.B0558]: [
            `分辨率设定`,
            `Resolution Settings`,
            `Configurações de Resolução`,
        ],
        [LangTextType.B0559]: [
            `UI缩放倍率`,
            `UI Scale`,
            `Escala da Interface`,
        ],
        [LangTextType.B0560]: [
            `设置`,
            `Settings`,
            `Configurações`,
        ],
        [LangTextType.B0561]: [
            `打开`,
            `On`,
            `Ligado`,
        ],
        [LangTextType.B0562]: [
            `关闭`,
            `Off`,
            `Desligado`,
        ],
        [LangTextType.B0563]: [
            `使用中文`,
            `Use Chinese`,
            `Usar Chinês`,
        ],
        [LangTextType.B0564]: [
            `使用英文`,
            `Use English`,
            `Usar Inglês`,
        ],
        [LangTextType.B0565]: [
            `热度`,
            `Popularity`,
            `Popularidade`,
        ],
        [LangTextType.B0566]: [
            `下一步`,
            `Next`,
            `Próximo`,
        ],
        [LangTextType.B0567]: [
            `重置`,
            `Reset`,
            `Resetar`,
        ],
        [LangTextType.B0568]: [
            `最小热度`,
            `Min. Popularity`,
            `Popularidade Mín.`,
        ],
        [LangTextType.B0569]: [
            `最低评分`,
            `Min. Rating`,
            `Nota Mín.`,
        ],
        [LangTextType.B0570]: [
            `雾战标签`,
            `FoW Tagged`,
            `Marcado para NdG`,
        ],
        [LangTextType.B0571]: [
            `房间设置`,
            `Room Settings`,
            `Configurações da Sala`,
        ],
        [LangTextType.B0572]: [
            `选择势力`,
            `Choose an Army`,
            `Escolha um Exército`,
        ],
        [LangTextType.B0573]: [
            `选择颜色`,
            `Choose a Color`,
            `Escolha uma Cor`,
        ],
        [LangTextType.B0574]: [
            `计时模式`,
            `Timer Mode`,
            `Tipo de Cronômetro`,
        ],
        [LangTextType.B0575]: [
            `自定义`,
            `Customize`,
            `Personalizar`,
        ],
        [LangTextType.B0576]: [
            `D2D`,
            `D2D`,
            `DaD`,
        ],
        [LangTextType.B0577]: [
            `COP`,
            `COP`,
            `PdC`,
        ],
        [LangTextType.B0578]: [
            `SCOP`,
            `SCOP`,
            `SPdC`,
        ],
        [LangTextType.B0579]: [
            `积分`,
            `Score`,
            `Pontuação`,
        ],
        [LangTextType.B0580]: [
            `加入房间`,
            `Join Rooms`,
            `Procurar Salas`,
        ],
        [LangTextType.B0581]: [
            `选择房间`,
            `Choose a Room`,
            `Escolher uma Sala`,
        ],
        [LangTextType.B0582]: [
            `暂无房间`,
            `No Rooms`,
            `Sem Salas`,
        ],
        [LangTextType.B0583]: [
            `加入`,
            `Join`,
            `Juntar-se`,
        ],
        [LangTextType.B0584]: [
            `棋盘网格线`,
            `Border Lines`,
            `Linhas de Borda`,
        ],
        [LangTextType.B0585]: [
            `显示棋盘格子`,
            `Show Border`,
            `Exibir Borda`,
        ],
        [LangTextType.B0586]: [
            `您的势力颜色`,
            `Your Army Color`,
            `A Cor do seu Exército`,
        ],
        [LangTextType.B0587]: [
            `您的CO`,
            `Your CO`,
            `Seu Comandante`,
        ],
        [LangTextType.B0588]: [
            `我的战局`,
            `My Matches`,
            `Minhas Partidas`,
        ],
        [LangTextType.B0589]: [
            `选择战局`,
            `Choose a match`,
            `Escolha uma partida`,
        ],
        [LangTextType.B0590]: [
            `禁用CO`,
            `Ban COs`,
            `Banir Comandantes`,
        ],
        [LangTextType.B0591]: [
            `已禁用CO`,
            `Banned COs`,
            `Comandantes Banidos`,
        ],
        [LangTextType.B0592]: [
            `禁用CO阶段倒计时`,
            `Time Left to Ban COs`,
            `Tempo restante para Banir Comandantes`,
        ],
        [LangTextType.B0593]: [
            `准备阶段倒计时`,
            `Standby Phase Countdown`,
            `Término da Fase de Prontidão`,
        ],
        [LangTextType.B0594]: [
            `预览地图`,
            `Preview Maps`,
            `Visualizar Mapas`,
        ],
        [LangTextType.B0595]: [
            `标准地图`,
            `Standard Maps`,
            `Mapas Padrão`,
        ],
        [LangTextType.B0596]: [
            `雾战地图`,
            `FoW Maps`,
            `Mapas com NdG`,
        ],
        [LangTextType.B0597]: [
            `切换`,
            `Switch`,
            `Mudar`,
        ],
        [LangTextType.B0598]: [
            `选择回放`,
            `Choose a Replay`,
            `Escolha um Replay`,
        ],
        [LangTextType.B0599]: [
            `战局类型`,
            `Match Type`,
            `Tipo de Partida`,
        ],
        [LangTextType.B0600]: [
            `回合数和行动数`,
            `Turns and Actions`,
            `Turnos e Ações`,
        ],
        [LangTextType.B0601]: [
            `结束时间`,
            `End Time`,
            `Tempo para término`,
        ],
        [LangTextType.B0602]: [
            `刷新`,
            `Refresh`,
            `Atualizar`,
        ],
        [LangTextType.B0603]: [
            `自定义模式`,
            `Custom Mode`,
            `Modo Amistoso`,
        ],
        [LangTextType.B0604]: [
            `游戏设置`,
            `Game Settings`,
            `Configurações do Jogo`,
        ],
        [LangTextType.B0605]: [
            `存档备注`,
            `Save Comment`,
            `Salvar Comentário`,
        ],
        [LangTextType.B0606]: [
            `存档编号`,
            `Save Slot`,
            `Espaço para Gravação`,
        ],
        [LangTextType.B0607]: [
            `电脑`,
            `A.I.`,
            `I.A.`,
        ],
        [LangTextType.B0608]: [
            `更换控制者`,
            `Controller`,
            `Controlador`,
        ],
        [LangTextType.B0609]: [
            `更换颜色`,
            `Change Color`,
            `Mudar Cor`,
        ],
        [LangTextType.B0610]: [
            `自定义明战`,
            `Custom Std`,
            `Amistoso Pdr`,
        ],
        [LangTextType.B0611]: [
            `自定义雾战`,
            `Custom FoW`,
            `Amistoso NdG`,
        ],
        [LangTextType.B0612]: [
            `模拟战明战`,
            `Simulation Std`,
            `Simulação Pdr`,
        ],
        [LangTextType.B0613]: [
            `模拟战雾战`,
            `Simulation FoW`,
            `Simulação NdG`,
        ],
        [LangTextType.B0614]: [
            `挑战模式`,
            `War Room`,
            `Desafios`,
        ],
        [LangTextType.B0615]: [
            `替换动作`,
            `Replace Action`,
            `Reproduzir Ação`,
        ],
        [LangTextType.B0616]: [
            `动作`,
            `Action`,
            `Ação`,
        ],
        [LangTextType.B0617]: [
            `增加部队`,
            `Add Units`,
            `Adicionar Unidades`,
        ],
        [LangTextType.B0618]: [
            `修改玩家状态`,
            `Modify Players' State`,
            `Modificar o Estado dos Jogadores`,
        ],
        [LangTextType.B0619]: [
            `多人合作自定义游戏`,
            `Coop Custom Games`,
            `Jogos Amistosos Coop`,
        ],
        [LangTextType.B0620]: [
            `切换游戏版本`,
            `Switch Game Version`,
            `Mudar Versão do Jogo`,
        ],
        [LangTextType.B0621]: [
            `经典版`,
            `Classic Version`,
            `Versão Claśsica`,
        ],
        [LangTextType.B0622]: [
            `实验版`,
            `Experimental Version`,
            `Versão Experimental`,
        ],
        [LangTextType.B0623]: [
            `当前版本`,
            `Current Version`,
            `Versão Atual`,
        ],
        [LangTextType.B0624]: [
            `中文`,
            `Chinese`,
            `Chinês`,
        ],
        [LangTextType.B0625]: [
            `英文`,
            `English`,
            `Inglês`,
        ],
        [LangTextType.B0626]: [
            `找回密码`,
            `Forget?`,
            `Esquecer?`,
        ],
        [LangTextType.B0627]: [
            `语言`,
            `Language`,
            `Idioma`,
        ],
        [LangTextType.B0628]: [
            `贴图`,
            `Texture`,
            `Textura`,
        ],
        [LangTextType.B0629]: [
            `部队动画`,
            `Unit Animation`,
            `Animação das Unidades`,
        ],
        [LangTextType.B0630]: [
            `地形动画`,
            `Tile Animation`,
            `Animação do Mapa`,
        ],
        [LangTextType.B0631]: [
            `切换BGM`,
            `Switch BGM`,
            `Mudar Música`,
        ],
        [LangTextType.B0632]: [
            `Wandering Path (Lobby)`,
            `Wandering Path (Lobby)`,
            `Caminho Vagante (Lobby)`,
        ],
        [LangTextType.B0633]: [
            `Design Time (Map Editor)`,
            `Design Time (Map Editor)`,
            `Hora de Projetar (Editor de Mapas)`,
        ],
        [LangTextType.B0634]: [
            `We Will Prevail (Will)`,
            `We Will Prevail (Will)`,
            `Prevaleceremos (Will)`,
        ],
        [LangTextType.B0635]: [
            `Hope Never Dies (Brenner)`,
            `Hope Never Dies (Brenner)`,
            `A Esperança Nunca Morre (Brenner)`,
        ],
        [LangTextType.B0636]: [
            `Lost Memories (Isabella)`,
            `Lost Memories (Isabella)`,
            `Memórias Perdidas (Isabella)`,
        ],
        [LangTextType.B0637]: [
            `Proud Soldier (Gage)`,
            `Proud Soldier (Gage)`,
            `Soldado com Orgulho (Gage)`,
        ],
        [LangTextType.B0638]: [
            `Days of Ruin (No CO)`,
            `Days of Ruin (No CO)`,
            `Dias de Ruína (Sem Comandante)`,
        ],
        [LangTextType.B0639]: [
            `Rutty (??)`,
            `Rutty (??)`,
            `Rutty (??)`,
        ],
        [LangTextType.B0640]: [
            `用户ID`,
            `User ID`,
            `ID do Usuário`,
        ],
        [LangTextType.B0641]: [
            `由AI控制`,
            `Controlled by A.I.`,
            `Cotnrolado pela I.A.`,
        ],
        [LangTextType.B0642]: [
            `AI使用的CO`,
            `CO for A.I.`,
            `Comandante para a I.A.`,
        ],
        [LangTextType.B0643]: [
            `合作房间`,
            `Coop Room`,
            `Sala Coop`,
        ],
        [LangTextType.B0644]: [
            `合作模式中AI的CO`,
            `CO for A.I. in Coop`,
            `Comandante para a I.A. no Coop`,
        ],
        [LangTextType.B0645]: [
            `合作模式中由AI控制`,
            `Controlled by A.I. in Coop`,
            `Controlado pela I.A. no Coop`,
        ],
        [LangTextType.B0646]: [
            `合作模式`,
            `Coop Mode`,
            `Modo Coop`,
        ],
        [LangTextType.B0647]: [
            `我`,
            `Me`,
            `Eu`,
        ],
        [LangTextType.B0648]: [
            `其他玩家`,
            `Others`,
            `Outros`,
        ],
        [LangTextType.B0649]: [
            `Advance Wars by Web`,
            `Advance Wars by Web`,
            `Advance Wars by Web`,
        ],
        [LangTextType.B0650]: [
            `返回地图列表`,
            `Go to Map List`,
            `Lista de Mapas`,
        ],
        [LangTextType.B0651]: [
            `返回回放列表`,
            `Go to Replay List`,
            `Lista de Replays`,
        ],
        [LangTextType.B0652]: [
            `返回战局列表`,
            `Go to Matches List`,
            `Lista de Partidas`,
        ],
        [LangTextType.B0653]: [
            `Supreme Logician (Lin)`,
            `Supreme Logician (Lin)`,
            `Estrategista Suprema (Lin)`,
        ],
        [LangTextType.B0654]: [
            `Goddess of Revenge (Tasha)`,
            `Goddess of Revenge (Tasha)`,
            `Deusa da Vingança (Tasha)`,
        ],
        [LangTextType.B0655]: [
            `Hero of Legend (Forsythe)`,
            `Hero of Legend (Forsythe)`,
            `Herói Lendário (Forsythe)`,
        ],
        [LangTextType.B0656]: [
            `Flight of the Coward (Waylon)`,
            `Flight of the Coward (Waylon)`,
            `A Voo do Covarde (Waylon)`,
        ],
        [LangTextType.B0657]: [
            `Madman's Reign (Greyfield)`,
            `Madman's Reign (Greyfield)`,
            `O Reino do Louco (Greyfield)`,
        ],
        [LangTextType.B0658]: [
            `Cruel Rose (Tabitha)`,
            `Cruel Rose (Tabitha)`,
            `Uma Rosa Cruel (Tabitha)`,
        ],
        [LangTextType.B0659]: [
            `Puppet Master (Caulder)`,
            `Puppet Master (Caulder)`,
            `Mestre dos Fantoches (Caulder)`,
        ],
        [LangTextType.B0660]: [
            `Power Up (Power)`,
            `Power Up (Power)`,
            `Fortalecer (Poder)`,
        ],
        [LangTextType.B0661]: [
            `删除地形装饰物`,
            `Del Decoration`,
            `Del Decoração`,
        ],
        [LangTextType.B0662]: [
            `绘制地形装饰物`,
            `Place Decoration`,
            `Colocar Decoração`,
        ],
        [LangTextType.B0663]: [
            `陆地边角`,
            `Land Corner`,
            `Canto Terrestre`,
        ],
        [LangTextType.B0664]: [
            `地形装饰物`,
            `Decoration`,
            `Decoração`,
        ],
        [LangTextType.B0665]: [
            `跳过`,
            `Skip`,
            `Pular`,
        ],
        [LangTextType.B0666]: [
            `增加对白`,
            `Add Dialogue`,
            `Adicionar Diálogo`,
        ],
        [LangTextType.B0667]: [
            `播放`,
            `Play`,
            `Jogar`,
        ],
        [LangTextType.B0668]: [
            `切换类型`,
            `Switch Type`,
            `Mudar Tipo`,
        ],
        [LangTextType.B0669]: [
            `对白类型`,
            `Dialogue Type`,
            `Tipo de Diálogo`,
        ],
        [LangTextType.B0670]: [
            `旁白`,
            `Aside`,
            `Aparte`,
        ],
        [LangTextType.B0671]: [
            `CO对白`,
            `CO Dialogue`,
            `Diálogo do Comandante`,
        ],
        [LangTextType.B0672]: [
            `未知`,
            `Unknown`,
            `Desconhecido`,
        ],
        [LangTextType.B0673]: [
            `显示在左侧`,
            `Show on left`,
            `Mostrar à esquerda`,
        ],
        [LangTextType.B0674]: [
            `播放剧情对白`,
            `Show Dialogue`,
            `Mostrar Diálogo`,
        ],
        [LangTextType.B0675]: [
            `对白总数`,
            `Total Dialogues`,
            `Total de Diálogos`,
        ],
        [LangTextType.B0676]: [
            `在线`,
            `Online`,
            `Conectado`,
        ],
        [LangTextType.B0677]: [
            `离线`,
            `Offline`,
            `Desconectado`,
        ],
        [LangTextType.B0678]: [
            `自动填充`,
            `Auto Fill`,
            `Preenchimento Auto.`,
        ],
        [LangTextType.B0679]: [
            `回合开始！`,
            `Turn Start!`,
            `Início do Turno!`,
        ],
        [LangTextType.B0680]: [
            `导出到剪贴板`,
            `Export to Clipboard`,
            `Exportar para a Área de Transferência`,
        ],
        [LangTextType.B0681]: [
            `从剪贴板导入`,
            `Import from Clipboard`,
            `Importar da Área de Transferência`,
        ],
        [LangTextType.B0682]: [
            `插入`,
            `Insert`,
            `Inserir`,
        ],
        [LangTextType.B0683]: [
            `中文名称`,
            `Chinese Name`,
            `Nome em Chinês`,
        ],
        [LangTextType.B0684]: [
            `英文名称`,
            `English Name`,
            `Nome em Inglês`,
        ],
        [LangTextType.B0685]: [
            `空闲部队`,
            `Idle Unit`,
            `Unidade Ociosa`,
        ],
        [LangTextType.B0686]: [
            `空闲建筑`,
            `Idle Tile`,
            `Terreno Ocioso`,
        ],
        [LangTextType.B0687]: [
            `回合`,
            `Turn`,
            `Turno`,
        ],
        [LangTextType.B0688]: [
            `部队数与价值`,
            `Units and Value`,
            `Unidades e Valor`,
        ],
        [LangTextType.B0689]: [
            `建筑数与收入`,
            `Buildings and Income`,
            `Propriedades e Rendimento`,
        ],
        [LangTextType.B0690]: [
            `求和`,
            `Set Draw`,
            `Propor empate`,
        ],
        [LangTextType.B0691]: [
            `生产`,
            `Build`,
            `Construir`,
        ],
        [LangTextType.B0692]: [
            `主武器`,
            `Main`,
            `Principal`,
        ],
        [LangTextType.B0693]: [
            `副武器`,
            `Sub`,
            `Sub`,
        ],
        [LangTextType.B0694]: [
            `攻击`,
            `ATK`,
            `ATQ`,
        ],
        [LangTextType.B0695]: [
            `防御`,
            `DEF`,
            `DEF`,
        ],
        [LangTextType.B0696]: [
            `射程`,
            `Range`,
            `Alcance`,
        ],
        [LangTextType.B0697]: [
            `可移动后攻击`,
            `Move & Atk`,
            `Move e Atq`,
        ],
        [LangTextType.B0698]: [
            `搭载部队`,
            `Loaded Units`,
            `Unidades Embarcadas`,
        ],
        [LangTextType.B0699]: [
            "E队",
            "Team E",
            `Time E`,
        ],
        [LangTextType.B0700]: [
            "黑",
            "Black",
            `Preto`,
        ],
        [LangTextType.B0701]: [
            `正常天气`,
            `Normal`,
            `Normal`,
        ],
        [LangTextType.B0702]: [
            `沙尘暴`,
            `Sandstorm`,
            `Tempestade de Areia`,
        ],
        [LangTextType.B0703]: [
            `雪天`,
            `Snowy`,
            `Nevasca`,
        ],
        [LangTextType.B0704]: [
            `雨天`,
            `Rainy`,
            `Chuva`,
        ],
        [LangTextType.B0705]: [
            `天气`,
            `Weather`,
            `Clima`,
        ],
        [LangTextType.B0706]: [
            `Mr. Bear (Penny)`,
            `Mr. Bear (Penny)`,
            `Sr. Urso (Penny)`,
        ],
        [LangTextType.B0707]: [
            `头像`,
            `Avatar`,
            `Avatar`,
        ],
        [LangTextType.B0708]: [
            `改名`,
            `Rename`,
            `Renomear`,
        ],
        [LangTextType.B0709]: [
            `自动保存`,
            `Auto Save`,
            `Salvar Auto.`,
        ],
        [LangTextType.B0710]: [
            `回放`,
            `Replay`,
            `Replay`,
        ],
        [LangTextType.B0711]: [
            `返回战局`,
            `Resume Match`,
            `Voltar à Partida`,
        ],
        [LangTextType.B0712]: [
            `回放进度`,
            `Replay Progress`,
            `Progresso do Replay`,
        ],
        [LangTextType.B0713]: [
            `重置视角`,
            `Reset Viewpoint`,
            `Resetar Ponto de Vista`,
        ],
        [LangTextType.B0714]: [
            `显示特效`,
            `Show Effect`,
            `Exibir Efeito`,
        ],
        [LangTextType.B0715]: [
            `改变天气`,
            `Change Weather`,
            `Mudar Clima`,
        ],
        [LangTextType.B0716]: [
            `指定地块所属的玩家是...`,
            `The tile's owner is ...`,
            `O terreno é ocupado por...`,
            // What is a Tile owner? Whoever occupies a given tile?
        ],
        [LangTextType.B0717]: [
            `指定地块的类型是...`,
            `The tile's type is ...`,
            `O tipo do terreno é...`,
        ],
        [LangTextType.B0718]: [
            `地形类型`,
            `Terrain Type`,
            `Tipo do Terreno`,
        ],
        [LangTextType.B0719]: [
            `战局`,
            `Match`,
            `Partida`,
        ],
        [LangTextType.B0720]: [
            `A.I.模式`,
            `I.A. Mode`,
            `Modo da I.A.`,
        ],
        [LangTextType.B0721]: [
            `站桩`,
            `No Move`,
            `Sem movimento`,
        ],
        [LangTextType.B0722]: [
            `守株待兔`,
            `Standby`,
            `Pronto`,
        ],
        [LangTextType.B0723]: [
            `正常`,
            `Normal`,
            `Normal`,
        ],
        [LangTextType.B0724]: [
            `A.I.模式已切换`,
            `A.I. Mode switched.`,
            `Modo da I.A. trocado`,
        ],
        [LangTextType.B0725]: [
            `多人合作明战`,
            `Coop Std`,
            `Coop Pdr`,
        ],
        [LangTextType.B0726]: [
            `多人合作雾战`,
            `Coop FoW`,
            `Coop NdG`,
        ],
        [LangTextType.B0727]: [
            `背景`,
            `Background`,
            `Plano de Fundo`,
        ],
        [LangTextType.B0728]: [
            `播放简易对话`,
            `Show Simple Dialogue`,
            `Mostrar um Diálogo Simples`,
        ],
        [LangTextType.B0729]: [
            `显示在下侧`,
            `Show on bottom`,
            `Mostrar no Fundo`,
        ],
        [LangTextType.B0730]: [
            `增加CO能量%`,
            `Add CO Energy (%)`,
            `Adicionar Energia (%)`,
        ],
        [LangTextType.B0731]: [
            `增加部队HP`,
            `Add Unit's HP`,
            `Adicionar HP à Unidade`,
        ],
        [LangTextType.B0732]: [
            `增加部队燃料%`,
            `Add Unit's Fuel (%)`,
            `Adicionar Combustível à Unidade (%)`,
        ],
        [LangTextType.B0733]: [
            `增加部队主弹药%`,
            `Add Unit's Pri.Ammo (%)`,
            `Adicionar Munição Pri. à Unidade (%)`,
        ],
        [LangTextType.B0734]: [
            `生效范围`,
            `Effective Radius`,
            `Raio de efeito`,
        ],
        [LangTextType.B0735]: [
            `影响自身`,
            `Affect Self`,
            `Afeta a si`,
        ],
        [LangTextType.B0736]: [
            `影响队友`,
            `Affect Ally`,
            `Afeta Aliado`,
        ],
        [LangTextType.B0737]: [
            `影响敌人`,
            `Affect Enemy`,
            `Afeta Inimigo`,
        ],
        [LangTextType.B0738]: [
            `增加资金`,
            `Add Fund`,
            `Adicionar Dinheiro`,
        ],
        [LangTextType.B0739]: [
            `优先级`,
            `Priority`,
            `Prioridade`,
        ],
        [LangTextType.B0740]: [
            `调整路桥造型`,
            `Adjust Roads & Bridges`,
            `Ajustar Ruas e Pontes`,
        ],
        [LangTextType.B0741]: [
            `调整等离子`,
            `Adjust Plasmas`,
            `Ajustar Plasmas`,
        ],
        [LangTextType.B0742]: [
            `上`,
            `Up`,
            `Cima`,
        ],
        [LangTextType.B0743]: [
            `右`,
            `Right`,
            `Direita`,
        ],
        [LangTextType.B0744]: [
            `下`,
            `Down`,
            `Baixo`,
        ],
        [LangTextType.B0745]: [
            `左`,
            `Left`,
            `Esquerda`,
        ],
        [LangTextType.B0746]: [
            `最大攻击目标数`,
            `Max. Targets`,
            `Máx. de Alvos`,
        ],
        [LangTextType.B0747]: [
            `部队不透明度`,
            `Unit Opacity`,
            `Opacidade da Unidade`,
        ],
        [LangTextType.B0748]: [
            `深克隆`,
            `Deep Clone`,
            `Clone Profundo`,
        ],
        [LangTextType.B0749]: [
            `已被引用`,
            `Referenced`,
            `Referenciado`,
        ],
        [LangTextType.B0750]: [
            `播放BGM`,
            `Play BGM`,
            `Tocar Musica`,
        ],
        [LangTextType.B0751]: [
            `指定BGM`,
            `Specific BGM`,
            `Música Específica`,
        ],
        [LangTextType.B0752]: [
            `修改玩家的资金`,
            `Modify Players' Fund`,
            `Modificar Reservas do Jogador`,
        ],
        [LangTextType.B0753]: [
            `最终值`,
            `Final Value`,
            `Valor Final`,
        ],
        [LangTextType.B0754]: [
            `增减值`,
            `Delta Value`,
            `Valor do Delta`,
        ],
        [LangTextType.B0755]: [
            `倍率`,
            `Multiplier`,
            `Multiplicador`,
        ],
        [LangTextType.B0756]: [
            `修改玩家的CO能量`,
            `Modify Players' CO Energy`,
            `Modificar a Energia do Comandante do Jogador`,
        ],
        [LangTextType.B0757]: [
            `显示所有区域`,
            `Show All Locations`,
            `Mostrar Todas Localidades`,
        ],
        [LangTextType.B0758]: [
            `隐藏所有区域`,
            `Hide All Locations`,
            `Ocultar Todas Localidades`,
        ],
        [LangTextType.B0759]: [
            `添加区域地块`,
            `Add To Location`,
            `Adicionar a Localidade`,
        ],
        [LangTextType.B0760]: [
            `删除区域地块`,
            `Del From Location`,
            `Del da Localidade`,
        ],
        [LangTextType.B0761]: [
            `全选`,
            `Select All`,
            `Selecionar Tudo`,
        ],
        [LangTextType.B0762]: [
            `全不选`,
            `Unselect All`,
            `Deselecionar Tudo`,
        ],
        [LangTextType.B0763]: [
            `任意部队`,
            `Any Unit`,
            `Qualquer Unidade`,
        ],
        [LangTextType.B0764]: [
            `区域`,
            `Location`,
            `Localidade`,
        ],
        [LangTextType.B0765]: [
            `任意坐标`,
            `Any Coordinate`,
            `Qualquer Coordenada`,
        ],
        [LangTextType.B0766]: [
            `任意玩家`,
            `Any Player`,
            `Qualquer Jogador`,
        ],
        [LangTextType.B0767]: [
            `==`,
            `==`,
            `==`,
        ],
        [LangTextType.B0768]: [
            `!=`,
            `!=`,
            `!=`,
        ],
        [LangTextType.B0769]: [
            `>`,
            `>`,
            `>`,
        ],
        [LangTextType.B0770]: [
            `<=`,
            `<=`,
            `<=`,
        ],
        [LangTextType.B0771]: [
            `<`,
            `<`,
            `<`,
        ],
        [LangTextType.B0772]: [
            `>=`,
            `>=`,
            `>=`,
        ],
        [LangTextType.B0773]: [
            `部队数量`,
            `Units Count`,
            `Contagem de Unidades`,
        ],
        [LangTextType.B0774]: [
            `比较符`,
            `Comparator`,
            `Comaprador`,
        ],
        [LangTextType.B0775]: [
            `特定部队数量统计...`,
            `Unit Presence ...`,
            `Presença de Unidade...`,
        ],
        [LangTextType.B0776]: [
            `任意`,
            `Any`,
            `Qaulquer`,
        ],
        [LangTextType.B0777]: [
            `任意地形`,
            `Any Terrain`,
            `Qualquer Terreno`,
        ],
        [LangTextType.B0778]: [
            `地形数量`,
            `Terrains Count`,
            `Contagem de Terrenos`,
        ],
        [LangTextType.B0779]: [
            `特定地形数量统计...`,
            `Terrain Presence ...`,
            `Presença de Terreno...`,
        ],
        [LangTextType.B0780]: [
            `阶段`,
            `Phase`,
            `Fase`,
        ],
        [LangTextType.B0781]: [
            `当前回合与玩家是...`,
            `The Current Turn and Player ...`,
            `Atual Turno e Jogador...`,
        ],
        [LangTextType.B0782]: [
            `回合阶段`,
            `Turn Phase`,
            `Fase do Turno`,
        ],
        [LangTextType.B0783]: [
            `、且`,
            `, and`,
            `, e`,
        ],
        [LangTextType.B0784]: [
            `存活状态`,
            `Playing State`,
            `Estado de Jogo`,
        ],
        [LangTextType.B0785]: [
            `激活中的CO技能类型`,
            `Activating CO Skill Type`,
            `Ativando Tipo de Habilidade do Comandante`,
        ],
        [LangTextType.B0786]: [
            `特定玩家数量统计...`,
            `Player Presence ...`,
            `Presença de Jogador...`,
        ],
        [LangTextType.B0787]: [
            `CO能量百分比`,
            `CO Energy (%)`,
            `Energia do Comandante (%)`,
        ],
        [LangTextType.B0788]: [
            `事件数量`,
            `Number of Events`,
            `Número de Eventos`,
        ],
        [LangTextType.B0789]: [
            `事件触发次数...`,
            `Event Triggered Times ...`,
            `Evento Disparado No Total...`,
        ],
        [LangTextType.B0790]: [
            `当前玩家回合内的触发次数`,
            `Triggered Times in Turn`,
            `Número de Disparos num Turno`,
        ],
        [LangTextType.B0791]: [
            `合计触发次数`,
            `Total Triggered Times`,
            `Número Total de Disparos`,
        ],
        [LangTextType.B0792]: [
            `ID`,
            `ID`,
            `ID`,
        ],
        [LangTextType.B0793]: [
            `地图自动滚动`,
            `Auto Scroll Map`,
            `Mover Mapa Auto.`,
        ],
        [LangTextType.B0794]: [
            `天气与战争迷雾...`,
            `Weather Condition and Fog of War ...`,
            `Condição Climática e Névoa de Guerra...`,
        ],
        [LangTextType.B0795]: [
            `设置战争迷雾`,
            `Set Fog of War`,
            `Colocar Névoa de Guerra`,
        ],
        [LangTextType.B0796]: [
            `强制起雾`,
            `Force FoW`,
            `Forçar NdG`,
        ],
        [LangTextType.B0797]: [
            `强制无雾`,
            `Force No FoW`,
            `Forçar Sem NdG`,
        ],
        [LangTextType.B0798]: [
            `不强制`,
            `No Army`,
            `Sem Exército`,
        ],
        [LangTextType.B0799]: [
            `自定义计数器ID`,
            `Custom Counter ID`,
            `ID do Contador Custom`,
        ],
        [LangTextType.B0800]: [
            `设置自定义计数器`,
            `Set Custom Counters`,
            `Colocar Contadores Custom`,
        ],
        [LangTextType.B0801]: [
            `计数器数量`,
            `Number of Counters`,
            `Número de Contadores`,
        ],
        [LangTextType.B0802]: [
            `自定义计数器...`,
            `Custom Counters ...`,
            `Contadores Custom...`,
        ],
        [LangTextType.B0803]: [
            `值`,
            `Value`,
            `Valor`,
        ],
        [LangTextType.B0804]: [
            `地图评分`,
            `Map Rating`,
            `Avaliação do Mapa`,
        ],
        [LangTextType.B0805]: [
            `类型`,
            `Type`,
            `Tipo`,
        ],
        [LangTextType.B0806]: [
            `设置部队状态`,
            `Set Units' State`,
            `Definir Estado das Unidades`,
        ],
        [LangTextType.B0807]: [
            `真实HP`,
            `Real HP`,
            `Real HP`,
        ],
        [LangTextType.B0808]: [
            `摧毁`,
            `Destroy`,
            `Destruir`,
        ],
        [LangTextType.B0809]: [
            `CO能量值`,
            `CO Energy`,
            `Energia do Comandante`,
        ],
        [LangTextType.B0810]: [
            `修改玩家状态`,
            `Set Players' State`,
            `Definir Estado dos Jogadores`,
        ],
        [LangTextType.B0811]: [
            `装载部队`,
            `Load a Unit`,
            `Embarcar Unidade`,
        ],
        [LangTextType.B0812]: [
            `自由模式明战`,
            `Free Std`,
            `Livre Pdr`,
        ],
        [LangTextType.B0813]: [
            `自由模式雾战`,
            `Free FoW`,
            `Livre NdG`,
        ],
        [LangTextType.B0814]: [
            `房间ID`,
            `Room ID`,
            `ID da Sala`,
        ],
        [LangTextType.B0815]: [
            `挑战模式中AI的CO`,
            `CO for A.I. in War Room`,
            `Comandante para I.A. no modo Desafios`,
        ],
        [LangTextType.B0816]: [
            `挑战模式中由AI控制`,
            `Controlled by A.I. in War Room`,
            `Controlado pela I.A. no modo Desafios`,
        ],
        [LangTextType.B0817]: [
            `挑战模式雾战`,
            `War Room FoW`,
            `Desafio NdG`,
        ],
        [LangTextType.B0818]: [
            `挑战`,
            `WR`,
            `Des`,
        ],
        [LangTextType.B0819]: [
            `挑战模式总积分`,
            `War Room Overall Score`,
            `Pontuação Total nos Desafios`,
        ],
        [LangTextType.B0820]: [
            `总排名`,
            `Overall Rank`,
            `Classificação Geral`,
        ],
        [LangTextType.B0821]: [
            `地图ID`,
            `Map ID`,
            `ID do Mapa`,
        ],
        [LangTextType.B0822]: [
            `我的积分`,
            `My Score`,
            `M̀inha Pontuação`,
        ],
        [LangTextType.B0823]: [
            `新增规则`,
            `Add Rules`,
            `Adicionar Regras`,
        ],
        [LangTextType.B0824]: [
            `作为新规则提交`,
            `Submit as a New Rule`,
            `Enviar como Nova Regra`,
        ],
        [LangTextType.B0825]: [
            `设置地形类型`,
            `Set Terrains' Type`,
            `Definir o Tipo dos Terrenos`,
        ],
        [LangTextType.B0826]: [
            `摧毁部队`,
            `Destroy Units`,
            `Destruir Unidades`,
        ],
        [LangTextType.B0827]: [
            `不透明度设置`,
            `Opacity Settings`,
            `Configurações de Opacidade`,
        ],
        [LangTextType.B0828]: [
            `伤害计算器`,
            `Damage Calculator`,
            `Calculadora de Dano`,
        ],
        [LangTextType.B0829]: [
            `无技能`,
            `No Skill`,
            `Sem Habilidade`,
        ],
        [LangTextType.B0830]: [
            `武器`,
            `Weapon`,
            `Arma`,
        ],
        [LangTextType.B0831]: [
            `进攻方`,
            `Attacker`,
            `Atacante`,
        ],
        [LangTextType.B0832]: [
            `防守方`,
            `Defender`,
            `Atacado`,
        ],
        [LangTextType.B0833]: [
            `指挥塔数量`,
            `Towers`,
            `Torres`,
        ],
        [LangTextType.B0834]: [
            `城市数量`,
            `Cities`,
            `Cidades`,
        ],
        [LangTextType.B0835]: [
            `交换攻防双方`,
            `Switch Attacker & Defender`,
            `Trocar Atacante e Atacado`,
        ],
        [LangTextType.B0836]: [
            `无法进攻`,
            `Can't attack.`,
            `Não pode atacar`,
        ],
        [LangTextType.B0837]: [
            `反击`,
            `Counter`,
            `Contra-ataque`,
        ],
        [LangTextType.B0838]: [
            `删除信息`,
            `Delete Message`,
            `Apagar Mensagem`,
        ],
        [LangTextType.B0839]: [
            `美术设计`,
            `Art Designer`,
            `Artista`,
        ],
        [LangTextType.B0840]: [
            `数值设计`,
            `Numerical Setup`,
            `Configuração Numérica`,
        ],
        [LangTextType.B0841]: [
            `处理他人求和`,
            `Handle Draw`,
            `Conceder Empate`,
        ],
        [LangTextType.B0842]: [
            `回合数限制`,
            `Turns Limit`,
            `Limite de Turnos`,
        ],
        [LangTextType.B0843]: [
            `修改可用性`,
            `Modify Availability`,
            `Modificar Disponibilidade`,
        ],
        [LangTextType.B0844]: [
            `保存`,
            `Save`,
            `Salvar`,
        ],
        [LangTextType.B0845]: [
            `读取`,
            `Load`,
            `Carregar`,
        ],
        [LangTextType.B0846]: [
            `停顿时间`,
            `Pause Time`,
            `Tempo de Pausa`,
        ],
        [LangTextType.B0847]: [
            `高亮`,
            `Highlight`,
            `Marcar`,
        ],
        [LangTextType.B0848]: [
            `已高亮`,
            `is Highlighted`,
            `está Marcado`,
        ],
        [LangTextType.B0849]: [
            `未高亮`,
            `is Not Highlighted`,
            `não está Marcado`,
        ],
        [LangTextType.B0850]: [
            `修改基底`,
            `Modify Base`,
            `Modificar Base`,
        ],
        [LangTextType.B0851]: [
            `修改装饰物`,
            `Modify Decoration`,
            `Modificar Decoração`,
        ],
        [LangTextType.B0852]: [
            `修改物体`,
            `Modify Object`,
            `Modificar Objeto`,
        ],
        [LangTextType.B0853]: [
            `经典版(毁灭之日)`,
            `Classic Version (AW DoR)`,
            `Versão Clássica (AW DoR)`,
        ],
        [LangTextType.B0854]: [
            `实验版(老三代平衡版)`,
            `Experimental Version (AW 1/2/DS rebalanced)`,
            `Versão Experimental (AW 1/2/DS rebalanceados)`,
        ],
        [LangTextType.B0855]: [
            `当前宽高及格子数`,
            `Current W/H/Grids`,
            `A/L/Grids atuais`,
            // Don't know what's this.
        ],
        [LangTextType.B0856]: [
            `新的宽高及格子数`,
            `New W/H/Grids`,
            `A/L/Grids novos`,
        ],
        [LangTextType.B0857]: [
            `顶部增减行数`,
            `Add/Delete Rows to the Top`,
            `Por/Tirar Fileiras ao Topo`,
        ],
        [LangTextType.B0858]: [
            `底部增减行数`,
            `Add/Delete Rows to the Bottom`,
            `Por/Tirar Fileiras ao Fundo`,
        ],
        [LangTextType.B0859]: [
            `左方增减行数`,
            `Add/Delete Columns to the Left`,
            `Por/Tirar Colunas à Esquerda`,
        ],
        [LangTextType.B0860]: [
            `右方增减行数`,
            `Add/Delete Columns to the Right`,
            `Por/Tirar Colunas à Direita`,
        ],
        [LangTextType.B0861]: [
            `设置地形状态`,
            `Set Terrains' State`,
            `Definir o Estado dos Terrenos`,
        ],
        [LangTextType.B0862]: [
            `填充地形(轴对称)`,
            `Fill Terrains (Mirroring)`,
            `Preencher terrenos (Espelhando)`,
        ],
        [LangTextType.B0863]: [
            `填充地形(旋转对称)`,
            `Fill Terrains (Rotational)`,
            `Preencher terrenos (Rotacionando)`,
        ],
        [LangTextType.B0864]: [
            `从上到下`,
            `From Top To Bottom`,
            `De cima a baixo`,
        ],
        [LangTextType.B0865]: [
            `从下到上`,
            `From Bottom to Top`,
            `De Baixo a Cima`,
        ],
        [LangTextType.B0866]: [
            `从左到右`,
            `From Left To Right`,
            `Da Esquerda a direita`,
        ],
        [LangTextType.B0867]: [
            `从右到左`,
            `From Right To Left`,
            `Da Direita a Esquerda`,
        ],
        [LangTextType.B0868]: [
            `从左上到右下`,
            `From TL To BR`,
            `Do TE a BD`,
        ],
        [LangTextType.B0869]: [
            `从右下到左上`,
            `From BR To TL`,
            `De BD a TE`,
        ],
        [LangTextType.B0870]: [
            `从右上到左下`,
            `From TR to BL`,
            `Do TD a BE`,
        ],
        [LangTextType.B0871]: [
            `从左下到右上`,
            `From BL to TR`,
            `De BE a TD`,
        ],
        [LangTextType.B0872]: [
            `观战`,
            `Spectate`,
            `Assistir`,
        ],
        [LangTextType.B0873]: [
            `游戏观战者`,
            `Game Spectators`,
            `Espectadores da Partida`,
        ],
        [LangTextType.B0874]: [
            `我的观战者`,
            `My Spectators`,
            `Meus Espectadores`,
        ],
        [LangTextType.B0875]: [
            `我收到的观战请求`,
            `Incoming Requests`,
            `Solicitacões recebidas`,
        ],
        [LangTextType.B0876]: [
            `统计`,
            `Statistics`,
            `Estatísticas`,
        ],
        [LangTextType.B0877]: [
            `总局数`,
            `Games`,
            `Partidas`,
        ],
        [LangTextType.B0878]: [
            `游戏管理`,
            `Game Management`,
            `Gerenciamento de Partidas`,
        ],
        [LangTextType.B0879]: [
            `清除单人模式榜单`,
            `Delete All SP Rank`,
            `Apagar Toda Classificação SP`,
        ],
        [LangTextType.B0880]: [
            `管理广播信息`,
            `Manage Broadcast`,
            `Gerenciar Transmissão`,
        ],
        [LangTextType.B0881]: [
            `广播信息`,
            `Broadcast`,
            `Transmissão`,
        ],
        [LangTextType.B0882]: [
            `开始时间`,
            `Start Time`,
            `Início`,
        ],
        [LangTextType.B0883]: [
            `持续时间`,
            `Duration`,
            `Duração`,
        ],
        [LangTextType.B0884]: [
            `时`,
            `Hour`,
            `Hora`,
        ],
        [LangTextType.B0885]: [
            `分`,
            `Minute`,
            `Minuto`,
        ],
        [LangTextType.B0886]: [
            `秒`,
            `Second`,
            `Segundo`,
        ],
        [LangTextType.B0887]: [
            `停止持续性动作`,
            `Stop Persistent Event Actions`,
            `Parar Ações Persistentes de Eventos`,
        ],
        [LangTextType.B0888]: [
            `持续性显示文本`,
            `Persistently Show Text`,
            `Exibir Texto Persistentemente`,
        ],
        [LangTextType.B0889]: [
            `动作ID`,
            `Action ID`,
            `ID da Ação`,
        ],
        [LangTextType.B0890]: [
            `自动`,
            `Auto`,
            `Auto`,
        ],
        [LangTextType.B0891]: [
            `视野`,
            `POV`,
            `Perspectiva`,
        ],
        [LangTextType.B0892]: [
            `地图审核`,
            `Map Review`,
            `Avaliação do Mapa`,
        ],
        [LangTextType.B0893]: [
            `地图描述`,
            `Map Description`,
            `Descrição do Mapa`,
        ],
        [LangTextType.B0894]: [
            `无描述`,
            `No Description`,
            `Sem Descrição`,
        ],
        [LangTextType.B0895]: [
            `禁用部队`,
            `Banned Units`,
            `Unidades Banidas`,
        ],
        [LangTextType.B0896]: [
            `无可用部队`,
            `No available units`,
            `Não há unidades disponíveis`,
        ],
        [LangTextType.B0897]: [
            `可使用CO主动技`,
            `Can Use CO Power`,
            `Pode Utilizar o Poder do Comandante`,
        ],
        [LangTextType.B0898]: [
            `选择CO`,
            `Choose COs`,
            `Escolher COs`,
        ],
        [LangTextType.B0899]: [
            `地形`,
            `Terrains`,
            `Terrenos`,
        ],
        [LangTextType.B0900]: [
            `游戏数据`,
            `Game Chart`,
            `Dados e Tabelas`,
        ],
        [LangTextType.B0901]: [
            `生效中的持续性动作...`,
            `Ongoing Persistent Actions ...`,
            `Ações Persistentes em Andamento...`,
        ],
        [LangTextType.B0902]: [
            `动作数量`,
            `Number of Actions`,
            `Número de Ações`,
        ],
        [LangTextType.B0903]: [
            `持续性修改玩家属性`,
            `Persistently Modify Players' Attribute`,
            `Persistentemente Modificar Atributos dos Jogadores`,
        ],
        [LangTextType.B0904]: [
            `排名`,
            `Rank`,
            `Nível`,
        ],
        [LangTextType.B0905]: [
            `记录`,
            `Record`,
            `Recorde`,
        ],
        [LangTextType.B0906]: [
            `我的挑战模式记录`,
            `My War Room Records`,
            `Meus Recordes em Desafios`,
        ],
        [LangTextType.B0907]: [
            `历史最高分`,
            `High Score`,
            `Maior Pontuação`,
        ],
        [LangTextType.B0908]: [
            `快速设置`,
            `Quick Settings`,
            `Configurações rápidas`,
        ],
        [LangTextType.B0909]: [
            `难度`,
            `Difficulty`,
            `Dificuldade`,
        ],
        [LangTextType.B0910]: [
            `地形属性表`,
            `Tiles Info`,
            `Informação dos Terrenos`,
        ],
        [LangTextType.B0911]: [
            `历史`,
            `History`,
            `História`,
        ],
        [LangTextType.B0912]: [
            `非排位赛`,
            `Unranked`,
            `Não ranqueada`,
        ],
        [LangTextType.B0913]: [
            `选择`,
            `Selection`,
            `Seleção`,
        ],
        [LangTextType.B0914]: [
            `标记`,
            `Mark`,
            `Marcar`,
        ],
        [LangTextType.B0915]: [
            `取消标记`,
            `Unmark`,
            `Desmarcar`,
        ],
        [LangTextType.B0916]: [
            `禁止再次进入房间`,
            `No re-entry`,
            `Sem reentrada`,
        ],
        [LangTextType.B0917]: [
            `上次活动时间`,
            `Last Activity`,
            `Última atividade`,
        ],
        [LangTextType.B0918]: [
            `回合轮转提醒`,
            `Turn Notifications`,
            `Notificações de Turno`,
        ],
        [LangTextType.B0919]: [
            `Ban/Pick提醒`,
            `Ban/Pick Notifications`,
            `Notificações para Banir/Escolher Comandantes`,
        ],
        [LangTextType.B0920]: [
            `房间满员提醒`,
            `Room Notifications`,
            `Notificações de Salas`,
        ],
        [LangTextType.B0921]: [
            `保存并提审`,
            `Save & Submit for Review`,
            `Salvar e Submeter à Análise`,
        ],
        [LangTextType.B0922]: [
            `玩家数量`,
            `Player Count`,
            `Contagem de jogadores`,
        ],
        [LangTextType.B0923]: [
            `悔棋`,
            `Undo`,
            `Desfazer`,
        ],
        [LangTextType.B0924]: [
            `重做`,
            `Redo`,
            `Refazer`,
        ],
        [LangTextType.B0925]: [
            `在回合中`,
            `is in turn`,
            `no turno atual`,
        ],
        [LangTextType.B0926]: [
            `不在回合中`,
            `is not in turn`,
            `não está no turno atual`,
        ],
        [LangTextType.B0927]: [
            `已下潜`,
            `is dived`,
            `está submerso`,
        ],
        [LangTextType.B0928]: [
            `未下潜`,
            `is not dived`,
            `não está submerso`,
        ],
        [LangTextType.B0929]: [
            `玩家主动操作数...`,
            `Players' Manual Actions Statistics...`,
            `Estatísticas das Ações Manuais do Jogador...`,
        ],
        [LangTextType.B0930]: [
            `最近回合数`,
            `Recent Turns`,
            `Turnos Recenter`,
        ],
        [LangTextType.B0931]: [
            `全部删除`,
            `Delete All`,
            `Apagar Tudo`,
        ],
        [LangTextType.B0932]: [
            `地图缩放`,
            `Zooming`,
            `Amplificando`,
        ],
        [LangTextType.B0933]: [
            `部队操作`,
            `Unit Deployment`,
            `Criação de Unidades`,
        ],
        [LangTextType.B0934]: [
            `部队HP`,
            `Unit HP`,
            `HP da Unidade`,
        ],
        [LangTextType.B0935]: [
            `结束回合`,
            `Ending a Turn`,
            `Encerrando um Turno`,
        ],
        [LangTextType.B0936]: [
            `近战攻击`,
            `Direct Attacks`,
            `Ataques Diretos`,
        ],
        [LangTextType.B0937]: [
            `部队升级`,
            `Leveling up Units`,
            `Aumentando o nível das Unidades`,
        ],
        [LangTextType.B0938]: [
            `地形属性`,
            `About Terrain Info`,
            `Sobre as Info. do Terreno`,
        ],
        [LangTextType.B0939]: [
            `部队属性`,
            `About Unit Info`,
            `Sobre as Info. da Unidade`,
        ],
        [LangTextType.B0940]: [
            `弹药`,
            `Ammunition`,
            `Munição`,
        ],
        [LangTextType.B0941]: [
            `燃料`,
            `Fuel`,
            `Combustível`,
        ],
        [LangTextType.B0942]: [
            `远程攻击`,
            `Indirect Attacks`,
            `Ataques Indiretos`,
        ],
        [LangTextType.B0943]: [
            `攻击范围`,
            `Attack Range`,
            `Alcance do Ataque`,
        ],
        [LangTextType.B0944]: [
            `地形效果`,
            `Terrain Effects`,
            `Efeitos do Terreno`,
        ],
        [LangTextType.B0945]: [
            `部队属性表`,
            `Unit Chart`,
            `Tabela de Unidades`,
        ],
        [LangTextType.B0946]: [
            `胜负条件`,
            `Terms`,
            `Termos`,
        ],
        [LangTextType.B0947]: [
            `部队合流`,
            `Joining`,
            `Entrando`,
        ],
        [LangTextType.B0948]: [
            `雾战`,
            `Fog of War`,
            `Névoa da Guerra`,
        ],
        [LangTextType.B0949]: [
            `视野加成`,
            `Vision on Montain`,
            `Visão sobre Montanha`,
        ],
        [LangTextType.B0950]: [
            `意外遭遇`,
            `Ambushes`,
            `Emboscadas`,
        ],
        [LangTextType.B0951]: [
            `照明车`,
            `Flare Rockets`,
            `Foguetes Sinalizadores`,
        ],
        [LangTextType.B0952]: [
            `建筑占领`,
            `Capturing`,
            `Capturando`,
        ],
        [LangTextType.B0953]: [
            `资金`,
            `Funds`,
            `Recursos`,
        ],
        [LangTextType.B0954]: [
            `生产部队`,
            `Production`,
            `Produção`,
        ],
        [LangTextType.B0955]: [
            `删除部队`,
            `Deleting Units`,
            `Deletando unidades`,
        ],
        [LangTextType.B0956]: [
            `部队维修`,
            `Recovery`,
            `Recuperação`,
        ],
        [LangTextType.B0957]: [
            `建筑视野`,
            `Base Vision Range`,
            `Alcance Base da Visão`,
        ],
        [LangTextType.B0958]: [
            `装载部队`,
            `Loading Units`,
            `Embarcando Unidades`,
        ],
        [LangTextType.B0959]: [
            `运载部队`,
            `Carrying Units`,
            `Carregando Unidades`,
        ],
        [LangTextType.B0960]: [
            `运输部队`,
            `Transport Units`,
            `Unidades de Transporte`,
        ],
        [LangTextType.B0961]: [
            `工程车`,
            `Rigs`,
            `VBTPs`,
        ],
        [LangTextType.B0962]: [
            `建筑建造`,
            `Constructing`,
            `Construíndo`,
        ],
        [LangTextType.B0963]: [
            `部队补给`,
            `Resupplying`,
            `Abastecendo`,
        ],
        [LangTextType.B0964]: [
            `建造材料`,
            `Material`,
            `Material`,
        ],
        [LangTextType.B0965]: [
            `下潜和上浮`,
            `Diving and Surfacing`,
            `Mergulhando e Emergindo`,
        ],
        [LangTextType.B0966]: [
            `从航母生产部队`,
            `Carrier Unit Production`,
            `Produção de Unidades em Porta-Aviões`,
        ],
        [LangTextType.B0967]: [
            `雨天`,
            `Rain`,
            `Chuava`,
        ],
        [LangTextType.B0968]: [
            `雪天`,
            `Snow`,
            `Nevasca`,
        ],
        [LangTextType.B0969]: [
            `沙尘暴`,
            `Sandstorms`,
            `Tempestades de Areia`,
        ],
        [LangTextType.B0970]: [
            `CO Zone`,
            `CO Zone`,
            `Zona do Comandante`,
        ],
        [LangTextType.B0971]: [
            `CO能量`,
            `CO Energy Gauge`,
            `Medidor de Energia do Comandante`,
        ],
        [LangTextType.B0972]: [
            `CO战技`,
            `CO Power`,
            `Poder do Comandante`,
        ],
        [LangTextType.B0973]: [
            `CO部队`,
            `CO Units`,
            `Unidades dos Comandantes`,
        ],
        [LangTextType.B0974]: [
            `摧毁CO部队`,
            `Destruction of COU`,
            `Destruição da unidade do Comandante`,
        ],
        [LangTextType.B0975]: [
            `存档与读档`,
            `Saving and Loading`,
            `Salvando e Carregando`,
        ],
        [LangTextType.B0976]: [
            `退出战局`,
            `Quit`,
            `Encerrar`,
        ],
        [LangTextType.B0977]: [
            `数据统计`,
            `Status`,
            `Status`,
        ],
        [LangTextType.B0978]: [
            `教程`,
            `Tutorial`,
            `Tutorial`,
        ],
        [LangTextType.B0979]: [
            `跳过回合`,
            `Skip a Turn`,
            `Pular um Turno`,
        ],
        [LangTextType.B0980]: [
            `将跳过一个回合`,
            `is skipping a turn`,
            `está pulando um turno`,
        ],
        [LangTextType.B0981]: [
            `将不会跳过一个回合`,
            `is not skipping a turn`,
            `Não está pulando um turno`,
        ],
        [LangTextType.B0982]: [
            `游客登陆`,
            `Login as Guest`,
            `Acessar como um Convidado`,
        ],
        [LangTextType.B0983]: [
            `拥有者`,
            `Owner`,
            `Proprietário`,
        ],
        [LangTextType.B0984]: [
            `图像设置`,
            `Graphic Settings`,
            `Configurações Gráficas`,
        ],
        [LangTextType.B0985]: [
            `天气动画`,
            `Weather Animation`,
            `Animação do Clima`,
        ],
        [LangTextType.B0986]: [
            `动作数限制`,
            `Actions Limit`,
            `Limite de Ações`,
        ],
        [LangTextType.B0987]: [
            `回合与动作数限制`,
            `Max. Turns & Actions`,
            `Máx. de Turnos e Ações`,
        ],
        [LangTextType.B0988]: [
            `标准计时器`,
            `Regular Timer`,
            `Cronômetro padrão`,
        ],
        [LangTextType.B0989]: [
            `增量计时器`,
            `Incremental Timer`,
            `Cronômetro Incremental`,
        ],
        [LangTextType.B0990]: [
            `计时器参数`,
            `Timer Params`,
            `Param. de Tempo`,
        ],
        [LangTextType.B0991]: [
            `回合增量时间`,
            `Per turn time increment`,
            `Incremento de tempo por turno`,
        ],
        [LangTextType.B0992]: [
            `CO BGM 设置`,
            `CO BGM Settings`,
            `Configurações de Música`,
        ],

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        [LangTextType.Tile0000]: [
            `平原`,
            `Plain`,
            `Planície`,
        ],
        [LangTextType.Tile0001]: [
            `河流`,
            `River`,
            `Rio`,
        ],
        [LangTextType.Tile0002]: [
            `海洋`,
            `Sea`,
            `Mar`,
        ],
        [LangTextType.Tile0003]: [
            `沙滩`,
            `Beach`,
            `Praia`,
        ],
        [LangTextType.Tile0004]: [
            `道路`,
            `Road`,
            `Estrada`,
        ],
        [LangTextType.Tile0005]: [
            `桥梁(平原)`,
            `BridgeOnPlain`,
            `PonteSobrePlanície`,
        ],
        [LangTextType.Tile0006]: [
            `桥梁(河)`,
            `BridgeOnRiver`,
            `PonteSobreRio`,
        ],
        [LangTextType.Tile0007]: [
            `桥梁(沙滩)`,
            `BridgeOnBeach`,
            `PonteSobrePraia`,
        ],
        [LangTextType.Tile0008]: [
            `桥梁(海)`,
            `BridgeOnSea`,
            `PonteSobreMar`,
        ],
        [LangTextType.Tile0009]: [
            `森林`,
            `Woods`,
            `Floresta`,
        ],
        [LangTextType.Tile0010]: [
            `高山`,
            `Mountain`,
            `Montanha`,
        ],
        [LangTextType.Tile0011]: [
            `荒野`,
            `Wasteland`,
            `Caatinga`,
        ],
        [LangTextType.Tile0012]: [
            `废墟`,
            `Ruins`,
            `Ruinas`,
        ],
        [LangTextType.Tile0013]: [
            `火堆`,
            `Fire`,
            `Fogo`,
        ],
        [LangTextType.Tile0014]: [
            `巨浪`,
            `RoughSea`,
            `MarRevolto`,
        ],
        [LangTextType.Tile0015]: [
            `迷雾(海)`,
            `MistOnSea`,
            `NeblinaSobreMar`,
        ],
        [LangTextType.Tile0016]: [
            `礁石`,
            `Reef`,
            `Arrecife`,
        ],
        [LangTextType.Tile0017]: [
            `等离子`,
            `Plasma`,
            `Plasma`,
        ],
        [LangTextType.Tile0018]: [
            `超级等离子`,
            `SuperPlasma`,
            `SuperPlasma`,
        ],
        [LangTextType.Tile0019]: [
            `陨石`,
            `Meteor`,
            `Meteoro`,
        ],
        [LangTextType.Tile0020]: [
            `导弹井`,
            `Silo`,
            `Silo`,
        ],
        [LangTextType.Tile0021]: [
            `空导弹井`,
            `EmptySilo`,
            `SiloVazio`,
        ],
        [LangTextType.Tile0022]: [
            `指挥部`,
            `Headquarters`,
            `QuartelGeneral`,
        ],
        [LangTextType.Tile0023]: [
            `城市`,
            `City`,
            `Cidade`,
        ],
        [LangTextType.Tile0024]: [
            `指挥塔`,
            `CommandTower`,
            `TorreDeComando`,
        ],
        [LangTextType.Tile0025]: [
            `雷达`,
            `Radar`,
            `Radar`,
        ],
        [LangTextType.Tile0026]: [
            `工厂`,
            `Factory`,
            `Fábrica`,
        ],
        [LangTextType.Tile0027]: [
            `机场`,
            `Airport`,
            `Aeroporto`,
        ],
        [LangTextType.Tile0028]: [
            `海港`,
            `Seaport`,
            `Porto`,
        ],
        [LangTextType.Tile0029]: [
            `临时机场`,
            `TempAirport`,
            `AeroportoTemp`,
        ],
        [LangTextType.Tile0030]: [
            `临时海港`,
            `TempSeaport`,
            `PortoTemp`,
        ],
        [LangTextType.Tile0031]: [
            `迷雾(平原)`,
            `MistOnPlain`,
            `NeblinaSobrePlanície`,
        ],
        [LangTextType.Tile0032]: [
            `迷雾(河)`,
            `MistOnRiver`,
            `NeblinaSobreRio`,
        ],
        [LangTextType.Tile0033]: [
            `迷雾(沙滩)`,
            `MistOnBeach`,
            `NeblinaSobrePraia`,
        ],
        [LangTextType.Tile0034]: [
            `水晶`,
            `Crystal`,
            `Cristal`,
        ],
        [LangTextType.Tile0035]: [
            `神秘水晶`,
            `Myst.Crystal`,
            `CristalMist.`,
        ],
        [LangTextType.Tile0036]: [
            `加农炮(下)`,
            `Cannon(Down)`,
            `Canhão(Baixo)`,
        ],
        [LangTextType.Tile0037]: [
            `神秘加农炮`,
            `Myst.Cannon`,
            `CanhãoMist.`,
        ],
        [LangTextType.Tile0038]: [
            `激光炮`,
            `LaserTurret`,
            `TorreDeLaser`,
        ],
        [LangTextType.Tile0039]: [
            `神秘激光炮`,
            `Myst.LaserTurret`,
            `TorreDeLaserMist.`,
        ],
        [LangTextType.Tile0040]: [
            `管道接口`,
            `Joint`,
            `Junta`,
        ],
        [LangTextType.Tile0041]: [
            `加农炮(左)`,
            `Cannon(Left)`,
            `Canhão(Esquerda)`,
        ],
        [LangTextType.Tile0042]: [
            `加农炮(右)`,
            `Cannon(Right)`,
            `Canhão(Direita)`,
        ],
        [LangTextType.Tile0043]: [
            `加农炮(上)`,
            `Cannon(Up)`,
            `Canhão(Cima)`,
        ],
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        [LangTextType.TileObject0000]: [
            `无`,
            `None`,
            `Nenhum`,
        ],
        [LangTextType.TileObject0001]: [
            `道路`,
            `Road`,
            `Estrada`,
        ],
        [LangTextType.TileObject0002]: [
            `桥梁`,
            `Bridge`,
            `Ponte`,
        ],
        [LangTextType.TileObject0003]: [
            `森林`,
            `Woods`,
            `Floresta`,
        ],
        [LangTextType.TileObject0004]: [
            `高山`,
            `Mountain`,
            `Montanha`,
        ],
        [LangTextType.TileObject0005]: [
            `荒野`,
            `Wasteland`,
            `Caatinga`,
        ],
        [LangTextType.TileObject0006]: [
            `废墟`,
            `Ruins`,
            `Ruinas`,
        ],
        [LangTextType.TileObject0007]: [
            `火堆`,
            `Fire`,
            `Fogo`,
        ],
        [LangTextType.TileObject0008]: [
            `巨浪`,
            `RoughSea`,
            `MarRevolto`,
        ],
        [LangTextType.TileObject0009]: [
            `迷雾`,
            `Mist`,
            `Neblina`,
        ],
        [LangTextType.TileObject0010]: [
            `礁石`,
            `Reef`,
            `Arrecife`,
        ],
        [LangTextType.TileObject0011]: [
            `等离子`,
            `Plasma`,
            `Plasma`,
        ],
        [LangTextType.TileObject0012]: [
            `陨石`,
            `Meteor`,
            `Meteoro`,
        ],
        [LangTextType.TileObject0013]: [
            `导弹井`,
            `Silo`,
            `Silo`,
        ],
        [LangTextType.TileObject0014]: [
            `空导弹井`,
            `EmptySilo`,
            `SiloVazio`,
        ],
        [LangTextType.TileObject0015]: [
            `指挥部`,
            `Headquarters`,
            `QuartelGeneral`,
        ],
        [LangTextType.TileObject0016]: [
            `城市`,
            `City`,
            `Cidade`,
        ],
        [LangTextType.TileObject0017]: [
            `指挥塔`,
            `CommandTower`,
            `TorreDeComando`,
        ],
        [LangTextType.TileObject0018]: [
            `雷达`,
            `Radar`,
            `Radar`,
        ],
        [LangTextType.TileObject0019]: [
            `工厂`,
            `Factory`,
            `Fábrica`,
        ],
        [LangTextType.TileObject0020]: [
            `机场`,
            `Airport`,
            `Aeroporto`,
        ],
        [LangTextType.TileObject0021]: [
            `海港`,
            `Seaport`,
            `Porto`,
        ],
        [LangTextType.TileObject0022]: [
            `临时机场`,
            `TempAirport`,
            `AeroportoTemp`,
        ],
        [LangTextType.TileObject0023]: [
            `临时海港`,
            `TempSeaport`,
            `PortoTemp`,
        ],
        [LangTextType.TileObject0024]: [
            `管道`,
            `Pipe`,
            `Cano`,
        ],
        [LangTextType.TileObject0025]: [
            `水晶`,
            `Crystal`,
            `Cristal`,
        ],
        [LangTextType.TileObject0026]: [
            `神秘水晶`,
            `Myst.Crystal`,
            `CristalMist.`,
        ],
        [LangTextType.TileObject0027]: [
            `加农炮(上)`,
            `Cannon(Up)`,
            `Canhão(Cima)`,
        ],
        [LangTextType.TileObject0028]: [
            `加农炮(下)`,
            `Cannon(Down)`,
            `Canhão(Baixo)`,
        ],
        [LangTextType.TileObject0029]: [
            `加农炮(左)`,
            `Cannon(Left)`,
            `Canhão(Esquerda)`,
        ],
        [LangTextType.TileObject0030]: [
            `加农炮(右)`,
            `Cannon(Right)`,
            `Canhão(Direita)`,
        ],
        [LangTextType.TileObject0031]: [
            `神秘加农炮`,
            `Myst.Cannon`,
            `CanhãoMist.`,
        ],
        [LangTextType.TileObject0032]: [
            `激光炮`,
            `LaserTurret`,
            `TorreDeLaser`,
        ],
        [LangTextType.TileObject0033]: [
            `神秘激光炮`,
            `Myst.LaserTurret`,
            `LaserTurrentMist.`,
        ],
        [LangTextType.TileObject0034]: [
            `管道接口`,
            `Joint`,
            `Junta`,
        ],
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        [LangTextType.TileDecoration0000]: [
            `无`,
            `None`,
            `Nenhum`,
        ],
        [LangTextType.TileDecoration0001]: [
            `海岸`,
            `Shore`,
            `Costa`,
        ],
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        [LangTextType.Unit0000]: [
            `步兵`,
            `Infantry`,
            `Infantaria`, ,
        ],
        [LangTextType.Unit0001]: [
            `反坦克兵`,
            `Mech`,
            `Mech`,
        ],
        [LangTextType.Unit0002]: [
            `摩托兵`,
            `Bike`,
            `Moto`,
        ],
        [LangTextType.Unit0003]: [
            `侦察车`,
            `Recon`,
            `Jipe`,
        ],
        [LangTextType.Unit0004]: [
            `照明车`,
            `Flare`,
            `Sinalizador`,
        ],
        [LangTextType.Unit0005]: [
            `防空车`,
            `AntiAir`,
            `AntiAéreo`,
        ],
        [LangTextType.Unit0006]: [
            `轻型坦克`,
            `Tank`,
            `Tanque`,
        ],
        [LangTextType.Unit0007]: [
            `中型坦克`,
            `MediumTank`,
            `TanqueMédio`,
        ],
        [LangTextType.Unit0008]: [
            `弩级坦克`,
            `WarTank`,
            `MegaTanque`,
        ],
        [LangTextType.Unit0009]: [
            `自行火炮`,
            `Artillery`,
            `Artilharia`,
        ],
        [LangTextType.Unit0010]: [
            `反坦克炮`,
            `AntiTank`,
            `AntiTanque`,
        ],
        [LangTextType.Unit0011]: [
            `火箭炮`,
            `Rockets`,
            `Foguetes`,
        ],
        [LangTextType.Unit0012]: [
            `防空导弹车`,
            `Missiles`,
            `Mísseis`,
        ],
        [LangTextType.Unit0013]: [
            `工程车`,
            `Rig`,
            `VBTPs`,
        ],
        [LangTextType.Unit0014]: [
            `战斗机`,
            `Fighter`,
            `Jato`,
        ],
        [LangTextType.Unit0015]: [
            `轰炸机`,
            `Bomber`,
            `Bombardeiro`,
        ],
        [LangTextType.Unit0016]: [
            `攻击机`,
            `Duster`,
            `Monoplano`,
        ],
        [LangTextType.Unit0017]: [
            `武装直升机`,
            `BattleCopter`,
            `HelicópteroC`,
        ],
        [LangTextType.Unit0018]: [
            `运输直升机`,
            `TransportCopter`,
            `HelicópteroT`,
        ],
        [LangTextType.Unit0019]: [
            `舰载机`,
            `Seaplane`,
            `Hidroplano`,
        ],
        [LangTextType.Unit0020]: [
            `战列舰`,
            `Battleship`,
            `Encouraçado`,
        ],
        [LangTextType.Unit0021]: [
            `航母`,
            `Carrier`,
            `Porta-Aviões`,
        ],
        [LangTextType.Unit0022]: [
            `潜艇`,
            `Submarine`,
            `Submarino`,
        ],
        [LangTextType.Unit0023]: [
            `驱逐舰`,
            `Cruiser`,
            `Cruseiro`,
        ],
        [LangTextType.Unit0024]: [
            `登陆舰`,
            `Lander`,
            `Balsa`,
        ],
        [LangTextType.Unit0025]: [
            `炮艇`,
            `Gunboat`,
            `Canhoneira`,
        ],
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        [LangTextType.Bgm0000]: [
            `Wandering Path (Lobby)`,
            `Wandering Path (Lobby)`,
            `Caminho Vagante (Lobby)`,
        ],
        [LangTextType.Bgm0001]: [
            `Design Time (Map Editor)`,
            `Design Time (Map Editor)`,
            `Hora de Projetar (Editor de Mapas)`,
        ],
        [LangTextType.Bgm0002]: [
            `We Will Prevail (Will)`,
            `We Will Prevail (Will)`,
            `Prevaleceremos (Will)`,
        ],
        [LangTextType.Bgm0003]: [
            `Hope Never Dies (Brenner)`,
            `Hope Never Dies (Brenner)`,
            `A Esperança Nunca Morre (Brenner)`,
        ],
        [LangTextType.Bgm0004]: [
            `Lost Memories (Isabella)`,
            `Lost Memories (Isabella)`,
            `Memórias Perdidas (Isabella)`,
        ],
        [LangTextType.Bgm0005]: [
            `Proud Soldier (Gage)`,
            `Proud Soldier (Gage)`,
            `Soldado com Orgulho (Gage)`,
        ],
        [LangTextType.Bgm0006]: [
            `Days of Ruin (No CO)`,
            `Days of Ruin (No CO)`,
            `Dias de Ruína (Sem Comandante)`,
        ],
        [LangTextType.Bgm0007]: [
            `Rutty (??)`,
            `Rutty (??)`,
            `Rutty (??)`,
        ],
        [LangTextType.Bgm0008]: [
            `Supreme Logician (Lin)`,
            `Supreme Logician (Lin)`,
            `Estrategista Suprema (Lin)`,
        ],
        [LangTextType.Bgm0009]: [
            `Goddess of Revenge (Tasha)`,
            `Goddess of Revenge (Tasha)`,
            `Deusa da Vingança (Tasha)`,
        ],
        [LangTextType.Bgm0010]: [
            `Hero of Legend (Forsythe)`,
            `Hero of Legend (Forsythe)`,
            `Herói Lendário (Forsythe)`,
        ],
        [LangTextType.Bgm0011]: [
            `Flight of the Coward (Waylon)`,
            `Flight of the Coward (Waylon)`,
            `A Voo do Covarde (Waylon)`,
        ],
        [LangTextType.Bgm0012]: [
            `Madman's Reign (Greyfield)`,
            `Madman's Reign (Greyfield)`,
            `O Reino do Louco (Greyfield)`,
        ],
        [LangTextType.Bgm0013]: [
            `Cruel Rose (Tabitha)`,
            `Cruel Rose (Tabitha)`,
            `Uma Rosa Cruel (Tabitha)`,
        ],
        [LangTextType.Bgm0014]: [
            `Puppet Master (Caulder)`,
            `Puppet Master (Caulder)`,
            `Mestre dos Fantoches (Caulder)`,
        ],
        [LangTextType.Bgm0015]: [
            `Power Up (Power)`,
            `Power Up (Power)`,
            `Fortalecer (Poder)`,
        ],
        [LangTextType.Bgm0016]: [
            `Hawke's Theme`,
            `Hawke's Theme`,
            `Tema do Hawke`,
        ],
        [LangTextType.Bgm0017]: [
            `The Beast's Theme`,
            `The Beast's Theme`,
            `Tema d'O Fera`,
        ],
        [LangTextType.Bgm0018]: [
            `First Strike (Lobby)`,
            `First Strike (Lobby)`,
            `Primeiro Ataque (Lobby)`,
        ],
        [LangTextType.Bgm0019]: [
            `Destructive Tendencies`,
            `Destructive Tendencies`,
            `Tendências Destrutivas`,
        ],
        [LangTextType.Bgm0020]: [
            `Apocalypse - Chaos Suite`,
            `Apocalypse - Chaos Suite`,
            `Apocalipse - Suite do Caos`,
        ],
        [LangTextType.Bgm0021]: [
            `Stormy Times (Power)`,
            `Stormy Times (Power)`,
            `Tempos Tempestuosos (Poder)`,
        ],
        [LangTextType.Bgm0022]: [
            `Road to War`,
            `Road to War`,
            `Estrada para a Guerra`,
        ],
        [LangTextType.Bgm0023]: [
            `The Way of Sadness`,
            `The Way of Sadness`,
            `O Caminho da Tristeza`,
        ],
        [LangTextType.Bgm0024]: [
            `Battle Ready`,
            `Battle Ready`,
            `Pronto para Batalha`,
        ],
        [LangTextType.Bgm0025]: [
            `Mr. Bear (Penny)`,
            `Mr. Bear (Penny)`,
            `Sr. Urso (Penny)`,
        ],
        [LangTextType.Bgm0026]: [
            `Adder's Theme`,
            `Adder's Theme`,
            `Tema do Adder`,
        ],
        [LangTextType.Bgm0027]: [
            `Flak's Theme`,
            `Flak's Theme`,
            `Tema do Flak`,
        ],
        [LangTextType.Bgm0028]: [
            `Kindle's Theme`,
            `Kindle's Theme`,
            `Tema da Kindle`,
        ],
        [LangTextType.Bgm0029]: [
            `Koal's Theme`,
            `Koal's Theme`,
            `Tema do Koal`,
        ],
        [LangTextType.Bgm0030]: [
            `Lash's Theme`,
            `Lash's Theme`,
            `Tema da Lash`,
        ],
        [LangTextType.Bgm0031]: [
            `Von Bolt's Theme`,
            `Von Bolt's Theme`,
            `Tema do Von Bolt`,
        ],
        [LangTextType.Bgm0032]: [
            `Colin's Theme`,
            `Colin's Theme`,
            `Tema do Colin`,
        ],
        [LangTextType.Bgm0033]: [
            `Grit's Theme`,
            `Grit's Theme`,
            `Tema do Grit`,
        ],
        [LangTextType.Bgm0034]: [
            `Olaf's Theme`,
            `Olaf's Theme`,
            `Tema do Olaf`,
        ],
        [LangTextType.Bgm0035]: [
            `Sasha's Theme`,
            `Sasha's Theme`,
            `Tema da Sasha`,
        ],
        [LangTextType.Bgm0036]: [
            `Drake's Theme`,
            `Drake's Theme`,
            `Tema do Drake`,
        ],
        [LangTextType.Bgm0037]: [
            `Eagle's Theme`,
            `Eagle's Theme`,
            `Tema do Eagle`,
        ],
        [LangTextType.Bgm0038]: [
            `Javier's Theme`,
            `Javier's Theme`,
            `Tema do Javier`,
        ],
        [LangTextType.Bgm0039]: [
            `Jess's Theme`,
            `Jess's Theme`,
            `Tema da Jess`,
        ],
        [LangTextType.Bgm0040]: [
            `Andy's Theme`,
            `Andy's Theme`,
            `Tema do Andy`,
        ],
        [LangTextType.Bgm0041]: [
            `Hachi's Theme`,
            `Hachi's Theme`,
            `Tema do Hachi`,
        ],
        [LangTextType.Bgm0042]: [
            `Jake's Theme`,
            `Jake's Theme`,
            `Tema do Jake`,
        ],
        [LangTextType.Bgm0043]: [
            `Max's Theme`,
            `Max's Theme`,
            `Tema do Max`,
        ],
        [LangTextType.Bgm0044]: [
            `Nell's Theme`,
            `Nell's Theme`,
            `Tema da Nell`,
        ],
        [LangTextType.Bgm0045]: [
            `Rachel's Theme`,
            `Rachel's Theme`,
            `Tema da Rachel`,
        ],
        [LangTextType.Bgm0046]: [
            `Sami's Theme`,
            `Sami's Theme`,
            `Tema da Sami`,
        ],
        [LangTextType.Bgm0047]: [
            `Sonja's Theme`,
            `Sonja's Theme`,
            `Tema da Sonja`,
        ],
        [LangTextType.Bgm0048]: [
            `Grimm's Theme`,
            `Grimm's Theme`,
            `Tema do Grimm`,
        ],
        [LangTextType.Bgm0049]: [
            `Kanbei's Theme`,
            `Kanbei's Theme`,
            `Tema do Kanbei`,
        ],
        [LangTextType.Bgm0050]: [
            `Sensei's Theme`,
            `Sensei's Theme`,
            `Tema do Sensei`,
        ],
        [LangTextType.Bgm0051]: [
            `Jugger's Theme`,
            `Jugger's Theme`,
            `Tema do Jugger`,
        ],
        [LangTextType.Bgm0052]: [
            `Sturm's Theme`,
            `Sturm's Theme`,
            `Tema do Sturm`,
        ],
        [LangTextType.Bgm0053]: [
            `Power! (AW DS)`,
            `Power! (AW DS)`,
            `Poder! (AW DS)`
        ],
        [LangTextType.Bgm0054]: [
            `Super CO Power! (AW DS)`,
            `Super CO Power! (AW DS)`,
            `Super Poder! (AW DS)`,
        ],
        [LangTextType.Bgm0055]: [
            `Black Hole Power! (AW DS)`,
            `Black Hole Power! (AW DS)`,
            `Poder do Buraco Negro! (AW DS)`,
        ],
        [LangTextType.Bgm0056]: [
            `Black Hole Super CO Power! (AW DS)`,
            `Black Hole Super CO Power! (AW DS)`,
            `Super Poder do Buraco Negro! (AW DS)`,
        ],
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        [LangTextType.MoveType0000]: [
            `步兵`,
            `Inf`,
            `Inf`,
        ],
        [LangTextType.MoveType0001]: [
            `反坦克兵`,
            `Mech`,
            `Mech`,
        ],
        [LangTextType.MoveType0002]: [
            `轮胎A`,
            `TireA`,
            `PneuA`,
        ],
        [LangTextType.MoveType0003]: [
            `轮胎B`,
            `TireB`,
            `PneuB`,
        ],
        [LangTextType.MoveType0004]: [
            `履带`,
            `Tank`,
            `Tanque`,
        ],
        [LangTextType.MoveType0005]: [
            `飞行`,
            `Air`,
            `Aéreo`,
        ],
        [LangTextType.MoveType0006]: [
            `航行`,
            `Ship`,
            `Navio`,
        ],
        [LangTextType.MoveType0007]: [
            `运输`,
            `Trans`,
            `Trans`,
        ],
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        [LangTextType.UnitCategory0000]: [
            `无`,
            `None`,
            `Nenhum`,
        ],
        [LangTextType.UnitCategory0001]: [
            `全部`,
            `All`,
            `Todo`,
        ],
        [LangTextType.UnitCategory0002]: [
            `陆军`,
            `Ground`,
            `Terrestre`,
        ],
        [LangTextType.UnitCategory0003]: [
            `海军`,
            `Naval`,
            `Naval`,
        ],
        [LangTextType.UnitCategory0004]: [
            `空军`,
            `Air`,
            `Aéreo`,
        ],
        [LangTextType.UnitCategory0005]: [
            `陆军&海军`,
            `Ground & Naval`,
            `Terrestre e Naval`,
        ],
        [LangTextType.UnitCategory0006]: [
            `陆军&空军`,
            `Ground & Air`,
            `Terrestre e Aéreo`,
        ],
        [LangTextType.UnitCategory0007]: [
            `近战`,
            `Direct`,
            `Direto`,
        ],
        [LangTextType.UnitCategory0008]: [
            `远程`,
            `Indirect`,
            `Indireto`,
        ],
        [LangTextType.UnitCategory0009]: [
            `步行`,
            `Foot`,
            `À pé`,
        ],
        [LangTextType.UnitCategory0010]: [
            `步兵系`,
            `Inf`,
            `Inf`,
        ],
        [LangTextType.UnitCategory0011]: [
            `车辆系`,
            `Vehicle`,
            `Veículo`,
        ],
        [LangTextType.UnitCategory0012]: [
            `近战机械`,
            `DirectMachine`,
            `MáquinaDireta`,
        ],
        [LangTextType.UnitCategory0013]: [
            `运输系`,
            `Transport`,
            `Transporte`,
        ],
        [LangTextType.UnitCategory0014]: [
            `大型船只`,
            `LargeNaval`,
            `GrandeNaval`,
        ],
        [LangTextType.UnitCategory0015]: [
            `直升机`,
            `Copter`,
            `Helicóptero`,
        ],
        [LangTextType.UnitCategory0016]: [
            `坦克`,
            `Tank`,
            `Tanque`,
        ],
        [LangTextType.UnitCategory0017]: [
            `空军除舰载机`,
            `AirExceptSeaplane`,
            `AéreoSenãoHidroplano`,
        ],
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        [LangTextType.WeatherType0000]: [
            `正常天气`,
            `Clear sky`,
            `Céu claro`,
        ],
        [LangTextType.WeatherType0001]: [
            `沙尘暴`,
            `Sandstorm`,
            `Tempestade de Areia`,
        ],
        [LangTextType.WeatherType0002]: [
            `雪天`,
            `Snowy`,
            `Nevasca`,
        ],
        [LangTextType.WeatherType0003]: [
            `雨天`,
            `Rainy`,
            `Chuva`,
        ],

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Format strings.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        [LangTextType.F0000]: [
            "地图名称: %s",
            "Map name: %s",
            "Nome do mapa: %s",
        ],
        [LangTextType.F0001]: [
            "作者: %s",
            "Designer: %s",
            `Designer: %s`,
        ],
        [LangTextType.F0002]: [
            "人数: %s",
            "Players: %s",
            `Jogadores: %s`,
        ],
        [LangTextType.F0003]: [
            "全服评分: %s",
            "Rating: %s",
            `Avaliação: %s`,
        ],
        [LangTextType.F0004]: [
            "全服游玩次数: %s",
            "Games played: %s",
            `Jogos concluídos: %s`,
        ],
        [LangTextType.F0005]: [
            "战争迷雾: %s",
            "Fog: %s",
            `Neblina: %s`,
        ],
        [LangTextType.F0006]: [
            `%d个部队尚未行动。`,
            `%d unit(s) is(are) idle.`,
            `%d unidade(s) ociosa(s)`,
        ],
        [LangTextType.F0007]: [
            `%d个%s空闲，位置：%s。`,
            `%d %s(s) is(are) idle. Position(s): %s.`,
            `%d %s(s) está(ão) ociosa(s). Posição(ões): %s.`,
        ],
        [LangTextType.F0008]: [
            `玩家[%s]已投降！`,
            `Player [%s] has resigned!`,
            `Jogadore [%s] desistiu.`,

        ],
        [LangTextType.F0009]: [
            `%s 的履历`,
            `%s's Profile`,
            `Perfil de %s`,
        ],
        [LangTextType.F0010]: [
            `%d胜`,
            `Win: %d`,
            `Vitórias: %d`,
        ],
        [LangTextType.F0011]: [
            `%d负`,
            `Lose: %d`,
            `Derrotas: %d`,
        ],
        [LangTextType.F0012]: [
            `%d平`,
            `Draw: %d`,
            `Empates: %d`,
        ],
        [LangTextType.F0013]: [
            `玩家[%s]已战败！`,
            `Player [%s] was defeated!`,
            `Jogadore [%s] foi derrotade.`,
        ],
        [LangTextType.F0014]: [
            `玩家[%s]的最后一个部队耗尽燃料而坠毁，因而战败！`,
            `Player [%s] was defeated!`,
            `Jogadore [%s] foi derrotade.`,
        ],
        [LangTextType.F0015]: [
            `玩家[%s]的所有部队均被消灭，因而战败！`,
            `Player [%s] is defeated!`,
            `Jogadore [%s] foi derrotade.`,
        ],
        [LangTextType.F0016]: [
            `玩家[%s]的指挥部被占领，因而战败！`,
            `Player [%s] is defeated!`,
            `Jogadore [%s] foi derrotade.`,
        ],
        [LangTextType.F0017]: [
            `P%d [%s] 已拒绝和局！`,
            `P%d [%s] declines to end the game in draw!`,
            `P%d [%s] recusa terminar o jogo em empate!`,
        ],
        [LangTextType.F0018]: [
            `P%d [%s] 已同意和局！`,
            `P%d [%s] agrees to end the game in draw!`,
            `P%d [%s] concorda em encerrar o jogo em empate!`,
        ],
        [LangTextType.F0019]: [
            `P%d [%s] 求和！`,
            `P%d [%s] requests to end the game in draw.`,
            `P%d [%s] propõe terminar o jogo em empate.`
        ],
        [LangTextType.F0020]: [
            `最多%d字，可留空`,
            `%d characters at maximum, optional`,
            `%d caracteres no máximo, opcional`,
            // Not really sure what this is about
        ],
        [LangTextType.F0021]: [
            `最多%d位数字，可留空`,
            `%d digits at maximum, optional`,
            `%d digitos no máximo, opcional`,

        ],
        [LangTextType.F0022]: [
            `%s (P%d) 回合正式开始！！`,
            `It's %s (P%d)'s turn`,
            `É o turno de %s (P%d)`
        ],
        [LangTextType.F0023]: [
            `地图的总格子数必须小于等于%d`,
            `The number of the grids must be less than or equal to %d.`,
            `O número de grids necessita ser menor ou igual a %d`,
        ],
        [LangTextType.F0024]: [
            `修改时间: %s`,
            `Modify Time: %s`,
            `Modificar Tempo: %s`,
        ],
        [LangTextType.F0025]: [
            `要和玩家"%s"私聊吗？`,
            `Do you want to make a private chat with %s?`,
            `Deseja ter uma conversa privada com %s?`,
        ],
        [LangTextType.F0026]: [
            `数据加载中，请%s秒后重试`,
            `Now loading, please wait %ds and retry.`,
            `Carregando, por favor aquarde %ds e tente novamente`,
        ],
        [LangTextType.F0027]: [
            `"%s"上的一局多人对战已经正式开始！`,
            `A game on "%s" has started!`,
            `Uma partida em "%s" se iniciou!`,
        ],
        [LangTextType.F0028]: [
            `玩家[%s]因超时而告负！`,
            `Player [%s] has ran out of time!`,
            `O tempo do jogadore [%s]`,
        ],
        [LangTextType.F0029]: [
            `您确定要踢掉玩家"%s"吗？`,
            `Are you sure you want to kick off the player '%s'?`,
            `Tem certeza de que deseja expulsar le jogadore '%s'?`,
        ],
        [LangTextType.F0030]: [
            `%s (P%d) 回合结束。`,
            `%s (P%d) has ended the turn.`,
            `%s (P%d) terminou seu turno.`,
        ],
        [LangTextType.F0031]: [
            `您最多只能禁用%d名CO。`,
            `You can only ban up to %d COs.`,
            `Você pode banir apenas até %d Comandantes`,
        ],
        [LangTextType.F0032]: [
            `请把名称长度控制在%d个字符以内。`,
            `Please limit the length of the name to %d characters.`,
            `Por favor, limite o comprimento do nome a %d caracteres.`,
        ],
        [LangTextType.F0033]: [
            `启用SetPath模式后，在指定部队移动路线时，您需要连续点击两次目标格子才能呼出操作菜单。这会增加操作量，但同时也便于指定移动路线，这在雾战中尤其有用。\n您确定要启用吗？\n（当前状态：%s）`,
            `While the "Set Path" mode is enabled, when moving units you'll have to double click (or touch) a tile in order to make the unit action panel appear. This mode can be useful especially in Fog of War.\nEnable it? \n(Current status: %s)`,
            `Enquanto o modo "Definir Caminho" estiver habilitado, ao mover unidades você terá que clicar (ou tocar) um terreno duas vezes para que apareça um painel de ação. Este modo pode ser bastante útil havendo Névoa de Guerra.\nHabilitar?\n(Estado atual: %s)`,
        ],
        [LangTextType.F0034]: [
            `最多输入%d个字符，请检查`,
            `Please limit the text length to %d characters.`,
            `Por favor, limite o comprimento do texto a %d caracteres.`,
        ],
        [LangTextType.F0035]: [
            `事件#%d发生次数等于%d`,
            `Event #%d has occurred %d times`,
            `Evento #%d ocorreu %d vezes`,
        ],
        [LangTextType.F0036]: [
            `事件#%d发生次数不等于%d`,
            `Event #%d has not occurred %d times`,
            `Evento #%d não ocorreu %d vezes`,
        ],
        [LangTextType.F0037]: [
            `事件#%d发生次数大于%d`,
            `Event #%d has occurred more than %d times`,
            `Evento #%d ocorreu mais de %d vezes`,
        ],
        [LangTextType.F0038]: [
            `事件#%d发生次数小于等于%d`,
            `Event #%d has occurred no more than %d times`,
            `Evento #%d ocorreu não mais que %d vezes`,
        ],
        [LangTextType.F0039]: [
            `事件#%d发生次数小于%d`,
            `Event #%d has occurred less than %d times`,
            `Evento #%d ocorreu menos que %d vezes`,
        ],
        [LangTextType.F0040]: [
            `事件#%d发生次数大于等于%d`,
            `Event #%d occurred at least %d times`,
            `Evento #%d ocorreu pelo menos %d vezes`,
        ],
        [LangTextType.F0041]: [
            `玩家P%d的当前状态 == %s`,
            `The state of player P%d is %s`,
            `O estado do jogador P%d é %s`,
        ],
        [LangTextType.F0042]: [
            `玩家P%d的当前状态 != %s`,
            `The state of player P%d is not %s`,
            `O estado do jogador P%d não é %s`,
        ],
        [LangTextType.F0043]: [
            `当前是玩家P%d的回合`,
            `Now it's P%d's turn.`,
            `Agora é o turno du P%d`
        ],
        [LangTextType.F0044]: [
            `当前不是玩家P%d的回合`,
            `Now it isn't P%d's turn.`,
            `Agora não é o turno du P%d`
        ],
        [LangTextType.F0045]: [
            `处于当前回合的玩家序号大于%d`,
            `The index of the player in the current turn is greater than %d.`,
            `O índice do jogador do turno atual é maior que %d.`
        ],
        [LangTextType.F0046]: [
            `处于当前回合的玩家序号小于等于%d`,
            `The index of the player in the current turn is at most %d.`,
            `O índice do jogador do turno atual é no máximo %d.`,
        ],
        [LangTextType.F0047]: [
            `处于当前回合的玩家序号小于%d`,
            `The index of the player in the current turn is less than %d.`,
            `O índice do jogador do turno atual é menos que %d.`,
        ],
        [LangTextType.F0048]: [
            `处于当前回合的玩家序号大于等于%d`,
            `The index of the player in the current turn at least %d.`,
            `O índice do jogador do turno atual é pelo menos %d.`,
        ],
        [LangTextType.F0049]: [
            `当前的回合数等于%d`,
            `The current turn is %d.`,
            `O turno atual é %d.`,
        ],
        [LangTextType.F0050]: [
            `当前的回合等于%d`,
            `The current turn is not %d.`,
            `O turno atual não é %d.`,
        ],
        [LangTextType.F0051]: [
            `当前的回合数大于%d`,
            `The current turn is greater than %d.`,
            `O turno atual maior que %d.`,
        ],
        [LangTextType.F0052]: [
            `当前的回合数小于等于%d`,
            `The current turn is at most %d.`,
            `O turno atual é no máximo %d.`,
        ],
        [LangTextType.F0053]: [
            `当前的回合数小于%d`,
            `The current turn is less than %d.`,
            `O turno atual é menos que %d.`,
        ],
        [LangTextType.F0054]: [
            `当前的回合数大于等于%d`,
            `The current turn is at least %d.`,
            `O turno atual é pelo menos %d.`,
        ],
        [LangTextType.F0055]: [
            `当前的回合数除以 %d 的余数 == %d`,
            `The current turn mod %d = %d.`,
            `O turno atual mod %d = %d.`,
        ],
        [LangTextType.F0056]: [
            `当前的回合数除以 %d 的余数 != %d`,
            `The current turn mod %d != %d.`,
            `O turno atual mod %d != %d.`,
        ],
        [LangTextType.F0057]: [
            `当前的回合阶段 == %s`,
            `The current turn phase is %s.`,
            `A atual fase do turno é %s`,
        ],
        [LangTextType.F0058]: [
            `当前的回合阶段 != %s`,
            `The current turn phase is not %s.`,
            `A atual fase do turno não é %s`,
        ],
        [LangTextType.F0059]: [
            `在地图上增加部队: %s`,
            `Add units on map: %s`,
            `Adicionar unidades no mapa: %s`,
        ],
        [LangTextType.F0060]: [
            `当前正在使用条件节点%s。确定要用新的空节点代替它吗？`,
            `The condition node %s is being used. Replace it by a new empty one?`,
            `O nó condicional %s está sendo usado. Subtituí-lo por um novo nó vazio?`,
        ],
        [LangTextType.F0061]: [
            `此条件节点中包含了重复的节点%s。请删除重复的节点。`,
            `There are duplicated sub nodes %s in the node. Please remove the duplication.`,
            `Há sub nós duplicados %s no nó. Por favor, remova esta duplicação.`,
        ],
        [LangTextType.F0062]: [
            `此条件节点中包含了重复的条件%s。请删除重复的条件。`,
            `There are duplicated condition %s in the node. Please remove the duplication.`,
            `Há condições duplicadas %s no nó. Por favor, remova esta duplicação.`,
        ],
        [LangTextType.F0063]: [
            `已删除%d个节点、%d个条件和%d个动作。`,
            `%d nodes, %d conditions and %d actions have been deleted.`,
            `%d nós, %d condições e %d ações foram deletadas.`,
        ],
        [LangTextType.F0064]: [
            `%s无效`,
            `The %s is invalid.`,
            `O %s não é válido.`,
        ],
        [LangTextType.F0065]: [
            `您是否希望前往 %s 网站?`,
            `Do you want to go to the %s website?`,
            `Você deseja ir ao site %s?`,
        ],
        [LangTextType.F0066]: [
            `设置玩家 %s 的状态为 %s`,
            `Set %s's state as %s.`,
            `Definir o estado de %s como %s`,
        ],
        [LangTextType.F0067]: [
            `无法在 %s 上放置部队。`,
            `It's not allowed to place units on %s.`,
            `Não é permitido colocar unidades no %s.`,
        ],
        [LangTextType.F0068]: [
            `请输入数字，最多 %d 位`,
            `Enter a number, up to %d digits.`,
            `Coloque um número, com até %d dígitos.`,
        ],
        [LangTextType.F0069]: [
            `您已成功加入房间 #%d`,
            `You have joined room #%d`,
            `Você entrou na sala #%d`,
        ],
        [LangTextType.F0070]: [
            `发生剧情对话，参与CO: %s`,
            `Start a dialogue, COs: %s`,
            `Começar um diálogo, Comandantes: %s`,
        ],
        [LangTextType.F0071]: [
            `#%d 对话数据不合法`,
            `The #%d dialogue is invalid.`,
            `O #%d diálogo não é válido.`,
        ],
        [LangTextType.F0072]: [
            `您确定要修改 P%d 的所属队伍吗？`,
            `Are you sure you want to modify the team of P%d?`,
            `Está certo de que quer modificar o time du P%d?`,
        ],
        [LangTextType.F0073]: [
            `当前天气：%s（默认：%s）。`,
            `Current weather: %s (default: %s).`,
            `Clima atual: %s (padrão: %s).`,
        ],
        [LangTextType.F0074]: [
            `当前天气将在第%d回合、P%d开始前结束（当前：第%d回合、P%d）。`,
            `The current weather will end before D%d P%d's turn begins (current turn: D%d P%d).`,
            `O atual clima irá mudar antes que o turno D%d du P%d se inicie (turno atual: D%d P%d).`,
        ],
        [LangTextType.F0075]: [
            `把坐标(%d, %d)移动到屏幕中心`,
            `Move (%d, %d) to the screen center.`,
            `Mover (%d, %d) para o centro da tela.`,
        ],
        [LangTextType.F0076]: [
            `把天气改为%s，持续%d回合`,
            `Set the weather condition to %s for %d turns.`,
            `Definir a condição climática como sendo %s por %d turnos`,
        ],
        [LangTextType.F0077]: [
            `把天气永久改为%s`,
            `Set the weather condition to %s indefinitely.`,
            `Definir a condição climática como sendo %s indefinidamente.`,
        ],
        [LangTextType.F0078]: [
            `地块(%d, %d)属于玩家P%d`,
            `The owner of the tile (%d, %d) is P%d.`,
            `O proprietário do terreno (%d, %d) é P%d.`,
        ],
        [LangTextType.F0079]: [
            `地块(%d, %d)不属于玩家P%d`,
            `The owner of the tile (%d, %d) is not P%d.`,
            `O proprietário do terreno (%d, %d) não é P%d.`,
        ],
        [LangTextType.F0080]: [
            `地块(%d, %d)的类型是%s`,
            `The type of the tile (%d, %d) is %s.`,
            `O tipo do terreno (%d, %d) é %s`,
        ],
        [LangTextType.F0081]: [
            `地块(%d, %d)的类型不是%s`,
            `The type of the tile (%d, %d) is not %s.`,
            `O tipo do terreno (%d, %d) não é %s.`,
        ],
        [LangTextType.F0082]: [
            `您将同意%d人的观战请求，同时拒绝%d人的观战请求。\n您确定要继续吗？`,
            `From all requests made by players, you are going to accept %d of them while declining other %d.\nContinue?`,
            `Dos pedidos feitos pelos jogadores, você aceitará %d deles e recusará outros %d.\nContinuar?`,
        ],
        [LangTextType.F0083]: [
            `您将向%d个玩家发起观战请求。\n您确定要继续吗？`,
            `You are going to send requests to %d players.\nContinue?`,
            `Você irá enviar solicitações a %d jogadores.\nContinuar?`,
        ],
        [LangTextType.F0084]: [
            `%s 已成功创建`,
            `%s is created successfully.`,
            `%s foi criado com sucesso.`,
        ],
        [LangTextType.F0085]: [
            `发生简易剧情对话，参与CO: %s`,
            `Start a simple dialogue, COs: %s`,
            `Iniciar um diálogo simples, Comandantes: %s`,
        ],
        [LangTextType.F0086]: [
            `修改 %s 的CO能量，公式为：当前能量 * %d%% + 最大能量 * %d%%`,
            `Set %s's CO energy to: current energy * %d%% + max energy * %d%%.`,
            `Definir a energia do Comandante du %s para: atual energia * %d%% + energia máxima * %d%%.`,
        ],
        [LangTextType.F0087]: [
            `修改 %s 的资金，公式为：当前资金 * %d%% + %d`,
            `Set %s's fund to: current fund * %d%% + %d.`,
            `Definir a reserva du %s como sendo: reserva atual * %d%% + %d.`,
        ],
        [LangTextType.F0088]: [
            `假设当前值是10000，则动作执行后将变为%d`,
            `Assume the current value is 10000, then the value will become %d after this action is executed.`,
            `Assuma que o atual valor seja 10000, então o valor torna-se-á %d após esta ação ser executada`,
        ],
        [LangTextType.F0089]: [
            `假设玩家当前CO能量是40%，则动作执行后为%d%%`,
            `Assume that the current CO energy level is 40%%, then the energy will become %d%% after this action is executed.`,
            `Assuma que o atual nível de energia do Comandante seja 40%%, então a energia torna-se-á %d%% após esta ação ser executada.`,
        ],
        [LangTextType.F0090]: [
            `类型为 %s%s 的部队的数量 %s %s`,
            `Get every unit that is %s%s. The number of the units %s %s.`,
            `Selecione todas as unidades que seja %s%s. O número de unidades %s %s.`,
        ],
        [LangTextType.F0091]: [
            `%s无效`,
            `Invalid %s.`,
            `%s inválido.`,
        ],
        [LangTextType.F0092]: [
            `选择%s`,
            `Select %s`,
            `Selecionar %s`,
        ],
        [LangTextType.F0093]: [
            `类型为 %s%s 的地形的数量 %s %s`,
            `Get every terrain that is %s%s. The number of the terrains %s %s.`,
            `Selecione todo terreno que seja %s%s. O número de terrenos %s %s.`,
        ],
        [LangTextType.F0094]: [
            `当前回合数是 %s、且回合阶段为 %s、且是 %s 的回合`,
            `The Current Turn is %s, the Turn Phase is %s, and the Current Player is %s.`,
            `O Turno Atual é %s, a Fase do Turno é %s, e o Atual Jogador é %s.`,
        ],
        [LangTextType.F0095]: [
            `当前回合数是 %s、且当前回合数除以 %s 的余数 %s %s、且回合阶段为 %s、且是 %s 的回合`,
            `The Current Turn is %s, and the Current Turn mod %s is %s %s, the Turn Phase is %s, and the Current Player is %s.`,
            `O Turno Atual é %s, o Turno Atual mod %s é %s %s, a Fase Atual é %s, e o Atual Jogador é %s.`,
        ],
        [LangTextType.F0096]: [
            `当前回合数除以 %s 的余数 %s %s、且回合阶段为 %s、且是 %s 的回合`,
            `The Current Turn mod %s is %s %s, the Turn Phase is %s, and the Current Player is %s.`,
            `O Atual Turno mod %s é %s %s, a Fase do Turno é %s, e o Atual Jogador é %s.`,
        ],
        [LangTextType.F0097]: [
            `任意%s`,
            `Any %s`,
            `Qualquer %s`,
        ],
        [LangTextType.F0098]: [
            `玩家序号为 %s%s 的玩家的数量 %s %s`,
            `The number of players that are %s%s %s %s.`,
            `O número de jogadores que são %s%s %s %s.`,
        ],
        [LangTextType.F0099]: [
            `存活状态是 %s`,
            `the "Playing" State is %s`,
            `o Estado "Jogando" é %s`,
        ],
        [LangTextType.F0100]: [
            `资金 %s %s`,
            `the Fund %s %s`,
            `a Reserva %s %s`,
        ],
        [LangTextType.F0101]: [
            `CO能量值百分比 %s %s`,
            `the CO Energy %% %s %s`,
            `a Energia do Comandante %% %s %s`,
        ],
        [LangTextType.F0102]: [
            `激活中的CO技能类型是 %s`,
            `the activating CO Skill Type is %s`,
            `o Tipo da Habilidade do Comandante sendo ativada é %s`,
        ],
        [LangTextType.F0103]: [
            `ID为 %s%s 的事件的数量 %s %s`,
            `The number of events whose ID is %s%s %s %s.`,
            `O número de eventos cujo ID é %s%s %s %s.`,
        ],
        [LangTextType.F0104]: [
            `当前玩家回合内的触发次数 %s %s`,
            `the Triggered Times in the current player's turn %s %s`,
            `o Número de Disparos no turno du atual jogadore %s %s`,
        ],
        [LangTextType.F0105]: [
            `合计触发次数 %s %s`,
            `the Total Triggered Times %s %s`,
            `o Total de Vezes Disparadas %s %s`,
        ],
        [LangTextType.F0106]: [
            `当前天气是 %s%s`,
            `The Weather Condition is %s%s.`,
            `A Condição Climática é %s%s.`,
        ],
        [LangTextType.F0107]: [
            `战争迷雾%s`,
            `the Fog of War is %s`,
            `a Névoa da Guerra é %s`,
        ],
        [LangTextType.F0108]: [
            `把战争迷雾改为%s，持续%d回合`,
            `Set the Fog of War to %s for %d turns.`,
            `Definir a Névoa da Guerra para %s por %d turnos.`,
        ],
        [LangTextType.F0109]: [
            `把战争迷雾永久改为%s`,
            `Set the Fog of War to %s indefinitely.`,
            `Definir a Névoa da Guerra para %s indefinidamente.`,
        ],
        [LangTextType.F0110]: [
            `修改ID为 %s 的自定义计数器的值，公式为：当前值 * %d%% + %d`,
            `Set the value of the Custom Counters whose ID is %s to: current value * %d%% + %d.`,
            `Definir o valor dos Contadores Personalizados cujo ID é %s para: valor atual * %d%% + %d.`,
        ],
        [LangTextType.F0111]: [
            `ID为 %s%s 的自定义计数器的数量 %s %s`,
            `The number of Custom Counters whose ID is %s%s %s %s.`,
            `O número de Contadores Personalizados cujo ID é %s%s %s %s.`,
        ],
        [LangTextType.F0112]: [
            `值 %s %s`,
            `the Value %s %s`,
            `o Valor %s %s`,
        ],
        [LangTextType.F0113]: [
            `值除以 %s 的余数 %s %s`,
            `the Value mod %s %s %s`,
            `o Valor mod %s %s %S`,
        ],
        [LangTextType.F0114]: [
            `修改类型为 %s%s 的所有部队的属性。`,
            `Get every unit that is %s%s and modify its state.`,
            `Selecione toda unidade que seja %s%s e modifique seu estado.`,
        ],
        [LangTextType.F0115]: [
            `归属于 %s`,
            `is owned by %s`,
            `é propriedade de %s`,
        ],
        [LangTextType.F0116]: [
            `位于区域 %s`,
            `is located at %s`,
            `está localizado em %s`,
        ],
        [LangTextType.F0117]: [
            `坐标为 %s`,
            `the coordinate is %s`,
            `a coordenada é %s`,
        ],
        [LangTextType.F0118]: [
            `行动状态为 %s`,
            `the action state is %s`,
            `o estado de ação é %s`,
        ],
        [LangTextType.F0119]: [
            `%s: 当前值 * %s%% + %s。`,
            `%s: current value * %s%% + %s.`,
            `%s: valor atual * %s%% + %s.`,
        ],
        [LangTextType.F0120]: [
            `真实HP %s %s`,
            `the real HP %s %s`,
            `O HP real é %s %s`,
        ],
        [LangTextType.F0121]: [
            `燃料%% %s %s`,
            `the fuel%% %s %s`,
            `o Combustível%% %s %s`,
        ],
        [LangTextType.F0122]: [
            `主武器弹药%% %s %s`,
            `the primary weapon ammo%% %s %s`,
            `a munição da arma primária%% %s %s`,
        ],
        [LangTextType.F0123]: [
            `晋升等级 %s %s`,
            `the promotion %s %s`,
            `a promoção %s %s`,
        ],
        [LangTextType.F0124]: [
            `找到类型为 %s%s 的所有部队，并摧毁它们。`,
            `Get every unit that is %s%s and destroy it.`,
            `Selecione toda unidade que seja %s%s e a destrua`,
        ],
        [LangTextType.F0125]: [
            `%s: %s。`,
            `%s: %s.`,
            `%s: %s.`,
        ],
        [LangTextType.F0126]: [
            `找到玩家序号为 %s%s 的所有玩家，并修改他们的属性。`,
            `Get every player that is %s%s and modify its state.`,
            `Selecione todo jogador que seja e %s%s e modifique seu estado`
        ],
        [LangTextType.F0127]: [
            `恭喜您获得本局的胜利！本次得分：%s\n\n即将回到大厅…`,
            `You win! Score: %s.`,
        ],
        [LangTextType.F0128]: [
            `找到坐标为 %s%s 的所有地块，并修改其属性。`,
            `Get every terrain whose coordinates are %s%s and modify its state.`,
            `Selecione todo terreno cujas cooerdenadas sejam %s%s e modifique seu estado.`,
        ],
        [LangTextType.F0129]: [
            `找到坐标为 %s%s 的所有地块，并修改其类型。`,
            `Get every terrain whose coordinate are %s%s and modify its type.`,
            `Selecione todo terreno cujas coordenadas sejam %s%s e modifique seu tipo.`,
        ],
        [LangTextType.F0130]: [
            `停止ID为 %s 的持续性事件动作。`,
            `Stop persistent event actions whose ID is %s.`,
            `Pare as ações de evento persistentes cujo ID seja %s.`,
        ],
        [LangTextType.F0131]: [
            `持续性显示文字: %s`,
            `Persistently show text: %s`,
            `Exibir texto persistentemente: %s`,
        ],
        [LangTextType.F0132]: [
            `CO是 %s`,
            `the CO is %s`,
            `o Comandante é %s`,
        ],
        [LangTextType.F0133]: [
            `无法选中 "%s"。`,
            `"%s" cannot be chosen.`,
            `"%s" não pode ser escolhido.`,
        ],
        [LangTextType.F0134]: [
            `必须选中 "%s"。`,
            `"%s" must be chosen.`,
            `"%s" deve ser escolhido.`,
        ],
        [LangTextType.F0135]: [
            `生效中的ID为 %s 的持续性动作的数量 %s %s`,
            `The number of ongoing persistent actions whose ID is %s %s %s.`,
            `O número de ações persistentes em andamento cujo ID é %s %s %s.`,
        ],
        [LangTextType.F0136]: [
            `找到玩家序号为 %s 的所有玩家，并持续性修改他们的属性。`,
            `Get every player that is %s and persistently modify its attributes.`,
            `Selecione todo jogador que seja %s e persistentemente altere seus atributos.`,
        ],
        [LangTextType.F0137]: [
            `禁止生产部队: %s。`,
            `Prohibit these units production: %s.`,
            `Proibir a produção destas unidades: %s.`,
        ],
        [LangTextType.F0138]: [
            `剩余%s`,
            `Remaining %s`,
            `Restando %s`,
        ],
        [LangTextType.F0139]: [
            `占领点数 %s %s`,
            `the Capture Points %s %s`,
            `os Pontos de Captura %s %s`,
        ],
        [LangTextType.F0140]: [
            `建筑点数 %s %s`,
            `the Build Points %s %s`,
            `os Pontos de Captura %s %s`,
        ],
        [LangTextType.F0141]: [
            `尚未指定 %s`,
            `%s is not specified.`,
            `%s não está especificado.`,
        ],
        [LangTextType.F0142]: [
            `类型为 %s`,
            `the type is %s`,
            `o tipo é %s`,
        ],
        [LangTextType.F0143]: [
            `找到玩家序号为 %s%s 的所有玩家。%s他们所进行的的主动操作的总数量 %s %s`,
            `Get every player that is %s%s. The total number of manual actions they have taken %s%s %s.`,
            `Selecione a todo jogador que seja %s%s. O número total de açẽos manuais que elus tomaram %s%s %s.`,
        ],
        [LangTextType.F0144]: [
            `在最近的%d个回合中，`,
            `in the recent %d turns`,
            `nos %d turnos mais recentes`,
        ],

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        //
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
                `红=1，蓝=2，黄=3，绿=4, 黑=5`,
                ``,
                `默认为当前可用选项中的第一项。`,
            ].join("\n"),

            [
                `This option determines your place in the turn order and your team.`,
                ``,
                `During the game, players in the same team share their field of vision, are able to get repairs their allies' properties (consuming their own funds), and their troops cannot block nor attack one another. On the other hand, it is not possible to supply allied units with your own Rigs nor have allied units board any of your transports.`,
                ``,
                `When previewing a map, the colors of the armies correspond to their place in the order of turns (you can choose the color you want when creating/adding rooms), from first to last:`,
                `Red, blue, yellow, green, black, purple, cyan, pink`,
                ``,
                `By default you will be given the first choice among the available ones.`,
            ].join("\n"),
            [
                `Esta opção determina seu lugar na ordem nos turnos e seu time.`,
                ``,
                `Durante o jogo, jogadores no mesmo time compartilham seu campo de visão, são capazes de realizar reparos em propriedades de aliados, e suas tropas não bloqueiam ou atacam umas as outras. Mas não é possível abstecer unidades aliadas utilizando VBTPs ou fazê-las embarcar em um dos seus transportes.`,
                ``,
                `Ao ver a prévia do mapa as cores dos exércitos corresponem a ordem em que tomam seus respectivos turnos (independentemente das cores que os exércitos venham a assumir na partida) do primeiro ao último:`,
                `Vermelho, azul, amarelo, verde, preto, roxo, cyan, rosa`,
                ``,
                `Por padrão, lhe será oferecida a primeira cor disponível nesta ordem.`,
            ].join("\n"),
        ],

        [LangTextType.R0001]: [
            [
                `本选项影响您部队和建筑的外观（颜色）。`,
            ].join("\n"),

            [
                `This option determines the color of your troops and properties.`,
            ].join("\n"),
            [
                `Esta opção determina a cor de suas tropas e propriedades.`
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
                `This option determines whether or not this game is played with FoW.`,
                ``,
                `If so, you'll only be able to see the enemy units within the range of vision of your troops; if else, unless they're dived you'll spot them anywhere in the battlefield.`,
                `FoW is a relatively more complex game mode, and it is recommended to new players to start with no FoW to learn the basics of the game before advancing to FoW mode.`,
                ``,
                `Because of that, this option is disabled by default.`,
            ].join("\n"),
            [
                `Esta opção determina se a partida será tida com NdG.`,
                ``,
                `Se sim, você só poderá ver as unidades inimigas aquelas que estiverem no campo de visão de suas tropas; se não, a não ser que estas estejam submersas, você poderá encontrá-las em qualquer lugar do campo de batalha.`,
                `NdG é um modo de jogo relativamente mais complexo, e é recomendado a novos jogadores começarem sem NdG para aprender os fundamentos do jogo antes de avançar para o modo com FoW.`,
                ``,
                `Por isso, esta é uma opção desabilitada por padrão.`,
            ].join("\n"),
        ],

        [LangTextType.R0003]: [
            [
                `当战局正式开始，或某个玩家结束回合后，则服务器自动开始下个玩家回合的倒计时（无论该玩家是否在线）。`,
                `如果某个玩家的回合时间超出了限制，则服务器将自动为该玩家执行投降操作。`,
                ``,
                `当前有“常规”和“增量”两种计时模式可选。`,
            ].join("\n"),

            [
                `When a game starts or a player ends his turn, the timer of the next player to take a turn will start to countdown － whether that player is online or not.`,
                `If a player's timer hits zero, one of two things can occur: if the player has taken no actions, that player will resign automatically; if else, the turn will end.`,
                ``,
                `There are two types of timers available: regular and incremental.`,
            ].join("\n"),
            [
                `Quando um jogo se inicia ou um jogadore encerra seu turno, o cronômetro do próximo jogadore a ter seu turno começa uma contagem regressiva － esteja aquele jogadore conectado ou não.`,
                `Se o cronômetro de um jogadore atinge zero, uma de duas coisas pode acontecer: se este não realizou ações, este desiste da partida automáticamente; senão, seu turno é encerrado.`,
                ``,
                `Há dois tipos de cronômetro disponíveis: comum e incremental.`,
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
                `COs can be boarded onto the troops and provide buffs for troops in their CO Zone (COZ). Besides, some COs can charge energy and use it to activate CO Powers (COP) or Super CO Powers (SCOP).`,
                `The detailed rules regarding the functioning of COs are listed below:`,
                `01. COs needs to board an unit to be able to use their d2d abilities and powers.`,
                `02. There can be only 1 CO for each army.`,
                `03. COs can be boarded onto land units from bases, air units from airports, navy units from ports or any of these from HQs.`,
                `04. COs can only board onto idle units. These can move in the same turn after that.`,
                `05. If your CO unit is, for wathever reason, destroyed, the CO can be boarded again in your next turn.`,
                `06. Boarding the CO consumes an amount of funds which equals to a modifier (CO specific) multiplied by the production cost of the unit being boarded.`,
                `07. Upon boarding the CO the unit being boarded promotes to veteran status and CO's d2d takes effect at once.`,
                `08. If not specified otherwise, the CO's d2d works only on their troops within their CO zone.`,
                `09. Loading a CO unit in a transport unit makes it so that its zone dissapears until it is unloaded.`,
                `10. Only certain COs have both COP and SCOP.`,
                `11. COs accumulate energy whenever units within their zone deal damage to enemy units, either by attacking our counterattacking. For every unit of visible HP damage dealt an equivalent unit of damage is gained.`,
                `12. Some COs expand their zone radius by an unit when they have enough energy to meet a COZ expansion thereshold specified in their respective descriptions. COZ cannot be expanded if the thereshold is specified as "--".`,
                `13. The maximum amount of energy a CO can accumulate is the largest value between SCOP cost and COZ expansion cost.`,
                `14. COP and SCOP both have given energy requirements to be activated. Energy cannot be accumulated when COP or SCOP is active.`,
                `15. To activate COP or SCOP the unit with CO on board should be idle. You may use power after moving, but it is not possible to do so after taking any other action.`,
                `16. COP or SCOP effects last until the beginning of your next turn.`,
                `17. When COP or SCOP is active d2d bonuses are applied to all your units.`,
                `18. If a CO unit is destroyed, that CO loses all its accumulated energy and any COP or SCOP effects if any of those was activated.`,
            ].join("\n\n"),
            [
                `Comandantes podem ser embarcados em dadas unidades e fortalecer tropas no interior de sua Zona de Comandante (COZ). Além disso, estes podem acumular energia e utilizá-la para ativar Poderes (COP) ou Super Poderes (SCOP) de Comandante.`,
                `As regras detalhadas acerca do funcionamento dus Comandantes são descritas abaixo:`,
                `01. Comandantes necessitam embarcar uma unidade para serem capazes de utilizar suas abilidades DaD e poderes.`,
                `02. Só é possível haveer um comandante para cada exército.`,
                `03. Comandantes podem embarcar unidades terrestres em bases, áereas em aeroportos, marítimas em portos, ou qualquer uma destas em QGs.`,
                `04. Comandantes podem embarcar apenas unidades ociosas, as quais ainda podem mover-se no mesmo turno após terem sido embarcadas.`,
                `05. Se a unidade du Comandante tiver sido, por qualquer razão, destruída, o Comandante poderá embarcar noutra unidade no turno seguinte.`,
                `06. Embarcar um Comandante consome uma dada quantia monetária equivalente ao custo de produção da unidade sendo embarcada vezes um multiplicador (específico ao Comandante)`,
                `07. Ao embarcar o Comandante a unidade embarcada é promovida à máxima veterania e os efeitos DaD du Comandante são ativados imediatamente.`,
                `08. Senão especificado doutra forma, os efeitos DaD du Comandante aplicam-se apenas à suas prórias tropas dentro da respectiva COZ.`,
                `09. Embarcar a unidade du Comandante em uma unidade de transporte faz com que sua zona desapareça até que este desembarque.`,
                `10. Apenas dados Comandantes possuem tanto COP e SCOP.`,
                `11. Comandantes acumulam energia sempre que suas unidades dentro da sua zona causam dano a unidades inimiga, seja por ataque ou contrataque. Para cada unidade visível de dano ao HP causada uma unidade equivalente de energia é ganha.`,
                `12. Alguns Comandantes podem expandir o raio de suas zonas em uma unidade quando têm energia suficiente para corresponder a um limiar de expansão de zona especificado em suas respectivas descrições. COZ não podem ser expandidas se o limiar descrito for "--".`,
                `13. A quantidade máxima de energia que um Comandante pode acumular é o maior valor entre o custo de energia para o SCOP e para expansão de COZ`,
                `14. COP e SCOP ambos possuem requerimentos de energia para serem ativados. Energia não pode ser acumulada enquanto COP ou SCOP estiverem ativos.`,
                `15. Para ativar COP ou SCOP a unidade que o CO se encontra necessita estar ociosa. Pode-se utilizar tais poderes após mover-se, mas não após realizar qualquer outra ação`,
                `16. Os efeiros do COP ou SCOP perduram até início do seu próximo turno.`,
                `17. Quanto o COP ou SCOP estão ativos, os bônus DaD são aplicados a todas as suas unidades.`,
                `18. Se a unidade do Comandante é destruída, este Comandante perde qualquer energia que acumulou e quais quer efeitos do COP ou SCOP algum destes foi ativado.`,
            ].join("\n\n")
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
                `1. Usernames and passwords should consist only of alphanumerical characters and "_". Its length should be no shorter than 6 characters.`,
                ``,
                `2. Display names can be made using any characters. Its length should be no shorter than 4 characters.`,
                ``,
                `3. After registering you can freely change your display name or password, but not your username.`,
            ].join("\n"),
            [
                `1. Nome de usuário e senhas devem consistir somente de caracteres alfanuméricos e "_". O comprimento mínimo destes é de 6 caracteres.`,
                ``,
                `2. Nomes de exibição podem ser feitos usando quaisquer caracters. Seu comprimento não deve ser inferior a 4 caracteres.`,
                ``,
                `3. Depois de registrar-se você pode livremente alterar seu nome de exibição ou senha, mas não seu nome de usuário.`,
            ].join("\n"),
        ],

        [LangTextType.R0006]: [
            [
                `模拟战是一种辅助您进行战局规划/地图测试的工具。`,
                `该工具允许您把当前所见到的战局信息原样复制到单人战局中。您可以在该单人战局中随意操作，还可以无限制地存档、读档，直到您找到最好的走法为止。`,
                `在该模式下，游戏规则仍然正常生效。换言之，您可以结束回合，或者做其他任何常规操作，游戏会为您正常结算相关数据。`,
            ].join("\n"),
            [
                `Creating simulations are a way in which one can plan ahead game moves (in that sense these are akin to Move Planners) or test maps.`,
                `An simulation of an ongoing game consists in a single player copy of it where you may move any unit, and save/load at any point for unlimited times.`,
                `Be wary that, everything else being equal, simulations of games where enemy units or properties hidden in the Fog of War do not have copies of these as they are to be found in the original game.`,
            ].join("\n"),
            [
                `Criar simulações é uma maneira pela qual pode-se planejar antecipadamente jogadas (neste sentido estas são similares a Planejadores de Jogadas) ou testar mapas.`,
                `Uma simulação de um jogo em andamento consiste em uma cópia deste para um jogador onde você pode mover a qualquer unidade, assim como salvar/voltar a qualquer ponto sem restrições.`,
                `Esteja ciente de que, todos os demais fatores sendo iguais, simulações de jogos onde há unidades ou propriedades inimigas ocultas na Névoa da Guerra não possuem copias destas tal qual estas se encontram no jogo original.`,
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
            [
                `O modo livre trata-se de um modo multi-jogador que, diferentemente do que é o normal, pode-se iniciar à partir de qualquer estado de jogo.`,
                `São alguns casos de uso:`,
                `1. Criar partidas em um mapa customizado, sem que este tenha passado por um processo avaliativo`,
                `2. Criar um jogo a partir de um determinado estado de um replay, para estudar possíveis desfechos alternativos`,
                ``,
                `Os resultados de uma partida em moso livre não afetarão as estatísticas de seu perfil. Então relaxe e aproveite. :)`,
            ].join(`\n`),
        ],

        [LangTextType.R0008]: [
            [
                `合作模式是一个多人游戏模式。`,
                `与常规模式不同的是，AI会参与游戏。您可以与AI和/或其他玩家组队，对抗其他AI和/或玩家。`,
            ].join(`\n`),
            [
                `The Coop Mode is a multi-player mode.`,
                `Unlike the Normal Mode, this mode allows for there to be armies controlled by A.I., so that you can either team up with it against other players or with other players against it.`,
            ].join(`\n`),
            [
                `O modo Coop trata-se de um modo multijogador`,
                `Diferentemente do modo Normal, podem haver exércitos controlados por I.A. neste, tal que você pode juntar-se a ela para enfrentar outros jogadores ou com outros jogadores contra ela.`,
            ].join(`\n`),
        ],

        [LangTextType.R0009]: [
            [
                `天气会改变局内所有玩家的属性，具体影响如下：`,
                ``,
                `正常天气：没有任何影响`,
                `沙尘暴：所有部队攻击力-30%`,
                `雪天：所有部队移动力-1`,
                `雨天：强制进入雾战，且所有地形视野改为0，所有部队视野改为1`,
            ].join(`\n`),
            [
                `The weather affects all players's as described below:`,
                ``,
                `Clear: No effect.`,
                `Sandstorm: every unit's offensive power reduced by 30%.`,
                `Snowy: every unit's movement range reduced by 1.`,
                `Rainy: applies FoW; and the radius of each field of vision afforded by properties or fires becomes 0, while that of units becomes 1.`,
            ].join(`\n`),
            [
                `O clima afeta a todos os jogadores tal qual descrito abaixo:`,
                ``,
                `Céu claro: Sem efeito.`,
                `Tempestade de areia: poderio ofensivo de cada unidade reduzido em 30%.`,
                `Nevasca: alcance de movimento de cada unidades reduzido em 1.`,
                `Chuva: aplica NdG; e o raio de cada campo de visão concedido por propriedades ou fogos torna-se 0, enquanto aquele de unidades torna-se 1.`,
            ].join(`\n`),
        ],

        [LangTextType.R0010]: [
            [
                `A.I.模式会决定了此部队被A.I.操作时的行动方式，具体如下：`,
                ``,
                `0(正常)：A.I.按照自己认为的最佳方式来行动`,
                `1(守株待兔)：在有敌军进入可攻击范围之内以前，部队不会执行任何行动`,
                `2(站桩)：部队不会离开自己所处的位置，但会执行任何可能的行动`,
            ].join(`\n`),
            [
                `The A.I. mode determines how an unit will act as below:`,
                ``,
                `0 (Normal): it will act as determined by the A.I.`,
                `1 (Standby): it will remain idle util an enemy unit is in reach to be attacked.`,
                `2 (No Move): The unit will not move away from the current grid, but will do anything else.`,
            ].join(`\n`),
            [
                `O modo da I.A. determina como uma dada unidade agirá tal qual descrito abaixo:`,
                ``,
                `0 (Normal): esta agirá tal qual determinado pela I.A.`,
                `1 (Prontidão): esta permanecerá ociosa até que uma unidade inimiga esteja a seu alcance para atacá-la.`,
                `2 (Parada): esta não se moverá, mas poderá realizar qualquer outra ação.`,
            ].join(`\n`),
        ],

        [LangTextType.R0011]: [
            [
                `在挑战模式中，您每次通过任意关卡，系统都会计算此次的关卡得分，并上传到服务器，与全服玩家进行排名比拼。`,
                ``,
                `挑战模式还包含一个总排行榜。您通过的关卡越多，单个关卡的排名越高，则您在总榜的分数和排名也越高。`,
                ``,
                `注：`,
                `1. 关卡得分仅与您通关时所经过的回合数、以及总动作数（包括我方和AI的动作）有关，与其他所有因素（如敌我战损）都无关。`,
                `分数 = 100000 - (回合数 - 1) * 1000 - 动作数`,
                `2. 您可以多次挑战同一个关卡，系统将保留得分最高的通关记录。`,
                `3. 部分地图可能包含不止一个的挑战规则，每个规则都有独立的排行榜，且同样计入总榜分数。`,
            ].join(`\n`),
            [
                `In the War Room mode, every time you complete a challenge, a score will be generated placing you in the server's ranking.`,
                ``,
                `This mode also includes an overall leaderboard. The more challenges you complete, and the higher your score in each of them, the higher will be your score and ranking in the overall leaderboard.`,
                ``,
                `Note:`,
                `1. Scores are calculated solely based on the number of turns and actions spent to complete a given challenge, so that score = 100000 - (turns - 1) * 1000 - actions`,
                `2. You can retry a given challenge as many times as you want and only your highest score will be kept.`,
                `3. Some challenges contain multiple variations, such as different difficulty setting. Each variation has an independent leaderboard and are all added to the score for the overall leaderboard.`,
            ].join(`\n`),
            [
                `No modo Desafios, a cada vez que você completa um desafio uma pontuação é gerada colocando-lhe no ranqueamento do servidor.`,
                ``,
                `Este modo também inclui um placar geral. Quanto mais desafios você completar, e quanto maior for sua pontuação em cada um destes, maior será sua pontuação e colocação deste placar geral.`,
                ``,
                `Note:`,
                `1. Pontuações sã ocalculadas baseadas apenas no número de turnos e ações usadas para se completar um dado desafio, tal que pontuação = 100000 - (turnos - 1) * 1000 - ações`,
                `2. Você pode tentar novamente um mesmo desafio quantas vezes quiser e apenas sua pontuação mais elevada será mantida.`,
                `3. Alguns desafios contém multiplas variações, tais quais diferentes níveis de dificuldade. Cada variação possui um placar próprio e é contabilizada para a pontuação tida no placar geral.`,
            ].join(`\n`),
        ],

        [LangTextType.R0012]: [
            `若回合数超过了回合限制，或战局总动作数超过了动作数限制，则本局游戏将自动以和局结束。`,
            `If there is no winner when the turn or action limit is reached, the game automatically ends in a draw.`,
            `Se não houver vencedor quando o limite de turnos ou de ações for atingido, o jogo será automaticamente encerrado em empate.`,
        ],

        [LangTextType.R0013]: [
            `每回合的可用时间是固定不变的。`,
            `The available time for each turn fixed.`,
            `O tempo disponível para cada turno é fixo.`,
        ],

        [LangTextType.R0014]: [
            [
                `增量计时：玩家每回合可用的时间将受到前面回合所消耗的时间的影响。此模式有三个参数，分别为“初始时间”，“部队增量时间”和“回合增量时间”。`,
                ``,
                `第一回合，玩家拥有的时间就是“初始时间”。`,
                `第二及后续所有回合，玩家拥有的时间=上一个回合的剩余时间+（上回合结束时的剩余部队数*部队增量时间）+回合增量时间。`,
                ``,
                `比如，假设部队增量时间是5秒，回合增量时间是60秒，上回合剩余时间是180秒，且你有10个部队`,
                `那么本回合可用时间为: 180 + 5 * 10 + 60 = 290秒。`,
            ].join("\n"),
            [
                `The time available for each turn will be affected by the time consumed in its the previous turn.`,
                `This mode has three parameters, namely "Initial Time" "Incremental Time per Unit" and "Incremental Time per Turn".`,
                ``,
                `For the first turn, the time each player has is the "Initial Time".`,
                `For all subsequent turns, the time each player will have will be the sum of: the number of units under their control times "Incremental Time per Unit", plus the remaining time of their own previous turn, plus the "Incremental Time per Turn".`,
                ``,
                `For example, assume the "Incremental Time per Unit" is 5s and one has 10 units, the "Incremental Time per Turn" is 60s, and the remaining time of one's previous turn is 180s.`,
                `Then the available time for this turn is: 5 * 10 + 60 + 180 = 290s.`,
            ].join("\n"),
            [
                `O tempo disponível para cada rodada será afetado pela quantidade de tempo consumida no turno anterior.`,
                `Este modo possui apenas três parâmetros, à saber: "Tempo Inicial", "Incremento de Tempo por Unidade" e "Incremento de Tempo por Turno".`,
                ``,
                `Para o primeiro turno, o tempo que cada jogadore terá será o "Tempo Inicial".`,
                `Para todos os demais turnos, o tempo que estes cada um deste terá será o resultado da soma: o número de unidades sob seu controle vezes o "Incremento de Tempo por Unidadde", mais o tempo remanecente do turno anterior, mais o "Incremento de Tempo por Turno".`,
                ``,
                `Por exemplo, assuma que o "Incremento de Tempo por Unidade" é 5s e que se tem 10 unidades, o "Incremento de Tempo por Turno" é 60s, e que o tempo remanecente do turno anterior é 180s.`,
                `Então o tempo disponível para o atual turno é: 5 * 10 + 60 + 180 = 290s.`
            ].join("\n"),
        ],
    };
}

// export default TwnsLangCommonText;
