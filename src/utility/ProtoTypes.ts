
namespace TinyWars.Utility {
    export namespace ProtoTypes {
        /** Properties of a TileCategoryCfg. */
        export declare interface ITileCategoryCfg {

            /** TileCategoryCfg category */
            category?: (number | null);

            /** TileCategoryCfg tileTypes */
            tileTypes?: (number[] | null);
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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): TileCategoryCfg;

            /**
             * Decodes a TileCategoryCfg message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns TileCategoryCfg
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): TileCategoryCfg;

            /**
             * Verifies a TileCategoryCfg message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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
            category?: (number | null);

            /** UnitCategoryCfg unitTypes */
            unitTypes?: (number[] | null);
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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): UnitCategoryCfg;

            /**
             * Decodes an UnitCategoryCfg message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns UnitCategoryCfg
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): UnitCategoryCfg;

            /**
             * Verifies an UnitCategoryCfg message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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
            type?: (number | null);

            /** TileTemplateCfg defenseAmount */
            defenseAmount?: (number | null);

            /** TileTemplateCfg defenseUnitCategory */
            defenseUnitCategory?: (number | null);

            /** TileTemplateCfg maxBuildPoint */
            maxBuildPoint?: (number | null);

            /** TileTemplateCfg maxCapturePoint */
            maxCapturePoint?: (number | null);

            /** TileTemplateCfg isDefeatedOnCapture */
            isDefeatedOnCapture?: (number | null);

            /** TileTemplateCfg repairAmount */
            repairAmount?: (number | null);

            /** TileTemplateCfg repairUnitCategory */
            repairUnitCategory?: (number | null);

            /** TileTemplateCfg incomePerTurn */
            incomePerTurn?: (number | null);

            /** TileTemplateCfg visionRange */
            visionRange?: (number | null);

            /** TileTemplateCfg isVisionEnabledForAllPlayers */
            isVisionEnabledForAllPlayers?: (number | null);

            /** TileTemplateCfg hideUnitCategory */
            hideUnitCategory?: (number | null);

            /** TileTemplateCfg isDestroyedWithAdjacentMeteor */
            isDestroyedWithAdjacentMeteor?: (number | null);

            /** TileTemplateCfg produceUnitCategory */
            produceUnitCategory?: (number | null);

            /** TileTemplateCfg globalAttackBonus */
            globalAttackBonus?: (number | null);

            /** TileTemplateCfg globalDefenseBonus */
            globalDefenseBonus?: (number | null);

            /** TileTemplateCfg maxHp */
            maxHp?: (number | null);

            /** TileTemplateCfg armorType */
            armorType?: (number | null);

