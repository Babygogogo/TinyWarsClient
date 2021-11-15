
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsPanelManager {
    import PanelConfig  = TwnsPanelConfig.PanelConfig;

    const _IS_CACHE_ENABLED         = true;
    const _openingPanelSet          = new Set<PanelConfig<any>>();
    const _runningPanelDict         = new Map<PanelConfig<any>, TwnsUiPanel2.UiPanel2<any>>();
    const _cachedPanelDict          = new Map<PanelConfig<any>, TwnsUiPanel2.UiPanel2<any>>();
    const _closingPanelCallbackDict = new Map<PanelConfig<any>, () => void>();

    /**
     * 打开面板不是瞬时的（因为可能需要加载远程资源），如果同一个面板的前一次open尚未结束就又open，那么第二次open将会被忽略。
     *
     * 如果指定面板正处于打开状态（无论打开动画是否播放完毕），那么会使用该面板实例直接显示新数据。
     *
     * 如果指定面板正处于关闭过程，那么该关闭过程将被中断，并使用该面板实例直接显示（会重新进行必要的事件注册、显示打开动画）。
     *
     * 如果指定面板已被创建并缓存过，则会使用该缓存实例来显示（会重新进行必要的事件注册、显示打开动画）。
     *
     * 如果不是以上情况，则会从头创建面板。
     * @return 若此次open被忽略就返回null，否则返回面板实例。
     */
    export async function open<T>(config: PanelConfig<T>, openData: T): Promise<TwnsUiPanel2.UiPanel2<T> | null> {
        if (checkIsOpeningPanel(config)) {
            Logger.warn(`Panel open ignored: ${config.name}`);
            return null;
        }

        addOpeningPanel(config);
        const panel = getRunningPanel(config)
            ? await openViaRunningPanel(config, openData)
            : (getCachedPanel(config)
                ? await openViaCachedPanel(config, openData)
                : await openViaCreatePanel(config, openData)
            );
        deleteOpeningPanel(config);

        return panel;
    }
    async function openViaRunningPanel<T>(config: PanelConfig<T>, openData: T): Promise<TwnsUiPanel2.UiPanel2<T>> {
        const panel = Helpers.getExisted(getRunningPanel(config));
        if (!checkIsClosingPanel(config)) {
            Logger.warn(`Panel opened via running: ${panel.skinName}`);
            await panel.updateWithOpenData(openData);
        } else {
            Logger.warn(`Panel opened via closing: ${panel.skinName}`);
            panel.removeEventListener(TwnsUiPanel2.EVENT_PANEL_CLOSE_ANIMATION_ENDED, Helpers.getExisted(getClosingPanelCallback(config)), null);
            deleteClosingPanelCallback(config);

            panel.stopCloseAnimation();
            await panel.initOnOpening(openData);
        }

        return panel;
    }
    async function openViaCachedPanel<T>(config: PanelConfig<T>, openData: T): Promise<TwnsUiPanel2.UiPanel2<T>> {
        const panel = Helpers.getExisted(getCachedPanel(config));
        const layer = StageManager.getLayer(config.layer);
        if (config.isExclusive) {
            layer.closeAllPanels();
        }
        layer.addChild(panel);

        if (!panel.getIsChildrenCreated()) {
            await new Promise<void>(resolve => panel.once(TwnsUiPanel2.EVENT_PANEL_CHILDREN_CREATED, () => resolve(), null));
        }

        await panel.initOnOpening(openData);

        addRunningPanel(config, panel);
        Logger.warn(`Panel opened via cache: ${panel.skinName}`);

        return panel;
    }
    async function openViaCreatePanel<T>(config: PanelConfig<T>, openData: T): Promise<TwnsUiPanel2.UiPanel2<T>> {
        const panel = await createPanel(config);
        const layer = StageManager.getLayer(config.layer);
        if (config.isExclusive) {
            layer.closeAllPanels();
        }
        layer.addChild(panel);

        if (!panel.getIsChildrenCreated()) {
            await new Promise<void>(resolve => panel.once(TwnsUiPanel2.EVENT_PANEL_CHILDREN_CREATED, () => resolve(), null));
        }

        await panel.initOnOpening(openData);

        addRunningPanel(config, panel);
        if ((_IS_CACHE_ENABLED) && (config.needCache)) {
            addCachedPanel(config, panel);
        }

        Logger.warn(`Panel opened via creating: ${panel.skinName}`);
        return panel;
    }

    /**
     * 关闭面板不是瞬时的（因为存在关闭动画），如果关闭过程中又调用了open，那么这次关闭将不会完整执行。
     *
     * 如果指定面板已经在关闭过程中，或者尚未被正式打开（无论是否在open过程中），那么此次关闭将直接被忽略。
     */
    export function close<T>(config: PanelConfig<T>): void {
        if (checkIsClosingPanel(config)) {
            Logger.warn(`Panel close ignored because it's closing: ${config.name}`);
            return;
        }

        if (checkIsOpeningPanel(config)) {
            Logger.warn(`Panel close ignored because it's opening: ${config.name}`);
            return;
        }

        const panel = getRunningPanel(config);
        if (panel == null) {
            Logger.warn(`Panel close ignored because it's not opened: ${config.name}`);
            return;
        }

        const callback = () => {
            deleteClosingPanelCallback(config);
            deleteRunningPanel(config);

            const parent = panel.parent;
            (parent) && (parent.removeChild(panel));
            Logger.warn(`Panel closed: ${panel.skinName}`);
        };
        addClosingPanelCallback(config, callback);
        panel.once(TwnsUiPanel2.EVENT_PANEL_CLOSE_ANIMATION_ENDED, callback, null);
        panel.clearOnClosing();
    }

    async function createPanel<T>(config: PanelConfig<T>): Promise<TwnsUiPanel2.UiPanel2<T>> {
        const panel = new config.cls();
        panel.setPanelConfig(config);

        if (panel.getIsSkinLoaded()) {
            return panel;
        } else {
            return await new Promise<TwnsUiPanel2.UiPanel2<T>>(resolve => {
                panel.once(TwnsUiPanel2.EVENT_PANEL_SKIN_LOADED, () => resolve(panel), null);
            });
        }
    }

    function checkIsOpeningPanel<T>(config: PanelConfig<T>): boolean {
        return _openingPanelSet.has(config);
    }
    function addOpeningPanel<T>(config: PanelConfig<T>): void {
        _openingPanelSet.add(config);
    }
    function deleteOpeningPanel<T>(config: PanelConfig<T>): void {
        _openingPanelSet.delete(config);
    }

    // function checkIsRunningPanel<T>(config: PanelConfig<T>): boolean {
    //     return _runningPanelDict.has(config);
    // }
    export function getRunningPanel<T>(config: PanelConfig<T>): TwnsUiPanel2.UiPanel2<T> | null {
        return _runningPanelDict.get(config) ?? null;
    }
    function addRunningPanel<T>(config: PanelConfig<T>, panel: TwnsUiPanel2.UiPanel2<T>): void {
        _runningPanelDict.set(config, panel);
    }
    function deleteRunningPanel<T>(config: PanelConfig<T>): void {
        _runningPanelDict.delete(config);
    }

    function getCachedPanel<T>(config: PanelConfig<T>): TwnsUiPanel2.UiPanel2<T> | null {
        return _cachedPanelDict.get(config) ?? null;
    }
    function addCachedPanel<T>(config: PanelConfig<T>, panel: TwnsUiPanel2.UiPanel2<T>): void {
        _cachedPanelDict.set(config, panel);
    }
    // function deleteCachedPanel<T>(config: PanelConfig<T>): void {
    //     _cachedPanelDict.delete(config);
    // }

    function checkIsClosingPanel<T>(config: PanelConfig<T>): boolean {
        return _closingPanelCallbackDict.has(config);
    }
    function getClosingPanelCallback<T>(config: PanelConfig<T>): (() => void) | null {
        return _closingPanelCallbackDict.get(config) ?? null;
    }
    function addClosingPanelCallback<T>(config: PanelConfig<T>, callback: () => void): void {
        _closingPanelCallbackDict.set(config, callback);
    }
    function deleteClosingPanelCallback<T>(config: PanelConfig<T>): void {
        _closingPanelCallbackDict.delete(config);
    }

    // const enum PanelState {
    //     Opening,
    //     Running,
    //     Closing,
    // }

    // const _cachedOpenInfoDict   = new Map<PanelConfig<any>, { hasStarted: boolean, openData: any }>();
    // const _runningPanelDict     = new Map<PanelConfig<any>, TwnsUiPanel2.UiPanel2<any>>();
    // const _closingPanelDict     = new Map<PanelConfig<any>, TwnsUiPanel2.UiPanel2<any>>();

    // export async function open<T>(config: PanelConfig<T>, openData: T): Promise<TwnsUiPanel2.UiPanel2<T>> {
    //     if (checkIsCreatingPanel(config)) {
    //         return openPanelWhenCreating(config, openData);
    //     }

    //     if (checkIsClosingPanel(config)) {
    //         return openPanelWhenClosing(config, openData);
    //     }

    //     if (checkIsRunningPanel(config)) {
    //         return openPanelWhenRunning(config, openData);
    //     }


    //     const panel = new config.cls();
    //     panel.open(openData);

    //     return panel;
    // }
    // async function openPanelWhenCreating<T>(config: PanelConfig<T>, openData: T): Promise<TwnsUiPanel2.UiPanel2<T>> {
    //     if (checkIsRunningPanel(config)) {
    //         throw Helpers.newError(`PanelManager.openPanelWhenCreating() the panel is running: ${config.name}`);
    //     }
    //     if (checkIsClosingPanel(config)) {
    //         throw Helpers.newError(`PanelManager.openPanelWhenCreating() the panel is being closed: ${config.name}`);
    //     }

    //     const cachedOpenInfo = getCachedOpenInfo(config);
    //     if (!cachedOpenInfo?.hasStarted) {
    //         throw Helpers.newError(`PanelManager.openPanelWhenCreating() the panel is not being created: ${config.name}`);
    //     }
    //     cachedOpenInfo.openData = openData;

    //     return new Promise<TwnsUiPanel2.UiPanel2<T>>(resolve => {
    //         const callback = (e: egret.Event) => {
    //             const data = e.data as NotifyData.PanelManagerPanelCreated<T>;
    //             if (data.panelConfig === config) {
    //                 Notify.removeEventListener(NotifyType.PanelManagerPanelCreated, callback);
    //                 resolve(data.panel);
    //             }
    //         };

    //         Notify.addEventListener(NotifyType.PanelManagerPanelCreated, callback);
    //     });
    // }
    // async function openPanelWhenClosing<T>(config: PanelConfig<T>, openData: T): Promise<TwnsUiPanel2.UiPanel2<T>> {
    //     if (checkIsCreatingPanel(config)) {
    //         throw Helpers.newError(`PanelManager.openPanelWhenClosing() the panel is being created: ${config.name}`);
    //     }
    //     if (checkIsRunningPanel(config)) {
    //         throw Helpers.newError(`PanelManager.openPanelWhenClosing() the panel is running: ${config.name}`);
    //     }

    //     const cachedOpenInfo = getCachedOpenInfo(config);
    //     if (cachedOpenInfo) {
    //         if (cachedOpenInfo.hasStarted) {
    //             throw Helpers.newError(`PanelManager.openPanelWhenClosing() the panel is being created: ${config.name}`);
    //         }
    //         cachedOpenInfo.openData = openData;
    //     } else {
    //         setCachedOpenInfo(config, openData, false);

    //         const callback = (e: egret.Event) => {
    //             const data = e.data as NotifyData.PanelManagerPanelClosed<T>;
    //             if (data.panelConfig === config) {
    //                 Notify.removeEventListener(NotifyType.PanelManagerPanelClosed, callback);

    //             }
    //         };

    //         Notify.addEventListener(NotifyType.PanelManagerPanelClosed, callback);
    //     }

    //     return new Promise<TwnsUiPanel2.UiPanel2<T>>(resolve => {
    //         const callback = (e: egret.Event) => {
    //             const data = e.data as NotifyData.PanelManagerPanelCreated<T>;
    //             if (data.panelConfig === config) {
    //                 Notify.removeEventListener(NotifyType.PanelManagerPanelCreated, callback);
    //                 resolve(data.panel);
    //             }
    //         };

    //         Notify.addEventListener(NotifyType.PanelManagerPanelCreated, callback);
    //     });
    // }
    // async function openPanelWhenRunning<T>(config: PanelConfig<T>, openData: T): Promise<TwnsUiPanel2.UiPanel2<T>> {
    //     if (checkIsCreatingPanel(config)) {
    //         throw Helpers.newError(`PanelManager.openPanelWhenRunning() the panel is being created: ${config.name}`);
    //     }
    //     if (checkIsClosingPanel(config)) {
    //         throw Helpers.newError(`PanelManager.openPanelWhenRunning() the panel is being closed: ${config.name}`);
    //     }

    //     const panel = Helpers.getExisted(getRunningPanel(config));
    //     panel.setOpenData(openData);
    //     panel.updateOnOpenDataChanged();
    //     return panel;
    // }

    // function checkIsCreatingPanel<T>(config: PanelConfig<T>): boolean {
    //     return !!(getCachedOpenInfo(config)?.hasStarted);
    // }
    // function getCachedOpenInfo<T>(config: PanelConfig<T>): { hasStarted: boolean, openData: T } | null {
    //     return _cachedOpenInfoDict.get(config) ?? null;
    // }
    // function setCachedOpenInfo<T>(config: PanelConfig<T>, openData: T, hasStarted: boolean): void {
    //     _cachedOpenInfoDict.set(config, { hasStarted, openData });
    // }

    // function checkIsRunningPanel<T>(config: PanelConfig<T>): boolean {
    //     return _runningPanelDict.has(config);
    // }
    // function getRunningPanel<T>(config: PanelConfig<T>): TwnsUiPanel2.UiPanel2<T> | null {
    //     return _runningPanelDict.get(config) ?? null;
    // }

    // function checkIsClosingPanel<T>(config: PanelConfig<T>): boolean {
    //     return _closingPanelDict.has(config);
    // }
}
