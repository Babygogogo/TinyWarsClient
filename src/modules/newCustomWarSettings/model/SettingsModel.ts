
namespace NewCustomWarSettings {
    import Types = Utility.Types;

    export namespace SettingsModel {
        let mapIndexKeys: Types.MapIndexKeys;

        export function setMapIndexKeys(keys: Types.MapIndexKeys): void {
            mapIndexKeys = keys;
        }
        export function getMapIndexKeys(): Types.MapIndexKeys {
            return mapIndexKeys;
        }
    }
}