            /** TileTemplateCfg isAffectedByLuck */
            isAffectedByLuck?: (number | null);
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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): TileTemplateCfg;

            /**
             * Decodes a TileTemplateCfg message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns TileTemplateCfg
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): TileTemplateCfg;

            /**
             * Verifies a TileTemplateCfg message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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
            type?: (number | null);

            /** UnitTemplateCfg minAttackRange */
            minAttackRange?: (number | null);

            /** UnitTemplateCfg maxAttackRange */
            maxAttackRange?: (number | null);

            /** UnitTemplateCfg canAttackAfterMove */
            canAttackAfterMove?: (number | null);

            /** UnitTemplateCfg canAttackDivingUnits */
            canAttackDivingUnits?: (number | null);

            /** UnitTemplateCfg primaryWeaponMaxAmmo */
            primaryWeaponMaxAmmo?: (number | null);

            /** UnitTemplateCfg maxHp */
            maxHp?: (number | null);

            /** UnitTemplateCfg armorType */
            armorType?: (number | null);

            /** UnitTemplateCfg isAffectedByLuck */
            isAffectedByLuck?: (number | null);

            /** UnitTemplateCfg moveRange */
            moveRange?: (number | null);

            /** UnitTemplateCfg moveType */
            moveType?: (number | null);

            /** UnitTemplateCfg maxFuel */
            maxFuel?: (number | null);

            /** UnitTemplateCfg fuelConsumptionPerTurn */
            fuelConsumptionPerTurn?: (number | null);

            /** UnitTemplateCfg fuelConsumptionInDiving */
            fuelConsumptionInDiving?: (number | null);

            /** UnitTemplateCfg isDestroyedOnOutOfFuel */
            isDestroyedOnOutOfFuel?: (number | null);

            /** UnitTemplateCfg maxLoadUnitsCount */
            maxLoadUnitsCount?: (number | null);

            /** UnitTemplateCfg loadUnitCategory */
            loadUnitCategory?: (number | null);

            /** UnitTemplateCfg canLaunchLoadedUnits */
            canLaunchLoadedUnits?: (number | null);

            /** UnitTemplateCfg canDropLoadedUnits */
            canDropLoadedUnits?: (number | null);

            /** UnitTemplateCfg canSupplyLoadedUnits */
            canSupplyLoadedUnits?: (number | null);

            /** UnitTemplateCfg repairAmountForLoadedUnits */
            repairAmountForLoadedUnits?: (number | null);

            /** UnitTemplateCfg loadableTileCategory */
            loadableTileCategory?: (number | null);

            /** UnitTemplateCfg canSupplyAdjacentUnits */
            canSupplyAdjacentUnits?: (number | null);

            /** UnitTemplateCfg produceUnitType */
            produceUnitType?: (number | null);

            /** UnitTemplateCfg maxProduceMaterial */
            maxProduceMaterial?: (number | null);

            /** UnitTemplateCfg maxBuildMaterial */
            maxBuildMaterial?: (number | null);

            /** UnitTemplateCfg canCaptureTile */
            canCaptureTile?: (number | null);

            /** UnitTemplateCfg canLaunchSilo */
            canLaunchSilo?: (number | null);

            /** UnitTemplateCfg productionCost */
            productionCost?: (number | null);

            /** UnitTemplateCfg visionRange */
            visionRange?: (number | null);

            /** UnitTemplateCfg flareMaxAmmo */
            flareMaxAmmo?: (number | null);

            /** UnitTemplateCfg flareMaxRange */
            flareMaxRange?: (number | null);

            /** UnitTemplateCfg flareRadius */
            flareRadius?: (number | null);
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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): UnitTemplateCfg;

            /**
             * Decodes an UnitTemplateCfg message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns UnitTemplateCfg
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): UnitTemplateCfg;

            /**
             * Verifies an UnitTemplateCfg message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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
            attackerType?: (number | null);

            /** DamageChartCfg armorType */
            armorType?: (number | null);

            /** DamageChartCfg weaponType */
            weaponType?: (number | null);

            /** DamageChartCfg damage */
            damage?: (number | null);
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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): DamageChartCfg;

            /**
             * Decodes a DamageChartCfg message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DamageChartCfg
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): DamageChartCfg;

            /**
             * Verifies a DamageChartCfg message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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
            tileType?: (number | null);

            /** MoveCostCfg moveType */
            moveType?: (number | null);

            /** MoveCostCfg cost */
            cost?: (number | null);
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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): MoveCostCfg;

            /**
             * Decodes a MoveCostCfg message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MoveCostCfg
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): MoveCostCfg;

            /**
             * Verifies a MoveCostCfg message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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
            promotion?: (number | null);

            /** UnitPromotionCfg attackBonus */
            attackBonus?: (number | null);

            /** UnitPromotionCfg defenseBonus */
            defenseBonus?: (number | null);
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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): UnitPromotionCfg;

            /**
             * Decodes an UnitPromotionCfg message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns UnitPromotionCfg
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): UnitPromotionCfg;

            /**
             * Verifies an UnitPromotionCfg message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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
            unitType?: (number | null);

            /** VisionBonusCfg tileType */
            tileType?: (number | null);

            /** VisionBonusCfg visionBonus */
            visionBonus?: (number | null);
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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): VisionBonusCfg;

            /**
             * Decodes a VisionBonusCfg message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns VisionBonusCfg
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): VisionBonusCfg;

            /**
             * Verifies a VisionBonusCfg message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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
            unitType?: (number | null);

            /** BuildableTileCfg srcTileType */
            srcTileType?: (number | null);

            /** BuildableTileCfg dstTileType */
            dstTileType?: (number | null);
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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): BuildableTileCfg;

            /**
             * Decodes a BuildableTileCfg message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns BuildableTileCfg
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): BuildableTileCfg;

            /**
             * Verifies a BuildableTileCfg message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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

        /** Properties of a FullConfig. */
        export declare interface IFullConfig {

            /** FullConfig TileCategory */
            TileCategory?: (ITileCategoryCfg[] | null);

            /** FullConfig UnitCategory */
            UnitCategory?: (IUnitCategoryCfg[] | null);

            /** FullConfig TileTemplate */
            TileTemplate?: (ITileTemplateCfg[] | null);

            /** FullConfig UnitTemplate */
            UnitTemplate?: (IUnitTemplateCfg[] | null);

            /** FullConfig DamageChart */
            DamageChart?: (IDamageChartCfg[] | null);

            /** FullConfig MoveCost */
            MoveCost?: (IMoveCostCfg[] | null);

            /** FullConfig UnitPromotion */
            UnitPromotion?: (IUnitPromotionCfg[] | null);

            /** FullConfig VisionBonus */
            VisionBonus?: (IVisionBonusCfg[] | null);

            /** FullConfig BuildableTile */
            BuildableTile?: (IBuildableTileCfg[] | null);
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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): FullConfig;

            /**
             * Decodes a FullConfig message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FullConfig
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): FullConfig;

            /**
             * Verifies a FullConfig message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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

        /** Properties of a SerializedMcTile. */
        export declare interface ISerializedMcTile {

            /** SerializedMcTile gridX */
            gridX?: (number | null);

            /** SerializedMcTile gridY */
            gridY?: (number | null);

            /** SerializedMcTile baseViewId */
            baseViewId?: (number | null);

            /** SerializedMcTile objectViewId */
            objectViewId?: (number | null);

            /** SerializedMcTile currentHp */
            currentHp?: (number | null);

            /** SerializedMcTile currentBuildPoint */
            currentBuildPoint?: (number | null);

            /** SerializedMcTile currentCapturePoint */
            currentCapturePoint?: (number | null);
        }

        /** Represents a SerializedMcTile. */
        export declare class SerializedMcTile implements ISerializedMcTile {

            /**
             * Constructs a new SerializedMcTile.
             * @param [properties] Properties to set
             */
            constructor(properties?: ISerializedMcTile);

            /** SerializedMcTile gridX. */
            public gridX: number;

            /** SerializedMcTile gridY. */
            public gridY: number;

            /** SerializedMcTile baseViewId. */
            public baseViewId: number;

            /** SerializedMcTile objectViewId. */
            public objectViewId: number;

            /** SerializedMcTile currentHp. */
            public currentHp: number;

            /** SerializedMcTile currentBuildPoint. */
            public currentBuildPoint: number;

            /** SerializedMcTile currentCapturePoint. */
            public currentCapturePoint: number;

            /**
             * Creates a new SerializedMcTile instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SerializedMcTile instance
             */
            public static create(properties?: ISerializedMcTile): SerializedMcTile;

            /**
             * Encodes the specified SerializedMcTile message. Does not implicitly {@link SerializedMcTile.verify|verify} messages.
             * @param message SerializedMcTile message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: ISerializedMcTile, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified SerializedMcTile message, length delimited. Does not implicitly {@link SerializedMcTile.verify|verify} messages.
             * @param message SerializedMcTile message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: ISerializedMcTile, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a SerializedMcTile message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SerializedMcTile
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): SerializedMcTile;

            /**
             * Decodes a SerializedMcTile message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SerializedMcTile
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): SerializedMcTile;

            /**
             * Verifies a SerializedMcTile message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a SerializedMcTile message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SerializedMcTile
             */
            public static fromObject(object: { [k: string]: any }): SerializedMcTile;

            /**
             * Creates a plain object from a SerializedMcTile message. Also converts values to other types if specified.
             * @param message SerializedMcTile
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: SerializedMcTile, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SerializedMcTile to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a SerializedMcUnit. */
        export declare interface ISerializedMcUnit {

            /** SerializedMcUnit gridX */
            gridX?: (number | null);

            /** SerializedMcUnit gridY */
            gridY?: (number | null);

            /** SerializedMcUnit viewId */
            viewId?: (number | null);

            /** SerializedMcUnit unitId */
            unitId?: (number | null);

            /** SerializedMcUnit state */
            state?: (number | null);

            /** SerializedMcUnit primaryWeaponCurrentAmmo */
            primaryWeaponCurrentAmmo?: (number | null);

            /** SerializedMcUnit currentHp */
            currentHp?: (number | null);

            /** SerializedMcUnit isCapturingTile */
            isCapturingTile?: (boolean | null);

            /** SerializedMcUnit isDiving */
            isDiving?: (boolean | null);

            /** SerializedMcUnit flareCurrentAmmo */
            flareCurrentAmmo?: (number | null);

            /** SerializedMcUnit currentFuel */
            currentFuel?: (number | null);

            /** SerializedMcUnit currentBuildMaterial */
            currentBuildMaterial?: (number | null);

            /** SerializedMcUnit currentProduceMaterial */
            currentProduceMaterial?: (number | null);

            /** SerializedMcUnit currentPromotion */
            currentPromotion?: (number | null);

            /** SerializedMcUnit isBuildingTile */
            isBuildingTile?: (boolean | null);

            /** SerializedMcUnit loaderUnitId */
            loaderUnitId?: (number | null);
        }

        /** Represents a SerializedMcUnit. */
        export declare class SerializedMcUnit implements ISerializedMcUnit {

            /**
             * Constructs a new SerializedMcUnit.
             * @param [properties] Properties to set
             */
            constructor(properties?: ISerializedMcUnit);

            /** SerializedMcUnit gridX. */
            public gridX: number;

            /** SerializedMcUnit gridY. */
            public gridY: number;

            /** SerializedMcUnit viewId. */
            public viewId: number;

            /** SerializedMcUnit unitId. */
            public unitId: number;

            /** SerializedMcUnit state. */
            public state: number;

            /** SerializedMcUnit primaryWeaponCurrentAmmo. */
            public primaryWeaponCurrentAmmo: number;

            /** SerializedMcUnit currentHp. */
            public currentHp: number;

            /** SerializedMcUnit isCapturingTile. */
            public isCapturingTile: boolean;

            /** SerializedMcUnit isDiving. */
            public isDiving: boolean;

            /** SerializedMcUnit flareCurrentAmmo. */
            public flareCurrentAmmo: number;

            /** SerializedMcUnit currentFuel. */
            public currentFuel: number;

            /** SerializedMcUnit currentBuildMaterial. */
            public currentBuildMaterial: number;

            /** SerializedMcUnit currentProduceMaterial. */
            public currentProduceMaterial: number;

            /** SerializedMcUnit currentPromotion. */
            public currentPromotion: number;

            /** SerializedMcUnit isBuildingTile. */
            public isBuildingTile: boolean;

            /** SerializedMcUnit loaderUnitId. */
            public loaderUnitId: number;

            /**
             * Creates a new SerializedMcUnit instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SerializedMcUnit instance
             */
            public static create(properties?: ISerializedMcUnit): SerializedMcUnit;

            /**
             * Encodes the specified SerializedMcUnit message. Does not implicitly {@link SerializedMcUnit.verify|verify} messages.
             * @param message SerializedMcUnit message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: ISerializedMcUnit, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified SerializedMcUnit message, length delimited. Does not implicitly {@link SerializedMcUnit.verify|verify} messages.
             * @param message SerializedMcUnit message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: ISerializedMcUnit, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a SerializedMcUnit message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SerializedMcUnit
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): SerializedMcUnit;

            /**
             * Decodes a SerializedMcUnit message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SerializedMcUnit
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): SerializedMcUnit;

            /**
             * Verifies a SerializedMcUnit message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a SerializedMcUnit message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SerializedMcUnit
             */
            public static fromObject(object: { [k: string]: any }): SerializedMcUnit;

            /**
             * Creates a plain object from a SerializedMcUnit message. Also converts values to other types if specified.
             * @param message SerializedMcUnit
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: SerializedMcUnit, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SerializedMcUnit to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a SerializedMcPlayer. */
        export declare interface ISerializedMcPlayer {

            /** SerializedMcPlayer fund */
            fund?: (number | null);

            /** SerializedMcPlayer hasVotedForDraw */
            hasVotedForDraw?: (boolean | null);

            /** SerializedMcPlayer isAlive */
            isAlive?: (boolean | null);

            /** SerializedMcPlayer playerIndex */
            playerIndex?: (number | null);

            /** SerializedMcPlayer teamIndex */
            teamIndex?: (number | null);

            /** SerializedMcPlayer userId */
            userId?: (number | null);
        }

        /** Represents a SerializedMcPlayer. */
        export declare class SerializedMcPlayer implements ISerializedMcPlayer {

            /**
             * Constructs a new SerializedMcPlayer.
             * @param [properties] Properties to set
             */
            constructor(properties?: ISerializedMcPlayer);

            /** SerializedMcPlayer fund. */
            public fund: number;

            /** SerializedMcPlayer hasVotedForDraw. */
            public hasVotedForDraw: boolean;

            /** SerializedMcPlayer isAlive. */
            public isAlive: boolean;

            /** SerializedMcPlayer playerIndex. */
            public playerIndex: number;

            /** SerializedMcPlayer teamIndex. */
            public teamIndex: number;

            /** SerializedMcPlayer userId. */
            public userId: number;

            /**
             * Creates a new SerializedMcPlayer instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SerializedMcPlayer instance
             */
            public static create(properties?: ISerializedMcPlayer): SerializedMcPlayer;

            /**
             * Encodes the specified SerializedMcPlayer message. Does not implicitly {@link SerializedMcPlayer.verify|verify} messages.
             * @param message SerializedMcPlayer message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: ISerializedMcPlayer, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified SerializedMcPlayer message, length delimited. Does not implicitly {@link SerializedMcPlayer.verify|verify} messages.
             * @param message SerializedMcPlayer message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: ISerializedMcPlayer, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a SerializedMcPlayer message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SerializedMcPlayer
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): SerializedMcPlayer;

            /**
             * Decodes a SerializedMcPlayer message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SerializedMcPlayer
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): SerializedMcPlayer;

            /**
             * Verifies a SerializedMcPlayer message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a SerializedMcPlayer message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SerializedMcPlayer
             */
            public static fromObject(object: { [k: string]: any }): SerializedMcPlayer;

            /**
             * Creates a plain object from a SerializedMcPlayer message. Also converts values to other types if specified.
             * @param message SerializedMcPlayer
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: SerializedMcPlayer, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SerializedMcPlayer to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a SerializedMcTurn. */
        export declare interface ISerializedMcTurn {

            /** SerializedMcTurn turnIndex */
            turnIndex?: (number | null);

            /** SerializedMcTurn playerIndex */
            playerIndex?: (number | null);

            /** SerializedMcTurn turnPhaseCode */
            turnPhaseCode?: (number | null);
        }

        /** Represents a SerializedMcTurn. */
        export declare class SerializedMcTurn implements ISerializedMcTurn {

            /**
             * Constructs a new SerializedMcTurn.
             * @param [properties] Properties to set
             */
            constructor(properties?: ISerializedMcTurn);

            /** SerializedMcTurn turnIndex. */
            public turnIndex: number;

            /** SerializedMcTurn playerIndex. */
            public playerIndex: number;

            /** SerializedMcTurn turnPhaseCode. */
            public turnPhaseCode: number;

            /**
             * Creates a new SerializedMcTurn instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SerializedMcTurn instance
             */
            public static create(properties?: ISerializedMcTurn): SerializedMcTurn;

            /**
             * Encodes the specified SerializedMcTurn message. Does not implicitly {@link SerializedMcTurn.verify|verify} messages.
             * @param message SerializedMcTurn message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: ISerializedMcTurn, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified SerializedMcTurn message, length delimited. Does not implicitly {@link SerializedMcTurn.verify|verify} messages.
             * @param message SerializedMcTurn message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: ISerializedMcTurn, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a SerializedMcTurn message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SerializedMcTurn
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): SerializedMcTurn;

            /**
             * Decodes a SerializedMcTurn message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SerializedMcTurn
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): SerializedMcTurn;

            /**
             * Verifies a SerializedMcTurn message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a SerializedMcTurn message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SerializedMcTurn
             */
            public static fromObject(object: { [k: string]: any }): SerializedMcTurn;

            /**
             * Creates a plain object from a SerializedMcTurn message. Also converts values to other types if specified.
             * @param message SerializedMcTurn
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: SerializedMcTurn, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SerializedMcTurn to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a SerializedMcTileMap. */
        export declare interface ISerializedMcTileMap {

            /** SerializedMcTileMap tiles */
            tiles?: (ISerializedMcTile[] | null);
        }

        /** Represents a SerializedMcTileMap. */
        export declare class SerializedMcTileMap implements ISerializedMcTileMap {

            /**
             * Constructs a new SerializedMcTileMap.
             * @param [properties] Properties to set
             */
            constructor(properties?: ISerializedMcTileMap);

            /** SerializedMcTileMap tiles. */
            public tiles: ISerializedMcTile[];

            /**
             * Creates a new SerializedMcTileMap instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SerializedMcTileMap instance
             */
            public static create(properties?: ISerializedMcTileMap): SerializedMcTileMap;

            /**
             * Encodes the specified SerializedMcTileMap message. Does not implicitly {@link SerializedMcTileMap.verify|verify} messages.
             * @param message SerializedMcTileMap message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: ISerializedMcTileMap, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified SerializedMcTileMap message, length delimited. Does not implicitly {@link SerializedMcTileMap.verify|verify} messages.
             * @param message SerializedMcTileMap message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: ISerializedMcTileMap, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a SerializedMcTileMap message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SerializedMcTileMap
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): SerializedMcTileMap;

            /**
             * Decodes a SerializedMcTileMap message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SerializedMcTileMap
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): SerializedMcTileMap;

            /**
             * Verifies a SerializedMcTileMap message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a SerializedMcTileMap message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SerializedMcTileMap
             */
            public static fromObject(object: { [k: string]: any }): SerializedMcTileMap;

            /**
             * Creates a plain object from a SerializedMcTileMap message. Also converts values to other types if specified.
             * @param message SerializedMcTileMap
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: SerializedMcTileMap, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SerializedMcTileMap to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a SerializedMcUnitMap. */
        export declare interface ISerializedMcUnitMap {

            /** SerializedMcUnitMap nextUnitId */
            nextUnitId?: (number | null);

            /** SerializedMcUnitMap units */
            units?: (ISerializedMcUnit[] | null);
        }

        /** Represents a SerializedMcUnitMap. */
        export declare class SerializedMcUnitMap implements ISerializedMcUnitMap {

            /**
             * Constructs a new SerializedMcUnitMap.
             * @param [properties] Properties to set
             */
            constructor(properties?: ISerializedMcUnitMap);

            /** SerializedMcUnitMap nextUnitId. */
            public nextUnitId: number;

            /** SerializedMcUnitMap units. */
            public units: ISerializedMcUnit[];

            /**
             * Creates a new SerializedMcUnitMap instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SerializedMcUnitMap instance
             */
            public static create(properties?: ISerializedMcUnitMap): SerializedMcUnitMap;

            /**
             * Encodes the specified SerializedMcUnitMap message. Does not implicitly {@link SerializedMcUnitMap.verify|verify} messages.
             * @param message SerializedMcUnitMap message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: ISerializedMcUnitMap, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified SerializedMcUnitMap message, length delimited. Does not implicitly {@link SerializedMcUnitMap.verify|verify} messages.
             * @param message SerializedMcUnitMap message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: ISerializedMcUnitMap, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a SerializedMcUnitMap message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SerializedMcUnitMap
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): SerializedMcUnitMap;

            /**
             * Decodes a SerializedMcUnitMap message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SerializedMcUnitMap
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): SerializedMcUnitMap;

            /**
             * Verifies a SerializedMcUnitMap message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a SerializedMcUnitMap message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SerializedMcUnitMap
             */
            public static fromObject(object: { [k: string]: any }): SerializedMcUnitMap;

            /**
             * Creates a plain object from a SerializedMcUnitMap message. Also converts values to other types if specified.
             * @param message SerializedMcUnitMap
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: SerializedMcUnitMap, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SerializedMcUnitMap to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a SerializedMcFogMapForPath. */
        export declare interface ISerializedMcFogMapForPath {

            /** SerializedMcFogMapForPath playerIndex */
            playerIndex?: (number | null);

            /** SerializedMcFogMapForPath encodedMap */
            encodedMap?: (string | null);
        }

        /** Represents a SerializedMcFogMapForPath. */
        export declare class SerializedMcFogMapForPath implements ISerializedMcFogMapForPath {

            /**
             * Constructs a new SerializedMcFogMapForPath.
             * @param [properties] Properties to set
             */
            constructor(properties?: ISerializedMcFogMapForPath);

            /** SerializedMcFogMapForPath playerIndex. */
            public playerIndex: number;

            /** SerializedMcFogMapForPath encodedMap. */
            public encodedMap: string;

            /**
             * Creates a new SerializedMcFogMapForPath instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SerializedMcFogMapForPath instance
             */
            public static create(properties?: ISerializedMcFogMapForPath): SerializedMcFogMapForPath;

            /**
             * Encodes the specified SerializedMcFogMapForPath message. Does not implicitly {@link SerializedMcFogMapForPath.verify|verify} messages.
             * @param message SerializedMcFogMapForPath message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: ISerializedMcFogMapForPath, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified SerializedMcFogMapForPath message, length delimited. Does not implicitly {@link SerializedMcFogMapForPath.verify|verify} messages.
             * @param message SerializedMcFogMapForPath message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: ISerializedMcFogMapForPath, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a SerializedMcFogMapForPath message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SerializedMcFogMapForPath
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): SerializedMcFogMapForPath;

            /**
             * Decodes a SerializedMcFogMapForPath message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SerializedMcFogMapForPath
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): SerializedMcFogMapForPath;

            /**
             * Verifies a SerializedMcFogMapForPath message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a SerializedMcFogMapForPath message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SerializedMcFogMapForPath
             */
            public static fromObject(object: { [k: string]: any }): SerializedMcFogMapForPath;

            /**
             * Creates a plain object from a SerializedMcFogMapForPath message. Also converts values to other types if specified.
             * @param message SerializedMcFogMapForPath
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: SerializedMcFogMapForPath, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SerializedMcFogMapForPath to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a SerializedMcFogMap. */
        export declare interface ISerializedMcFogMap {

            /** SerializedMcFogMap forceFogCode */
            forceFogCode?: (number | null);

            /** SerializedMcFogMap forceExpirePlayerIndex */
            forceExpirePlayerIndex?: (number | null);

            /** SerializedMcFogMap forceExpireTurnIndex */
            forceExpireTurnIndex?: (number | null);

            /** SerializedMcFogMap mapsForPath */
            mapsForPath?: (ISerializedMcFogMapForPath[] | null);
        }

        /** Represents a SerializedMcFogMap. */
        export declare class SerializedMcFogMap implements ISerializedMcFogMap {

            /**
             * Constructs a new SerializedMcFogMap.
             * @param [properties] Properties to set
             */
            constructor(properties?: ISerializedMcFogMap);

            /** SerializedMcFogMap forceFogCode. */
            public forceFogCode: number;

            /** SerializedMcFogMap forceExpirePlayerIndex. */
            public forceExpirePlayerIndex: number;

            /** SerializedMcFogMap forceExpireTurnIndex. */
            public forceExpireTurnIndex: number;

            /** SerializedMcFogMap mapsForPath. */
            public mapsForPath: ISerializedMcFogMapForPath[];

            /**
             * Creates a new SerializedMcFogMap instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SerializedMcFogMap instance
             */
            public static create(properties?: ISerializedMcFogMap): SerializedMcFogMap;

            /**
             * Encodes the specified SerializedMcFogMap message. Does not implicitly {@link SerializedMcFogMap.verify|verify} messages.
             * @param message SerializedMcFogMap message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: ISerializedMcFogMap, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified SerializedMcFogMap message, length delimited. Does not implicitly {@link SerializedMcFogMap.verify|verify} messages.
             * @param message SerializedMcFogMap message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: ISerializedMcFogMap, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a SerializedMcFogMap message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SerializedMcFogMap
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): SerializedMcFogMap;

            /**
             * Decodes a SerializedMcFogMap message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SerializedMcFogMap
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): SerializedMcFogMap;

            /**
             * Verifies a SerializedMcFogMap message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a SerializedMcFogMap message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SerializedMcFogMap
             */
            public static fromObject(object: { [k: string]: any }): SerializedMcFogMap;

            /**
             * Creates a plain object from a SerializedMcFogMap message. Also converts values to other types if specified.
             * @param message SerializedMcFogMap
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: SerializedMcFogMap, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SerializedMcFogMap to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a SerializedMcField. */
        export declare interface ISerializedMcField {

            /** SerializedMcField fogMap */
            fogMap?: (ISerializedMcFogMap | null);

            /** SerializedMcField tileMap */
            tileMap?: (ISerializedMcTileMap | null);

            /** SerializedMcField unitMap */
            unitMap?: (ISerializedMcUnitMap | null);
        }

        /** Represents a SerializedMcField. */
        export declare class SerializedMcField implements ISerializedMcField {

            /**
             * Constructs a new SerializedMcField.
             * @param [properties] Properties to set
             */
            constructor(properties?: ISerializedMcField);

            /** SerializedMcField fogMap. */
            public fogMap?: (ISerializedMcFogMap | null);

            /** SerializedMcField tileMap. */
            public tileMap?: (ISerializedMcTileMap | null);

            /** SerializedMcField unitMap. */
            public unitMap?: (ISerializedMcUnitMap | null);

            /**
             * Creates a new SerializedMcField instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SerializedMcField instance
             */
            public static create(properties?: ISerializedMcField): SerializedMcField;

            /**
             * Encodes the specified SerializedMcField message. Does not implicitly {@link SerializedMcField.verify|verify} messages.
             * @param message SerializedMcField message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: ISerializedMcField, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified SerializedMcField message, length delimited. Does not implicitly {@link SerializedMcField.verify|verify} messages.
             * @param message SerializedMcField message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: ISerializedMcField, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a SerializedMcField message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SerializedMcField
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): SerializedMcField;

            /**
             * Decodes a SerializedMcField message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SerializedMcField
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): SerializedMcField;

            /**
             * Verifies a SerializedMcField message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a SerializedMcField message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SerializedMcField
             */
            public static fromObject(object: { [k: string]: any }): SerializedMcField;

            /**
             * Creates a plain object from a SerializedMcField message. Also converts values to other types if specified.
             * @param message SerializedMcField
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: SerializedMcField, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SerializedMcField to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a SerializedMcWar. */
        export declare interface ISerializedMcWar {

            /** SerializedMcWar warId */
            warId?: (number | null);

            /** SerializedMcWar configVersion */
            configVersion?: (number | null);

            /** SerializedMcWar mapName */
            mapName?: (string | null);

            /** SerializedMcWar mapDesigner */
            mapDesigner?: (string | null);

            /** SerializedMcWar mapVersion */
            mapVersion?: (number | null);

            /** SerializedMcWar warName */
            warName?: (string | null);

            /** SerializedMcWar warPassword */
            warPassword?: (string | null);

            /** SerializedMcWar warComment */
            warComment?: (string | null);

            /** SerializedMcWar hasFogByDefault */
            hasFogByDefault?: (boolean | null);

            /** SerializedMcWar timeLimit */
            timeLimit?: (number | null);

            /** SerializedMcWar initialFund */
            initialFund?: (number | null);

            /** SerializedMcWar incomeModifier */
            incomeModifier?: (number | null);

            /** SerializedMcWar initialEnergy */
            initialEnergy?: (number | null);

            /** SerializedMcWar energyGrowthModifier */
            energyGrowthModifier?: (number | null);

            /** SerializedMcWar moveRangeModifier */
            moveRangeModifier?: (number | null);

            /** SerializedMcWar attackPowerModifier */
            attackPowerModifier?: (number | null);

            /** SerializedMcWar visionRangeModifier */
            visionRangeModifier?: (number | null);

            /** SerializedMcWar currentActionId */
            currentActionId?: (number | null);

            /** SerializedMcWar remainingVotesForDraw */
            remainingVotesForDraw?: (number | null);

            /** SerializedMcWar enterTurnTime */
            enterTurnTime?: (number | null);

            /** SerializedMcWar executedActions */
            executedActions?: (IContainer | null);

            /** SerializedMcWar players */
            players?: (ISerializedMcPlayer[] | null);

            /** SerializedMcWar turn */
            turn?: (ISerializedMcTurn | null);

            /** SerializedMcWar field */
            field?: (ISerializedMcField | null);
        }

        /** Represents a SerializedMcWar. */
        export declare class SerializedMcWar implements ISerializedMcWar {

            /**
             * Constructs a new SerializedMcWar.
             * @param [properties] Properties to set
             */
            constructor(properties?: ISerializedMcWar);

            /** SerializedMcWar warId. */
            public warId: number;

            /** SerializedMcWar configVersion. */
            public configVersion: number;

            /** SerializedMcWar mapName. */
            public mapName: string;

            /** SerializedMcWar mapDesigner. */
            public mapDesigner: string;

            /** SerializedMcWar mapVersion. */
            public mapVersion: number;

            /** SerializedMcWar warName. */
            public warName: string;

            /** SerializedMcWar warPassword. */
            public warPassword: string;

            /** SerializedMcWar warComment. */
            public warComment: string;

            /** SerializedMcWar hasFogByDefault. */
            public hasFogByDefault: boolean;

            /** SerializedMcWar timeLimit. */
            public timeLimit: number;

            /** SerializedMcWar initialFund. */
            public initialFund: number;

            /** SerializedMcWar incomeModifier. */
            public incomeModifier: number;

            /** SerializedMcWar initialEnergy. */
            public initialEnergy: number;

            /** SerializedMcWar energyGrowthModifier. */
            public energyGrowthModifier: number;

            /** SerializedMcWar moveRangeModifier. */
            public moveRangeModifier: number;

            /** SerializedMcWar attackPowerModifier. */
            public attackPowerModifier: number;

            /** SerializedMcWar visionRangeModifier. */
            public visionRangeModifier: number;

            /** SerializedMcWar currentActionId. */
            public currentActionId: number;

            /** SerializedMcWar remainingVotesForDraw. */
            public remainingVotesForDraw: number;

            /** SerializedMcWar enterTurnTime. */
            public enterTurnTime: number;

            /** SerializedMcWar executedActions. */
            public executedActions?: (IContainer | null);

            /** SerializedMcWar players. */
            public players: ISerializedMcPlayer[];

            /** SerializedMcWar turn. */
            public turn?: (ISerializedMcTurn | null);

            /** SerializedMcWar field. */
            public field?: (ISerializedMcField | null);

            /**
             * Creates a new SerializedMcWar instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SerializedMcWar instance
             */
            public static create(properties?: ISerializedMcWar): SerializedMcWar;

            /**
             * Encodes the specified SerializedMcWar message. Does not implicitly {@link SerializedMcWar.verify|verify} messages.
             * @param message SerializedMcWar message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: ISerializedMcWar, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified SerializedMcWar message, length delimited. Does not implicitly {@link SerializedMcWar.verify|verify} messages.
             * @param message SerializedMcWar message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: ISerializedMcWar, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a SerializedMcWar message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SerializedMcWar
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): SerializedMcWar;

            /**
             * Decodes a SerializedMcWar message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SerializedMcWar
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): SerializedMcWar;

            /**
             * Verifies a SerializedMcWar message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a SerializedMcWar message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SerializedMcWar
             */
            public static fromObject(object: { [k: string]: any }): SerializedMcWar;

            /**
             * Creates a plain object from a SerializedMcWar message. Also converts values to other types if specified.
             * @param message SerializedMcWar
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: SerializedMcWar, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SerializedMcWar to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a MapInfo. */
        export declare interface IMapInfo {

            /** MapInfo mapName */
            mapName?: (string | null);

            /** MapInfo mapDesigner */
            mapDesigner?: (string | null);

            /** MapInfo mapVersion */
            mapVersion?: (number | null);

            /** MapInfo playersCount */
            playersCount?: (number | null);

            /** MapInfo rating */
            rating?: (number | null);

            /** MapInfo playedTimes */
            playedTimes?: (number | null);
        }

        /** Represents a MapInfo. */
        export declare class MapInfo implements IMapInfo {

            /**
             * Constructs a new MapInfo.
             * @param [properties] Properties to set
             */
            constructor(properties?: IMapInfo);

            /** MapInfo mapName. */
            public mapName: string;

            /** MapInfo mapDesigner. */
            public mapDesigner: string;

            /** MapInfo mapVersion. */
            public mapVersion: number;

            /** MapInfo playersCount. */
            public playersCount: number;

            /** MapInfo rating. */
            public rating: number;

            /** MapInfo playedTimes. */
            public playedTimes: number;

            /**
             * Creates a new MapInfo instance using the specified properties.
             * @param [properties] Properties to set
             * @returns MapInfo instance
             */
            public static create(properties?: IMapInfo): MapInfo;

            /**
             * Encodes the specified MapInfo message. Does not implicitly {@link MapInfo.verify|verify} messages.
             * @param message MapInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IMapInfo, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified MapInfo message, length delimited. Does not implicitly {@link MapInfo.verify|verify} messages.
             * @param message MapInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IMapInfo, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a MapInfo message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MapInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): MapInfo;

            /**
             * Decodes a MapInfo message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MapInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): MapInfo;

            /**
             * Verifies a MapInfo message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a MapInfo message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns MapInfo
             */
            public static fromObject(object: { [k: string]: any }): MapInfo;

            /**
             * Creates a plain object from a MapInfo message. Also converts values to other types if specified.
             * @param message MapInfo
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: MapInfo, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this MapInfo to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a WaitingMultiCustomWarInfo. */
        export declare interface IWaitingMultiCustomWarInfo {

            /** WaitingMultiCustomWarInfo id */
            id?: (number | null);

            /** WaitingMultiCustomWarInfo mapName */
            mapName?: (string | null);

            /** WaitingMultiCustomWarInfo mapDesigner */
            mapDesigner?: (string | null);

            /** WaitingMultiCustomWarInfo mapVersion */
            mapVersion?: (number | null);

            /** WaitingMultiCustomWarInfo warName */
            warName?: (string | null);

            /** WaitingMultiCustomWarInfo warPassword */
            warPassword?: (string | null);

            /** WaitingMultiCustomWarInfo warComment */
            warComment?: (string | null);

            /** WaitingMultiCustomWarInfo configVersion */
            configVersion?: (number | null);

            /** WaitingMultiCustomWarInfo p1UserId */
            p1UserId?: (number | null);

            /** WaitingMultiCustomWarInfo p1UserNickname */
            p1UserNickname?: (string | null);

            /** WaitingMultiCustomWarInfo p1TeamIndex */
            p1TeamIndex?: (number | null);

            /** WaitingMultiCustomWarInfo p2UserId */
            p2UserId?: (number | null);

            /** WaitingMultiCustomWarInfo p2UserNickname */
            p2UserNickname?: (string | null);

            /** WaitingMultiCustomWarInfo p2TeamIndex */
            p2TeamIndex?: (number | null);

            /** WaitingMultiCustomWarInfo p3UserId */
            p3UserId?: (number | null);

            /** WaitingMultiCustomWarInfo p3UserNickname */
            p3UserNickname?: (string | null);

            /** WaitingMultiCustomWarInfo p3TeamIndex */
            p3TeamIndex?: (number | null);

            /** WaitingMultiCustomWarInfo p4UserId */
            p4UserId?: (number | null);

            /** WaitingMultiCustomWarInfo p4UserNickname */
            p4UserNickname?: (string | null);

            /** WaitingMultiCustomWarInfo p4TeamIndex */
            p4TeamIndex?: (number | null);

            /** WaitingMultiCustomWarInfo hasFog */
            hasFog?: (number | null);

            /** WaitingMultiCustomWarInfo timeLimit */
            timeLimit?: (number | null);

            /** WaitingMultiCustomWarInfo initialFund */
            initialFund?: (number | null);

            /** WaitingMultiCustomWarInfo incomeModifier */
            incomeModifier?: (number | null);

            /** WaitingMultiCustomWarInfo initialEnergy */
            initialEnergy?: (number | null);

            /** WaitingMultiCustomWarInfo energyGrowthModifier */
            energyGrowthModifier?: (number | null);

            /** WaitingMultiCustomWarInfo moveRangeModifier */
            moveRangeModifier?: (number | null);

            /** WaitingMultiCustomWarInfo attackPowerModifier */
            attackPowerModifier?: (number | null);

            /** WaitingMultiCustomWarInfo visionRangeModifier */
            visionRangeModifier?: (number | null);
        }

        /** Represents a WaitingMultiCustomWarInfo. */
        export declare class WaitingMultiCustomWarInfo implements IWaitingMultiCustomWarInfo {

            /**
             * Constructs a new WaitingMultiCustomWarInfo.
             * @param [properties] Properties to set
             */
            constructor(properties?: IWaitingMultiCustomWarInfo);

            /** WaitingMultiCustomWarInfo id. */
            public id: number;

            /** WaitingMultiCustomWarInfo mapName. */
            public mapName: string;

            /** WaitingMultiCustomWarInfo mapDesigner. */
            public mapDesigner: string;

            /** WaitingMultiCustomWarInfo mapVersion. */
            public mapVersion: number;

            /** WaitingMultiCustomWarInfo warName. */
            public warName: string;

            /** WaitingMultiCustomWarInfo warPassword. */
            public warPassword: string;

            /** WaitingMultiCustomWarInfo warComment. */
            public warComment: string;

            /** WaitingMultiCustomWarInfo configVersion. */
            public configVersion: number;

            /** WaitingMultiCustomWarInfo p1UserId. */
            public p1UserId: number;

            /** WaitingMultiCustomWarInfo p1UserNickname. */
            public p1UserNickname: string;

            /** WaitingMultiCustomWarInfo p1TeamIndex. */
            public p1TeamIndex: number;

            /** WaitingMultiCustomWarInfo p2UserId. */
            public p2UserId: number;

            /** WaitingMultiCustomWarInfo p2UserNickname. */
            public p2UserNickname: string;

            /** WaitingMultiCustomWarInfo p2TeamIndex. */
            public p2TeamIndex: number;

            /** WaitingMultiCustomWarInfo p3UserId. */
            public p3UserId: number;

            /** WaitingMultiCustomWarInfo p3UserNickname. */
            public p3UserNickname: string;

            /** WaitingMultiCustomWarInfo p3TeamIndex. */
            public p3TeamIndex: number;

            /** WaitingMultiCustomWarInfo p4UserId. */
            public p4UserId: number;

            /** WaitingMultiCustomWarInfo p4UserNickname. */
            public p4UserNickname: string;

            /** WaitingMultiCustomWarInfo p4TeamIndex. */
            public p4TeamIndex: number;

            /** WaitingMultiCustomWarInfo hasFog. */
            public hasFog: number;

            /** WaitingMultiCustomWarInfo timeLimit. */
            public timeLimit: number;

            /** WaitingMultiCustomWarInfo initialFund. */
            public initialFund: number;

            /** WaitingMultiCustomWarInfo incomeModifier. */
            public incomeModifier: number;

            /** WaitingMultiCustomWarInfo initialEnergy. */
            public initialEnergy: number;

            /** WaitingMultiCustomWarInfo energyGrowthModifier. */
            public energyGrowthModifier: number;

            /** WaitingMultiCustomWarInfo moveRangeModifier. */
            public moveRangeModifier: number;

            /** WaitingMultiCustomWarInfo attackPowerModifier. */
            public attackPowerModifier: number;

            /** WaitingMultiCustomWarInfo visionRangeModifier. */
            public visionRangeModifier: number;

            /**
             * Creates a new WaitingMultiCustomWarInfo instance using the specified properties.
             * @param [properties] Properties to set
             * @returns WaitingMultiCustomWarInfo instance
             */
            public static create(properties?: IWaitingMultiCustomWarInfo): WaitingMultiCustomWarInfo;

            /**
             * Encodes the specified WaitingMultiCustomWarInfo message. Does not implicitly {@link WaitingMultiCustomWarInfo.verify|verify} messages.
             * @param message WaitingMultiCustomWarInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IWaitingMultiCustomWarInfo, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified WaitingMultiCustomWarInfo message, length delimited. Does not implicitly {@link WaitingMultiCustomWarInfo.verify|verify} messages.
             * @param message WaitingMultiCustomWarInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IWaitingMultiCustomWarInfo, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a WaitingMultiCustomWarInfo message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns WaitingMultiCustomWarInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): WaitingMultiCustomWarInfo;

            /**
             * Decodes a WaitingMultiCustomWarInfo message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns WaitingMultiCustomWarInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): WaitingMultiCustomWarInfo;

            /**
             * Verifies a WaitingMultiCustomWarInfo message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a WaitingMultiCustomWarInfo message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns WaitingMultiCustomWarInfo
             */
            public static fromObject(object: { [k: string]: any }): WaitingMultiCustomWarInfo;

            /**
             * Creates a plain object from a WaitingMultiCustomWarInfo message. Also converts values to other types if specified.
             * @param message WaitingMultiCustomWarInfo
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: WaitingMultiCustomWarInfo, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this WaitingMultiCustomWarInfo to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a Container. */
        export declare interface IContainer {

            /** Container actionCode */
            actionCode?: (number | null);

            /** Container C_Heartbeat */
            C_Heartbeat?: (IC_Heartbeat | null);

            /** Container S_Heartbeat */
            S_Heartbeat?: (IS_Heartbeat | null);

            /** Container C_Register */
            C_Register?: (IC_Register | null);

            /** Container S_Register */
            S_Register?: (IS_Register | null);

            /** Container C_Login */
            C_Login?: (IC_Login | null);

            /** Container S_Login */
            S_Login?: (IS_Login | null);

            /** Container C_Logout */
            C_Logout?: (IC_Logout | null);

            /** Container S_Logout */
            S_Logout?: (IS_Logout | null);

            /** Container S_Error */
            S_Error?: (IS_Error | null);

            /** Container C_GetNewestMapInfos */
            C_GetNewestMapInfos?: (IC_GetNewestMapInfos | null);

            /** Container S_GetNewestMapInfos */
            S_GetNewestMapInfos?: (IS_GetNewestMapInfos | null);

            /** Container C_CreateMultiCustomWar */
            C_CreateMultiCustomWar?: (IC_CreateMultiCustomWar | null);

            /** Container S_CreateMultiCustomWar */
            S_CreateMultiCustomWar?: (IS_CreateMultiCustomWar | null);

            /** Container C_ExitMultiCustomWar */
            C_ExitMultiCustomWar?: (IC_ExitMultiCustomWar | null);

            /** Container S_ExitMultiCustomWar */
            S_ExitMultiCustomWar?: (IS_ExitMultiCustomWar | null);

            /** Container C_GetJoinedWaitingMultiCustomWarInfos */
            C_GetJoinedWaitingMultiCustomWarInfos?: (IC_GetJoinedWaitingMultiCustomWarInfos | null);

            /** Container S_GetJoinedWaitingMultiCustomWarInfos */
            S_GetJoinedWaitingMultiCustomWarInfos?: (IS_GetJoinedWaitingMultiCustomWarInfos | null);

            /** Container C_GetUnjoinedWaitingMultiCustomWarInfos */
            C_GetUnjoinedWaitingMultiCustomWarInfos?: (IC_GetUnjoinedWaitingMultiCustomWarInfos | null);

            /** Container S_GetUnjoinedWaitingMultiCustomWarInfos */
            S_GetUnjoinedWaitingMultiCustomWarInfos?: (IS_GetUnjoinedWaitingMultiCustomWarInfos | null);

            /** Container C_JoinMultiCustomWar */
            C_JoinMultiCustomWar?: (IC_JoinMultiCustomWar | null);

            /** Container S_JoinMultiCustomWar */
            S_JoinMultiCustomWar?: (IS_JoinMultiCustomWar | null);

            /** Container S_NewestConfigVersion */
            S_NewestConfigVersion?: (IS_NewestConfigVersion | null);
        }

        /** Represents a Container. */
        export declare class Container implements IContainer {

            /**
             * Constructs a new Container.
             * @param [properties] Properties to set
             */
            constructor(properties?: IContainer);

            /** Container actionCode. */
            public actionCode: number;

            /** Container C_Heartbeat. */
            public C_Heartbeat?: (IC_Heartbeat | null);

            /** Container S_Heartbeat. */
            public S_Heartbeat?: (IS_Heartbeat | null);

            /** Container C_Register. */
            public C_Register?: (IC_Register | null);

            /** Container S_Register. */
            public S_Register?: (IS_Register | null);

            /** Container C_Login. */
            public C_Login?: (IC_Login | null);

            /** Container S_Login. */
            public S_Login?: (IS_Login | null);

            /** Container C_Logout. */
            public C_Logout?: (IC_Logout | null);

            /** Container S_Logout. */
            public S_Logout?: (IS_Logout | null);

            /** Container S_Error. */
            public S_Error?: (IS_Error | null);

            /** Container C_GetNewestMapInfos. */
            public C_GetNewestMapInfos?: (IC_GetNewestMapInfos | null);

            /** Container S_GetNewestMapInfos. */
            public S_GetNewestMapInfos?: (IS_GetNewestMapInfos | null);

            /** Container C_CreateMultiCustomWar. */
            public C_CreateMultiCustomWar?: (IC_CreateMultiCustomWar | null);

            /** Container S_CreateMultiCustomWar. */
            public S_CreateMultiCustomWar?: (IS_CreateMultiCustomWar | null);

            /** Container C_ExitMultiCustomWar. */
            public C_ExitMultiCustomWar?: (IC_ExitMultiCustomWar | null);

            /** Container S_ExitMultiCustomWar. */
            public S_ExitMultiCustomWar?: (IS_ExitMultiCustomWar | null);

            /** Container C_GetJoinedWaitingMultiCustomWarInfos. */
            public C_GetJoinedWaitingMultiCustomWarInfos?: (IC_GetJoinedWaitingMultiCustomWarInfos | null);

            /** Container S_GetJoinedWaitingMultiCustomWarInfos. */
            public S_GetJoinedWaitingMultiCustomWarInfos?: (IS_GetJoinedWaitingMultiCustomWarInfos | null);

            /** Container C_GetUnjoinedWaitingMultiCustomWarInfos. */
            public C_GetUnjoinedWaitingMultiCustomWarInfos?: (IC_GetUnjoinedWaitingMultiCustomWarInfos | null);

            /** Container S_GetUnjoinedWaitingMultiCustomWarInfos. */
            public S_GetUnjoinedWaitingMultiCustomWarInfos?: (IS_GetUnjoinedWaitingMultiCustomWarInfos | null);

            /** Container C_JoinMultiCustomWar. */
            public C_JoinMultiCustomWar?: (IC_JoinMultiCustomWar | null);

            /** Container S_JoinMultiCustomWar. */
            public S_JoinMultiCustomWar?: (IS_JoinMultiCustomWar | null);

            /** Container S_NewestConfigVersion. */
            public S_NewestConfigVersion?: (IS_NewestConfigVersion | null);

            /**
             * Creates a new Container instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Container instance
             */
            public static create(properties?: IContainer): Container;

            /**
             * Encodes the specified Container message. Does not implicitly {@link Container.verify|verify} messages.
             * @param message Container message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IContainer, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified Container message, length delimited. Does not implicitly {@link Container.verify|verify} messages.
             * @param message Container message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IContainer, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a Container message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Container
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): Container;

            /**
             * Decodes a Container message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Container
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): Container;

            /**
             * Verifies a Container message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a Container message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Container
             */
            public static fromObject(object: { [k: string]: any }): Container;

            /**
             * Creates a plain object from a Container message. Also converts values to other types if specified.
             * @param message Container
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: Container, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Container to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a C_Heartbeat. */
        export declare interface IC_Heartbeat {

            /** C_Heartbeat actionCode */
            actionCode?: (number | null);

            /** C_Heartbeat counter */
            counter?: (number | null);
        }

        /** Represents a C_Heartbeat. */
        export declare class C_Heartbeat implements IC_Heartbeat {

            /**
             * Constructs a new C_Heartbeat.
             * @param [properties] Properties to set
             */
            constructor(properties?: IC_Heartbeat);

            /** C_Heartbeat actionCode. */
            public actionCode: number;

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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): C_Heartbeat;

            /**
             * Decodes a C_Heartbeat message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns C_Heartbeat
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): C_Heartbeat;

            /**
             * Verifies a C_Heartbeat message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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

            /** S_Heartbeat actionCode */
            actionCode?: (number | null);

            /** S_Heartbeat errorCode */
            errorCode?: (number | null);

            /** S_Heartbeat counter */
            counter?: (number | null);

            /** S_Heartbeat timestamp */
            timestamp?: (number | null);
        }

        /** Represents a S_Heartbeat. */
        export declare class S_Heartbeat implements IS_Heartbeat {

            /**
             * Constructs a new S_Heartbeat.
             * @param [properties] Properties to set
             */
            constructor(properties?: IS_Heartbeat);

            /** S_Heartbeat actionCode. */
            public actionCode: number;

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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): S_Heartbeat;

            /**
             * Decodes a S_Heartbeat message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns S_Heartbeat
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): S_Heartbeat;

            /**
             * Verifies a S_Heartbeat message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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

            /** C_Register actionCode */
            actionCode?: (number | null);

            /** C_Register account */
            account?: (string | null);

            /** C_Register password */
            password?: (string | null);

            /** C_Register nickname */
            nickname?: (string | null);
        }

        /** Represents a C_Register. */
        export declare class C_Register implements IC_Register {

            /**
             * Constructs a new C_Register.
             * @param [properties] Properties to set
             */
            constructor(properties?: IC_Register);

            /** C_Register actionCode. */
            public actionCode: number;

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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): C_Register;

            /**
             * Decodes a C_Register message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns C_Register
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): C_Register;

            /**
             * Verifies a C_Register message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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

            /** S_Register actionCode */
            actionCode?: (number | null);

            /** S_Register errorCode */
            errorCode?: (number | null);

            /** S_Register account */
            account?: (string | null);

            /** S_Register password */
            password?: (string | null);
        }

        /** Represents a S_Register. */
        export declare class S_Register implements IS_Register {

            /**
             * Constructs a new S_Register.
             * @param [properties] Properties to set
             */
            constructor(properties?: IS_Register);

            /** S_Register actionCode. */
            public actionCode: number;

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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): S_Register;

            /**
             * Decodes a S_Register message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns S_Register
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): S_Register;

            /**
             * Verifies a S_Register message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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

            /** C_Login actionCode */
            actionCode?: (number | null);

            /** C_Login account */
            account?: (string | null);

            /** C_Login password */
            password?: (string | null);
        }

        /** Represents a C_Login. */
        export declare class C_Login implements IC_Login {

            /**
             * Constructs a new C_Login.
             * @param [properties] Properties to set
             */
            constructor(properties?: IC_Login);

            /** C_Login actionCode. */
            public actionCode: number;

            /** C_Login account. */
            public account: string;

            /** C_Login password. */
            public password: string;

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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): C_Login;

            /**
             * Decodes a C_Login message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns C_Login
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): C_Login;

            /**
             * Verifies a C_Login message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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

            /** S_Login actionCode */
            actionCode?: (number | null);

            /** S_Login errorCode */
            errorCode?: (number | null);

            /** S_Login userId */
            userId?: (number | null);

            /** S_Login privilege */
            privilege?: (number | null);

            /** S_Login account */
            account?: (string | null);

            /** S_Login password */
            password?: (string | null);

            /** S_Login nickname */
            nickname?: (string | null);
        }

        /** Represents a S_Login. */
        export declare class S_Login implements IS_Login {

            /**
             * Constructs a new S_Login.
             * @param [properties] Properties to set
             */
            constructor(properties?: IS_Login);

            /** S_Login actionCode. */
            public actionCode: number;

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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): S_Login;

            /**
             * Decodes a S_Login message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns S_Login
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): S_Login;

            /**
             * Verifies a S_Login message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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

            /** C_Logout actionCode */
            actionCode?: (number | null);
        }

        /** Represents a C_Logout. */
        export declare class C_Logout implements IC_Logout {

            /**
             * Constructs a new C_Logout.
             * @param [properties] Properties to set
             */
            constructor(properties?: IC_Logout);

            /** C_Logout actionCode. */
            public actionCode: number;

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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): C_Logout;

            /**
             * Decodes a C_Logout message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns C_Logout
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): C_Logout;

            /**
             * Verifies a C_Logout message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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

            /** S_Logout actionCode */
            actionCode?: (number | null);

            /** S_Logout errorCode */
            errorCode?: (number | null);

            /** S_Logout reason */
            reason?: (number | null);
        }

        /** Represents a S_Logout. */
        export declare class S_Logout implements IS_Logout {

            /**
             * Constructs a new S_Logout.
             * @param [properties] Properties to set
             */
            constructor(properties?: IS_Logout);

            /** S_Logout actionCode. */
            public actionCode: number;

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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): S_Logout;

            /**
             * Decodes a S_Logout message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns S_Logout
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): S_Logout;

            /**
             * Verifies a S_Logout message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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

            /** S_Error actionCode */
            actionCode?: (number | null);

            /** S_Error errorCode */
            errorCode?: (number | null);
        }

        /** Represents a S_Error. */
        export declare class S_Error implements IS_Error {

            /**
             * Constructs a new S_Error.
             * @param [properties] Properties to set
             */
            constructor(properties?: IS_Error);

            /** S_Error actionCode. */
            public actionCode: number;

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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): S_Error;

            /**
             * Decodes a S_Error message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns S_Error
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): S_Error;

            /**
             * Verifies a S_Error message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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

        /** Properties of a C_GetNewestMapInfos. */
        export declare interface IC_GetNewestMapInfos {

            /** C_GetNewestMapInfos actionCode */
            actionCode?: (number | null);

            /** C_GetNewestMapInfos mapName */
            mapName?: (string | null);

            /** C_GetNewestMapInfos mapDesigner */
            mapDesigner?: (string | null);

            /** C_GetNewestMapInfos playersCount */
            playersCount?: (number | null);

            /** C_GetNewestMapInfos minRating */
            minRating?: (number | null);

            /** C_GetNewestMapInfos minPlayedTimes */
            minPlayedTimes?: (number | null);
        }

        /** Represents a C_GetNewestMapInfos. */
        export declare class C_GetNewestMapInfos implements IC_GetNewestMapInfos {

            /**
             * Constructs a new C_GetNewestMapInfos.
             * @param [properties] Properties to set
             */
            constructor(properties?: IC_GetNewestMapInfos);

            /** C_GetNewestMapInfos actionCode. */
            public actionCode: number;

            /** C_GetNewestMapInfos mapName. */
            public mapName: string;

            /** C_GetNewestMapInfos mapDesigner. */
            public mapDesigner: string;

            /** C_GetNewestMapInfos playersCount. */
            public playersCount: number;

            /** C_GetNewestMapInfos minRating. */
            public minRating: number;

            /** C_GetNewestMapInfos minPlayedTimes. */
            public minPlayedTimes: number;

            /**
             * Creates a new C_GetNewestMapInfos instance using the specified properties.
             * @param [properties] Properties to set
             * @returns C_GetNewestMapInfos instance
             */
            public static create(properties?: IC_GetNewestMapInfos): C_GetNewestMapInfos;

            /**
             * Encodes the specified C_GetNewestMapInfos message. Does not implicitly {@link C_GetNewestMapInfos.verify|verify} messages.
             * @param message C_GetNewestMapInfos message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IC_GetNewestMapInfos, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified C_GetNewestMapInfos message, length delimited. Does not implicitly {@link C_GetNewestMapInfos.verify|verify} messages.
             * @param message C_GetNewestMapInfos message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IC_GetNewestMapInfos, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a C_GetNewestMapInfos message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns C_GetNewestMapInfos
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): C_GetNewestMapInfos;

            /**
             * Decodes a C_GetNewestMapInfos message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns C_GetNewestMapInfos
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): C_GetNewestMapInfos;

            /**
             * Verifies a C_GetNewestMapInfos message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a C_GetNewestMapInfos message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns C_GetNewestMapInfos
             */
            public static fromObject(object: { [k: string]: any }): C_GetNewestMapInfos;

            /**
             * Creates a plain object from a C_GetNewestMapInfos message. Also converts values to other types if specified.
             * @param message C_GetNewestMapInfos
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: C_GetNewestMapInfos, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this C_GetNewestMapInfos to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a S_GetNewestMapInfos. */
        export declare interface IS_GetNewestMapInfos {

            /** S_GetNewestMapInfos actionCode */
            actionCode?: (number | null);

            /** S_GetNewestMapInfos errorCode */
            errorCode?: (number | null);

            /** S_GetNewestMapInfos mapInfos */
            mapInfos?: (IMapInfo[] | null);
        }

        /** Represents a S_GetNewestMapInfos. */
        export declare class S_GetNewestMapInfos implements IS_GetNewestMapInfos {

            /**
             * Constructs a new S_GetNewestMapInfos.
             * @param [properties] Properties to set
             */
            constructor(properties?: IS_GetNewestMapInfos);

            /** S_GetNewestMapInfos actionCode. */
            public actionCode: number;

            /** S_GetNewestMapInfos errorCode. */
            public errorCode: number;

            /** S_GetNewestMapInfos mapInfos. */
            public mapInfos: IMapInfo[];

            /**
             * Creates a new S_GetNewestMapInfos instance using the specified properties.
             * @param [properties] Properties to set
             * @returns S_GetNewestMapInfos instance
             */
            public static create(properties?: IS_GetNewestMapInfos): S_GetNewestMapInfos;

            /**
             * Encodes the specified S_GetNewestMapInfos message. Does not implicitly {@link S_GetNewestMapInfos.verify|verify} messages.
             * @param message S_GetNewestMapInfos message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IS_GetNewestMapInfos, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified S_GetNewestMapInfos message, length delimited. Does not implicitly {@link S_GetNewestMapInfos.verify|verify} messages.
             * @param message S_GetNewestMapInfos message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IS_GetNewestMapInfos, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a S_GetNewestMapInfos message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns S_GetNewestMapInfos
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): S_GetNewestMapInfos;

            /**
             * Decodes a S_GetNewestMapInfos message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns S_GetNewestMapInfos
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): S_GetNewestMapInfos;

            /**
             * Verifies a S_GetNewestMapInfos message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a S_GetNewestMapInfos message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns S_GetNewestMapInfos
             */
            public static fromObject(object: { [k: string]: any }): S_GetNewestMapInfos;

            /**
             * Creates a plain object from a S_GetNewestMapInfos message. Also converts values to other types if specified.
             * @param message S_GetNewestMapInfos
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: S_GetNewestMapInfos, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this S_GetNewestMapInfos to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a C_CreateMultiCustomWar. */
        export declare interface IC_CreateMultiCustomWar {

            /** C_CreateMultiCustomWar actionCode */
            actionCode?: (number | null);

            /** C_CreateMultiCustomWar mapName */
            mapName?: (string | null);

            /** C_CreateMultiCustomWar mapDesigner */
            mapDesigner?: (string | null);

            /** C_CreateMultiCustomWar mapVersion */
            mapVersion?: (number | null);

            /** C_CreateMultiCustomWar warName */
            warName?: (string | null);

            /** C_CreateMultiCustomWar warPassword */
            warPassword?: (string | null);

            /** C_CreateMultiCustomWar warComment */
            warComment?: (string | null);

            /** C_CreateMultiCustomWar configVersion */
            configVersion?: (number | null);

            /** C_CreateMultiCustomWar playerIndex */
            playerIndex?: (number | null);

            /** C_CreateMultiCustomWar teamIndex */
            teamIndex?: (number | null);

            /** C_CreateMultiCustomWar hasFog */
            hasFog?: (number | null);

            /** C_CreateMultiCustomWar timeLimit */
            timeLimit?: (number | null);

            /** C_CreateMultiCustomWar initialFund */
            initialFund?: (number | null);

            /** C_CreateMultiCustomWar incomeModifier */
            incomeModifier?: (number | null);

            /** C_CreateMultiCustomWar initialEnergy */
            initialEnergy?: (number | null);

            /** C_CreateMultiCustomWar energyGrowthModifier */
            energyGrowthModifier?: (number | null);

            /** C_CreateMultiCustomWar moveRangeModifier */
            moveRangeModifier?: (number | null);

            /** C_CreateMultiCustomWar attackPowerModifier */
            attackPowerModifier?: (number | null);

            /** C_CreateMultiCustomWar visionRangeModifier */
            visionRangeModifier?: (number | null);
        }

        /** Represents a C_CreateMultiCustomWar. */
        export declare class C_CreateMultiCustomWar implements IC_CreateMultiCustomWar {

            /**
             * Constructs a new C_CreateMultiCustomWar.
             * @param [properties] Properties to set
             */
            constructor(properties?: IC_CreateMultiCustomWar);

            /** C_CreateMultiCustomWar actionCode. */
            public actionCode: number;

            /** C_CreateMultiCustomWar mapName. */
            public mapName: string;

            /** C_CreateMultiCustomWar mapDesigner. */
            public mapDesigner: string;

            /** C_CreateMultiCustomWar mapVersion. */
            public mapVersion: number;

            /** C_CreateMultiCustomWar warName. */
            public warName: string;

            /** C_CreateMultiCustomWar warPassword. */
            public warPassword: string;

            /** C_CreateMultiCustomWar warComment. */
            public warComment: string;

            /** C_CreateMultiCustomWar configVersion. */
            public configVersion: number;

            /** C_CreateMultiCustomWar playerIndex. */
            public playerIndex: number;

            /** C_CreateMultiCustomWar teamIndex. */
            public teamIndex: number;

            /** C_CreateMultiCustomWar hasFog. */
            public hasFog: number;

            /** C_CreateMultiCustomWar timeLimit. */
            public timeLimit: number;

            /** C_CreateMultiCustomWar initialFund. */
            public initialFund: number;

            /** C_CreateMultiCustomWar incomeModifier. */
            public incomeModifier: number;

            /** C_CreateMultiCustomWar initialEnergy. */
            public initialEnergy: number;

            /** C_CreateMultiCustomWar energyGrowthModifier. */
            public energyGrowthModifier: number;

            /** C_CreateMultiCustomWar moveRangeModifier. */
            public moveRangeModifier: number;

            /** C_CreateMultiCustomWar attackPowerModifier. */
            public attackPowerModifier: number;

            /** C_CreateMultiCustomWar visionRangeModifier. */
            public visionRangeModifier: number;

            /**
             * Creates a new C_CreateMultiCustomWar instance using the specified properties.
             * @param [properties] Properties to set
             * @returns C_CreateMultiCustomWar instance
             */
            public static create(properties?: IC_CreateMultiCustomWar): C_CreateMultiCustomWar;

            /**
             * Encodes the specified C_CreateMultiCustomWar message. Does not implicitly {@link C_CreateMultiCustomWar.verify|verify} messages.
             * @param message C_CreateMultiCustomWar message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IC_CreateMultiCustomWar, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified C_CreateMultiCustomWar message, length delimited. Does not implicitly {@link C_CreateMultiCustomWar.verify|verify} messages.
             * @param message C_CreateMultiCustomWar message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IC_CreateMultiCustomWar, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a C_CreateMultiCustomWar message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns C_CreateMultiCustomWar
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): C_CreateMultiCustomWar;

            /**
             * Decodes a C_CreateMultiCustomWar message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns C_CreateMultiCustomWar
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): C_CreateMultiCustomWar;

            /**
             * Verifies a C_CreateMultiCustomWar message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a C_CreateMultiCustomWar message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns C_CreateMultiCustomWar
             */
            public static fromObject(object: { [k: string]: any }): C_CreateMultiCustomWar;

            /**
             * Creates a plain object from a C_CreateMultiCustomWar message. Also converts values to other types if specified.
             * @param message C_CreateMultiCustomWar
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: C_CreateMultiCustomWar, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this C_CreateMultiCustomWar to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a S_CreateMultiCustomWar. */
        export declare interface IS_CreateMultiCustomWar {

            /** S_CreateMultiCustomWar actionCode */
            actionCode?: (number | null);

            /** S_CreateMultiCustomWar errorCode */
            errorCode?: (number | null);
        }

        /** Represents a S_CreateMultiCustomWar. */
        export declare class S_CreateMultiCustomWar implements IS_CreateMultiCustomWar {

            /**
             * Constructs a new S_CreateMultiCustomWar.
             * @param [properties] Properties to set
             */
            constructor(properties?: IS_CreateMultiCustomWar);

            /** S_CreateMultiCustomWar actionCode. */
            public actionCode: number;

            /** S_CreateMultiCustomWar errorCode. */
            public errorCode: number;

            /**
             * Creates a new S_CreateMultiCustomWar instance using the specified properties.
             * @param [properties] Properties to set
             * @returns S_CreateMultiCustomWar instance
             */
            public static create(properties?: IS_CreateMultiCustomWar): S_CreateMultiCustomWar;

            /**
             * Encodes the specified S_CreateMultiCustomWar message. Does not implicitly {@link S_CreateMultiCustomWar.verify|verify} messages.
             * @param message S_CreateMultiCustomWar message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IS_CreateMultiCustomWar, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified S_CreateMultiCustomWar message, length delimited. Does not implicitly {@link S_CreateMultiCustomWar.verify|verify} messages.
             * @param message S_CreateMultiCustomWar message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IS_CreateMultiCustomWar, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a S_CreateMultiCustomWar message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns S_CreateMultiCustomWar
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): S_CreateMultiCustomWar;

            /**
             * Decodes a S_CreateMultiCustomWar message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns S_CreateMultiCustomWar
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): S_CreateMultiCustomWar;

            /**
             * Verifies a S_CreateMultiCustomWar message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a S_CreateMultiCustomWar message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns S_CreateMultiCustomWar
             */
            public static fromObject(object: { [k: string]: any }): S_CreateMultiCustomWar;

            /**
             * Creates a plain object from a S_CreateMultiCustomWar message. Also converts values to other types if specified.
             * @param message S_CreateMultiCustomWar
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: S_CreateMultiCustomWar, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this S_CreateMultiCustomWar to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a C_ExitMultiCustomWar. */
        export declare interface IC_ExitMultiCustomWar {

            /** C_ExitMultiCustomWar actionCode */
            actionCode?: (number | null);

            /** C_ExitMultiCustomWar infoId */
            infoId?: (number | null);
        }

        /** Represents a C_ExitMultiCustomWar. */
        export declare class C_ExitMultiCustomWar implements IC_ExitMultiCustomWar {

            /**
             * Constructs a new C_ExitMultiCustomWar.
             * @param [properties] Properties to set
             */
            constructor(properties?: IC_ExitMultiCustomWar);

            /** C_ExitMultiCustomWar actionCode. */
            public actionCode: number;

            /** C_ExitMultiCustomWar infoId. */
            public infoId: number;

            /**
             * Creates a new C_ExitMultiCustomWar instance using the specified properties.
             * @param [properties] Properties to set
             * @returns C_ExitMultiCustomWar instance
             */
            public static create(properties?: IC_ExitMultiCustomWar): C_ExitMultiCustomWar;

            /**
             * Encodes the specified C_ExitMultiCustomWar message. Does not implicitly {@link C_ExitMultiCustomWar.verify|verify} messages.
             * @param message C_ExitMultiCustomWar message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IC_ExitMultiCustomWar, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified C_ExitMultiCustomWar message, length delimited. Does not implicitly {@link C_ExitMultiCustomWar.verify|verify} messages.
             * @param message C_ExitMultiCustomWar message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IC_ExitMultiCustomWar, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a C_ExitMultiCustomWar message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns C_ExitMultiCustomWar
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): C_ExitMultiCustomWar;

            /**
             * Decodes a C_ExitMultiCustomWar message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns C_ExitMultiCustomWar
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): C_ExitMultiCustomWar;

            /**
             * Verifies a C_ExitMultiCustomWar message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a C_ExitMultiCustomWar message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns C_ExitMultiCustomWar
             */
            public static fromObject(object: { [k: string]: any }): C_ExitMultiCustomWar;

            /**
             * Creates a plain object from a C_ExitMultiCustomWar message. Also converts values to other types if specified.
             * @param message C_ExitMultiCustomWar
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: C_ExitMultiCustomWar, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this C_ExitMultiCustomWar to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a S_ExitMultiCustomWar. */
        export declare interface IS_ExitMultiCustomWar {

            /** S_ExitMultiCustomWar actionCode */
            actionCode?: (number | null);

            /** S_ExitMultiCustomWar errorCode */
            errorCode?: (number | null);
        }

        /** Represents a S_ExitMultiCustomWar. */
        export declare class S_ExitMultiCustomWar implements IS_ExitMultiCustomWar {

            /**
             * Constructs a new S_ExitMultiCustomWar.
             * @param [properties] Properties to set
             */
            constructor(properties?: IS_ExitMultiCustomWar);

            /** S_ExitMultiCustomWar actionCode. */
            public actionCode: number;

            /** S_ExitMultiCustomWar errorCode. */
            public errorCode: number;

            /**
             * Creates a new S_ExitMultiCustomWar instance using the specified properties.
             * @param [properties] Properties to set
             * @returns S_ExitMultiCustomWar instance
             */
            public static create(properties?: IS_ExitMultiCustomWar): S_ExitMultiCustomWar;

            /**
             * Encodes the specified S_ExitMultiCustomWar message. Does not implicitly {@link S_ExitMultiCustomWar.verify|verify} messages.
             * @param message S_ExitMultiCustomWar message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IS_ExitMultiCustomWar, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified S_ExitMultiCustomWar message, length delimited. Does not implicitly {@link S_ExitMultiCustomWar.verify|verify} messages.
             * @param message S_ExitMultiCustomWar message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IS_ExitMultiCustomWar, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a S_ExitMultiCustomWar message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns S_ExitMultiCustomWar
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): S_ExitMultiCustomWar;

            /**
             * Decodes a S_ExitMultiCustomWar message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns S_ExitMultiCustomWar
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): S_ExitMultiCustomWar;

            /**
             * Verifies a S_ExitMultiCustomWar message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a S_ExitMultiCustomWar message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns S_ExitMultiCustomWar
             */
            public static fromObject(object: { [k: string]: any }): S_ExitMultiCustomWar;

            /**
             * Creates a plain object from a S_ExitMultiCustomWar message. Also converts values to other types if specified.
             * @param message S_ExitMultiCustomWar
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: S_ExitMultiCustomWar, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this S_ExitMultiCustomWar to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a C_GetJoinedWaitingMultiCustomWarInfos. */
        export declare interface IC_GetJoinedWaitingMultiCustomWarInfos {

            /** C_GetJoinedWaitingMultiCustomWarInfos actionCode */
            actionCode?: (number | null);
        }

        /** Represents a C_GetJoinedWaitingMultiCustomWarInfos. */
        export declare class C_GetJoinedWaitingMultiCustomWarInfos implements IC_GetJoinedWaitingMultiCustomWarInfos {

            /**
             * Constructs a new C_GetJoinedWaitingMultiCustomWarInfos.
             * @param [properties] Properties to set
             */
            constructor(properties?: IC_GetJoinedWaitingMultiCustomWarInfos);

            /** C_GetJoinedWaitingMultiCustomWarInfos actionCode. */
            public actionCode: number;

            /**
             * Creates a new C_GetJoinedWaitingMultiCustomWarInfos instance using the specified properties.
             * @param [properties] Properties to set
             * @returns C_GetJoinedWaitingMultiCustomWarInfos instance
             */
            public static create(properties?: IC_GetJoinedWaitingMultiCustomWarInfos): C_GetJoinedWaitingMultiCustomWarInfos;

            /**
             * Encodes the specified C_GetJoinedWaitingMultiCustomWarInfos message. Does not implicitly {@link C_GetJoinedWaitingMultiCustomWarInfos.verify|verify} messages.
             * @param message C_GetJoinedWaitingMultiCustomWarInfos message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IC_GetJoinedWaitingMultiCustomWarInfos, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified C_GetJoinedWaitingMultiCustomWarInfos message, length delimited. Does not implicitly {@link C_GetJoinedWaitingMultiCustomWarInfos.verify|verify} messages.
             * @param message C_GetJoinedWaitingMultiCustomWarInfos message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IC_GetJoinedWaitingMultiCustomWarInfos, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a C_GetJoinedWaitingMultiCustomWarInfos message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns C_GetJoinedWaitingMultiCustomWarInfos
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): C_GetJoinedWaitingMultiCustomWarInfos;

            /**
             * Decodes a C_GetJoinedWaitingMultiCustomWarInfos message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns C_GetJoinedWaitingMultiCustomWarInfos
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): C_GetJoinedWaitingMultiCustomWarInfos;

            /**
             * Verifies a C_GetJoinedWaitingMultiCustomWarInfos message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a C_GetJoinedWaitingMultiCustomWarInfos message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns C_GetJoinedWaitingMultiCustomWarInfos
             */
            public static fromObject(object: { [k: string]: any }): C_GetJoinedWaitingMultiCustomWarInfos;

            /**
             * Creates a plain object from a C_GetJoinedWaitingMultiCustomWarInfos message. Also converts values to other types if specified.
             * @param message C_GetJoinedWaitingMultiCustomWarInfos
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: C_GetJoinedWaitingMultiCustomWarInfos, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this C_GetJoinedWaitingMultiCustomWarInfos to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a S_GetJoinedWaitingMultiCustomWarInfos. */
        export declare interface IS_GetJoinedWaitingMultiCustomWarInfos {

            /** S_GetJoinedWaitingMultiCustomWarInfos actionCode */
            actionCode?: (number | null);

            /** S_GetJoinedWaitingMultiCustomWarInfos errorCode */
            errorCode?: (number | null);

            /** S_GetJoinedWaitingMultiCustomWarInfos warInfos */
            warInfos?: (IWaitingMultiCustomWarInfo[] | null);

            /** S_GetJoinedWaitingMultiCustomWarInfos mapInfos */
            mapInfos?: (IMapInfo[] | null);
        }

        /** Represents a S_GetJoinedWaitingMultiCustomWarInfos. */
        export declare class S_GetJoinedWaitingMultiCustomWarInfos implements IS_GetJoinedWaitingMultiCustomWarInfos {

            /**
             * Constructs a new S_GetJoinedWaitingMultiCustomWarInfos.
             * @param [properties] Properties to set
             */
            constructor(properties?: IS_GetJoinedWaitingMultiCustomWarInfos);

            /** S_GetJoinedWaitingMultiCustomWarInfos actionCode. */
            public actionCode: number;

            /** S_GetJoinedWaitingMultiCustomWarInfos errorCode. */
            public errorCode: number;

            /** S_GetJoinedWaitingMultiCustomWarInfos warInfos. */
            public warInfos: IWaitingMultiCustomWarInfo[];

            /** S_GetJoinedWaitingMultiCustomWarInfos mapInfos. */
            public mapInfos: IMapInfo[];

            /**
             * Creates a new S_GetJoinedWaitingMultiCustomWarInfos instance using the specified properties.
             * @param [properties] Properties to set
             * @returns S_GetJoinedWaitingMultiCustomWarInfos instance
             */
            public static create(properties?: IS_GetJoinedWaitingMultiCustomWarInfos): S_GetJoinedWaitingMultiCustomWarInfos;

            /**
             * Encodes the specified S_GetJoinedWaitingMultiCustomWarInfos message. Does not implicitly {@link S_GetJoinedWaitingMultiCustomWarInfos.verify|verify} messages.
             * @param message S_GetJoinedWaitingMultiCustomWarInfos message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IS_GetJoinedWaitingMultiCustomWarInfos, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified S_GetJoinedWaitingMultiCustomWarInfos message, length delimited. Does not implicitly {@link S_GetJoinedWaitingMultiCustomWarInfos.verify|verify} messages.
             * @param message S_GetJoinedWaitingMultiCustomWarInfos message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IS_GetJoinedWaitingMultiCustomWarInfos, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a S_GetJoinedWaitingMultiCustomWarInfos message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns S_GetJoinedWaitingMultiCustomWarInfos
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): S_GetJoinedWaitingMultiCustomWarInfos;

            /**
             * Decodes a S_GetJoinedWaitingMultiCustomWarInfos message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns S_GetJoinedWaitingMultiCustomWarInfos
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): S_GetJoinedWaitingMultiCustomWarInfos;

            /**
             * Verifies a S_GetJoinedWaitingMultiCustomWarInfos message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a S_GetJoinedWaitingMultiCustomWarInfos message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns S_GetJoinedWaitingMultiCustomWarInfos
             */
            public static fromObject(object: { [k: string]: any }): S_GetJoinedWaitingMultiCustomWarInfos;

            /**
             * Creates a plain object from a S_GetJoinedWaitingMultiCustomWarInfos message. Also converts values to other types if specified.
             * @param message S_GetJoinedWaitingMultiCustomWarInfos
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: S_GetJoinedWaitingMultiCustomWarInfos, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this S_GetJoinedWaitingMultiCustomWarInfos to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a C_GetUnjoinedWaitingMultiCustomWarInfos. */
        export declare interface IC_GetUnjoinedWaitingMultiCustomWarInfos {

            /** C_GetUnjoinedWaitingMultiCustomWarInfos account */
            account?: (number | null);
        }

        /** Represents a C_GetUnjoinedWaitingMultiCustomWarInfos. */
        export declare class C_GetUnjoinedWaitingMultiCustomWarInfos implements IC_GetUnjoinedWaitingMultiCustomWarInfos {

            /**
             * Constructs a new C_GetUnjoinedWaitingMultiCustomWarInfos.
             * @param [properties] Properties to set
             */
            constructor(properties?: IC_GetUnjoinedWaitingMultiCustomWarInfos);

            /** C_GetUnjoinedWaitingMultiCustomWarInfos account. */
            public account: number;

            /**
             * Creates a new C_GetUnjoinedWaitingMultiCustomWarInfos instance using the specified properties.
             * @param [properties] Properties to set
             * @returns C_GetUnjoinedWaitingMultiCustomWarInfos instance
             */
            public static create(properties?: IC_GetUnjoinedWaitingMultiCustomWarInfos): C_GetUnjoinedWaitingMultiCustomWarInfos;

            /**
             * Encodes the specified C_GetUnjoinedWaitingMultiCustomWarInfos message. Does not implicitly {@link C_GetUnjoinedWaitingMultiCustomWarInfos.verify|verify} messages.
             * @param message C_GetUnjoinedWaitingMultiCustomWarInfos message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IC_GetUnjoinedWaitingMultiCustomWarInfos, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified C_GetUnjoinedWaitingMultiCustomWarInfos message, length delimited. Does not implicitly {@link C_GetUnjoinedWaitingMultiCustomWarInfos.verify|verify} messages.
             * @param message C_GetUnjoinedWaitingMultiCustomWarInfos message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IC_GetUnjoinedWaitingMultiCustomWarInfos, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a C_GetUnjoinedWaitingMultiCustomWarInfos message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns C_GetUnjoinedWaitingMultiCustomWarInfos
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): C_GetUnjoinedWaitingMultiCustomWarInfos;

            /**
             * Decodes a C_GetUnjoinedWaitingMultiCustomWarInfos message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns C_GetUnjoinedWaitingMultiCustomWarInfos
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): C_GetUnjoinedWaitingMultiCustomWarInfos;

            /**
             * Verifies a C_GetUnjoinedWaitingMultiCustomWarInfos message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a C_GetUnjoinedWaitingMultiCustomWarInfos message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns C_GetUnjoinedWaitingMultiCustomWarInfos
             */
            public static fromObject(object: { [k: string]: any }): C_GetUnjoinedWaitingMultiCustomWarInfos;

            /**
             * Creates a plain object from a C_GetUnjoinedWaitingMultiCustomWarInfos message. Also converts values to other types if specified.
             * @param message C_GetUnjoinedWaitingMultiCustomWarInfos
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: C_GetUnjoinedWaitingMultiCustomWarInfos, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this C_GetUnjoinedWaitingMultiCustomWarInfos to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a S_GetUnjoinedWaitingMultiCustomWarInfos. */
        export declare interface IS_GetUnjoinedWaitingMultiCustomWarInfos {

            /** S_GetUnjoinedWaitingMultiCustomWarInfos actionCode */
            actionCode?: (number | null);

            /** S_GetUnjoinedWaitingMultiCustomWarInfos errorCode */
            errorCode?: (number | null);

            /** S_GetUnjoinedWaitingMultiCustomWarInfos warInfos */
            warInfos?: (IWaitingMultiCustomWarInfo[] | null);

            /** S_GetUnjoinedWaitingMultiCustomWarInfos mapInfos */
            mapInfos?: (IMapInfo[] | null);
        }

        /** Represents a S_GetUnjoinedWaitingMultiCustomWarInfos. */
        export declare class S_GetUnjoinedWaitingMultiCustomWarInfos implements IS_GetUnjoinedWaitingMultiCustomWarInfos {

            /**
             * Constructs a new S_GetUnjoinedWaitingMultiCustomWarInfos.
             * @param [properties] Properties to set
             */
            constructor(properties?: IS_GetUnjoinedWaitingMultiCustomWarInfos);

            /** S_GetUnjoinedWaitingMultiCustomWarInfos actionCode. */
            public actionCode: number;

            /** S_GetUnjoinedWaitingMultiCustomWarInfos errorCode. */
            public errorCode: number;

            /** S_GetUnjoinedWaitingMultiCustomWarInfos warInfos. */
            public warInfos: IWaitingMultiCustomWarInfo[];

            /** S_GetUnjoinedWaitingMultiCustomWarInfos mapInfos. */
            public mapInfos: IMapInfo[];

            /**
             * Creates a new S_GetUnjoinedWaitingMultiCustomWarInfos instance using the specified properties.
             * @param [properties] Properties to set
             * @returns S_GetUnjoinedWaitingMultiCustomWarInfos instance
             */
            public static create(properties?: IS_GetUnjoinedWaitingMultiCustomWarInfos): S_GetUnjoinedWaitingMultiCustomWarInfos;

            /**
             * Encodes the specified S_GetUnjoinedWaitingMultiCustomWarInfos message. Does not implicitly {@link S_GetUnjoinedWaitingMultiCustomWarInfos.verify|verify} messages.
             * @param message S_GetUnjoinedWaitingMultiCustomWarInfos message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IS_GetUnjoinedWaitingMultiCustomWarInfos, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified S_GetUnjoinedWaitingMultiCustomWarInfos message, length delimited. Does not implicitly {@link S_GetUnjoinedWaitingMultiCustomWarInfos.verify|verify} messages.
             * @param message S_GetUnjoinedWaitingMultiCustomWarInfos message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IS_GetUnjoinedWaitingMultiCustomWarInfos, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a S_GetUnjoinedWaitingMultiCustomWarInfos message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns S_GetUnjoinedWaitingMultiCustomWarInfos
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): S_GetUnjoinedWaitingMultiCustomWarInfos;

            /**
             * Decodes a S_GetUnjoinedWaitingMultiCustomWarInfos message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns S_GetUnjoinedWaitingMultiCustomWarInfos
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): S_GetUnjoinedWaitingMultiCustomWarInfos;

            /**
             * Verifies a S_GetUnjoinedWaitingMultiCustomWarInfos message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a S_GetUnjoinedWaitingMultiCustomWarInfos message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns S_GetUnjoinedWaitingMultiCustomWarInfos
             */
            public static fromObject(object: { [k: string]: any }): S_GetUnjoinedWaitingMultiCustomWarInfos;

            /**
             * Creates a plain object from a S_GetUnjoinedWaitingMultiCustomWarInfos message. Also converts values to other types if specified.
             * @param message S_GetUnjoinedWaitingMultiCustomWarInfos
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: S_GetUnjoinedWaitingMultiCustomWarInfos, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this S_GetUnjoinedWaitingMultiCustomWarInfos to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a C_JoinMultiCustomWar. */
        export declare interface IC_JoinMultiCustomWar {

            /** C_JoinMultiCustomWar actionCode */
            actionCode?: (number | null);

            /** C_JoinMultiCustomWar infoId */
            infoId?: (number | null);

            /** C_JoinMultiCustomWar playerIndex */
            playerIndex?: (number | null);

            /** C_JoinMultiCustomWar teamIndex */
            teamIndex?: (number | null);
        }

        /** Represents a C_JoinMultiCustomWar. */
        export declare class C_JoinMultiCustomWar implements IC_JoinMultiCustomWar {

            /**
             * Constructs a new C_JoinMultiCustomWar.
             * @param [properties] Properties to set
             */
            constructor(properties?: IC_JoinMultiCustomWar);

            /** C_JoinMultiCustomWar actionCode. */
            public actionCode: number;

            /** C_JoinMultiCustomWar infoId. */
            public infoId: number;

            /** C_JoinMultiCustomWar playerIndex. */
            public playerIndex: number;

            /** C_JoinMultiCustomWar teamIndex. */
            public teamIndex: number;

            /**
             * Creates a new C_JoinMultiCustomWar instance using the specified properties.
             * @param [properties] Properties to set
             * @returns C_JoinMultiCustomWar instance
             */
            public static create(properties?: IC_JoinMultiCustomWar): C_JoinMultiCustomWar;

            /**
             * Encodes the specified C_JoinMultiCustomWar message. Does not implicitly {@link C_JoinMultiCustomWar.verify|verify} messages.
             * @param message C_JoinMultiCustomWar message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IC_JoinMultiCustomWar, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified C_JoinMultiCustomWar message, length delimited. Does not implicitly {@link C_JoinMultiCustomWar.verify|verify} messages.
             * @param message C_JoinMultiCustomWar message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IC_JoinMultiCustomWar, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a C_JoinMultiCustomWar message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns C_JoinMultiCustomWar
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): C_JoinMultiCustomWar;

            /**
             * Decodes a C_JoinMultiCustomWar message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns C_JoinMultiCustomWar
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): C_JoinMultiCustomWar;

            /**
             * Verifies a C_JoinMultiCustomWar message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a C_JoinMultiCustomWar message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns C_JoinMultiCustomWar
             */
            public static fromObject(object: { [k: string]: any }): C_JoinMultiCustomWar;

            /**
             * Creates a plain object from a C_JoinMultiCustomWar message. Also converts values to other types if specified.
             * @param message C_JoinMultiCustomWar
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: C_JoinMultiCustomWar, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this C_JoinMultiCustomWar to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a S_JoinMultiCustomWar. */
        export declare interface IS_JoinMultiCustomWar {

            /** S_JoinMultiCustomWar actionCode */
            actionCode?: (number | null);

            /** S_JoinMultiCustomWar errorCode */
            errorCode?: (number | null);

            /** S_JoinMultiCustomWar isStarted */
            isStarted?: (boolean | null);
        }

        /** Represents a S_JoinMultiCustomWar. */
        export declare class S_JoinMultiCustomWar implements IS_JoinMultiCustomWar {

            /**
             * Constructs a new S_JoinMultiCustomWar.
             * @param [properties] Properties to set
             */
            constructor(properties?: IS_JoinMultiCustomWar);

            /** S_JoinMultiCustomWar actionCode. */
            public actionCode: number;

            /** S_JoinMultiCustomWar errorCode. */
            public errorCode: number;

            /** S_JoinMultiCustomWar isStarted. */
            public isStarted: boolean;

            /**
             * Creates a new S_JoinMultiCustomWar instance using the specified properties.
             * @param [properties] Properties to set
             * @returns S_JoinMultiCustomWar instance
             */
            public static create(properties?: IS_JoinMultiCustomWar): S_JoinMultiCustomWar;

            /**
             * Encodes the specified S_JoinMultiCustomWar message. Does not implicitly {@link S_JoinMultiCustomWar.verify|verify} messages.
             * @param message S_JoinMultiCustomWar message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IS_JoinMultiCustomWar, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified S_JoinMultiCustomWar message, length delimited. Does not implicitly {@link S_JoinMultiCustomWar.verify|verify} messages.
             * @param message S_JoinMultiCustomWar message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IS_JoinMultiCustomWar, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a S_JoinMultiCustomWar message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns S_JoinMultiCustomWar
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): S_JoinMultiCustomWar;

            /**
             * Decodes a S_JoinMultiCustomWar message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns S_JoinMultiCustomWar
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): S_JoinMultiCustomWar;

            /**
             * Verifies a S_JoinMultiCustomWar message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a S_JoinMultiCustomWar message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns S_JoinMultiCustomWar
             */
            public static fromObject(object: { [k: string]: any }): S_JoinMultiCustomWar;

            /**
             * Creates a plain object from a S_JoinMultiCustomWar message. Also converts values to other types if specified.
             * @param message S_JoinMultiCustomWar
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: S_JoinMultiCustomWar, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this S_JoinMultiCustomWar to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a S_NewestConfigVersion. */
        export declare interface IS_NewestConfigVersion {

            /** S_NewestConfigVersion actionCode */
            actionCode?: (number | null);

            /** S_NewestConfigVersion version */
            version?: (number | null);
        }

        /** Represents a S_NewestConfigVersion. */
        export declare class S_NewestConfigVersion implements IS_NewestConfigVersion {

            /**
             * Constructs a new S_NewestConfigVersion.
             * @param [properties] Properties to set
             */
            constructor(properties?: IS_NewestConfigVersion);

            /** S_NewestConfigVersion actionCode. */
            public actionCode: number;

            /** S_NewestConfigVersion version. */
            public version: number;

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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): S_NewestConfigVersion;

            /**
             * Decodes a S_NewestConfigVersion message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns S_NewestConfigVersion
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): S_NewestConfigVersion;

            /**
             * Verifies a S_NewestConfigVersion message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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
    }
}
