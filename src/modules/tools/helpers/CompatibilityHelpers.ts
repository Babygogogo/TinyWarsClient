
import TwnsCommonErrorPanel from "../../common/view/CommonErrorPanel";
import TwnsLangTextType     from "../lang/LangTextType";
import Logger               from "./Logger";
import Types                from "./Types";
import ChatProxy            from "../../chat/model/ChatProxy";
import CommonConstants      from "./CommonConstants";
import FloatText            from "./FloatText";
import Lang                 from "../lang/Lang";
import SoundManager         from "./SoundManager";

namespace CompatibilityHelpers {
    import LangTextType     = TwnsLangTextType.LangTextType;

    export function init(): void {
        initListenerForWindowOnError();
        initListenersForGameShowAndHide();
        preventBrowserBack();
    }

    export function showError(e: unknown): void {
        const err = e as Types.CustomError;
        if (!err.isShown) {
            err.isShown = true;
            showErrorText(`${err.message}\n\n${err.stack || "No available call stack."}`);
        }
    }

    function initListenerForWindowOnError(): void {
        window.onerror = (message, filename, row, col, err) => {
            showErrorText(`${message}\n\n${err ? err.stack : "No available call stack."}`);
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
            if ((e) && ((e as any)["hidden"])) {
                onGameHide();
            } else {
                onGameShow();
            }
        });

        const doc   = window.document;
        let hidden  = ``;
        if (doc.hidden != null) {
            hidden = "hidden";
        } else if ((doc as any)["mozHidden"] != null) {
            hidden = "mozHidden";
        } else if ((doc as any)["msHidden"] != null) {
            hidden = "msHidden";
        } else if ((doc as any)["webkitHidden"] != null) {
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
                    if (((window.document as any)[hidden]) || ((event as any)["hidden"])) {
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
            browser.execWebFn.postX5GamePlayerMessage = (event: Event) => {
                const eventType = event.type;
                if (eventType == "app_enter_background") {
                    onGameHide();
                } else if (eventType == "app_enter_foreground") {
                    onGameShow();
                }
            };
        }
    }

    function showErrorText(text: string): void {
        TwnsCommonErrorPanel.CommonErrorPanel.show({
            content: text,
        });
        ChatProxy.reqChatAddMessage(
            text.substr(0, CommonConstants.ChatContentMaxLength),
            Types.ChatMessageToCategory.Private,
            CommonConstants.AdminUserId,
        );
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
            window.addEventListener("popstate", () => {
                FloatText.show(Lang.getText(LangTextType.A0194));
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

export default CompatibilityHelpers;
