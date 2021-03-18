
namespace TinyWars.Utility.CompatibilityHelper {
    export function init(): void {
        initListenerForWindowOnError();
        initListenersForGameShowAndHide();
        preventBrowserBack();
    }

    function initListenerForWindowOnError(): void {
        window.onerror = (message, filename, row, col, err) => {
            const content = `${message}\n\n${err ? err.stack : "No available call stack."}`;
            Common.CommonErrorPanel.show({
                content,
            });
            Chat.ChatProxy.reqChatAddMessage(
                content.substr(0, CommonConstants.ChatContentMaxLength),
                Types.ChatMessageToCategory.Private,
                CommonConstants.AdminUserId,
            );
        };
    }

    function initListenersForGameShowAndHide(): void {
        if (!window.document) {
            return;
        }

        if (("onpageshow" in window) && ("onpagehide" in window)) {
            window.addEventListener("pagehide", onGameHide, false);
            window.addEventListener("pageshow", onGameShow, false);
        }
        window.addEventListener("qbrowserVisibilityChange", e => {
            if (e && e["hidden"]) {
                onGameHide();
            } else {
                onGameShow();
            }
        });

        const doc   = window.document;
        let hidden  : string;
        if (doc.hidden != null) {
            hidden = "hidden";
        } else if (doc["mozHidden"] != null) {
            hidden = "mozHidden";
        } else if (doc["msHidden"] != null) {
            hidden = "msHidden";
        } else if (doc["webkitHidden"] != null) {
            hidden = "webkitHidden";
        }

        if (hidden) {
            const changeTypeList = [
                "visibilitychange",
                "mozvisibilitychange",
                "msvisibilitychange",
                "webkitvisibilitychange",
                "qbrowserVisibilityChange",
            ];
            for (const changeType of changeTypeList) {
                window.document.addEventListener(changeType, event => {
                    if (window.document[hidden] || event["hidden"]) {
                        onGameHide();
                    } else {
                        onGameShow();
                    }
                }, false);
            }
        } else {
            window.addEventListener("blur", onGameHide, false);
            window.addEventListener("focus", onGameShow, false);
        }

        const ua = navigator ? navigator.userAgent || `` : ``;
        if ((/mqq/gi.test(ua))          ||
            (/mobile.*qq/gi.test(ua))   ||
            (/micromessenger/gi.test(ua))
        ) {
            if (window.browser == null) {
                window.browser = {};
            }

            const browser       = window.browser;
            browser.execWebFn   = browser.execWebFn || {};
            browser.execWebFn.postX5GamePlayerMessage = (event) => {
                const eventType = event.type;
                if (eventType == "app_enter_background") {
                    onGameHide();
                } else if (eventType == "app_enter_foreground") {
                    onGameShow();
                }
            };
        }
    }

    function preventBrowserBack(): void {
        const state = {
            url: window.location.href,
        };
        try {
            if (window.history) {
                window.history.pushState(state, "", window.location.href);
            }
        } catch (e) {
            Logger.error(e);
        }

        if (window.addEventListener) {
            window.addEventListener("popstate", (e) => {
                FloatText.show(Lang.getText(Lang.Type.A0194));
            }, false);
        }
    }

    function onGameHide(): void {
        SoundManager.pause();
    }

    function onGameShow(): void {
        SoundManager.resume();
    }
}
