
// import CommonModel              from "../../common/model/CommonModel";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import ConfigManager            from "../../tools/helpers/ConfigManager";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Timer                    from "../../tools/helpers/Timer";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Notify           from "../../tools/notify/NotifyType";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import UserModel                from "../../user/model/UserModel";
// import TwnsWarMapUnitView       from "../../warMap/view/WarMapUnitView";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Common {
    import NotifyType       = Notify.NotifyType;
    import LangTextType     = Lang.LangTextType;

    // eslint-disable-next-line no-shadow
    type TutorialInfo = {
        tutorialId      : number;
        titleTextType   : LangTextType;
        contentTextType : LangTextType;
        img             : string;
    };
    const TutorialInfoArray: TutorialInfo[] = [
        { tutorialId: 1,    titleTextType: LangTextType.B0932,  contentTextType: LangTextType.A0321, img: "tutorialContent0001" },
        { tutorialId: 2,    titleTextType: LangTextType.B0933,  contentTextType: LangTextType.A0322, img: "tutorialContent0002" },
        { tutorialId: 3,    titleTextType: LangTextType.B0934,  contentTextType: LangTextType.A0323, img: "tutorialContent0003" },
        { tutorialId: 4,    titleTextType: LangTextType.B0935,  contentTextType: LangTextType.A0324, img: "tutorialContent0004" },
        { tutorialId: 5,    titleTextType: LangTextType.B0936,  contentTextType: LangTextType.A0325, img: "tutorialContent0005" },
        { tutorialId: 6,    titleTextType: LangTextType.B0937,  contentTextType: LangTextType.A0326, img: "tutorialContent0006" },
        { tutorialId: 7,    titleTextType: LangTextType.B0938,  contentTextType: LangTextType.A0327, img: "tutorialContent0007" },
        { tutorialId: 8,    titleTextType: LangTextType.B0939,  contentTextType: LangTextType.A0328, img: "tutorialContent0008" },
        { tutorialId: 9,    titleTextType: LangTextType.B0940,  contentTextType: LangTextType.A0329, img: "tutorialContent0009" },
        { tutorialId: 10,   titleTextType: LangTextType.B0941,  contentTextType: LangTextType.A0330, img: "tutorialContent0010" },
        { tutorialId: 11,   titleTextType: LangTextType.B0942,  contentTextType: LangTextType.A0331, img: "tutorialContent0011" },
        { tutorialId: 12,   titleTextType: LangTextType.B0943,  contentTextType: LangTextType.A0332, img: "tutorialContent0012" },
        { tutorialId: 13,   titleTextType: LangTextType.B0944,  contentTextType: LangTextType.A0333, img: "tutorialContent0013" },
        { tutorialId: 14,   titleTextType: LangTextType.B0945,  contentTextType: LangTextType.A0334, img: "tutorialContent0014" },
        // { tutorialId: 15,   titleTextType: LangTextType.B0946,  contentTextType: LangTextType.A0335, img: "tutorialContent0015" },
        { tutorialId: 16,   titleTextType: LangTextType.B0947,  contentTextType: LangTextType.A0336, img: "tutorialContent0016" },
        { tutorialId: 17,   titleTextType: LangTextType.B0948,  contentTextType: LangTextType.A0337, img: "tutorialContent0017" },
        { tutorialId: 18,   titleTextType: LangTextType.B0949,  contentTextType: LangTextType.A0338, img: "tutorialContent0018" },
        { tutorialId: 19,   titleTextType: LangTextType.B0950,  contentTextType: LangTextType.A0339, img: "tutorialContent0019" },
        { tutorialId: 20,   titleTextType: LangTextType.B0951,  contentTextType: LangTextType.A0340, img: "tutorialContent0020" },
        { tutorialId: 21,   titleTextType: LangTextType.B0952,  contentTextType: LangTextType.A0341, img: "tutorialContent0021" },
        { tutorialId: 22,   titleTextType: LangTextType.B0953,  contentTextType: LangTextType.A0342, img: "tutorialContent0022" },
        { tutorialId: 23,   titleTextType: LangTextType.B0954,  contentTextType: LangTextType.A0343, img: "tutorialContent0023" },
        { tutorialId: 24,   titleTextType: LangTextType.B0955,  contentTextType: LangTextType.A0344, img: "tutorialContent0024" },
        { tutorialId: 25,   titleTextType: LangTextType.B0956,  contentTextType: LangTextType.A0345, img: "tutorialContent0025" },
        { tutorialId: 26,   titleTextType: LangTextType.B0957,  contentTextType: LangTextType.A0346, img: "tutorialContent0026" },
        { tutorialId: 27,   titleTextType: LangTextType.B0958,  contentTextType: LangTextType.A0347, img: "tutorialContent0027" },
        { tutorialId: 28,   titleTextType: LangTextType.B0959,  contentTextType: LangTextType.A0348, img: "tutorialContent0028" },
        { tutorialId: 29,   titleTextType: LangTextType.B0960,  contentTextType: LangTextType.A0349, img: "tutorialContent0029" },
        { tutorialId: 30,   titleTextType: LangTextType.B0961,  contentTextType: LangTextType.A0350, img: "tutorialContent0030" },
        { tutorialId: 31,   titleTextType: LangTextType.B0962,  contentTextType: LangTextType.A0351, img: "tutorialContent0031" },
        { tutorialId: 32,   titleTextType: LangTextType.B0963,  contentTextType: LangTextType.A0352, img: "tutorialContent0032" },
        { tutorialId: 33,   titleTextType: LangTextType.B0964,  contentTextType: LangTextType.A0353, img: "tutorialContent0033" },
        { tutorialId: 34,   titleTextType: LangTextType.B0965,  contentTextType: LangTextType.A0354, img: "tutorialContent0034" },
        { tutorialId: 35,   titleTextType: LangTextType.B0966,  contentTextType: LangTextType.A0355, img: "tutorialContent0035" },
        { tutorialId: 36,   titleTextType: LangTextType.B0967,  contentTextType: LangTextType.A0356, img: "tutorialContent0036" },
        { tutorialId: 37,   titleTextType: LangTextType.B0968,  contentTextType: LangTextType.A0357, img: "tutorialContent0037" },
        { tutorialId: 38,   titleTextType: LangTextType.B0969,  contentTextType: LangTextType.A0358, img: "tutorialContent0038" },
        { tutorialId: 39,   titleTextType: LangTextType.B0970,  contentTextType: LangTextType.A0359, img: "tutorialContent0039" },
        { tutorialId: 40,   titleTextType: LangTextType.B0971,  contentTextType: LangTextType.A0360, img: "tutorialContent0040" },
        { tutorialId: 41,   titleTextType: LangTextType.B0972,  contentTextType: LangTextType.A0361, img: "tutorialContent0041" },
        { tutorialId: 42,   titleTextType: LangTextType.B0973,  contentTextType: LangTextType.A0362, img: "tutorialContent0042" },
        { tutorialId: 43,   titleTextType: LangTextType.B0974,  contentTextType: LangTextType.A0363, img: "tutorialContent0043" },
        { tutorialId: 44,   titleTextType: LangTextType.B0975,  contentTextType: LangTextType.A0364, img: "tutorialContent0044" },
        { tutorialId: 45,   titleTextType: LangTextType.B0976,  contentTextType: LangTextType.A0365, img: "tutorialContent0045" },
        // { tutorialId: 46,   titleTextType: LangTextType.B0977,  contentTextType: LangTextType.A0366, img: "tutorialContent0046" },
    ];

    export type OpenDataForCommonTutorialPanel = void;
    export class CommonTutorialPanel extends TwnsUiPanel.UiPanel<OpenDataForCommonTutorialPanel> {
        private readonly _imgMask!              : TwnsUiImage.UiImage;
        private readonly _groupList!            : eui.Group;
        private readonly _listName!             : TwnsUiScrollList.UiScrollList<DataForNameRenderer>;
        private readonly _btnBack!              : TwnsUiButton.UiButton;

        private readonly _labelTutorialTitle!   : TwnsUiLabel.UiLabel;
        private readonly _imgTutorial!          : TwnsUiImage.UiImage;
        private readonly _labelTutorial!        : TwnsUiLabel.UiLabel;

        private readonly _groupInfo!            : eui.Group;

        private _selectedIndex                  : number | null = null;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,    callback: this.close },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listName.setItemRenderer(UnitRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            const listUnit = this._listName;
            listUnit.bindData(this._createDataForListName());
            listUnit.scrollVerticalTo(0);
            this._updateComponentsForLanguage();
            this.setSelectedIndexAndUpdateView(0);
        }
        protected _onClosing(): void {
            this._selectedIndex = null;
        }

        public setSelectedIndexAndUpdateView(newIndex: number): void {
            const oldIndex      = this._selectedIndex;
            this._selectedIndex = newIndex;

            if (oldIndex !== newIndex) {
                const list = this._listName;
                list.setSelectedIndex(newIndex);

                const info = list.getSelectedData()?.tutorialInfo;
                if (info) {
                    this._labelTutorialTitle.text   = Lang.getText(info.titleTextType);
                    this._labelTutorial.text        = Lang.getText(info.contentTextType);
                    this._imgTutorial.source        = info.img;
                }
            }
        }
        public getSelectedIndex(): number | null {
            return this._selectedIndex;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected async _showOpenAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });

            const groupList = this._groupList;
            egret.Tween.removeTweens(groupList);
            egret.Tween.get(groupList)
                .set({ alpha: 0, left: -40 })
                .to({ alpha: 1, left: 0 }, 200);

            const groupInfo = this._groupInfo;
            egret.Tween.removeTweens(groupInfo);
            egret.Tween.get(groupInfo)
                .set({ alpha: 0, right: -40 })
                .to({ alpha: 1, right: 0 }, 200);

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });

            const groupList = this._groupList;
            egret.Tween.removeTweens(groupList);
            egret.Tween.get(groupList)
                .set({ alpha: 1, left: 0 })
                .to({ alpha: 0, left: -40 }, 200);

            const groupInfo = this._groupInfo;
            egret.Tween.removeTweens(groupInfo);
            egret.Tween.get(groupInfo)
                .set({ alpha: 1, right: 0 })
                .to({ alpha: 0, right: -40 }, 200);

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }

        private _updateComponentsForLanguage(): void {
            this._btnBack.label             = Lang.getText(LangTextType.B0146);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Util functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _createDataForListName(): DataForNameRenderer[] {
            const data: DataForNameRenderer[] = [];
            for (let index = 0; index < TutorialInfoArray.length; ++index) {
                data.push({
                    index,
                    tutorialInfo: TutorialInfoArray[index],
                    panel       : this,
                });
            }

            return data;
        }
    }

    type DataForNameRenderer = {
        tutorialInfo    : TutorialInfo;
        index           : number;
        panel           : CommonTutorialPanel;
    };
    class UnitRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForNameRenderer> {
        private readonly _imgChoose!    : eui.Image;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._imgChoose,  callback: this._onTouchedImgChoose },
            ]);
        }

        protected _onDataChanged(): void {
            const data              = this._getData();
            this._labelName.text    = Lang.getText(data.tutorialInfo.titleTextType);
        }

        private _onTouchedImgChoose(): void {
            const data = this._getData();
            data.panel.setSelectedIndexAndUpdateView(data.index);
        }
    }
}

// export default TwnsCommonTutorialPanel;
