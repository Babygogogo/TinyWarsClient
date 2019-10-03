
namespace TinyWars.Utility {
 export namespace ProtoTypes {
/** Properties of a TileCategoryCfg. */
export declare interface ITileCategoryCfg {

    /** TileCategoryCfg category */
    category?: (number|null);

    /** TileCategoryCfg tileTypes */
    tileTypes?: (number[]|null);
}

/** Represents a TileCategoryCfg. */
export declare class TileCategoryCfg implements ITileCategoryCfg {

    /**
     * Constructs a new TileCategoryCfg.
     * @param [properties] Properties to set
     */
    constructor(properties?: ITileCategoryCfg);

    /** TileCategoryCfg category. */
    public category: number;

    /** TileCategoryCfg tileTypes. */
    public tileTypes: number[];

    /**
     * Creates a new TileCategoryCfg instance using the specified properties.
     * @param [properties] Properties to set
     * @returns TileCategoryCfg instance
     */
    public static create(properties?: ITileCategoryCfg): TileCategoryCfg;

    /**
     * Encodes the specified TileCategoryCfg message. Does not implicitly {@link TileCategoryCfg.verify|verify} messages.
     * @param message TileCategoryCfg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ITileCategoryCfg, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified TileCategoryCfg message, length delimited. Does not implicitly {@link TileCategoryCfg.verify|verify} messages.
     * @param message TileCategoryCfg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ITileCategoryCfg, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a TileCategoryCfg message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns TileCategoryCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): TileCategoryCfg;

    /**
     * Decodes a TileCategoryCfg message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns TileCategoryCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): TileCategoryCfg;

    /**
     * Verifies a TileCategoryCfg message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a TileCategoryCfg message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns TileCategoryCfg
     */
    public static fromObject(object: { [k: string]: any }): TileCategoryCfg;

    /**
     * Creates a plain object from a TileCategoryCfg message. Also converts values to other types if specified.
     * @param message TileCategoryCfg
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: TileCategoryCfg, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this TileCategoryCfg to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of an UnitCategoryCfg. */
export declare interface IUnitCategoryCfg {

    /** UnitCategoryCfg category */
    category?: (number|null);

    /** UnitCategoryCfg unitTypes */
    unitTypes?: (number[]|null);
}

/** Represents an UnitCategoryCfg. */
export declare class UnitCategoryCfg implements IUnitCategoryCfg {

    /**
     * Constructs a new UnitCategoryCfg.
     * @param [properties] Properties to set
     */
    constructor(properties?: IUnitCategoryCfg);

    /** UnitCategoryCfg category. */
    public category: number;

    /** UnitCategoryCfg unitTypes. */
    public unitTypes: number[];

    /**
     * Creates a new UnitCategoryCfg instance using the specified properties.
     * @param [properties] Properties to set
     * @returns UnitCategoryCfg instance
     */
    public static create(properties?: IUnitCategoryCfg): UnitCategoryCfg;

    /**
     * Encodes the specified UnitCategoryCfg message. Does not implicitly {@link UnitCategoryCfg.verify|verify} messages.
     * @param message UnitCategoryCfg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IUnitCategoryCfg, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified UnitCategoryCfg message, length delimited. Does not implicitly {@link UnitCategoryCfg.verify|verify} messages.
     * @param message UnitCategoryCfg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IUnitCategoryCfg, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes an UnitCategoryCfg message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns UnitCategoryCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): UnitCategoryCfg;

    /**
     * Decodes an UnitCategoryCfg message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns UnitCategoryCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): UnitCategoryCfg;

    /**
     * Verifies an UnitCategoryCfg message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an UnitCategoryCfg message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns UnitCategoryCfg
     */
    public static fromObject(object: { [k: string]: any }): UnitCategoryCfg;

    /**
     * Creates a plain object from an UnitCategoryCfg message. Also converts values to other types if specified.
     * @param message UnitCategoryCfg
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: UnitCategoryCfg, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this UnitCategoryCfg to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a TileTemplateCfg. */
export declare interface ITileTemplateCfg {

    /** TileTemplateCfg type */
    type?: (number|null);

    /** TileTemplateCfg defenseAmount */
    defenseAmount?: (number|null);

    /** TileTemplateCfg defenseUnitCategory */
    defenseUnitCategory?: (number|null);

    /** TileTemplateCfg maxBuildPoint */
    maxBuildPoint?: (number|null);

    /** TileTemplateCfg maxCapturePoint */
    maxCapturePoint?: (number|null);

    /** TileTemplateCfg isDefeatedOnCapture */
    isDefeatedOnCapture?: (number|null);

    /** TileTemplateCfg repairAmount */
    repairAmount?: (number|null);

    /** TileTemplateCfg repairUnitCategory */
    repairUnitCategory?: (number|null);

    /** TileTemplateCfg incomePerTurn */
    incomePerTurn?: (number|null);

    /** TileTemplateCfg visionRange */
    visionRange?: (number|null);

    /** TileTemplateCfg isVisionEnabledForAllPlayers */
    isVisionEnabledForAllPlayers?: (number|null);

    /** TileTemplateCfg hideUnitCategory */
    hideUnitCategory?: (number|null);

    /** TileTemplateCfg isDestroyedWithAdjacentMeteor */
    isDestroyedWithAdjacentMeteor?: (number|null);

    /** TileTemplateCfg produceUnitCategory */
    produceUnitCategory?: (number|null);

    /** TileTemplateCfg globalAttackBonus */
    globalAttackBonus?: (number|null);

    /** TileTemplateCfg globalDefenseBonus */
    globalDefenseBonus?: (number|null);

    /** TileTemplateCfg maxHp */
    maxHp?: (number|null);

    /** TileTemplateCfg armorType */
    armorType?: (number|null);

    /** TileTemplateCfg isAffectedByLuck */
    isAffectedByLuck?: (number|null);

    /** TileTemplateCfg loadCoUnitCategory */
    loadCoUnitCategory?: (number|null);
}

/** Represents a TileTemplateCfg. */
export declare class TileTemplateCfg implements ITileTemplateCfg {

    /**
     * Constructs a new TileTemplateCfg.
     * @param [properties] Properties to set
     */
    constructor(properties?: ITileTemplateCfg);

    /** TileTemplateCfg type. */
    public type: number;

    /** TileTemplateCfg defenseAmount. */
    public defenseAmount: number;

    /** TileTemplateCfg defenseUnitCategory. */
    public defenseUnitCategory: number;

    /** TileTemplateCfg maxBuildPoint. */
    public maxBuildPoint: number;

    /** TileTemplateCfg maxCapturePoint. */
    public maxCapturePoint: number;

    /** TileTemplateCfg isDefeatedOnCapture. */
    public isDefeatedOnCapture: number;

    /** TileTemplateCfg repairAmount. */
    public repairAmount: number;

    /** TileTemplateCfg repairUnitCategory. */
    public repairUnitCategory: number;

    /** TileTemplateCfg incomePerTurn. */
    public incomePerTurn: number;

    /** TileTemplateCfg visionRange. */
    public visionRange: number;

    /** TileTemplateCfg isVisionEnabledForAllPlayers. */
    public isVisionEnabledForAllPlayers: number;

    /** TileTemplateCfg hideUnitCategory. */
    public hideUnitCategory: number;

    /** TileTemplateCfg isDestroyedWithAdjacentMeteor. */
    public isDestroyedWithAdjacentMeteor: number;

    /** TileTemplateCfg produceUnitCategory. */
    public produceUnitCategory: number;

    /** TileTemplateCfg globalAttackBonus. */
    public globalAttackBonus: number;

    /** TileTemplateCfg globalDefenseBonus. */
    public globalDefenseBonus: number;

    /** TileTemplateCfg maxHp. */
    public maxHp: number;

    /** TileTemplateCfg armorType. */
    public armorType: number;

    /** TileTemplateCfg isAffectedByLuck. */
    public isAffectedByLuck: number;

    /** TileTemplateCfg loadCoUnitCategory. */
    public loadCoUnitCategory: number;

    /**
     * Creates a new TileTemplateCfg instance using the specified properties.
     * @param [properties] Properties to set
     * @returns TileTemplateCfg instance
     */
    public static create(properties?: ITileTemplateCfg): TileTemplateCfg;

    /**
     * Encodes the specified TileTemplateCfg message. Does not implicitly {@link TileTemplateCfg.verify|verify} messages.
     * @param message TileTemplateCfg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ITileTemplateCfg, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified TileTemplateCfg message, length delimited. Does not implicitly {@link TileTemplateCfg.verify|verify} messages.
     * @param message TileTemplateCfg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ITileTemplateCfg, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a TileTemplateCfg message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns TileTemplateCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): TileTemplateCfg;

    /**
     * Decodes a TileTemplateCfg message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns TileTemplateCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): TileTemplateCfg;

    /**
     * Verifies a TileTemplateCfg message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a TileTemplateCfg message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns TileTemplateCfg
     */
    public static fromObject(object: { [k: string]: any }): TileTemplateCfg;

    /**
     * Creates a plain object from a TileTemplateCfg message. Also converts values to other types if specified.
     * @param message TileTemplateCfg
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: TileTemplateCfg, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this TileTemplateCfg to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of an UnitTemplateCfg. */
export declare interface IUnitTemplateCfg {

    /** UnitTemplateCfg type */
    type?: (number|null);

    /** UnitTemplateCfg minAttackRange */
    minAttackRange?: (number|null);

    /** UnitTemplateCfg maxAttackRange */
    maxAttackRange?: (number|null);

    /** UnitTemplateCfg canAttackAfterMove */
    canAttackAfterMove?: (number|null);

    /** UnitTemplateCfg canAttackDivingUnits */
    canAttackDivingUnits?: (number|null);

    /** UnitTemplateCfg primaryWeaponMaxAmmo */
    primaryWeaponMaxAmmo?: (number|null);

    /** UnitTemplateCfg maxHp */
    maxHp?: (number|null);

    /** UnitTemplateCfg armorType */
    armorType?: (number|null);

    /** UnitTemplateCfg isAffectedByLuck */
    isAffectedByLuck?: (number|null);

    /** UnitTemplateCfg moveRange */
    moveRange?: (number|null);

    /** UnitTemplateCfg moveType */
    moveType?: (number|null);

    /** UnitTemplateCfg maxFuel */
    maxFuel?: (number|null);

    /** UnitTemplateCfg fuelConsumptionPerTurn */
    fuelConsumptionPerTurn?: (number|null);

    /** UnitTemplateCfg fuelConsumptionInDiving */
    fuelConsumptionInDiving?: (number|null);

    /** UnitTemplateCfg isDestroyedOnOutOfFuel */
    isDestroyedOnOutOfFuel?: (number|null);

    /** UnitTemplateCfg maxLoadUnitsCount */
    maxLoadUnitsCount?: (number|null);

    /** UnitTemplateCfg loadUnitCategory */
    loadUnitCategory?: (number|null);

    /** UnitTemplateCfg canLaunchLoadedUnits */
    canLaunchLoadedUnits?: (number|null);

    /** UnitTemplateCfg canDropLoadedUnits */
    canDropLoadedUnits?: (number|null);

    /** UnitTemplateCfg canSupplyLoadedUnits */
    canSupplyLoadedUnits?: (number|null);

    /** UnitTemplateCfg repairAmountForLoadedUnits */
    repairAmountForLoadedUnits?: (number|null);

    /** UnitTemplateCfg loadableTileCategory */
    loadableTileCategory?: (number|null);

    /** UnitTemplateCfg canSupplyAdjacentUnits */
    canSupplyAdjacentUnits?: (number|null);

    /** UnitTemplateCfg produceUnitType */
    produceUnitType?: (number|null);

    /** UnitTemplateCfg maxProduceMaterial */
    maxProduceMaterial?: (number|null);

    /** UnitTemplateCfg maxBuildMaterial */
    maxBuildMaterial?: (number|null);

    /** UnitTemplateCfg canCaptureTile */
    canCaptureTile?: (number|null);

    /** UnitTemplateCfg canLaunchSilo */
    canLaunchSilo?: (number|null);

    /** UnitTemplateCfg productionCost */
    productionCost?: (number|null);

    /** UnitTemplateCfg visionRange */
    visionRange?: (number|null);

    /** UnitTemplateCfg flareMaxAmmo */
    flareMaxAmmo?: (number|null);

    /** UnitTemplateCfg flareMaxRange */
    flareMaxRange?: (number|null);

    /** UnitTemplateCfg flareRadius */
    flareRadius?: (number|null);
}

/** Represents an UnitTemplateCfg. */
export declare class UnitTemplateCfg implements IUnitTemplateCfg {

    /**
     * Constructs a new UnitTemplateCfg.
     * @param [properties] Properties to set
     */
    constructor(properties?: IUnitTemplateCfg);

    /** UnitTemplateCfg type. */
    public type: number;

    /** UnitTemplateCfg minAttackRange. */
    public minAttackRange: number;

    /** UnitTemplateCfg maxAttackRange. */
    public maxAttackRange: number;

    /** UnitTemplateCfg canAttackAfterMove. */
    public canAttackAfterMove: number;

    /** UnitTemplateCfg canAttackDivingUnits. */
    public canAttackDivingUnits: number;

    /** UnitTemplateCfg primaryWeaponMaxAmmo. */
    public primaryWeaponMaxAmmo: number;

    /** UnitTemplateCfg maxHp. */
    public maxHp: number;

    /** UnitTemplateCfg armorType. */
    public armorType: number;

    /** UnitTemplateCfg isAffectedByLuck. */
    public isAffectedByLuck: number;

    /** UnitTemplateCfg moveRange. */
    public moveRange: number;

    /** UnitTemplateCfg moveType. */
    public moveType: number;

    /** UnitTemplateCfg maxFuel. */
    public maxFuel: number;

    /** UnitTemplateCfg fuelConsumptionPerTurn. */
    public fuelConsumptionPerTurn: number;

    /** UnitTemplateCfg fuelConsumptionInDiving. */
    public fuelConsumptionInDiving: number;

    /** UnitTemplateCfg isDestroyedOnOutOfFuel. */
    public isDestroyedOnOutOfFuel: number;

    /** UnitTemplateCfg maxLoadUnitsCount. */
    public maxLoadUnitsCount: number;

    /** UnitTemplateCfg loadUnitCategory. */
    public loadUnitCategory: number;

    /** UnitTemplateCfg canLaunchLoadedUnits. */
    public canLaunchLoadedUnits: number;

    /** UnitTemplateCfg canDropLoadedUnits. */
    public canDropLoadedUnits: number;

    /** UnitTemplateCfg canSupplyLoadedUnits. */
    public canSupplyLoadedUnits: number;

    /** UnitTemplateCfg repairAmountForLoadedUnits. */
    public repairAmountForLoadedUnits: number;

    /** UnitTemplateCfg loadableTileCategory. */
    public loadableTileCategory: number;

    /** UnitTemplateCfg canSupplyAdjacentUnits. */
    public canSupplyAdjacentUnits: number;

    /** UnitTemplateCfg produceUnitType. */
    public produceUnitType: number;

    /** UnitTemplateCfg maxProduceMaterial. */
    public maxProduceMaterial: number;

    /** UnitTemplateCfg maxBuildMaterial. */
    public maxBuildMaterial: number;

    /** UnitTemplateCfg canCaptureTile. */
    public canCaptureTile: number;

    /** UnitTemplateCfg canLaunchSilo. */
    public canLaunchSilo: number;

    /** UnitTemplateCfg productionCost. */
    public productionCost: number;

    /** UnitTemplateCfg visionRange. */
    public visionRange: number;

    /** UnitTemplateCfg flareMaxAmmo. */
    public flareMaxAmmo: number;

    /** UnitTemplateCfg flareMaxRange. */
    public flareMaxRange: number;

    /** UnitTemplateCfg flareRadius. */
    public flareRadius: number;

    /**
     * Creates a new UnitTemplateCfg instance using the specified properties.
     * @param [properties] Properties to set
     * @returns UnitTemplateCfg instance
     */
    public static create(properties?: IUnitTemplateCfg): UnitTemplateCfg;

    /**
     * Encodes the specified UnitTemplateCfg message. Does not implicitly {@link UnitTemplateCfg.verify|verify} messages.
     * @param message UnitTemplateCfg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IUnitTemplateCfg, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified UnitTemplateCfg message, length delimited. Does not implicitly {@link UnitTemplateCfg.verify|verify} messages.
     * @param message UnitTemplateCfg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IUnitTemplateCfg, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes an UnitTemplateCfg message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns UnitTemplateCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): UnitTemplateCfg;

    /**
     * Decodes an UnitTemplateCfg message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns UnitTemplateCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): UnitTemplateCfg;

    /**
     * Verifies an UnitTemplateCfg message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an UnitTemplateCfg message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns UnitTemplateCfg
     */
    public static fromObject(object: { [k: string]: any }): UnitTemplateCfg;

    /**
     * Creates a plain object from an UnitTemplateCfg message. Also converts values to other types if specified.
     * @param message UnitTemplateCfg
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: UnitTemplateCfg, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this UnitTemplateCfg to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a DamageChartCfg. */
export declare interface IDamageChartCfg {

    /** DamageChartCfg attackerType */
    attackerType?: (number|null);

    /** DamageChartCfg armorType */
    armorType?: (number|null);

    /** DamageChartCfg weaponType */
    weaponType?: (number|null);

    /** DamageChartCfg damage */
    damage?: (number|null);
}

/** Represents a DamageChartCfg. */
export declare class DamageChartCfg implements IDamageChartCfg {

    /**
     * Constructs a new DamageChartCfg.
     * @param [properties] Properties to set
     */
    constructor(properties?: IDamageChartCfg);

    /** DamageChartCfg attackerType. */
    public attackerType: number;

    /** DamageChartCfg armorType. */
    public armorType: number;

    /** DamageChartCfg weaponType. */
    public weaponType: number;

    /** DamageChartCfg damage. */
    public damage: number;

    /**
     * Creates a new DamageChartCfg instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DamageChartCfg instance
     */
    public static create(properties?: IDamageChartCfg): DamageChartCfg;

    /**
     * Encodes the specified DamageChartCfg message. Does not implicitly {@link DamageChartCfg.verify|verify} messages.
     * @param message DamageChartCfg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IDamageChartCfg, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified DamageChartCfg message, length delimited. Does not implicitly {@link DamageChartCfg.verify|verify} messages.
     * @param message DamageChartCfg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IDamageChartCfg, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a DamageChartCfg message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DamageChartCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): DamageChartCfg;

    /**
     * Decodes a DamageChartCfg message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DamageChartCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): DamageChartCfg;

    /**
     * Verifies a DamageChartCfg message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a DamageChartCfg message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DamageChartCfg
     */
    public static fromObject(object: { [k: string]: any }): DamageChartCfg;

    /**
     * Creates a plain object from a DamageChartCfg message. Also converts values to other types if specified.
     * @param message DamageChartCfg
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: DamageChartCfg, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this DamageChartCfg to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a MoveCostCfg. */
export declare interface IMoveCostCfg {

    /** MoveCostCfg tileType */
    tileType?: (number|null);

    /** MoveCostCfg moveType */
    moveType?: (number|null);

    /** MoveCostCfg cost */
    cost?: (number|null);
}

/** Represents a MoveCostCfg. */
export declare class MoveCostCfg implements IMoveCostCfg {

    /**
     * Constructs a new MoveCostCfg.
     * @param [properties] Properties to set
     */
    constructor(properties?: IMoveCostCfg);

    /** MoveCostCfg tileType. */
    public tileType: number;

    /** MoveCostCfg moveType. */
    public moveType: number;

    /** MoveCostCfg cost. */
    public cost: number;

    /**
     * Creates a new MoveCostCfg instance using the specified properties.
     * @param [properties] Properties to set
     * @returns MoveCostCfg instance
     */
    public static create(properties?: IMoveCostCfg): MoveCostCfg;

    /**
     * Encodes the specified MoveCostCfg message. Does not implicitly {@link MoveCostCfg.verify|verify} messages.
     * @param message MoveCostCfg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IMoveCostCfg, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified MoveCostCfg message, length delimited. Does not implicitly {@link MoveCostCfg.verify|verify} messages.
     * @param message MoveCostCfg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IMoveCostCfg, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a MoveCostCfg message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns MoveCostCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): MoveCostCfg;

    /**
     * Decodes a MoveCostCfg message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns MoveCostCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): MoveCostCfg;

    /**
     * Verifies a MoveCostCfg message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a MoveCostCfg message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns MoveCostCfg
     */
    public static fromObject(object: { [k: string]: any }): MoveCostCfg;

    /**
     * Creates a plain object from a MoveCostCfg message. Also converts values to other types if specified.
     * @param message MoveCostCfg
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: MoveCostCfg, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this MoveCostCfg to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of an UnitPromotionCfg. */
export declare interface IUnitPromotionCfg {

    /** UnitPromotionCfg promotion */
    promotion?: (number|null);

    /** UnitPromotionCfg attackBonus */
    attackBonus?: (number|null);

    /** UnitPromotionCfg defenseBonus */
    defenseBonus?: (number|null);
}

/** Represents an UnitPromotionCfg. */
export declare class UnitPromotionCfg implements IUnitPromotionCfg {

    /**
     * Constructs a new UnitPromotionCfg.
     * @param [properties] Properties to set
     */
    constructor(properties?: IUnitPromotionCfg);

    /** UnitPromotionCfg promotion. */
    public promotion: number;

    /** UnitPromotionCfg attackBonus. */
    public attackBonus: number;

    /** UnitPromotionCfg defenseBonus. */
    public defenseBonus: number;

    /**
     * Creates a new UnitPromotionCfg instance using the specified properties.
     * @param [properties] Properties to set
     * @returns UnitPromotionCfg instance
     */
    public static create(properties?: IUnitPromotionCfg): UnitPromotionCfg;

    /**
     * Encodes the specified UnitPromotionCfg message. Does not implicitly {@link UnitPromotionCfg.verify|verify} messages.
     * @param message UnitPromotionCfg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IUnitPromotionCfg, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified UnitPromotionCfg message, length delimited. Does not implicitly {@link UnitPromotionCfg.verify|verify} messages.
     * @param message UnitPromotionCfg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IUnitPromotionCfg, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes an UnitPromotionCfg message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns UnitPromotionCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): UnitPromotionCfg;

    /**
     * Decodes an UnitPromotionCfg message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns UnitPromotionCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): UnitPromotionCfg;

    /**
     * Verifies an UnitPromotionCfg message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an UnitPromotionCfg message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns UnitPromotionCfg
     */
    public static fromObject(object: { [k: string]: any }): UnitPromotionCfg;

    /**
     * Creates a plain object from an UnitPromotionCfg message. Also converts values to other types if specified.
     * @param message UnitPromotionCfg
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: UnitPromotionCfg, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this UnitPromotionCfg to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a VisionBonusCfg. */
export declare interface IVisionBonusCfg {

    /** VisionBonusCfg unitType */
    unitType?: (number|null);

    /** VisionBonusCfg tileType */
    tileType?: (number|null);

    /** VisionBonusCfg visionBonus */
    visionBonus?: (number|null);
}

/** Represents a VisionBonusCfg. */
export declare class VisionBonusCfg implements IVisionBonusCfg {

    /**
     * Constructs a new VisionBonusCfg.
     * @param [properties] Properties to set
     */
    constructor(properties?: IVisionBonusCfg);

    /** VisionBonusCfg unitType. */
    public unitType: number;

    /** VisionBonusCfg tileType. */
    public tileType: number;

    /** VisionBonusCfg visionBonus. */
    public visionBonus: number;

    /**
     * Creates a new VisionBonusCfg instance using the specified properties.
     * @param [properties] Properties to set
     * @returns VisionBonusCfg instance
     */
    public static create(properties?: IVisionBonusCfg): VisionBonusCfg;

    /**
     * Encodes the specified VisionBonusCfg message. Does not implicitly {@link VisionBonusCfg.verify|verify} messages.
     * @param message VisionBonusCfg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IVisionBonusCfg, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified VisionBonusCfg message, length delimited. Does not implicitly {@link VisionBonusCfg.verify|verify} messages.
     * @param message VisionBonusCfg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IVisionBonusCfg, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a VisionBonusCfg message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns VisionBonusCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): VisionBonusCfg;

    /**
     * Decodes a VisionBonusCfg message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns VisionBonusCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): VisionBonusCfg;

    /**
     * Verifies a VisionBonusCfg message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a VisionBonusCfg message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns VisionBonusCfg
     */
    public static fromObject(object: { [k: string]: any }): VisionBonusCfg;

    /**
     * Creates a plain object from a VisionBonusCfg message. Also converts values to other types if specified.
     * @param message VisionBonusCfg
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: VisionBonusCfg, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this VisionBonusCfg to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a BuildableTileCfg. */
export declare interface IBuildableTileCfg {

    /** BuildableTileCfg unitType */
    unitType?: (number|null);

    /** BuildableTileCfg srcTileType */
    srcTileType?: (number|null);

    /** BuildableTileCfg dstTileType */
    dstTileType?: (number|null);
}

/** Represents a BuildableTileCfg. */
export declare class BuildableTileCfg implements IBuildableTileCfg {

    /**
     * Constructs a new BuildableTileCfg.
     * @param [properties] Properties to set
     */
    constructor(properties?: IBuildableTileCfg);

    /** BuildableTileCfg unitType. */
    public unitType: number;

    /** BuildableTileCfg srcTileType. */
    public srcTileType: number;

    /** BuildableTileCfg dstTileType. */
    public dstTileType: number;

    /**
     * Creates a new BuildableTileCfg instance using the specified properties.
     * @param [properties] Properties to set
     * @returns BuildableTileCfg instance
     */
    public static create(properties?: IBuildableTileCfg): BuildableTileCfg;

    /**
     * Encodes the specified BuildableTileCfg message. Does not implicitly {@link BuildableTileCfg.verify|verify} messages.
     * @param message BuildableTileCfg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IBuildableTileCfg, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified BuildableTileCfg message, length delimited. Does not implicitly {@link BuildableTileCfg.verify|verify} messages.
     * @param message BuildableTileCfg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IBuildableTileCfg, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a BuildableTileCfg message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns BuildableTileCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): BuildableTileCfg;

    /**
     * Decodes a BuildableTileCfg message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns BuildableTileCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): BuildableTileCfg;

    /**
     * Verifies a BuildableTileCfg message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a BuildableTileCfg message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns BuildableTileCfg
     */
    public static fromObject(object: { [k: string]: any }): BuildableTileCfg;

    /**
     * Creates a plain object from a BuildableTileCfg message. Also converts values to other types if specified.
     * @param message BuildableTileCfg
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: BuildableTileCfg, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this BuildableTileCfg to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a PlayerRankCfg. */
export declare interface IPlayerRankCfg {

    /** PlayerRankCfg minScore */
    minScore?: (number|null);

    /** PlayerRankCfg rank */
    rank?: (number|null);
}

/** Represents a PlayerRankCfg. */
export declare class PlayerRankCfg implements IPlayerRankCfg {

    /**
     * Constructs a new PlayerRankCfg.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPlayerRankCfg);

    /** PlayerRankCfg minScore. */
    public minScore: number;

    /** PlayerRankCfg rank. */
    public rank: number;

    /**
     * Creates a new PlayerRankCfg instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PlayerRankCfg instance
     */
    public static create(properties?: IPlayerRankCfg): PlayerRankCfg;

    /**
     * Encodes the specified PlayerRankCfg message. Does not implicitly {@link PlayerRankCfg.verify|verify} messages.
     * @param message PlayerRankCfg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPlayerRankCfg, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified PlayerRankCfg message, length delimited. Does not implicitly {@link PlayerRankCfg.verify|verify} messages.
     * @param message PlayerRankCfg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPlayerRankCfg, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a PlayerRankCfg message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PlayerRankCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): PlayerRankCfg;

    /**
     * Decodes a PlayerRankCfg message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PlayerRankCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): PlayerRankCfg;

    /**
     * Verifies a PlayerRankCfg message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PlayerRankCfg message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PlayerRankCfg
     */
    public static fromObject(object: { [k: string]: any }): PlayerRankCfg;

    /**
     * Creates a plain object from a PlayerRankCfg message. Also converts values to other types if specified.
     * @param message PlayerRankCfg
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PlayerRankCfg, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PlayerRankCfg to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a CoBasicCfg. */
export declare interface ICoBasicCfg {

    /** CoBasicCfg coId */
    coId?: (number|null);

    /** CoBasicCfg name */
    name?: (string|null);

    /** CoBasicCfg zoneRadius */
    zoneRadius?: (number|null);

    /** CoBasicCfg boardCostPercentage */
    boardCostPercentage?: (number|null);

    /** CoBasicCfg zoneExpansionEnergyList */
    zoneExpansionEnergyList?: (number[]|null);

    /** CoBasicCfg powerEnergyList */
    powerEnergyList?: (number[]|null);

    /** CoBasicCfg isEnabled */
    isEnabled?: (number|null);

    /** CoBasicCfg designer */
    designer?: (string|null);

    /** CoBasicCfg fullPortrait */
    fullPortrait?: (string|null);

    /** CoBasicCfg tier */
    tier?: (number|null);

    /** CoBasicCfg passiveSkills */
    passiveSkills?: (number[]|null);

    /** CoBasicCfg powerSkills */
    powerSkills?: (number[]|null);

    /** CoBasicCfg superPowerSkills */
    superPowerSkills?: (number[]|null);
}

/** Represents a CoBasicCfg. */
export declare class CoBasicCfg implements ICoBasicCfg {

    /**
     * Constructs a new CoBasicCfg.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICoBasicCfg);

    /** CoBasicCfg coId. */
    public coId: number;

    /** CoBasicCfg name. */
    public name: string;

    /** CoBasicCfg zoneRadius. */
    public zoneRadius: number;

    /** CoBasicCfg boardCostPercentage. */
    public boardCostPercentage: number;

    /** CoBasicCfg zoneExpansionEnergyList. */
    public zoneExpansionEnergyList: number[];

    /** CoBasicCfg powerEnergyList. */
    public powerEnergyList: number[];

    /** CoBasicCfg isEnabled. */
    public isEnabled: number;

    /** CoBasicCfg designer. */
    public designer: string;

    /** CoBasicCfg fullPortrait. */
    public fullPortrait: string;

    /** CoBasicCfg tier. */
    public tier: number;

    /** CoBasicCfg passiveSkills. */
    public passiveSkills: number[];

    /** CoBasicCfg powerSkills. */
    public powerSkills: number[];

    /** CoBasicCfg superPowerSkills. */
    public superPowerSkills: number[];

    /**
     * Creates a new CoBasicCfg instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CoBasicCfg instance
     */
    public static create(properties?: ICoBasicCfg): CoBasicCfg;

    /**
     * Encodes the specified CoBasicCfg message. Does not implicitly {@link CoBasicCfg.verify|verify} messages.
     * @param message CoBasicCfg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICoBasicCfg, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified CoBasicCfg message, length delimited. Does not implicitly {@link CoBasicCfg.verify|verify} messages.
     * @param message CoBasicCfg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICoBasicCfg, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a CoBasicCfg message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CoBasicCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): CoBasicCfg;

    /**
     * Decodes a CoBasicCfg message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CoBasicCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): CoBasicCfg;

    /**
     * Verifies a CoBasicCfg message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CoBasicCfg message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CoBasicCfg
     */
    public static fromObject(object: { [k: string]: any }): CoBasicCfg;

    /**
     * Creates a plain object from a CoBasicCfg message. Also converts values to other types if specified.
     * @param message CoBasicCfg
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CoBasicCfg, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CoBasicCfg to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a CoSkillCfg. */
export declare interface ICoSkillCfg {

    /** CoSkillCfg skillId */
    skillId?: (number|null);

    /** CoSkillCfg name */
    name?: (string|null);

    /** CoSkillCfg desc */
    desc?: (string[]|null);

    /** CoSkillCfg attackBonus */
    attackBonus?: (number[]|null);

    /** CoSkillCfg defenseBonus */
    defenseBonus?: (number[]|null);

    /** CoSkillCfg moveRangeBonus */
    moveRangeBonus?: (number[]|null);

    /** CoSkillCfg maxAttackRangeBonus */
    maxAttackRangeBonus?: (number[]|null);

    /** CoSkillCfg selfHpGain */
    selfHpGain?: (number[]|null);

    /** CoSkillCfg enemyHpGain */
    enemyHpGain?: (number[]|null);

    /** CoSkillCfg selfPrimaryAmmoGain */
    selfPrimaryAmmoGain?: (number[]|null);

    /** CoSkillCfg enemyPrimaryAmmoGain */
    enemyPrimaryAmmoGain?: (number[]|null);

    /** CoSkillCfg selfFuelGain */
    selfFuelGain?: (number[]|null);

    /** CoSkillCfg enemyFuelGain */
    enemyFuelGain?: (number[]|null);

    /** CoSkillCfg selfMaterialGain */
    selfMaterialGain?: (number[]|null);

    /** CoSkillCfg enemyMaterialGain */
    enemyMaterialGain?: (number[]|null);

    /** CoSkillCfg selfHpRecovery */
    selfHpRecovery?: (number[]|null);

    /** CoSkillCfg indiscriminateAreaDamage */
    indiscriminateAreaDamage?: (number[]|null);

    /** CoSkillCfg selfPromotionGain */
    selfPromotionGain?: (number[]|null);

    /** CoSkillCfg unitVisionRangeBonus */
    unitVisionRangeBonus?: (number[]|null);

    /** CoSkillCfg unitTrueVision */
    unitTrueVision?: (number[]|null);
}

/** Represents a CoSkillCfg. */
export declare class CoSkillCfg implements ICoSkillCfg {

    /**
     * Constructs a new CoSkillCfg.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICoSkillCfg);

    /** CoSkillCfg skillId. */
    public skillId: number;

    /** CoSkillCfg name. */
    public name: string;

    /** CoSkillCfg desc. */
    public desc: string[];

    /** CoSkillCfg attackBonus. */
    public attackBonus: number[];

    /** CoSkillCfg defenseBonus. */
    public defenseBonus: number[];

    /** CoSkillCfg moveRangeBonus. */
    public moveRangeBonus: number[];

    /** CoSkillCfg maxAttackRangeBonus. */
    public maxAttackRangeBonus: number[];

    /** CoSkillCfg selfHpGain. */
    public selfHpGain: number[];

    /** CoSkillCfg enemyHpGain. */
    public enemyHpGain: number[];

    /** CoSkillCfg selfPrimaryAmmoGain. */
    public selfPrimaryAmmoGain: number[];

    /** CoSkillCfg enemyPrimaryAmmoGain. */
    public enemyPrimaryAmmoGain: number[];

    /** CoSkillCfg selfFuelGain. */
    public selfFuelGain: number[];

    /** CoSkillCfg enemyFuelGain. */
    public enemyFuelGain: number[];

    /** CoSkillCfg selfMaterialGain. */
    public selfMaterialGain: number[];

    /** CoSkillCfg enemyMaterialGain. */
    public enemyMaterialGain: number[];

    /** CoSkillCfg selfHpRecovery. */
    public selfHpRecovery: number[];

    /** CoSkillCfg indiscriminateAreaDamage. */
    public indiscriminateAreaDamage: number[];

    /** CoSkillCfg selfPromotionGain. */
    public selfPromotionGain: number[];

    /** CoSkillCfg unitVisionRangeBonus. */
    public unitVisionRangeBonus: number[];

    /** CoSkillCfg unitTrueVision. */
    public unitTrueVision: number[];

    /**
     * Creates a new CoSkillCfg instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CoSkillCfg instance
     */
    public static create(properties?: ICoSkillCfg): CoSkillCfg;

    /**
     * Encodes the specified CoSkillCfg message. Does not implicitly {@link CoSkillCfg.verify|verify} messages.
     * @param message CoSkillCfg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICoSkillCfg, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified CoSkillCfg message, length delimited. Does not implicitly {@link CoSkillCfg.verify|verify} messages.
     * @param message CoSkillCfg message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICoSkillCfg, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a CoSkillCfg message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CoSkillCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): CoSkillCfg;

    /**
     * Decodes a CoSkillCfg message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CoSkillCfg
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): CoSkillCfg;

    /**
     * Verifies a CoSkillCfg message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CoSkillCfg message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CoSkillCfg
     */
    public static fromObject(object: { [k: string]: any }): CoSkillCfg;

    /**
     * Creates a plain object from a CoSkillCfg message. Also converts values to other types if specified.
     * @param message CoSkillCfg
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CoSkillCfg, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CoSkillCfg to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a FullConfig. */
export declare interface IFullConfig {

    /** FullConfig TileCategory */
    TileCategory?: (ITileCategoryCfg[]|null);

    /** FullConfig UnitCategory */
    UnitCategory?: (IUnitCategoryCfg[]|null);

    /** FullConfig TileTemplate */
    TileTemplate?: (ITileTemplateCfg[]|null);

    /** FullConfig UnitTemplate */
    UnitTemplate?: (IUnitTemplateCfg[]|null);

    /** FullConfig DamageChart */
    DamageChart?: (IDamageChartCfg[]|null);

    /** FullConfig MoveCost */
    MoveCost?: (IMoveCostCfg[]|null);

    /** FullConfig UnitPromotion */
    UnitPromotion?: (IUnitPromotionCfg[]|null);

    /** FullConfig VisionBonus */
    VisionBonus?: (IVisionBonusCfg[]|null);

    /** FullConfig BuildableTile */
    BuildableTile?: (IBuildableTileCfg[]|null);

    /** FullConfig PlayerRank */
    PlayerRank?: (IPlayerRankCfg[]|null);

    /** FullConfig CoBasic */
    CoBasic?: (ICoBasicCfg[]|null);

    /** FullConfig CoSkill */
    CoSkill?: (ICoSkillCfg[]|null);
}

/** Represents a FullConfig. */
export declare class FullConfig implements IFullConfig {

    /**
     * Constructs a new FullConfig.
     * @param [properties] Properties to set
     */
    constructor(properties?: IFullConfig);

    /** FullConfig TileCategory. */
    public TileCategory: ITileCategoryCfg[];

    /** FullConfig UnitCategory. */
    public UnitCategory: IUnitCategoryCfg[];

    /** FullConfig TileTemplate. */
    public TileTemplate: ITileTemplateCfg[];

    /** FullConfig UnitTemplate. */
    public UnitTemplate: IUnitTemplateCfg[];

    /** FullConfig DamageChart. */
    public DamageChart: IDamageChartCfg[];

    /** FullConfig MoveCost. */
    public MoveCost: IMoveCostCfg[];

    /** FullConfig UnitPromotion. */
    public UnitPromotion: IUnitPromotionCfg[];

    /** FullConfig VisionBonus. */
    public VisionBonus: IVisionBonusCfg[];

    /** FullConfig BuildableTile. */
    public BuildableTile: IBuildableTileCfg[];

    /** FullConfig PlayerRank. */
    public PlayerRank: IPlayerRankCfg[];

    /** FullConfig CoBasic. */
    public CoBasic: ICoBasicCfg[];

    /** FullConfig CoSkill. */
    public CoSkill: ICoSkillCfg[];

    /**
     * Creates a new FullConfig instance using the specified properties.
     * @param [properties] Properties to set
     * @returns FullConfig instance
     */
    public static create(properties?: IFullConfig): FullConfig;

    /**
     * Encodes the specified FullConfig message. Does not implicitly {@link FullConfig.verify|verify} messages.
     * @param message FullConfig message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IFullConfig, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified FullConfig message, length delimited. Does not implicitly {@link FullConfig.verify|verify} messages.
     * @param message FullConfig message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IFullConfig, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a FullConfig message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns FullConfig
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): FullConfig;

    /**
     * Decodes a FullConfig message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns FullConfig
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): FullConfig;

    /**
     * Verifies a FullConfig message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a FullConfig message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns FullConfig
     */
    public static fromObject(object: { [k: string]: any }): FullConfig;

    /**
     * Creates a plain object from a FullConfig message. Also converts values to other types if specified.
     * @param message FullConfig
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: FullConfig, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this FullConfig to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a MapRawData. */
export declare interface IMapRawData {

    /** MapRawData mapDesigner */
    mapDesigner?: (string|null);

    /** MapRawData mapName */
    mapName?: (string|null);

    /** MapRawData mapNameEnglish */
    mapNameEnglish?: (string|null);

    /** MapRawData mapWidth */
    mapWidth?: (number|null);

    /** MapRawData mapHeight */
    mapHeight?: (number|null);

    /** MapRawData isMultiPlayer */
    isMultiPlayer?: (boolean|null);

    /** MapRawData isSinglePlayer */
    isSinglePlayer?: (boolean|null);

    /** MapRawData playersCount */
    playersCount?: (number|null);

    /** MapRawData tileBases */
    tileBases?: (number[]|null);

    /** MapRawData tileObjects */
    tileObjects?: (number[]|null);

    /** MapRawData units */
    units?: (number[]|null);
}

/** Represents a MapRawData. */
export declare class MapRawData implements IMapRawData {

    /**
     * Constructs a new MapRawData.
     * @param [properties] Properties to set
     */
    constructor(properties?: IMapRawData);

    /** MapRawData mapDesigner. */
    public mapDesigner: string;

    /** MapRawData mapName. */
    public mapName: string;

    /** MapRawData mapNameEnglish. */
    public mapNameEnglish: string;

    /** MapRawData mapWidth. */
    public mapWidth: number;

    /** MapRawData mapHeight. */
    public mapHeight: number;

    /** MapRawData isMultiPlayer. */
    public isMultiPlayer: boolean;

    /** MapRawData isSinglePlayer. */
    public isSinglePlayer: boolean;

    /** MapRawData playersCount. */
    public playersCount: number;

    /** MapRawData tileBases. */
    public tileBases: number[];

    /** MapRawData tileObjects. */
    public tileObjects: number[];

    /** MapRawData units. */
    public units: number[];

    /**
     * Creates a new MapRawData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns MapRawData instance
     */
    public static create(properties?: IMapRawData): MapRawData;

    /**
     * Encodes the specified MapRawData message. Does not implicitly {@link MapRawData.verify|verify} messages.
     * @param message MapRawData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IMapRawData, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified MapRawData message, length delimited. Does not implicitly {@link MapRawData.verify|verify} messages.
     * @param message MapRawData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IMapRawData, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a MapRawData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns MapRawData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): MapRawData;

    /**
     * Decodes a MapRawData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns MapRawData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): MapRawData;

    /**
     * Verifies a MapRawData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a MapRawData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns MapRawData
     */
    public static fromObject(object: { [k: string]: any }): MapRawData;

    /**
     * Creates a plain object from a MapRawData message. Also converts values to other types if specified.
     * @param message MapRawData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: MapRawData, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this MapRawData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a MapMetaData. */
export declare interface IMapMetaData {

    /** MapMetaData mapFileName */
    mapFileName?: (string|null);

    /** MapMetaData mapDesigner */
    mapDesigner?: (string|null);

    /** MapMetaData mapName */
    mapName?: (string|null);

    /** MapMetaData mapNameEnglish */
    mapNameEnglish?: (string|null);

    /** MapMetaData mapWidth */
    mapWidth?: (number|null);

    /** MapMetaData mapHeight */
    mapHeight?: (number|null);

    /** MapMetaData playersCount */
    playersCount?: (number|null);

    /** MapMetaData isEnabledForMultiCustomWar */
    isEnabledForMultiCustomWar?: (number|null);

    /** MapMetaData isEnabledForWarRoom */
    isEnabledForWarRoom?: (number|null);
}

/** Represents a MapMetaData. */
export declare class MapMetaData implements IMapMetaData {

    /**
     * Constructs a new MapMetaData.
     * @param [properties] Properties to set
     */
    constructor(properties?: IMapMetaData);

    /** MapMetaData mapFileName. */
    public mapFileName: string;

    /** MapMetaData mapDesigner. */
    public mapDesigner: string;

    /** MapMetaData mapName. */
    public mapName: string;

    /** MapMetaData mapNameEnglish. */
    public mapNameEnglish: string;

    /** MapMetaData mapWidth. */
    public mapWidth: number;

    /** MapMetaData mapHeight. */
    public mapHeight: number;

    /** MapMetaData playersCount. */
    public playersCount: number;

    /** MapMetaData isEnabledForMultiCustomWar. */
    public isEnabledForMultiCustomWar: number;

    /** MapMetaData isEnabledForWarRoom. */
    public isEnabledForWarRoom: number;

    /**
     * Creates a new MapMetaData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns MapMetaData instance
     */
    public static create(properties?: IMapMetaData): MapMetaData;

    /**
     * Encodes the specified MapMetaData message. Does not implicitly {@link MapMetaData.verify|verify} messages.
     * @param message MapMetaData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IMapMetaData, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified MapMetaData message, length delimited. Does not implicitly {@link MapMetaData.verify|verify} messages.
     * @param message MapMetaData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IMapMetaData, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a MapMetaData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns MapMetaData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): MapMetaData;

    /**
     * Decodes a MapMetaData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns MapMetaData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): MapMetaData;

    /**
     * Verifies a MapMetaData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a MapMetaData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns MapMetaData
     */
    public static fromObject(object: { [k: string]: any }): MapMetaData;

    /**
     * Creates a plain object from a MapMetaData message. Also converts values to other types if specified.
     * @param message MapMetaData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: MapMetaData, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this MapMetaData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a MapStatisticsData. */
export declare interface IMapStatisticsData {

    /** MapStatisticsData mapFileName */
    mapFileName?: (string|null);

    /** MapStatisticsData rating */
    rating?: (number|null);

    /** MapStatisticsData mcwPlayedTimes */
    mcwPlayedTimes?: (number|null);

    /** MapStatisticsData mcwTotalTurns */
    mcwTotalTurns?: (number|null);

    /** MapStatisticsData mcwP1Wins */
    mcwP1Wins?: (number|null);

    /** MapStatisticsData mcwP1Loses */
    mcwP1Loses?: (number|null);

    /** MapStatisticsData mcwP1Draws */
    mcwP1Draws?: (number|null);

    /** MapStatisticsData mcwP2Wins */
    mcwP2Wins?: (number|null);

    /** MapStatisticsData mcwP2Loses */
    mcwP2Loses?: (number|null);

    /** MapStatisticsData mcwP2Draws */
    mcwP2Draws?: (number|null);

    /** MapStatisticsData mcwP3Wins */
    mcwP3Wins?: (number|null);

    /** MapStatisticsData mcwP3Loses */
    mcwP3Loses?: (number|null);

    /** MapStatisticsData mcwP3Draws */
    mcwP3Draws?: (number|null);

    /** MapStatisticsData mcwP4Wins */
    mcwP4Wins?: (number|null);

    /** MapStatisticsData mcwP4Loses */
    mcwP4Loses?: (number|null);

    /** MapStatisticsData mcwP4Draws */
    mcwP4Draws?: (number|null);

    /** MapStatisticsData rankPlayedTimes */
    rankPlayedTimes?: (number|null);

    /** MapStatisticsData rankTotalTurns */
    rankTotalTurns?: (number|null);

    /** MapStatisticsData rankP1Wins */
    rankP1Wins?: (number|null);

    /** MapStatisticsData rankP1Loses */
    rankP1Loses?: (number|null);

    /** MapStatisticsData rankP1Draws */
    rankP1Draws?: (number|null);

    /** MapStatisticsData rankP2Wins */
    rankP2Wins?: (number|null);

    /** MapStatisticsData rankP2Loses */
    rankP2Loses?: (number|null);

    /** MapStatisticsData rankP2Draws */
    rankP2Draws?: (number|null);

    /** MapStatisticsData rankP3Wins */
    rankP3Wins?: (number|null);

    /** MapStatisticsData rankP3Loses */
    rankP3Loses?: (number|null);

    /** MapStatisticsData rankP3Draws */
    rankP3Draws?: (number|null);

    /** MapStatisticsData rankP4Wins */
    rankP4Wins?: (number|null);

    /** MapStatisticsData rankP4Loses */
    rankP4Loses?: (number|null);

    /** MapStatisticsData rankP4Draws */
    rankP4Draws?: (number|null);
}

/** Represents a MapStatisticsData. */
export declare class MapStatisticsData implements IMapStatisticsData {

    /**
     * Constructs a new MapStatisticsData.
     * @param [properties] Properties to set
     */
    constructor(properties?: IMapStatisticsData);

    /** MapStatisticsData mapFileName. */
    public mapFileName: string;

    /** MapStatisticsData rating. */
    public rating: number;

    /** MapStatisticsData mcwPlayedTimes. */
    public mcwPlayedTimes: number;

    /** MapStatisticsData mcwTotalTurns. */
    public mcwTotalTurns: number;

    /** MapStatisticsData mcwP1Wins. */
    public mcwP1Wins: number;

    /** MapStatisticsData mcwP1Loses. */
    public mcwP1Loses: number;

    /** MapStatisticsData mcwP1Draws. */
    public mcwP1Draws: number;

    /** MapStatisticsData mcwP2Wins. */
    public mcwP2Wins: number;

    /** MapStatisticsData mcwP2Loses. */
    public mcwP2Loses: number;

    /** MapStatisticsData mcwP2Draws. */
    public mcwP2Draws: number;

    /** MapStatisticsData mcwP3Wins. */
    public mcwP3Wins: number;

    /** MapStatisticsData mcwP3Loses. */
    public mcwP3Loses: number;

    /** MapStatisticsData mcwP3Draws. */
    public mcwP3Draws: number;

    /** MapStatisticsData mcwP4Wins. */
    public mcwP4Wins: number;

    /** MapStatisticsData mcwP4Loses. */
    public mcwP4Loses: number;

    /** MapStatisticsData mcwP4Draws. */
    public mcwP4Draws: number;

    /** MapStatisticsData rankPlayedTimes. */
    public rankPlayedTimes: number;

    /** MapStatisticsData rankTotalTurns. */
    public rankTotalTurns: number;

    /** MapStatisticsData rankP1Wins. */
    public rankP1Wins: number;

    /** MapStatisticsData rankP1Loses. */
    public rankP1Loses: number;

    /** MapStatisticsData rankP1Draws. */
    public rankP1Draws: number;

    /** MapStatisticsData rankP2Wins. */
    public rankP2Wins: number;

    /** MapStatisticsData rankP2Loses. */
    public rankP2Loses: number;

    /** MapStatisticsData rankP2Draws. */
    public rankP2Draws: number;

    /** MapStatisticsData rankP3Wins. */
    public rankP3Wins: number;

    /** MapStatisticsData rankP3Loses. */
    public rankP3Loses: number;

    /** MapStatisticsData rankP3Draws. */
    public rankP3Draws: number;

    /** MapStatisticsData rankP4Wins. */
    public rankP4Wins: number;

    /** MapStatisticsData rankP4Loses. */
    public rankP4Loses: number;

    /** MapStatisticsData rankP4Draws. */
    public rankP4Draws: number;

    /**
     * Creates a new MapStatisticsData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns MapStatisticsData instance
     */
    public static create(properties?: IMapStatisticsData): MapStatisticsData;

    /**
     * Encodes the specified MapStatisticsData message. Does not implicitly {@link MapStatisticsData.verify|verify} messages.
     * @param message MapStatisticsData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IMapStatisticsData, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified MapStatisticsData message, length delimited. Does not implicitly {@link MapStatisticsData.verify|verify} messages.
     * @param message MapStatisticsData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IMapStatisticsData, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a MapStatisticsData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns MapStatisticsData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): MapStatisticsData;

    /**
     * Decodes a MapStatisticsData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns MapStatisticsData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): MapStatisticsData;

    /**
     * Verifies a MapStatisticsData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a MapStatisticsData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns MapStatisticsData
     */
    public static fromObject(object: { [k: string]: any }): MapStatisticsData;

    /**
     * Creates a plain object from a MapStatisticsData message. Also converts values to other types if specified.
     * @param message MapStatisticsData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: MapStatisticsData, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this MapStatisticsData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a SerializedWarTile. */
export declare interface ISerializedWarTile {

    /** SerializedWarTile gridX */
    gridX?: (number|null);

    /** SerializedWarTile gridY */
    gridY?: (number|null);

    /** SerializedWarTile baseViewId */
    baseViewId?: (number|null);

    /** SerializedWarTile objectViewId */
    objectViewId?: (number|null);

    /** SerializedWarTile currentHp */
    currentHp?: (number|null);

    /** SerializedWarTile currentBuildPoint */
    currentBuildPoint?: (number|null);

    /** SerializedWarTile currentCapturePoint */
    currentCapturePoint?: (number|null);
}

/** Represents a SerializedWarTile. */
export declare class SerializedWarTile implements ISerializedWarTile {

    /**
     * Constructs a new SerializedWarTile.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISerializedWarTile);

    /** SerializedWarTile gridX. */
    public gridX: number;

    /** SerializedWarTile gridY. */
    public gridY: number;

    /** SerializedWarTile baseViewId. */
    public baseViewId: number;

    /** SerializedWarTile objectViewId. */
    public objectViewId: number;

    /** SerializedWarTile currentHp. */
    public currentHp: number;

    /** SerializedWarTile currentBuildPoint. */
    public currentBuildPoint: number;

    /** SerializedWarTile currentCapturePoint. */
    public currentCapturePoint: number;

    /**
     * Creates a new SerializedWarTile instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SerializedWarTile instance
     */
    public static create(properties?: ISerializedWarTile): SerializedWarTile;

    /**
     * Encodes the specified SerializedWarTile message. Does not implicitly {@link SerializedWarTile.verify|verify} messages.
     * @param message SerializedWarTile message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISerializedWarTile, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified SerializedWarTile message, length delimited. Does not implicitly {@link SerializedWarTile.verify|verify} messages.
     * @param message SerializedWarTile message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISerializedWarTile, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a SerializedWarTile message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SerializedWarTile
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): SerializedWarTile;

    /**
     * Decodes a SerializedWarTile message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SerializedWarTile
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): SerializedWarTile;

    /**
     * Verifies a SerializedWarTile message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a SerializedWarTile message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SerializedWarTile
     */
    public static fromObject(object: { [k: string]: any }): SerializedWarTile;

    /**
     * Creates a plain object from a SerializedWarTile message. Also converts values to other types if specified.
     * @param message SerializedWarTile
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: SerializedWarTile, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this SerializedWarTile to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a SerializedWarUnit. */
export declare interface ISerializedWarUnit {

    /** SerializedWarUnit gridX */
    gridX?: (number|null);

    /** SerializedWarUnit gridY */
    gridY?: (number|null);

    /** SerializedWarUnit viewId */
    viewId?: (number|null);

    /** SerializedWarUnit unitId */
    unitId?: (number|null);

    /** SerializedWarUnit state */
    state?: (number|null);

    /** SerializedWarUnit primaryWeaponCurrentAmmo */
    primaryWeaponCurrentAmmo?: (number|null);

    /** SerializedWarUnit currentHp */
    currentHp?: (number|null);

    /** SerializedWarUnit isCapturingTile */
    isCapturingTile?: (boolean|null);

    /** SerializedWarUnit isDiving */
    isDiving?: (boolean|null);

    /** SerializedWarUnit flareCurrentAmmo */
    flareCurrentAmmo?: (number|null);

    /** SerializedWarUnit currentFuel */
    currentFuel?: (number|null);

    /** SerializedWarUnit currentBuildMaterial */
    currentBuildMaterial?: (number|null);

    /** SerializedWarUnit currentProduceMaterial */
    currentProduceMaterial?: (number|null);

    /** SerializedWarUnit currentPromotion */
    currentPromotion?: (number|null);

    /** SerializedWarUnit isBuildingTile */
    isBuildingTile?: (boolean|null);

    /** SerializedWarUnit loaderUnitId */
    loaderUnitId?: (number|null);
}

/** Represents a SerializedWarUnit. */
export declare class SerializedWarUnit implements ISerializedWarUnit {

    /**
     * Constructs a new SerializedWarUnit.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISerializedWarUnit);

    /** SerializedWarUnit gridX. */
    public gridX: number;

    /** SerializedWarUnit gridY. */
    public gridY: number;

    /** SerializedWarUnit viewId. */
    public viewId: number;

    /** SerializedWarUnit unitId. */
    public unitId: number;

    /** SerializedWarUnit state. */
    public state: number;

    /** SerializedWarUnit primaryWeaponCurrentAmmo. */
    public primaryWeaponCurrentAmmo: number;

    /** SerializedWarUnit currentHp. */
    public currentHp: number;

    /** SerializedWarUnit isCapturingTile. */
    public isCapturingTile: boolean;

    /** SerializedWarUnit isDiving. */
    public isDiving: boolean;

    /** SerializedWarUnit flareCurrentAmmo. */
    public flareCurrentAmmo: number;

    /** SerializedWarUnit currentFuel. */
    public currentFuel: number;

    /** SerializedWarUnit currentBuildMaterial. */
    public currentBuildMaterial: number;

    /** SerializedWarUnit currentProduceMaterial. */
    public currentProduceMaterial: number;

    /** SerializedWarUnit currentPromotion. */
    public currentPromotion: number;

    /** SerializedWarUnit isBuildingTile. */
    public isBuildingTile: boolean;

    /** SerializedWarUnit loaderUnitId. */
    public loaderUnitId: number;

    /**
     * Creates a new SerializedWarUnit instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SerializedWarUnit instance
     */
    public static create(properties?: ISerializedWarUnit): SerializedWarUnit;

    /**
     * Encodes the specified SerializedWarUnit message. Does not implicitly {@link SerializedWarUnit.verify|verify} messages.
     * @param message SerializedWarUnit message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISerializedWarUnit, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified SerializedWarUnit message, length delimited. Does not implicitly {@link SerializedWarUnit.verify|verify} messages.
     * @param message SerializedWarUnit message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISerializedWarUnit, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a SerializedWarUnit message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SerializedWarUnit
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): SerializedWarUnit;

    /**
     * Decodes a SerializedWarUnit message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SerializedWarUnit
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): SerializedWarUnit;

    /**
     * Verifies a SerializedWarUnit message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a SerializedWarUnit message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SerializedWarUnit
     */
    public static fromObject(object: { [k: string]: any }): SerializedWarUnit;

    /**
     * Creates a plain object from a SerializedWarUnit message. Also converts values to other types if specified.
     * @param message SerializedWarUnit
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: SerializedWarUnit, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this SerializedWarUnit to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a SerializedWarPlayer. */
export declare interface ISerializedWarPlayer {

    /** SerializedWarPlayer fund */
    fund?: (number|null);

    /** SerializedWarPlayer hasVotedForDraw */
    hasVotedForDraw?: (boolean|null);

    /** SerializedWarPlayer isAlive */
    isAlive?: (boolean|null);

    /** SerializedWarPlayer playerIndex */
    playerIndex?: (number|null);

    /** SerializedWarPlayer teamIndex */
    teamIndex?: (number|null);

    /** SerializedWarPlayer userId */
    userId?: (number|null);

    /** SerializedWarPlayer nickname */
    nickname?: (string|null);

    /** SerializedWarPlayer coId */
    coId?: (number|null);

    /** SerializedWarPlayer coUnitId */
    coUnitId?: (number|null);

    /** SerializedWarPlayer coCurrentEnergy */
    coCurrentEnergy?: (number|null);

    /** SerializedWarPlayer coUsingSkillType */
    coUsingSkillType?: (number|null);

    /** SerializedWarPlayer coIsDestroyedInTurn */
    coIsDestroyedInTurn?: (boolean|null);
}

/** Represents a SerializedWarPlayer. */
export declare class SerializedWarPlayer implements ISerializedWarPlayer {

    /**
     * Constructs a new SerializedWarPlayer.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISerializedWarPlayer);

    /** SerializedWarPlayer fund. */
    public fund: number;

    /** SerializedWarPlayer hasVotedForDraw. */
    public hasVotedForDraw: boolean;

    /** SerializedWarPlayer isAlive. */
    public isAlive: boolean;

    /** SerializedWarPlayer playerIndex. */
    public playerIndex: number;

    /** SerializedWarPlayer teamIndex. */
    public teamIndex: number;

    /** SerializedWarPlayer userId. */
    public userId: number;

    /** SerializedWarPlayer nickname. */
    public nickname: string;

    /** SerializedWarPlayer coId. */
    public coId: number;

    /** SerializedWarPlayer coUnitId. */
    public coUnitId: number;

    /** SerializedWarPlayer coCurrentEnergy. */
    public coCurrentEnergy: number;

    /** SerializedWarPlayer coUsingSkillType. */
    public coUsingSkillType: number;

    /** SerializedWarPlayer coIsDestroyedInTurn. */
    public coIsDestroyedInTurn: boolean;

    /**
     * Creates a new SerializedWarPlayer instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SerializedWarPlayer instance
     */
    public static create(properties?: ISerializedWarPlayer): SerializedWarPlayer;

    /**
     * Encodes the specified SerializedWarPlayer message. Does not implicitly {@link SerializedWarPlayer.verify|verify} messages.
     * @param message SerializedWarPlayer message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISerializedWarPlayer, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified SerializedWarPlayer message, length delimited. Does not implicitly {@link SerializedWarPlayer.verify|verify} messages.
     * @param message SerializedWarPlayer message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISerializedWarPlayer, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a SerializedWarPlayer message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SerializedWarPlayer
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): SerializedWarPlayer;

    /**
     * Decodes a SerializedWarPlayer message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SerializedWarPlayer
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): SerializedWarPlayer;

    /**
     * Verifies a SerializedWarPlayer message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a SerializedWarPlayer message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SerializedWarPlayer
     */
    public static fromObject(object: { [k: string]: any }): SerializedWarPlayer;

    /**
     * Creates a plain object from a SerializedWarPlayer message. Also converts values to other types if specified.
     * @param message SerializedWarPlayer
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: SerializedWarPlayer, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this SerializedWarPlayer to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a SerializedWarTurn. */
export declare interface ISerializedWarTurn {

    /** SerializedWarTurn turnIndex */
    turnIndex?: (number|null);

    /** SerializedWarTurn playerIndex */
    playerIndex?: (number|null);

    /** SerializedWarTurn turnPhaseCode */
    turnPhaseCode?: (number|null);

    /** SerializedWarTurn enterTurnTime */
    enterTurnTime?: (number|null);
}

/** Represents a SerializedWarTurn. */
export declare class SerializedWarTurn implements ISerializedWarTurn {

    /**
     * Constructs a new SerializedWarTurn.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISerializedWarTurn);

    /** SerializedWarTurn turnIndex. */
    public turnIndex: number;

    /** SerializedWarTurn playerIndex. */
    public playerIndex: number;

    /** SerializedWarTurn turnPhaseCode. */
    public turnPhaseCode: number;

    /** SerializedWarTurn enterTurnTime. */
    public enterTurnTime: number;

    /**
     * Creates a new SerializedWarTurn instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SerializedWarTurn instance
     */
    public static create(properties?: ISerializedWarTurn): SerializedWarTurn;

    /**
     * Encodes the specified SerializedWarTurn message. Does not implicitly {@link SerializedWarTurn.verify|verify} messages.
     * @param message SerializedWarTurn message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISerializedWarTurn, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified SerializedWarTurn message, length delimited. Does not implicitly {@link SerializedWarTurn.verify|verify} messages.
     * @param message SerializedWarTurn message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISerializedWarTurn, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a SerializedWarTurn message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SerializedWarTurn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): SerializedWarTurn;

    /**
     * Decodes a SerializedWarTurn message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SerializedWarTurn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): SerializedWarTurn;

    /**
     * Verifies a SerializedWarTurn message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a SerializedWarTurn message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SerializedWarTurn
     */
    public static fromObject(object: { [k: string]: any }): SerializedWarTurn;

    /**
     * Creates a plain object from a SerializedWarTurn message. Also converts values to other types if specified.
     * @param message SerializedWarTurn
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: SerializedWarTurn, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this SerializedWarTurn to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a SerializedWarTileMap. */
export declare interface ISerializedWarTileMap {

    /** SerializedWarTileMap tiles */
    tiles?: (ISerializedWarTile[]|null);
}

/** Represents a SerializedWarTileMap. */
export declare class SerializedWarTileMap implements ISerializedWarTileMap {

    /**
     * Constructs a new SerializedWarTileMap.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISerializedWarTileMap);

    /** SerializedWarTileMap tiles. */
    public tiles: ISerializedWarTile[];

    /**
     * Creates a new SerializedWarTileMap instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SerializedWarTileMap instance
     */
    public static create(properties?: ISerializedWarTileMap): SerializedWarTileMap;

    /**
     * Encodes the specified SerializedWarTileMap message. Does not implicitly {@link SerializedWarTileMap.verify|verify} messages.
     * @param message SerializedWarTileMap message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISerializedWarTileMap, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified SerializedWarTileMap message, length delimited. Does not implicitly {@link SerializedWarTileMap.verify|verify} messages.
     * @param message SerializedWarTileMap message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISerializedWarTileMap, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a SerializedWarTileMap message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SerializedWarTileMap
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): SerializedWarTileMap;

    /**
     * Decodes a SerializedWarTileMap message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SerializedWarTileMap
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): SerializedWarTileMap;

    /**
     * Verifies a SerializedWarTileMap message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a SerializedWarTileMap message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SerializedWarTileMap
     */
    public static fromObject(object: { [k: string]: any }): SerializedWarTileMap;

    /**
     * Creates a plain object from a SerializedWarTileMap message. Also converts values to other types if specified.
     * @param message SerializedWarTileMap
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: SerializedWarTileMap, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this SerializedWarTileMap to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a SerializedWarUnitMap. */
export declare interface ISerializedWarUnitMap {

    /** SerializedWarUnitMap nextUnitId */
    nextUnitId?: (number|null);

    /** SerializedWarUnitMap units */
    units?: (ISerializedWarUnit[]|null);
}

/** Represents a SerializedWarUnitMap. */
export declare class SerializedWarUnitMap implements ISerializedWarUnitMap {

    /**
     * Constructs a new SerializedWarUnitMap.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISerializedWarUnitMap);

    /** SerializedWarUnitMap nextUnitId. */
    public nextUnitId: number;

    /** SerializedWarUnitMap units. */
    public units: ISerializedWarUnit[];

    /**
     * Creates a new SerializedWarUnitMap instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SerializedWarUnitMap instance
     */
    public static create(properties?: ISerializedWarUnitMap): SerializedWarUnitMap;

    /**
     * Encodes the specified SerializedWarUnitMap message. Does not implicitly {@link SerializedWarUnitMap.verify|verify} messages.
     * @param message SerializedWarUnitMap message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISerializedWarUnitMap, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified SerializedWarUnitMap message, length delimited. Does not implicitly {@link SerializedWarUnitMap.verify|verify} messages.
     * @param message SerializedWarUnitMap message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISerializedWarUnitMap, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a SerializedWarUnitMap message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SerializedWarUnitMap
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): SerializedWarUnitMap;

    /**
     * Decodes a SerializedWarUnitMap message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SerializedWarUnitMap
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): SerializedWarUnitMap;

    /**
     * Verifies a SerializedWarUnitMap message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a SerializedWarUnitMap message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SerializedWarUnitMap
     */
    public static fromObject(object: { [k: string]: any }): SerializedWarUnitMap;

    /**
     * Creates a plain object from a SerializedWarUnitMap message. Also converts values to other types if specified.
     * @param message SerializedWarUnitMap
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: SerializedWarUnitMap, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this SerializedWarUnitMap to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a SerializedWarFogMapForPath. */
export declare interface ISerializedWarFogMapForPath {

    /** SerializedWarFogMapForPath playerIndex */
    playerIndex?: (number|null);

    /** SerializedWarFogMapForPath encodedMap */
    encodedMap?: (string|null);
}

/** Represents a SerializedWarFogMapForPath. */
export declare class SerializedWarFogMapForPath implements ISerializedWarFogMapForPath {

    /**
     * Constructs a new SerializedWarFogMapForPath.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISerializedWarFogMapForPath);

    /** SerializedWarFogMapForPath playerIndex. */
    public playerIndex: number;

    /** SerializedWarFogMapForPath encodedMap. */
    public encodedMap: string;

    /**
     * Creates a new SerializedWarFogMapForPath instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SerializedWarFogMapForPath instance
     */
    public static create(properties?: ISerializedWarFogMapForPath): SerializedWarFogMapForPath;

    /**
     * Encodes the specified SerializedWarFogMapForPath message. Does not implicitly {@link SerializedWarFogMapForPath.verify|verify} messages.
     * @param message SerializedWarFogMapForPath message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISerializedWarFogMapForPath, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified SerializedWarFogMapForPath message, length delimited. Does not implicitly {@link SerializedWarFogMapForPath.verify|verify} messages.
     * @param message SerializedWarFogMapForPath message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISerializedWarFogMapForPath, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a SerializedWarFogMapForPath message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SerializedWarFogMapForPath
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): SerializedWarFogMapForPath;

    /**
     * Decodes a SerializedWarFogMapForPath message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SerializedWarFogMapForPath
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): SerializedWarFogMapForPath;

    /**
     * Verifies a SerializedWarFogMapForPath message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a SerializedWarFogMapForPath message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SerializedWarFogMapForPath
     */
    public static fromObject(object: { [k: string]: any }): SerializedWarFogMapForPath;

    /**
     * Creates a plain object from a SerializedWarFogMapForPath message. Also converts values to other types if specified.
     * @param message SerializedWarFogMapForPath
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: SerializedWarFogMapForPath, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this SerializedWarFogMapForPath to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a SerializedWarFogMap. */
export declare interface ISerializedWarFogMap {

    /** SerializedWarFogMap forceFogCode */
    forceFogCode?: (number|null);

    /** SerializedWarFogMap forceExpirePlayerIndex */
    forceExpirePlayerIndex?: (number|null);

    /** SerializedWarFogMap forceExpireTurnIndex */
    forceExpireTurnIndex?: (number|null);

    /** SerializedWarFogMap mapsForPath */
    mapsForPath?: (ISerializedWarFogMapForPath[]|null);
}

/** Represents a SerializedWarFogMap. */
export declare class SerializedWarFogMap implements ISerializedWarFogMap {

    /**
     * Constructs a new SerializedWarFogMap.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISerializedWarFogMap);

    /** SerializedWarFogMap forceFogCode. */
    public forceFogCode: number;

    /** SerializedWarFogMap forceExpirePlayerIndex. */
    public forceExpirePlayerIndex: number;

    /** SerializedWarFogMap forceExpireTurnIndex. */
    public forceExpireTurnIndex: number;

    /** SerializedWarFogMap mapsForPath. */
    public mapsForPath: ISerializedWarFogMapForPath[];

    /**
     * Creates a new SerializedWarFogMap instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SerializedWarFogMap instance
     */
    public static create(properties?: ISerializedWarFogMap): SerializedWarFogMap;

    /**
     * Encodes the specified SerializedWarFogMap message. Does not implicitly {@link SerializedWarFogMap.verify|verify} messages.
     * @param message SerializedWarFogMap message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISerializedWarFogMap, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified SerializedWarFogMap message, length delimited. Does not implicitly {@link SerializedWarFogMap.verify|verify} messages.
     * @param message SerializedWarFogMap message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISerializedWarFogMap, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a SerializedWarFogMap message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SerializedWarFogMap
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): SerializedWarFogMap;

    /**
     * Decodes a SerializedWarFogMap message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SerializedWarFogMap
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): SerializedWarFogMap;

    /**
     * Verifies a SerializedWarFogMap message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a SerializedWarFogMap message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SerializedWarFogMap
     */
    public static fromObject(object: { [k: string]: any }): SerializedWarFogMap;

    /**
     * Creates a plain object from a SerializedWarFogMap message. Also converts values to other types if specified.
     * @param message SerializedWarFogMap
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: SerializedWarFogMap, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this SerializedWarFogMap to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a SerializedWarField. */
export declare interface ISerializedWarField {

    /** SerializedWarField fogMap */
    fogMap?: (ISerializedWarFogMap|null);

    /** SerializedWarField tileMap */
    tileMap?: (ISerializedWarTileMap|null);

    /** SerializedWarField unitMap */
    unitMap?: (ISerializedWarUnitMap|null);
}

/** Represents a SerializedWarField. */
export declare class SerializedWarField implements ISerializedWarField {

    /**
     * Constructs a new SerializedWarField.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISerializedWarField);

    /** SerializedWarField fogMap. */
    public fogMap?: (ISerializedWarFogMap|null);

    /** SerializedWarField tileMap. */
    public tileMap?: (ISerializedWarTileMap|null);

    /** SerializedWarField unitMap. */
    public unitMap?: (ISerializedWarUnitMap|null);

    /**
     * Creates a new SerializedWarField instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SerializedWarField instance
     */
    public static create(properties?: ISerializedWarField): SerializedWarField;

    /**
     * Encodes the specified SerializedWarField message. Does not implicitly {@link SerializedWarField.verify|verify} messages.
     * @param message SerializedWarField message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISerializedWarField, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified SerializedWarField message, length delimited. Does not implicitly {@link SerializedWarField.verify|verify} messages.
     * @param message SerializedWarField message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISerializedWarField, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a SerializedWarField message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SerializedWarField
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): SerializedWarField;

    /**
     * Decodes a SerializedWarField message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SerializedWarField
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): SerializedWarField;

    /**
     * Verifies a SerializedWarField message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a SerializedWarField message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SerializedWarField
     */
    public static fromObject(object: { [k: string]: any }): SerializedWarField;

    /**
     * Creates a plain object from a SerializedWarField message. Also converts values to other types if specified.
     * @param message SerializedWarField
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: SerializedWarField, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this SerializedWarField to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a SerializedWar. */
export declare interface ISerializedWar {

    /** SerializedWar warId */
    warId?: (number|null);

    /** SerializedWar configVersion */
    configVersion?: (string|null);

    /** SerializedWar mapFileName */
    mapFileName?: (string|null);

    /** SerializedWar warName */
    warName?: (string|null);

    /** SerializedWar warPassword */
    warPassword?: (string|null);

    /** SerializedWar warComment */
    warComment?: (string|null);

    /** SerializedWar hasFogByDefault */
    hasFogByDefault?: (boolean|null);

    /** SerializedWar timeLimit */
    timeLimit?: (number|null);

    /** SerializedWar initialFund */
    initialFund?: (number|null);

    /** SerializedWar incomeModifier */
    incomeModifier?: (number|null);

    /** SerializedWar initialEnergy */
    initialEnergy?: (number|null);

    /** SerializedWar energyGrowthModifier */
    energyGrowthModifier?: (number|null);

    /** SerializedWar moveRangeModifier */
    moveRangeModifier?: (number|null);

    /** SerializedWar attackPowerModifier */
    attackPowerModifier?: (number|null);

    /** SerializedWar visionRangeModifier */
    visionRangeModifier?: (number|null);

    /** SerializedWar bannedCoIdList */
    bannedCoIdList?: (number[]|null);

    /** SerializedWar luckLowerLimit */
    luckLowerLimit?: (number|null);

    /** SerializedWar luckUpperLimit */
    luckUpperLimit?: (number|null);

    /** SerializedWar nextActionId */
    nextActionId?: (number|null);

    /** SerializedWar remainingVotesForDraw */
    remainingVotesForDraw?: (number|null);

    /** SerializedWar executedActions */
    executedActions?: (IWarActionContainer[]|null);

    /** SerializedWar players */
    players?: (ISerializedWarPlayer[]|null);

    /** SerializedWar turn */
    turn?: (ISerializedWarTurn|null);

    /** SerializedWar field */
    field?: (ISerializedWarField|null);

    /** SerializedWar seedRandomState */
    seedRandomState?: (ISeedRandomState|null);
}

/** Represents a SerializedWar. */
export declare class SerializedWar implements ISerializedWar {

    /**
     * Constructs a new SerializedWar.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISerializedWar);

    /** SerializedWar warId. */
    public warId: number;

    /** SerializedWar configVersion. */
    public configVersion: string;

    /** SerializedWar mapFileName. */
    public mapFileName: string;

    /** SerializedWar warName. */
    public warName: string;

    /** SerializedWar warPassword. */
    public warPassword: string;

    /** SerializedWar warComment. */
    public warComment: string;

    /** SerializedWar hasFogByDefault. */
    public hasFogByDefault: boolean;

    /** SerializedWar timeLimit. */
    public timeLimit: number;

    /** SerializedWar initialFund. */
    public initialFund: number;

    /** SerializedWar incomeModifier. */
    public incomeModifier: number;

    /** SerializedWar initialEnergy. */
    public initialEnergy: number;

    /** SerializedWar energyGrowthModifier. */
    public energyGrowthModifier: number;

    /** SerializedWar moveRangeModifier. */
    public moveRangeModifier: number;

    /** SerializedWar attackPowerModifier. */
    public attackPowerModifier: number;

    /** SerializedWar visionRangeModifier. */
    public visionRangeModifier: number;

    /** SerializedWar bannedCoIdList. */
    public bannedCoIdList: number[];

    /** SerializedWar luckLowerLimit. */
    public luckLowerLimit: number;

    /** SerializedWar luckUpperLimit. */
    public luckUpperLimit: number;

    /** SerializedWar nextActionId. */
    public nextActionId: number;

    /** SerializedWar remainingVotesForDraw. */
    public remainingVotesForDraw: number;

    /** SerializedWar executedActions. */
    public executedActions: IWarActionContainer[];

    /** SerializedWar players. */
    public players: ISerializedWarPlayer[];

    /** SerializedWar turn. */
    public turn?: (ISerializedWarTurn|null);

    /** SerializedWar field. */
    public field?: (ISerializedWarField|null);

    /** SerializedWar seedRandomState. */
    public seedRandomState?: (ISeedRandomState|null);

    /**
     * Creates a new SerializedWar instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SerializedWar instance
     */
    public static create(properties?: ISerializedWar): SerializedWar;

    /**
     * Encodes the specified SerializedWar message. Does not implicitly {@link SerializedWar.verify|verify} messages.
     * @param message SerializedWar message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISerializedWar, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified SerializedWar message, length delimited. Does not implicitly {@link SerializedWar.verify|verify} messages.
     * @param message SerializedWar message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISerializedWar, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a SerializedWar message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SerializedWar
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): SerializedWar;

    /**
     * Decodes a SerializedWar message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SerializedWar
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): SerializedWar;

    /**
     * Verifies a SerializedWar message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a SerializedWar message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SerializedWar
     */
    public static fromObject(object: { [k: string]: any }): SerializedWar;

    /**
     * Creates a plain object from a SerializedWar message. Also converts values to other types if specified.
     * @param message SerializedWar
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: SerializedWar, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this SerializedWar to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a WarUnitRepairData. */
export declare interface IWarUnitRepairData {

    /** WarUnitRepairData unitId */
    unitId?: (number|null);

    /** WarUnitRepairData repairAmount */
    repairAmount?: (number|null);

    /** WarUnitRepairData gridIndex */
    gridIndex?: (IGridIndex|null);
}

/** Represents a WarUnitRepairData. */
export declare class WarUnitRepairData implements IWarUnitRepairData {

    /**
     * Constructs a new WarUnitRepairData.
     * @param [properties] Properties to set
     */
    constructor(properties?: IWarUnitRepairData);

    /** WarUnitRepairData unitId. */
    public unitId: number;

    /** WarUnitRepairData repairAmount. */
    public repairAmount: number;

    /** WarUnitRepairData gridIndex. */
    public gridIndex?: (IGridIndex|null);

    /**
     * Creates a new WarUnitRepairData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns WarUnitRepairData instance
     */
    public static create(properties?: IWarUnitRepairData): WarUnitRepairData;

    /**
     * Encodes the specified WarUnitRepairData message. Does not implicitly {@link WarUnitRepairData.verify|verify} messages.
     * @param message WarUnitRepairData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IWarUnitRepairData, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified WarUnitRepairData message, length delimited. Does not implicitly {@link WarUnitRepairData.verify|verify} messages.
     * @param message WarUnitRepairData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IWarUnitRepairData, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a WarUnitRepairData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns WarUnitRepairData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): WarUnitRepairData;

    /**
     * Decodes a WarUnitRepairData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns WarUnitRepairData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): WarUnitRepairData;

    /**
     * Verifies a WarUnitRepairData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a WarUnitRepairData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns WarUnitRepairData
     */
    public static fromObject(object: { [k: string]: any }): WarUnitRepairData;

    /**
     * Creates a plain object from a WarUnitRepairData message. Also converts values to other types if specified.
     * @param message WarUnitRepairData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: WarUnitRepairData, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this WarUnitRepairData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a WarUseCoSkillExtraData. */
export declare interface IWarUseCoSkillExtraData {

    /** WarUseCoSkillExtraData indiscriminateAreaDamageCenter */
    indiscriminateAreaDamageCenter?: (IGridIndex|null);
}

/** Represents a WarUseCoSkillExtraData. */
export declare class WarUseCoSkillExtraData implements IWarUseCoSkillExtraData {

    /**
     * Constructs a new WarUseCoSkillExtraData.
     * @param [properties] Properties to set
     */
    constructor(properties?: IWarUseCoSkillExtraData);

    /** WarUseCoSkillExtraData indiscriminateAreaDamageCenter. */
    public indiscriminateAreaDamageCenter?: (IGridIndex|null);

    /**
     * Creates a new WarUseCoSkillExtraData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns WarUseCoSkillExtraData instance
     */
    public static create(properties?: IWarUseCoSkillExtraData): WarUseCoSkillExtraData;

    /**
     * Encodes the specified WarUseCoSkillExtraData message. Does not implicitly {@link WarUseCoSkillExtraData.verify|verify} messages.
     * @param message WarUseCoSkillExtraData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IWarUseCoSkillExtraData, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified WarUseCoSkillExtraData message, length delimited. Does not implicitly {@link WarUseCoSkillExtraData.verify|verify} messages.
     * @param message WarUseCoSkillExtraData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IWarUseCoSkillExtraData, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a WarUseCoSkillExtraData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns WarUseCoSkillExtraData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): WarUseCoSkillExtraData;

    /**
     * Decodes a WarUseCoSkillExtraData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns WarUseCoSkillExtraData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): WarUseCoSkillExtraData;

    /**
     * Verifies a WarUseCoSkillExtraData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a WarUseCoSkillExtraData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns WarUseCoSkillExtraData
     */
    public static fromObject(object: { [k: string]: any }): WarUseCoSkillExtraData;

    /**
     * Creates a plain object from a WarUseCoSkillExtraData message. Also converts values to other types if specified.
     * @param message WarUseCoSkillExtraData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: WarUseCoSkillExtraData, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this WarUseCoSkillExtraData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a WarActionPlayerBeginTurn. */
export declare interface IWarActionPlayerBeginTurn {

    /** WarActionPlayerBeginTurn remainingFund */
    remainingFund?: (number|null);

    /** WarActionPlayerBeginTurn isDefeated */
    isDefeated?: (boolean|null);

    /** WarActionPlayerBeginTurn repairDataByTile */
    repairDataByTile?: (IWarUnitRepairData[]|null);

    /** WarActionPlayerBeginTurn repairDataByUnit */
    repairDataByUnit?: (IWarUnitRepairData[]|null);

    /** WarActionPlayerBeginTurn recoverDataByCo */
    recoverDataByCo?: (IWarUnitRepairData[]|null);
}

/** Represents a WarActionPlayerBeginTurn. */
export declare class WarActionPlayerBeginTurn implements IWarActionPlayerBeginTurn {

    /**
     * Constructs a new WarActionPlayerBeginTurn.
     * @param [properties] Properties to set
     */
    constructor(properties?: IWarActionPlayerBeginTurn);

    /** WarActionPlayerBeginTurn remainingFund. */
    public remainingFund: number;

    /** WarActionPlayerBeginTurn isDefeated. */
    public isDefeated: boolean;

    /** WarActionPlayerBeginTurn repairDataByTile. */
    public repairDataByTile: IWarUnitRepairData[];

    /** WarActionPlayerBeginTurn repairDataByUnit. */
    public repairDataByUnit: IWarUnitRepairData[];

    /** WarActionPlayerBeginTurn recoverDataByCo. */
    public recoverDataByCo: IWarUnitRepairData[];

    /**
     * Creates a new WarActionPlayerBeginTurn instance using the specified properties.
     * @param [properties] Properties to set
     * @returns WarActionPlayerBeginTurn instance
     */
    public static create(properties?: IWarActionPlayerBeginTurn): WarActionPlayerBeginTurn;

    /**
     * Encodes the specified WarActionPlayerBeginTurn message. Does not implicitly {@link WarActionPlayerBeginTurn.verify|verify} messages.
     * @param message WarActionPlayerBeginTurn message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IWarActionPlayerBeginTurn, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified WarActionPlayerBeginTurn message, length delimited. Does not implicitly {@link WarActionPlayerBeginTurn.verify|verify} messages.
     * @param message WarActionPlayerBeginTurn message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IWarActionPlayerBeginTurn, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a WarActionPlayerBeginTurn message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns WarActionPlayerBeginTurn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): WarActionPlayerBeginTurn;

    /**
     * Decodes a WarActionPlayerBeginTurn message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns WarActionPlayerBeginTurn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): WarActionPlayerBeginTurn;

    /**
     * Verifies a WarActionPlayerBeginTurn message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a WarActionPlayerBeginTurn message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns WarActionPlayerBeginTurn
     */
    public static fromObject(object: { [k: string]: any }): WarActionPlayerBeginTurn;

    /**
     * Creates a plain object from a WarActionPlayerBeginTurn message. Also converts values to other types if specified.
     * @param message WarActionPlayerBeginTurn
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: WarActionPlayerBeginTurn, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this WarActionPlayerBeginTurn to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a WarActionPlayerEndTurn. */
export declare interface IWarActionPlayerEndTurn {
}

/** Represents a WarActionPlayerEndTurn. */
export declare class WarActionPlayerEndTurn implements IWarActionPlayerEndTurn {

    /**
     * Constructs a new WarActionPlayerEndTurn.
     * @param [properties] Properties to set
     */
    constructor(properties?: IWarActionPlayerEndTurn);

    /**
     * Creates a new WarActionPlayerEndTurn instance using the specified properties.
     * @param [properties] Properties to set
     * @returns WarActionPlayerEndTurn instance
     */
    public static create(properties?: IWarActionPlayerEndTurn): WarActionPlayerEndTurn;

    /**
     * Encodes the specified WarActionPlayerEndTurn message. Does not implicitly {@link WarActionPlayerEndTurn.verify|verify} messages.
     * @param message WarActionPlayerEndTurn message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IWarActionPlayerEndTurn, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified WarActionPlayerEndTurn message, length delimited. Does not implicitly {@link WarActionPlayerEndTurn.verify|verify} messages.
     * @param message WarActionPlayerEndTurn message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IWarActionPlayerEndTurn, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a WarActionPlayerEndTurn message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns WarActionPlayerEndTurn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): WarActionPlayerEndTurn;

    /**
     * Decodes a WarActionPlayerEndTurn message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns WarActionPlayerEndTurn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): WarActionPlayerEndTurn;

    /**
     * Verifies a WarActionPlayerEndTurn message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a WarActionPlayerEndTurn message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns WarActionPlayerEndTurn
     */
    public static fromObject(object: { [k: string]: any }): WarActionPlayerEndTurn;

    /**
     * Creates a plain object from a WarActionPlayerEndTurn message. Also converts values to other types if specified.
     * @param message WarActionPlayerEndTurn
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: WarActionPlayerEndTurn, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this WarActionPlayerEndTurn to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a WarActionPlayerSurrender. */
export declare interface IWarActionPlayerSurrender {

    /** WarActionPlayerSurrender isBoot */
    isBoot?: (boolean|null);
}

/** Represents a WarActionPlayerSurrender. */
export declare class WarActionPlayerSurrender implements IWarActionPlayerSurrender {

    /**
     * Constructs a new WarActionPlayerSurrender.
     * @param [properties] Properties to set
     */
    constructor(properties?: IWarActionPlayerSurrender);

    /** WarActionPlayerSurrender isBoot. */
    public isBoot: boolean;

    /**
     * Creates a new WarActionPlayerSurrender instance using the specified properties.
     * @param [properties] Properties to set
     * @returns WarActionPlayerSurrender instance
     */
    public static create(properties?: IWarActionPlayerSurrender): WarActionPlayerSurrender;

    /**
     * Encodes the specified WarActionPlayerSurrender message. Does not implicitly {@link WarActionPlayerSurrender.verify|verify} messages.
     * @param message WarActionPlayerSurrender message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IWarActionPlayerSurrender, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified WarActionPlayerSurrender message, length delimited. Does not implicitly {@link WarActionPlayerSurrender.verify|verify} messages.
     * @param message WarActionPlayerSurrender message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IWarActionPlayerSurrender, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a WarActionPlayerSurrender message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns WarActionPlayerSurrender
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): WarActionPlayerSurrender;

    /**
     * Decodes a WarActionPlayerSurrender message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns WarActionPlayerSurrender
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): WarActionPlayerSurrender;

    /**
     * Verifies a WarActionPlayerSurrender message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a WarActionPlayerSurrender message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns WarActionPlayerSurrender
     */
    public static fromObject(object: { [k: string]: any }): WarActionPlayerSurrender;

    /**
     * Creates a plain object from a WarActionPlayerSurrender message. Also converts values to other types if specified.
     * @param message WarActionPlayerSurrender
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: WarActionPlayerSurrender, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this WarActionPlayerSurrender to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a WarActionPlayerProduceUnit. */
export declare interface IWarActionPlayerProduceUnit {

    /** WarActionPlayerProduceUnit discoveredUnits */
    discoveredUnits?: (ISerializedWarUnit[]|null);

    /** WarActionPlayerProduceUnit discoveredTiles */
    discoveredTiles?: (ISerializedWarTile[]|null);

    /** WarActionPlayerProduceUnit gridIndex */
    gridIndex?: (IGridIndex|null);

    /** WarActionPlayerProduceUnit unitType */
    unitType?: (number|null);

    /** WarActionPlayerProduceUnit cost */
    cost?: (number|null);
}

/** Represents a WarActionPlayerProduceUnit. */
export declare class WarActionPlayerProduceUnit implements IWarActionPlayerProduceUnit {

    /**
     * Constructs a new WarActionPlayerProduceUnit.
     * @param [properties] Properties to set
     */
    constructor(properties?: IWarActionPlayerProduceUnit);

    /** WarActionPlayerProduceUnit discoveredUnits. */
    public discoveredUnits: ISerializedWarUnit[];

    /** WarActionPlayerProduceUnit discoveredTiles. */
    public discoveredTiles: ISerializedWarTile[];

    /** WarActionPlayerProduceUnit gridIndex. */
    public gridIndex?: (IGridIndex|null);

    /** WarActionPlayerProduceUnit unitType. */
    public unitType: number;

    /** WarActionPlayerProduceUnit cost. */
    public cost: number;

    /**
     * Creates a new WarActionPlayerProduceUnit instance using the specified properties.
     * @param [properties] Properties to set
     * @returns WarActionPlayerProduceUnit instance
     */
    public static create(properties?: IWarActionPlayerProduceUnit): WarActionPlayerProduceUnit;

    /**
     * Encodes the specified WarActionPlayerProduceUnit message. Does not implicitly {@link WarActionPlayerProduceUnit.verify|verify} messages.
     * @param message WarActionPlayerProduceUnit message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IWarActionPlayerProduceUnit, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified WarActionPlayerProduceUnit message, length delimited. Does not implicitly {@link WarActionPlayerProduceUnit.verify|verify} messages.
     * @param message WarActionPlayerProduceUnit message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IWarActionPlayerProduceUnit, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a WarActionPlayerProduceUnit message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns WarActionPlayerProduceUnit
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): WarActionPlayerProduceUnit;

    /**
     * Decodes a WarActionPlayerProduceUnit message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns WarActionPlayerProduceUnit
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): WarActionPlayerProduceUnit;

    /**
     * Verifies a WarActionPlayerProduceUnit message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a WarActionPlayerProduceUnit message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns WarActionPlayerProduceUnit
     */
    public static fromObject(object: { [k: string]: any }): WarActionPlayerProduceUnit;

    /**
     * Creates a plain object from a WarActionPlayerProduceUnit message. Also converts values to other types if specified.
     * @param message WarActionPlayerProduceUnit
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: WarActionPlayerProduceUnit, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this WarActionPlayerProduceUnit to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a WarActionPlayerDeleteUnit. */
export declare interface IWarActionPlayerDeleteUnit {

    /** WarActionPlayerDeleteUnit gridIndex */
    gridIndex?: (IGridIndex|null);
}

/** Represents a WarActionPlayerDeleteUnit. */
export declare class WarActionPlayerDeleteUnit implements IWarActionPlayerDeleteUnit {

    /**
     * Constructs a new WarActionPlayerDeleteUnit.
     * @param [properties] Properties to set
     */
    constructor(properties?: IWarActionPlayerDeleteUnit);

    /** WarActionPlayerDeleteUnit gridIndex. */
    public gridIndex?: (IGridIndex|null);

    /**
     * Creates a new WarActionPlayerDeleteUnit instance using the specified properties.
     * @param [properties] Properties to set
     * @returns WarActionPlayerDeleteUnit instance
     */
    public static create(properties?: IWarActionPlayerDeleteUnit): WarActionPlayerDeleteUnit;

    /**
     * Encodes the specified WarActionPlayerDeleteUnit message. Does not implicitly {@link WarActionPlayerDeleteUnit.verify|verify} messages.
     * @param message WarActionPlayerDeleteUnit message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IWarActionPlayerDeleteUnit, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified WarActionPlayerDeleteUnit message, length delimited. Does not implicitly {@link WarActionPlayerDeleteUnit.verify|verify} messages.
     * @param message WarActionPlayerDeleteUnit message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IWarActionPlayerDeleteUnit, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a WarActionPlayerDeleteUnit message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns WarActionPlayerDeleteUnit
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): WarActionPlayerDeleteUnit;

    /**
     * Decodes a WarActionPlayerDeleteUnit message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns WarActionPlayerDeleteUnit
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): WarActionPlayerDeleteUnit;

    /**
     * Verifies a WarActionPlayerDeleteUnit message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a WarActionPlayerDeleteUnit message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns WarActionPlayerDeleteUnit
     */
    public static fromObject(object: { [k: string]: any }): WarActionPlayerDeleteUnit;

    /**
     * Creates a plain object from a WarActionPlayerDeleteUnit message. Also converts values to other types if specified.
     * @param message WarActionPlayerDeleteUnit
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: WarActionPlayerDeleteUnit, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this WarActionPlayerDeleteUnit to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a WarActionPlayerVoteForDraw. */
export declare interface IWarActionPlayerVoteForDraw {

    /** WarActionPlayerVoteForDraw isAgree */
    isAgree?: (boolean|null);
}

/** Represents a WarActionPlayerVoteForDraw. */
export declare class WarActionPlayerVoteForDraw implements IWarActionPlayerVoteForDraw {

    /**
     * Constructs a new WarActionPlayerVoteForDraw.
     * @param [properties] Properties to set
     */
    constructor(properties?: IWarActionPlayerVoteForDraw);

    /** WarActionPlayerVoteForDraw isAgree. */
    public isAgree: boolean;

    /**
     * Creates a new WarActionPlayerVoteForDraw instance using the specified properties.
     * @param [properties] Properties to set
     * @returns WarActionPlayerVoteForDraw instance
     */
    public static create(properties?: IWarActionPlayerVoteForDraw): WarActionPlayerVoteForDraw;

    /**
     * Encodes the specified WarActionPlayerVoteForDraw message. Does not implicitly {@link WarActionPlayerVoteForDraw.verify|verify} messages.
     * @param message WarActionPlayerVoteForDraw message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IWarActionPlayerVoteForDraw, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified WarActionPlayerVoteForDraw message, length delimited. Does not implicitly {@link WarActionPlayerVoteForDraw.verify|verify} messages.
     * @param message WarActionPlayerVoteForDraw message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IWarActionPlayerVoteForDraw, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a WarActionPlayerVoteForDraw message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns WarActionPlayerVoteForDraw
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): WarActionPlayerVoteForDraw;

    /**
     * Decodes a WarActionPlayerVoteForDraw message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns WarActionPlayerVoteForDraw
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): WarActionPlayerVoteForDraw;

    /**
     * Verifies a WarActionPlayerVoteForDraw message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a WarActionPlayerVoteForDraw message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns WarActionPlayerVoteForDraw
     */
    public static fromObject(object: { [k: string]: any }): WarActionPlayerVoteForDraw;

    /**
     * Creates a plain object from a WarActionPlayerVoteForDraw message. Also converts values to other types if specified.
     * @param message WarActionPlayerVoteForDraw
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: WarActionPlayerVoteForDraw, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this WarActionPlayerVoteForDraw to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a WarActionUnitWait. */
export declare interface IWarActionUnitWait {

    /** WarActionUnitWait path */
    path?: (IMovePath|null);

    /** WarActionUnitWait launchUnitId */
    launchUnitId?: (number|null);

    /** WarActionUnitWait discoveredUnits */
    discoveredUnits?: (ISerializedWarUnit[]|null);

    /** WarActionUnitWait discoveredTiles */
    discoveredTiles?: (ISerializedWarTile[]|null);

    /** WarActionUnitWait actingUnits */
    actingUnits?: (ISerializedWarUnit[]|null);

    /** WarActionUnitWait actingTiles */
    actingTiles?: (ISerializedWarTile[]|null);
}

/** Represents a WarActionUnitWait. */
export declare class WarActionUnitWait implements IWarActionUnitWait {

    /**
     * Constructs a new WarActionUnitWait.
     * @param [properties] Properties to set
     */
    constructor(properties?: IWarActionUnitWait);

    /** WarActionUnitWait path. */
    public path?: (IMovePath|null);

    /** WarActionUnitWait launchUnitId. */
    public launchUnitId: number;

    /** WarActionUnitWait discoveredUnits. */
    public discoveredUnits: ISerializedWarUnit[];

    /** WarActionUnitWait discoveredTiles. */
    public discoveredTiles: ISerializedWarTile[];

    /** WarActionUnitWait actingUnits. */
    public actingUnits: ISerializedWarUnit[];

    /** WarActionUnitWait actingTiles. */
    public actingTiles: ISerializedWarTile[];

    /**
     * Creates a new WarActionUnitWait instance using the specified properties.
     * @param [properties] Properties to set
     * @returns WarActionUnitWait instance
     */
    public static create(properties?: IWarActionUnitWait): WarActionUnitWait;

    /**
     * Encodes the specified WarActionUnitWait message. Does not implicitly {@link WarActionUnitWait.verify|verify} messages.
     * @param message WarActionUnitWait message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IWarActionUnitWait, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified WarActionUnitWait message, length delimited. Does not implicitly {@link WarActionUnitWait.verify|verify} messages.
     * @param message WarActionUnitWait message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IWarActionUnitWait, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a WarActionUnitWait message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns WarActionUnitWait
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): WarActionUnitWait;

    /**
     * Decodes a WarActionUnitWait message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns WarActionUnitWait
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): WarActionUnitWait;

    /**
     * Verifies a WarActionUnitWait message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a WarActionUnitWait message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns WarActionUnitWait
     */
    public static fromObject(object: { [k: string]: any }): WarActionUnitWait;

    /**
     * Creates a plain object from a WarActionUnitWait message. Also converts values to other types if specified.
     * @param message WarActionUnitWait
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: WarActionUnitWait, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this WarActionUnitWait to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a WarActionUnitBeLoaded. */
export declare interface IWarActionUnitBeLoaded {

    /** WarActionUnitBeLoaded path */
    path?: (IMovePath|null);

    /** WarActionUnitBeLoaded launchUnitId */
    launchUnitId?: (number|null);

    /** WarActionUnitBeLoaded discoveredUnits */
    discoveredUnits?: (ISerializedWarUnit[]|null);

    /** WarActionUnitBeLoaded discoveredTiles */
    discoveredTiles?: (ISerializedWarTile[]|null);

    /** WarActionUnitBeLoaded actingUnits */
    actingUnits?: (ISerializedWarUnit[]|null);

    /** WarActionUnitBeLoaded actingTiles */
    actingTiles?: (ISerializedWarTile[]|null);
}

/** Represents a WarActionUnitBeLoaded. */
export declare class WarActionUnitBeLoaded implements IWarActionUnitBeLoaded {

    /**
     * Constructs a new WarActionUnitBeLoaded.
     * @param [properties] Properties to set
     */
    constructor(properties?: IWarActionUnitBeLoaded);

    /** WarActionUnitBeLoaded path. */
    public path?: (IMovePath|null);

    /** WarActionUnitBeLoaded launchUnitId. */
    public launchUnitId: number;

    /** WarActionUnitBeLoaded discoveredUnits. */
    public discoveredUnits: ISerializedWarUnit[];

    /** WarActionUnitBeLoaded discoveredTiles. */
    public discoveredTiles: ISerializedWarTile[];

    /** WarActionUnitBeLoaded actingUnits. */
    public actingUnits: ISerializedWarUnit[];

    /** WarActionUnitBeLoaded actingTiles. */
    public actingTiles: ISerializedWarTile[];

    /**
     * Creates a new WarActionUnitBeLoaded instance using the specified properties.
     * @param [properties] Properties to set
     * @returns WarActionUnitBeLoaded instance
     */
    public static create(properties?: IWarActionUnitBeLoaded): WarActionUnitBeLoaded;

    /**
     * Encodes the specified WarActionUnitBeLoaded message. Does not implicitly {@link WarActionUnitBeLoaded.verify|verify} messages.
     * @param message WarActionUnitBeLoaded message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IWarActionUnitBeLoaded, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified WarActionUnitBeLoaded message, length delimited. Does not implicitly {@link WarActionUnitBeLoaded.verify|verify} messages.
     * @param message WarActionUnitBeLoaded message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IWarActionUnitBeLoaded, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a WarActionUnitBeLoaded message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns WarActionUnitBeLoaded
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): WarActionUnitBeLoaded;

    /**
     * Decodes a WarActionUnitBeLoaded message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns WarActionUnitBeLoaded
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): WarActionUnitBeLoaded;

    /**
     * Verifies a WarActionUnitBeLoaded message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a WarActionUnitBeLoaded message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns WarActionUnitBeLoaded
     */
    public static fromObject(object: { [k: string]: any }): WarActionUnitBeLoaded;

    /**
     * Creates a plain object from a WarActionUnitBeLoaded message. Also converts values to other types if specified.
     * @param message WarActionUnitBeLoaded
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: WarActionUnitBeLoaded, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this WarActionUnitBeLoaded to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a WarActionUnitCaptureTile. */
export declare interface IWarActionUnitCaptureTile {

    /** WarActionUnitCaptureTile path */
    path?: (IMovePath|null);

    /** WarActionUnitCaptureTile launchUnitId */
    launchUnitId?: (number|null);

    /** WarActionUnitCaptureTile discoveredUnits */
    discoveredUnits?: (ISerializedWarUnit[]|null);

    /** WarActionUnitCaptureTile discoveredTiles */
    discoveredTiles?: (ISerializedWarTile[]|null);

    /** WarActionUnitCaptureTile actingUnits */
    actingUnits?: (ISerializedWarUnit[]|null);

    /** WarActionUnitCaptureTile actingTiles */
    actingTiles?: (ISerializedWarTile[]|null);
}

/** Represents a WarActionUnitCaptureTile. */
export declare class WarActionUnitCaptureTile implements IWarActionUnitCaptureTile {

    /**
     * Constructs a new WarActionUnitCaptureTile.
     * @param [properties] Properties to set
     */
    constructor(properties?: IWarActionUnitCaptureTile);

    /** WarActionUnitCaptureTile path. */
    public path?: (IMovePath|null);

    /** WarActionUnitCaptureTile launchUnitId. */
    public launchUnitId: number;

    /** WarActionUnitCaptureTile discoveredUnits. */
    public discoveredUnits: ISerializedWarUnit[];

    /** WarActionUnitCaptureTile discoveredTiles. */
    public discoveredTiles: ISerializedWarTile[];

    /** WarActionUnitCaptureTile actingUnits. */
    public actingUnits: ISerializedWarUnit[];

    /** WarActionUnitCaptureTile actingTiles. */
    public actingTiles: ISerializedWarTile[];

    /**
     * Creates a new WarActionUnitCaptureTile instance using the specified properties.
     * @param [properties] Properties to set
     * @returns WarActionUnitCaptureTile instance
     */
    public static create(properties?: IWarActionUnitCaptureTile): WarActionUnitCaptureTile;

    /**
     * Encodes the specified WarActionUnitCaptureTile message. Does not implicitly {@link WarActionUnitCaptureTile.verify|verify} messages.
     * @param message WarActionUnitCaptureTile message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IWarActionUnitCaptureTile, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified WarActionUnitCaptureTile message, length delimited. Does not implicitly {@link WarActionUnitCaptureTile.verify|verify} messages.
     * @param message WarActionUnitCaptureTile message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IWarActionUnitCaptureTile, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a WarActionUnitCaptureTile message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns WarActionUnitCaptureTile
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): WarActionUnitCaptureTile;

    /**
     * Decodes a WarActionUnitCaptureTile message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns WarActionUnitCaptureTile
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): WarActionUnitCaptureTile;

    /**
     * Verifies a WarActionUnitCaptureTile message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a WarActionUnitCaptureTile message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns WarActionUnitCaptureTile
     */
    public static fromObject(object: { [k: string]: any }): WarActionUnitCaptureTile;

    /**
     * Creates a plain object from a WarActionUnitCaptureTile message. Also converts values to other types if specified.
     * @param message WarActionUnitCaptureTile
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: WarActionUnitCaptureTile, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this WarActionUnitCaptureTile to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a WarActionUnitAttack. */
export declare interface IWarActionUnitAttack {

    /** WarActionUnitAttack path */
    path?: (IMovePath|null);

    /** WarActionUnitAttack launchUnitId */
    launchUnitId?: (number|null);

    /** WarActionUnitAttack discoveredUnits */
    discoveredUnits?: (ISerializedWarUnit[]|null);

    /** WarActionUnitAttack discoveredTiles */
    discoveredTiles?: (ISerializedWarTile[]|null);

    /** WarActionUnitAttack actingUnits */
    actingUnits?: (ISerializedWarUnit[]|null);

    /** WarActionUnitAttack actingTiles */
    actingTiles?: (ISerializedWarTile[]|null);

    /** WarActionUnitAttack targetGridIndex */
    targetGridIndex?: (IGridIndex|null);

    /** WarActionUnitAttack attackDamage */
    attackDamage?: (number|null);

    /** WarActionUnitAttack counterDamage */
    counterDamage?: (number|null);

    /** WarActionUnitAttack lostPlayerIndex */
    lostPlayerIndex?: (number|null);
}

/** Represents a WarActionUnitAttack. */
export declare class WarActionUnitAttack implements IWarActionUnitAttack {

    /**
     * Constructs a new WarActionUnitAttack.
     * @param [properties] Properties to set
     */
    constructor(properties?: IWarActionUnitAttack);

    /** WarActionUnitAttack path. */
    public path?: (IMovePath|null);

    /** WarActionUnitAttack launchUnitId. */
    public launchUnitId: number;

    /** WarActionUnitAttack discoveredUnits. */
    public discoveredUnits: ISerializedWarUnit[];

    /** WarActionUnitAttack discoveredTiles. */
    public discoveredTiles: ISerializedWarTile[];

    /** WarActionUnitAttack actingUnits. */
    public actingUnits: ISerializedWarUnit[];

    /** WarActionUnitAttack actingTiles. */
    public actingTiles: ISerializedWarTile[];

    /** WarActionUnitAttack targetGridIndex. */
    public targetGridIndex?: (IGridIndex|null);

    /** WarActionUnitAttack attackDamage. */
    public attackDamage: number;

    /** WarActionUnitAttack counterDamage. */
    public counterDamage: number;

    /** WarActionUnitAttack lostPlayerIndex. */
    public lostPlayerIndex: number;

    /**
     * Creates a new WarActionUnitAttack instance using the specified properties.
     * @param [properties] Properties to set
     * @returns WarActionUnitAttack instance
     */
    public static create(properties?: IWarActionUnitAttack): WarActionUnitAttack;

    /**
     * Encodes the specified WarActionUnitAttack message. Does not implicitly {@link WarActionUnitAttack.verify|verify} messages.
     * @param message WarActionUnitAttack message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IWarActionUnitAttack, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified WarActionUnitAttack message, length delimited. Does not implicitly {@link WarActionUnitAttack.verify|verify} messages.
     * @param message WarActionUnitAttack message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IWarActionUnitAttack, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a WarActionUnitAttack message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns WarActionUnitAttack
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): WarActionUnitAttack;

    /**
     * Decodes a WarActionUnitAttack message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns WarActionUnitAttack
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): WarActionUnitAttack;

    /**
     * Verifies a WarActionUnitAttack message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a WarActionUnitAttack message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns WarActionUnitAttack
     */
    public static fromObject(object: { [k: string]: any }): WarActionUnitAttack;

    /**
     * Creates a plain object from a WarActionUnitAttack message. Also converts values to other types if specified.
     * @param message WarActionUnitAttack
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: WarActionUnitAttack, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this WarActionUnitAttack to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a WarActionUnitDrop. */
export declare interface IWarActionUnitDrop {

    /** WarActionUnitDrop path */
    path?: (IMovePath|null);

    /** WarActionUnitDrop launchUnitId */
    launchUnitId?: (number|null);

    /** WarActionUnitDrop discoveredUnits */
    discoveredUnits?: (ISerializedWarUnit[]|null);

    /** WarActionUnitDrop discoveredTiles */
    discoveredTiles?: (ISerializedWarTile[]|null);

    /** WarActionUnitDrop actingUnits */
    actingUnits?: (ISerializedWarUnit[]|null);

    /** WarActionUnitDrop actingTiles */
    actingTiles?: (ISerializedWarTile[]|null);

    /** WarActionUnitDrop dropDestinations */
    dropDestinations?: (IDropDestination[]|null);

    /** WarActionUnitDrop isDropBlocked */
    isDropBlocked?: (boolean|null);
}

/** Represents a WarActionUnitDrop. */
export declare class WarActionUnitDrop implements IWarActionUnitDrop {

    /**
     * Constructs a new WarActionUnitDrop.
     * @param [properties] Properties to set
     */
    constructor(properties?: IWarActionUnitDrop);

    /** WarActionUnitDrop path. */
    public path?: (IMovePath|null);

    /** WarActionUnitDrop launchUnitId. */
    public launchUnitId: number;

    /** WarActionUnitDrop discoveredUnits. */
    public discoveredUnits: ISerializedWarUnit[];

    /** WarActionUnitDrop discoveredTiles. */
    public discoveredTiles: ISerializedWarTile[];

    /** WarActionUnitDrop actingUnits. */
    public actingUnits: ISerializedWarUnit[];

    /** WarActionUnitDrop actingTiles. */
    public actingTiles: ISerializedWarTile[];

    /** WarActionUnitDrop dropDestinations. */
    public dropDestinations: IDropDestination[];

    /** WarActionUnitDrop isDropBlocked. */
    public isDropBlocked: boolean;

    /**
     * Creates a new WarActionUnitDrop instance using the specified properties.
     * @param [properties] Properties to set
     * @returns WarActionUnitDrop instance
     */
    public static create(properties?: IWarActionUnitDrop): WarActionUnitDrop;

    /**
     * Encodes the specified WarActionUnitDrop message. Does not implicitly {@link WarActionUnitDrop.verify|verify} messages.
     * @param message WarActionUnitDrop message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IWarActionUnitDrop, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified WarActionUnitDrop message, length delimited. Does not implicitly {@link WarActionUnitDrop.verify|verify} messages.
     * @param message WarActionUnitDrop message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IWarActionUnitDrop, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a WarActionUnitDrop message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns WarActionUnitDrop
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): WarActionUnitDrop;

    /**
     * Decodes a WarActionUnitDrop message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns WarActionUnitDrop
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): WarActionUnitDrop;

    /**
     * Verifies a WarActionUnitDrop message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a WarActionUnitDrop message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns WarActionUnitDrop
     */
    public static fromObject(object: { [k: string]: any }): WarActionUnitDrop;

    /**
     * Creates a plain object from a WarActionUnitDrop message. Also converts values to other types if specified.
     * @param message WarActionUnitDrop
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: WarActionUnitDrop, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this WarActionUnitDrop to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a WarActionUnitBuildTile. */
export declare interface IWarActionUnitBuildTile {

    /** WarActionUnitBuildTile path */
    path?: (IMovePath|null);

    /** WarActionUnitBuildTile launchUnitId */
    launchUnitId?: (number|null);

    /** WarActionUnitBuildTile discoveredUnits */
    discoveredUnits?: (ISerializedWarUnit[]|null);

    /** WarActionUnitBuildTile discoveredTiles */
    discoveredTiles?: (ISerializedWarTile[]|null);

    /** WarActionUnitBuildTile actingUnits */
    actingUnits?: (ISerializedWarUnit[]|null);

    /** WarActionUnitBuildTile actingTiles */
    actingTiles?: (ISerializedWarTile[]|null);
}

/** Represents a WarActionUnitBuildTile. */
export declare class WarActionUnitBuildTile implements IWarActionUnitBuildTile {

    /**
     * Constructs a new WarActionUnitBuildTile.
     * @param [properties] Properties to set
     */
    constructor(properties?: IWarActionUnitBuildTile);

    /** WarActionUnitBuildTile path. */
    public path?: (IMovePath|null);

    /** WarActionUnitBuildTile launchUnitId. */
    public launchUnitId: number;

    /** WarActionUnitBuildTile discoveredUnits. */
    public discoveredUnits: ISerializedWarUnit[];

    /** WarActionUnitBuildTile discoveredTiles. */
    public discoveredTiles: ISerializedWarTile[];

    /** WarActionUnitBuildTile actingUnits. */
    public actingUnits: ISerializedWarUnit[];

    /** WarActionUnitBuildTile actingTiles. */
    public actingTiles: ISerializedWarTile[];

    /**
     * Creates a new WarActionUnitBuildTile instance using the specified properties.
     * @param [properties] Properties to set
     * @returns WarActionUnitBuildTile instance
     */
    public static create(properties?: IWarActionUnitBuildTile): WarActionUnitBuildTile;

    /**
     * Encodes the specified WarActionUnitBuildTile message. Does not implicitly {@link WarActionUnitBuildTile.verify|verify} messages.
     * @param message WarActionUnitBuildTile message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IWarActionUnitBuildTile, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified WarActionUnitBuildTile message, length delimited. Does not implicitly {@link WarActionUnitBuildTile.verify|verify} messages.
     * @param message WarActionUnitBuildTile message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IWarActionUnitBuildTile, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a WarActionUnitBuildTile message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns WarActionUnitBuildTile
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): WarActionUnitBuildTile;

    /**
     * Decodes a WarActionUnitBuildTile message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns WarActionUnitBuildTile
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): WarActionUnitBuildTile;

    /**
     * Verifies a WarActionUnitBuildTile message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a WarActionUnitBuildTile message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns WarActionUnitBuildTile
     */
    public static fromObject(object: { [k: string]: any }): WarActionUnitBuildTile;

    /**
     * Creates a plain object from a WarActionUnitBuildTile message. Also converts values to other types if specified.
     * @param message WarActionUnitBuildTile
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: WarActionUnitBuildTile, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this WarActionUnitBuildTile to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a WarActionUnitDive. */
export declare interface IWarActionUnitDive {

    /** WarActionUnitDive path */
    path?: (IMovePath|null);

    /** WarActionUnitDive launchUnitId */
    launchUnitId?: (number|null);

    /** WarActionUnitDive discoveredUnits */
    discoveredUnits?: (ISerializedWarUnit[]|null);

    /** WarActionUnitDive discoveredTiles */
    discoveredTiles?: (ISerializedWarTile[]|null);

    /** WarActionUnitDive actingUnits */
    actingUnits?: (ISerializedWarUnit[]|null);

    /** WarActionUnitDive actingTiles */
    actingTiles?: (ISerializedWarTile[]|null);
}

/** Represents a WarActionUnitDive. */
export declare class WarActionUnitDive implements IWarActionUnitDive {

    /**
     * Constructs a new WarActionUnitDive.
     * @param [properties] Properties to set
     */
    constructor(properties?: IWarActionUnitDive);

    /** WarActionUnitDive path. */
    public path?: (IMovePath|null);

    /** WarActionUnitDive launchUnitId. */
    public launchUnitId: number;

    /** WarActionUnitDive discoveredUnits. */
    public discoveredUnits: ISerializedWarUnit[];

    /** WarActionUnitDive discoveredTiles. */
    public discoveredTiles: ISerializedWarTile[];

    /** WarActionUnitDive actingUnits. */
    public actingUnits: ISerializedWarUnit[];

    /** WarActionUnitDive actingTiles. */
    public actingTiles: ISerializedWarTile[];

    /**
     * Creates a new WarActionUnitDive instance using the specified properties.
     * @param [properties] Properties to set
     * @returns WarActionUnitDive instance
     */
    public static create(properties?: IWarActionUnitDive): WarActionUnitDive;

    /**
     * Encodes the specified WarActionUnitDive message. Does not implicitly {@link WarActionUnitDive.verify|verify} messages.
     * @param message WarActionUnitDive message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IWarActionUnitDive, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified WarActionUnitDive message, length delimited. Does not implicitly {@link WarActionUnitDive.verify|verify} messages.
     * @param message WarActionUnitDive message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IWarActionUnitDive, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a WarActionUnitDive message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns WarActionUnitDive
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): WarActionUnitDive;

    /**
     * Decodes a WarActionUnitDive message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns WarActionUnitDive
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): WarActionUnitDive;

    /**
     * Verifies a WarActionUnitDive message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a WarActionUnitDive message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns WarActionUnitDive
     */
    public static fromObject(object: { [k: string]: any }): WarActionUnitDive;

    /**
     * Creates a plain object from a WarActionUnitDive message. Also converts values to other types if specified.
     * @param message WarActionUnitDive
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: WarActionUnitDive, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this WarActionUnitDive to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a WarActionUnitSurface. */
export declare interface IWarActionUnitSurface {

    /** WarActionUnitSurface path */
    path?: (IMovePath|null);

    /** WarActionUnitSurface launchUnitId */
    launchUnitId?: (number|null);

    /** WarActionUnitSurface discoveredUnits */
    discoveredUnits?: (ISerializedWarUnit[]|null);

    /** WarActionUnitSurface discoveredTiles */
    discoveredTiles?: (ISerializedWarTile[]|null);

    /** WarActionUnitSurface actingUnits */
    actingUnits?: (ISerializedWarUnit[]|null);

    /** WarActionUnitSurface actingTiles */
    actingTiles?: (ISerializedWarTile[]|null);
}

/** Represents a WarActionUnitSurface. */
export declare class WarActionUnitSurface implements IWarActionUnitSurface {

    /**
     * Constructs a new WarActionUnitSurface.
     * @param [properties] Properties to set
     */
    constructor(properties?: IWarActionUnitSurface);

    /** WarActionUnitSurface path. */
    public path?: (IMovePath|null);

    /** WarActionUnitSurface launchUnitId. */
    public launchUnitId: number;

    /** WarActionUnitSurface discoveredUnits. */
    public discoveredUnits: ISerializedWarUnit[];

    /** WarActionUnitSurface discoveredTiles. */
    public discoveredTiles: ISerializedWarTile[];

    /** WarActionUnitSurface actingUnits. */
    public actingUnits: ISerializedWarUnit[];

    /** WarActionUnitSurface actingTiles. */
    public actingTiles: ISerializedWarTile[];

    /**
     * Creates a new WarActionUnitSurface instance using the specified properties.
     * @param [properties] Properties to set
     * @returns WarActionUnitSurface instance
     */
    public static create(properties?: IWarActionUnitSurface): WarActionUnitSurface;

    /**
     * Encodes the specified WarActionUnitSurface message. Does not implicitly {@link WarActionUnitSurface.verify|verify} messages.
     * @param message WarActionUnitSurface message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IWarActionUnitSurface, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified WarActionUnitSurface message, length delimited. Does not implicitly {@link WarActionUnitSurface.verify|verify} messages.
     * @param message WarActionUnitSurface message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IWarActionUnitSurface, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a WarActionUnitSurface message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns WarActionUnitSurface
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): WarActionUnitSurface;

    /**
     * Decodes a WarActionUnitSurface message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns WarActionUnitSurface
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): WarActionUnitSurface;

    /**
     * Verifies a WarActionUnitSurface message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a WarActionUnitSurface message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns WarActionUnitSurface
     */
    public static fromObject(object: { [k: string]: any }): WarActionUnitSurface;

    /**
     * Creates a plain object from a WarActionUnitSurface message. Also converts values to other types if specified.
     * @param message WarActionUnitSurface
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: WarActionUnitSurface, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this WarActionUnitSurface to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a WarActionUnitJoin. */
export declare interface IWarActionUnitJoin {

    /** WarActionUnitJoin path */
    path?: (IMovePath|null);

    /** WarActionUnitJoin launchUnitId */
    launchUnitId?: (number|null);

    /** WarActionUnitJoin discoveredUnits */
    discoveredUnits?: (ISerializedWarUnit[]|null);

    /** WarActionUnitJoin discoveredTiles */
    discoveredTiles?: (ISerializedWarTile[]|null);

    /** WarActionUnitJoin actingUnits */
    actingUnits?: (ISerializedWarUnit[]|null);

    /** WarActionUnitJoin actingTiles */
    actingTiles?: (ISerializedWarTile[]|null);
}

/** Represents a WarActionUnitJoin. */
export declare class WarActionUnitJoin implements IWarActionUnitJoin {

    /**
     * Constructs a new WarActionUnitJoin.
     * @param [properties] Properties to set
     */
    constructor(properties?: IWarActionUnitJoin);

    /** WarActionUnitJoin path. */
    public path?: (IMovePath|null);

    /** WarActionUnitJoin launchUnitId. */
    public launchUnitId: number;

    /** WarActionUnitJoin discoveredUnits. */
    public discoveredUnits: ISerializedWarUnit[];

    /** WarActionUnitJoin discoveredTiles. */
    public discoveredTiles: ISerializedWarTile[];

    /** WarActionUnitJoin actingUnits. */
    public actingUnits: ISerializedWarUnit[];

    /** WarActionUnitJoin actingTiles. */
    public actingTiles: ISerializedWarTile[];

    /**
     * Creates a new WarActionUnitJoin instance using the specified properties.
     * @param [properties] Properties to set
     * @returns WarActionUnitJoin instance
     */
    public static create(properties?: IWarActionUnitJoin): WarActionUnitJoin;

    /**
     * Encodes the specified WarActionUnitJoin message. Does not implicitly {@link WarActionUnitJoin.verify|verify} messages.
     * @param message WarActionUnitJoin message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IWarActionUnitJoin, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified WarActionUnitJoin message, length delimited. Does not implicitly {@link WarActionUnitJoin.verify|verify} messages.
     * @param message WarActionUnitJoin message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IWarActionUnitJoin, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a WarActionUnitJoin message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns WarActionUnitJoin
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): WarActionUnitJoin;

    /**
     * Decodes a WarActionUnitJoin message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns WarActionUnitJoin
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): WarActionUnitJoin;

    /**
     * Verifies a WarActionUnitJoin message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a WarActionUnitJoin message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns WarActionUnitJoin
     */
    public static fromObject(object: { [k: string]: any }): WarActionUnitJoin;

    /**
     * Creates a plain object from a WarActionUnitJoin message. Also converts values to other types if specified.
     * @param message WarActionUnitJoin
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: WarActionUnitJoin, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this WarActionUnitJoin to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a WarActionUnitLaunchFlare. */
export declare interface IWarActionUnitLaunchFlare {

    /** WarActionUnitLaunchFlare path */
    path?: (IMovePath|null);

    /** WarActionUnitLaunchFlare launchUnitId */
    launchUnitId?: (number|null);

    /** WarActionUnitLaunchFlare discoveredUnits */
    discoveredUnits?: (ISerializedWarUnit[]|null);

    /** WarActionUnitLaunchFlare discoveredTiles */
    discoveredTiles?: (ISerializedWarTile[]|null);

    /** WarActionUnitLaunchFlare actingUnits */
    actingUnits?: (ISerializedWarUnit[]|null);

    /** WarActionUnitLaunchFlare actingTiles */
    actingTiles?: (ISerializedWarTile[]|null);

    /** WarActionUnitLaunchFlare targetGridIndex */
    targetGridIndex?: (IGridIndex|null);
}

/** Represents a WarActionUnitLaunchFlare. */
export declare class WarActionUnitLaunchFlare implements IWarActionUnitLaunchFlare {

    /**
     * Constructs a new WarActionUnitLaunchFlare.
     * @param [properties] Properties to set
     */
    constructor(properties?: IWarActionUnitLaunchFlare);

    /** WarActionUnitLaunchFlare path. */
    public path?: (IMovePath|null);

    /** WarActionUnitLaunchFlare launchUnitId. */
    public launchUnitId: number;

    /** WarActionUnitLaunchFlare discoveredUnits. */
    public discoveredUnits: ISerializedWarUnit[];

    /** WarActionUnitLaunchFlare discoveredTiles. */
    public discoveredTiles: ISerializedWarTile[];

    /** WarActionUnitLaunchFlare actingUnits. */
    public actingUnits: ISerializedWarUnit[];

    /** WarActionUnitLaunchFlare actingTiles. */
    public actingTiles: ISerializedWarTile[];

    /** WarActionUnitLaunchFlare targetGridIndex. */
    public targetGridIndex?: (IGridIndex|null);

    /**
     * Creates a new WarActionUnitLaunchFlare instance using the specified properties.
     * @param [properties] Properties to set
     * @returns WarActionUnitLaunchFlare instance
     */
    public static create(properties?: IWarActionUnitLaunchFlare): WarActionUnitLaunchFlare;

    /**
     * Encodes the specified WarActionUnitLaunchFlare message. Does not implicitly {@link WarActionUnitLaunchFlare.verify|verify} messages.
     * @param message WarActionUnitLaunchFlare message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IWarActionUnitLaunchFlare, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified WarActionUnitLaunchFlare message, length delimited. Does not implicitly {@link WarActionUnitLaunchFlare.verify|verify} messages.
     * @param message WarActionUnitLaunchFlare message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IWarActionUnitLaunchFlare, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a WarActionUnitLaunchFlare message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns WarActionUnitLaunchFlare
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): WarActionUnitLaunchFlare;

    /**
     * Decodes a WarActionUnitLaunchFlare message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns WarActionUnitLaunchFlare
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): WarActionUnitLaunchFlare;

    /**
     * Verifies a WarActionUnitLaunchFlare message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a WarActionUnitLaunchFlare message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns WarActionUnitLaunchFlare
     */
    public static fromObject(object: { [k: string]: any }): WarActionUnitLaunchFlare;

    /**
     * Creates a plain object from a WarActionUnitLaunchFlare message. Also converts values to other types if specified.
     * @param message WarActionUnitLaunchFlare
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: WarActionUnitLaunchFlare, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this WarActionUnitLaunchFlare to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a WarActionUnitLaunchSilo. */
export declare interface IWarActionUnitLaunchSilo {

    /** WarActionUnitLaunchSilo path */
    path?: (IMovePath|null);

    /** WarActionUnitLaunchSilo launchUnitId */
    launchUnitId?: (number|null);

    /** WarActionUnitLaunchSilo discoveredUnits */
    discoveredUnits?: (ISerializedWarUnit[]|null);

    /** WarActionUnitLaunchSilo discoveredTiles */
    discoveredTiles?: (ISerializedWarTile[]|null);

    /** WarActionUnitLaunchSilo actingUnits */
    actingUnits?: (ISerializedWarUnit[]|null);

    /** WarActionUnitLaunchSilo actingTiles */
    actingTiles?: (ISerializedWarTile[]|null);

    /** WarActionUnitLaunchSilo targetGridIndex */
    targetGridIndex?: (IGridIndex|null);
}

/** Represents a WarActionUnitLaunchSilo. */
export declare class WarActionUnitLaunchSilo implements IWarActionUnitLaunchSilo {

    /**
     * Constructs a new WarActionUnitLaunchSilo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IWarActionUnitLaunchSilo);

    /** WarActionUnitLaunchSilo path. */
    public path?: (IMovePath|null);

    /** WarActionUnitLaunchSilo launchUnitId. */
    public launchUnitId: number;

    /** WarActionUnitLaunchSilo discoveredUnits. */
    public discoveredUnits: ISerializedWarUnit[];

    /** WarActionUnitLaunchSilo discoveredTiles. */
    public discoveredTiles: ISerializedWarTile[];

    /** WarActionUnitLaunchSilo actingUnits. */
    public actingUnits: ISerializedWarUnit[];

    /** WarActionUnitLaunchSilo actingTiles. */
    public actingTiles: ISerializedWarTile[];

    /** WarActionUnitLaunchSilo targetGridIndex. */
    public targetGridIndex?: (IGridIndex|null);

    /**
     * Creates a new WarActionUnitLaunchSilo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns WarActionUnitLaunchSilo instance
     */
    public static create(properties?: IWarActionUnitLaunchSilo): WarActionUnitLaunchSilo;

    /**
     * Encodes the specified WarActionUnitLaunchSilo message. Does not implicitly {@link WarActionUnitLaunchSilo.verify|verify} messages.
     * @param message WarActionUnitLaunchSilo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IWarActionUnitLaunchSilo, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified WarActionUnitLaunchSilo message, length delimited. Does not implicitly {@link WarActionUnitLaunchSilo.verify|verify} messages.
     * @param message WarActionUnitLaunchSilo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IWarActionUnitLaunchSilo, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a WarActionUnitLaunchSilo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns WarActionUnitLaunchSilo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): WarActionUnitLaunchSilo;

    /**
     * Decodes a WarActionUnitLaunchSilo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns WarActionUnitLaunchSilo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): WarActionUnitLaunchSilo;

    /**
     * Verifies a WarActionUnitLaunchSilo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a WarActionUnitLaunchSilo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns WarActionUnitLaunchSilo
     */
    public static fromObject(object: { [k: string]: any }): WarActionUnitLaunchSilo;

    /**
     * Creates a plain object from a WarActionUnitLaunchSilo message. Also converts values to other types if specified.
     * @param message WarActionUnitLaunchSilo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: WarActionUnitLaunchSilo, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this WarActionUnitLaunchSilo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a WarActionUnitProduceUnit. */
export declare interface IWarActionUnitProduceUnit {

    /** WarActionUnitProduceUnit path */
    path?: (IMovePath|null);

    /** WarActionUnitProduceUnit launchUnitId */
    launchUnitId?: (number|null);

    /** WarActionUnitProduceUnit discoveredUnits */
    discoveredUnits?: (ISerializedWarUnit[]|null);

    /** WarActionUnitProduceUnit discoveredTiles */
    discoveredTiles?: (ISerializedWarTile[]|null);

    /** WarActionUnitProduceUnit actingUnits */
    actingUnits?: (ISerializedWarUnit[]|null);

    /** WarActionUnitProduceUnit actingTiles */
    actingTiles?: (ISerializedWarTile[]|null);

    /** WarActionUnitProduceUnit cost */
    cost?: (number|null);
}

/** Represents a WarActionUnitProduceUnit. */
export declare class WarActionUnitProduceUnit implements IWarActionUnitProduceUnit {

    /**
     * Constructs a new WarActionUnitProduceUnit.
     * @param [properties] Properties to set
     */
    constructor(properties?: IWarActionUnitProduceUnit);

    /** WarActionUnitProduceUnit path. */
    public path?: (IMovePath|null);

    /** WarActionUnitProduceUnit launchUnitId. */
    public launchUnitId: number;

    /** WarActionUnitProduceUnit discoveredUnits. */
    public discoveredUnits: ISerializedWarUnit[];

    /** WarActionUnitProduceUnit discoveredTiles. */
    public discoveredTiles: ISerializedWarTile[];

    /** WarActionUnitProduceUnit actingUnits. */
    public actingUnits: ISerializedWarUnit[];

    /** WarActionUnitProduceUnit actingTiles. */
    public actingTiles: ISerializedWarTile[];

    /** WarActionUnitProduceUnit cost. */
    public cost: number;

    /**
     * Creates a new WarActionUnitProduceUnit instance using the specified properties.
     * @param [properties] Properties to set
     * @returns WarActionUnitProduceUnit instance
     */
    public static create(properties?: IWarActionUnitProduceUnit): WarActionUnitProduceUnit;

    /**
     * Encodes the specified WarActionUnitProduceUnit message. Does not implicitly {@link WarActionUnitProduceUnit.verify|verify} messages.
     * @param message WarActionUnitProduceUnit message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IWarActionUnitProduceUnit, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified WarActionUnitProduceUnit message, length delimited. Does not implicitly {@link WarActionUnitProduceUnit.verify|verify} messages.
     * @param message WarActionUnitProduceUnit message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IWarActionUnitProduceUnit, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a WarActionUnitProduceUnit message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns WarActionUnitProduceUnit
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): WarActionUnitProduceUnit;

    /**
     * Decodes a WarActionUnitProduceUnit message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns WarActionUnitProduceUnit
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): WarActionUnitProduceUnit;

    /**
     * Verifies a WarActionUnitProduceUnit message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a WarActionUnitProduceUnit message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns WarActionUnitProduceUnit
     */
    public static fromObject(object: { [k: string]: any }): WarActionUnitProduceUnit;

    /**
     * Creates a plain object from a WarActionUnitProduceUnit message. Also converts values to other types if specified.
     * @param message WarActionUnitProduceUnit
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: WarActionUnitProduceUnit, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this WarActionUnitProduceUnit to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a WarActionUnitSupply. */
export declare interface IWarActionUnitSupply {

    /** WarActionUnitSupply path */
    path?: (IMovePath|null);

    /** WarActionUnitSupply launchUnitId */
    launchUnitId?: (number|null);

    /** WarActionUnitSupply discoveredUnits */
    discoveredUnits?: (ISerializedWarUnit[]|null);

    /** WarActionUnitSupply discoveredTiles */
    discoveredTiles?: (ISerializedWarTile[]|null);

    /** WarActionUnitSupply actingUnits */
    actingUnits?: (ISerializedWarUnit[]|null);

    /** WarActionUnitSupply actingTiles */
    actingTiles?: (ISerializedWarTile[]|null);
}

/** Represents a WarActionUnitSupply. */
export declare class WarActionUnitSupply implements IWarActionUnitSupply {

    /**
     * Constructs a new WarActionUnitSupply.
     * @param [properties] Properties to set
     */
    constructor(properties?: IWarActionUnitSupply);

    /** WarActionUnitSupply path. */
    public path?: (IMovePath|null);

    /** WarActionUnitSupply launchUnitId. */
    public launchUnitId: number;

    /** WarActionUnitSupply discoveredUnits. */
    public discoveredUnits: ISerializedWarUnit[];

    /** WarActionUnitSupply discoveredTiles. */
    public discoveredTiles: ISerializedWarTile[];

    /** WarActionUnitSupply actingUnits. */
    public actingUnits: ISerializedWarUnit[];

    /** WarActionUnitSupply actingTiles. */
    public actingTiles: ISerializedWarTile[];

    /**
     * Creates a new WarActionUnitSupply instance using the specified properties.
     * @param [properties] Properties to set
     * @returns WarActionUnitSupply instance
     */
    public static create(properties?: IWarActionUnitSupply): WarActionUnitSupply;

    /**
     * Encodes the specified WarActionUnitSupply message. Does not implicitly {@link WarActionUnitSupply.verify|verify} messages.
     * @param message WarActionUnitSupply message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IWarActionUnitSupply, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified WarActionUnitSupply message, length delimited. Does not implicitly {@link WarActionUnitSupply.verify|verify} messages.
     * @param message WarActionUnitSupply message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IWarActionUnitSupply, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a WarActionUnitSupply message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns WarActionUnitSupply
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): WarActionUnitSupply;

    /**
     * Decodes a WarActionUnitSupply message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns WarActionUnitSupply
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): WarActionUnitSupply;

    /**
     * Verifies a WarActionUnitSupply message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a WarActionUnitSupply message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns WarActionUnitSupply
     */
    public static fromObject(object: { [k: string]: any }): WarActionUnitSupply;

    /**
     * Creates a plain object from a WarActionUnitSupply message. Also converts values to other types if specified.
     * @param message WarActionUnitSupply
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: WarActionUnitSupply, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this WarActionUnitSupply to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a WarActionUnitLoadCo. */
export declare interface IWarActionUnitLoadCo {

    /** WarActionUnitLoadCo path */
    path?: (IMovePath|null);

    /** WarActionUnitLoadCo launchUnitId */
    launchUnitId?: (number|null);

    /** WarActionUnitLoadCo discoveredUnits */
    discoveredUnits?: (ISerializedWarUnit[]|null);

    /** WarActionUnitLoadCo discoveredTiles */
    discoveredTiles?: (ISerializedWarTile[]|null);

    /** WarActionUnitLoadCo actingUnits */
    actingUnits?: (ISerializedWarUnit[]|null);

    /** WarActionUnitLoadCo actingTiles */
    actingTiles?: (ISerializedWarTile[]|null);

    /** WarActionUnitLoadCo cost */
    cost?: (number|null);
}

/** Represents a WarActionUnitLoadCo. */
export declare class WarActionUnitLoadCo implements IWarActionUnitLoadCo {

    /**
     * Constructs a new WarActionUnitLoadCo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IWarActionUnitLoadCo);

    /** WarActionUnitLoadCo path. */
    public path?: (IMovePath|null);

    /** WarActionUnitLoadCo launchUnitId. */
    public launchUnitId: number;

    /** WarActionUnitLoadCo discoveredUnits. */
    public discoveredUnits: ISerializedWarUnit[];

    /** WarActionUnitLoadCo discoveredTiles. */
    public discoveredTiles: ISerializedWarTile[];

    /** WarActionUnitLoadCo actingUnits. */
    public actingUnits: ISerializedWarUnit[];

    /** WarActionUnitLoadCo actingTiles. */
    public actingTiles: ISerializedWarTile[];

    /** WarActionUnitLoadCo cost. */
    public cost: number;

    /**
     * Creates a new WarActionUnitLoadCo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns WarActionUnitLoadCo instance
     */
    public static create(properties?: IWarActionUnitLoadCo): WarActionUnitLoadCo;

    /**
     * Encodes the specified WarActionUnitLoadCo message. Does not implicitly {@link WarActionUnitLoadCo.verify|verify} messages.
     * @param message WarActionUnitLoadCo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IWarActionUnitLoadCo, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified WarActionUnitLoadCo message, length delimited. Does not implicitly {@link WarActionUnitLoadCo.verify|verify} messages.
     * @param message WarActionUnitLoadCo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IWarActionUnitLoadCo, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a WarActionUnitLoadCo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns WarActionUnitLoadCo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): WarActionUnitLoadCo;

    /**
     * Decodes a WarActionUnitLoadCo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns WarActionUnitLoadCo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): WarActionUnitLoadCo;

    /**
     * Verifies a WarActionUnitLoadCo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a WarActionUnitLoadCo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns WarActionUnitLoadCo
     */
    public static fromObject(object: { [k: string]: any }): WarActionUnitLoadCo;

    /**
     * Creates a plain object from a WarActionUnitLoadCo message. Also converts values to other types if specified.
     * @param message WarActionUnitLoadCo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: WarActionUnitLoadCo, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this WarActionUnitLoadCo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a WarActionUnitUseCoSkill. */
export declare interface IWarActionUnitUseCoSkill {

    /** WarActionUnitUseCoSkill path */
    path?: (IMovePath|null);

    /** WarActionUnitUseCoSkill launchUnitId */
    launchUnitId?: (number|null);

    /** WarActionUnitUseCoSkill skillType */
    skillType?: (number|null);

    /** WarActionUnitUseCoSkill discoveredUnits */
    discoveredUnits?: (ISerializedWarUnit[]|null);

    /** WarActionUnitUseCoSkill discoveredTiles */
    discoveredTiles?: (ISerializedWarTile[]|null);

    /** WarActionUnitUseCoSkill actingUnits */
    actingUnits?: (ISerializedWarUnit[]|null);

    /** WarActionUnitUseCoSkill actingTiles */
    actingTiles?: (ISerializedWarTile[]|null);

    /** WarActionUnitUseCoSkill extraDataList */
    extraDataList?: (IWarUseCoSkillExtraData[]|null);
}

/** Represents a WarActionUnitUseCoSkill. */
export declare class WarActionUnitUseCoSkill implements IWarActionUnitUseCoSkill {

    /**
     * Constructs a new WarActionUnitUseCoSkill.
     * @param [properties] Properties to set
     */
    constructor(properties?: IWarActionUnitUseCoSkill);

    /** WarActionUnitUseCoSkill path. */
    public path?: (IMovePath|null);

    /** WarActionUnitUseCoSkill launchUnitId. */
    public launchUnitId: number;

    /** WarActionUnitUseCoSkill skillType. */
    public skillType: number;

    /** WarActionUnitUseCoSkill discoveredUnits. */
    public discoveredUnits: ISerializedWarUnit[];

    /** WarActionUnitUseCoSkill discoveredTiles. */
    public discoveredTiles: ISerializedWarTile[];

    /** WarActionUnitUseCoSkill actingUnits. */
    public actingUnits: ISerializedWarUnit[];

    /** WarActionUnitUseCoSkill actingTiles. */
    public actingTiles: ISerializedWarTile[];

    /** WarActionUnitUseCoSkill extraDataList. */
    public extraDataList: IWarUseCoSkillExtraData[];

    /**
     * Creates a new WarActionUnitUseCoSkill instance using the specified properties.
     * @param [properties] Properties to set
     * @returns WarActionUnitUseCoSkill instance
     */
    public static create(properties?: IWarActionUnitUseCoSkill): WarActionUnitUseCoSkill;

    /**
     * Encodes the specified WarActionUnitUseCoSkill message. Does not implicitly {@link WarActionUnitUseCoSkill.verify|verify} messages.
     * @param message WarActionUnitUseCoSkill message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IWarActionUnitUseCoSkill, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified WarActionUnitUseCoSkill message, length delimited. Does not implicitly {@link WarActionUnitUseCoSkill.verify|verify} messages.
     * @param message WarActionUnitUseCoSkill message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IWarActionUnitUseCoSkill, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a WarActionUnitUseCoSkill message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns WarActionUnitUseCoSkill
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): WarActionUnitUseCoSkill;

    /**
     * Decodes a WarActionUnitUseCoSkill message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns WarActionUnitUseCoSkill
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): WarActionUnitUseCoSkill;

    /**
     * Verifies a WarActionUnitUseCoSkill message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a WarActionUnitUseCoSkill message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns WarActionUnitUseCoSkill
     */
    public static fromObject(object: { [k: string]: any }): WarActionUnitUseCoSkill;

    /**
     * Creates a plain object from a WarActionUnitUseCoSkill message. Also converts values to other types if specified.
     * @param message WarActionUnitUseCoSkill
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: WarActionUnitUseCoSkill, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this WarActionUnitUseCoSkill to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a WarActionContainer. */
export declare interface IWarActionContainer {

    /** WarActionContainer actionId */
    actionId?: (number|null);

    /** WarActionContainer WarActionPlayerBeginTurn */
    WarActionPlayerBeginTurn?: (IWarActionPlayerBeginTurn|null);

    /** WarActionContainer WarActionPlayerEndTurn */
    WarActionPlayerEndTurn?: (IWarActionPlayerEndTurn|null);

    /** WarActionContainer WarActionPlayerSurrender */
    WarActionPlayerSurrender?: (IWarActionPlayerSurrender|null);

    /** WarActionContainer WarActionPlayerProduceUnit */
    WarActionPlayerProduceUnit?: (IWarActionPlayerProduceUnit|null);

    /** WarActionContainer WarActionPlayerDeleteUnit */
    WarActionPlayerDeleteUnit?: (IWarActionPlayerDeleteUnit|null);

    /** WarActionContainer WarActionPlayerVoteForDraw */
    WarActionPlayerVoteForDraw?: (IWarActionPlayerVoteForDraw|null);

    /** WarActionContainer WarActionUnitWait */
    WarActionUnitWait?: (IWarActionUnitWait|null);

    /** WarActionContainer WarActionUnitBeLoaded */
    WarActionUnitBeLoaded?: (IWarActionUnitBeLoaded|null);

    /** WarActionContainer WarActionUnitCaptureTile */
    WarActionUnitCaptureTile?: (IWarActionUnitCaptureTile|null);

    /** WarActionContainer WarActionUnitAttack */
    WarActionUnitAttack?: (IWarActionUnitAttack|null);

    /** WarActionContainer WarActionUnitDrop */
    WarActionUnitDrop?: (IWarActionUnitDrop|null);

    /** WarActionContainer WarActionUnitBuildTile */
    WarActionUnitBuildTile?: (IWarActionUnitBuildTile|null);

    /** WarActionContainer WarActionUnitDive */
    WarActionUnitDive?: (IWarActionUnitDive|null);

    /** WarActionContainer WarActionUnitSurface */
    WarActionUnitSurface?: (IWarActionUnitSurface|null);

    /** WarActionContainer WarActionUnitJoin */
    WarActionUnitJoin?: (IWarActionUnitJoin|null);

    /** WarActionContainer WarActionUnitLaunchFlare */
    WarActionUnitLaunchFlare?: (IWarActionUnitLaunchFlare|null);

    /** WarActionContainer WarActionUnitLaunchSilo */
    WarActionUnitLaunchSilo?: (IWarActionUnitLaunchSilo|null);

    /** WarActionContainer WarActionUnitProduceUnit */
    WarActionUnitProduceUnit?: (IWarActionUnitProduceUnit|null);

    /** WarActionContainer WarActionUnitSupply */
    WarActionUnitSupply?: (IWarActionUnitSupply|null);

    /** WarActionContainer WarActionUnitLoadCo */
    WarActionUnitLoadCo?: (IWarActionUnitLoadCo|null);

    /** WarActionContainer WarActionUnitUseCoSkill */
    WarActionUnitUseCoSkill?: (IWarActionUnitUseCoSkill|null);
}

/** Represents a WarActionContainer. */
export declare class WarActionContainer implements IWarActionContainer {

    /**
     * Constructs a new WarActionContainer.
     * @param [properties] Properties to set
     */
    constructor(properties?: IWarActionContainer);

    /** WarActionContainer actionId. */
    public actionId: number;

    /** WarActionContainer WarActionPlayerBeginTurn. */
    public WarActionPlayerBeginTurn?: (IWarActionPlayerBeginTurn|null);

    /** WarActionContainer WarActionPlayerEndTurn. */
    public WarActionPlayerEndTurn?: (IWarActionPlayerEndTurn|null);

    /** WarActionContainer WarActionPlayerSurrender. */
    public WarActionPlayerSurrender?: (IWarActionPlayerSurrender|null);

    /** WarActionContainer WarActionPlayerProduceUnit. */
    public WarActionPlayerProduceUnit?: (IWarActionPlayerProduceUnit|null);

    /** WarActionContainer WarActionPlayerDeleteUnit. */
    public WarActionPlayerDeleteUnit?: (IWarActionPlayerDeleteUnit|null);

    /** WarActionContainer WarActionPlayerVoteForDraw. */
    public WarActionPlayerVoteForDraw?: (IWarActionPlayerVoteForDraw|null);

    /** WarActionContainer WarActionUnitWait. */
    public WarActionUnitWait?: (IWarActionUnitWait|null);

    /** WarActionContainer WarActionUnitBeLoaded. */
    public WarActionUnitBeLoaded?: (IWarActionUnitBeLoaded|null);

    /** WarActionContainer WarActionUnitCaptureTile. */
    public WarActionUnitCaptureTile?: (IWarActionUnitCaptureTile|null);

    /** WarActionContainer WarActionUnitAttack. */
    public WarActionUnitAttack?: (IWarActionUnitAttack|null);

    /** WarActionContainer WarActionUnitDrop. */
    public WarActionUnitDrop?: (IWarActionUnitDrop|null);

    /** WarActionContainer WarActionUnitBuildTile. */
    public WarActionUnitBuildTile?: (IWarActionUnitBuildTile|null);

    /** WarActionContainer WarActionUnitDive. */
    public WarActionUnitDive?: (IWarActionUnitDive|null);

    /** WarActionContainer WarActionUnitSurface. */
    public WarActionUnitSurface?: (IWarActionUnitSurface|null);

    /** WarActionContainer WarActionUnitJoin. */
    public WarActionUnitJoin?: (IWarActionUnitJoin|null);

    /** WarActionContainer WarActionUnitLaunchFlare. */
    public WarActionUnitLaunchFlare?: (IWarActionUnitLaunchFlare|null);

    /** WarActionContainer WarActionUnitLaunchSilo. */
    public WarActionUnitLaunchSilo?: (IWarActionUnitLaunchSilo|null);

    /** WarActionContainer WarActionUnitProduceUnit. */
    public WarActionUnitProduceUnit?: (IWarActionUnitProduceUnit|null);

    /** WarActionContainer WarActionUnitSupply. */
    public WarActionUnitSupply?: (IWarActionUnitSupply|null);

    /** WarActionContainer WarActionUnitLoadCo. */
    public WarActionUnitLoadCo?: (IWarActionUnitLoadCo|null);

    /** WarActionContainer WarActionUnitUseCoSkill. */
    public WarActionUnitUseCoSkill?: (IWarActionUnitUseCoSkill|null);

    /**
     * Creates a new WarActionContainer instance using the specified properties.
     * @param [properties] Properties to set
     * @returns WarActionContainer instance
     */
    public static create(properties?: IWarActionContainer): WarActionContainer;

    /**
     * Encodes the specified WarActionContainer message. Does not implicitly {@link WarActionContainer.verify|verify} messages.
     * @param message WarActionContainer message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IWarActionContainer, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified WarActionContainer message, length delimited. Does not implicitly {@link WarActionContainer.verify|verify} messages.
     * @param message WarActionContainer message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IWarActionContainer, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a WarActionContainer message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns WarActionContainer
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): WarActionContainer;

    /**
     * Decodes a WarActionContainer message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns WarActionContainer
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): WarActionContainer;

    /**
     * Verifies a WarActionContainer message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a WarActionContainer message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns WarActionContainer
     */
    public static fromObject(object: { [k: string]: any }): WarActionContainer;

    /**
     * Creates a plain object from a WarActionContainer message. Also converts values to other types if specified.
     * @param message WarActionContainer
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: WarActionContainer, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this WarActionContainer to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a GridIndex. */
export declare interface IGridIndex {

    /** GridIndex x */
    x?: (number|null);

    /** GridIndex y */
    y?: (number|null);
}

/** Represents a GridIndex. */
export declare class GridIndex implements IGridIndex {

    /**
     * Constructs a new GridIndex.
     * @param [properties] Properties to set
     */
    constructor(properties?: IGridIndex);

    /** GridIndex x. */
    public x: number;

    /** GridIndex y. */
    public y: number;

    /**
     * Creates a new GridIndex instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GridIndex instance
     */
    public static create(properties?: IGridIndex): GridIndex;

    /**
     * Encodes the specified GridIndex message. Does not implicitly {@link GridIndex.verify|verify} messages.
     * @param message GridIndex message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IGridIndex, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified GridIndex message, length delimited. Does not implicitly {@link GridIndex.verify|verify} messages.
     * @param message GridIndex message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IGridIndex, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a GridIndex message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GridIndex
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): GridIndex;

    /**
     * Decodes a GridIndex message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GridIndex
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): GridIndex;

    /**
     * Verifies a GridIndex message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a GridIndex message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GridIndex
     */
    public static fromObject(object: { [k: string]: any }): GridIndex;

    /**
     * Creates a plain object from a GridIndex message. Also converts values to other types if specified.
     * @param message GridIndex
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: GridIndex, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this GridIndex to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a MovePath. */
export declare interface IMovePath {

    /** MovePath nodes */
    nodes?: (IGridIndex[]|null);

    /** MovePath isBlocked */
    isBlocked?: (boolean|null);

    /** MovePath fuelConsumption */
    fuelConsumption?: (number|null);
}

/** Represents a MovePath. */
export declare class MovePath implements IMovePath {

    /**
     * Constructs a new MovePath.
     * @param [properties] Properties to set
     */
    constructor(properties?: IMovePath);

    /** MovePath nodes. */
    public nodes: IGridIndex[];

    /** MovePath isBlocked. */
    public isBlocked: boolean;

    /** MovePath fuelConsumption. */
    public fuelConsumption: number;

    /**
     * Creates a new MovePath instance using the specified properties.
     * @param [properties] Properties to set
     * @returns MovePath instance
     */
    public static create(properties?: IMovePath): MovePath;

    /**
     * Encodes the specified MovePath message. Does not implicitly {@link MovePath.verify|verify} messages.
     * @param message MovePath message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IMovePath, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified MovePath message, length delimited. Does not implicitly {@link MovePath.verify|verify} messages.
     * @param message MovePath message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IMovePath, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a MovePath message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns MovePath
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): MovePath;

    /**
     * Decodes a MovePath message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns MovePath
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): MovePath;

    /**
     * Verifies a MovePath message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a MovePath message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns MovePath
     */
    public static fromObject(object: { [k: string]: any }): MovePath;

    /**
     * Creates a plain object from a MovePath message. Also converts values to other types if specified.
     * @param message MovePath
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: MovePath, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this MovePath to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a DropDestination. */
export declare interface IDropDestination {

    /** DropDestination unitId */
    unitId?: (number|null);

    /** DropDestination gridIndex */
    gridIndex?: (IGridIndex|null);
}

/** Represents a DropDestination. */
export declare class DropDestination implements IDropDestination {

    /**
     * Constructs a new DropDestination.
     * @param [properties] Properties to set
     */
    constructor(properties?: IDropDestination);

    /** DropDestination unitId. */
    public unitId: number;

    /** DropDestination gridIndex. */
    public gridIndex?: (IGridIndex|null);

    /**
     * Creates a new DropDestination instance using the specified properties.
     * @param [properties] Properties to set
     * @returns DropDestination instance
     */
    public static create(properties?: IDropDestination): DropDestination;

    /**
     * Encodes the specified DropDestination message. Does not implicitly {@link DropDestination.verify|verify} messages.
     * @param message DropDestination message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IDropDestination, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified DropDestination message, length delimited. Does not implicitly {@link DropDestination.verify|verify} messages.
     * @param message DropDestination message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IDropDestination, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a DropDestination message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns DropDestination
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): DropDestination;

    /**
     * Decodes a DropDestination message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns DropDestination
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): DropDestination;

    /**
     * Verifies a DropDestination message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a DropDestination message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns DropDestination
     */
    public static fromObject(object: { [k: string]: any }): DropDestination;

    /**
     * Creates a plain object from a DropDestination message. Also converts values to other types if specified.
     * @param message DropDestination
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: DropDestination, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this DropDestination to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a SeedRandomState. */
export declare interface ISeedRandomState {

    /** SeedRandomState i */
    i?: (number|null);

    /** SeedRandomState j */
    j?: (number|null);

    /** SeedRandomState S */
    S?: (number[]|null);
}

/** Represents a SeedRandomState. */
export declare class SeedRandomState implements ISeedRandomState {

    /**
     * Constructs a new SeedRandomState.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISeedRandomState);

    /** SeedRandomState i. */
    public i: number;

    /** SeedRandomState j. */
    public j: number;

    /** SeedRandomState S. */
    public S: number[];

    /**
     * Creates a new SeedRandomState instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SeedRandomState instance
     */
    public static create(properties?: ISeedRandomState): SeedRandomState;

    /**
     * Encodes the specified SeedRandomState message. Does not implicitly {@link SeedRandomState.verify|verify} messages.
     * @param message SeedRandomState message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISeedRandomState, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified SeedRandomState message, length delimited. Does not implicitly {@link SeedRandomState.verify|verify} messages.
     * @param message SeedRandomState message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISeedRandomState, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a SeedRandomState message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SeedRandomState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): SeedRandomState;

    /**
     * Decodes a SeedRandomState message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SeedRandomState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): SeedRandomState;

    /**
     * Verifies a SeedRandomState message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a SeedRandomState message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SeedRandomState
     */
    public static fromObject(object: { [k: string]: any }): SeedRandomState;

    /**
     * Creates a plain object from a SeedRandomState message. Also converts values to other types if specified.
     * @param message SeedRandomState
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: SeedRandomState, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this SeedRandomState to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a BannedCoIdList. */
export declare interface IBannedCoIdList {

    /** BannedCoIdList bannedCoIdList */
    bannedCoIdList?: (number[]|null);
}

/** Represents a BannedCoIdList. */
export declare class BannedCoIdList implements IBannedCoIdList {

    /**
     * Constructs a new BannedCoIdList.
     * @param [properties] Properties to set
     */
    constructor(properties?: IBannedCoIdList);

    /** BannedCoIdList bannedCoIdList. */
    public bannedCoIdList: number[];

    /**
     * Creates a new BannedCoIdList instance using the specified properties.
     * @param [properties] Properties to set
     * @returns BannedCoIdList instance
     */
    public static create(properties?: IBannedCoIdList): BannedCoIdList;

    /**
     * Encodes the specified BannedCoIdList message. Does not implicitly {@link BannedCoIdList.verify|verify} messages.
     * @param message BannedCoIdList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IBannedCoIdList, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified BannedCoIdList message, length delimited. Does not implicitly {@link BannedCoIdList.verify|verify} messages.
     * @param message BannedCoIdList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IBannedCoIdList, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a BannedCoIdList message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns BannedCoIdList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): BannedCoIdList;

    /**
     * Decodes a BannedCoIdList message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns BannedCoIdList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): BannedCoIdList;

    /**
     * Verifies a BannedCoIdList message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a BannedCoIdList message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns BannedCoIdList
     */
    public static fromObject(object: { [k: string]: any }): BannedCoIdList;

    /**
     * Creates a plain object from a BannedCoIdList message. Also converts values to other types if specified.
     * @param message BannedCoIdList
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: BannedCoIdList, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this BannedCoIdList to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a McrWaitingInfo. */
export declare interface IMcrWaitingInfo {

    /** McrWaitingInfo id */
    id?: (number|null);

    /** McrWaitingInfo mapFileName */
    mapFileName?: (string|null);

    /** McrWaitingInfo warName */
    warName?: (string|null);

    /** McrWaitingInfo warPassword */
    warPassword?: (string|null);

    /** McrWaitingInfo warComment */
    warComment?: (string|null);

    /** McrWaitingInfo configVersion */
    configVersion?: (string|null);

    /** McrWaitingInfo p1UserId */
    p1UserId?: (number|null);

    /** McrWaitingInfo p1UserNickname */
    p1UserNickname?: (string|null);

    /** McrWaitingInfo p1TeamIndex */
    p1TeamIndex?: (number|null);

    /** McrWaitingInfo p1CoId */
    p1CoId?: (number|null);

    /** McrWaitingInfo p2UserId */
    p2UserId?: (number|null);

    /** McrWaitingInfo p2UserNickname */
    p2UserNickname?: (string|null);

    /** McrWaitingInfo p2TeamIndex */
    p2TeamIndex?: (number|null);

    /** McrWaitingInfo p2CoId */
    p2CoId?: (number|null);

    /** McrWaitingInfo p3UserId */
    p3UserId?: (number|null);

    /** McrWaitingInfo p3UserNickname */
    p3UserNickname?: (string|null);

    /** McrWaitingInfo p3TeamIndex */
    p3TeamIndex?: (number|null);

    /** McrWaitingInfo p3CoId */
    p3CoId?: (number|null);

    /** McrWaitingInfo p4UserId */
    p4UserId?: (number|null);

    /** McrWaitingInfo p4UserNickname */
    p4UserNickname?: (string|null);

    /** McrWaitingInfo p4TeamIndex */
    p4TeamIndex?: (number|null);

    /** McrWaitingInfo p4CoId */
    p4CoId?: (number|null);

    /** McrWaitingInfo hasFog */
    hasFog?: (number|null);

    /** McrWaitingInfo timeLimit */
    timeLimit?: (number|null);

    /** McrWaitingInfo initialFund */
    initialFund?: (number|null);

    /** McrWaitingInfo incomeModifier */
    incomeModifier?: (number|null);

    /** McrWaitingInfo initialEnergy */
    initialEnergy?: (number|null);

    /** McrWaitingInfo energyGrowthModifier */
    energyGrowthModifier?: (number|null);

    /** McrWaitingInfo moveRangeModifier */
    moveRangeModifier?: (number|null);

    /** McrWaitingInfo attackPowerModifier */
    attackPowerModifier?: (number|null);

    /** McrWaitingInfo visionRangeModifier */
    visionRangeModifier?: (number|null);

    /** McrWaitingInfo bannedCoIdList */
    bannedCoIdList?: (number[]|null);

    /** McrWaitingInfo luckLowerLimit */
    luckLowerLimit?: (number|null);

    /** McrWaitingInfo luckUpperLimit */
    luckUpperLimit?: (number|null);
}

/** Represents a McrWaitingInfo. */
export declare class McrWaitingInfo implements IMcrWaitingInfo {

    /**
     * Constructs a new McrWaitingInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IMcrWaitingInfo);

    /** McrWaitingInfo id. */
    public id: number;

    /** McrWaitingInfo mapFileName. */
    public mapFileName: string;

    /** McrWaitingInfo warName. */
    public warName: string;

    /** McrWaitingInfo warPassword. */
    public warPassword: string;

    /** McrWaitingInfo warComment. */
    public warComment: string;

    /** McrWaitingInfo configVersion. */
    public configVersion: string;

    /** McrWaitingInfo p1UserId. */
    public p1UserId: number;

    /** McrWaitingInfo p1UserNickname. */
    public p1UserNickname: string;

    /** McrWaitingInfo p1TeamIndex. */
    public p1TeamIndex: number;

    /** McrWaitingInfo p1CoId. */
    public p1CoId: number;

    /** McrWaitingInfo p2UserId. */
    public p2UserId: number;

    /** McrWaitingInfo p2UserNickname. */
    public p2UserNickname: string;

    /** McrWaitingInfo p2TeamIndex. */
    public p2TeamIndex: number;

    /** McrWaitingInfo p2CoId. */
    public p2CoId: number;

    /** McrWaitingInfo p3UserId. */
    public p3UserId: number;

    /** McrWaitingInfo p3UserNickname. */
    public p3UserNickname: string;

    /** McrWaitingInfo p3TeamIndex. */
    public p3TeamIndex: number;

    /** McrWaitingInfo p3CoId. */
    public p3CoId: number;

    /** McrWaitingInfo p4UserId. */
    public p4UserId: number;

    /** McrWaitingInfo p4UserNickname. */
    public p4UserNickname: string;

    /** McrWaitingInfo p4TeamIndex. */
    public p4TeamIndex: number;

    /** McrWaitingInfo p4CoId. */
    public p4CoId: number;

    /** McrWaitingInfo hasFog. */
    public hasFog: number;

    /** McrWaitingInfo timeLimit. */
    public timeLimit: number;

    /** McrWaitingInfo initialFund. */
    public initialFund: number;

    /** McrWaitingInfo incomeModifier. */
    public incomeModifier: number;

    /** McrWaitingInfo initialEnergy. */
    public initialEnergy: number;

    /** McrWaitingInfo energyGrowthModifier. */
    public energyGrowthModifier: number;

    /** McrWaitingInfo moveRangeModifier. */
    public moveRangeModifier: number;

    /** McrWaitingInfo attackPowerModifier. */
    public attackPowerModifier: number;

    /** McrWaitingInfo visionRangeModifier. */
    public visionRangeModifier: number;

    /** McrWaitingInfo bannedCoIdList. */
    public bannedCoIdList: number[];

    /** McrWaitingInfo luckLowerLimit. */
    public luckLowerLimit: number;

    /** McrWaitingInfo luckUpperLimit. */
    public luckUpperLimit: number;

    /**
     * Creates a new McrWaitingInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns McrWaitingInfo instance
     */
    public static create(properties?: IMcrWaitingInfo): McrWaitingInfo;

    /**
     * Encodes the specified McrWaitingInfo message. Does not implicitly {@link McrWaitingInfo.verify|verify} messages.
     * @param message McrWaitingInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IMcrWaitingInfo, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified McrWaitingInfo message, length delimited. Does not implicitly {@link McrWaitingInfo.verify|verify} messages.
     * @param message McrWaitingInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IMcrWaitingInfo, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a McrWaitingInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns McrWaitingInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): McrWaitingInfo;

    /**
     * Decodes a McrWaitingInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns McrWaitingInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): McrWaitingInfo;

    /**
     * Verifies a McrWaitingInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a McrWaitingInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns McrWaitingInfo
     */
    public static fromObject(object: { [k: string]: any }): McrWaitingInfo;

    /**
     * Creates a plain object from a McrWaitingInfo message. Also converts values to other types if specified.
     * @param message McrWaitingInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: McrWaitingInfo, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this McrWaitingInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a McwOngoingDetail. */
export declare interface IMcwOngoingDetail {

    /** McwOngoingDetail id */
    id?: (number|null);

    /** McwOngoingDetail configVersion */
    configVersion?: (string|null);

    /** McwOngoingDetail mapFileName */
    mapFileName?: (string|null);

    /** McwOngoingDetail warName */
    warName?: (string|null);

    /** McwOngoingDetail warPassword */
    warPassword?: (string|null);

    /** McwOngoingDetail warComment */
    warComment?: (string|null);

    /** McwOngoingDetail hasFog */
    hasFog?: (number|null);

    /** McwOngoingDetail timeLimit */
    timeLimit?: (number|null);

    /** McwOngoingDetail initialFund */
    initialFund?: (number|null);

    /** McwOngoingDetail incomeModifier */
    incomeModifier?: (number|null);

    /** McwOngoingDetail initialEnergy */
    initialEnergy?: (number|null);

    /** McwOngoingDetail energyGrowthModifier */
    energyGrowthModifier?: (number|null);

    /** McwOngoingDetail moveRangeModifier */
    moveRangeModifier?: (number|null);

    /** McwOngoingDetail attackPowerModifier */
    attackPowerModifier?: (number|null);

    /** McwOngoingDetail visionRangeModifier */
    visionRangeModifier?: (number|null);

    /** McwOngoingDetail p1UserId */
    p1UserId?: (number|null);

    /** McwOngoingDetail p1TeamIndex */
    p1TeamIndex?: (number|null);

    /** McwOngoingDetail p1IsAlive */
    p1IsAlive?: (boolean|null);

    /** McwOngoingDetail p1CoId */
    p1CoId?: (number|null);

    /** McwOngoingDetail p1UserNickname */
    p1UserNickname?: (string|null);

    /** McwOngoingDetail p2UserId */
    p2UserId?: (number|null);

    /** McwOngoingDetail p2TeamIndex */
    p2TeamIndex?: (number|null);

    /** McwOngoingDetail p2IsAlive */
    p2IsAlive?: (boolean|null);

    /** McwOngoingDetail p2CoId */
    p2CoId?: (number|null);

    /** McwOngoingDetail p2UserNickname */
    p2UserNickname?: (string|null);

    /** McwOngoingDetail p3UserId */
    p3UserId?: (number|null);

    /** McwOngoingDetail p3TeamIndex */
    p3TeamIndex?: (number|null);

    /** McwOngoingDetail p3IsAlive */
    p3IsAlive?: (boolean|null);

    /** McwOngoingDetail p3CoId */
    p3CoId?: (number|null);

    /** McwOngoingDetail p3UserNickname */
    p3UserNickname?: (string|null);

    /** McwOngoingDetail p4UserId */
    p4UserId?: (number|null);

    /** McwOngoingDetail p4TeamIndex */
    p4TeamIndex?: (number|null);

    /** McwOngoingDetail p4IsAlive */
    p4IsAlive?: (boolean|null);

    /** McwOngoingDetail p4CoId */
    p4CoId?: (number|null);

    /** McwOngoingDetail p4UserNickname */
    p4UserNickname?: (string|null);

    /** McwOngoingDetail playerIndexInTurn */
    playerIndexInTurn?: (number|null);

    /** McwOngoingDetail turnIndex */
    turnIndex?: (number|null);

    /** McwOngoingDetail enterTurnTime */
    enterTurnTime?: (number|null);
}

/** Represents a McwOngoingDetail. */
export declare class McwOngoingDetail implements IMcwOngoingDetail {

    /**
     * Constructs a new McwOngoingDetail.
     * @param [properties] Properties to set
     */
    constructor(properties?: IMcwOngoingDetail);

    /** McwOngoingDetail id. */
    public id: number;

    /** McwOngoingDetail configVersion. */
    public configVersion: string;

    /** McwOngoingDetail mapFileName. */
    public mapFileName: string;

    /** McwOngoingDetail warName. */
    public warName: string;

    /** McwOngoingDetail warPassword. */
    public warPassword: string;

    /** McwOngoingDetail warComment. */
    public warComment: string;

    /** McwOngoingDetail hasFog. */
    public hasFog: number;

    /** McwOngoingDetail timeLimit. */
    public timeLimit: number;

    /** McwOngoingDetail initialFund. */
    public initialFund: number;

    /** McwOngoingDetail incomeModifier. */
    public incomeModifier: number;

    /** McwOngoingDetail initialEnergy. */
    public initialEnergy: number;

    /** McwOngoingDetail energyGrowthModifier. */
    public energyGrowthModifier: number;

    /** McwOngoingDetail moveRangeModifier. */
    public moveRangeModifier: number;

    /** McwOngoingDetail attackPowerModifier. */
    public attackPowerModifier: number;

    /** McwOngoingDetail visionRangeModifier. */
    public visionRangeModifier: number;

    /** McwOngoingDetail p1UserId. */
    public p1UserId: number;

    /** McwOngoingDetail p1TeamIndex. */
    public p1TeamIndex: number;

    /** McwOngoingDetail p1IsAlive. */
    public p1IsAlive: boolean;

    /** McwOngoingDetail p1CoId. */
    public p1CoId: number;

    /** McwOngoingDetail p1UserNickname. */
    public p1UserNickname: string;

    /** McwOngoingDetail p2UserId. */
    public p2UserId: number;

    /** McwOngoingDetail p2TeamIndex. */
    public p2TeamIndex: number;

    /** McwOngoingDetail p2IsAlive. */
    public p2IsAlive: boolean;

    /** McwOngoingDetail p2CoId. */
    public p2CoId: number;

    /** McwOngoingDetail p2UserNickname. */
    public p2UserNickname: string;

    /** McwOngoingDetail p3UserId. */
    public p3UserId: number;

    /** McwOngoingDetail p3TeamIndex. */
    public p3TeamIndex: number;

    /** McwOngoingDetail p3IsAlive. */
    public p3IsAlive: boolean;

    /** McwOngoingDetail p3CoId. */
    public p3CoId: number;

    /** McwOngoingDetail p3UserNickname. */
    public p3UserNickname: string;

    /** McwOngoingDetail p4UserId. */
    public p4UserId: number;

    /** McwOngoingDetail p4TeamIndex. */
    public p4TeamIndex: number;

    /** McwOngoingDetail p4IsAlive. */
    public p4IsAlive: boolean;

    /** McwOngoingDetail p4CoId. */
    public p4CoId: number;

    /** McwOngoingDetail p4UserNickname. */
    public p4UserNickname: string;

    /** McwOngoingDetail playerIndexInTurn. */
    public playerIndexInTurn: number;

    /** McwOngoingDetail turnIndex. */
    public turnIndex: number;

    /** McwOngoingDetail enterTurnTime. */
    public enterTurnTime: number;

    /**
     * Creates a new McwOngoingDetail instance using the specified properties.
     * @param [properties] Properties to set
     * @returns McwOngoingDetail instance
     */
    public static create(properties?: IMcwOngoingDetail): McwOngoingDetail;

    /**
     * Encodes the specified McwOngoingDetail message. Does not implicitly {@link McwOngoingDetail.verify|verify} messages.
     * @param message McwOngoingDetail message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IMcwOngoingDetail, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified McwOngoingDetail message, length delimited. Does not implicitly {@link McwOngoingDetail.verify|verify} messages.
     * @param message McwOngoingDetail message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IMcwOngoingDetail, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a McwOngoingDetail message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns McwOngoingDetail
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): McwOngoingDetail;

    /**
     * Decodes a McwOngoingDetail message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns McwOngoingDetail
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): McwOngoingDetail;

    /**
     * Verifies a McwOngoingDetail message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a McwOngoingDetail message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns McwOngoingDetail
     */
    public static fromObject(object: { [k: string]: any }): McwOngoingDetail;

    /**
     * Creates a plain object from a McwOngoingDetail message. Also converts values to other types if specified.
     * @param message McwOngoingDetail
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: McwOngoingDetail, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this McwOngoingDetail to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a McwReplayInfo. */
export declare interface IMcwReplayInfo {

    /** McwReplayInfo replayId */
    replayId?: (number|null);

    /** McwReplayInfo configVersion */
    configVersion?: (string|null);

    /** McwReplayInfo mapFileName */
    mapFileName?: (string|null);

    /** McwReplayInfo hasFog */
    hasFog?: (number|null);

    /** McwReplayInfo turnIndex */
    turnIndex?: (number|null);

    /** McwReplayInfo nextActionId */
    nextActionId?: (number|null);

    /** McwReplayInfo warEndTime */
    warEndTime?: (number|null);

    /** McwReplayInfo p1UserId */
    p1UserId?: (number|null);

    /** McwReplayInfo p1TeamIndex */
    p1TeamIndex?: (number|null);

    /** McwReplayInfo p1UserNickname */
    p1UserNickname?: (string|null);

    /** McwReplayInfo p2UserId */
    p2UserId?: (number|null);

    /** McwReplayInfo p2TeamIndex */
    p2TeamIndex?: (number|null);

    /** McwReplayInfo p2UserNickname */
    p2UserNickname?: (string|null);

    /** McwReplayInfo p3UserId */
    p3UserId?: (number|null);

    /** McwReplayInfo p3TeamIndex */
    p3TeamIndex?: (number|null);

    /** McwReplayInfo p3UserNickname */
    p3UserNickname?: (string|null);

    /** McwReplayInfo p4UserId */
    p4UserId?: (number|null);

    /** McwReplayInfo p4TeamIndex */
    p4TeamIndex?: (number|null);

    /** McwReplayInfo p4UserNickname */
    p4UserNickname?: (string|null);
}

/** Represents a McwReplayInfo. */
export declare class McwReplayInfo implements IMcwReplayInfo {

    /**
     * Constructs a new McwReplayInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IMcwReplayInfo);

    /** McwReplayInfo replayId. */
    public replayId: number;

    /** McwReplayInfo configVersion. */
    public configVersion: string;

    /** McwReplayInfo mapFileName. */
    public mapFileName: string;

    /** McwReplayInfo hasFog. */
    public hasFog: number;

    /** McwReplayInfo turnIndex. */
    public turnIndex: number;

    /** McwReplayInfo nextActionId. */
    public nextActionId: number;

    /** McwReplayInfo warEndTime. */
    public warEndTime: number;

    /** McwReplayInfo p1UserId. */
    public p1UserId: number;

    /** McwReplayInfo p1TeamIndex. */
    public p1TeamIndex: number;

    /** McwReplayInfo p1UserNickname. */
    public p1UserNickname: string;

    /** McwReplayInfo p2UserId. */
    public p2UserId: number;

    /** McwReplayInfo p2TeamIndex. */
    public p2TeamIndex: number;

    /** McwReplayInfo p2UserNickname. */
    public p2UserNickname: string;

    /** McwReplayInfo p3UserId. */
    public p3UserId: number;

    /** McwReplayInfo p3TeamIndex. */
    public p3TeamIndex: number;

    /** McwReplayInfo p3UserNickname. */
    public p3UserNickname: string;

    /** McwReplayInfo p4UserId. */
    public p4UserId: number;

    /** McwReplayInfo p4TeamIndex. */
    public p4TeamIndex: number;

    /** McwReplayInfo p4UserNickname. */
    public p4UserNickname: string;

    /**
     * Creates a new McwReplayInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns McwReplayInfo instance
     */
    public static create(properties?: IMcwReplayInfo): McwReplayInfo;

    /**
     * Encodes the specified McwReplayInfo message. Does not implicitly {@link McwReplayInfo.verify|verify} messages.
     * @param message McwReplayInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IMcwReplayInfo, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified McwReplayInfo message, length delimited. Does not implicitly {@link McwReplayInfo.verify|verify} messages.
     * @param message McwReplayInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IMcwReplayInfo, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a McwReplayInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns McwReplayInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): McwReplayInfo;

    /**
     * Decodes a McwReplayInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns McwReplayInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): McwReplayInfo;

    /**
     * Verifies a McwReplayInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a McwReplayInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns McwReplayInfo
     */
    public static fromObject(object: { [k: string]: any }): McwReplayInfo;

    /**
     * Creates a plain object from a McwReplayInfo message. Also converts values to other types if specified.
     * @param message McwReplayInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: McwReplayInfo, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this McwReplayInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a UserBriefInfo. */
export declare interface IUserBriefInfo {

    /** UserBriefInfo userId */
    userId?: (number|null);

    /** UserBriefInfo nickname */
    nickname?: (string|null);
}

/** Represents a UserBriefInfo. */
export declare class UserBriefInfo implements IUserBriefInfo {

    /**
     * Constructs a new UserBriefInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IUserBriefInfo);

    /** UserBriefInfo userId. */
    public userId: number;

    /** UserBriefInfo nickname. */
    public nickname: string;

    /**
     * Creates a new UserBriefInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns UserBriefInfo instance
     */
    public static create(properties?: IUserBriefInfo): UserBriefInfo;

    /**
     * Encodes the specified UserBriefInfo message. Does not implicitly {@link UserBriefInfo.verify|verify} messages.
     * @param message UserBriefInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IUserBriefInfo, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified UserBriefInfo message, length delimited. Does not implicitly {@link UserBriefInfo.verify|verify} messages.
     * @param message UserBriefInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IUserBriefInfo, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a UserBriefInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns UserBriefInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): UserBriefInfo;

    /**
     * Decodes a UserBriefInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns UserBriefInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): UserBriefInfo;

    /**
     * Verifies a UserBriefInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a UserBriefInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns UserBriefInfo
     */
    public static fromObject(object: { [k: string]: any }): UserBriefInfo;

    /**
     * Creates a plain object from a UserBriefInfo message. Also converts values to other types if specified.
     * @param message UserBriefInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: UserBriefInfo, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this UserBriefInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a MessageContainer. */
export declare interface IMessageContainer {

    /** MessageContainer C_Heartbeat */
    C_Heartbeat?: (IC_Heartbeat|null);

    /** MessageContainer S_Heartbeat */
    S_Heartbeat?: (IS_Heartbeat|null);

    /** MessageContainer C_Register */
    C_Register?: (IC_Register|null);

    /** MessageContainer S_Register */
    S_Register?: (IS_Register|null);

    /** MessageContainer C_Login */
    C_Login?: (IC_Login|null);

    /** MessageContainer S_Login */
    S_Login?: (IS_Login|null);

    /** MessageContainer C_Logout */
    C_Logout?: (IC_Logout|null);

    /** MessageContainer S_Logout */
    S_Logout?: (IS_Logout|null);

    /** MessageContainer S_Error */
    S_Error?: (IS_Error|null);

    /** MessageContainer S_ServerDisconnect */
    S_ServerDisconnect?: (IS_ServerDisconnect|null);

    /** MessageContainer S_NewestConfigVersion */
    S_NewestConfigVersion?: (IS_NewestConfigVersion|null);

    /** MessageContainer C_GetUserPublicInfo */
    C_GetUserPublicInfo?: (IC_GetUserPublicInfo|null);

    /** MessageContainer S_GetUserPublicInfo */
    S_GetUserPublicInfo?: (IS_GetUserPublicInfo|null);

    /** MessageContainer C_UserChangeNickname */
    C_UserChangeNickname?: (IC_UserChangeNickname|null);

    /** MessageContainer S_UserChangeNickname */
    S_UserChangeNickname?: (IS_UserChangeNickname|null);

    /** MessageContainer C_UserChangeDiscordId */
    C_UserChangeDiscordId?: (IC_UserChangeDiscordId|null);

    /** MessageContainer S_UserChangeDiscordId */
    S_UserChangeDiscordId?: (IS_UserChangeDiscordId|null);

    /** MessageContainer C_UserGetOnlineUsers */
    C_UserGetOnlineUsers?: (IC_UserGetOnlineUsers|null);

    /** MessageContainer S_UserGetOnlineUsers */
    S_UserGetOnlineUsers?: (IS_UserGetOnlineUsers|null);

    /** MessageContainer C_GetMapMetaDataList */
    C_GetMapMetaDataList?: (IC_GetMapMetaDataList|null);

    /** MessageContainer S_GetMapMetaDataList */
    S_GetMapMetaDataList?: (IS_GetMapMetaDataList|null);

    /** MessageContainer C_GetMapRawData */
    C_GetMapRawData?: (IC_GetMapRawData|null);

    /** MessageContainer S_GetMapRawData */
    S_GetMapRawData?: (IS_GetMapRawData|null);

    /** MessageContainer C_GetMapStatisticsDataList */
    C_GetMapStatisticsDataList?: (IC_GetMapStatisticsDataList|null);

    /** MessageContainer S_GetMapStatisticsDataList */
    S_GetMapStatisticsDataList?: (IS_GetMapStatisticsDataList|null);

    /** MessageContainer C_MmChangeAvailability */
    C_MmChangeAvailability?: (IC_MmChangeAvailability|null);

    /** MessageContainer S_MmChangeAvailability */
    S_MmChangeAvailability?: (IS_MmChangeAvailability|null);

    /** MessageContainer C_McrCreateWar */
    C_McrCreateWar?: (IC_McrCreateWar|null);

    /** MessageContainer S_McrCreateWar */
    S_McrCreateWar?: (IS_McrCreateWar|null);

    /** MessageContainer C_McrExitWar */
    C_McrExitWar?: (IC_McrExitWar|null);

    /** MessageContainer S_McrExitWar */
    S_McrExitWar?: (IS_McrExitWar|null);

    /** MessageContainer C_McrGetJoinedWaitingInfos */
    C_McrGetJoinedWaitingInfos?: (IC_McrGetJoinedWaitingInfos|null);

    /** MessageContainer S_McrGetJoinedWaitingInfos */
    S_McrGetJoinedWaitingInfos?: (IS_McrGetJoinedWaitingInfos|null);

    /** MessageContainer C_McrGetUnjoinedWaitingInfos */
    C_McrGetUnjoinedWaitingInfos?: (IC_McrGetUnjoinedWaitingInfos|null);

    /** MessageContainer S_McrGetUnjoinedWaitingInfos */
    S_McrGetUnjoinedWaitingInfos?: (IS_McrGetUnjoinedWaitingInfos|null);

    /** MessageContainer C_McrJoinWar */
    C_McrJoinWar?: (IC_McrJoinWar|null);

    /** MessageContainer S_McrJoinWar */
    S_McrJoinWar?: (IS_McrJoinWar|null);

    /** MessageContainer C_McrGetJoinedOngoingInfos */
    C_McrGetJoinedOngoingInfos?: (IC_McrGetJoinedOngoingInfos|null);

    /** MessageContainer S_McrGetJoinedOngoingInfos */
    S_McrGetJoinedOngoingInfos?: (IS_McrGetJoinedOngoingInfos|null);

    /** MessageContainer C_McrContinueWar */
    C_McrContinueWar?: (IC_McrContinueWar|null);

    /** MessageContainer S_McrContinueWar */
    S_McrContinueWar?: (IS_McrContinueWar|null);

    /** MessageContainer C_McrGetReplayInfos */
    C_McrGetReplayInfos?: (IC_McrGetReplayInfos|null);

    /** MessageContainer S_McrGetReplayInfos */
    S_McrGetReplayInfos?: (IS_McrGetReplayInfos|null);

    /** MessageContainer C_McrGetReplayData */
    C_McrGetReplayData?: (IC_McrGetReplayData|null);

    /** MessageContainer S_McrGetReplayData */
    S_McrGetReplayData?: (IS_McrGetReplayData|null);

    /** MessageContainer C_McwPlayerBeginTurn */
    C_McwPlayerBeginTurn?: (IC_McwPlayerBeginTurn|null);

    /** MessageContainer S_McwPlayerBeginTurn */
    S_McwPlayerBeginTurn?: (IS_McwPlayerBeginTurn|null);

    /** MessageContainer C_McwPlayerEndTurn */
    C_McwPlayerEndTurn?: (IC_McwPlayerEndTurn|null);

    /** MessageContainer S_McwPlayerEndTurn */
    S_McwPlayerEndTurn?: (IS_McwPlayerEndTurn|null);

    /** MessageContainer C_McwPlayerSurrender */
    C_McwPlayerSurrender?: (IC_McwPlayerSurrender|null);

    /** MessageContainer S_McwPlayerSurrender */
    S_McwPlayerSurrender?: (IS_McwPlayerSurrender|null);

    /** MessageContainer C_McwPlayerProduceUnit */
    C_McwPlayerProduceUnit?: (IC_McwPlayerProduceUnit|null);

    /** MessageContainer S_McwPlayerProduceUnit */
    S_McwPlayerProduceUnit?: (IS_McwPlayerProduceUnit|null);

    /** MessageContainer C_McwPlayerDeleteUnit */
    C_McwPlayerDeleteUnit?: (IC_McwPlayerDeleteUnit|null);

    /** MessageContainer S_McwPlayerDeleteUnit */
    S_McwPlayerDeleteUnit?: (IS_McwPlayerDeleteUnit|null);

    /** MessageContainer C_McwPlayerVoteForDraw */
    C_McwPlayerVoteForDraw?: (IC_McwPlayerVoteForDraw|null);

    /** MessageContainer S_McwPlayerVoteForDraw */
    S_McwPlayerVoteForDraw?: (IS_McwPlayerVoteForDraw|null);

    /** MessageContainer C_McwPlayerSyncWar */
    C_McwPlayerSyncWar?: (IC_McwPlayerSyncWar|null);

    /** MessageContainer S_McwPlayerSyncWar */
    S_McwPlayerSyncWar?: (IS_McwPlayerSyncWar|null);

    /** MessageContainer C_McwUnitWait */
    C_McwUnitWait?: (IC_McwUnitWait|null);

    /** MessageContainer S_McwUnitWait */
    S_McwUnitWait?: (IS_McwUnitWait|null);

    /** MessageContainer C_McwUnitBeLoaded */
    C_McwUnitBeLoaded?: (IC_McwUnitBeLoaded|null);

    /** MessageContainer S_McwUnitBeLoaded */
    S_McwUnitBeLoaded?: (IS_McwUnitBeLoaded|null);

    /** MessageContainer C_McwUnitCaptureTile */
    C_McwUnitCaptureTile?: (IC_McwUnitCaptureTile|null);

    /** MessageContainer S_McwUnitCaptureTile */
    S_McwUnitCaptureTile?: (IS_McwUnitCaptureTile|null);

    /** MessageContainer C_McwUnitAttack */
    C_McwUnitAttack?: (IC_McwUnitAttack|null);

    /** MessageContainer S_McwUnitAttack */
    S_McwUnitAttack?: (IS_McwUnitAttack|null);

    /** MessageContainer C_McwUnitDrop */
    C_McwUnitDrop?: (IC_McwUnitDrop|null);

    /** MessageContainer S_McwUnitDrop */
    S_McwUnitDrop?: (IS_McwUnitDrop|null);

    /** MessageContainer C_McwUnitBuildTile */
    C_McwUnitBuildTile?: (IC_McwUnitBuildTile|null);

    /** MessageContainer S_McwUnitBuildTile */
    S_McwUnitBuildTile?: (IS_McwUnitBuildTile|null);

    /** MessageContainer C_McwUnitDive */
    C_McwUnitDive?: (IC_McwUnitDive|null);

    /** MessageContainer S_McwUnitDive */
    S_McwUnitDive?: (IS_McwUnitDive|null);

    /** MessageContainer C_McwUnitSurface */
    C_McwUnitSurface?: (IC_McwUnitSurface|null);

    /** MessageContainer S_McwUnitSurface */
    S_McwUnitSurface?: (IS_McwUnitSurface|null);

    /** MessageContainer C_McwUnitJoin */
    C_McwUnitJoin?: (IC_McwUnitJoin|null);

    /** MessageContainer S_McwUnitJoin */
    S_McwUnitJoin?: (IS_McwUnitJoin|null);

    /** MessageContainer C_McwUnitLaunchFlare */
    C_McwUnitLaunchFlare?: (IC_McwUnitLaunchFlare|null);

    /** MessageContainer S_McwUnitLaunchFlare */
    S_McwUnitLaunchFlare?: (IS_McwUnitLaunchFlare|null);

    /** MessageContainer C_McwUnitLaunchSilo */
    C_McwUnitLaunchSilo?: (IC_McwUnitLaunchSilo|null);

    /** MessageContainer S_McwUnitLaunchSilo */
    S_McwUnitLaunchSilo?: (IS_McwUnitLaunchSilo|null);

    /** MessageContainer C_McwUnitProduceUnit */
    C_McwUnitProduceUnit?: (IC_McwUnitProduceUnit|null);

    /** MessageContainer S_McwUnitProduceUnit */
    S_McwUnitProduceUnit?: (IS_McwUnitProduceUnit|null);

    /** MessageContainer C_McwUnitSupply */
    C_McwUnitSupply?: (IC_McwUnitSupply|null);

    /** MessageContainer S_McwUnitSupply */
    S_McwUnitSupply?: (IS_McwUnitSupply|null);

    /** MessageContainer C_McwUnitLoadCo */
    C_McwUnitLoadCo?: (IC_McwUnitLoadCo|null);

    /** MessageContainer S_McwUnitLoadCo */
    S_McwUnitLoadCo?: (IS_McwUnitLoadCo|null);

    /** MessageContainer C_McwUnitUseCoSkill */
    C_McwUnitUseCoSkill?: (IC_McwUnitUseCoSkill|null);

    /** MessageContainer S_McwUnitUseCoSkill */
    S_McwUnitUseCoSkill?: (IS_McwUnitUseCoSkill|null);
}

/** Represents a MessageContainer. */
export declare class MessageContainer implements IMessageContainer {

    /**
     * Constructs a new MessageContainer.
     * @param [properties] Properties to set
     */
    constructor(properties?: IMessageContainer);

    /** MessageContainer C_Heartbeat. */
    public C_Heartbeat?: (IC_Heartbeat|null);

    /** MessageContainer S_Heartbeat. */
    public S_Heartbeat?: (IS_Heartbeat|null);

    /** MessageContainer C_Register. */
    public C_Register?: (IC_Register|null);

    /** MessageContainer S_Register. */
    public S_Register?: (IS_Register|null);

    /** MessageContainer C_Login. */
    public C_Login?: (IC_Login|null);

    /** MessageContainer S_Login. */
    public S_Login?: (IS_Login|null);

    /** MessageContainer C_Logout. */
    public C_Logout?: (IC_Logout|null);

    /** MessageContainer S_Logout. */
    public S_Logout?: (IS_Logout|null);

    /** MessageContainer S_Error. */
    public S_Error?: (IS_Error|null);

    /** MessageContainer S_ServerDisconnect. */
    public S_ServerDisconnect?: (IS_ServerDisconnect|null);

    /** MessageContainer S_NewestConfigVersion. */
    public S_NewestConfigVersion?: (IS_NewestConfigVersion|null);

    /** MessageContainer C_GetUserPublicInfo. */
    public C_GetUserPublicInfo?: (IC_GetUserPublicInfo|null);

    /** MessageContainer S_GetUserPublicInfo. */
    public S_GetUserPublicInfo?: (IS_GetUserPublicInfo|null);

    /** MessageContainer C_UserChangeNickname. */
    public C_UserChangeNickname?: (IC_UserChangeNickname|null);

    /** MessageContainer S_UserChangeNickname. */
    public S_UserChangeNickname?: (IS_UserChangeNickname|null);

    /** MessageContainer C_UserChangeDiscordId. */
    public C_UserChangeDiscordId?: (IC_UserChangeDiscordId|null);

    /** MessageContainer S_UserChangeDiscordId. */
    public S_UserChangeDiscordId?: (IS_UserChangeDiscordId|null);

    /** MessageContainer C_UserGetOnlineUsers. */
    public C_UserGetOnlineUsers?: (IC_UserGetOnlineUsers|null);

    /** MessageContainer S_UserGetOnlineUsers. */
    public S_UserGetOnlineUsers?: (IS_UserGetOnlineUsers|null);

    /** MessageContainer C_GetMapMetaDataList. */
    public C_GetMapMetaDataList?: (IC_GetMapMetaDataList|null);

    /** MessageContainer S_GetMapMetaDataList. */
    public S_GetMapMetaDataList?: (IS_GetMapMetaDataList|null);

    /** MessageContainer C_GetMapRawData. */
    public C_GetMapRawData?: (IC_GetMapRawData|null);

    /** MessageContainer S_GetMapRawData. */
    public S_GetMapRawData?: (IS_GetMapRawData|null);

    /** MessageContainer C_GetMapStatisticsDataList. */
    public C_GetMapStatisticsDataList?: (IC_GetMapStatisticsDataList|null);

    /** MessageContainer S_GetMapStatisticsDataList. */
    public S_GetMapStatisticsDataList?: (IS_GetMapStatisticsDataList|null);

    /** MessageContainer C_MmChangeAvailability. */
    public C_MmChangeAvailability?: (IC_MmChangeAvailability|null);

    /** MessageContainer S_MmChangeAvailability. */
    public S_MmChangeAvailability?: (IS_MmChangeAvailability|null);

    /** MessageContainer C_McrCreateWar. */
    public C_McrCreateWar?: (IC_McrCreateWar|null);

    /** MessageContainer S_McrCreateWar. */
    public S_McrCreateWar?: (IS_McrCreateWar|null);

    /** MessageContainer C_McrExitWar. */
    public C_McrExitWar?: (IC_McrExitWar|null);

    /** MessageContainer S_McrExitWar. */
    public S_McrExitWar?: (IS_McrExitWar|null);

    /** MessageContainer C_McrGetJoinedWaitingInfos. */
    public C_McrGetJoinedWaitingInfos?: (IC_McrGetJoinedWaitingInfos|null);

    /** MessageContainer S_McrGetJoinedWaitingInfos. */
    public S_McrGetJoinedWaitingInfos?: (IS_McrGetJoinedWaitingInfos|null);

    /** MessageContainer C_McrGetUnjoinedWaitingInfos. */
    public C_McrGetUnjoinedWaitingInfos?: (IC_McrGetUnjoinedWaitingInfos|null);

    /** MessageContainer S_McrGetUnjoinedWaitingInfos. */
    public S_McrGetUnjoinedWaitingInfos?: (IS_McrGetUnjoinedWaitingInfos|null);

    /** MessageContainer C_McrJoinWar. */
    public C_McrJoinWar?: (IC_McrJoinWar|null);

    /** MessageContainer S_McrJoinWar. */
    public S_McrJoinWar?: (IS_McrJoinWar|null);

    /** MessageContainer C_McrGetJoinedOngoingInfos. */
    public C_McrGetJoinedOngoingInfos?: (IC_McrGetJoinedOngoingInfos|null);

    /** MessageContainer S_McrGetJoinedOngoingInfos. */
    public S_McrGetJoinedOngoingInfos?: (IS_McrGetJoinedOngoingInfos|null);

    /** MessageContainer C_McrContinueWar. */
    public C_McrContinueWar?: (IC_McrContinueWar|null);

    /** MessageContainer S_McrContinueWar. */
    public S_McrContinueWar?: (IS_McrContinueWar|null);

    /** MessageContainer C_McrGetReplayInfos. */
    public C_McrGetReplayInfos?: (IC_McrGetReplayInfos|null);

    /** MessageContainer S_McrGetReplayInfos. */
    public S_McrGetReplayInfos?: (IS_McrGetReplayInfos|null);

    /** MessageContainer C_McrGetReplayData. */
    public C_McrGetReplayData?: (IC_McrGetReplayData|null);

    /** MessageContainer S_McrGetReplayData. */
    public S_McrGetReplayData?: (IS_McrGetReplayData|null);

    /** MessageContainer C_McwPlayerBeginTurn. */
    public C_McwPlayerBeginTurn?: (IC_McwPlayerBeginTurn|null);

    /** MessageContainer S_McwPlayerBeginTurn. */
    public S_McwPlayerBeginTurn?: (IS_McwPlayerBeginTurn|null);

    /** MessageContainer C_McwPlayerEndTurn. */
    public C_McwPlayerEndTurn?: (IC_McwPlayerEndTurn|null);

    /** MessageContainer S_McwPlayerEndTurn. */
    public S_McwPlayerEndTurn?: (IS_McwPlayerEndTurn|null);

    /** MessageContainer C_McwPlayerSurrender. */
    public C_McwPlayerSurrender?: (IC_McwPlayerSurrender|null);

    /** MessageContainer S_McwPlayerSurrender. */
    public S_McwPlayerSurrender?: (IS_McwPlayerSurrender|null);

    /** MessageContainer C_McwPlayerProduceUnit. */
    public C_McwPlayerProduceUnit?: (IC_McwPlayerProduceUnit|null);

    /** MessageContainer S_McwPlayerProduceUnit. */
    public S_McwPlayerProduceUnit?: (IS_McwPlayerProduceUnit|null);

    /** MessageContainer C_McwPlayerDeleteUnit. */
    public C_McwPlayerDeleteUnit?: (IC_McwPlayerDeleteUnit|null);

    /** MessageContainer S_McwPlayerDeleteUnit. */
    public S_McwPlayerDeleteUnit?: (IS_McwPlayerDeleteUnit|null);

    /** MessageContainer C_McwPlayerVoteForDraw. */
    public C_McwPlayerVoteForDraw?: (IC_McwPlayerVoteForDraw|null);

    /** MessageContainer S_McwPlayerVoteForDraw. */
    public S_McwPlayerVoteForDraw?: (IS_McwPlayerVoteForDraw|null);

    /** MessageContainer C_McwPlayerSyncWar. */
    public C_McwPlayerSyncWar?: (IC_McwPlayerSyncWar|null);

    /** MessageContainer S_McwPlayerSyncWar. */
    public S_McwPlayerSyncWar?: (IS_McwPlayerSyncWar|null);

    /** MessageContainer C_McwUnitWait. */
    public C_McwUnitWait?: (IC_McwUnitWait|null);

    /** MessageContainer S_McwUnitWait. */
    public S_McwUnitWait?: (IS_McwUnitWait|null);

    /** MessageContainer C_McwUnitBeLoaded. */
    public C_McwUnitBeLoaded?: (IC_McwUnitBeLoaded|null);

    /** MessageContainer S_McwUnitBeLoaded. */
    public S_McwUnitBeLoaded?: (IS_McwUnitBeLoaded|null);

    /** MessageContainer C_McwUnitCaptureTile. */
    public C_McwUnitCaptureTile?: (IC_McwUnitCaptureTile|null);

    /** MessageContainer S_McwUnitCaptureTile. */
    public S_McwUnitCaptureTile?: (IS_McwUnitCaptureTile|null);

    /** MessageContainer C_McwUnitAttack. */
    public C_McwUnitAttack?: (IC_McwUnitAttack|null);

    /** MessageContainer S_McwUnitAttack. */
    public S_McwUnitAttack?: (IS_McwUnitAttack|null);

    /** MessageContainer C_McwUnitDrop. */
    public C_McwUnitDrop?: (IC_McwUnitDrop|null);

    /** MessageContainer S_McwUnitDrop. */
    public S_McwUnitDrop?: (IS_McwUnitDrop|null);

    /** MessageContainer C_McwUnitBuildTile. */
    public C_McwUnitBuildTile?: (IC_McwUnitBuildTile|null);

    /** MessageContainer S_McwUnitBuildTile. */
    public S_McwUnitBuildTile?: (IS_McwUnitBuildTile|null);

    /** MessageContainer C_McwUnitDive. */
    public C_McwUnitDive?: (IC_McwUnitDive|null);

    /** MessageContainer S_McwUnitDive. */
    public S_McwUnitDive?: (IS_McwUnitDive|null);

    /** MessageContainer C_McwUnitSurface. */
    public C_McwUnitSurface?: (IC_McwUnitSurface|null);

    /** MessageContainer S_McwUnitSurface. */
    public S_McwUnitSurface?: (IS_McwUnitSurface|null);

    /** MessageContainer C_McwUnitJoin. */
    public C_McwUnitJoin?: (IC_McwUnitJoin|null);

    /** MessageContainer S_McwUnitJoin. */
    public S_McwUnitJoin?: (IS_McwUnitJoin|null);

    /** MessageContainer C_McwUnitLaunchFlare. */
    public C_McwUnitLaunchFlare?: (IC_McwUnitLaunchFlare|null);

    /** MessageContainer S_McwUnitLaunchFlare. */
    public S_McwUnitLaunchFlare?: (IS_McwUnitLaunchFlare|null);

    /** MessageContainer C_McwUnitLaunchSilo. */
    public C_McwUnitLaunchSilo?: (IC_McwUnitLaunchSilo|null);

    /** MessageContainer S_McwUnitLaunchSilo. */
    public S_McwUnitLaunchSilo?: (IS_McwUnitLaunchSilo|null);

    /** MessageContainer C_McwUnitProduceUnit. */
    public C_McwUnitProduceUnit?: (IC_McwUnitProduceUnit|null);

    /** MessageContainer S_McwUnitProduceUnit. */
    public S_McwUnitProduceUnit?: (IS_McwUnitProduceUnit|null);

    /** MessageContainer C_McwUnitSupply. */
    public C_McwUnitSupply?: (IC_McwUnitSupply|null);

    /** MessageContainer S_McwUnitSupply. */
    public S_McwUnitSupply?: (IS_McwUnitSupply|null);

    /** MessageContainer C_McwUnitLoadCo. */
    public C_McwUnitLoadCo?: (IC_McwUnitLoadCo|null);

    /** MessageContainer S_McwUnitLoadCo. */
    public S_McwUnitLoadCo?: (IS_McwUnitLoadCo|null);

    /** MessageContainer C_McwUnitUseCoSkill. */
    public C_McwUnitUseCoSkill?: (IC_McwUnitUseCoSkill|null);

    /** MessageContainer S_McwUnitUseCoSkill. */
    public S_McwUnitUseCoSkill?: (IS_McwUnitUseCoSkill|null);

    /**
     * Creates a new MessageContainer instance using the specified properties.
     * @param [properties] Properties to set
     * @returns MessageContainer instance
     */
    public static create(properties?: IMessageContainer): MessageContainer;

    /**
     * Encodes the specified MessageContainer message. Does not implicitly {@link MessageContainer.verify|verify} messages.
     * @param message MessageContainer message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IMessageContainer, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified MessageContainer message, length delimited. Does not implicitly {@link MessageContainer.verify|verify} messages.
     * @param message MessageContainer message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IMessageContainer, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a MessageContainer message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns MessageContainer
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): MessageContainer;

    /**
     * Decodes a MessageContainer message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns MessageContainer
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): MessageContainer;

    /**
     * Verifies a MessageContainer message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a MessageContainer message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns MessageContainer
     */
    public static fromObject(object: { [k: string]: any }): MessageContainer;

    /**
     * Creates a plain object from a MessageContainer message. Also converts values to other types if specified.
     * @param message MessageContainer
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: MessageContainer, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this MessageContainer to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_Heartbeat. */
export declare interface IC_Heartbeat {

    /** C_Heartbeat counter */
    counter?: (number|null);
}

/** Represents a C_Heartbeat. */
export declare class C_Heartbeat implements IC_Heartbeat {

    /**
     * Constructs a new C_Heartbeat.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_Heartbeat);

    /** C_Heartbeat counter. */
    public counter: number;

    /**
     * Creates a new C_Heartbeat instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_Heartbeat instance
     */
    public static create(properties?: IC_Heartbeat): C_Heartbeat;

    /**
     * Encodes the specified C_Heartbeat message. Does not implicitly {@link C_Heartbeat.verify|verify} messages.
     * @param message C_Heartbeat message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_Heartbeat, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_Heartbeat message, length delimited. Does not implicitly {@link C_Heartbeat.verify|verify} messages.
     * @param message C_Heartbeat message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_Heartbeat, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_Heartbeat message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_Heartbeat
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_Heartbeat;

    /**
     * Decodes a C_Heartbeat message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_Heartbeat
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_Heartbeat;

    /**
     * Verifies a C_Heartbeat message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_Heartbeat message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_Heartbeat
     */
    public static fromObject(object: { [k: string]: any }): C_Heartbeat;

    /**
     * Creates a plain object from a C_Heartbeat message. Also converts values to other types if specified.
     * @param message C_Heartbeat
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_Heartbeat, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_Heartbeat to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_Heartbeat. */
export declare interface IS_Heartbeat {

    /** S_Heartbeat errorCode */
    errorCode?: (number|null);

    /** S_Heartbeat counter */
    counter?: (number|null);

    /** S_Heartbeat timestamp */
    timestamp?: (number|null);
}

/** Represents a S_Heartbeat. */
export declare class S_Heartbeat implements IS_Heartbeat {

    /**
     * Constructs a new S_Heartbeat.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_Heartbeat);

    /** S_Heartbeat errorCode. */
    public errorCode: number;

    /** S_Heartbeat counter. */
    public counter: number;

    /** S_Heartbeat timestamp. */
    public timestamp: number;

    /**
     * Creates a new S_Heartbeat instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_Heartbeat instance
     */
    public static create(properties?: IS_Heartbeat): S_Heartbeat;

    /**
     * Encodes the specified S_Heartbeat message. Does not implicitly {@link S_Heartbeat.verify|verify} messages.
     * @param message S_Heartbeat message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_Heartbeat, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_Heartbeat message, length delimited. Does not implicitly {@link S_Heartbeat.verify|verify} messages.
     * @param message S_Heartbeat message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_Heartbeat, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_Heartbeat message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_Heartbeat
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_Heartbeat;

    /**
     * Decodes a S_Heartbeat message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_Heartbeat
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_Heartbeat;

    /**
     * Verifies a S_Heartbeat message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_Heartbeat message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_Heartbeat
     */
    public static fromObject(object: { [k: string]: any }): S_Heartbeat;

    /**
     * Creates a plain object from a S_Heartbeat message. Also converts values to other types if specified.
     * @param message S_Heartbeat
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_Heartbeat, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_Heartbeat to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_Register. */
export declare interface IC_Register {

    /** C_Register account */
    account?: (string|null);

    /** C_Register password */
    password?: (string|null);

    /** C_Register nickname */
    nickname?: (string|null);
}

/** Represents a C_Register. */
export declare class C_Register implements IC_Register {

    /**
     * Constructs a new C_Register.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_Register);

    /** C_Register account. */
    public account: string;

    /** C_Register password. */
    public password: string;

    /** C_Register nickname. */
    public nickname: string;

    /**
     * Creates a new C_Register instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_Register instance
     */
    public static create(properties?: IC_Register): C_Register;

    /**
     * Encodes the specified C_Register message. Does not implicitly {@link C_Register.verify|verify} messages.
     * @param message C_Register message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_Register, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_Register message, length delimited. Does not implicitly {@link C_Register.verify|verify} messages.
     * @param message C_Register message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_Register, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_Register message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_Register
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_Register;

    /**
     * Decodes a C_Register message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_Register
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_Register;

    /**
     * Verifies a C_Register message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_Register message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_Register
     */
    public static fromObject(object: { [k: string]: any }): C_Register;

    /**
     * Creates a plain object from a C_Register message. Also converts values to other types if specified.
     * @param message C_Register
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_Register, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_Register to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_Register. */
export declare interface IS_Register {

    /** S_Register errorCode */
    errorCode?: (number|null);

    /** S_Register account */
    account?: (string|null);

    /** S_Register password */
    password?: (string|null);
}

/** Represents a S_Register. */
export declare class S_Register implements IS_Register {

    /**
     * Constructs a new S_Register.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_Register);

    /** S_Register errorCode. */
    public errorCode: number;

    /** S_Register account. */
    public account: string;

    /** S_Register password. */
    public password: string;

    /**
     * Creates a new S_Register instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_Register instance
     */
    public static create(properties?: IS_Register): S_Register;

    /**
     * Encodes the specified S_Register message. Does not implicitly {@link S_Register.verify|verify} messages.
     * @param message S_Register message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_Register, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_Register message, length delimited. Does not implicitly {@link S_Register.verify|verify} messages.
     * @param message S_Register message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_Register, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_Register message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_Register
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_Register;

    /**
     * Decodes a S_Register message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_Register
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_Register;

    /**
     * Verifies a S_Register message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_Register message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_Register
     */
    public static fromObject(object: { [k: string]: any }): S_Register;

    /**
     * Creates a plain object from a S_Register message. Also converts values to other types if specified.
     * @param message S_Register
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_Register, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_Register to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_Login. */
export declare interface IC_Login {

    /** C_Login account */
    account?: (string|null);

    /** C_Login password */
    password?: (string|null);

    /** C_Login isAutoRelogin */
    isAutoRelogin?: (boolean|null);
}

/** Represents a C_Login. */
export declare class C_Login implements IC_Login {

    /**
     * Constructs a new C_Login.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_Login);

    /** C_Login account. */
    public account: string;

    /** C_Login password. */
    public password: string;

    /** C_Login isAutoRelogin. */
    public isAutoRelogin: boolean;

    /**
     * Creates a new C_Login instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_Login instance
     */
    public static create(properties?: IC_Login): C_Login;

    /**
     * Encodes the specified C_Login message. Does not implicitly {@link C_Login.verify|verify} messages.
     * @param message C_Login message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_Login, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_Login message, length delimited. Does not implicitly {@link C_Login.verify|verify} messages.
     * @param message C_Login message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_Login, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_Login message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_Login
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_Login;

    /**
     * Decodes a C_Login message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_Login
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_Login;

    /**
     * Verifies a C_Login message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_Login message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_Login
     */
    public static fromObject(object: { [k: string]: any }): C_Login;

    /**
     * Creates a plain object from a C_Login message. Also converts values to other types if specified.
     * @param message C_Login
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_Login, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_Login to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_Login. */
export declare interface IS_Login {

    /** S_Login errorCode */
    errorCode?: (number|null);

    /** S_Login userId */
    userId?: (number|null);

    /** S_Login privilege */
    privilege?: (number|null);

    /** S_Login account */
    account?: (string|null);

    /** S_Login password */
    password?: (string|null);

    /** S_Login nickname */
    nickname?: (string|null);

    /** S_Login rank2pScore */
    rank2pScore?: (number|null);

    /** S_Login discordId */
    discordId?: (string|null);
}

/** Represents a S_Login. */
export declare class S_Login implements IS_Login {

    /**
     * Constructs a new S_Login.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_Login);

    /** S_Login errorCode. */
    public errorCode: number;

    /** S_Login userId. */
    public userId: number;

    /** S_Login privilege. */
    public privilege: number;

    /** S_Login account. */
    public account: string;

    /** S_Login password. */
    public password: string;

    /** S_Login nickname. */
    public nickname: string;

    /** S_Login rank2pScore. */
    public rank2pScore: number;

    /** S_Login discordId. */
    public discordId: string;

    /**
     * Creates a new S_Login instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_Login instance
     */
    public static create(properties?: IS_Login): S_Login;

    /**
     * Encodes the specified S_Login message. Does not implicitly {@link S_Login.verify|verify} messages.
     * @param message S_Login message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_Login, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_Login message, length delimited. Does not implicitly {@link S_Login.verify|verify} messages.
     * @param message S_Login message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_Login, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_Login message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_Login
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_Login;

    /**
     * Decodes a S_Login message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_Login
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_Login;

    /**
     * Verifies a S_Login message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_Login message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_Login
     */
    public static fromObject(object: { [k: string]: any }): S_Login;

    /**
     * Creates a plain object from a S_Login message. Also converts values to other types if specified.
     * @param message S_Login
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_Login, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_Login to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_Logout. */
export declare interface IC_Logout {
}

/** Represents a C_Logout. */
export declare class C_Logout implements IC_Logout {

    /**
     * Constructs a new C_Logout.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_Logout);

    /**
     * Creates a new C_Logout instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_Logout instance
     */
    public static create(properties?: IC_Logout): C_Logout;

    /**
     * Encodes the specified C_Logout message. Does not implicitly {@link C_Logout.verify|verify} messages.
     * @param message C_Logout message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_Logout, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_Logout message, length delimited. Does not implicitly {@link C_Logout.verify|verify} messages.
     * @param message C_Logout message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_Logout, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_Logout message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_Logout
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_Logout;

    /**
     * Decodes a C_Logout message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_Logout
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_Logout;

    /**
     * Verifies a C_Logout message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_Logout message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_Logout
     */
    public static fromObject(object: { [k: string]: any }): C_Logout;

    /**
     * Creates a plain object from a C_Logout message. Also converts values to other types if specified.
     * @param message C_Logout
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_Logout, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_Logout to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_Logout. */
export declare interface IS_Logout {

    /** S_Logout errorCode */
    errorCode?: (number|null);

    /** S_Logout reason */
    reason?: (number|null);
}

/** Represents a S_Logout. */
export declare class S_Logout implements IS_Logout {

    /**
     * Constructs a new S_Logout.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_Logout);

    /** S_Logout errorCode. */
    public errorCode: number;

    /** S_Logout reason. */
    public reason: number;

    /**
     * Creates a new S_Logout instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_Logout instance
     */
    public static create(properties?: IS_Logout): S_Logout;

    /**
     * Encodes the specified S_Logout message. Does not implicitly {@link S_Logout.verify|verify} messages.
     * @param message S_Logout message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_Logout, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_Logout message, length delimited. Does not implicitly {@link S_Logout.verify|verify} messages.
     * @param message S_Logout message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_Logout, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_Logout message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_Logout
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_Logout;

    /**
     * Decodes a S_Logout message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_Logout
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_Logout;

    /**
     * Verifies a S_Logout message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_Logout message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_Logout
     */
    public static fromObject(object: { [k: string]: any }): S_Logout;

    /**
     * Creates a plain object from a S_Logout message. Also converts values to other types if specified.
     * @param message S_Logout
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_Logout, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_Logout to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_Error. */
export declare interface IS_Error {

    /** S_Error errorCode */
    errorCode?: (number|null);
}

/** Represents a S_Error. */
export declare class S_Error implements IS_Error {

    /**
     * Constructs a new S_Error.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_Error);

    /** S_Error errorCode. */
    public errorCode: number;

    /**
     * Creates a new S_Error instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_Error instance
     */
    public static create(properties?: IS_Error): S_Error;

    /**
     * Encodes the specified S_Error message. Does not implicitly {@link S_Error.verify|verify} messages.
     * @param message S_Error message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_Error, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_Error message, length delimited. Does not implicitly {@link S_Error.verify|verify} messages.
     * @param message S_Error message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_Error, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_Error message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_Error
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_Error;

    /**
     * Decodes a S_Error message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_Error
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_Error;

    /**
     * Verifies a S_Error message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_Error message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_Error
     */
    public static fromObject(object: { [k: string]: any }): S_Error;

    /**
     * Creates a plain object from a S_Error message. Also converts values to other types if specified.
     * @param message S_Error
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_Error, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_Error to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_GetMapMetaDataList. */
export declare interface IC_GetMapMetaDataList {
}

/** Represents a C_GetMapMetaDataList. */
export declare class C_GetMapMetaDataList implements IC_GetMapMetaDataList {

    /**
     * Constructs a new C_GetMapMetaDataList.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_GetMapMetaDataList);

    /**
     * Creates a new C_GetMapMetaDataList instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_GetMapMetaDataList instance
     */
    public static create(properties?: IC_GetMapMetaDataList): C_GetMapMetaDataList;

    /**
     * Encodes the specified C_GetMapMetaDataList message. Does not implicitly {@link C_GetMapMetaDataList.verify|verify} messages.
     * @param message C_GetMapMetaDataList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_GetMapMetaDataList, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_GetMapMetaDataList message, length delimited. Does not implicitly {@link C_GetMapMetaDataList.verify|verify} messages.
     * @param message C_GetMapMetaDataList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_GetMapMetaDataList, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_GetMapMetaDataList message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_GetMapMetaDataList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_GetMapMetaDataList;

    /**
     * Decodes a C_GetMapMetaDataList message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_GetMapMetaDataList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_GetMapMetaDataList;

    /**
     * Verifies a C_GetMapMetaDataList message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_GetMapMetaDataList message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_GetMapMetaDataList
     */
    public static fromObject(object: { [k: string]: any }): C_GetMapMetaDataList;

    /**
     * Creates a plain object from a C_GetMapMetaDataList message. Also converts values to other types if specified.
     * @param message C_GetMapMetaDataList
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_GetMapMetaDataList, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_GetMapMetaDataList to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_GetMapMetaDataList. */
export declare interface IS_GetMapMetaDataList {

    /** S_GetMapMetaDataList errorCode */
    errorCode?: (number|null);

    /** S_GetMapMetaDataList dataList */
    dataList?: (IMapMetaData[]|null);
}

/** Represents a S_GetMapMetaDataList. */
export declare class S_GetMapMetaDataList implements IS_GetMapMetaDataList {

    /**
     * Constructs a new S_GetMapMetaDataList.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_GetMapMetaDataList);

    /** S_GetMapMetaDataList errorCode. */
    public errorCode: number;

    /** S_GetMapMetaDataList dataList. */
    public dataList: IMapMetaData[];

    /**
     * Creates a new S_GetMapMetaDataList instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_GetMapMetaDataList instance
     */
    public static create(properties?: IS_GetMapMetaDataList): S_GetMapMetaDataList;

    /**
     * Encodes the specified S_GetMapMetaDataList message. Does not implicitly {@link S_GetMapMetaDataList.verify|verify} messages.
     * @param message S_GetMapMetaDataList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_GetMapMetaDataList, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_GetMapMetaDataList message, length delimited. Does not implicitly {@link S_GetMapMetaDataList.verify|verify} messages.
     * @param message S_GetMapMetaDataList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_GetMapMetaDataList, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_GetMapMetaDataList message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_GetMapMetaDataList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_GetMapMetaDataList;

    /**
     * Decodes a S_GetMapMetaDataList message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_GetMapMetaDataList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_GetMapMetaDataList;

    /**
     * Verifies a S_GetMapMetaDataList message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_GetMapMetaDataList message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_GetMapMetaDataList
     */
    public static fromObject(object: { [k: string]: any }): S_GetMapMetaDataList;

    /**
     * Creates a plain object from a S_GetMapMetaDataList message. Also converts values to other types if specified.
     * @param message S_GetMapMetaDataList
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_GetMapMetaDataList, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_GetMapMetaDataList to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_GetMapRawData. */
export declare interface IC_GetMapRawData {

    /** C_GetMapRawData mapFileName */
    mapFileName?: (string|null);
}

/** Represents a C_GetMapRawData. */
export declare class C_GetMapRawData implements IC_GetMapRawData {

    /**
     * Constructs a new C_GetMapRawData.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_GetMapRawData);

    /** C_GetMapRawData mapFileName. */
    public mapFileName: string;

    /**
     * Creates a new C_GetMapRawData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_GetMapRawData instance
     */
    public static create(properties?: IC_GetMapRawData): C_GetMapRawData;

    /**
     * Encodes the specified C_GetMapRawData message. Does not implicitly {@link C_GetMapRawData.verify|verify} messages.
     * @param message C_GetMapRawData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_GetMapRawData, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_GetMapRawData message, length delimited. Does not implicitly {@link C_GetMapRawData.verify|verify} messages.
     * @param message C_GetMapRawData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_GetMapRawData, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_GetMapRawData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_GetMapRawData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_GetMapRawData;

    /**
     * Decodes a C_GetMapRawData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_GetMapRawData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_GetMapRawData;

    /**
     * Verifies a C_GetMapRawData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_GetMapRawData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_GetMapRawData
     */
    public static fromObject(object: { [k: string]: any }): C_GetMapRawData;

    /**
     * Creates a plain object from a C_GetMapRawData message. Also converts values to other types if specified.
     * @param message C_GetMapRawData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_GetMapRawData, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_GetMapRawData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_GetMapRawData. */
export declare interface IS_GetMapRawData {

    /** S_GetMapRawData errorCode */
    errorCode?: (number|null);

    /** S_GetMapRawData mapFileName */
    mapFileName?: (string|null);

    /** S_GetMapRawData mapRawData */
    mapRawData?: (IMapRawData|null);
}

/** Represents a S_GetMapRawData. */
export declare class S_GetMapRawData implements IS_GetMapRawData {

    /**
     * Constructs a new S_GetMapRawData.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_GetMapRawData);

    /** S_GetMapRawData errorCode. */
    public errorCode: number;

    /** S_GetMapRawData mapFileName. */
    public mapFileName: string;

    /** S_GetMapRawData mapRawData. */
    public mapRawData?: (IMapRawData|null);

    /**
     * Creates a new S_GetMapRawData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_GetMapRawData instance
     */
    public static create(properties?: IS_GetMapRawData): S_GetMapRawData;

    /**
     * Encodes the specified S_GetMapRawData message. Does not implicitly {@link S_GetMapRawData.verify|verify} messages.
     * @param message S_GetMapRawData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_GetMapRawData, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_GetMapRawData message, length delimited. Does not implicitly {@link S_GetMapRawData.verify|verify} messages.
     * @param message S_GetMapRawData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_GetMapRawData, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_GetMapRawData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_GetMapRawData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_GetMapRawData;

    /**
     * Decodes a S_GetMapRawData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_GetMapRawData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_GetMapRawData;

    /**
     * Verifies a S_GetMapRawData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_GetMapRawData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_GetMapRawData
     */
    public static fromObject(object: { [k: string]: any }): S_GetMapRawData;

    /**
     * Creates a plain object from a S_GetMapRawData message. Also converts values to other types if specified.
     * @param message S_GetMapRawData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_GetMapRawData, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_GetMapRawData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_NewestConfigVersion. */
export declare interface IS_NewestConfigVersion {

    /** S_NewestConfigVersion version */
    version?: (string|null);
}

/** Represents a S_NewestConfigVersion. */
export declare class S_NewestConfigVersion implements IS_NewestConfigVersion {

    /**
     * Constructs a new S_NewestConfigVersion.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_NewestConfigVersion);

    /** S_NewestConfigVersion version. */
    public version: string;

    /**
     * Creates a new S_NewestConfigVersion instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_NewestConfigVersion instance
     */
    public static create(properties?: IS_NewestConfigVersion): S_NewestConfigVersion;

    /**
     * Encodes the specified S_NewestConfigVersion message. Does not implicitly {@link S_NewestConfigVersion.verify|verify} messages.
     * @param message S_NewestConfigVersion message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_NewestConfigVersion, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_NewestConfigVersion message, length delimited. Does not implicitly {@link S_NewestConfigVersion.verify|verify} messages.
     * @param message S_NewestConfigVersion message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_NewestConfigVersion, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_NewestConfigVersion message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_NewestConfigVersion
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_NewestConfigVersion;

    /**
     * Decodes a S_NewestConfigVersion message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_NewestConfigVersion
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_NewestConfigVersion;

    /**
     * Verifies a S_NewestConfigVersion message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_NewestConfigVersion message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_NewestConfigVersion
     */
    public static fromObject(object: { [k: string]: any }): S_NewestConfigVersion;

    /**
     * Creates a plain object from a S_NewestConfigVersion message. Also converts values to other types if specified.
     * @param message S_NewestConfigVersion
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_NewestConfigVersion, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_NewestConfigVersion to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_GetMapStatisticsDataList. */
export declare interface IC_GetMapStatisticsDataList {
}

/** Represents a C_GetMapStatisticsDataList. */
export declare class C_GetMapStatisticsDataList implements IC_GetMapStatisticsDataList {

    /**
     * Constructs a new C_GetMapStatisticsDataList.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_GetMapStatisticsDataList);

    /**
     * Creates a new C_GetMapStatisticsDataList instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_GetMapStatisticsDataList instance
     */
    public static create(properties?: IC_GetMapStatisticsDataList): C_GetMapStatisticsDataList;

    /**
     * Encodes the specified C_GetMapStatisticsDataList message. Does not implicitly {@link C_GetMapStatisticsDataList.verify|verify} messages.
     * @param message C_GetMapStatisticsDataList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_GetMapStatisticsDataList, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_GetMapStatisticsDataList message, length delimited. Does not implicitly {@link C_GetMapStatisticsDataList.verify|verify} messages.
     * @param message C_GetMapStatisticsDataList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_GetMapStatisticsDataList, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_GetMapStatisticsDataList message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_GetMapStatisticsDataList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_GetMapStatisticsDataList;

    /**
     * Decodes a C_GetMapStatisticsDataList message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_GetMapStatisticsDataList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_GetMapStatisticsDataList;

    /**
     * Verifies a C_GetMapStatisticsDataList message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_GetMapStatisticsDataList message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_GetMapStatisticsDataList
     */
    public static fromObject(object: { [k: string]: any }): C_GetMapStatisticsDataList;

    /**
     * Creates a plain object from a C_GetMapStatisticsDataList message. Also converts values to other types if specified.
     * @param message C_GetMapStatisticsDataList
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_GetMapStatisticsDataList, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_GetMapStatisticsDataList to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_GetMapStatisticsDataList. */
export declare interface IS_GetMapStatisticsDataList {

    /** S_GetMapStatisticsDataList errorCode */
    errorCode?: (number|null);

    /** S_GetMapStatisticsDataList dataList */
    dataList?: (IMapStatisticsData[]|null);
}

/** Represents a S_GetMapStatisticsDataList. */
export declare class S_GetMapStatisticsDataList implements IS_GetMapStatisticsDataList {

    /**
     * Constructs a new S_GetMapStatisticsDataList.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_GetMapStatisticsDataList);

    /** S_GetMapStatisticsDataList errorCode. */
    public errorCode: number;

    /** S_GetMapStatisticsDataList dataList. */
    public dataList: IMapStatisticsData[];

    /**
     * Creates a new S_GetMapStatisticsDataList instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_GetMapStatisticsDataList instance
     */
    public static create(properties?: IS_GetMapStatisticsDataList): S_GetMapStatisticsDataList;

    /**
     * Encodes the specified S_GetMapStatisticsDataList message. Does not implicitly {@link S_GetMapStatisticsDataList.verify|verify} messages.
     * @param message S_GetMapStatisticsDataList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_GetMapStatisticsDataList, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_GetMapStatisticsDataList message, length delimited. Does not implicitly {@link S_GetMapStatisticsDataList.verify|verify} messages.
     * @param message S_GetMapStatisticsDataList message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_GetMapStatisticsDataList, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_GetMapStatisticsDataList message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_GetMapStatisticsDataList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_GetMapStatisticsDataList;

    /**
     * Decodes a S_GetMapStatisticsDataList message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_GetMapStatisticsDataList
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_GetMapStatisticsDataList;

    /**
     * Verifies a S_GetMapStatisticsDataList message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_GetMapStatisticsDataList message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_GetMapStatisticsDataList
     */
    public static fromObject(object: { [k: string]: any }): S_GetMapStatisticsDataList;

    /**
     * Creates a plain object from a S_GetMapStatisticsDataList message. Also converts values to other types if specified.
     * @param message S_GetMapStatisticsDataList
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_GetMapStatisticsDataList, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_GetMapStatisticsDataList to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_MmChangeAvailability. */
export declare interface IC_MmChangeAvailability {

    /** C_MmChangeAvailability mapFileName */
    mapFileName?: (string|null);

    /** C_MmChangeAvailability isEnabledForMultiCustomWar */
    isEnabledForMultiCustomWar?: (boolean|null);

    /** C_MmChangeAvailability isEnabledForWarRoom */
    isEnabledForWarRoom?: (boolean|null);
}

/** Represents a C_MmChangeAvailability. */
export declare class C_MmChangeAvailability implements IC_MmChangeAvailability {

    /**
     * Constructs a new C_MmChangeAvailability.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_MmChangeAvailability);

    /** C_MmChangeAvailability mapFileName. */
    public mapFileName: string;

    /** C_MmChangeAvailability isEnabledForMultiCustomWar. */
    public isEnabledForMultiCustomWar: boolean;

    /** C_MmChangeAvailability isEnabledForWarRoom. */
    public isEnabledForWarRoom: boolean;

    /**
     * Creates a new C_MmChangeAvailability instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_MmChangeAvailability instance
     */
    public static create(properties?: IC_MmChangeAvailability): C_MmChangeAvailability;

    /**
     * Encodes the specified C_MmChangeAvailability message. Does not implicitly {@link C_MmChangeAvailability.verify|verify} messages.
     * @param message C_MmChangeAvailability message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_MmChangeAvailability, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_MmChangeAvailability message, length delimited. Does not implicitly {@link C_MmChangeAvailability.verify|verify} messages.
     * @param message C_MmChangeAvailability message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_MmChangeAvailability, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_MmChangeAvailability message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_MmChangeAvailability
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_MmChangeAvailability;

    /**
     * Decodes a C_MmChangeAvailability message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_MmChangeAvailability
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_MmChangeAvailability;

    /**
     * Verifies a C_MmChangeAvailability message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_MmChangeAvailability message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_MmChangeAvailability
     */
    public static fromObject(object: { [k: string]: any }): C_MmChangeAvailability;

    /**
     * Creates a plain object from a C_MmChangeAvailability message. Also converts values to other types if specified.
     * @param message C_MmChangeAvailability
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_MmChangeAvailability, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_MmChangeAvailability to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_MmChangeAvailability. */
export declare interface IS_MmChangeAvailability {

    /** S_MmChangeAvailability errorCode */
    errorCode?: (number|null);

    /** S_MmChangeAvailability mapFileName */
    mapFileName?: (string|null);

    /** S_MmChangeAvailability isEnabledForMultiCustomWar */
    isEnabledForMultiCustomWar?: (boolean|null);

    /** S_MmChangeAvailability isEnabledForWarRoom */
    isEnabledForWarRoom?: (boolean|null);
}

/** Represents a S_MmChangeAvailability. */
export declare class S_MmChangeAvailability implements IS_MmChangeAvailability {

    /**
     * Constructs a new S_MmChangeAvailability.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_MmChangeAvailability);

    /** S_MmChangeAvailability errorCode. */
    public errorCode: number;

    /** S_MmChangeAvailability mapFileName. */
    public mapFileName: string;

    /** S_MmChangeAvailability isEnabledForMultiCustomWar. */
    public isEnabledForMultiCustomWar: boolean;

    /** S_MmChangeAvailability isEnabledForWarRoom. */
    public isEnabledForWarRoom: boolean;

    /**
     * Creates a new S_MmChangeAvailability instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_MmChangeAvailability instance
     */
    public static create(properties?: IS_MmChangeAvailability): S_MmChangeAvailability;

    /**
     * Encodes the specified S_MmChangeAvailability message. Does not implicitly {@link S_MmChangeAvailability.verify|verify} messages.
     * @param message S_MmChangeAvailability message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_MmChangeAvailability, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_MmChangeAvailability message, length delimited. Does not implicitly {@link S_MmChangeAvailability.verify|verify} messages.
     * @param message S_MmChangeAvailability message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_MmChangeAvailability, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_MmChangeAvailability message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_MmChangeAvailability
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_MmChangeAvailability;

    /**
     * Decodes a S_MmChangeAvailability message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_MmChangeAvailability
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_MmChangeAvailability;

    /**
     * Verifies a S_MmChangeAvailability message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_MmChangeAvailability message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_MmChangeAvailability
     */
    public static fromObject(object: { [k: string]: any }): S_MmChangeAvailability;

    /**
     * Creates a plain object from a S_MmChangeAvailability message. Also converts values to other types if specified.
     * @param message S_MmChangeAvailability
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_MmChangeAvailability, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_MmChangeAvailability to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_ServerDisconnect. */
export declare interface IS_ServerDisconnect {

    /** S_ServerDisconnect errorCode */
    errorCode?: (number|null);
}

/** Represents a S_ServerDisconnect. */
export declare class S_ServerDisconnect implements IS_ServerDisconnect {

    /**
     * Constructs a new S_ServerDisconnect.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_ServerDisconnect);

    /** S_ServerDisconnect errorCode. */
    public errorCode: number;

    /**
     * Creates a new S_ServerDisconnect instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_ServerDisconnect instance
     */
    public static create(properties?: IS_ServerDisconnect): S_ServerDisconnect;

    /**
     * Encodes the specified S_ServerDisconnect message. Does not implicitly {@link S_ServerDisconnect.verify|verify} messages.
     * @param message S_ServerDisconnect message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_ServerDisconnect, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_ServerDisconnect message, length delimited. Does not implicitly {@link S_ServerDisconnect.verify|verify} messages.
     * @param message S_ServerDisconnect message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_ServerDisconnect, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_ServerDisconnect message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_ServerDisconnect
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_ServerDisconnect;

    /**
     * Decodes a S_ServerDisconnect message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_ServerDisconnect
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_ServerDisconnect;

    /**
     * Verifies a S_ServerDisconnect message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_ServerDisconnect message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_ServerDisconnect
     */
    public static fromObject(object: { [k: string]: any }): S_ServerDisconnect;

    /**
     * Creates a plain object from a S_ServerDisconnect message. Also converts values to other types if specified.
     * @param message S_ServerDisconnect
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_ServerDisconnect, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_ServerDisconnect to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_GetUserPublicInfo. */
export declare interface IC_GetUserPublicInfo {

    /** C_GetUserPublicInfo userId */
    userId?: (number|null);
}

/** Represents a C_GetUserPublicInfo. */
export declare class C_GetUserPublicInfo implements IC_GetUserPublicInfo {

    /**
     * Constructs a new C_GetUserPublicInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_GetUserPublicInfo);

    /** C_GetUserPublicInfo userId. */
    public userId: number;

    /**
     * Creates a new C_GetUserPublicInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_GetUserPublicInfo instance
     */
    public static create(properties?: IC_GetUserPublicInfo): C_GetUserPublicInfo;

    /**
     * Encodes the specified C_GetUserPublicInfo message. Does not implicitly {@link C_GetUserPublicInfo.verify|verify} messages.
     * @param message C_GetUserPublicInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_GetUserPublicInfo, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_GetUserPublicInfo message, length delimited. Does not implicitly {@link C_GetUserPublicInfo.verify|verify} messages.
     * @param message C_GetUserPublicInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_GetUserPublicInfo, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_GetUserPublicInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_GetUserPublicInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_GetUserPublicInfo;

    /**
     * Decodes a C_GetUserPublicInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_GetUserPublicInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_GetUserPublicInfo;

    /**
     * Verifies a C_GetUserPublicInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_GetUserPublicInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_GetUserPublicInfo
     */
    public static fromObject(object: { [k: string]: any }): C_GetUserPublicInfo;

    /**
     * Creates a plain object from a C_GetUserPublicInfo message. Also converts values to other types if specified.
     * @param message C_GetUserPublicInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_GetUserPublicInfo, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_GetUserPublicInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_GetUserPublicInfo. */
export declare interface IS_GetUserPublicInfo {

    /** S_GetUserPublicInfo errorCode */
    errorCode?: (number|null);

    /** S_GetUserPublicInfo id */
    id?: (number|null);

    /** S_GetUserPublicInfo nickname */
    nickname?: (string|null);

    /** S_GetUserPublicInfo registerTime */
    registerTime?: (number|null);

    /** S_GetUserPublicInfo lastLoginTime */
    lastLoginTime?: (number|null);

    /** S_GetUserPublicInfo loginCount */
    loginCount?: (number|null);

    /** S_GetUserPublicInfo onlineTime */
    onlineTime?: (number|null);

    /** S_GetUserPublicInfo discordId */
    discordId?: (string|null);

    /** S_GetUserPublicInfo mcw2pWins */
    mcw2pWins?: (number|null);

    /** S_GetUserPublicInfo mcw2pLoses */
    mcw2pLoses?: (number|null);

    /** S_GetUserPublicInfo mcw2pDraws */
    mcw2pDraws?: (number|null);

    /** S_GetUserPublicInfo mcw3pWins */
    mcw3pWins?: (number|null);

    /** S_GetUserPublicInfo mcw3pLoses */
    mcw3pLoses?: (number|null);

    /** S_GetUserPublicInfo mcw3pDraws */
    mcw3pDraws?: (number|null);

    /** S_GetUserPublicInfo mcw4pWins */
    mcw4pWins?: (number|null);

    /** S_GetUserPublicInfo mcw4pLoses */
    mcw4pLoses?: (number|null);

    /** S_GetUserPublicInfo mcw4pDraws */
    mcw4pDraws?: (number|null);

    /** S_GetUserPublicInfo rank2pWins */
    rank2pWins?: (number|null);

    /** S_GetUserPublicInfo rank2pLoses */
    rank2pLoses?: (number|null);

    /** S_GetUserPublicInfo rank2pDraws */
    rank2pDraws?: (number|null);

    /** S_GetUserPublicInfo rank2pScore */
    rank2pScore?: (number|null);
}

/** Represents a S_GetUserPublicInfo. */
export declare class S_GetUserPublicInfo implements IS_GetUserPublicInfo {

    /**
     * Constructs a new S_GetUserPublicInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_GetUserPublicInfo);

    /** S_GetUserPublicInfo errorCode. */
    public errorCode: number;

    /** S_GetUserPublicInfo id. */
    public id: number;

    /** S_GetUserPublicInfo nickname. */
    public nickname: string;

    /** S_GetUserPublicInfo registerTime. */
    public registerTime: number;

    /** S_GetUserPublicInfo lastLoginTime. */
    public lastLoginTime: number;

    /** S_GetUserPublicInfo loginCount. */
    public loginCount: number;

    /** S_GetUserPublicInfo onlineTime. */
    public onlineTime: number;

    /** S_GetUserPublicInfo discordId. */
    public discordId: string;

    /** S_GetUserPublicInfo mcw2pWins. */
    public mcw2pWins: number;

    /** S_GetUserPublicInfo mcw2pLoses. */
    public mcw2pLoses: number;

    /** S_GetUserPublicInfo mcw2pDraws. */
    public mcw2pDraws: number;

    /** S_GetUserPublicInfo mcw3pWins. */
    public mcw3pWins: number;

    /** S_GetUserPublicInfo mcw3pLoses. */
    public mcw3pLoses: number;

    /** S_GetUserPublicInfo mcw3pDraws. */
    public mcw3pDraws: number;

    /** S_GetUserPublicInfo mcw4pWins. */
    public mcw4pWins: number;

    /** S_GetUserPublicInfo mcw4pLoses. */
    public mcw4pLoses: number;

    /** S_GetUserPublicInfo mcw4pDraws. */
    public mcw4pDraws: number;

    /** S_GetUserPublicInfo rank2pWins. */
    public rank2pWins: number;

    /** S_GetUserPublicInfo rank2pLoses. */
    public rank2pLoses: number;

    /** S_GetUserPublicInfo rank2pDraws. */
    public rank2pDraws: number;

    /** S_GetUserPublicInfo rank2pScore. */
    public rank2pScore: number;

    /**
     * Creates a new S_GetUserPublicInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_GetUserPublicInfo instance
     */
    public static create(properties?: IS_GetUserPublicInfo): S_GetUserPublicInfo;

    /**
     * Encodes the specified S_GetUserPublicInfo message. Does not implicitly {@link S_GetUserPublicInfo.verify|verify} messages.
     * @param message S_GetUserPublicInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_GetUserPublicInfo, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_GetUserPublicInfo message, length delimited. Does not implicitly {@link S_GetUserPublicInfo.verify|verify} messages.
     * @param message S_GetUserPublicInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_GetUserPublicInfo, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_GetUserPublicInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_GetUserPublicInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_GetUserPublicInfo;

    /**
     * Decodes a S_GetUserPublicInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_GetUserPublicInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_GetUserPublicInfo;

    /**
     * Verifies a S_GetUserPublicInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_GetUserPublicInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_GetUserPublicInfo
     */
    public static fromObject(object: { [k: string]: any }): S_GetUserPublicInfo;

    /**
     * Creates a plain object from a S_GetUserPublicInfo message. Also converts values to other types if specified.
     * @param message S_GetUserPublicInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_GetUserPublicInfo, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_GetUserPublicInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_UserChangeNickname. */
export declare interface IC_UserChangeNickname {

    /** C_UserChangeNickname nickname */
    nickname?: (string|null);
}

/** Represents a C_UserChangeNickname. */
export declare class C_UserChangeNickname implements IC_UserChangeNickname {

    /**
     * Constructs a new C_UserChangeNickname.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_UserChangeNickname);

    /** C_UserChangeNickname nickname. */
    public nickname: string;

    /**
     * Creates a new C_UserChangeNickname instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_UserChangeNickname instance
     */
    public static create(properties?: IC_UserChangeNickname): C_UserChangeNickname;

    /**
     * Encodes the specified C_UserChangeNickname message. Does not implicitly {@link C_UserChangeNickname.verify|verify} messages.
     * @param message C_UserChangeNickname message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_UserChangeNickname, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_UserChangeNickname message, length delimited. Does not implicitly {@link C_UserChangeNickname.verify|verify} messages.
     * @param message C_UserChangeNickname message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_UserChangeNickname, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_UserChangeNickname message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_UserChangeNickname
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_UserChangeNickname;

    /**
     * Decodes a C_UserChangeNickname message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_UserChangeNickname
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_UserChangeNickname;

    /**
     * Verifies a C_UserChangeNickname message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_UserChangeNickname message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_UserChangeNickname
     */
    public static fromObject(object: { [k: string]: any }): C_UserChangeNickname;

    /**
     * Creates a plain object from a C_UserChangeNickname message. Also converts values to other types if specified.
     * @param message C_UserChangeNickname
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_UserChangeNickname, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_UserChangeNickname to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_UserChangeNickname. */
export declare interface IS_UserChangeNickname {

    /** S_UserChangeNickname errorCode */
    errorCode?: (number|null);

    /** S_UserChangeNickname nickname */
    nickname?: (string|null);
}

/** Represents a S_UserChangeNickname. */
export declare class S_UserChangeNickname implements IS_UserChangeNickname {

    /**
     * Constructs a new S_UserChangeNickname.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_UserChangeNickname);

    /** S_UserChangeNickname errorCode. */
    public errorCode: number;

    /** S_UserChangeNickname nickname. */
    public nickname: string;

    /**
     * Creates a new S_UserChangeNickname instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_UserChangeNickname instance
     */
    public static create(properties?: IS_UserChangeNickname): S_UserChangeNickname;

    /**
     * Encodes the specified S_UserChangeNickname message. Does not implicitly {@link S_UserChangeNickname.verify|verify} messages.
     * @param message S_UserChangeNickname message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_UserChangeNickname, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_UserChangeNickname message, length delimited. Does not implicitly {@link S_UserChangeNickname.verify|verify} messages.
     * @param message S_UserChangeNickname message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_UserChangeNickname, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_UserChangeNickname message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_UserChangeNickname
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_UserChangeNickname;

    /**
     * Decodes a S_UserChangeNickname message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_UserChangeNickname
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_UserChangeNickname;

    /**
     * Verifies a S_UserChangeNickname message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_UserChangeNickname message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_UserChangeNickname
     */
    public static fromObject(object: { [k: string]: any }): S_UserChangeNickname;

    /**
     * Creates a plain object from a S_UserChangeNickname message. Also converts values to other types if specified.
     * @param message S_UserChangeNickname
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_UserChangeNickname, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_UserChangeNickname to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_UserChangeDiscordId. */
export declare interface IC_UserChangeDiscordId {

    /** C_UserChangeDiscordId discordId */
    discordId?: (string|null);
}

/** Represents a C_UserChangeDiscordId. */
export declare class C_UserChangeDiscordId implements IC_UserChangeDiscordId {

    /**
     * Constructs a new C_UserChangeDiscordId.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_UserChangeDiscordId);

    /** C_UserChangeDiscordId discordId. */
    public discordId: string;

    /**
     * Creates a new C_UserChangeDiscordId instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_UserChangeDiscordId instance
     */
    public static create(properties?: IC_UserChangeDiscordId): C_UserChangeDiscordId;

    /**
     * Encodes the specified C_UserChangeDiscordId message. Does not implicitly {@link C_UserChangeDiscordId.verify|verify} messages.
     * @param message C_UserChangeDiscordId message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_UserChangeDiscordId, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_UserChangeDiscordId message, length delimited. Does not implicitly {@link C_UserChangeDiscordId.verify|verify} messages.
     * @param message C_UserChangeDiscordId message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_UserChangeDiscordId, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_UserChangeDiscordId message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_UserChangeDiscordId
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_UserChangeDiscordId;

    /**
     * Decodes a C_UserChangeDiscordId message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_UserChangeDiscordId
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_UserChangeDiscordId;

    /**
     * Verifies a C_UserChangeDiscordId message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_UserChangeDiscordId message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_UserChangeDiscordId
     */
    public static fromObject(object: { [k: string]: any }): C_UserChangeDiscordId;

    /**
     * Creates a plain object from a C_UserChangeDiscordId message. Also converts values to other types if specified.
     * @param message C_UserChangeDiscordId
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_UserChangeDiscordId, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_UserChangeDiscordId to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_UserChangeDiscordId. */
export declare interface IS_UserChangeDiscordId {

    /** S_UserChangeDiscordId errorCode */
    errorCode?: (number|null);

    /** S_UserChangeDiscordId discordId */
    discordId?: (string|null);
}

/** Represents a S_UserChangeDiscordId. */
export declare class S_UserChangeDiscordId implements IS_UserChangeDiscordId {

    /**
     * Constructs a new S_UserChangeDiscordId.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_UserChangeDiscordId);

    /** S_UserChangeDiscordId errorCode. */
    public errorCode: number;

    /** S_UserChangeDiscordId discordId. */
    public discordId: string;

    /**
     * Creates a new S_UserChangeDiscordId instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_UserChangeDiscordId instance
     */
    public static create(properties?: IS_UserChangeDiscordId): S_UserChangeDiscordId;

    /**
     * Encodes the specified S_UserChangeDiscordId message. Does not implicitly {@link S_UserChangeDiscordId.verify|verify} messages.
     * @param message S_UserChangeDiscordId message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_UserChangeDiscordId, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_UserChangeDiscordId message, length delimited. Does not implicitly {@link S_UserChangeDiscordId.verify|verify} messages.
     * @param message S_UserChangeDiscordId message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_UserChangeDiscordId, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_UserChangeDiscordId message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_UserChangeDiscordId
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_UserChangeDiscordId;

    /**
     * Decodes a S_UserChangeDiscordId message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_UserChangeDiscordId
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_UserChangeDiscordId;

    /**
     * Verifies a S_UserChangeDiscordId message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_UserChangeDiscordId message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_UserChangeDiscordId
     */
    public static fromObject(object: { [k: string]: any }): S_UserChangeDiscordId;

    /**
     * Creates a plain object from a S_UserChangeDiscordId message. Also converts values to other types if specified.
     * @param message S_UserChangeDiscordId
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_UserChangeDiscordId, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_UserChangeDiscordId to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_UserGetOnlineUsers. */
export declare interface IC_UserGetOnlineUsers {
}

/** Represents a C_UserGetOnlineUsers. */
export declare class C_UserGetOnlineUsers implements IC_UserGetOnlineUsers {

    /**
     * Constructs a new C_UserGetOnlineUsers.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_UserGetOnlineUsers);

    /**
     * Creates a new C_UserGetOnlineUsers instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_UserGetOnlineUsers instance
     */
    public static create(properties?: IC_UserGetOnlineUsers): C_UserGetOnlineUsers;

    /**
     * Encodes the specified C_UserGetOnlineUsers message. Does not implicitly {@link C_UserGetOnlineUsers.verify|verify} messages.
     * @param message C_UserGetOnlineUsers message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_UserGetOnlineUsers, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_UserGetOnlineUsers message, length delimited. Does not implicitly {@link C_UserGetOnlineUsers.verify|verify} messages.
     * @param message C_UserGetOnlineUsers message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_UserGetOnlineUsers, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_UserGetOnlineUsers message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_UserGetOnlineUsers
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_UserGetOnlineUsers;

    /**
     * Decodes a C_UserGetOnlineUsers message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_UserGetOnlineUsers
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_UserGetOnlineUsers;

    /**
     * Verifies a C_UserGetOnlineUsers message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_UserGetOnlineUsers message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_UserGetOnlineUsers
     */
    public static fromObject(object: { [k: string]: any }): C_UserGetOnlineUsers;

    /**
     * Creates a plain object from a C_UserGetOnlineUsers message. Also converts values to other types if specified.
     * @param message C_UserGetOnlineUsers
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_UserGetOnlineUsers, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_UserGetOnlineUsers to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_UserGetOnlineUsers. */
export declare interface IS_UserGetOnlineUsers {

    /** S_UserGetOnlineUsers errorCode */
    errorCode?: (number|null);

    /** S_UserGetOnlineUsers totalCount */
    totalCount?: (number|null);

    /** S_UserGetOnlineUsers userInfos */
    userInfos?: (IUserBriefInfo[]|null);
}

/** Represents a S_UserGetOnlineUsers. */
export declare class S_UserGetOnlineUsers implements IS_UserGetOnlineUsers {

    /**
     * Constructs a new S_UserGetOnlineUsers.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_UserGetOnlineUsers);

    /** S_UserGetOnlineUsers errorCode. */
    public errorCode: number;

    /** S_UserGetOnlineUsers totalCount. */
    public totalCount: number;

    /** S_UserGetOnlineUsers userInfos. */
    public userInfos: IUserBriefInfo[];

    /**
     * Creates a new S_UserGetOnlineUsers instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_UserGetOnlineUsers instance
     */
    public static create(properties?: IS_UserGetOnlineUsers): S_UserGetOnlineUsers;

    /**
     * Encodes the specified S_UserGetOnlineUsers message. Does not implicitly {@link S_UserGetOnlineUsers.verify|verify} messages.
     * @param message S_UserGetOnlineUsers message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_UserGetOnlineUsers, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_UserGetOnlineUsers message, length delimited. Does not implicitly {@link S_UserGetOnlineUsers.verify|verify} messages.
     * @param message S_UserGetOnlineUsers message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_UserGetOnlineUsers, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_UserGetOnlineUsers message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_UserGetOnlineUsers
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_UserGetOnlineUsers;

    /**
     * Decodes a S_UserGetOnlineUsers message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_UserGetOnlineUsers
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_UserGetOnlineUsers;

    /**
     * Verifies a S_UserGetOnlineUsers message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_UserGetOnlineUsers message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_UserGetOnlineUsers
     */
    public static fromObject(object: { [k: string]: any }): S_UserGetOnlineUsers;

    /**
     * Creates a plain object from a S_UserGetOnlineUsers message. Also converts values to other types if specified.
     * @param message S_UserGetOnlineUsers
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_UserGetOnlineUsers, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_UserGetOnlineUsers to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_McrCreateWar. */
export declare interface IC_McrCreateWar {

    /** C_McrCreateWar mapFileName */
    mapFileName?: (string|null);

    /** C_McrCreateWar warName */
    warName?: (string|null);

    /** C_McrCreateWar warPassword */
    warPassword?: (string|null);

    /** C_McrCreateWar warComment */
    warComment?: (string|null);

    /** C_McrCreateWar configVersion */
    configVersion?: (string|null);

    /** C_McrCreateWar playerIndex */
    playerIndex?: (number|null);

    /** C_McrCreateWar teamIndex */
    teamIndex?: (number|null);

    /** C_McrCreateWar coId */
    coId?: (number|null);

    /** C_McrCreateWar hasFog */
    hasFog?: (number|null);

    /** C_McrCreateWar timeLimit */
    timeLimit?: (number|null);

    /** C_McrCreateWar initialFund */
    initialFund?: (number|null);

    /** C_McrCreateWar incomeModifier */
    incomeModifier?: (number|null);

    /** C_McrCreateWar initialEnergy */
    initialEnergy?: (number|null);

    /** C_McrCreateWar energyGrowthModifier */
    energyGrowthModifier?: (number|null);

    /** C_McrCreateWar moveRangeModifier */
    moveRangeModifier?: (number|null);

    /** C_McrCreateWar attackPowerModifier */
    attackPowerModifier?: (number|null);

    /** C_McrCreateWar visionRangeModifier */
    visionRangeModifier?: (number|null);

    /** C_McrCreateWar bannedCoIdList */
    bannedCoIdList?: (number[]|null);

    /** C_McrCreateWar luckLowerLimit */
    luckLowerLimit?: (number|null);

    /** C_McrCreateWar luckUpperLimit */
    luckUpperLimit?: (number|null);
}

/** Represents a C_McrCreateWar. */
export declare class C_McrCreateWar implements IC_McrCreateWar {

    /**
     * Constructs a new C_McrCreateWar.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_McrCreateWar);

    /** C_McrCreateWar mapFileName. */
    public mapFileName: string;

    /** C_McrCreateWar warName. */
    public warName: string;

    /** C_McrCreateWar warPassword. */
    public warPassword: string;

    /** C_McrCreateWar warComment. */
    public warComment: string;

    /** C_McrCreateWar configVersion. */
    public configVersion: string;

    /** C_McrCreateWar playerIndex. */
    public playerIndex: number;

    /** C_McrCreateWar teamIndex. */
    public teamIndex: number;

    /** C_McrCreateWar coId. */
    public coId: number;

    /** C_McrCreateWar hasFog. */
    public hasFog: number;

    /** C_McrCreateWar timeLimit. */
    public timeLimit: number;

    /** C_McrCreateWar initialFund. */
    public initialFund: number;

    /** C_McrCreateWar incomeModifier. */
    public incomeModifier: number;

    /** C_McrCreateWar initialEnergy. */
    public initialEnergy: number;

    /** C_McrCreateWar energyGrowthModifier. */
    public energyGrowthModifier: number;

    /** C_McrCreateWar moveRangeModifier. */
    public moveRangeModifier: number;

    /** C_McrCreateWar attackPowerModifier. */
    public attackPowerModifier: number;

    /** C_McrCreateWar visionRangeModifier. */
    public visionRangeModifier: number;

    /** C_McrCreateWar bannedCoIdList. */
    public bannedCoIdList: number[];

    /** C_McrCreateWar luckLowerLimit. */
    public luckLowerLimit: number;

    /** C_McrCreateWar luckUpperLimit. */
    public luckUpperLimit: number;

    /**
     * Creates a new C_McrCreateWar instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_McrCreateWar instance
     */
    public static create(properties?: IC_McrCreateWar): C_McrCreateWar;

    /**
     * Encodes the specified C_McrCreateWar message. Does not implicitly {@link C_McrCreateWar.verify|verify} messages.
     * @param message C_McrCreateWar message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_McrCreateWar, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_McrCreateWar message, length delimited. Does not implicitly {@link C_McrCreateWar.verify|verify} messages.
     * @param message C_McrCreateWar message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_McrCreateWar, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_McrCreateWar message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_McrCreateWar
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_McrCreateWar;

    /**
     * Decodes a C_McrCreateWar message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_McrCreateWar
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_McrCreateWar;

    /**
     * Verifies a C_McrCreateWar message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_McrCreateWar message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_McrCreateWar
     */
    public static fromObject(object: { [k: string]: any }): C_McrCreateWar;

    /**
     * Creates a plain object from a C_McrCreateWar message. Also converts values to other types if specified.
     * @param message C_McrCreateWar
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_McrCreateWar, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_McrCreateWar to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_McrCreateWar. */
export declare interface IS_McrCreateWar {

    /** S_McrCreateWar errorCode */
    errorCode?: (number|null);
}

/** Represents a S_McrCreateWar. */
export declare class S_McrCreateWar implements IS_McrCreateWar {

    /**
     * Constructs a new S_McrCreateWar.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_McrCreateWar);

    /** S_McrCreateWar errorCode. */
    public errorCode: number;

    /**
     * Creates a new S_McrCreateWar instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_McrCreateWar instance
     */
    public static create(properties?: IS_McrCreateWar): S_McrCreateWar;

    /**
     * Encodes the specified S_McrCreateWar message. Does not implicitly {@link S_McrCreateWar.verify|verify} messages.
     * @param message S_McrCreateWar message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_McrCreateWar, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_McrCreateWar message, length delimited. Does not implicitly {@link S_McrCreateWar.verify|verify} messages.
     * @param message S_McrCreateWar message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_McrCreateWar, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_McrCreateWar message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_McrCreateWar
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_McrCreateWar;

    /**
     * Decodes a S_McrCreateWar message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_McrCreateWar
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_McrCreateWar;

    /**
     * Verifies a S_McrCreateWar message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_McrCreateWar message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_McrCreateWar
     */
    public static fromObject(object: { [k: string]: any }): S_McrCreateWar;

    /**
     * Creates a plain object from a S_McrCreateWar message. Also converts values to other types if specified.
     * @param message S_McrCreateWar
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_McrCreateWar, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_McrCreateWar to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_McrExitWar. */
export declare interface IC_McrExitWar {

    /** C_McrExitWar infoId */
    infoId?: (number|null);
}

/** Represents a C_McrExitWar. */
export declare class C_McrExitWar implements IC_McrExitWar {

    /**
     * Constructs a new C_McrExitWar.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_McrExitWar);

    /** C_McrExitWar infoId. */
    public infoId: number;

    /**
     * Creates a new C_McrExitWar instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_McrExitWar instance
     */
    public static create(properties?: IC_McrExitWar): C_McrExitWar;

    /**
     * Encodes the specified C_McrExitWar message. Does not implicitly {@link C_McrExitWar.verify|verify} messages.
     * @param message C_McrExitWar message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_McrExitWar, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_McrExitWar message, length delimited. Does not implicitly {@link C_McrExitWar.verify|verify} messages.
     * @param message C_McrExitWar message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_McrExitWar, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_McrExitWar message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_McrExitWar
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_McrExitWar;

    /**
     * Decodes a C_McrExitWar message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_McrExitWar
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_McrExitWar;

    /**
     * Verifies a C_McrExitWar message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_McrExitWar message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_McrExitWar
     */
    public static fromObject(object: { [k: string]: any }): C_McrExitWar;

    /**
     * Creates a plain object from a C_McrExitWar message. Also converts values to other types if specified.
     * @param message C_McrExitWar
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_McrExitWar, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_McrExitWar to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_McrExitWar. */
export declare interface IS_McrExitWar {

    /** S_McrExitWar errorCode */
    errorCode?: (number|null);
}

/** Represents a S_McrExitWar. */
export declare class S_McrExitWar implements IS_McrExitWar {

    /**
     * Constructs a new S_McrExitWar.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_McrExitWar);

    /** S_McrExitWar errorCode. */
    public errorCode: number;

    /**
     * Creates a new S_McrExitWar instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_McrExitWar instance
     */
    public static create(properties?: IS_McrExitWar): S_McrExitWar;

    /**
     * Encodes the specified S_McrExitWar message. Does not implicitly {@link S_McrExitWar.verify|verify} messages.
     * @param message S_McrExitWar message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_McrExitWar, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_McrExitWar message, length delimited. Does not implicitly {@link S_McrExitWar.verify|verify} messages.
     * @param message S_McrExitWar message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_McrExitWar, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_McrExitWar message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_McrExitWar
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_McrExitWar;

    /**
     * Decodes a S_McrExitWar message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_McrExitWar
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_McrExitWar;

    /**
     * Verifies a S_McrExitWar message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_McrExitWar message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_McrExitWar
     */
    public static fromObject(object: { [k: string]: any }): S_McrExitWar;

    /**
     * Creates a plain object from a S_McrExitWar message. Also converts values to other types if specified.
     * @param message S_McrExitWar
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_McrExitWar, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_McrExitWar to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_McrGetJoinedWaitingInfos. */
export declare interface IC_McrGetJoinedWaitingInfos {
}

/** Represents a C_McrGetJoinedWaitingInfos. */
export declare class C_McrGetJoinedWaitingInfos implements IC_McrGetJoinedWaitingInfos {

    /**
     * Constructs a new C_McrGetJoinedWaitingInfos.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_McrGetJoinedWaitingInfos);

    /**
     * Creates a new C_McrGetJoinedWaitingInfos instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_McrGetJoinedWaitingInfos instance
     */
    public static create(properties?: IC_McrGetJoinedWaitingInfos): C_McrGetJoinedWaitingInfos;

    /**
     * Encodes the specified C_McrGetJoinedWaitingInfos message. Does not implicitly {@link C_McrGetJoinedWaitingInfos.verify|verify} messages.
     * @param message C_McrGetJoinedWaitingInfos message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_McrGetJoinedWaitingInfos, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_McrGetJoinedWaitingInfos message, length delimited. Does not implicitly {@link C_McrGetJoinedWaitingInfos.verify|verify} messages.
     * @param message C_McrGetJoinedWaitingInfos message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_McrGetJoinedWaitingInfos, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_McrGetJoinedWaitingInfos message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_McrGetJoinedWaitingInfos
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_McrGetJoinedWaitingInfos;

    /**
     * Decodes a C_McrGetJoinedWaitingInfos message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_McrGetJoinedWaitingInfos
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_McrGetJoinedWaitingInfos;

    /**
     * Verifies a C_McrGetJoinedWaitingInfos message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_McrGetJoinedWaitingInfos message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_McrGetJoinedWaitingInfos
     */
    public static fromObject(object: { [k: string]: any }): C_McrGetJoinedWaitingInfos;

    /**
     * Creates a plain object from a C_McrGetJoinedWaitingInfos message. Also converts values to other types if specified.
     * @param message C_McrGetJoinedWaitingInfos
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_McrGetJoinedWaitingInfos, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_McrGetJoinedWaitingInfos to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_McrGetJoinedWaitingInfos. */
export declare interface IS_McrGetJoinedWaitingInfos {

    /** S_McrGetJoinedWaitingInfos errorCode */
    errorCode?: (number|null);

    /** S_McrGetJoinedWaitingInfos warInfos */
    warInfos?: (IMcrWaitingInfo[]|null);
}

/** Represents a S_McrGetJoinedWaitingInfos. */
export declare class S_McrGetJoinedWaitingInfos implements IS_McrGetJoinedWaitingInfos {

    /**
     * Constructs a new S_McrGetJoinedWaitingInfos.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_McrGetJoinedWaitingInfos);

    /** S_McrGetJoinedWaitingInfos errorCode. */
    public errorCode: number;

    /** S_McrGetJoinedWaitingInfos warInfos. */
    public warInfos: IMcrWaitingInfo[];

    /**
     * Creates a new S_McrGetJoinedWaitingInfos instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_McrGetJoinedWaitingInfos instance
     */
    public static create(properties?: IS_McrGetJoinedWaitingInfos): S_McrGetJoinedWaitingInfos;

    /**
     * Encodes the specified S_McrGetJoinedWaitingInfos message. Does not implicitly {@link S_McrGetJoinedWaitingInfos.verify|verify} messages.
     * @param message S_McrGetJoinedWaitingInfos message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_McrGetJoinedWaitingInfos, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_McrGetJoinedWaitingInfos message, length delimited. Does not implicitly {@link S_McrGetJoinedWaitingInfos.verify|verify} messages.
     * @param message S_McrGetJoinedWaitingInfos message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_McrGetJoinedWaitingInfos, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_McrGetJoinedWaitingInfos message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_McrGetJoinedWaitingInfos
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_McrGetJoinedWaitingInfos;

    /**
     * Decodes a S_McrGetJoinedWaitingInfos message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_McrGetJoinedWaitingInfos
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_McrGetJoinedWaitingInfos;

    /**
     * Verifies a S_McrGetJoinedWaitingInfos message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_McrGetJoinedWaitingInfos message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_McrGetJoinedWaitingInfos
     */
    public static fromObject(object: { [k: string]: any }): S_McrGetJoinedWaitingInfos;

    /**
     * Creates a plain object from a S_McrGetJoinedWaitingInfos message. Also converts values to other types if specified.
     * @param message S_McrGetJoinedWaitingInfos
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_McrGetJoinedWaitingInfos, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_McrGetJoinedWaitingInfos to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_McrGetUnjoinedWaitingInfos. */
export declare interface IC_McrGetUnjoinedWaitingInfos {
}

/** Represents a C_McrGetUnjoinedWaitingInfos. */
export declare class C_McrGetUnjoinedWaitingInfos implements IC_McrGetUnjoinedWaitingInfos {

    /**
     * Constructs a new C_McrGetUnjoinedWaitingInfos.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_McrGetUnjoinedWaitingInfos);

    /**
     * Creates a new C_McrGetUnjoinedWaitingInfos instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_McrGetUnjoinedWaitingInfos instance
     */
    public static create(properties?: IC_McrGetUnjoinedWaitingInfos): C_McrGetUnjoinedWaitingInfos;

    /**
     * Encodes the specified C_McrGetUnjoinedWaitingInfos message. Does not implicitly {@link C_McrGetUnjoinedWaitingInfos.verify|verify} messages.
     * @param message C_McrGetUnjoinedWaitingInfos message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_McrGetUnjoinedWaitingInfos, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_McrGetUnjoinedWaitingInfos message, length delimited. Does not implicitly {@link C_McrGetUnjoinedWaitingInfos.verify|verify} messages.
     * @param message C_McrGetUnjoinedWaitingInfos message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_McrGetUnjoinedWaitingInfos, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_McrGetUnjoinedWaitingInfos message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_McrGetUnjoinedWaitingInfos
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_McrGetUnjoinedWaitingInfos;

    /**
     * Decodes a C_McrGetUnjoinedWaitingInfos message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_McrGetUnjoinedWaitingInfos
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_McrGetUnjoinedWaitingInfos;

    /**
     * Verifies a C_McrGetUnjoinedWaitingInfos message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_McrGetUnjoinedWaitingInfos message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_McrGetUnjoinedWaitingInfos
     */
    public static fromObject(object: { [k: string]: any }): C_McrGetUnjoinedWaitingInfos;

    /**
     * Creates a plain object from a C_McrGetUnjoinedWaitingInfos message. Also converts values to other types if specified.
     * @param message C_McrGetUnjoinedWaitingInfos
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_McrGetUnjoinedWaitingInfos, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_McrGetUnjoinedWaitingInfos to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_McrGetUnjoinedWaitingInfos. */
export declare interface IS_McrGetUnjoinedWaitingInfos {

    /** S_McrGetUnjoinedWaitingInfos errorCode */
    errorCode?: (number|null);

    /** S_McrGetUnjoinedWaitingInfos warInfos */
    warInfos?: (IMcrWaitingInfo[]|null);
}

/** Represents a S_McrGetUnjoinedWaitingInfos. */
export declare class S_McrGetUnjoinedWaitingInfos implements IS_McrGetUnjoinedWaitingInfos {

    /**
     * Constructs a new S_McrGetUnjoinedWaitingInfos.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_McrGetUnjoinedWaitingInfos);

    /** S_McrGetUnjoinedWaitingInfos errorCode. */
    public errorCode: number;

    /** S_McrGetUnjoinedWaitingInfos warInfos. */
    public warInfos: IMcrWaitingInfo[];

    /**
     * Creates a new S_McrGetUnjoinedWaitingInfos instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_McrGetUnjoinedWaitingInfos instance
     */
    public static create(properties?: IS_McrGetUnjoinedWaitingInfos): S_McrGetUnjoinedWaitingInfos;

    /**
     * Encodes the specified S_McrGetUnjoinedWaitingInfos message. Does not implicitly {@link S_McrGetUnjoinedWaitingInfos.verify|verify} messages.
     * @param message S_McrGetUnjoinedWaitingInfos message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_McrGetUnjoinedWaitingInfos, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_McrGetUnjoinedWaitingInfos message, length delimited. Does not implicitly {@link S_McrGetUnjoinedWaitingInfos.verify|verify} messages.
     * @param message S_McrGetUnjoinedWaitingInfos message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_McrGetUnjoinedWaitingInfos, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_McrGetUnjoinedWaitingInfos message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_McrGetUnjoinedWaitingInfos
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_McrGetUnjoinedWaitingInfos;

    /**
     * Decodes a S_McrGetUnjoinedWaitingInfos message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_McrGetUnjoinedWaitingInfos
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_McrGetUnjoinedWaitingInfos;

    /**
     * Verifies a S_McrGetUnjoinedWaitingInfos message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_McrGetUnjoinedWaitingInfos message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_McrGetUnjoinedWaitingInfos
     */
    public static fromObject(object: { [k: string]: any }): S_McrGetUnjoinedWaitingInfos;

    /**
     * Creates a plain object from a S_McrGetUnjoinedWaitingInfos message. Also converts values to other types if specified.
     * @param message S_McrGetUnjoinedWaitingInfos
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_McrGetUnjoinedWaitingInfos, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_McrGetUnjoinedWaitingInfos to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_McrJoinWar. */
export declare interface IC_McrJoinWar {

    /** C_McrJoinWar infoId */
    infoId?: (number|null);

    /** C_McrJoinWar playerIndex */
    playerIndex?: (number|null);

    /** C_McrJoinWar teamIndex */
    teamIndex?: (number|null);

    /** C_McrJoinWar coId */
    coId?: (number|null);
}

/** Represents a C_McrJoinWar. */
export declare class C_McrJoinWar implements IC_McrJoinWar {

    /**
     * Constructs a new C_McrJoinWar.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_McrJoinWar);

    /** C_McrJoinWar infoId. */
    public infoId: number;

    /** C_McrJoinWar playerIndex. */
    public playerIndex: number;

    /** C_McrJoinWar teamIndex. */
    public teamIndex: number;

    /** C_McrJoinWar coId. */
    public coId: number;

    /**
     * Creates a new C_McrJoinWar instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_McrJoinWar instance
     */
    public static create(properties?: IC_McrJoinWar): C_McrJoinWar;

    /**
     * Encodes the specified C_McrJoinWar message. Does not implicitly {@link C_McrJoinWar.verify|verify} messages.
     * @param message C_McrJoinWar message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_McrJoinWar, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_McrJoinWar message, length delimited. Does not implicitly {@link C_McrJoinWar.verify|verify} messages.
     * @param message C_McrJoinWar message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_McrJoinWar, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_McrJoinWar message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_McrJoinWar
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_McrJoinWar;

    /**
     * Decodes a C_McrJoinWar message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_McrJoinWar
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_McrJoinWar;

    /**
     * Verifies a C_McrJoinWar message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_McrJoinWar message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_McrJoinWar
     */
    public static fromObject(object: { [k: string]: any }): C_McrJoinWar;

    /**
     * Creates a plain object from a C_McrJoinWar message. Also converts values to other types if specified.
     * @param message C_McrJoinWar
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_McrJoinWar, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_McrJoinWar to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_McrJoinWar. */
export declare interface IS_McrJoinWar {

    /** S_McrJoinWar errorCode */
    errorCode?: (number|null);

    /** S_McrJoinWar isStarted */
    isStarted?: (boolean|null);
}

/** Represents a S_McrJoinWar. */
export declare class S_McrJoinWar implements IS_McrJoinWar {

    /**
     * Constructs a new S_McrJoinWar.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_McrJoinWar);

    /** S_McrJoinWar errorCode. */
    public errorCode: number;

    /** S_McrJoinWar isStarted. */
    public isStarted: boolean;

    /**
     * Creates a new S_McrJoinWar instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_McrJoinWar instance
     */
    public static create(properties?: IS_McrJoinWar): S_McrJoinWar;

    /**
     * Encodes the specified S_McrJoinWar message. Does not implicitly {@link S_McrJoinWar.verify|verify} messages.
     * @param message S_McrJoinWar message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_McrJoinWar, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_McrJoinWar message, length delimited. Does not implicitly {@link S_McrJoinWar.verify|verify} messages.
     * @param message S_McrJoinWar message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_McrJoinWar, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_McrJoinWar message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_McrJoinWar
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_McrJoinWar;

    /**
     * Decodes a S_McrJoinWar message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_McrJoinWar
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_McrJoinWar;

    /**
     * Verifies a S_McrJoinWar message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_McrJoinWar message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_McrJoinWar
     */
    public static fromObject(object: { [k: string]: any }): S_McrJoinWar;

    /**
     * Creates a plain object from a S_McrJoinWar message. Also converts values to other types if specified.
     * @param message S_McrJoinWar
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_McrJoinWar, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_McrJoinWar to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_McrGetJoinedOngoingInfos. */
export declare interface IC_McrGetJoinedOngoingInfos {
}

/** Represents a C_McrGetJoinedOngoingInfos. */
export declare class C_McrGetJoinedOngoingInfos implements IC_McrGetJoinedOngoingInfos {

    /**
     * Constructs a new C_McrGetJoinedOngoingInfos.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_McrGetJoinedOngoingInfos);

    /**
     * Creates a new C_McrGetJoinedOngoingInfos instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_McrGetJoinedOngoingInfos instance
     */
    public static create(properties?: IC_McrGetJoinedOngoingInfos): C_McrGetJoinedOngoingInfos;

    /**
     * Encodes the specified C_McrGetJoinedOngoingInfos message. Does not implicitly {@link C_McrGetJoinedOngoingInfos.verify|verify} messages.
     * @param message C_McrGetJoinedOngoingInfos message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_McrGetJoinedOngoingInfos, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_McrGetJoinedOngoingInfos message, length delimited. Does not implicitly {@link C_McrGetJoinedOngoingInfos.verify|verify} messages.
     * @param message C_McrGetJoinedOngoingInfos message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_McrGetJoinedOngoingInfos, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_McrGetJoinedOngoingInfos message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_McrGetJoinedOngoingInfos
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_McrGetJoinedOngoingInfos;

    /**
     * Decodes a C_McrGetJoinedOngoingInfos message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_McrGetJoinedOngoingInfos
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_McrGetJoinedOngoingInfos;

    /**
     * Verifies a C_McrGetJoinedOngoingInfos message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_McrGetJoinedOngoingInfos message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_McrGetJoinedOngoingInfos
     */
    public static fromObject(object: { [k: string]: any }): C_McrGetJoinedOngoingInfos;

    /**
     * Creates a plain object from a C_McrGetJoinedOngoingInfos message. Also converts values to other types if specified.
     * @param message C_McrGetJoinedOngoingInfos
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_McrGetJoinedOngoingInfos, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_McrGetJoinedOngoingInfos to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_McrGetJoinedOngoingInfos. */
export declare interface IS_McrGetJoinedOngoingInfos {

    /** S_McrGetJoinedOngoingInfos infos */
    infos?: (IMcwOngoingDetail[]|null);
}

/** Represents a S_McrGetJoinedOngoingInfos. */
export declare class S_McrGetJoinedOngoingInfos implements IS_McrGetJoinedOngoingInfos {

    /**
     * Constructs a new S_McrGetJoinedOngoingInfos.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_McrGetJoinedOngoingInfos);

    /** S_McrGetJoinedOngoingInfos infos. */
    public infos: IMcwOngoingDetail[];

    /**
     * Creates a new S_McrGetJoinedOngoingInfos instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_McrGetJoinedOngoingInfos instance
     */
    public static create(properties?: IS_McrGetJoinedOngoingInfos): S_McrGetJoinedOngoingInfos;

    /**
     * Encodes the specified S_McrGetJoinedOngoingInfos message. Does not implicitly {@link S_McrGetJoinedOngoingInfos.verify|verify} messages.
     * @param message S_McrGetJoinedOngoingInfos message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_McrGetJoinedOngoingInfos, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_McrGetJoinedOngoingInfos message, length delimited. Does not implicitly {@link S_McrGetJoinedOngoingInfos.verify|verify} messages.
     * @param message S_McrGetJoinedOngoingInfos message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_McrGetJoinedOngoingInfos, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_McrGetJoinedOngoingInfos message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_McrGetJoinedOngoingInfos
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_McrGetJoinedOngoingInfos;

    /**
     * Decodes a S_McrGetJoinedOngoingInfos message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_McrGetJoinedOngoingInfos
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_McrGetJoinedOngoingInfos;

    /**
     * Verifies a S_McrGetJoinedOngoingInfos message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_McrGetJoinedOngoingInfos message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_McrGetJoinedOngoingInfos
     */
    public static fromObject(object: { [k: string]: any }): S_McrGetJoinedOngoingInfos;

    /**
     * Creates a plain object from a S_McrGetJoinedOngoingInfos message. Also converts values to other types if specified.
     * @param message S_McrGetJoinedOngoingInfos
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_McrGetJoinedOngoingInfos, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_McrGetJoinedOngoingInfos to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_McrContinueWar. */
export declare interface IC_McrContinueWar {

    /** C_McrContinueWar warId */
    warId?: (number|null);
}

/** Represents a C_McrContinueWar. */
export declare class C_McrContinueWar implements IC_McrContinueWar {

    /**
     * Constructs a new C_McrContinueWar.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_McrContinueWar);

    /** C_McrContinueWar warId. */
    public warId: number;

    /**
     * Creates a new C_McrContinueWar instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_McrContinueWar instance
     */
    public static create(properties?: IC_McrContinueWar): C_McrContinueWar;

    /**
     * Encodes the specified C_McrContinueWar message. Does not implicitly {@link C_McrContinueWar.verify|verify} messages.
     * @param message C_McrContinueWar message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_McrContinueWar, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_McrContinueWar message, length delimited. Does not implicitly {@link C_McrContinueWar.verify|verify} messages.
     * @param message C_McrContinueWar message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_McrContinueWar, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_McrContinueWar message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_McrContinueWar
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_McrContinueWar;

    /**
     * Decodes a C_McrContinueWar message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_McrContinueWar
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_McrContinueWar;

    /**
     * Verifies a C_McrContinueWar message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_McrContinueWar message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_McrContinueWar
     */
    public static fromObject(object: { [k: string]: any }): C_McrContinueWar;

    /**
     * Creates a plain object from a C_McrContinueWar message. Also converts values to other types if specified.
     * @param message C_McrContinueWar
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_McrContinueWar, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_McrContinueWar to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_McrContinueWar. */
export declare interface IS_McrContinueWar {

    /** S_McrContinueWar errorCode */
    errorCode?: (number|null);

    /** S_McrContinueWar warId */
    warId?: (number|null);

    /** S_McrContinueWar war */
    war?: (ISerializedWar|null);
}

/** Represents a S_McrContinueWar. */
export declare class S_McrContinueWar implements IS_McrContinueWar {

    /**
     * Constructs a new S_McrContinueWar.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_McrContinueWar);

    /** S_McrContinueWar errorCode. */
    public errorCode: number;

    /** S_McrContinueWar warId. */
    public warId: number;

    /** S_McrContinueWar war. */
    public war?: (ISerializedWar|null);

    /**
     * Creates a new S_McrContinueWar instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_McrContinueWar instance
     */
    public static create(properties?: IS_McrContinueWar): S_McrContinueWar;

    /**
     * Encodes the specified S_McrContinueWar message. Does not implicitly {@link S_McrContinueWar.verify|verify} messages.
     * @param message S_McrContinueWar message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_McrContinueWar, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_McrContinueWar message, length delimited. Does not implicitly {@link S_McrContinueWar.verify|verify} messages.
     * @param message S_McrContinueWar message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_McrContinueWar, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_McrContinueWar message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_McrContinueWar
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_McrContinueWar;

    /**
     * Decodes a S_McrContinueWar message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_McrContinueWar
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_McrContinueWar;

    /**
     * Verifies a S_McrContinueWar message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_McrContinueWar message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_McrContinueWar
     */
    public static fromObject(object: { [k: string]: any }): S_McrContinueWar;

    /**
     * Creates a plain object from a S_McrContinueWar message. Also converts values to other types if specified.
     * @param message S_McrContinueWar
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_McrContinueWar, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_McrContinueWar to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_McrGetReplayInfos. */
export declare interface IC_McrGetReplayInfos {

    /** C_McrGetReplayInfos replayId */
    replayId?: (number|null);
}

/** Represents a C_McrGetReplayInfos. */
export declare class C_McrGetReplayInfos implements IC_McrGetReplayInfos {

    /**
     * Constructs a new C_McrGetReplayInfos.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_McrGetReplayInfos);

    /** C_McrGetReplayInfos replayId. */
    public replayId: number;

    /**
     * Creates a new C_McrGetReplayInfos instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_McrGetReplayInfos instance
     */
    public static create(properties?: IC_McrGetReplayInfos): C_McrGetReplayInfos;

    /**
     * Encodes the specified C_McrGetReplayInfos message. Does not implicitly {@link C_McrGetReplayInfos.verify|verify} messages.
     * @param message C_McrGetReplayInfos message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_McrGetReplayInfos, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_McrGetReplayInfos message, length delimited. Does not implicitly {@link C_McrGetReplayInfos.verify|verify} messages.
     * @param message C_McrGetReplayInfos message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_McrGetReplayInfos, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_McrGetReplayInfos message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_McrGetReplayInfos
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_McrGetReplayInfos;

    /**
     * Decodes a C_McrGetReplayInfos message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_McrGetReplayInfos
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_McrGetReplayInfos;

    /**
     * Verifies a C_McrGetReplayInfos message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_McrGetReplayInfos message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_McrGetReplayInfos
     */
    public static fromObject(object: { [k: string]: any }): C_McrGetReplayInfos;

    /**
     * Creates a plain object from a C_McrGetReplayInfos message. Also converts values to other types if specified.
     * @param message C_McrGetReplayInfos
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_McrGetReplayInfos, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_McrGetReplayInfos to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_McrGetReplayInfos. */
export declare interface IS_McrGetReplayInfos {

    /** S_McrGetReplayInfos errorCode */
    errorCode?: (number|null);

    /** S_McrGetReplayInfos infos */
    infos?: (IMcwReplayInfo[]|null);
}

/** Represents a S_McrGetReplayInfos. */
export declare class S_McrGetReplayInfos implements IS_McrGetReplayInfos {

    /**
     * Constructs a new S_McrGetReplayInfos.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_McrGetReplayInfos);

    /** S_McrGetReplayInfos errorCode. */
    public errorCode: number;

    /** S_McrGetReplayInfos infos. */
    public infos: IMcwReplayInfo[];

    /**
     * Creates a new S_McrGetReplayInfos instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_McrGetReplayInfos instance
     */
    public static create(properties?: IS_McrGetReplayInfos): S_McrGetReplayInfos;

    /**
     * Encodes the specified S_McrGetReplayInfos message. Does not implicitly {@link S_McrGetReplayInfos.verify|verify} messages.
     * @param message S_McrGetReplayInfos message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_McrGetReplayInfos, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_McrGetReplayInfos message, length delimited. Does not implicitly {@link S_McrGetReplayInfos.verify|verify} messages.
     * @param message S_McrGetReplayInfos message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_McrGetReplayInfos, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_McrGetReplayInfos message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_McrGetReplayInfos
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_McrGetReplayInfos;

    /**
     * Decodes a S_McrGetReplayInfos message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_McrGetReplayInfos
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_McrGetReplayInfos;

    /**
     * Verifies a S_McrGetReplayInfos message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_McrGetReplayInfos message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_McrGetReplayInfos
     */
    public static fromObject(object: { [k: string]: any }): S_McrGetReplayInfos;

    /**
     * Creates a plain object from a S_McrGetReplayInfos message. Also converts values to other types if specified.
     * @param message S_McrGetReplayInfos
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_McrGetReplayInfos, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_McrGetReplayInfos to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_McrGetReplayData. */
export declare interface IC_McrGetReplayData {

    /** C_McrGetReplayData replayId */
    replayId?: (number|null);
}

/** Represents a C_McrGetReplayData. */
export declare class C_McrGetReplayData implements IC_McrGetReplayData {

    /**
     * Constructs a new C_McrGetReplayData.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_McrGetReplayData);

    /** C_McrGetReplayData replayId. */
    public replayId: number;

    /**
     * Creates a new C_McrGetReplayData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_McrGetReplayData instance
     */
    public static create(properties?: IC_McrGetReplayData): C_McrGetReplayData;

    /**
     * Encodes the specified C_McrGetReplayData message. Does not implicitly {@link C_McrGetReplayData.verify|verify} messages.
     * @param message C_McrGetReplayData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_McrGetReplayData, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_McrGetReplayData message, length delimited. Does not implicitly {@link C_McrGetReplayData.verify|verify} messages.
     * @param message C_McrGetReplayData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_McrGetReplayData, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_McrGetReplayData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_McrGetReplayData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_McrGetReplayData;

    /**
     * Decodes a C_McrGetReplayData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_McrGetReplayData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_McrGetReplayData;

    /**
     * Verifies a C_McrGetReplayData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_McrGetReplayData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_McrGetReplayData
     */
    public static fromObject(object: { [k: string]: any }): C_McrGetReplayData;

    /**
     * Creates a plain object from a C_McrGetReplayData message. Also converts values to other types if specified.
     * @param message C_McrGetReplayData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_McrGetReplayData, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_McrGetReplayData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_McrGetReplayData. */
export declare interface IS_McrGetReplayData {

    /** S_McrGetReplayData errorCode */
    errorCode?: (number|null);

    /** S_McrGetReplayData replayId */
    replayId?: (number|null);

    /** S_McrGetReplayData encodedWar */
    encodedWar?: (Uint8Array|null);

    /** S_McrGetReplayData userNicknames */
    userNicknames?: (string[]|null);
}

/** Represents a S_McrGetReplayData. */
export declare class S_McrGetReplayData implements IS_McrGetReplayData {

    /**
     * Constructs a new S_McrGetReplayData.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_McrGetReplayData);

    /** S_McrGetReplayData errorCode. */
    public errorCode: number;

    /** S_McrGetReplayData replayId. */
    public replayId: number;

    /** S_McrGetReplayData encodedWar. */
    public encodedWar: Uint8Array;

    /** S_McrGetReplayData userNicknames. */
    public userNicknames: string[];

    /**
     * Creates a new S_McrGetReplayData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_McrGetReplayData instance
     */
    public static create(properties?: IS_McrGetReplayData): S_McrGetReplayData;

    /**
     * Encodes the specified S_McrGetReplayData message. Does not implicitly {@link S_McrGetReplayData.verify|verify} messages.
     * @param message S_McrGetReplayData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_McrGetReplayData, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_McrGetReplayData message, length delimited. Does not implicitly {@link S_McrGetReplayData.verify|verify} messages.
     * @param message S_McrGetReplayData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_McrGetReplayData, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_McrGetReplayData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_McrGetReplayData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_McrGetReplayData;

    /**
     * Decodes a S_McrGetReplayData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_McrGetReplayData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_McrGetReplayData;

    /**
     * Verifies a S_McrGetReplayData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_McrGetReplayData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_McrGetReplayData
     */
    public static fromObject(object: { [k: string]: any }): S_McrGetReplayData;

    /**
     * Creates a plain object from a S_McrGetReplayData message. Also converts values to other types if specified.
     * @param message S_McrGetReplayData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_McrGetReplayData, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_McrGetReplayData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_McwPlayerSyncWar. */
export declare interface IC_McwPlayerSyncWar {

    /** C_McwPlayerSyncWar warId */
    warId?: (number|null);

    /** C_McwPlayerSyncWar nextActionId */
    nextActionId?: (number|null);

    /** C_McwPlayerSyncWar requestType */
    requestType?: (number|null);
}

/** Represents a C_McwPlayerSyncWar. */
export declare class C_McwPlayerSyncWar implements IC_McwPlayerSyncWar {

    /**
     * Constructs a new C_McwPlayerSyncWar.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_McwPlayerSyncWar);

    /** C_McwPlayerSyncWar warId. */
    public warId: number;

    /** C_McwPlayerSyncWar nextActionId. */
    public nextActionId: number;

    /** C_McwPlayerSyncWar requestType. */
    public requestType: number;

    /**
     * Creates a new C_McwPlayerSyncWar instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_McwPlayerSyncWar instance
     */
    public static create(properties?: IC_McwPlayerSyncWar): C_McwPlayerSyncWar;

    /**
     * Encodes the specified C_McwPlayerSyncWar message. Does not implicitly {@link C_McwPlayerSyncWar.verify|verify} messages.
     * @param message C_McwPlayerSyncWar message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_McwPlayerSyncWar, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_McwPlayerSyncWar message, length delimited. Does not implicitly {@link C_McwPlayerSyncWar.verify|verify} messages.
     * @param message C_McwPlayerSyncWar message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_McwPlayerSyncWar, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_McwPlayerSyncWar message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_McwPlayerSyncWar
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_McwPlayerSyncWar;

    /**
     * Decodes a C_McwPlayerSyncWar message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_McwPlayerSyncWar
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_McwPlayerSyncWar;

    /**
     * Verifies a C_McwPlayerSyncWar message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_McwPlayerSyncWar message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_McwPlayerSyncWar
     */
    public static fromObject(object: { [k: string]: any }): C_McwPlayerSyncWar;

    /**
     * Creates a plain object from a C_McwPlayerSyncWar message. Also converts values to other types if specified.
     * @param message C_McwPlayerSyncWar
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_McwPlayerSyncWar, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_McwPlayerSyncWar to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_McwPlayerSyncWar. */
export declare interface IS_McwPlayerSyncWar {

    /** S_McwPlayerSyncWar errorCode */
    errorCode?: (number|null);

    /** S_McwPlayerSyncWar warId */
    warId?: (number|null);

    /** S_McwPlayerSyncWar nextActionId */
    nextActionId?: (number|null);

    /** S_McwPlayerSyncWar war */
    war?: (ISerializedWar|null);

    /** S_McwPlayerSyncWar status */
    status?: (number|null);

    /** S_McwPlayerSyncWar requestType */
    requestType?: (number|null);
}

/** Represents a S_McwPlayerSyncWar. */
export declare class S_McwPlayerSyncWar implements IS_McwPlayerSyncWar {

    /**
     * Constructs a new S_McwPlayerSyncWar.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_McwPlayerSyncWar);

    /** S_McwPlayerSyncWar errorCode. */
    public errorCode: number;

    /** S_McwPlayerSyncWar warId. */
    public warId: number;

    /** S_McwPlayerSyncWar nextActionId. */
    public nextActionId: number;

    /** S_McwPlayerSyncWar war. */
    public war?: (ISerializedWar|null);

    /** S_McwPlayerSyncWar status. */
    public status: number;

    /** S_McwPlayerSyncWar requestType. */
    public requestType: number;

    /**
     * Creates a new S_McwPlayerSyncWar instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_McwPlayerSyncWar instance
     */
    public static create(properties?: IS_McwPlayerSyncWar): S_McwPlayerSyncWar;

    /**
     * Encodes the specified S_McwPlayerSyncWar message. Does not implicitly {@link S_McwPlayerSyncWar.verify|verify} messages.
     * @param message S_McwPlayerSyncWar message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_McwPlayerSyncWar, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_McwPlayerSyncWar message, length delimited. Does not implicitly {@link S_McwPlayerSyncWar.verify|verify} messages.
     * @param message S_McwPlayerSyncWar message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_McwPlayerSyncWar, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_McwPlayerSyncWar message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_McwPlayerSyncWar
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_McwPlayerSyncWar;

    /**
     * Decodes a S_McwPlayerSyncWar message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_McwPlayerSyncWar
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_McwPlayerSyncWar;

    /**
     * Verifies a S_McwPlayerSyncWar message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_McwPlayerSyncWar message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_McwPlayerSyncWar
     */
    public static fromObject(object: { [k: string]: any }): S_McwPlayerSyncWar;

    /**
     * Creates a plain object from a S_McwPlayerSyncWar message. Also converts values to other types if specified.
     * @param message S_McwPlayerSyncWar
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_McwPlayerSyncWar, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_McwPlayerSyncWar to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_McwPlayerBeginTurn. */
export declare interface IC_McwPlayerBeginTurn {

    /** C_McwPlayerBeginTurn warId */
    warId?: (number|null);

    /** C_McwPlayerBeginTurn actionId */
    actionId?: (number|null);
}

/** Represents a C_McwPlayerBeginTurn. */
export declare class C_McwPlayerBeginTurn implements IC_McwPlayerBeginTurn {

    /**
     * Constructs a new C_McwPlayerBeginTurn.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_McwPlayerBeginTurn);

    /** C_McwPlayerBeginTurn warId. */
    public warId: number;

    /** C_McwPlayerBeginTurn actionId. */
    public actionId: number;

    /**
     * Creates a new C_McwPlayerBeginTurn instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_McwPlayerBeginTurn instance
     */
    public static create(properties?: IC_McwPlayerBeginTurn): C_McwPlayerBeginTurn;

    /**
     * Encodes the specified C_McwPlayerBeginTurn message. Does not implicitly {@link C_McwPlayerBeginTurn.verify|verify} messages.
     * @param message C_McwPlayerBeginTurn message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_McwPlayerBeginTurn, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_McwPlayerBeginTurn message, length delimited. Does not implicitly {@link C_McwPlayerBeginTurn.verify|verify} messages.
     * @param message C_McwPlayerBeginTurn message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_McwPlayerBeginTurn, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_McwPlayerBeginTurn message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_McwPlayerBeginTurn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_McwPlayerBeginTurn;

    /**
     * Decodes a C_McwPlayerBeginTurn message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_McwPlayerBeginTurn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_McwPlayerBeginTurn;

    /**
     * Verifies a C_McwPlayerBeginTurn message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_McwPlayerBeginTurn message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_McwPlayerBeginTurn
     */
    public static fromObject(object: { [k: string]: any }): C_McwPlayerBeginTurn;

    /**
     * Creates a plain object from a C_McwPlayerBeginTurn message. Also converts values to other types if specified.
     * @param message C_McwPlayerBeginTurn
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_McwPlayerBeginTurn, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_McwPlayerBeginTurn to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_McwPlayerBeginTurn. */
export declare interface IS_McwPlayerBeginTurn {

    /** S_McwPlayerBeginTurn errorCode */
    errorCode?: (number|null);

    /** S_McwPlayerBeginTurn warId */
    warId?: (number|null);

    /** S_McwPlayerBeginTurn actionContainer */
    actionContainer?: (IWarActionContainer|null);
}

/** Represents a S_McwPlayerBeginTurn. */
export declare class S_McwPlayerBeginTurn implements IS_McwPlayerBeginTurn {

    /**
     * Constructs a new S_McwPlayerBeginTurn.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_McwPlayerBeginTurn);

    /** S_McwPlayerBeginTurn errorCode. */
    public errorCode: number;

    /** S_McwPlayerBeginTurn warId. */
    public warId: number;

    /** S_McwPlayerBeginTurn actionContainer. */
    public actionContainer?: (IWarActionContainer|null);

    /**
     * Creates a new S_McwPlayerBeginTurn instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_McwPlayerBeginTurn instance
     */
    public static create(properties?: IS_McwPlayerBeginTurn): S_McwPlayerBeginTurn;

    /**
     * Encodes the specified S_McwPlayerBeginTurn message. Does not implicitly {@link S_McwPlayerBeginTurn.verify|verify} messages.
     * @param message S_McwPlayerBeginTurn message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_McwPlayerBeginTurn, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_McwPlayerBeginTurn message, length delimited. Does not implicitly {@link S_McwPlayerBeginTurn.verify|verify} messages.
     * @param message S_McwPlayerBeginTurn message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_McwPlayerBeginTurn, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_McwPlayerBeginTurn message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_McwPlayerBeginTurn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_McwPlayerBeginTurn;

    /**
     * Decodes a S_McwPlayerBeginTurn message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_McwPlayerBeginTurn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_McwPlayerBeginTurn;

    /**
     * Verifies a S_McwPlayerBeginTurn message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_McwPlayerBeginTurn message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_McwPlayerBeginTurn
     */
    public static fromObject(object: { [k: string]: any }): S_McwPlayerBeginTurn;

    /**
     * Creates a plain object from a S_McwPlayerBeginTurn message. Also converts values to other types if specified.
     * @param message S_McwPlayerBeginTurn
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_McwPlayerBeginTurn, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_McwPlayerBeginTurn to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_McwPlayerEndTurn. */
export declare interface IC_McwPlayerEndTurn {

    /** C_McwPlayerEndTurn warId */
    warId?: (number|null);

    /** C_McwPlayerEndTurn actionId */
    actionId?: (number|null);
}

/** Represents a C_McwPlayerEndTurn. */
export declare class C_McwPlayerEndTurn implements IC_McwPlayerEndTurn {

    /**
     * Constructs a new C_McwPlayerEndTurn.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_McwPlayerEndTurn);

    /** C_McwPlayerEndTurn warId. */
    public warId: number;

    /** C_McwPlayerEndTurn actionId. */
    public actionId: number;

    /**
     * Creates a new C_McwPlayerEndTurn instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_McwPlayerEndTurn instance
     */
    public static create(properties?: IC_McwPlayerEndTurn): C_McwPlayerEndTurn;

    /**
     * Encodes the specified C_McwPlayerEndTurn message. Does not implicitly {@link C_McwPlayerEndTurn.verify|verify} messages.
     * @param message C_McwPlayerEndTurn message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_McwPlayerEndTurn, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_McwPlayerEndTurn message, length delimited. Does not implicitly {@link C_McwPlayerEndTurn.verify|verify} messages.
     * @param message C_McwPlayerEndTurn message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_McwPlayerEndTurn, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_McwPlayerEndTurn message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_McwPlayerEndTurn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_McwPlayerEndTurn;

    /**
     * Decodes a C_McwPlayerEndTurn message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_McwPlayerEndTurn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_McwPlayerEndTurn;

    /**
     * Verifies a C_McwPlayerEndTurn message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_McwPlayerEndTurn message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_McwPlayerEndTurn
     */
    public static fromObject(object: { [k: string]: any }): C_McwPlayerEndTurn;

    /**
     * Creates a plain object from a C_McwPlayerEndTurn message. Also converts values to other types if specified.
     * @param message C_McwPlayerEndTurn
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_McwPlayerEndTurn, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_McwPlayerEndTurn to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_McwPlayerEndTurn. */
export declare interface IS_McwPlayerEndTurn {

    /** S_McwPlayerEndTurn errorCode */
    errorCode?: (number|null);

    /** S_McwPlayerEndTurn warId */
    warId?: (number|null);

    /** S_McwPlayerEndTurn actionContainer */
    actionContainer?: (IWarActionContainer|null);
}

/** Represents a S_McwPlayerEndTurn. */
export declare class S_McwPlayerEndTurn implements IS_McwPlayerEndTurn {

    /**
     * Constructs a new S_McwPlayerEndTurn.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_McwPlayerEndTurn);

    /** S_McwPlayerEndTurn errorCode. */
    public errorCode: number;

    /** S_McwPlayerEndTurn warId. */
    public warId: number;

    /** S_McwPlayerEndTurn actionContainer. */
    public actionContainer?: (IWarActionContainer|null);

    /**
     * Creates a new S_McwPlayerEndTurn instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_McwPlayerEndTurn instance
     */
    public static create(properties?: IS_McwPlayerEndTurn): S_McwPlayerEndTurn;

    /**
     * Encodes the specified S_McwPlayerEndTurn message. Does not implicitly {@link S_McwPlayerEndTurn.verify|verify} messages.
     * @param message S_McwPlayerEndTurn message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_McwPlayerEndTurn, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_McwPlayerEndTurn message, length delimited. Does not implicitly {@link S_McwPlayerEndTurn.verify|verify} messages.
     * @param message S_McwPlayerEndTurn message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_McwPlayerEndTurn, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_McwPlayerEndTurn message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_McwPlayerEndTurn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_McwPlayerEndTurn;

    /**
     * Decodes a S_McwPlayerEndTurn message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_McwPlayerEndTurn
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_McwPlayerEndTurn;

    /**
     * Verifies a S_McwPlayerEndTurn message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_McwPlayerEndTurn message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_McwPlayerEndTurn
     */
    public static fromObject(object: { [k: string]: any }): S_McwPlayerEndTurn;

    /**
     * Creates a plain object from a S_McwPlayerEndTurn message. Also converts values to other types if specified.
     * @param message S_McwPlayerEndTurn
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_McwPlayerEndTurn, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_McwPlayerEndTurn to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_McwPlayerSurrender. */
export declare interface IC_McwPlayerSurrender {

    /** C_McwPlayerSurrender warId */
    warId?: (number|null);

    /** C_McwPlayerSurrender actionId */
    actionId?: (number|null);

    /** C_McwPlayerSurrender isBoot */
    isBoot?: (boolean|null);
}

/** Represents a C_McwPlayerSurrender. */
export declare class C_McwPlayerSurrender implements IC_McwPlayerSurrender {

    /**
     * Constructs a new C_McwPlayerSurrender.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_McwPlayerSurrender);

    /** C_McwPlayerSurrender warId. */
    public warId: number;

    /** C_McwPlayerSurrender actionId. */
    public actionId: number;

    /** C_McwPlayerSurrender isBoot. */
    public isBoot: boolean;

    /**
     * Creates a new C_McwPlayerSurrender instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_McwPlayerSurrender instance
     */
    public static create(properties?: IC_McwPlayerSurrender): C_McwPlayerSurrender;

    /**
     * Encodes the specified C_McwPlayerSurrender message. Does not implicitly {@link C_McwPlayerSurrender.verify|verify} messages.
     * @param message C_McwPlayerSurrender message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_McwPlayerSurrender, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_McwPlayerSurrender message, length delimited. Does not implicitly {@link C_McwPlayerSurrender.verify|verify} messages.
     * @param message C_McwPlayerSurrender message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_McwPlayerSurrender, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_McwPlayerSurrender message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_McwPlayerSurrender
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_McwPlayerSurrender;

    /**
     * Decodes a C_McwPlayerSurrender message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_McwPlayerSurrender
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_McwPlayerSurrender;

    /**
     * Verifies a C_McwPlayerSurrender message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_McwPlayerSurrender message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_McwPlayerSurrender
     */
    public static fromObject(object: { [k: string]: any }): C_McwPlayerSurrender;

    /**
     * Creates a plain object from a C_McwPlayerSurrender message. Also converts values to other types if specified.
     * @param message C_McwPlayerSurrender
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_McwPlayerSurrender, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_McwPlayerSurrender to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_McwPlayerSurrender. */
export declare interface IS_McwPlayerSurrender {

    /** S_McwPlayerSurrender errorCode */
    errorCode?: (number|null);

    /** S_McwPlayerSurrender warId */
    warId?: (number|null);

    /** S_McwPlayerSurrender actionContainer */
    actionContainer?: (IWarActionContainer|null);
}

/** Represents a S_McwPlayerSurrender. */
export declare class S_McwPlayerSurrender implements IS_McwPlayerSurrender {

    /**
     * Constructs a new S_McwPlayerSurrender.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_McwPlayerSurrender);

    /** S_McwPlayerSurrender errorCode. */
    public errorCode: number;

    /** S_McwPlayerSurrender warId. */
    public warId: number;

    /** S_McwPlayerSurrender actionContainer. */
    public actionContainer?: (IWarActionContainer|null);

    /**
     * Creates a new S_McwPlayerSurrender instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_McwPlayerSurrender instance
     */
    public static create(properties?: IS_McwPlayerSurrender): S_McwPlayerSurrender;

    /**
     * Encodes the specified S_McwPlayerSurrender message. Does not implicitly {@link S_McwPlayerSurrender.verify|verify} messages.
     * @param message S_McwPlayerSurrender message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_McwPlayerSurrender, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_McwPlayerSurrender message, length delimited. Does not implicitly {@link S_McwPlayerSurrender.verify|verify} messages.
     * @param message S_McwPlayerSurrender message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_McwPlayerSurrender, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_McwPlayerSurrender message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_McwPlayerSurrender
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_McwPlayerSurrender;

    /**
     * Decodes a S_McwPlayerSurrender message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_McwPlayerSurrender
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_McwPlayerSurrender;

    /**
     * Verifies a S_McwPlayerSurrender message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_McwPlayerSurrender message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_McwPlayerSurrender
     */
    public static fromObject(object: { [k: string]: any }): S_McwPlayerSurrender;

    /**
     * Creates a plain object from a S_McwPlayerSurrender message. Also converts values to other types if specified.
     * @param message S_McwPlayerSurrender
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_McwPlayerSurrender, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_McwPlayerSurrender to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_McwPlayerProduceUnit. */
export declare interface IC_McwPlayerProduceUnit {

    /** C_McwPlayerProduceUnit warId */
    warId?: (number|null);

    /** C_McwPlayerProduceUnit actionId */
    actionId?: (number|null);

    /** C_McwPlayerProduceUnit gridIndex */
    gridIndex?: (IGridIndex|null);

    /** C_McwPlayerProduceUnit unitType */
    unitType?: (number|null);
}

/** Represents a C_McwPlayerProduceUnit. */
export declare class C_McwPlayerProduceUnit implements IC_McwPlayerProduceUnit {

    /**
     * Constructs a new C_McwPlayerProduceUnit.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_McwPlayerProduceUnit);

    /** C_McwPlayerProduceUnit warId. */
    public warId: number;

    /** C_McwPlayerProduceUnit actionId. */
    public actionId: number;

    /** C_McwPlayerProduceUnit gridIndex. */
    public gridIndex?: (IGridIndex|null);

    /** C_McwPlayerProduceUnit unitType. */
    public unitType: number;

    /**
     * Creates a new C_McwPlayerProduceUnit instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_McwPlayerProduceUnit instance
     */
    public static create(properties?: IC_McwPlayerProduceUnit): C_McwPlayerProduceUnit;

    /**
     * Encodes the specified C_McwPlayerProduceUnit message. Does not implicitly {@link C_McwPlayerProduceUnit.verify|verify} messages.
     * @param message C_McwPlayerProduceUnit message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_McwPlayerProduceUnit, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_McwPlayerProduceUnit message, length delimited. Does not implicitly {@link C_McwPlayerProduceUnit.verify|verify} messages.
     * @param message C_McwPlayerProduceUnit message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_McwPlayerProduceUnit, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_McwPlayerProduceUnit message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_McwPlayerProduceUnit
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_McwPlayerProduceUnit;

    /**
     * Decodes a C_McwPlayerProduceUnit message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_McwPlayerProduceUnit
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_McwPlayerProduceUnit;

    /**
     * Verifies a C_McwPlayerProduceUnit message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_McwPlayerProduceUnit message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_McwPlayerProduceUnit
     */
    public static fromObject(object: { [k: string]: any }): C_McwPlayerProduceUnit;

    /**
     * Creates a plain object from a C_McwPlayerProduceUnit message. Also converts values to other types if specified.
     * @param message C_McwPlayerProduceUnit
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_McwPlayerProduceUnit, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_McwPlayerProduceUnit to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_McwPlayerProduceUnit. */
export declare interface IS_McwPlayerProduceUnit {

    /** S_McwPlayerProduceUnit errorCode */
    errorCode?: (number|null);

    /** S_McwPlayerProduceUnit warId */
    warId?: (number|null);

    /** S_McwPlayerProduceUnit actionContainer */
    actionContainer?: (IWarActionContainer|null);
}

/** Represents a S_McwPlayerProduceUnit. */
export declare class S_McwPlayerProduceUnit implements IS_McwPlayerProduceUnit {

    /**
     * Constructs a new S_McwPlayerProduceUnit.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_McwPlayerProduceUnit);

    /** S_McwPlayerProduceUnit errorCode. */
    public errorCode: number;

    /** S_McwPlayerProduceUnit warId. */
    public warId: number;

    /** S_McwPlayerProduceUnit actionContainer. */
    public actionContainer?: (IWarActionContainer|null);

    /**
     * Creates a new S_McwPlayerProduceUnit instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_McwPlayerProduceUnit instance
     */
    public static create(properties?: IS_McwPlayerProduceUnit): S_McwPlayerProduceUnit;

    /**
     * Encodes the specified S_McwPlayerProduceUnit message. Does not implicitly {@link S_McwPlayerProduceUnit.verify|verify} messages.
     * @param message S_McwPlayerProduceUnit message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_McwPlayerProduceUnit, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_McwPlayerProduceUnit message, length delimited. Does not implicitly {@link S_McwPlayerProduceUnit.verify|verify} messages.
     * @param message S_McwPlayerProduceUnit message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_McwPlayerProduceUnit, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_McwPlayerProduceUnit message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_McwPlayerProduceUnit
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_McwPlayerProduceUnit;

    /**
     * Decodes a S_McwPlayerProduceUnit message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_McwPlayerProduceUnit
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_McwPlayerProduceUnit;

    /**
     * Verifies a S_McwPlayerProduceUnit message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_McwPlayerProduceUnit message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_McwPlayerProduceUnit
     */
    public static fromObject(object: { [k: string]: any }): S_McwPlayerProduceUnit;

    /**
     * Creates a plain object from a S_McwPlayerProduceUnit message. Also converts values to other types if specified.
     * @param message S_McwPlayerProduceUnit
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_McwPlayerProduceUnit, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_McwPlayerProduceUnit to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_McwPlayerDeleteUnit. */
export declare interface IC_McwPlayerDeleteUnit {

    /** C_McwPlayerDeleteUnit warId */
    warId?: (number|null);

    /** C_McwPlayerDeleteUnit actionId */
    actionId?: (number|null);

    /** C_McwPlayerDeleteUnit gridIndex */
    gridIndex?: (IGridIndex|null);
}

/** Represents a C_McwPlayerDeleteUnit. */
export declare class C_McwPlayerDeleteUnit implements IC_McwPlayerDeleteUnit {

    /**
     * Constructs a new C_McwPlayerDeleteUnit.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_McwPlayerDeleteUnit);

    /** C_McwPlayerDeleteUnit warId. */
    public warId: number;

    /** C_McwPlayerDeleteUnit actionId. */
    public actionId: number;

    /** C_McwPlayerDeleteUnit gridIndex. */
    public gridIndex?: (IGridIndex|null);

    /**
     * Creates a new C_McwPlayerDeleteUnit instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_McwPlayerDeleteUnit instance
     */
    public static create(properties?: IC_McwPlayerDeleteUnit): C_McwPlayerDeleteUnit;

    /**
     * Encodes the specified C_McwPlayerDeleteUnit message. Does not implicitly {@link C_McwPlayerDeleteUnit.verify|verify} messages.
     * @param message C_McwPlayerDeleteUnit message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_McwPlayerDeleteUnit, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_McwPlayerDeleteUnit message, length delimited. Does not implicitly {@link C_McwPlayerDeleteUnit.verify|verify} messages.
     * @param message C_McwPlayerDeleteUnit message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_McwPlayerDeleteUnit, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_McwPlayerDeleteUnit message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_McwPlayerDeleteUnit
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_McwPlayerDeleteUnit;

    /**
     * Decodes a C_McwPlayerDeleteUnit message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_McwPlayerDeleteUnit
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_McwPlayerDeleteUnit;

    /**
     * Verifies a C_McwPlayerDeleteUnit message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_McwPlayerDeleteUnit message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_McwPlayerDeleteUnit
     */
    public static fromObject(object: { [k: string]: any }): C_McwPlayerDeleteUnit;

    /**
     * Creates a plain object from a C_McwPlayerDeleteUnit message. Also converts values to other types if specified.
     * @param message C_McwPlayerDeleteUnit
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_McwPlayerDeleteUnit, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_McwPlayerDeleteUnit to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_McwPlayerDeleteUnit. */
export declare interface IS_McwPlayerDeleteUnit {

    /** S_McwPlayerDeleteUnit errorCode */
    errorCode?: (number|null);

    /** S_McwPlayerDeleteUnit warId */
    warId?: (number|null);

    /** S_McwPlayerDeleteUnit actionContainer */
    actionContainer?: (IWarActionContainer|null);
}

/** Represents a S_McwPlayerDeleteUnit. */
export declare class S_McwPlayerDeleteUnit implements IS_McwPlayerDeleteUnit {

    /**
     * Constructs a new S_McwPlayerDeleteUnit.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_McwPlayerDeleteUnit);

    /** S_McwPlayerDeleteUnit errorCode. */
    public errorCode: number;

    /** S_McwPlayerDeleteUnit warId. */
    public warId: number;

    /** S_McwPlayerDeleteUnit actionContainer. */
    public actionContainer?: (IWarActionContainer|null);

    /**
     * Creates a new S_McwPlayerDeleteUnit instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_McwPlayerDeleteUnit instance
     */
    public static create(properties?: IS_McwPlayerDeleteUnit): S_McwPlayerDeleteUnit;

    /**
     * Encodes the specified S_McwPlayerDeleteUnit message. Does not implicitly {@link S_McwPlayerDeleteUnit.verify|verify} messages.
     * @param message S_McwPlayerDeleteUnit message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_McwPlayerDeleteUnit, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_McwPlayerDeleteUnit message, length delimited. Does not implicitly {@link S_McwPlayerDeleteUnit.verify|verify} messages.
     * @param message S_McwPlayerDeleteUnit message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_McwPlayerDeleteUnit, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_McwPlayerDeleteUnit message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_McwPlayerDeleteUnit
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_McwPlayerDeleteUnit;

    /**
     * Decodes a S_McwPlayerDeleteUnit message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_McwPlayerDeleteUnit
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_McwPlayerDeleteUnit;

    /**
     * Verifies a S_McwPlayerDeleteUnit message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_McwPlayerDeleteUnit message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_McwPlayerDeleteUnit
     */
    public static fromObject(object: { [k: string]: any }): S_McwPlayerDeleteUnit;

    /**
     * Creates a plain object from a S_McwPlayerDeleteUnit message. Also converts values to other types if specified.
     * @param message S_McwPlayerDeleteUnit
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_McwPlayerDeleteUnit, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_McwPlayerDeleteUnit to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_McwPlayerVoteForDraw. */
export declare interface IC_McwPlayerVoteForDraw {

    /** C_McwPlayerVoteForDraw warId */
    warId?: (number|null);

    /** C_McwPlayerVoteForDraw actionId */
    actionId?: (number|null);

    /** C_McwPlayerVoteForDraw isAgree */
    isAgree?: (boolean|null);
}

/** Represents a C_McwPlayerVoteForDraw. */
export declare class C_McwPlayerVoteForDraw implements IC_McwPlayerVoteForDraw {

    /**
     * Constructs a new C_McwPlayerVoteForDraw.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_McwPlayerVoteForDraw);

    /** C_McwPlayerVoteForDraw warId. */
    public warId: number;

    /** C_McwPlayerVoteForDraw actionId. */
    public actionId: number;

    /** C_McwPlayerVoteForDraw isAgree. */
    public isAgree: boolean;

    /**
     * Creates a new C_McwPlayerVoteForDraw instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_McwPlayerVoteForDraw instance
     */
    public static create(properties?: IC_McwPlayerVoteForDraw): C_McwPlayerVoteForDraw;

    /**
     * Encodes the specified C_McwPlayerVoteForDraw message. Does not implicitly {@link C_McwPlayerVoteForDraw.verify|verify} messages.
     * @param message C_McwPlayerVoteForDraw message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_McwPlayerVoteForDraw, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_McwPlayerVoteForDraw message, length delimited. Does not implicitly {@link C_McwPlayerVoteForDraw.verify|verify} messages.
     * @param message C_McwPlayerVoteForDraw message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_McwPlayerVoteForDraw, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_McwPlayerVoteForDraw message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_McwPlayerVoteForDraw
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_McwPlayerVoteForDraw;

    /**
     * Decodes a C_McwPlayerVoteForDraw message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_McwPlayerVoteForDraw
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_McwPlayerVoteForDraw;

    /**
     * Verifies a C_McwPlayerVoteForDraw message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_McwPlayerVoteForDraw message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_McwPlayerVoteForDraw
     */
    public static fromObject(object: { [k: string]: any }): C_McwPlayerVoteForDraw;

    /**
     * Creates a plain object from a C_McwPlayerVoteForDraw message. Also converts values to other types if specified.
     * @param message C_McwPlayerVoteForDraw
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_McwPlayerVoteForDraw, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_McwPlayerVoteForDraw to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_McwPlayerVoteForDraw. */
export declare interface IS_McwPlayerVoteForDraw {

    /** S_McwPlayerVoteForDraw errorCode */
    errorCode?: (number|null);

    /** S_McwPlayerVoteForDraw warId */
    warId?: (number|null);

    /** S_McwPlayerVoteForDraw actionContainer */
    actionContainer?: (IWarActionContainer|null);
}

/** Represents a S_McwPlayerVoteForDraw. */
export declare class S_McwPlayerVoteForDraw implements IS_McwPlayerVoteForDraw {

    /**
     * Constructs a new S_McwPlayerVoteForDraw.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_McwPlayerVoteForDraw);

    /** S_McwPlayerVoteForDraw errorCode. */
    public errorCode: number;

    /** S_McwPlayerVoteForDraw warId. */
    public warId: number;

    /** S_McwPlayerVoteForDraw actionContainer. */
    public actionContainer?: (IWarActionContainer|null);

    /**
     * Creates a new S_McwPlayerVoteForDraw instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_McwPlayerVoteForDraw instance
     */
    public static create(properties?: IS_McwPlayerVoteForDraw): S_McwPlayerVoteForDraw;

    /**
     * Encodes the specified S_McwPlayerVoteForDraw message. Does not implicitly {@link S_McwPlayerVoteForDraw.verify|verify} messages.
     * @param message S_McwPlayerVoteForDraw message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_McwPlayerVoteForDraw, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_McwPlayerVoteForDraw message, length delimited. Does not implicitly {@link S_McwPlayerVoteForDraw.verify|verify} messages.
     * @param message S_McwPlayerVoteForDraw message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_McwPlayerVoteForDraw, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_McwPlayerVoteForDraw message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_McwPlayerVoteForDraw
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_McwPlayerVoteForDraw;

    /**
     * Decodes a S_McwPlayerVoteForDraw message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_McwPlayerVoteForDraw
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_McwPlayerVoteForDraw;

    /**
     * Verifies a S_McwPlayerVoteForDraw message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_McwPlayerVoteForDraw message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_McwPlayerVoteForDraw
     */
    public static fromObject(object: { [k: string]: any }): S_McwPlayerVoteForDraw;

    /**
     * Creates a plain object from a S_McwPlayerVoteForDraw message. Also converts values to other types if specified.
     * @param message S_McwPlayerVoteForDraw
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_McwPlayerVoteForDraw, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_McwPlayerVoteForDraw to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_McwUnitWait. */
export declare interface IC_McwUnitWait {

    /** C_McwUnitWait warId */
    warId?: (number|null);

    /** C_McwUnitWait actionId */
    actionId?: (number|null);

    /** C_McwUnitWait path */
    path?: (IGridIndex[]|null);

    /** C_McwUnitWait launchUnitId */
    launchUnitId?: (number|null);
}

/** Represents a C_McwUnitWait. */
export declare class C_McwUnitWait implements IC_McwUnitWait {

    /**
     * Constructs a new C_McwUnitWait.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_McwUnitWait);

    /** C_McwUnitWait warId. */
    public warId: number;

    /** C_McwUnitWait actionId. */
    public actionId: number;

    /** C_McwUnitWait path. */
    public path: IGridIndex[];

    /** C_McwUnitWait launchUnitId. */
    public launchUnitId: number;

    /**
     * Creates a new C_McwUnitWait instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_McwUnitWait instance
     */
    public static create(properties?: IC_McwUnitWait): C_McwUnitWait;

    /**
     * Encodes the specified C_McwUnitWait message. Does not implicitly {@link C_McwUnitWait.verify|verify} messages.
     * @param message C_McwUnitWait message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_McwUnitWait, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_McwUnitWait message, length delimited. Does not implicitly {@link C_McwUnitWait.verify|verify} messages.
     * @param message C_McwUnitWait message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_McwUnitWait, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_McwUnitWait message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_McwUnitWait
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_McwUnitWait;

    /**
     * Decodes a C_McwUnitWait message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_McwUnitWait
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_McwUnitWait;

    /**
     * Verifies a C_McwUnitWait message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_McwUnitWait message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_McwUnitWait
     */
    public static fromObject(object: { [k: string]: any }): C_McwUnitWait;

    /**
     * Creates a plain object from a C_McwUnitWait message. Also converts values to other types if specified.
     * @param message C_McwUnitWait
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_McwUnitWait, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_McwUnitWait to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_McwUnitWait. */
export declare interface IS_McwUnitWait {

    /** S_McwUnitWait errorCode */
    errorCode?: (number|null);

    /** S_McwUnitWait warId */
    warId?: (number|null);

    /** S_McwUnitWait actionContainer */
    actionContainer?: (IWarActionContainer|null);
}

/** Represents a S_McwUnitWait. */
export declare class S_McwUnitWait implements IS_McwUnitWait {

    /**
     * Constructs a new S_McwUnitWait.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_McwUnitWait);

    /** S_McwUnitWait errorCode. */
    public errorCode: number;

    /** S_McwUnitWait warId. */
    public warId: number;

    /** S_McwUnitWait actionContainer. */
    public actionContainer?: (IWarActionContainer|null);

    /**
     * Creates a new S_McwUnitWait instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_McwUnitWait instance
     */
    public static create(properties?: IS_McwUnitWait): S_McwUnitWait;

    /**
     * Encodes the specified S_McwUnitWait message. Does not implicitly {@link S_McwUnitWait.verify|verify} messages.
     * @param message S_McwUnitWait message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_McwUnitWait, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_McwUnitWait message, length delimited. Does not implicitly {@link S_McwUnitWait.verify|verify} messages.
     * @param message S_McwUnitWait message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_McwUnitWait, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_McwUnitWait message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_McwUnitWait
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_McwUnitWait;

    /**
     * Decodes a S_McwUnitWait message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_McwUnitWait
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_McwUnitWait;

    /**
     * Verifies a S_McwUnitWait message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_McwUnitWait message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_McwUnitWait
     */
    public static fromObject(object: { [k: string]: any }): S_McwUnitWait;

    /**
     * Creates a plain object from a S_McwUnitWait message. Also converts values to other types if specified.
     * @param message S_McwUnitWait
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_McwUnitWait, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_McwUnitWait to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_McwUnitBeLoaded. */
export declare interface IC_McwUnitBeLoaded {

    /** C_McwUnitBeLoaded warId */
    warId?: (number|null);

    /** C_McwUnitBeLoaded actionId */
    actionId?: (number|null);

    /** C_McwUnitBeLoaded path */
    path?: (IGridIndex[]|null);

    /** C_McwUnitBeLoaded launchUnitId */
    launchUnitId?: (number|null);
}

/** Represents a C_McwUnitBeLoaded. */
export declare class C_McwUnitBeLoaded implements IC_McwUnitBeLoaded {

    /**
     * Constructs a new C_McwUnitBeLoaded.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_McwUnitBeLoaded);

    /** C_McwUnitBeLoaded warId. */
    public warId: number;

    /** C_McwUnitBeLoaded actionId. */
    public actionId: number;

    /** C_McwUnitBeLoaded path. */
    public path: IGridIndex[];

    /** C_McwUnitBeLoaded launchUnitId. */
    public launchUnitId: number;

    /**
     * Creates a new C_McwUnitBeLoaded instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_McwUnitBeLoaded instance
     */
    public static create(properties?: IC_McwUnitBeLoaded): C_McwUnitBeLoaded;

    /**
     * Encodes the specified C_McwUnitBeLoaded message. Does not implicitly {@link C_McwUnitBeLoaded.verify|verify} messages.
     * @param message C_McwUnitBeLoaded message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_McwUnitBeLoaded, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_McwUnitBeLoaded message, length delimited. Does not implicitly {@link C_McwUnitBeLoaded.verify|verify} messages.
     * @param message C_McwUnitBeLoaded message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_McwUnitBeLoaded, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_McwUnitBeLoaded message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_McwUnitBeLoaded
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_McwUnitBeLoaded;

    /**
     * Decodes a C_McwUnitBeLoaded message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_McwUnitBeLoaded
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_McwUnitBeLoaded;

    /**
     * Verifies a C_McwUnitBeLoaded message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_McwUnitBeLoaded message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_McwUnitBeLoaded
     */
    public static fromObject(object: { [k: string]: any }): C_McwUnitBeLoaded;

    /**
     * Creates a plain object from a C_McwUnitBeLoaded message. Also converts values to other types if specified.
     * @param message C_McwUnitBeLoaded
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_McwUnitBeLoaded, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_McwUnitBeLoaded to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_McwUnitBeLoaded. */
export declare interface IS_McwUnitBeLoaded {

    /** S_McwUnitBeLoaded errorCode */
    errorCode?: (number|null);

    /** S_McwUnitBeLoaded warId */
    warId?: (number|null);

    /** S_McwUnitBeLoaded actionContainer */
    actionContainer?: (IWarActionContainer|null);
}

/** Represents a S_McwUnitBeLoaded. */
export declare class S_McwUnitBeLoaded implements IS_McwUnitBeLoaded {

    /**
     * Constructs a new S_McwUnitBeLoaded.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_McwUnitBeLoaded);

    /** S_McwUnitBeLoaded errorCode. */
    public errorCode: number;

    /** S_McwUnitBeLoaded warId. */
    public warId: number;

    /** S_McwUnitBeLoaded actionContainer. */
    public actionContainer?: (IWarActionContainer|null);

    /**
     * Creates a new S_McwUnitBeLoaded instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_McwUnitBeLoaded instance
     */
    public static create(properties?: IS_McwUnitBeLoaded): S_McwUnitBeLoaded;

    /**
     * Encodes the specified S_McwUnitBeLoaded message. Does not implicitly {@link S_McwUnitBeLoaded.verify|verify} messages.
     * @param message S_McwUnitBeLoaded message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_McwUnitBeLoaded, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_McwUnitBeLoaded message, length delimited. Does not implicitly {@link S_McwUnitBeLoaded.verify|verify} messages.
     * @param message S_McwUnitBeLoaded message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_McwUnitBeLoaded, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_McwUnitBeLoaded message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_McwUnitBeLoaded
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_McwUnitBeLoaded;

    /**
     * Decodes a S_McwUnitBeLoaded message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_McwUnitBeLoaded
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_McwUnitBeLoaded;

    /**
     * Verifies a S_McwUnitBeLoaded message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_McwUnitBeLoaded message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_McwUnitBeLoaded
     */
    public static fromObject(object: { [k: string]: any }): S_McwUnitBeLoaded;

    /**
     * Creates a plain object from a S_McwUnitBeLoaded message. Also converts values to other types if specified.
     * @param message S_McwUnitBeLoaded
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_McwUnitBeLoaded, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_McwUnitBeLoaded to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_McwUnitCaptureTile. */
export declare interface IC_McwUnitCaptureTile {

    /** C_McwUnitCaptureTile warId */
    warId?: (number|null);

    /** C_McwUnitCaptureTile actionId */
    actionId?: (number|null);

    /** C_McwUnitCaptureTile path */
    path?: (IGridIndex[]|null);

    /** C_McwUnitCaptureTile launchUnitId */
    launchUnitId?: (number|null);
}

/** Represents a C_McwUnitCaptureTile. */
export declare class C_McwUnitCaptureTile implements IC_McwUnitCaptureTile {

    /**
     * Constructs a new C_McwUnitCaptureTile.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_McwUnitCaptureTile);

    /** C_McwUnitCaptureTile warId. */
    public warId: number;

    /** C_McwUnitCaptureTile actionId. */
    public actionId: number;

    /** C_McwUnitCaptureTile path. */
    public path: IGridIndex[];

    /** C_McwUnitCaptureTile launchUnitId. */
    public launchUnitId: number;

    /**
     * Creates a new C_McwUnitCaptureTile instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_McwUnitCaptureTile instance
     */
    public static create(properties?: IC_McwUnitCaptureTile): C_McwUnitCaptureTile;

    /**
     * Encodes the specified C_McwUnitCaptureTile message. Does not implicitly {@link C_McwUnitCaptureTile.verify|verify} messages.
     * @param message C_McwUnitCaptureTile message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_McwUnitCaptureTile, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_McwUnitCaptureTile message, length delimited. Does not implicitly {@link C_McwUnitCaptureTile.verify|verify} messages.
     * @param message C_McwUnitCaptureTile message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_McwUnitCaptureTile, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_McwUnitCaptureTile message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_McwUnitCaptureTile
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_McwUnitCaptureTile;

    /**
     * Decodes a C_McwUnitCaptureTile message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_McwUnitCaptureTile
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_McwUnitCaptureTile;

    /**
     * Verifies a C_McwUnitCaptureTile message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_McwUnitCaptureTile message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_McwUnitCaptureTile
     */
    public static fromObject(object: { [k: string]: any }): C_McwUnitCaptureTile;

    /**
     * Creates a plain object from a C_McwUnitCaptureTile message. Also converts values to other types if specified.
     * @param message C_McwUnitCaptureTile
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_McwUnitCaptureTile, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_McwUnitCaptureTile to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_McwUnitCaptureTile. */
export declare interface IS_McwUnitCaptureTile {

    /** S_McwUnitCaptureTile errorCode */
    errorCode?: (number|null);

    /** S_McwUnitCaptureTile warId */
    warId?: (number|null);

    /** S_McwUnitCaptureTile actionContainer */
    actionContainer?: (IWarActionContainer|null);
}

/** Represents a S_McwUnitCaptureTile. */
export declare class S_McwUnitCaptureTile implements IS_McwUnitCaptureTile {

    /**
     * Constructs a new S_McwUnitCaptureTile.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_McwUnitCaptureTile);

    /** S_McwUnitCaptureTile errorCode. */
    public errorCode: number;

    /** S_McwUnitCaptureTile warId. */
    public warId: number;

    /** S_McwUnitCaptureTile actionContainer. */
    public actionContainer?: (IWarActionContainer|null);

    /**
     * Creates a new S_McwUnitCaptureTile instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_McwUnitCaptureTile instance
     */
    public static create(properties?: IS_McwUnitCaptureTile): S_McwUnitCaptureTile;

    /**
     * Encodes the specified S_McwUnitCaptureTile message. Does not implicitly {@link S_McwUnitCaptureTile.verify|verify} messages.
     * @param message S_McwUnitCaptureTile message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_McwUnitCaptureTile, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_McwUnitCaptureTile message, length delimited. Does not implicitly {@link S_McwUnitCaptureTile.verify|verify} messages.
     * @param message S_McwUnitCaptureTile message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_McwUnitCaptureTile, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_McwUnitCaptureTile message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_McwUnitCaptureTile
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_McwUnitCaptureTile;

    /**
     * Decodes a S_McwUnitCaptureTile message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_McwUnitCaptureTile
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_McwUnitCaptureTile;

    /**
     * Verifies a S_McwUnitCaptureTile message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_McwUnitCaptureTile message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_McwUnitCaptureTile
     */
    public static fromObject(object: { [k: string]: any }): S_McwUnitCaptureTile;

    /**
     * Creates a plain object from a S_McwUnitCaptureTile message. Also converts values to other types if specified.
     * @param message S_McwUnitCaptureTile
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_McwUnitCaptureTile, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_McwUnitCaptureTile to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_McwUnitAttack. */
export declare interface IC_McwUnitAttack {

    /** C_McwUnitAttack warId */
    warId?: (number|null);

    /** C_McwUnitAttack actionId */
    actionId?: (number|null);

    /** C_McwUnitAttack path */
    path?: (IGridIndex[]|null);

    /** C_McwUnitAttack launchUnitId */
    launchUnitId?: (number|null);

    /** C_McwUnitAttack targetGridIndex */
    targetGridIndex?: (IGridIndex|null);
}

/** Represents a C_McwUnitAttack. */
export declare class C_McwUnitAttack implements IC_McwUnitAttack {

    /**
     * Constructs a new C_McwUnitAttack.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_McwUnitAttack);

    /** C_McwUnitAttack warId. */
    public warId: number;

    /** C_McwUnitAttack actionId. */
    public actionId: number;

    /** C_McwUnitAttack path. */
    public path: IGridIndex[];

    /** C_McwUnitAttack launchUnitId. */
    public launchUnitId: number;

    /** C_McwUnitAttack targetGridIndex. */
    public targetGridIndex?: (IGridIndex|null);

    /**
     * Creates a new C_McwUnitAttack instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_McwUnitAttack instance
     */
    public static create(properties?: IC_McwUnitAttack): C_McwUnitAttack;

    /**
     * Encodes the specified C_McwUnitAttack message. Does not implicitly {@link C_McwUnitAttack.verify|verify} messages.
     * @param message C_McwUnitAttack message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_McwUnitAttack, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_McwUnitAttack message, length delimited. Does not implicitly {@link C_McwUnitAttack.verify|verify} messages.
     * @param message C_McwUnitAttack message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_McwUnitAttack, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_McwUnitAttack message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_McwUnitAttack
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_McwUnitAttack;

    /**
     * Decodes a C_McwUnitAttack message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_McwUnitAttack
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_McwUnitAttack;

    /**
     * Verifies a C_McwUnitAttack message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_McwUnitAttack message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_McwUnitAttack
     */
    public static fromObject(object: { [k: string]: any }): C_McwUnitAttack;

    /**
     * Creates a plain object from a C_McwUnitAttack message. Also converts values to other types if specified.
     * @param message C_McwUnitAttack
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_McwUnitAttack, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_McwUnitAttack to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_McwUnitAttack. */
export declare interface IS_McwUnitAttack {

    /** S_McwUnitAttack errorCode */
    errorCode?: (number|null);

    /** S_McwUnitAttack warId */
    warId?: (number|null);

    /** S_McwUnitAttack actionContainer */
    actionContainer?: (IWarActionContainer|null);
}

/** Represents a S_McwUnitAttack. */
export declare class S_McwUnitAttack implements IS_McwUnitAttack {

    /**
     * Constructs a new S_McwUnitAttack.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_McwUnitAttack);

    /** S_McwUnitAttack errorCode. */
    public errorCode: number;

    /** S_McwUnitAttack warId. */
    public warId: number;

    /** S_McwUnitAttack actionContainer. */
    public actionContainer?: (IWarActionContainer|null);

    /**
     * Creates a new S_McwUnitAttack instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_McwUnitAttack instance
     */
    public static create(properties?: IS_McwUnitAttack): S_McwUnitAttack;

    /**
     * Encodes the specified S_McwUnitAttack message. Does not implicitly {@link S_McwUnitAttack.verify|verify} messages.
     * @param message S_McwUnitAttack message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_McwUnitAttack, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_McwUnitAttack message, length delimited. Does not implicitly {@link S_McwUnitAttack.verify|verify} messages.
     * @param message S_McwUnitAttack message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_McwUnitAttack, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_McwUnitAttack message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_McwUnitAttack
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_McwUnitAttack;

    /**
     * Decodes a S_McwUnitAttack message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_McwUnitAttack
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_McwUnitAttack;

    /**
     * Verifies a S_McwUnitAttack message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_McwUnitAttack message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_McwUnitAttack
     */
    public static fromObject(object: { [k: string]: any }): S_McwUnitAttack;

    /**
     * Creates a plain object from a S_McwUnitAttack message. Also converts values to other types if specified.
     * @param message S_McwUnitAttack
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_McwUnitAttack, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_McwUnitAttack to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_McwUnitDrop. */
export declare interface IC_McwUnitDrop {

    /** C_McwUnitDrop warId */
    warId?: (number|null);

    /** C_McwUnitDrop actionId */
    actionId?: (number|null);

    /** C_McwUnitDrop path */
    path?: (IGridIndex[]|null);

    /** C_McwUnitDrop launchUnitId */
    launchUnitId?: (number|null);

    /** C_McwUnitDrop dropDestinations */
    dropDestinations?: (IDropDestination[]|null);
}

/** Represents a C_McwUnitDrop. */
export declare class C_McwUnitDrop implements IC_McwUnitDrop {

    /**
     * Constructs a new C_McwUnitDrop.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_McwUnitDrop);

    /** C_McwUnitDrop warId. */
    public warId: number;

    /** C_McwUnitDrop actionId. */
    public actionId: number;

    /** C_McwUnitDrop path. */
    public path: IGridIndex[];

    /** C_McwUnitDrop launchUnitId. */
    public launchUnitId: number;

    /** C_McwUnitDrop dropDestinations. */
    public dropDestinations: IDropDestination[];

    /**
     * Creates a new C_McwUnitDrop instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_McwUnitDrop instance
     */
    public static create(properties?: IC_McwUnitDrop): C_McwUnitDrop;

    /**
     * Encodes the specified C_McwUnitDrop message. Does not implicitly {@link C_McwUnitDrop.verify|verify} messages.
     * @param message C_McwUnitDrop message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_McwUnitDrop, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_McwUnitDrop message, length delimited. Does not implicitly {@link C_McwUnitDrop.verify|verify} messages.
     * @param message C_McwUnitDrop message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_McwUnitDrop, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_McwUnitDrop message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_McwUnitDrop
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_McwUnitDrop;

    /**
     * Decodes a C_McwUnitDrop message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_McwUnitDrop
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_McwUnitDrop;

    /**
     * Verifies a C_McwUnitDrop message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_McwUnitDrop message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_McwUnitDrop
     */
    public static fromObject(object: { [k: string]: any }): C_McwUnitDrop;

    /**
     * Creates a plain object from a C_McwUnitDrop message. Also converts values to other types if specified.
     * @param message C_McwUnitDrop
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_McwUnitDrop, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_McwUnitDrop to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_McwUnitDrop. */
export declare interface IS_McwUnitDrop {

    /** S_McwUnitDrop errorCode */
    errorCode?: (number|null);

    /** S_McwUnitDrop warId */
    warId?: (number|null);

    /** S_McwUnitDrop actionContainer */
    actionContainer?: (IWarActionContainer|null);
}

/** Represents a S_McwUnitDrop. */
export declare class S_McwUnitDrop implements IS_McwUnitDrop {

    /**
     * Constructs a new S_McwUnitDrop.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_McwUnitDrop);

    /** S_McwUnitDrop errorCode. */
    public errorCode: number;

    /** S_McwUnitDrop warId. */
    public warId: number;

    /** S_McwUnitDrop actionContainer. */
    public actionContainer?: (IWarActionContainer|null);

    /**
     * Creates a new S_McwUnitDrop instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_McwUnitDrop instance
     */
    public static create(properties?: IS_McwUnitDrop): S_McwUnitDrop;

    /**
     * Encodes the specified S_McwUnitDrop message. Does not implicitly {@link S_McwUnitDrop.verify|verify} messages.
     * @param message S_McwUnitDrop message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_McwUnitDrop, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_McwUnitDrop message, length delimited. Does not implicitly {@link S_McwUnitDrop.verify|verify} messages.
     * @param message S_McwUnitDrop message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_McwUnitDrop, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_McwUnitDrop message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_McwUnitDrop
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_McwUnitDrop;

    /**
     * Decodes a S_McwUnitDrop message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_McwUnitDrop
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_McwUnitDrop;

    /**
     * Verifies a S_McwUnitDrop message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_McwUnitDrop message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_McwUnitDrop
     */
    public static fromObject(object: { [k: string]: any }): S_McwUnitDrop;

    /**
     * Creates a plain object from a S_McwUnitDrop message. Also converts values to other types if specified.
     * @param message S_McwUnitDrop
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_McwUnitDrop, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_McwUnitDrop to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_McwUnitBuildTile. */
export declare interface IC_McwUnitBuildTile {

    /** C_McwUnitBuildTile warId */
    warId?: (number|null);

    /** C_McwUnitBuildTile actionId */
    actionId?: (number|null);

    /** C_McwUnitBuildTile path */
    path?: (IGridIndex[]|null);

    /** C_McwUnitBuildTile launchUnitId */
    launchUnitId?: (number|null);
}

/** Represents a C_McwUnitBuildTile. */
export declare class C_McwUnitBuildTile implements IC_McwUnitBuildTile {

    /**
     * Constructs a new C_McwUnitBuildTile.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_McwUnitBuildTile);

    /** C_McwUnitBuildTile warId. */
    public warId: number;

    /** C_McwUnitBuildTile actionId. */
    public actionId: number;

    /** C_McwUnitBuildTile path. */
    public path: IGridIndex[];

    /** C_McwUnitBuildTile launchUnitId. */
    public launchUnitId: number;

    /**
     * Creates a new C_McwUnitBuildTile instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_McwUnitBuildTile instance
     */
    public static create(properties?: IC_McwUnitBuildTile): C_McwUnitBuildTile;

    /**
     * Encodes the specified C_McwUnitBuildTile message. Does not implicitly {@link C_McwUnitBuildTile.verify|verify} messages.
     * @param message C_McwUnitBuildTile message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_McwUnitBuildTile, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_McwUnitBuildTile message, length delimited. Does not implicitly {@link C_McwUnitBuildTile.verify|verify} messages.
     * @param message C_McwUnitBuildTile message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_McwUnitBuildTile, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_McwUnitBuildTile message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_McwUnitBuildTile
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_McwUnitBuildTile;

    /**
     * Decodes a C_McwUnitBuildTile message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_McwUnitBuildTile
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_McwUnitBuildTile;

    /**
     * Verifies a C_McwUnitBuildTile message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_McwUnitBuildTile message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_McwUnitBuildTile
     */
    public static fromObject(object: { [k: string]: any }): C_McwUnitBuildTile;

    /**
     * Creates a plain object from a C_McwUnitBuildTile message. Also converts values to other types if specified.
     * @param message C_McwUnitBuildTile
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_McwUnitBuildTile, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_McwUnitBuildTile to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_McwUnitBuildTile. */
export declare interface IS_McwUnitBuildTile {

    /** S_McwUnitBuildTile errorCode */
    errorCode?: (number|null);

    /** S_McwUnitBuildTile warId */
    warId?: (number|null);

    /** S_McwUnitBuildTile actionContainer */
    actionContainer?: (IWarActionContainer|null);
}

/** Represents a S_McwUnitBuildTile. */
export declare class S_McwUnitBuildTile implements IS_McwUnitBuildTile {

    /**
     * Constructs a new S_McwUnitBuildTile.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_McwUnitBuildTile);

    /** S_McwUnitBuildTile errorCode. */
    public errorCode: number;

    /** S_McwUnitBuildTile warId. */
    public warId: number;

    /** S_McwUnitBuildTile actionContainer. */
    public actionContainer?: (IWarActionContainer|null);

    /**
     * Creates a new S_McwUnitBuildTile instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_McwUnitBuildTile instance
     */
    public static create(properties?: IS_McwUnitBuildTile): S_McwUnitBuildTile;

    /**
     * Encodes the specified S_McwUnitBuildTile message. Does not implicitly {@link S_McwUnitBuildTile.verify|verify} messages.
     * @param message S_McwUnitBuildTile message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_McwUnitBuildTile, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_McwUnitBuildTile message, length delimited. Does not implicitly {@link S_McwUnitBuildTile.verify|verify} messages.
     * @param message S_McwUnitBuildTile message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_McwUnitBuildTile, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_McwUnitBuildTile message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_McwUnitBuildTile
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_McwUnitBuildTile;

    /**
     * Decodes a S_McwUnitBuildTile message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_McwUnitBuildTile
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_McwUnitBuildTile;

    /**
     * Verifies a S_McwUnitBuildTile message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_McwUnitBuildTile message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_McwUnitBuildTile
     */
    public static fromObject(object: { [k: string]: any }): S_McwUnitBuildTile;

    /**
     * Creates a plain object from a S_McwUnitBuildTile message. Also converts values to other types if specified.
     * @param message S_McwUnitBuildTile
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_McwUnitBuildTile, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_McwUnitBuildTile to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_McwUnitDive. */
export declare interface IC_McwUnitDive {

    /** C_McwUnitDive warId */
    warId?: (number|null);

    /** C_McwUnitDive actionId */
    actionId?: (number|null);

    /** C_McwUnitDive path */
    path?: (IGridIndex[]|null);

    /** C_McwUnitDive launchUnitId */
    launchUnitId?: (number|null);
}

/** Represents a C_McwUnitDive. */
export declare class C_McwUnitDive implements IC_McwUnitDive {

    /**
     * Constructs a new C_McwUnitDive.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_McwUnitDive);

    /** C_McwUnitDive warId. */
    public warId: number;

    /** C_McwUnitDive actionId. */
    public actionId: number;

    /** C_McwUnitDive path. */
    public path: IGridIndex[];

    /** C_McwUnitDive launchUnitId. */
    public launchUnitId: number;

    /**
     * Creates a new C_McwUnitDive instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_McwUnitDive instance
     */
    public static create(properties?: IC_McwUnitDive): C_McwUnitDive;

    /**
     * Encodes the specified C_McwUnitDive message. Does not implicitly {@link C_McwUnitDive.verify|verify} messages.
     * @param message C_McwUnitDive message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_McwUnitDive, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_McwUnitDive message, length delimited. Does not implicitly {@link C_McwUnitDive.verify|verify} messages.
     * @param message C_McwUnitDive message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_McwUnitDive, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_McwUnitDive message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_McwUnitDive
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_McwUnitDive;

    /**
     * Decodes a C_McwUnitDive message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_McwUnitDive
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_McwUnitDive;

    /**
     * Verifies a C_McwUnitDive message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_McwUnitDive message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_McwUnitDive
     */
    public static fromObject(object: { [k: string]: any }): C_McwUnitDive;

    /**
     * Creates a plain object from a C_McwUnitDive message. Also converts values to other types if specified.
     * @param message C_McwUnitDive
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_McwUnitDive, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_McwUnitDive to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_McwUnitDive. */
export declare interface IS_McwUnitDive {

    /** S_McwUnitDive errorCode */
    errorCode?: (number|null);

    /** S_McwUnitDive warId */
    warId?: (number|null);

    /** S_McwUnitDive actionContainer */
    actionContainer?: (IWarActionContainer|null);
}

/** Represents a S_McwUnitDive. */
export declare class S_McwUnitDive implements IS_McwUnitDive {

    /**
     * Constructs a new S_McwUnitDive.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_McwUnitDive);

    /** S_McwUnitDive errorCode. */
    public errorCode: number;

    /** S_McwUnitDive warId. */
    public warId: number;

    /** S_McwUnitDive actionContainer. */
    public actionContainer?: (IWarActionContainer|null);

    /**
     * Creates a new S_McwUnitDive instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_McwUnitDive instance
     */
    public static create(properties?: IS_McwUnitDive): S_McwUnitDive;

    /**
     * Encodes the specified S_McwUnitDive message. Does not implicitly {@link S_McwUnitDive.verify|verify} messages.
     * @param message S_McwUnitDive message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_McwUnitDive, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_McwUnitDive message, length delimited. Does not implicitly {@link S_McwUnitDive.verify|verify} messages.
     * @param message S_McwUnitDive message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_McwUnitDive, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_McwUnitDive message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_McwUnitDive
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_McwUnitDive;

    /**
     * Decodes a S_McwUnitDive message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_McwUnitDive
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_McwUnitDive;

    /**
     * Verifies a S_McwUnitDive message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_McwUnitDive message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_McwUnitDive
     */
    public static fromObject(object: { [k: string]: any }): S_McwUnitDive;

    /**
     * Creates a plain object from a S_McwUnitDive message. Also converts values to other types if specified.
     * @param message S_McwUnitDive
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_McwUnitDive, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_McwUnitDive to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_McwUnitSurface. */
export declare interface IC_McwUnitSurface {

    /** C_McwUnitSurface warId */
    warId?: (number|null);

    /** C_McwUnitSurface actionId */
    actionId?: (number|null);

    /** C_McwUnitSurface path */
    path?: (IGridIndex[]|null);

    /** C_McwUnitSurface launchUnitId */
    launchUnitId?: (number|null);
}

/** Represents a C_McwUnitSurface. */
export declare class C_McwUnitSurface implements IC_McwUnitSurface {

    /**
     * Constructs a new C_McwUnitSurface.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_McwUnitSurface);

    /** C_McwUnitSurface warId. */
    public warId: number;

    /** C_McwUnitSurface actionId. */
    public actionId: number;

    /** C_McwUnitSurface path. */
    public path: IGridIndex[];

    /** C_McwUnitSurface launchUnitId. */
    public launchUnitId: number;

    /**
     * Creates a new C_McwUnitSurface instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_McwUnitSurface instance
     */
    public static create(properties?: IC_McwUnitSurface): C_McwUnitSurface;

    /**
     * Encodes the specified C_McwUnitSurface message. Does not implicitly {@link C_McwUnitSurface.verify|verify} messages.
     * @param message C_McwUnitSurface message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_McwUnitSurface, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_McwUnitSurface message, length delimited. Does not implicitly {@link C_McwUnitSurface.verify|verify} messages.
     * @param message C_McwUnitSurface message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_McwUnitSurface, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_McwUnitSurface message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_McwUnitSurface
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_McwUnitSurface;

    /**
     * Decodes a C_McwUnitSurface message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_McwUnitSurface
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_McwUnitSurface;

    /**
     * Verifies a C_McwUnitSurface message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_McwUnitSurface message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_McwUnitSurface
     */
    public static fromObject(object: { [k: string]: any }): C_McwUnitSurface;

    /**
     * Creates a plain object from a C_McwUnitSurface message. Also converts values to other types if specified.
     * @param message C_McwUnitSurface
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_McwUnitSurface, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_McwUnitSurface to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_McwUnitSurface. */
export declare interface IS_McwUnitSurface {

    /** S_McwUnitSurface errorCode */
    errorCode?: (number|null);

    /** S_McwUnitSurface warId */
    warId?: (number|null);

    /** S_McwUnitSurface actionContainer */
    actionContainer?: (IWarActionContainer|null);
}

/** Represents a S_McwUnitSurface. */
export declare class S_McwUnitSurface implements IS_McwUnitSurface {

    /**
     * Constructs a new S_McwUnitSurface.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_McwUnitSurface);

    /** S_McwUnitSurface errorCode. */
    public errorCode: number;

    /** S_McwUnitSurface warId. */
    public warId: number;

    /** S_McwUnitSurface actionContainer. */
    public actionContainer?: (IWarActionContainer|null);

    /**
     * Creates a new S_McwUnitSurface instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_McwUnitSurface instance
     */
    public static create(properties?: IS_McwUnitSurface): S_McwUnitSurface;

    /**
     * Encodes the specified S_McwUnitSurface message. Does not implicitly {@link S_McwUnitSurface.verify|verify} messages.
     * @param message S_McwUnitSurface message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_McwUnitSurface, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_McwUnitSurface message, length delimited. Does not implicitly {@link S_McwUnitSurface.verify|verify} messages.
     * @param message S_McwUnitSurface message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_McwUnitSurface, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_McwUnitSurface message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_McwUnitSurface
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_McwUnitSurface;

    /**
     * Decodes a S_McwUnitSurface message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_McwUnitSurface
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_McwUnitSurface;

    /**
     * Verifies a S_McwUnitSurface message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_McwUnitSurface message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_McwUnitSurface
     */
    public static fromObject(object: { [k: string]: any }): S_McwUnitSurface;

    /**
     * Creates a plain object from a S_McwUnitSurface message. Also converts values to other types if specified.
     * @param message S_McwUnitSurface
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_McwUnitSurface, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_McwUnitSurface to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_McwUnitJoin. */
export declare interface IC_McwUnitJoin {

    /** C_McwUnitJoin warId */
    warId?: (number|null);

    /** C_McwUnitJoin actionId */
    actionId?: (number|null);

    /** C_McwUnitJoin path */
    path?: (IGridIndex[]|null);

    /** C_McwUnitJoin launchUnitId */
    launchUnitId?: (number|null);
}

/** Represents a C_McwUnitJoin. */
export declare class C_McwUnitJoin implements IC_McwUnitJoin {

    /**
     * Constructs a new C_McwUnitJoin.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_McwUnitJoin);

    /** C_McwUnitJoin warId. */
    public warId: number;

    /** C_McwUnitJoin actionId. */
    public actionId: number;

    /** C_McwUnitJoin path. */
    public path: IGridIndex[];

    /** C_McwUnitJoin launchUnitId. */
    public launchUnitId: number;

    /**
     * Creates a new C_McwUnitJoin instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_McwUnitJoin instance
     */
    public static create(properties?: IC_McwUnitJoin): C_McwUnitJoin;

    /**
     * Encodes the specified C_McwUnitJoin message. Does not implicitly {@link C_McwUnitJoin.verify|verify} messages.
     * @param message C_McwUnitJoin message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_McwUnitJoin, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_McwUnitJoin message, length delimited. Does not implicitly {@link C_McwUnitJoin.verify|verify} messages.
     * @param message C_McwUnitJoin message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_McwUnitJoin, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_McwUnitJoin message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_McwUnitJoin
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_McwUnitJoin;

    /**
     * Decodes a C_McwUnitJoin message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_McwUnitJoin
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_McwUnitJoin;

    /**
     * Verifies a C_McwUnitJoin message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_McwUnitJoin message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_McwUnitJoin
     */
    public static fromObject(object: { [k: string]: any }): C_McwUnitJoin;

    /**
     * Creates a plain object from a C_McwUnitJoin message. Also converts values to other types if specified.
     * @param message C_McwUnitJoin
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_McwUnitJoin, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_McwUnitJoin to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_McwUnitJoin. */
export declare interface IS_McwUnitJoin {

    /** S_McwUnitJoin errorCode */
    errorCode?: (number|null);

    /** S_McwUnitJoin warId */
    warId?: (number|null);

    /** S_McwUnitJoin actionContainer */
    actionContainer?: (IWarActionContainer|null);
}

/** Represents a S_McwUnitJoin. */
export declare class S_McwUnitJoin implements IS_McwUnitJoin {

    /**
     * Constructs a new S_McwUnitJoin.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_McwUnitJoin);

    /** S_McwUnitJoin errorCode. */
    public errorCode: number;

    /** S_McwUnitJoin warId. */
    public warId: number;

    /** S_McwUnitJoin actionContainer. */
    public actionContainer?: (IWarActionContainer|null);

    /**
     * Creates a new S_McwUnitJoin instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_McwUnitJoin instance
     */
    public static create(properties?: IS_McwUnitJoin): S_McwUnitJoin;

    /**
     * Encodes the specified S_McwUnitJoin message. Does not implicitly {@link S_McwUnitJoin.verify|verify} messages.
     * @param message S_McwUnitJoin message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_McwUnitJoin, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_McwUnitJoin message, length delimited. Does not implicitly {@link S_McwUnitJoin.verify|verify} messages.
     * @param message S_McwUnitJoin message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_McwUnitJoin, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_McwUnitJoin message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_McwUnitJoin
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_McwUnitJoin;

    /**
     * Decodes a S_McwUnitJoin message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_McwUnitJoin
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_McwUnitJoin;

    /**
     * Verifies a S_McwUnitJoin message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_McwUnitJoin message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_McwUnitJoin
     */
    public static fromObject(object: { [k: string]: any }): S_McwUnitJoin;

    /**
     * Creates a plain object from a S_McwUnitJoin message. Also converts values to other types if specified.
     * @param message S_McwUnitJoin
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_McwUnitJoin, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_McwUnitJoin to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_McwUnitLaunchFlare. */
export declare interface IC_McwUnitLaunchFlare {

    /** C_McwUnitLaunchFlare warId */
    warId?: (number|null);

    /** C_McwUnitLaunchFlare actionId */
    actionId?: (number|null);

    /** C_McwUnitLaunchFlare path */
    path?: (IGridIndex[]|null);

    /** C_McwUnitLaunchFlare launchUnitId */
    launchUnitId?: (number|null);

    /** C_McwUnitLaunchFlare targetGridIndex */
    targetGridIndex?: (IGridIndex|null);
}

/** Represents a C_McwUnitLaunchFlare. */
export declare class C_McwUnitLaunchFlare implements IC_McwUnitLaunchFlare {

    /**
     * Constructs a new C_McwUnitLaunchFlare.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_McwUnitLaunchFlare);

    /** C_McwUnitLaunchFlare warId. */
    public warId: number;

    /** C_McwUnitLaunchFlare actionId. */
    public actionId: number;

    /** C_McwUnitLaunchFlare path. */
    public path: IGridIndex[];

    /** C_McwUnitLaunchFlare launchUnitId. */
    public launchUnitId: number;

    /** C_McwUnitLaunchFlare targetGridIndex. */
    public targetGridIndex?: (IGridIndex|null);

    /**
     * Creates a new C_McwUnitLaunchFlare instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_McwUnitLaunchFlare instance
     */
    public static create(properties?: IC_McwUnitLaunchFlare): C_McwUnitLaunchFlare;

    /**
     * Encodes the specified C_McwUnitLaunchFlare message. Does not implicitly {@link C_McwUnitLaunchFlare.verify|verify} messages.
     * @param message C_McwUnitLaunchFlare message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_McwUnitLaunchFlare, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_McwUnitLaunchFlare message, length delimited. Does not implicitly {@link C_McwUnitLaunchFlare.verify|verify} messages.
     * @param message C_McwUnitLaunchFlare message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_McwUnitLaunchFlare, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_McwUnitLaunchFlare message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_McwUnitLaunchFlare
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_McwUnitLaunchFlare;

    /**
     * Decodes a C_McwUnitLaunchFlare message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_McwUnitLaunchFlare
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_McwUnitLaunchFlare;

    /**
     * Verifies a C_McwUnitLaunchFlare message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_McwUnitLaunchFlare message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_McwUnitLaunchFlare
     */
    public static fromObject(object: { [k: string]: any }): C_McwUnitLaunchFlare;

    /**
     * Creates a plain object from a C_McwUnitLaunchFlare message. Also converts values to other types if specified.
     * @param message C_McwUnitLaunchFlare
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_McwUnitLaunchFlare, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_McwUnitLaunchFlare to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_McwUnitLaunchFlare. */
export declare interface IS_McwUnitLaunchFlare {

    /** S_McwUnitLaunchFlare errorCode */
    errorCode?: (number|null);

    /** S_McwUnitLaunchFlare warId */
    warId?: (number|null);

    /** S_McwUnitLaunchFlare actionContainer */
    actionContainer?: (IWarActionContainer|null);
}

/** Represents a S_McwUnitLaunchFlare. */
export declare class S_McwUnitLaunchFlare implements IS_McwUnitLaunchFlare {

    /**
     * Constructs a new S_McwUnitLaunchFlare.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_McwUnitLaunchFlare);

    /** S_McwUnitLaunchFlare errorCode. */
    public errorCode: number;

    /** S_McwUnitLaunchFlare warId. */
    public warId: number;

    /** S_McwUnitLaunchFlare actionContainer. */
    public actionContainer?: (IWarActionContainer|null);

    /**
     * Creates a new S_McwUnitLaunchFlare instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_McwUnitLaunchFlare instance
     */
    public static create(properties?: IS_McwUnitLaunchFlare): S_McwUnitLaunchFlare;

    /**
     * Encodes the specified S_McwUnitLaunchFlare message. Does not implicitly {@link S_McwUnitLaunchFlare.verify|verify} messages.
     * @param message S_McwUnitLaunchFlare message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_McwUnitLaunchFlare, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_McwUnitLaunchFlare message, length delimited. Does not implicitly {@link S_McwUnitLaunchFlare.verify|verify} messages.
     * @param message S_McwUnitLaunchFlare message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_McwUnitLaunchFlare, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_McwUnitLaunchFlare message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_McwUnitLaunchFlare
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_McwUnitLaunchFlare;

    /**
     * Decodes a S_McwUnitLaunchFlare message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_McwUnitLaunchFlare
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_McwUnitLaunchFlare;

    /**
     * Verifies a S_McwUnitLaunchFlare message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_McwUnitLaunchFlare message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_McwUnitLaunchFlare
     */
    public static fromObject(object: { [k: string]: any }): S_McwUnitLaunchFlare;

    /**
     * Creates a plain object from a S_McwUnitLaunchFlare message. Also converts values to other types if specified.
     * @param message S_McwUnitLaunchFlare
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_McwUnitLaunchFlare, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_McwUnitLaunchFlare to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_McwUnitLaunchSilo. */
export declare interface IC_McwUnitLaunchSilo {

    /** C_McwUnitLaunchSilo warId */
    warId?: (number|null);

    /** C_McwUnitLaunchSilo actionId */
    actionId?: (number|null);

    /** C_McwUnitLaunchSilo path */
    path?: (IGridIndex[]|null);

    /** C_McwUnitLaunchSilo launchUnitId */
    launchUnitId?: (number|null);

    /** C_McwUnitLaunchSilo targetGridIndex */
    targetGridIndex?: (IGridIndex|null);
}

/** Represents a C_McwUnitLaunchSilo. */
export declare class C_McwUnitLaunchSilo implements IC_McwUnitLaunchSilo {

    /**
     * Constructs a new C_McwUnitLaunchSilo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_McwUnitLaunchSilo);

    /** C_McwUnitLaunchSilo warId. */
    public warId: number;

    /** C_McwUnitLaunchSilo actionId. */
    public actionId: number;

    /** C_McwUnitLaunchSilo path. */
    public path: IGridIndex[];

    /** C_McwUnitLaunchSilo launchUnitId. */
    public launchUnitId: number;

    /** C_McwUnitLaunchSilo targetGridIndex. */
    public targetGridIndex?: (IGridIndex|null);

    /**
     * Creates a new C_McwUnitLaunchSilo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_McwUnitLaunchSilo instance
     */
    public static create(properties?: IC_McwUnitLaunchSilo): C_McwUnitLaunchSilo;

    /**
     * Encodes the specified C_McwUnitLaunchSilo message. Does not implicitly {@link C_McwUnitLaunchSilo.verify|verify} messages.
     * @param message C_McwUnitLaunchSilo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_McwUnitLaunchSilo, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_McwUnitLaunchSilo message, length delimited. Does not implicitly {@link C_McwUnitLaunchSilo.verify|verify} messages.
     * @param message C_McwUnitLaunchSilo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_McwUnitLaunchSilo, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_McwUnitLaunchSilo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_McwUnitLaunchSilo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_McwUnitLaunchSilo;

    /**
     * Decodes a C_McwUnitLaunchSilo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_McwUnitLaunchSilo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_McwUnitLaunchSilo;

    /**
     * Verifies a C_McwUnitLaunchSilo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_McwUnitLaunchSilo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_McwUnitLaunchSilo
     */
    public static fromObject(object: { [k: string]: any }): C_McwUnitLaunchSilo;

    /**
     * Creates a plain object from a C_McwUnitLaunchSilo message. Also converts values to other types if specified.
     * @param message C_McwUnitLaunchSilo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_McwUnitLaunchSilo, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_McwUnitLaunchSilo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_McwUnitLaunchSilo. */
export declare interface IS_McwUnitLaunchSilo {

    /** S_McwUnitLaunchSilo errorCode */
    errorCode?: (number|null);

    /** S_McwUnitLaunchSilo warId */
    warId?: (number|null);

    /** S_McwUnitLaunchSilo actionContainer */
    actionContainer?: (IWarActionContainer|null);
}

/** Represents a S_McwUnitLaunchSilo. */
export declare class S_McwUnitLaunchSilo implements IS_McwUnitLaunchSilo {

    /**
     * Constructs a new S_McwUnitLaunchSilo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_McwUnitLaunchSilo);

    /** S_McwUnitLaunchSilo errorCode. */
    public errorCode: number;

    /** S_McwUnitLaunchSilo warId. */
    public warId: number;

    /** S_McwUnitLaunchSilo actionContainer. */
    public actionContainer?: (IWarActionContainer|null);

    /**
     * Creates a new S_McwUnitLaunchSilo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_McwUnitLaunchSilo instance
     */
    public static create(properties?: IS_McwUnitLaunchSilo): S_McwUnitLaunchSilo;

    /**
     * Encodes the specified S_McwUnitLaunchSilo message. Does not implicitly {@link S_McwUnitLaunchSilo.verify|verify} messages.
     * @param message S_McwUnitLaunchSilo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_McwUnitLaunchSilo, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_McwUnitLaunchSilo message, length delimited. Does not implicitly {@link S_McwUnitLaunchSilo.verify|verify} messages.
     * @param message S_McwUnitLaunchSilo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_McwUnitLaunchSilo, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_McwUnitLaunchSilo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_McwUnitLaunchSilo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_McwUnitLaunchSilo;

    /**
     * Decodes a S_McwUnitLaunchSilo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_McwUnitLaunchSilo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_McwUnitLaunchSilo;

    /**
     * Verifies a S_McwUnitLaunchSilo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_McwUnitLaunchSilo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_McwUnitLaunchSilo
     */
    public static fromObject(object: { [k: string]: any }): S_McwUnitLaunchSilo;

    /**
     * Creates a plain object from a S_McwUnitLaunchSilo message. Also converts values to other types if specified.
     * @param message S_McwUnitLaunchSilo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_McwUnitLaunchSilo, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_McwUnitLaunchSilo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_McwUnitProduceUnit. */
export declare interface IC_McwUnitProduceUnit {

    /** C_McwUnitProduceUnit warId */
    warId?: (number|null);

    /** C_McwUnitProduceUnit actionId */
    actionId?: (number|null);

    /** C_McwUnitProduceUnit path */
    path?: (IGridIndex[]|null);

    /** C_McwUnitProduceUnit launchUnitId */
    launchUnitId?: (number|null);
}

/** Represents a C_McwUnitProduceUnit. */
export declare class C_McwUnitProduceUnit implements IC_McwUnitProduceUnit {

    /**
     * Constructs a new C_McwUnitProduceUnit.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_McwUnitProduceUnit);

    /** C_McwUnitProduceUnit warId. */
    public warId: number;

    /** C_McwUnitProduceUnit actionId. */
    public actionId: number;

    /** C_McwUnitProduceUnit path. */
    public path: IGridIndex[];

    /** C_McwUnitProduceUnit launchUnitId. */
    public launchUnitId: number;

    /**
     * Creates a new C_McwUnitProduceUnit instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_McwUnitProduceUnit instance
     */
    public static create(properties?: IC_McwUnitProduceUnit): C_McwUnitProduceUnit;

    /**
     * Encodes the specified C_McwUnitProduceUnit message. Does not implicitly {@link C_McwUnitProduceUnit.verify|verify} messages.
     * @param message C_McwUnitProduceUnit message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_McwUnitProduceUnit, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_McwUnitProduceUnit message, length delimited. Does not implicitly {@link C_McwUnitProduceUnit.verify|verify} messages.
     * @param message C_McwUnitProduceUnit message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_McwUnitProduceUnit, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_McwUnitProduceUnit message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_McwUnitProduceUnit
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_McwUnitProduceUnit;

    /**
     * Decodes a C_McwUnitProduceUnit message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_McwUnitProduceUnit
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_McwUnitProduceUnit;

    /**
     * Verifies a C_McwUnitProduceUnit message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_McwUnitProduceUnit message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_McwUnitProduceUnit
     */
    public static fromObject(object: { [k: string]: any }): C_McwUnitProduceUnit;

    /**
     * Creates a plain object from a C_McwUnitProduceUnit message. Also converts values to other types if specified.
     * @param message C_McwUnitProduceUnit
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_McwUnitProduceUnit, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_McwUnitProduceUnit to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_McwUnitProduceUnit. */
export declare interface IS_McwUnitProduceUnit {

    /** S_McwUnitProduceUnit errorCode */
    errorCode?: (number|null);

    /** S_McwUnitProduceUnit warId */
    warId?: (number|null);

    /** S_McwUnitProduceUnit actionContainer */
    actionContainer?: (IWarActionContainer|null);
}

/** Represents a S_McwUnitProduceUnit. */
export declare class S_McwUnitProduceUnit implements IS_McwUnitProduceUnit {

    /**
     * Constructs a new S_McwUnitProduceUnit.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_McwUnitProduceUnit);

    /** S_McwUnitProduceUnit errorCode. */
    public errorCode: number;

    /** S_McwUnitProduceUnit warId. */
    public warId: number;

    /** S_McwUnitProduceUnit actionContainer. */
    public actionContainer?: (IWarActionContainer|null);

    /**
     * Creates a new S_McwUnitProduceUnit instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_McwUnitProduceUnit instance
     */
    public static create(properties?: IS_McwUnitProduceUnit): S_McwUnitProduceUnit;

    /**
     * Encodes the specified S_McwUnitProduceUnit message. Does not implicitly {@link S_McwUnitProduceUnit.verify|verify} messages.
     * @param message S_McwUnitProduceUnit message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_McwUnitProduceUnit, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_McwUnitProduceUnit message, length delimited. Does not implicitly {@link S_McwUnitProduceUnit.verify|verify} messages.
     * @param message S_McwUnitProduceUnit message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_McwUnitProduceUnit, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_McwUnitProduceUnit message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_McwUnitProduceUnit
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_McwUnitProduceUnit;

    /**
     * Decodes a S_McwUnitProduceUnit message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_McwUnitProduceUnit
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_McwUnitProduceUnit;

    /**
     * Verifies a S_McwUnitProduceUnit message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_McwUnitProduceUnit message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_McwUnitProduceUnit
     */
    public static fromObject(object: { [k: string]: any }): S_McwUnitProduceUnit;

    /**
     * Creates a plain object from a S_McwUnitProduceUnit message. Also converts values to other types if specified.
     * @param message S_McwUnitProduceUnit
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_McwUnitProduceUnit, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_McwUnitProduceUnit to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_McwUnitSupply. */
export declare interface IC_McwUnitSupply {

    /** C_McwUnitSupply warId */
    warId?: (number|null);

    /** C_McwUnitSupply actionId */
    actionId?: (number|null);

    /** C_McwUnitSupply path */
    path?: (IGridIndex[]|null);

    /** C_McwUnitSupply launchUnitId */
    launchUnitId?: (number|null);
}

/** Represents a C_McwUnitSupply. */
export declare class C_McwUnitSupply implements IC_McwUnitSupply {

    /**
     * Constructs a new C_McwUnitSupply.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_McwUnitSupply);

    /** C_McwUnitSupply warId. */
    public warId: number;

    /** C_McwUnitSupply actionId. */
    public actionId: number;

    /** C_McwUnitSupply path. */
    public path: IGridIndex[];

    /** C_McwUnitSupply launchUnitId. */
    public launchUnitId: number;

    /**
     * Creates a new C_McwUnitSupply instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_McwUnitSupply instance
     */
    public static create(properties?: IC_McwUnitSupply): C_McwUnitSupply;

    /**
     * Encodes the specified C_McwUnitSupply message. Does not implicitly {@link C_McwUnitSupply.verify|verify} messages.
     * @param message C_McwUnitSupply message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_McwUnitSupply, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_McwUnitSupply message, length delimited. Does not implicitly {@link C_McwUnitSupply.verify|verify} messages.
     * @param message C_McwUnitSupply message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_McwUnitSupply, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_McwUnitSupply message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_McwUnitSupply
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_McwUnitSupply;

    /**
     * Decodes a C_McwUnitSupply message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_McwUnitSupply
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_McwUnitSupply;

    /**
     * Verifies a C_McwUnitSupply message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_McwUnitSupply message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_McwUnitSupply
     */
    public static fromObject(object: { [k: string]: any }): C_McwUnitSupply;

    /**
     * Creates a plain object from a C_McwUnitSupply message. Also converts values to other types if specified.
     * @param message C_McwUnitSupply
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_McwUnitSupply, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_McwUnitSupply to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_McwUnitSupply. */
export declare interface IS_McwUnitSupply {

    /** S_McwUnitSupply errorCode */
    errorCode?: (number|null);

    /** S_McwUnitSupply warId */
    warId?: (number|null);

    /** S_McwUnitSupply actionContainer */
    actionContainer?: (IWarActionContainer|null);
}

/** Represents a S_McwUnitSupply. */
export declare class S_McwUnitSupply implements IS_McwUnitSupply {

    /**
     * Constructs a new S_McwUnitSupply.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_McwUnitSupply);

    /** S_McwUnitSupply errorCode. */
    public errorCode: number;

    /** S_McwUnitSupply warId. */
    public warId: number;

    /** S_McwUnitSupply actionContainer. */
    public actionContainer?: (IWarActionContainer|null);

    /**
     * Creates a new S_McwUnitSupply instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_McwUnitSupply instance
     */
    public static create(properties?: IS_McwUnitSupply): S_McwUnitSupply;

    /**
     * Encodes the specified S_McwUnitSupply message. Does not implicitly {@link S_McwUnitSupply.verify|verify} messages.
     * @param message S_McwUnitSupply message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_McwUnitSupply, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_McwUnitSupply message, length delimited. Does not implicitly {@link S_McwUnitSupply.verify|verify} messages.
     * @param message S_McwUnitSupply message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_McwUnitSupply, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_McwUnitSupply message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_McwUnitSupply
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_McwUnitSupply;

    /**
     * Decodes a S_McwUnitSupply message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_McwUnitSupply
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_McwUnitSupply;

    /**
     * Verifies a S_McwUnitSupply message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_McwUnitSupply message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_McwUnitSupply
     */
    public static fromObject(object: { [k: string]: any }): S_McwUnitSupply;

    /**
     * Creates a plain object from a S_McwUnitSupply message. Also converts values to other types if specified.
     * @param message S_McwUnitSupply
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_McwUnitSupply, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_McwUnitSupply to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_McwUnitLoadCo. */
export declare interface IC_McwUnitLoadCo {

    /** C_McwUnitLoadCo warId */
    warId?: (number|null);

    /** C_McwUnitLoadCo actionId */
    actionId?: (number|null);

    /** C_McwUnitLoadCo path */
    path?: (IGridIndex[]|null);

    /** C_McwUnitLoadCo launchUnitId */
    launchUnitId?: (number|null);
}

/** Represents a C_McwUnitLoadCo. */
export declare class C_McwUnitLoadCo implements IC_McwUnitLoadCo {

    /**
     * Constructs a new C_McwUnitLoadCo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_McwUnitLoadCo);

    /** C_McwUnitLoadCo warId. */
    public warId: number;

    /** C_McwUnitLoadCo actionId. */
    public actionId: number;

    /** C_McwUnitLoadCo path. */
    public path: IGridIndex[];

    /** C_McwUnitLoadCo launchUnitId. */
    public launchUnitId: number;

    /**
     * Creates a new C_McwUnitLoadCo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_McwUnitLoadCo instance
     */
    public static create(properties?: IC_McwUnitLoadCo): C_McwUnitLoadCo;

    /**
     * Encodes the specified C_McwUnitLoadCo message. Does not implicitly {@link C_McwUnitLoadCo.verify|verify} messages.
     * @param message C_McwUnitLoadCo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_McwUnitLoadCo, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_McwUnitLoadCo message, length delimited. Does not implicitly {@link C_McwUnitLoadCo.verify|verify} messages.
     * @param message C_McwUnitLoadCo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_McwUnitLoadCo, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_McwUnitLoadCo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_McwUnitLoadCo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_McwUnitLoadCo;

    /**
     * Decodes a C_McwUnitLoadCo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_McwUnitLoadCo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_McwUnitLoadCo;

    /**
     * Verifies a C_McwUnitLoadCo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_McwUnitLoadCo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_McwUnitLoadCo
     */
    public static fromObject(object: { [k: string]: any }): C_McwUnitLoadCo;

    /**
     * Creates a plain object from a C_McwUnitLoadCo message. Also converts values to other types if specified.
     * @param message C_McwUnitLoadCo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_McwUnitLoadCo, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_McwUnitLoadCo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_McwUnitLoadCo. */
export declare interface IS_McwUnitLoadCo {

    /** S_McwUnitLoadCo errorCode */
    errorCode?: (number|null);

    /** S_McwUnitLoadCo warId */
    warId?: (number|null);

    /** S_McwUnitLoadCo actionContainer */
    actionContainer?: (IWarActionContainer|null);
}

/** Represents a S_McwUnitLoadCo. */
export declare class S_McwUnitLoadCo implements IS_McwUnitLoadCo {

    /**
     * Constructs a new S_McwUnitLoadCo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_McwUnitLoadCo);

    /** S_McwUnitLoadCo errorCode. */
    public errorCode: number;

    /** S_McwUnitLoadCo warId. */
    public warId: number;

    /** S_McwUnitLoadCo actionContainer. */
    public actionContainer?: (IWarActionContainer|null);

    /**
     * Creates a new S_McwUnitLoadCo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_McwUnitLoadCo instance
     */
    public static create(properties?: IS_McwUnitLoadCo): S_McwUnitLoadCo;

    /**
     * Encodes the specified S_McwUnitLoadCo message. Does not implicitly {@link S_McwUnitLoadCo.verify|verify} messages.
     * @param message S_McwUnitLoadCo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_McwUnitLoadCo, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_McwUnitLoadCo message, length delimited. Does not implicitly {@link S_McwUnitLoadCo.verify|verify} messages.
     * @param message S_McwUnitLoadCo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_McwUnitLoadCo, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_McwUnitLoadCo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_McwUnitLoadCo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_McwUnitLoadCo;

    /**
     * Decodes a S_McwUnitLoadCo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_McwUnitLoadCo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_McwUnitLoadCo;

    /**
     * Verifies a S_McwUnitLoadCo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_McwUnitLoadCo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_McwUnitLoadCo
     */
    public static fromObject(object: { [k: string]: any }): S_McwUnitLoadCo;

    /**
     * Creates a plain object from a S_McwUnitLoadCo message. Also converts values to other types if specified.
     * @param message S_McwUnitLoadCo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_McwUnitLoadCo, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_McwUnitLoadCo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a C_McwUnitUseCoSkill. */
export declare interface IC_McwUnitUseCoSkill {

    /** C_McwUnitUseCoSkill warId */
    warId?: (number|null);

    /** C_McwUnitUseCoSkill actionId */
    actionId?: (number|null);

    /** C_McwUnitUseCoSkill path */
    path?: (IGridIndex[]|null);

    /** C_McwUnitUseCoSkill launchUnitId */
    launchUnitId?: (number|null);

    /** C_McwUnitUseCoSkill skillType */
    skillType?: (number|null);
}

/** Represents a C_McwUnitUseCoSkill. */
export declare class C_McwUnitUseCoSkill implements IC_McwUnitUseCoSkill {

    /**
     * Constructs a new C_McwUnitUseCoSkill.
     * @param [properties] Properties to set
     */
    constructor(properties?: IC_McwUnitUseCoSkill);

    /** C_McwUnitUseCoSkill warId. */
    public warId: number;

    /** C_McwUnitUseCoSkill actionId. */
    public actionId: number;

    /** C_McwUnitUseCoSkill path. */
    public path: IGridIndex[];

    /** C_McwUnitUseCoSkill launchUnitId. */
    public launchUnitId: number;

    /** C_McwUnitUseCoSkill skillType. */
    public skillType: number;

    /**
     * Creates a new C_McwUnitUseCoSkill instance using the specified properties.
     * @param [properties] Properties to set
     * @returns C_McwUnitUseCoSkill instance
     */
    public static create(properties?: IC_McwUnitUseCoSkill): C_McwUnitUseCoSkill;

    /**
     * Encodes the specified C_McwUnitUseCoSkill message. Does not implicitly {@link C_McwUnitUseCoSkill.verify|verify} messages.
     * @param message C_McwUnitUseCoSkill message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IC_McwUnitUseCoSkill, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified C_McwUnitUseCoSkill message, length delimited. Does not implicitly {@link C_McwUnitUseCoSkill.verify|verify} messages.
     * @param message C_McwUnitUseCoSkill message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IC_McwUnitUseCoSkill, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a C_McwUnitUseCoSkill message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns C_McwUnitUseCoSkill
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): C_McwUnitUseCoSkill;

    /**
     * Decodes a C_McwUnitUseCoSkill message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns C_McwUnitUseCoSkill
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): C_McwUnitUseCoSkill;

    /**
     * Verifies a C_McwUnitUseCoSkill message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a C_McwUnitUseCoSkill message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns C_McwUnitUseCoSkill
     */
    public static fromObject(object: { [k: string]: any }): C_McwUnitUseCoSkill;

    /**
     * Creates a plain object from a C_McwUnitUseCoSkill message. Also converts values to other types if specified.
     * @param message C_McwUnitUseCoSkill
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: C_McwUnitUseCoSkill, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this C_McwUnitUseCoSkill to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a S_McwUnitUseCoSkill. */
export declare interface IS_McwUnitUseCoSkill {

    /** S_McwUnitUseCoSkill errorCode */
    errorCode?: (number|null);

    /** S_McwUnitUseCoSkill warId */
    warId?: (number|null);

    /** S_McwUnitUseCoSkill actionContainer */
    actionContainer?: (IWarActionContainer|null);
}

/** Represents a S_McwUnitUseCoSkill. */
export declare class S_McwUnitUseCoSkill implements IS_McwUnitUseCoSkill {

    /**
     * Constructs a new S_McwUnitUseCoSkill.
     * @param [properties] Properties to set
     */
    constructor(properties?: IS_McwUnitUseCoSkill);

    /** S_McwUnitUseCoSkill errorCode. */
    public errorCode: number;

    /** S_McwUnitUseCoSkill warId. */
    public warId: number;

    /** S_McwUnitUseCoSkill actionContainer. */
    public actionContainer?: (IWarActionContainer|null);

    /**
     * Creates a new S_McwUnitUseCoSkill instance using the specified properties.
     * @param [properties] Properties to set
     * @returns S_McwUnitUseCoSkill instance
     */
    public static create(properties?: IS_McwUnitUseCoSkill): S_McwUnitUseCoSkill;

    /**
     * Encodes the specified S_McwUnitUseCoSkill message. Does not implicitly {@link S_McwUnitUseCoSkill.verify|verify} messages.
     * @param message S_McwUnitUseCoSkill message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IS_McwUnitUseCoSkill, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified S_McwUnitUseCoSkill message, length delimited. Does not implicitly {@link S_McwUnitUseCoSkill.verify|verify} messages.
     * @param message S_McwUnitUseCoSkill message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IS_McwUnitUseCoSkill, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a S_McwUnitUseCoSkill message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns S_McwUnitUseCoSkill
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): S_McwUnitUseCoSkill;

    /**
     * Decodes a S_McwUnitUseCoSkill message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns S_McwUnitUseCoSkill
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): S_McwUnitUseCoSkill;

    /**
     * Verifies a S_McwUnitUseCoSkill message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a S_McwUnitUseCoSkill message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns S_McwUnitUseCoSkill
     */
    public static fromObject(object: { [k: string]: any }): S_McwUnitUseCoSkill;

    /**
     * Creates a plain object from a S_McwUnitUseCoSkill message. Also converts values to other types if specified.
     * @param message S_McwUnitUseCoSkill
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: S_McwUnitUseCoSkill, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this S_McwUnitUseCoSkill to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a RPCC_SayHello. */
export declare interface IRPCC_SayHello {

    /** RPCC_SayHello name */
    name?: (string|null);
}

/** Represents a RPCC_SayHello. */
export declare class RPCC_SayHello implements IRPCC_SayHello {

    /**
     * Constructs a new RPCC_SayHello.
     * @param [properties] Properties to set
     */
    constructor(properties?: IRPCC_SayHello);

    /** RPCC_SayHello name. */
    public name: string;

    /**
     * Creates a new RPCC_SayHello instance using the specified properties.
     * @param [properties] Properties to set
     * @returns RPCC_SayHello instance
     */
    public static create(properties?: IRPCC_SayHello): RPCC_SayHello;

    /**
     * Encodes the specified RPCC_SayHello message. Does not implicitly {@link RPCC_SayHello.verify|verify} messages.
     * @param message RPCC_SayHello message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IRPCC_SayHello, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified RPCC_SayHello message, length delimited. Does not implicitly {@link RPCC_SayHello.verify|verify} messages.
     * @param message RPCC_SayHello message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IRPCC_SayHello, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a RPCC_SayHello message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns RPCC_SayHello
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): RPCC_SayHello;

    /**
     * Decodes a RPCC_SayHello message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns RPCC_SayHello
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): RPCC_SayHello;

    /**
     * Verifies a RPCC_SayHello message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a RPCC_SayHello message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns RPCC_SayHello
     */
    public static fromObject(object: { [k: string]: any }): RPCC_SayHello;

    /**
     * Creates a plain object from a RPCC_SayHello message. Also converts values to other types if specified.
     * @param message RPCC_SayHello
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: RPCC_SayHello, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this RPCC_SayHello to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a RPCS_SayHello. */
export declare interface IRPCS_SayHello {

    /** RPCS_SayHello message */
    message?: (string|null);
}

/** Represents a RPCS_SayHello. */
export declare class RPCS_SayHello implements IRPCS_SayHello {

    /**
     * Constructs a new RPCS_SayHello.
     * @param [properties] Properties to set
     */
    constructor(properties?: IRPCS_SayHello);

    /** RPCS_SayHello message. */
    public message: string;

    /**
     * Creates a new RPCS_SayHello instance using the specified properties.
     * @param [properties] Properties to set
     * @returns RPCS_SayHello instance
     */
    public static create(properties?: IRPCS_SayHello): RPCS_SayHello;

    /**
     * Encodes the specified RPCS_SayHello message. Does not implicitly {@link RPCS_SayHello.verify|verify} messages.
     * @param message RPCS_SayHello message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IRPCS_SayHello, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Encodes the specified RPCS_SayHello message, length delimited. Does not implicitly {@link RPCS_SayHello.verify|verify} messages.
     * @param message RPCS_SayHello message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IRPCS_SayHello, writer?: protobuf.Writer): protobuf.Writer;

    /**
     * Decodes a RPCS_SayHello message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns RPCS_SayHello
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (protobuf.Reader|Uint8Array), length?: number): RPCS_SayHello;

    /**
     * Decodes a RPCS_SayHello message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns RPCS_SayHello
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (protobuf.Reader|Uint8Array)): RPCS_SayHello;

    /**
     * Verifies a RPCS_SayHello message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a RPCS_SayHello message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns RPCS_SayHello
     */
    public static fromObject(object: { [k: string]: any }): RPCS_SayHello;

    /**
     * Creates a plain object from a RPCS_SayHello message. Also converts values to other types if specified.
     * @param message RPCS_SayHello
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: RPCS_SayHello, options?: protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this RPCS_SayHello to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Represents a ReplayValidator */
export declare class ReplayValidator extends protobuf.rpc.Service {

    /**
     * Constructs a new ReplayValidator service.
     * @param rpcImpl RPC implementation
     * @param [requestDelimited=false] Whether requests are length-delimited
     * @param [responseDelimited=false] Whether responses are length-delimited
     */
    constructor(rpcImpl: protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

    /**
     * Creates new ReplayValidator service using the specified rpc implementation.
     * @param rpcImpl RPC implementation
     * @param [requestDelimited=false] Whether requests are length-delimited
     * @param [responseDelimited=false] Whether responses are length-delimited
     * @returns RPC service. Useful where requests and/or responses are streamed.
     */
    public static create(rpcImpl: protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): ReplayValidator;

    /**
     * Calls sayHello.
     * @param request RPCC_SayHello message or plain object
     * @param callback Node-style callback called with the error, if any, and RPCS_SayHello
     */
    public sayHello(request: IRPCC_SayHello, callback: ReplayValidator.sayHelloCallback): void;

    /**
     * Calls sayHello.
     * @param request RPCC_SayHello message or plain object
     * @returns Promise
     */
    public sayHello(request: IRPCC_SayHello): Promise<RPCS_SayHello>;
}

export declare namespace ReplayValidator {

    /**
     * Callback as used by {@link ReplayValidator#sayHello}.
     * @param error Error, if any
     * @param [response] RPCS_SayHello
     */
    type sayHelloCallback = (error: (Error|null), response?: RPCS_SayHello) => void;
}
}}
