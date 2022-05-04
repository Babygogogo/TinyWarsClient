
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.PanelHelpers {
    import ClientErrorCode  = Twns.ClientErrorCode;

    const _IS_CACHE_ENABLED = true;
    const _runningPanelDict = new Map<PanelConfig<any>, TwnsUiPanel.UiPanel<any>>();
    const _cachedPanelDict  = new Map<PanelConfig<any>, TwnsUiPanel.UiPanel<any>>();
    const _queueDict        = new Map<PanelConfig<any>, (() => Promise<void>)[]>();

    /**
     * 打开面板不是瞬时的，因为可能需要加载远程资源。
     *
     * 同一个面板所有open与close会依照调用时间顺序被插入到同一个队列中，并依序执行。每个面板都有专属的唯一队列。
     *
     * 轮到此次open时，执行逻辑如下：
     *
     * 如果指定面板正处于打开状态（无论打开动画是否播放完毕），那么会使用该面板实例直接显示新数据。
     *
     * 如果指定面板已被创建并缓存过，则会使用该缓存实例来显示（会重新进行必要的事件注册、显示打开动画）。
     *
     * 如果不是以上情况，则会从头创建面板。
     */
    export async function open<T>(config: PanelConfig<T>, openData: T): Promise<TwnsUiPanel.UiPanel<T>> {
        return addToQueue(config, () => doOpen(config, openData));
    }
    async function doOpen<T>(config: PanelConfig<T>, openData: T): Promise<TwnsUiPanel.UiPanel<T>> {
        return getRunningPanel(config)
            ? openViaRunningPanel(config, openData)
            : (getCachedPanel(config)
                ? openViaCachedPanel(config, openData)
                : openViaCreatePanel(config, openData)
            );
    }
    async function openViaRunningPanel<T>(config: PanelConfig<T>, openData: T): Promise<TwnsUiPanel.UiPanel<T>> {
        const panel = Twns.Helpers.getExisted(getRunningPanel(config), ClientErrorCode.PanelManager_OpenViaRunningPanel_00);
        await panel.updateWithOpenData(openData);

        Logger.warn(`Panel opened via running: ${config.skinName}`);
        return panel;
    }
    async function openViaCachedPanel<T>(config: PanelConfig<T>, openData: T): Promise<TwnsUiPanel.UiPanel<T>> {
        const panel     = Twns.Helpers.getExisted(getCachedPanel(config), ClientErrorCode.PanelManager_OpenViaCachedPanel_00);
        const layerType = config.layer;
        if (config.isExclusive) {
            closeAllPanelsInLayerExcept(layerType, [config]);
        }
        StageManager.getLayer(layerType).addChild(panel);

        await panel.initOnOpening(openData);

        addRunningPanel(config, panel);

        Logger.warn(`Panel opened via cache: ${config.skinName}`);
        return panel;
    }
    async function openViaCreatePanel<T>(config: PanelConfig<T>, openData: T): Promise<TwnsUiPanel.UiPanel<T>> {
        const panel     = await createPanel(config);
        const layerType = config.layer;
        if (config.isExclusive) {
            closeAllPanelsInLayerExcept(layerType, [config]);
        }
        StageManager.getLayer(layerType).addChild(panel);

        if (!panel.getIsChildrenCreated()) {
            await new Promise<void>(resolve => panel.once(TwnsUiPanel.EVENT_PANEL_CHILDREN_CREATED, resolve, null));
        }

        await panel.initOnOpening(openData);

        addRunningPanel(config, panel);
        if ((_IS_CACHE_ENABLED) && (config.needCache)) {
            addCachedPanel(config, panel);
        }

        Logger.warn(`Panel opened via creating: ${config.skinName}`);
        return panel;
    }

    /**
     * 关闭面板不是瞬时的，因为可能存在关闭动画。
     *
     * 同一个面板所有open与close会依照调用时间顺序被插入到同一个队列中，并依序执行。每个面板都有专属的唯一队列。
     *
     * 轮到此次close时，如果指定面板未被打开，那么此次关闭将直接被忽略，否则就正常进行关闭。
     */
    export async function close<T>(config: PanelConfig<T>): Promise<void> {
        addToQueue(config, () => doClose(config));
    }
    async function doClose<T>(config: PanelConfig<T>): Promise<void> {
        const panel = getRunningPanel(config);
        if (panel == null) {
            Logger.warn(`Panel close ignored because it's not opened: ${config.skinName}`);
            return;
        }

        await panel.clearOnClosing();

        const parent = panel.parent;
        (parent) && (parent.removeChild(panel));
        deleteRunningPanel(config);

        Logger.warn(`Panel closed: ${config.skinName}`);
    }
    export async function closeAllPanelsExcept(exceptions: PanelConfig<any>[] = []): Promise<void> {
        const promiseArray: Promise<void>[] = [];
        for (const [config, queue] of _queueDict) {
            if (((queue.length) || (getRunningPanel(config)))   &&
                (exceptions.indexOf(config) < 0)
            ) {
                promiseArray.push(close(config));
            }
        }

        await Promise.all(promiseArray);
    }
    async function closeAllPanelsInLayerExcept(layer: Types.LayerType, exceptions: PanelConfig<any>[] = []): Promise<void> {
        const promiseArray: Promise<void>[] = [];
        for (const [config, queue] of _queueDict) {
            if (((queue.length) || (getRunningPanel(config)))   &&
                (config.layer === layer)                        &&
                (exceptions.indexOf(config) < 0)
            ) {
                promiseArray.push(close(config));
            }
        }

        await Promise.all(promiseArray);
    }

    async function createPanel<T>(config: PanelConfig<T>): Promise<TwnsUiPanel.UiPanel<T>> {
        const panel     = new config.cls();
        panel.skinName  = config.skinName;
        panel.setPanelConfig(config);

        if (!panel.getIsSkinLoaded()) {
            await new Promise<void>(resolve => panel.once(TwnsUiPanel.EVENT_PANEL_SKIN_LOADED, resolve, null));
        }

        return panel;
    }

    export function getRunningPanel<T>(config: PanelConfig<T>): TwnsUiPanel.UiPanel<T> | null {
        return _runningPanelDict.get(config) ?? null;
    }
    function addRunningPanel<T>(config: PanelConfig<T>, panel: TwnsUiPanel.UiPanel<T>): void {
        _runningPanelDict.set(config, panel);
    }
    function deleteRunningPanel<T>(config: PanelConfig<T>): void {
        _runningPanelDict.delete(config);
    }

    function getCachedPanel<T>(config: PanelConfig<T>): TwnsUiPanel.UiPanel<T> | null {
        return _cachedPanelDict.get(config) ?? null;
    }
    function addCachedPanel<T>(config: PanelConfig<T>, panel: TwnsUiPanel.UiPanel<T>): void {
        _cachedPanelDict.set(config, panel);
    }

    function addToQueue<T>(config: PanelConfig<any>, rawFunc: () => Promise<T>): Promise<T> {
        return new Promise<T>((resolve) => {
            const func = async (): Promise<void> => {
                const funcList = _queueDict.get(config);
                if (!funcList) {
                    throw Twns.Helpers.newError(`PanelManager.addToQueue() exception queueing 1!!`, ClientErrorCode.PanelManager_AddToQueue_00);
                } else {
                    if (funcList[0] !== func) {
                        throw Twns.Helpers.newError(`PanelManager.addToQueue() exception queueing 2!!`, ClientErrorCode.PanelManager_AddToQueue_01);
                    } else {
                        const result = await rawFunc();
                        if (funcList.shift() !== func) {
                            throw Twns.Helpers.newError(`PanelManager.addToQueue() exception queueing 3!!`, ClientErrorCode.PanelManager_AddToQueue_02);
                        }
                        resolve(result);

                        if (funcList.length) {
                            funcList[0]();
                        } else {
                            // _queueDict.delete(config);
                        }
                    }
                }
            };

            const currQueue = _queueDict.get(config);
            if (currQueue) {
                currQueue.push(func);
                (currQueue.length === 1) && (func());
            } else {
                _queueDict.set(config, [func]);
                func();
            }
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // 以下版本支持用open打断进行中的close，但为避免内存泄漏而难以支持async close
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // const _IS_CACHE_ENABLED         = true;
    // const _openingPanelSet          = new Set<PanelConfig<any>>();
    // const _runningPanelDict         = new Map<PanelConfig<any>, TwnsUiPanel2.UiPanel2<any>>();
    // const _cachedPanelDict          = new Map<PanelConfig<any>, TwnsUiPanel2.UiPanel2<any>>();
    // const _closingPanelCallbackDict = new Map<PanelConfig<any>, () => void>();

    // /**
    //  * 打开面板不是瞬时的（因为可能需要加载远程资源），如果同一个面板的前一次open尚未结束就又open，那么第二次open将会被忽略。
    //  *
    //  * 如果指定面板正处于打开状态（无论打开动画是否播放完毕），那么会使用该面板实例直接显示新数据。
    //  *
    //  * 如果指定面板正处于关闭过程，那么该关闭过程将被中断，并使用该面板实例直接显示（会重新进行必要的事件注册、显示打开动画）。
    //  *
    //  * 如果指定面板已被创建并缓存过，则会使用该缓存实例来显示（会重新进行必要的事件注册、显示打开动画）。
    //  *
    //  * 如果不是以上情况，则会从头创建面板。
    //  * @return 若此次open被忽略就返回null，否则返回面板实例。
    //  */
    // export async function open<T>(config: PanelConfig<T>, openData: T): Promise<TwnsUiPanel2.UiPanel2<T> | null> {
    //     if (checkIsOpeningPanel(config)) {
    //         Logger.warn(`Panel open ignored: ${config.name}`);
    //         return null;
    //     }

    //     addOpeningPanel(config);
    //     const panel = getRunningPanel(config)
    //         ? await openViaRunningPanel(config, openData)
    //         : (getCachedPanel(config)
    //             ? await openViaCachedPanel(config, openData)
    //             : await openViaCreatePanel(config, openData)
    //         );
    //     deleteOpeningPanel(config);

    //     return panel;
    // }
    // async function openViaRunningPanel<T>(config: PanelConfig<T>, openData: T): Promise<TwnsUiPanel2.UiPanel2<T>> {
    //     const panel = Helpers.getExisted(getRunningPanel(config), ClientErrorCode.PanelManager_OpenViaRunningPanel_00);
    //     if (!checkIsClosingPanel(config)) {
    //         Logger.warn(`Panel opened via running: ${panel.skinName}`);
    //         await panel.updateWithOpenData(openData);
    //     } else {
    //         Logger.warn(`Panel opened via closing: ${panel.skinName}`);
    //         panel.removeEventListener(
    //             TwnsUiPanel2.EVENT_PANEL_CLOSE_ANIMATION_ENDED,
    //             Helpers.getExisted(getClosingPanelCallback(config), ClientErrorCode.PanelManager_OpenViaRunningPanel_01),
    //             null
    //         );
    //         deleteClosingPanelCallback(config);

    //         panel.stopCloseAnimation();
    //         await panel.initOnOpening(openData);
    //     }

    //     return panel;
    // }
    // async function openViaCachedPanel<T>(config: PanelConfig<T>, openData: T): Promise<TwnsUiPanel2.UiPanel2<T>> {
    //     const panel = Helpers.getExisted(getCachedPanel(config), ClientErrorCode.PanelManager_OpenViaCachedPanel_00);
    //     const layer = StageManager.getLayer(config.layer);
    //     if (config.isExclusive) {
    //         layer.closeAllPanels();
    //     }
    //     layer.addChild(panel);

    //     if (!panel.getIsChildrenCreated()) {
    //         await new Promise<void>(resolve => panel.once(TwnsUiPanel2.EVENT_PANEL_CHILDREN_CREATED, () => resolve(), null));
    //     }

    //     await panel.initOnOpening(openData);

    //     addRunningPanel(config, panel);
    //     Logger.warn(`Panel opened via cache: ${panel.skinName}`);

    //     return panel;
    // }
    // async function openViaCreatePanel<T>(config: PanelConfig<T>, openData: T): Promise<TwnsUiPanel2.UiPanel2<T>> {
    //     const panel = await createPanel(config);
    //     const layer = StageManager.getLayer(config.layer);
    //     if (config.isExclusive) {
    //         layer.closeAllPanels();
    //     }
    //     layer.addChild(panel);

    //     if (!panel.getIsChildrenCreated()) {
    //         await new Promise<void>(resolve => panel.once(TwnsUiPanel2.EVENT_PANEL_CHILDREN_CREATED, () => resolve(), null));
    //     }

    //     await panel.initOnOpening(openData);

    //     addRunningPanel(config, panel);
    //     if ((_IS_CACHE_ENABLED) && (config.needCache)) {
    //         addCachedPanel(config, panel);
    //     }

    //     Logger.warn(`Panel opened via creating: ${panel.skinName}`);
    //     return panel;
    // }

    // /**
    //  * 关闭面板不是瞬时的（因为存在关闭动画），如果关闭过程中又调用了open，那么这次关闭将不会完整执行。
    //  *
    //  * 如果指定面板已经在关闭过程中，或者尚未被正式打开（无论是否在open过程中），那么此次关闭将直接被忽略。
    //  */
    // export function close<T>(config: PanelConfig<T>): void {
    //     if (checkIsClosingPanel(config)) {
    //         Logger.warn(`Panel close ignored because it's closing: ${config.name}`);
    //         return;
    //     }

    //     if (checkIsOpeningPanel(config)) {
    //         Logger.warn(`Panel close ignored because it's opening: ${config.name}`);
    //         return;
    //     }

    //     const panel = getRunningPanel(config);
    //     if (panel == null) {
    //         Logger.warn(`Panel close ignored because it's not opened: ${config.name}`);
    //         return;
    //     }

    //     const callback = () => {
    //         deleteClosingPanelCallback(config);
    //         deleteRunningPanel(config);

    //         const parent = panel.parent;
    //         (parent) && (parent.removeChild(panel));
    //         Logger.warn(`Panel closed: ${panel.skinName}`);
    //     };
    //     addClosingPanelCallback(config, callback);
    //     panel.once(TwnsUiPanel2.EVENT_PANEL_CLOSE_ANIMATION_ENDED, callback, null);
    //     panel.clearOnClosing();
    // }

    // async function createPanel<T>(config: PanelConfig<T>): Promise<TwnsUiPanel2.UiPanel2<T>> {
    //     const panel = new config.cls();
    //     panel.setPanelConfig(config);

    //     if (panel.getIsSkinLoaded()) {
    //         return panel;
    //     } else {
    //         return await new Promise<TwnsUiPanel2.UiPanel2<T>>(resolve => {
    //             panel.once(TwnsUiPanel2.EVENT_PANEL_SKIN_LOADED, () => resolve(panel), null);
    //         });
    //     }
    // }

    // function checkIsOpeningPanel<T>(config: PanelConfig<T>): boolean {
    //     return _openingPanelSet.has(config);
    // }
    // function addOpeningPanel<T>(config: PanelConfig<T>): void {
    //     _openingPanelSet.add(config);
    // }
    // function deleteOpeningPanel<T>(config: PanelConfig<T>): void {
    //     _openingPanelSet.delete(config);
    // }

    // export function getRunningPanel<T>(config: PanelConfig<T>): TwnsUiPanel2.UiPanel2<T> | null {
    //     return _runningPanelDict.get(config) ?? null;
    // }
    // function addRunningPanel<T>(config: PanelConfig<T>, panel: TwnsUiPanel2.UiPanel2<T>): void {
    //     _runningPanelDict.set(config, panel);
    // }
    // function deleteRunningPanel<T>(config: PanelConfig<T>): void {
    //     _runningPanelDict.delete(config);
    // }

    // function getCachedPanel<T>(config: PanelConfig<T>): TwnsUiPanel2.UiPanel2<T> | null {
    //     return _cachedPanelDict.get(config) ?? null;
    // }
    // function addCachedPanel<T>(config: PanelConfig<T>, panel: TwnsUiPanel2.UiPanel2<T>): void {
    //     _cachedPanelDict.set(config, panel);
    // }

    // function checkIsClosingPanel<T>(config: PanelConfig<T>): boolean {
    //     return _closingPanelCallbackDict.has(config);
    // }
    // function getClosingPanelCallback<T>(config: PanelConfig<T>): (() => void) | null {
    //     return _closingPanelCallbackDict.get(config) ?? null;
    // }
    // function addClosingPanelCallback<T>(config: PanelConfig<T>, callback: () => void): void {
    //     _closingPanelCallbackDict.set(config, callback);
    // }
    // function deleteClosingPanelCallback<T>(config: PanelConfig<T>): void {
    //     _closingPanelCallbackDict.delete(config);
    // }
}
