
import TwnsBwFogMap from "../../baseWar/model/BwFogMap";
import TwnsBwWar    from "../../baseWar/model/BwWar";

namespace TwnsTwFogMap {
    import BwFogMap = TwnsBwFogMap.BwFogMap;
    import BwWar    = TwnsBwWar.BwWar;

    export class TwFogMap extends BwFogMap {
        public startRunning(war: BwWar): void {
            // nothing to do
        }
    }
}

export default TwnsTwFogMap;
