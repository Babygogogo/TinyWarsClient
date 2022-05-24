
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.BaseWar {
    const RAIN_DENSITY      = 0.3;
    const RAIN_ANGLE        = 20;
    const SNOW_DENSITY      = 0.3;
    const SNOW_ANGLE        = 0;
    const SANDSTORM_DENSITY = 0.4;
    const SANDSTORM_ANGLE   = 70;

    export class BwWeatherManagerView extends eui.Component {
        private _weatherManager?        : BaseWar.BwWeatherManager;
        private _containerForRain       = new eui.Component();
        private _imgArrayForRain        : TwnsUiImage.UiImage[] = [];
        private _containerForSnow       = new eui.Component();
        private _imgArrayForSnow        : TwnsUiImage.UiImage[] = [];
        private _containerForSandstorm  = new eui.Component();
        private _imgArrayForSandstorm   : TwnsUiImage.UiImage[] = [];
        private _showingWeatherType     : number | null = null;

        public constructor() {
            super();

            this.left   = 0;
            this.right  = 0;
            this.top    = 0;
            this.bottom = 0;

            {
                const containerForRain              = this._containerForRain;
                containerForRain.rotation           = RAIN_ANGLE;
                containerForRain.horizontalCenter   = 0;
                containerForRain.verticalCenter     = 0;
                this.addChild(containerForRain);
            }

            {
                const containerForSnow              = this._containerForSnow;
                containerForSnow.rotation           = SNOW_ANGLE;
                containerForSnow.horizontalCenter   = 0;
                containerForSnow.verticalCenter     = 0;
                this.addChild(containerForSnow);
            }

            {
                const containerForSandstorm             = this._containerForSandstorm;
                containerForSandstorm.rotation          = SANDSTORM_ANGLE;
                containerForSandstorm.horizontalCenter  = 0;
                containerForSandstorm.verticalCenter    = 0;
                this.addChild(containerForSandstorm);
            }
        }

        public init(manager: BaseWar.BwWeatherManager): void {
            this._setWeatherManager(manager);
        }

        public startRunningView(): void {
            this.addEventListener(egret.Event.RESIZE, this._onResize, this);
            this.resetView(true);
        }
        public stopRunningView(): void {
            this.removeEventListener(egret.Event.RESIZE, this._onResize, this);
            this._stopView();
        }

        private _getWeatherManager(): BaseWar.BwWeatherManager {
            return Helpers.getExisted(this._weatherManager, ClientErrorCode.BwWeatherManagerView_GetWeatherManager_00);
        }
        private _setWeatherManager(manager: BaseWar.BwWeatherManager): void {
            this._weatherManager = manager;
        }

        private _onResize(): void {
            this.resetView(true);
        }

        public resetView(isForce: boolean): void {
            const weatherManager    = this._getWeatherManager();
            const weatherType       = weatherManager.getCurrentWeatherType();
            if ((!isForce) && (weatherType === this._showingWeatherType)) {
                return;
            }

            this._showingWeatherType = weatherType;

            this._stopView();
            switch (weatherManager.getWar().getGameConfig().getWeatherCfg(weatherType)?.anim) {
                case CommonConstants.WeatherAnimationType.Rainy     : this._showRain();         break;
                case CommonConstants.WeatherAnimationType.Sandstorm : this._showSandstorm();    break;
                case CommonConstants.WeatherAnimationType.Snowy     : this._showSnow();         break;
                default                                             :                           break;
            }
        }
        private _stopView(): void {
            this._stopRain();
            this._stopSandstorm();
            this._stopSnow();
        }

        private _showRain(): void {
            this._stopRain();

            const imagesCount   = Math.max(1, Math.floor(this.width * RAIN_DENSITY));
            const imgArray      = this._imgArrayForRain;
            if (imgArray.length > imagesCount) {
                imgArray.length = imagesCount;
            } else {
                for (let i = imgArray.length; i < imagesCount; ++i) {
                    const img = new TwnsUiImage.UiImage(`uncompressedColorWhite0000`);
                    img.width = 1;
                    imgArray.push(img);
                }
            }

            const container = this._containerForRain;
            this._resetContainerSize(container);

            for (const img of imgArray) {
                this._resetTweenForImgRain(img);
                container.addChild(img);
            }
        }
        private _stopRain(): void {
            for (const img of this._imgArrayForRain) {
                egret.Tween.removeTweens(img);
                (img.parent) && (img.parent.removeChild(img));
            }
        }
        private _resetTweenForImgRain(img: TwnsUiImage.UiImage): void {
            const container         = this._containerForRain;
            const containerHeight   = container.height;
            const imgHeight         = Math.floor(Math.random() * 20 + 10);
            const startingY         = -Math.random() * containerHeight - imgHeight;
            const endingY           = containerHeight;
            egret.Tween.removeTweens(img);
            egret.Tween.get(img)
                .set({ x: Math.random() * container.width, y: startingY, height: imgHeight })
                .to({ y: endingY }, (endingY - startingY) * 1.2 * (Math.random() * 0.2 + 0.9))
                .call(() => this._resetTweenForImgRain(img));
        }

        private _showSandstorm(): void {
            this._stopSandstorm();

            const imagesCount   = Math.max(1, Math.floor(this.width * SANDSTORM_DENSITY));
            const imgArray      = this._imgArrayForSandstorm;
            if (imgArray.length > imagesCount) {
                imgArray.length = imagesCount;
            } else {
                for (let i = imgArray.length; i < imagesCount; ++i) {
                    const img = new TwnsUiImage.UiImage(`uncompressedColorYellow0001`);
                    imgArray.push(img);
                }
            }

            const container = this._containerForSandstorm;
            this._resetContainerSize(container);

            for (const img of imgArray) {
                this._resetTweenForImgSandstorm(img);
                container.addChild(img);
            }
        }
        private _stopSandstorm(): void {
            for (const img of this._imgArrayForSandstorm) {
                egret.Tween.removeTweens(img);
                (img.parent) && (img.parent.removeChild(img));
            }
        }
        private _resetTweenForImgSandstorm(img: TwnsUiImage.UiImage): void {
            const container         = this._containerForSandstorm;
            const containerHeight   = container.height;
            const scale             = 1.2;
            const imgHeight         = 1;
            const startingY         = -Math.random() * containerHeight - imgHeight;
            const endingY           = containerHeight;
            egret.Tween.removeTweens(img);
            egret.Tween.get(img)
                .set({ x: Math.random() * container.width, y: startingY, scaleX: scale, scaleY: scale })
                .to({ y: endingY }, (endingY - startingY) * 0.4 * (Math.random() * 0.2 + 0.9))
                .call(() => this._resetTweenForImgSandstorm(img));
        }

        private _showSnow(): void {
            this._stopSnow();

            const imagesCount   = Math.max(1, Math.floor(this.width * SNOW_DENSITY));
            const imgArray      = this._imgArrayForSnow;
            if (imgArray.length > imagesCount) {
                imgArray.length = imagesCount;
            } else {
                for (let i = imgArray.length; i < imagesCount; ++i) {
                    const img = new TwnsUiImage.UiImage(`commonIcon0022`);
                    imgArray.push(img);
                }
            }

            const container = this._containerForSnow;
            this._resetContainerSize(container);

            for (const img of imgArray) {
                this._resetTweenForImgSnow(img);
                container.addChild(img);
            }
        }
        private _stopSnow(): void {
            for (const img of this._imgArrayForSnow) {
                egret.Tween.removeTweens(img);
                (img.parent) && (img.parent.removeChild(img));
            }
        }
        private _resetTweenForImgSnow(img: TwnsUiImage.UiImage): void {
            const container         = this._containerForSnow;
            const containerHeight   = container.height;
            const scale             = Math.random() * 0.3 + 0.2;
            const imgWidth          = 20;
            const startingX         = (Math.random() * container.width + imgWidth * 2) - imgWidth;
            const startingY         = -Math.random() * containerHeight - imgWidth;
            const endingY           = containerHeight;
            egret.Tween.removeTweens(img);

            egret.Tween.get(img)
                .set({ y: startingY, scaleX: scale, scaleY: scale, rotation: Math.random() * 360 })
                .to({ y: endingY }, (endingY - startingY) * 8 * (Math.random() * 0.2 + 0.9))
                .call(() => this._resetTweenForImgSnow(img));
            egret.Tween.get(img, { loop: true })
                .set({ x: startingX - 20})
                .to({ x: startingX + 20 }, 2000, egret.Ease.sineInOut)
                .to({ x: startingX - 20 }, 2000, egret.Ease.sineInOut);
        }

        private _resetContainerSize(container: eui.Component): void {
            const width             = this.width;
            const height            = this.height;
            const containerWidth    = Math.sqrt(width * width + height * height);
            const containerHeight   = containerWidth;
            container.width         = containerWidth;
            container.height        = containerHeight;
        }
    }
}
