
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

        /** Properties of a SerializedMcwTile. */
        export declare interface ISerializedMcwTile {

            /** SerializedMcwTile gridX */
            gridX?: (number | null);

            /** SerializedMcwTile gridY */
            gridY?: (number | null);

            /** SerializedMcwTile baseViewId */
            baseViewId?: (number | null);

            /** SerializedMcwTile objectViewId */
            objectViewId?: (number | null);

            /** SerializedMcwTile currentHp */
            currentHp?: (number | null);

            /** SerializedMcwTile currentBuildPoint */
            currentBuildPoint?: (number | null);

            /** SerializedMcwTile currentCapturePoint */
            currentCapturePoint?: (number | null);
        }

        /** Represents a SerializedMcwTile. */
        export declare class SerializedMcwTile implements ISerializedMcwTile {

            /**
             * Constructs a new SerializedMcwTile.
             * @param [properties] Properties to set
             */
            constructor(properties?: ISerializedMcwTile);

            /** SerializedMcwTile gridX. */
            public gridX: number;

            /** SerializedMcwTile gridY. */
            public gridY: number;

            /** SerializedMcwTile baseViewId. */
            public baseViewId: number;

            /** SerializedMcwTile objectViewId. */
            public objectViewId: number;

            /** SerializedMcwTile currentHp. */
            public currentHp: number;

            /** SerializedMcwTile currentBuildPoint. */
            public currentBuildPoint: number;

            /** SerializedMcwTile currentCapturePoint. */
            public currentCapturePoint: number;

            /**
             * Creates a new SerializedMcwTile instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SerializedMcwTile instance
             */
            public static create(properties?: ISerializedMcwTile): SerializedMcwTile;

            /**
             * Encodes the specified SerializedMcwTile message. Does not implicitly {@link SerializedMcwTile.verify|verify} messages.
             * @param message SerializedMcwTile message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: ISerializedMcwTile, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified SerializedMcwTile message, length delimited. Does not implicitly {@link SerializedMcwTile.verify|verify} messages.
             * @param message SerializedMcwTile message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: ISerializedMcwTile, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a SerializedMcwTile message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SerializedMcwTile
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): SerializedMcwTile;

            /**
             * Decodes a SerializedMcwTile message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SerializedMcwTile
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): SerializedMcwTile;

            /**
             * Verifies a SerializedMcwTile message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a SerializedMcwTile message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SerializedMcwTile
             */
            public static fromObject(object: { [k: string]: any }): SerializedMcwTile;

            /**
             * Creates a plain object from a SerializedMcwTile message. Also converts values to other types if specified.
             * @param message SerializedMcwTile
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: SerializedMcwTile, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SerializedMcwTile to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a SerializedMcwUnit. */
        export declare interface ISerializedMcwUnit {

            /** SerializedMcwUnit gridX */
            gridX?: (number | null);

            /** SerializedMcwUnit gridY */
            gridY?: (number | null);

            /** SerializedMcwUnit viewId */
            viewId?: (number | null);

            /** SerializedMcwUnit unitId */
            unitId?: (number | null);

            /** SerializedMcwUnit state */
            state?: (number | null);

            /** SerializedMcwUnit primaryWeaponCurrentAmmo */
            primaryWeaponCurrentAmmo?: (number | null);

            /** SerializedMcwUnit currentHp */
            currentHp?: (number | null);

            /** SerializedMcwUnit isCapturingTile */
            isCapturingTile?: (boolean | null);

            /** SerializedMcwUnit isDiving */
            isDiving?: (boolean | null);

            /** SerializedMcwUnit flareCurrentAmmo */
            flareCurrentAmmo?: (number | null);

            /** SerializedMcwUnit currentFuel */
            currentFuel?: (number | null);

            /** SerializedMcwUnit currentBuildMaterial */
            currentBuildMaterial?: (number | null);

            /** SerializedMcwUnit currentProduceMaterial */
            currentProduceMaterial?: (number | null);

            /** SerializedMcwUnit currentPromotion */
            currentPromotion?: (number | null);

            /** SerializedMcwUnit isBuildingTile */
            isBuildingTile?: (boolean | null);

            /** SerializedMcwUnit loaderUnitId */
            loaderUnitId?: (number | null);
        }

        /** Represents a SerializedMcwUnit. */
        export declare class SerializedMcwUnit implements ISerializedMcwUnit {

            /**
             * Constructs a new SerializedMcwUnit.
             * @param [properties] Properties to set
             */
            constructor(properties?: ISerializedMcwUnit);

            /** SerializedMcwUnit gridX. */
            public gridX: number;

            /** SerializedMcwUnit gridY. */
            public gridY: number;

            /** SerializedMcwUnit viewId. */
            public viewId: number;

            /** SerializedMcwUnit unitId. */
            public unitId: number;

            /** SerializedMcwUnit state. */
            public state: number;

            /** SerializedMcwUnit primaryWeaponCurrentAmmo. */
            public primaryWeaponCurrentAmmo: number;

            /** SerializedMcwUnit currentHp. */
            public currentHp: number;

            /** SerializedMcwUnit isCapturingTile. */
            public isCapturingTile: boolean;

            /** SerializedMcwUnit isDiving. */
            public isDiving: boolean;

            /** SerializedMcwUnit flareCurrentAmmo. */
            public flareCurrentAmmo: number;

            /** SerializedMcwUnit currentFuel. */
            public currentFuel: number;

            /** SerializedMcwUnit currentBuildMaterial. */
            public currentBuildMaterial: number;

            /** SerializedMcwUnit currentProduceMaterial. */
            public currentProduceMaterial: number;

            /** SerializedMcwUnit currentPromotion. */
            public currentPromotion: number;

            /** SerializedMcwUnit isBuildingTile. */
            public isBuildingTile: boolean;

            /** SerializedMcwUnit loaderUnitId. */
            public loaderUnitId: number;

            /**
             * Creates a new SerializedMcwUnit instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SerializedMcwUnit instance
             */
            public static create(properties?: ISerializedMcwUnit): SerializedMcwUnit;

            /**
             * Encodes the specified SerializedMcwUnit message. Does not implicitly {@link SerializedMcwUnit.verify|verify} messages.
             * @param message SerializedMcwUnit message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: ISerializedMcwUnit, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified SerializedMcwUnit message, length delimited. Does not implicitly {@link SerializedMcwUnit.verify|verify} messages.
             * @param message SerializedMcwUnit message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: ISerializedMcwUnit, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a SerializedMcwUnit message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SerializedMcwUnit
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): SerializedMcwUnit;

            /**
             * Decodes a SerializedMcwUnit message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SerializedMcwUnit
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): SerializedMcwUnit;

            /**
             * Verifies a SerializedMcwUnit message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a SerializedMcwUnit message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SerializedMcwUnit
             */
            public static fromObject(object: { [k: string]: any }): SerializedMcwUnit;

            /**
             * Creates a plain object from a SerializedMcwUnit message. Also converts values to other types if specified.
             * @param message SerializedMcwUnit
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: SerializedMcwUnit, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SerializedMcwUnit to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a SerializedMcwPlayer. */
        export declare interface ISerializedMcwPlayer {

            /** SerializedMcwPlayer fund */
            fund?: (number | null);

            /** SerializedMcwPlayer hasVotedForDraw */
            hasVotedForDraw?: (boolean | null);

            /** SerializedMcwPlayer isAlive */
            isAlive?: (boolean | null);

            /** SerializedMcwPlayer playerIndex */
            playerIndex?: (number | null);

            /** SerializedMcwPlayer teamIndex */
            teamIndex?: (number | null);

            /** SerializedMcwPlayer userId */
            userId?: (number | null);
        }

        /** Represents a SerializedMcwPlayer. */
        export declare class SerializedMcwPlayer implements ISerializedMcwPlayer {

            /**
             * Constructs a new SerializedMcwPlayer.
             * @param [properties] Properties to set
             */
            constructor(properties?: ISerializedMcwPlayer);

            /** SerializedMcwPlayer fund. */
            public fund: number;

            /** SerializedMcwPlayer hasVotedForDraw. */
            public hasVotedForDraw: boolean;

            /** SerializedMcwPlayer isAlive. */
            public isAlive: boolean;

            /** SerializedMcwPlayer playerIndex. */
            public playerIndex: number;

            /** SerializedMcwPlayer teamIndex. */
            public teamIndex: number;

            /** SerializedMcwPlayer userId. */
            public userId: number;

            /**
             * Creates a new SerializedMcwPlayer instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SerializedMcwPlayer instance
             */
            public static create(properties?: ISerializedMcwPlayer): SerializedMcwPlayer;

            /**
             * Encodes the specified SerializedMcwPlayer message. Does not implicitly {@link SerializedMcwPlayer.verify|verify} messages.
             * @param message SerializedMcwPlayer message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: ISerializedMcwPlayer, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified SerializedMcwPlayer message, length delimited. Does not implicitly {@link SerializedMcwPlayer.verify|verify} messages.
             * @param message SerializedMcwPlayer message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: ISerializedMcwPlayer, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a SerializedMcwPlayer message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SerializedMcwPlayer
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): SerializedMcwPlayer;

            /**
             * Decodes a SerializedMcwPlayer message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SerializedMcwPlayer
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): SerializedMcwPlayer;

            /**
             * Verifies a SerializedMcwPlayer message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a SerializedMcwPlayer message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SerializedMcwPlayer
             */
            public static fromObject(object: { [k: string]: any }): SerializedMcwPlayer;

            /**
             * Creates a plain object from a SerializedMcwPlayer message. Also converts values to other types if specified.
             * @param message SerializedMcwPlayer
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: SerializedMcwPlayer, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SerializedMcwPlayer to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a SerializedMcwTurn. */
        export declare interface ISerializedMcwTurn {

            /** SerializedMcwTurn turnIndex */
            turnIndex?: (number | null);

            /** SerializedMcwTurn playerIndex */
            playerIndex?: (number | null);

            /** SerializedMcwTurn turnPhaseCode */
            turnPhaseCode?: (number | null);
        }

        /** Represents a SerializedMcwTurn. */
        export declare class SerializedMcwTurn implements ISerializedMcwTurn {

            /**
             * Constructs a new SerializedMcwTurn.
             * @param [properties] Properties to set
             */
            constructor(properties?: ISerializedMcwTurn);

            /** SerializedMcwTurn turnIndex. */
            public turnIndex: number;

            /** SerializedMcwTurn playerIndex. */
            public playerIndex: number;

            /** SerializedMcwTurn turnPhaseCode. */
            public turnPhaseCode: number;

            /**
             * Creates a new SerializedMcwTurn instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SerializedMcwTurn instance
             */
            public static create(properties?: ISerializedMcwTurn): SerializedMcwTurn;

            /**
             * Encodes the specified SerializedMcwTurn message. Does not implicitly {@link SerializedMcwTurn.verify|verify} messages.
             * @param message SerializedMcwTurn message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: ISerializedMcwTurn, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified SerializedMcwTurn message, length delimited. Does not implicitly {@link SerializedMcwTurn.verify|verify} messages.
             * @param message SerializedMcwTurn message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: ISerializedMcwTurn, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a SerializedMcwTurn message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SerializedMcwTurn
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): SerializedMcwTurn;

            /**
             * Decodes a SerializedMcwTurn message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SerializedMcwTurn
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): SerializedMcwTurn;

            /**
             * Verifies a SerializedMcwTurn message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a SerializedMcwTurn message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SerializedMcwTurn
             */
            public static fromObject(object: { [k: string]: any }): SerializedMcwTurn;

            /**
             * Creates a plain object from a SerializedMcwTurn message. Also converts values to other types if specified.
             * @param message SerializedMcwTurn
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: SerializedMcwTurn, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SerializedMcwTurn to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a SerializedMcwTileMap. */
        export declare interface ISerializedMcwTileMap {

            /** SerializedMcwTileMap tiles */
            tiles?: (ISerializedMcwTile[] | null);
        }

        /** Represents a SerializedMcwTileMap. */
        export declare class SerializedMcwTileMap implements ISerializedMcwTileMap {

            /**
             * Constructs a new SerializedMcwTileMap.
             * @param [properties] Properties to set
             */
            constructor(properties?: ISerializedMcwTileMap);

            /** SerializedMcwTileMap tiles. */
            public tiles: ISerializedMcwTile[];

            /**
             * Creates a new SerializedMcwTileMap instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SerializedMcwTileMap instance
             */
            public static create(properties?: ISerializedMcwTileMap): SerializedMcwTileMap;

            /**
             * Encodes the specified SerializedMcwTileMap message. Does not implicitly {@link SerializedMcwTileMap.verify|verify} messages.
             * @param message SerializedMcwTileMap message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: ISerializedMcwTileMap, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified SerializedMcwTileMap message, length delimited. Does not implicitly {@link SerializedMcwTileMap.verify|verify} messages.
             * @param message SerializedMcwTileMap message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: ISerializedMcwTileMap, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a SerializedMcwTileMap message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SerializedMcwTileMap
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): SerializedMcwTileMap;

            /**
             * Decodes a SerializedMcwTileMap message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SerializedMcwTileMap
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): SerializedMcwTileMap;

            /**
             * Verifies a SerializedMcwTileMap message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a SerializedMcwTileMap message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SerializedMcwTileMap
             */
            public static fromObject(object: { [k: string]: any }): SerializedMcwTileMap;

            /**
             * Creates a plain object from a SerializedMcwTileMap message. Also converts values to other types if specified.
             * @param message SerializedMcwTileMap
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: SerializedMcwTileMap, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SerializedMcwTileMap to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a SerializedMcwUnitMap. */
        export declare interface ISerializedMcwUnitMap {

            /** SerializedMcwUnitMap nextUnitId */
            nextUnitId?: (number | null);

            /** SerializedMcwUnitMap units */
            units?: (ISerializedMcwUnit[] | null);
        }

        /** Represents a SerializedMcwUnitMap. */
        export declare class SerializedMcwUnitMap implements ISerializedMcwUnitMap {

            /**
             * Constructs a new SerializedMcwUnitMap.
             * @param [properties] Properties to set
             */
            constructor(properties?: ISerializedMcwUnitMap);

            /** SerializedMcwUnitMap nextUnitId. */
            public nextUnitId: number;

            /** SerializedMcwUnitMap units. */
            public units: ISerializedMcwUnit[];

            /**
             * Creates a new SerializedMcwUnitMap instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SerializedMcwUnitMap instance
             */
            public static create(properties?: ISerializedMcwUnitMap): SerializedMcwUnitMap;

            /**
             * Encodes the specified SerializedMcwUnitMap message. Does not implicitly {@link SerializedMcwUnitMap.verify|verify} messages.
             * @param message SerializedMcwUnitMap message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: ISerializedMcwUnitMap, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified SerializedMcwUnitMap message, length delimited. Does not implicitly {@link SerializedMcwUnitMap.verify|verify} messages.
             * @param message SerializedMcwUnitMap message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: ISerializedMcwUnitMap, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a SerializedMcwUnitMap message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SerializedMcwUnitMap
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): SerializedMcwUnitMap;

            /**
             * Decodes a SerializedMcwUnitMap message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SerializedMcwUnitMap
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): SerializedMcwUnitMap;

            /**
             * Verifies a SerializedMcwUnitMap message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a SerializedMcwUnitMap message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SerializedMcwUnitMap
             */
            public static fromObject(object: { [k: string]: any }): SerializedMcwUnitMap;

            /**
             * Creates a plain object from a SerializedMcwUnitMap message. Also converts values to other types if specified.
             * @param message SerializedMcwUnitMap
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: SerializedMcwUnitMap, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SerializedMcwUnitMap to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a SerializedMcwFogMapForPath. */
        export declare interface ISerializedMcwFogMapForPath {

            /** SerializedMcwFogMapForPath playerIndex */
            playerIndex?: (number | null);

            /** SerializedMcwFogMapForPath encodedMap */
            encodedMap?: (string | null);
        }

        /** Represents a SerializedMcwFogMapForPath. */
        export declare class SerializedMcwFogMapForPath implements ISerializedMcwFogMapForPath {

            /**
             * Constructs a new SerializedMcwFogMapForPath.
             * @param [properties] Properties to set
             */
            constructor(properties?: ISerializedMcwFogMapForPath);

            /** SerializedMcwFogMapForPath playerIndex. */
            public playerIndex: number;

            /** SerializedMcwFogMapForPath encodedMap. */
            public encodedMap: string;

            /**
             * Creates a new SerializedMcwFogMapForPath instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SerializedMcwFogMapForPath instance
             */
            public static create(properties?: ISerializedMcwFogMapForPath): SerializedMcwFogMapForPath;

            /**
             * Encodes the specified SerializedMcwFogMapForPath message. Does not implicitly {@link SerializedMcwFogMapForPath.verify|verify} messages.
             * @param message SerializedMcwFogMapForPath message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: ISerializedMcwFogMapForPath, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified SerializedMcwFogMapForPath message, length delimited. Does not implicitly {@link SerializedMcwFogMapForPath.verify|verify} messages.
             * @param message SerializedMcwFogMapForPath message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: ISerializedMcwFogMapForPath, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a SerializedMcwFogMapForPath message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SerializedMcwFogMapForPath
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): SerializedMcwFogMapForPath;

            /**
             * Decodes a SerializedMcwFogMapForPath message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SerializedMcwFogMapForPath
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): SerializedMcwFogMapForPath;

            /**
             * Verifies a SerializedMcwFogMapForPath message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a SerializedMcwFogMapForPath message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SerializedMcwFogMapForPath
             */
            public static fromObject(object: { [k: string]: any }): SerializedMcwFogMapForPath;

            /**
             * Creates a plain object from a SerializedMcwFogMapForPath message. Also converts values to other types if specified.
             * @param message SerializedMcwFogMapForPath
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: SerializedMcwFogMapForPath, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SerializedMcwFogMapForPath to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a SerializedMcwFogMap. */
        export declare interface ISerializedMcwFogMap {

            /** SerializedMcwFogMap forceFogCode */
            forceFogCode?: (number | null);

            /** SerializedMcwFogMap forceExpirePlayerIndex */
            forceExpirePlayerIndex?: (number | null);

            /** SerializedMcwFogMap forceExpireTurnIndex */
            forceExpireTurnIndex?: (number | null);

            /** SerializedMcwFogMap mapsForPath */
            mapsForPath?: (ISerializedMcwFogMapForPath[] | null);
        }

        /** Represents a SerializedMcwFogMap. */
        export declare class SerializedMcwFogMap implements ISerializedMcwFogMap {

            /**
             * Constructs a new SerializedMcwFogMap.
             * @param [properties] Properties to set
             */
            constructor(properties?: ISerializedMcwFogMap);

            /** SerializedMcwFogMap forceFogCode. */
            public forceFogCode: number;

            /** SerializedMcwFogMap forceExpirePlayerIndex. */
            public forceExpirePlayerIndex: number;

            /** SerializedMcwFogMap forceExpireTurnIndex. */
            public forceExpireTurnIndex: number;

            /** SerializedMcwFogMap mapsForPath. */
            public mapsForPath: ISerializedMcwFogMapForPath[];

            /**
             * Creates a new SerializedMcwFogMap instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SerializedMcwFogMap instance
             */
            public static create(properties?: ISerializedMcwFogMap): SerializedMcwFogMap;

            /**
             * Encodes the specified SerializedMcwFogMap message. Does not implicitly {@link SerializedMcwFogMap.verify|verify} messages.
             * @param message SerializedMcwFogMap message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: ISerializedMcwFogMap, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified SerializedMcwFogMap message, length delimited. Does not implicitly {@link SerializedMcwFogMap.verify|verify} messages.
             * @param message SerializedMcwFogMap message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: ISerializedMcwFogMap, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a SerializedMcwFogMap message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SerializedMcwFogMap
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): SerializedMcwFogMap;

            /**
             * Decodes a SerializedMcwFogMap message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SerializedMcwFogMap
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): SerializedMcwFogMap;

            /**
             * Verifies a SerializedMcwFogMap message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a SerializedMcwFogMap message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SerializedMcwFogMap
             */
            public static fromObject(object: { [k: string]: any }): SerializedMcwFogMap;

            /**
             * Creates a plain object from a SerializedMcwFogMap message. Also converts values to other types if specified.
             * @param message SerializedMcwFogMap
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: SerializedMcwFogMap, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SerializedMcwFogMap to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a SerializedMcwField. */
        export declare interface ISerializedMcwField {

            /** SerializedMcwField fogMap */
            fogMap?: (ISerializedMcwFogMap | null);

            /** SerializedMcwField tileMap */
            tileMap?: (ISerializedMcwTileMap | null);

            /** SerializedMcwField unitMap */
            unitMap?: (ISerializedMcwUnitMap | null);
        }

        /** Represents a SerializedMcwField. */
        export declare class SerializedMcwField implements ISerializedMcwField {

            /**
             * Constructs a new SerializedMcwField.
             * @param [properties] Properties to set
             */
            constructor(properties?: ISerializedMcwField);

            /** SerializedMcwField fogMap. */
            public fogMap?: (ISerializedMcwFogMap | null);

            /** SerializedMcwField tileMap. */
            public tileMap?: (ISerializedMcwTileMap | null);

            /** SerializedMcwField unitMap. */
            public unitMap?: (ISerializedMcwUnitMap | null);

            /**
             * Creates a new SerializedMcwField instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SerializedMcwField instance
             */
            public static create(properties?: ISerializedMcwField): SerializedMcwField;

            /**
             * Encodes the specified SerializedMcwField message. Does not implicitly {@link SerializedMcwField.verify|verify} messages.
             * @param message SerializedMcwField message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: ISerializedMcwField, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified SerializedMcwField message, length delimited. Does not implicitly {@link SerializedMcwField.verify|verify} messages.
             * @param message SerializedMcwField message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: ISerializedMcwField, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a SerializedMcwField message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SerializedMcwField
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): SerializedMcwField;

            /**
             * Decodes a SerializedMcwField message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SerializedMcwField
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): SerializedMcwField;

            /**
             * Verifies a SerializedMcwField message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a SerializedMcwField message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SerializedMcwField
             */
            public static fromObject(object: { [k: string]: any }): SerializedMcwField;

            /**
             * Creates a plain object from a SerializedMcwField message. Also converts values to other types if specified.
             * @param message SerializedMcwField
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: SerializedMcwField, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SerializedMcwField to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a SerializedMcwWar. */
        export declare interface ISerializedMcwWar {

            /** SerializedMcwWar warId */
            warId?: (number | null);

            /** SerializedMcwWar configVersion */
            configVersion?: (number | null);

            /** SerializedMcwWar mapName */
            mapName?: (string | null);

            /** SerializedMcwWar mapDesigner */
            mapDesigner?: (string | null);

            /** SerializedMcwWar mapVersion */
            mapVersion?: (number | null);

            /** SerializedMcwWar warName */
            warName?: (string | null);

            /** SerializedMcwWar warPassword */
            warPassword?: (string | null);

            /** SerializedMcwWar warComment */
            warComment?: (string | null);

            /** SerializedMcwWar hasFogByDefault */
            hasFogByDefault?: (boolean | null);

            /** SerializedMcwWar timeLimit */
            timeLimit?: (number | null);

            /** SerializedMcwWar initialFund */
            initialFund?: (number | null);

            /** SerializedMcwWar incomeModifier */
            incomeModifier?: (number | null);

            /** SerializedMcwWar initialEnergy */
            initialEnergy?: (number | null);

            /** SerializedMcwWar energyGrowthModifier */
            energyGrowthModifier?: (number | null);

            /** SerializedMcwWar moveRangeModifier */
            moveRangeModifier?: (number | null);

            /** SerializedMcwWar attackPowerModifier */
            attackPowerModifier?: (number | null);

            /** SerializedMcwWar visionRangeModifier */
            visionRangeModifier?: (number | null);

            /** SerializedMcwWar remainingVotesForDraw */
            remainingVotesForDraw?: (number | null);

            /** SerializedMcwWar enterTurnTime */
            enterTurnTime?: (number | null);

            /** SerializedMcwWar executedActions */
            executedActions?: (IActionContainer[] | null);

            /** SerializedMcwWar players */
            players?: (ISerializedMcwPlayer[] | null);

            /** SerializedMcwWar turn */
            turn?: (ISerializedMcwTurn | null);

            /** SerializedMcwWar field */
            field?: (ISerializedMcwField | null);
        }

        /** Represents a SerializedMcwWar. */
        export declare class SerializedMcwWar implements ISerializedMcwWar {

            /**
             * Constructs a new SerializedMcwWar.
             * @param [properties] Properties to set
             */
            constructor(properties?: ISerializedMcwWar);

            /** SerializedMcwWar warId. */
            public warId: number;

            /** SerializedMcwWar configVersion. */
            public configVersion: number;

            /** SerializedMcwWar mapName. */
            public mapName: string;

            /** SerializedMcwWar mapDesigner. */
            public mapDesigner: string;

            /** SerializedMcwWar mapVersion. */
            public mapVersion: number;

            /** SerializedMcwWar warName. */
            public warName: string;

            /** SerializedMcwWar warPassword. */
            public warPassword: string;

            /** SerializedMcwWar warComment. */
            public warComment: string;

            /** SerializedMcwWar hasFogByDefault. */
            public hasFogByDefault: boolean;

            /** SerializedMcwWar timeLimit. */
            public timeLimit: number;

            /** SerializedMcwWar initialFund. */
            public initialFund: number;

            /** SerializedMcwWar incomeModifier. */
            public incomeModifier: number;

            /** SerializedMcwWar initialEnergy. */
            public initialEnergy: number;

            /** SerializedMcwWar energyGrowthModifier. */
            public energyGrowthModifier: number;

            /** SerializedMcwWar moveRangeModifier. */
            public moveRangeModifier: number;

            /** SerializedMcwWar attackPowerModifier. */
            public attackPowerModifier: number;

            /** SerializedMcwWar visionRangeModifier. */
            public visionRangeModifier: number;

            /** SerializedMcwWar remainingVotesForDraw. */
            public remainingVotesForDraw: number;

            /** SerializedMcwWar enterTurnTime. */
            public enterTurnTime: number;

            /** SerializedMcwWar executedActions. */
            public executedActions: IActionContainer[];

            /** SerializedMcwWar players. */
            public players: ISerializedMcwPlayer[];

            /** SerializedMcwWar turn. */
            public turn?: (ISerializedMcwTurn | null);

            /** SerializedMcwWar field. */
            public field?: (ISerializedMcwField | null);

            /**
             * Creates a new SerializedMcwWar instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SerializedMcwWar instance
             */
            public static create(properties?: ISerializedMcwWar): SerializedMcwWar;

            /**
             * Encodes the specified SerializedMcwWar message. Does not implicitly {@link SerializedMcwWar.verify|verify} messages.
             * @param message SerializedMcwWar message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: ISerializedMcwWar, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified SerializedMcwWar message, length delimited. Does not implicitly {@link SerializedMcwWar.verify|verify} messages.
             * @param message SerializedMcwWar message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: ISerializedMcwWar, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a SerializedMcwWar message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SerializedMcwWar
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): SerializedMcwWar;

            /**
             * Decodes a SerializedMcwWar message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SerializedMcwWar
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): SerializedMcwWar;

            /**
             * Verifies a SerializedMcwWar message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a SerializedMcwWar message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SerializedMcwWar
             */
            public static fromObject(object: { [k: string]: any }): SerializedMcwWar;

            /**
             * Creates a plain object from a SerializedMcwWar message. Also converts values to other types if specified.
             * @param message SerializedMcwWar
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: SerializedMcwWar, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SerializedMcwWar to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a GridIndex. */
        export declare interface IGridIndex {

            /** GridIndex x */
            x?: (number | null);

            /** GridIndex y */
            y?: (number | null);
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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): GridIndex;

            /**
             * Decodes a GridIndex message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns GridIndex
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): GridIndex;

            /**
             * Verifies a GridIndex message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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

        /** Properties of a MapDynamicInfo. */
        export declare interface IMapDynamicInfo {

            /** MapDynamicInfo mapName */
            mapName?: (string | null);

            /** MapDynamicInfo mapDesigner */
            mapDesigner?: (string | null);

            /** MapDynamicInfo mapVersion */
            mapVersion?: (number | null);

            /** MapDynamicInfo playersCount */
            playersCount?: (number | null);

            /** MapDynamicInfo rating */
            rating?: (number | null);

            /** MapDynamicInfo playedTimes */
            playedTimes?: (number | null);
        }

        /** Represents a MapDynamicInfo. */
        export declare class MapDynamicInfo implements IMapDynamicInfo {

            /**
             * Constructs a new MapDynamicInfo.
             * @param [properties] Properties to set
             */
            constructor(properties?: IMapDynamicInfo);

            /** MapDynamicInfo mapName. */
            public mapName: string;

            /** MapDynamicInfo mapDesigner. */
            public mapDesigner: string;

            /** MapDynamicInfo mapVersion. */
            public mapVersion: number;

            /** MapDynamicInfo playersCount. */
            public playersCount: number;

            /** MapDynamicInfo rating. */
            public rating: number;

            /** MapDynamicInfo playedTimes. */
            public playedTimes: number;

            /**
             * Creates a new MapDynamicInfo instance using the specified properties.
             * @param [properties] Properties to set
             * @returns MapDynamicInfo instance
             */
            public static create(properties?: IMapDynamicInfo): MapDynamicInfo;

            /**
             * Encodes the specified MapDynamicInfo message. Does not implicitly {@link MapDynamicInfo.verify|verify} messages.
             * @param message MapDynamicInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IMapDynamicInfo, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified MapDynamicInfo message, length delimited. Does not implicitly {@link MapDynamicInfo.verify|verify} messages.
             * @param message MapDynamicInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IMapDynamicInfo, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a MapDynamicInfo message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MapDynamicInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): MapDynamicInfo;

            /**
             * Decodes a MapDynamicInfo message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MapDynamicInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): MapDynamicInfo;

            /**
             * Verifies a MapDynamicInfo message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a MapDynamicInfo message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns MapDynamicInfo
             */
            public static fromObject(object: { [k: string]: any }): MapDynamicInfo;

            /**
             * Creates a plain object from a MapDynamicInfo message. Also converts values to other types if specified.
             * @param message MapDynamicInfo
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: MapDynamicInfo, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this MapDynamicInfo to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a McrWaitingInfo. */
        export declare interface IMcrWaitingInfo {

            /** McrWaitingInfo id */
            id?: (number | null);

            /** McrWaitingInfo mapName */
            mapName?: (string | null);

            /** McrWaitingInfo mapDesigner */
            mapDesigner?: (string | null);

            /** McrWaitingInfo mapVersion */
            mapVersion?: (number | null);

            /** McrWaitingInfo warName */
            warName?: (string | null);

            /** McrWaitingInfo warPassword */
            warPassword?: (string | null);

            /** McrWaitingInfo warComment */
            warComment?: (string | null);

            /** McrWaitingInfo configVersion */
            configVersion?: (number | null);

            /** McrWaitingInfo p1UserId */
            p1UserId?: (number | null);

            /** McrWaitingInfo p1UserNickname */
            p1UserNickname?: (string | null);

            /** McrWaitingInfo p1TeamIndex */
            p1TeamIndex?: (number | null);

            /** McrWaitingInfo p2UserId */
            p2UserId?: (number | null);

            /** McrWaitingInfo p2UserNickname */
            p2UserNickname?: (string | null);

            /** McrWaitingInfo p2TeamIndex */
            p2TeamIndex?: (number | null);

            /** McrWaitingInfo p3UserId */
            p3UserId?: (number | null);

            /** McrWaitingInfo p3UserNickname */
            p3UserNickname?: (string | null);

            /** McrWaitingInfo p3TeamIndex */
            p3TeamIndex?: (number | null);

            /** McrWaitingInfo p4UserId */
            p4UserId?: (number | null);

            /** McrWaitingInfo p4UserNickname */
            p4UserNickname?: (string | null);

            /** McrWaitingInfo p4TeamIndex */
            p4TeamIndex?: (number | null);

            /** McrWaitingInfo hasFog */
            hasFog?: (number | null);

            /** McrWaitingInfo timeLimit */
            timeLimit?: (number | null);

            /** McrWaitingInfo initialFund */
            initialFund?: (number | null);

            /** McrWaitingInfo incomeModifier */
            incomeModifier?: (number | null);

            /** McrWaitingInfo initialEnergy */
            initialEnergy?: (number | null);

            /** McrWaitingInfo energyGrowthModifier */
            energyGrowthModifier?: (number | null);

            /** McrWaitingInfo moveRangeModifier */
            moveRangeModifier?: (number | null);

            /** McrWaitingInfo attackPowerModifier */
            attackPowerModifier?: (number | null);

            /** McrWaitingInfo visionRangeModifier */
            visionRangeModifier?: (number | null);
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

            /** McrWaitingInfo mapName. */
            public mapName: string;

            /** McrWaitingInfo mapDesigner. */
            public mapDesigner: string;

            /** McrWaitingInfo mapVersion. */
            public mapVersion: number;

            /** McrWaitingInfo warName. */
            public warName: string;

            /** McrWaitingInfo warPassword. */
            public warPassword: string;

            /** McrWaitingInfo warComment. */
            public warComment: string;

            /** McrWaitingInfo configVersion. */
            public configVersion: number;

            /** McrWaitingInfo p1UserId. */
            public p1UserId: number;

            /** McrWaitingInfo p1UserNickname. */
            public p1UserNickname: string;

            /** McrWaitingInfo p1TeamIndex. */
            public p1TeamIndex: number;

            /** McrWaitingInfo p2UserId. */
            public p2UserId: number;

            /** McrWaitingInfo p2UserNickname. */
            public p2UserNickname: string;

            /** McrWaitingInfo p2TeamIndex. */
            public p2TeamIndex: number;

            /** McrWaitingInfo p3UserId. */
            public p3UserId: number;

            /** McrWaitingInfo p3UserNickname. */
            public p3UserNickname: string;

            /** McrWaitingInfo p3TeamIndex. */
            public p3TeamIndex: number;

            /** McrWaitingInfo p4UserId. */
            public p4UserId: number;

            /** McrWaitingInfo p4UserNickname. */
            public p4UserNickname: string;

            /** McrWaitingInfo p4TeamIndex. */
            public p4TeamIndex: number;

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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): McrWaitingInfo;

            /**
             * Decodes a McrWaitingInfo message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns McrWaitingInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): McrWaitingInfo;

            /**
             * Verifies a McrWaitingInfo message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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
            id?: (number | null);

            /** McwOngoingDetail configVersion */
            configVersion?: (number | null);

            /** McwOngoingDetail mapName */
            mapName?: (string | null);

            /** McwOngoingDetail mapDesigner */
            mapDesigner?: (string | null);

            /** McwOngoingDetail mapVersion */
            mapVersion?: (number | null);

            /** McwOngoingDetail warName */
            warName?: (string | null);

            /** McwOngoingDetail warPassword */
            warPassword?: (string | null);

            /** McwOngoingDetail warComment */
            warComment?: (string | null);

            /** McwOngoingDetail hasFog */
            hasFog?: (number | null);

            /** McwOngoingDetail timeLimit */
            timeLimit?: (number | null);

            /** McwOngoingDetail initialFund */
            initialFund?: (number | null);

            /** McwOngoingDetail incomeModifier */
            incomeModifier?: (number | null);

            /** McwOngoingDetail initialEnergy */
            initialEnergy?: (number | null);

            /** McwOngoingDetail energyGrowthModifier */
            energyGrowthModifier?: (number | null);

            /** McwOngoingDetail moveRangeModifier */
            moveRangeModifier?: (number | null);

            /** McwOngoingDetail attackPowerModifier */
            attackPowerModifier?: (number | null);

            /** McwOngoingDetail visionRangeModifier */
            visionRangeModifier?: (number | null);

            /** McwOngoingDetail p1UserId */
            p1UserId?: (number | null);

            /** McwOngoingDetail p1TeamIndex */
            p1TeamIndex?: (number | null);

            /** McwOngoingDetail p1IsAlive */
            p1IsAlive?: (boolean | null);

            /** McwOngoingDetail p1UserNickname */
            p1UserNickname?: (string | null);

            /** McwOngoingDetail p2UserId */
            p2UserId?: (number | null);

            /** McwOngoingDetail p2TeamIndex */
            p2TeamIndex?: (number | null);

            /** McwOngoingDetail p2IsAlive */
            p2IsAlive?: (boolean | null);

            /** McwOngoingDetail p2UserNickname */
            p2UserNickname?: (string | null);

            /** McwOngoingDetail p3UserId */
            p3UserId?: (number | null);

            /** McwOngoingDetail p3TeamIndex */
            p3TeamIndex?: (number | null);

            /** McwOngoingDetail p3IsAlive */
            p3IsAlive?: (boolean | null);

            /** McwOngoingDetail p3UserNickname */
            p3UserNickname?: (string | null);

            /** McwOngoingDetail p4UserId */
            p4UserId?: (number | null);

            /** McwOngoingDetail p4TeamIndex */
            p4TeamIndex?: (number | null);

            /** McwOngoingDetail p4IsAlive */
            p4IsAlive?: (boolean | null);

            /** McwOngoingDetail p4UserNickname */
            p4UserNickname?: (string | null);

            /** McwOngoingDetail playerIndexInTurn */
            playerIndexInTurn?: (number | null);

            /** McwOngoingDetail turnIndex */
            turnIndex?: (number | null);

            /** McwOngoingDetail enterTurnTime */
            enterTurnTime?: (number | null);
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
            public configVersion: number;

            /** McwOngoingDetail mapName. */
            public mapName: string;

            /** McwOngoingDetail mapDesigner. */
            public mapDesigner: string;

            /** McwOngoingDetail mapVersion. */
            public mapVersion: number;

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

            /** McwOngoingDetail p1UserNickname. */
            public p1UserNickname: string;

            /** McwOngoingDetail p2UserId. */
            public p2UserId: number;

            /** McwOngoingDetail p2TeamIndex. */
            public p2TeamIndex: number;

            /** McwOngoingDetail p2IsAlive. */
            public p2IsAlive: boolean;

            /** McwOngoingDetail p2UserNickname. */
            public p2UserNickname: string;

            /** McwOngoingDetail p3UserId. */
            public p3UserId: number;

            /** McwOngoingDetail p3TeamIndex. */
            public p3TeamIndex: number;

            /** McwOngoingDetail p3IsAlive. */
            public p3IsAlive: boolean;

            /** McwOngoingDetail p3UserNickname. */
            public p3UserNickname: string;

            /** McwOngoingDetail p4UserId. */
            public p4UserId: number;

            /** McwOngoingDetail p4TeamIndex. */
            public p4TeamIndex: number;

            /** McwOngoingDetail p4IsAlive. */
            public p4IsAlive: boolean;

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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): McwOngoingDetail;

            /**
             * Decodes a McwOngoingDetail message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns McwOngoingDetail
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): McwOngoingDetail;

            /**
             * Verifies a McwOngoingDetail message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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

        /** Properties of a McwRepairData. */
        export declare interface IMcwRepairData {

            /** McwRepairData unitId */
            unitId?: (number | null);

            /** McwRepairData repairAmount */
            repairAmount?: (number | null);

            /** McwRepairData gridIndex */
            gridIndex?: (IGridIndex | null);
        }

        /** Represents a McwRepairData. */
        export declare class McwRepairData implements IMcwRepairData {

            /**
             * Constructs a new McwRepairData.
             * @param [properties] Properties to set
             */
            constructor(properties?: IMcwRepairData);

            /** McwRepairData unitId. */
            public unitId: number;

            /** McwRepairData repairAmount. */
            public repairAmount: number;

            /** McwRepairData gridIndex. */
            public gridIndex?: (IGridIndex | null);

            /**
             * Creates a new McwRepairData instance using the specified properties.
             * @param [properties] Properties to set
             * @returns McwRepairData instance
             */
            public static create(properties?: IMcwRepairData): McwRepairData;

            /**
             * Encodes the specified McwRepairData message. Does not implicitly {@link McwRepairData.verify|verify} messages.
             * @param message McwRepairData message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IMcwRepairData, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified McwRepairData message, length delimited. Does not implicitly {@link McwRepairData.verify|verify} messages.
             * @param message McwRepairData message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IMcwRepairData, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a McwRepairData message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns McwRepairData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): McwRepairData;

            /**
             * Decodes a McwRepairData message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns McwRepairData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): McwRepairData;

            /**
             * Verifies a McwRepairData message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a McwRepairData message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns McwRepairData
             */
            public static fromObject(object: { [k: string]: any }): McwRepairData;

            /**
             * Creates a plain object from a McwRepairData message. Also converts values to other types if specified.
             * @param message McwRepairData
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: McwRepairData, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this McwRepairData to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an ActionContainer. */
        export declare interface IActionContainer {

            /** ActionContainer C_Heartbeat */
            C_Heartbeat?: (IC_Heartbeat | null);

            /** ActionContainer S_Heartbeat */
            S_Heartbeat?: (IS_Heartbeat | null);

            /** ActionContainer C_Register */
            C_Register?: (IC_Register | null);

            /** ActionContainer S_Register */
            S_Register?: (IS_Register | null);

            /** ActionContainer C_Login */
            C_Login?: (IC_Login | null);

            /** ActionContainer S_Login */
            S_Login?: (IS_Login | null);

            /** ActionContainer C_Logout */
            C_Logout?: (IC_Logout | null);

            /** ActionContainer S_Logout */
            S_Logout?: (IS_Logout | null);

            /** ActionContainer S_Error */
            S_Error?: (IS_Error | null);

            /** ActionContainer C_GetNewestMapDynamicInfos */
            C_GetNewestMapDynamicInfos?: (IC_GetNewestMapDynamicInfos | null);

            /** ActionContainer S_GetNewestMapDynamicInfos */
            S_GetNewestMapDynamicInfos?: (IS_GetNewestMapDynamicInfos | null);

            /** ActionContainer S_NewestConfigVersion */
            S_NewestConfigVersion?: (IS_NewestConfigVersion | null);

            /** ActionContainer C_GetMapDynamicInfo */
            C_GetMapDynamicInfo?: (IC_GetMapDynamicInfo | null);

            /** ActionContainer S_GetMapDynamicInfo */
            S_GetMapDynamicInfo?: (IS_GetMapDynamicInfo | null);

            /** ActionContainer S_ServerDisconnect */
            S_ServerDisconnect?: (IS_ServerDisconnect | null);

            /** ActionContainer C_McrCreateWar */
            C_McrCreateWar?: (IC_McrCreateWar | null);

            /** ActionContainer S_McrCreateWar */
            S_McrCreateWar?: (IS_McrCreateWar | null);

            /** ActionContainer C_McrExitWar */
            C_McrExitWar?: (IC_McrExitWar | null);

            /** ActionContainer S_McrExitWar */
            S_McrExitWar?: (IS_McrExitWar | null);

            /** ActionContainer C_McrGetJoinedWaitingInfos */
            C_McrGetJoinedWaitingInfos?: (IC_McrGetJoinedWaitingInfos | null);

            /** ActionContainer S_McrGetJoinedWaitingInfos */
            S_McrGetJoinedWaitingInfos?: (IS_McrGetJoinedWaitingInfos | null);

            /** ActionContainer C_McrGetUnjoinedWaitingInfos */
            C_McrGetUnjoinedWaitingInfos?: (IC_McrGetUnjoinedWaitingInfos | null);

            /** ActionContainer S_McrGetUnjoinedWaitingInfos */
            S_McrGetUnjoinedWaitingInfos?: (IS_McrGetUnjoinedWaitingInfos | null);

            /** ActionContainer C_McrJoinWar */
            C_McrJoinWar?: (IC_McrJoinWar | null);

            /** ActionContainer S_McrJoinWar */
            S_McrJoinWar?: (IS_McrJoinWar | null);

            /** ActionContainer C_McrGetJoinedOngoingInfos */
            C_McrGetJoinedOngoingInfos?: (IC_McrGetJoinedOngoingInfos | null);

            /** ActionContainer S_McrGetJoinedOngoingInfos */
            S_McrGetJoinedOngoingInfos?: (IS_McrGetJoinedOngoingInfos | null);

            /** ActionContainer C_McwBeginTurn */
            C_McwBeginTurn?: (IC_McwBeginTurn | null);

            /** ActionContainer S_McwBeginTurn */
            S_McwBeginTurn?: (IS_McwBeginTurn | null);

            /** ActionContainer C_McwEndTurn */
            C_McwEndTurn?: (IC_McwEndTurn | null);

            /** ActionContainer S_McwEndTurn */
            S_McwEndTurn?: (IS_McwEndTurn | null);
        }

        /** Represents an ActionContainer. */
        export declare class ActionContainer implements IActionContainer {

            /**
             * Constructs a new ActionContainer.
             * @param [properties] Properties to set
             */
            constructor(properties?: IActionContainer);

            /** ActionContainer C_Heartbeat. */
            public C_Heartbeat?: (IC_Heartbeat | null);

            /** ActionContainer S_Heartbeat. */
            public S_Heartbeat?: (IS_Heartbeat | null);

            /** ActionContainer C_Register. */
            public C_Register?: (IC_Register | null);

            /** ActionContainer S_Register. */
            public S_Register?: (IS_Register | null);

            /** ActionContainer C_Login. */
            public C_Login?: (IC_Login | null);

            /** ActionContainer S_Login. */
            public S_Login?: (IS_Login | null);

            /** ActionContainer C_Logout. */
            public C_Logout?: (IC_Logout | null);

            /** ActionContainer S_Logout. */
            public S_Logout?: (IS_Logout | null);

            /** ActionContainer S_Error. */
            public S_Error?: (IS_Error | null);

            /** ActionContainer C_GetNewestMapDynamicInfos. */
            public C_GetNewestMapDynamicInfos?: (IC_GetNewestMapDynamicInfos | null);

            /** ActionContainer S_GetNewestMapDynamicInfos. */
            public S_GetNewestMapDynamicInfos?: (IS_GetNewestMapDynamicInfos | null);

            /** ActionContainer S_NewestConfigVersion. */
            public S_NewestConfigVersion?: (IS_NewestConfigVersion | null);

            /** ActionContainer C_GetMapDynamicInfo. */
            public C_GetMapDynamicInfo?: (IC_GetMapDynamicInfo | null);

            /** ActionContainer S_GetMapDynamicInfo. */
            public S_GetMapDynamicInfo?: (IS_GetMapDynamicInfo | null);

            /** ActionContainer S_ServerDisconnect. */
            public S_ServerDisconnect?: (IS_ServerDisconnect | null);

            /** ActionContainer C_McrCreateWar. */
            public C_McrCreateWar?: (IC_McrCreateWar | null);

            /** ActionContainer S_McrCreateWar. */
            public S_McrCreateWar?: (IS_McrCreateWar | null);

            /** ActionContainer C_McrExitWar. */
            public C_McrExitWar?: (IC_McrExitWar | null);

            /** ActionContainer S_McrExitWar. */
            public S_McrExitWar?: (IS_McrExitWar | null);

            /** ActionContainer C_McrGetJoinedWaitingInfos. */
            public C_McrGetJoinedWaitingInfos?: (IC_McrGetJoinedWaitingInfos | null);

            /** ActionContainer S_McrGetJoinedWaitingInfos. */
            public S_McrGetJoinedWaitingInfos?: (IS_McrGetJoinedWaitingInfos | null);

            /** ActionContainer C_McrGetUnjoinedWaitingInfos. */
            public C_McrGetUnjoinedWaitingInfos?: (IC_McrGetUnjoinedWaitingInfos | null);

            /** ActionContainer S_McrGetUnjoinedWaitingInfos. */
            public S_McrGetUnjoinedWaitingInfos?: (IS_McrGetUnjoinedWaitingInfos | null);

            /** ActionContainer C_McrJoinWar. */
            public C_McrJoinWar?: (IC_McrJoinWar | null);

            /** ActionContainer S_McrJoinWar. */
            public S_McrJoinWar?: (IS_McrJoinWar | null);

            /** ActionContainer C_McrGetJoinedOngoingInfos. */
            public C_McrGetJoinedOngoingInfos?: (IC_McrGetJoinedOngoingInfos | null);

            /** ActionContainer S_McrGetJoinedOngoingInfos. */
            public S_McrGetJoinedOngoingInfos?: (IS_McrGetJoinedOngoingInfos | null);

            /** ActionContainer C_McwBeginTurn. */
            public C_McwBeginTurn?: (IC_McwBeginTurn | null);

            /** ActionContainer S_McwBeginTurn. */
            public S_McwBeginTurn?: (IS_McwBeginTurn | null);

            /** ActionContainer C_McwEndTurn. */
            public C_McwEndTurn?: (IC_McwEndTurn | null);

            /** ActionContainer S_McwEndTurn. */
            public S_McwEndTurn?: (IS_McwEndTurn | null);

            /**
             * Creates a new ActionContainer instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ActionContainer instance
             */
            public static create(properties?: IActionContainer): ActionContainer;

            /**
             * Encodes the specified ActionContainer message. Does not implicitly {@link ActionContainer.verify|verify} messages.
             * @param message ActionContainer message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IActionContainer, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified ActionContainer message, length delimited. Does not implicitly {@link ActionContainer.verify|verify} messages.
             * @param message ActionContainer message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IActionContainer, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes an ActionContainer message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ActionContainer
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): ActionContainer;

            /**
             * Decodes an ActionContainer message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ActionContainer
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): ActionContainer;

            /**
             * Verifies an ActionContainer message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates an ActionContainer message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ActionContainer
             */
            public static fromObject(object: { [k: string]: any }): ActionContainer;

            /**
             * Creates a plain object from an ActionContainer message. Also converts values to other types if specified.
             * @param message ActionContainer
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: ActionContainer, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ActionContainer to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a C_Heartbeat. */
        export declare interface IC_Heartbeat {

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

        /** Properties of a C_GetNewestMapDynamicInfos. */
        export declare interface IC_GetNewestMapDynamicInfos {

            /** C_GetNewestMapDynamicInfos mapName */
            mapName?: (string | null);

            /** C_GetNewestMapDynamicInfos mapDesigner */
            mapDesigner?: (string | null);

            /** C_GetNewestMapDynamicInfos playersCount */
            playersCount?: (number | null);

            /** C_GetNewestMapDynamicInfos minRating */
            minRating?: (number | null);

            /** C_GetNewestMapDynamicInfos minPlayedTimes */
            minPlayedTimes?: (number | null);
        }

        /** Represents a C_GetNewestMapDynamicInfos. */
        export declare class C_GetNewestMapDynamicInfos implements IC_GetNewestMapDynamicInfos {

            /**
             * Constructs a new C_GetNewestMapDynamicInfos.
             * @param [properties] Properties to set
             */
            constructor(properties?: IC_GetNewestMapDynamicInfos);

            /** C_GetNewestMapDynamicInfos mapName. */
            public mapName: string;

            /** C_GetNewestMapDynamicInfos mapDesigner. */
            public mapDesigner: string;

            /** C_GetNewestMapDynamicInfos playersCount. */
            public playersCount: number;

            /** C_GetNewestMapDynamicInfos minRating. */
            public minRating: number;

            /** C_GetNewestMapDynamicInfos minPlayedTimes. */
            public minPlayedTimes: number;

            /**
             * Creates a new C_GetNewestMapDynamicInfos instance using the specified properties.
             * @param [properties] Properties to set
             * @returns C_GetNewestMapDynamicInfos instance
             */
            public static create(properties?: IC_GetNewestMapDynamicInfos): C_GetNewestMapDynamicInfos;

            /**
             * Encodes the specified C_GetNewestMapDynamicInfos message. Does not implicitly {@link C_GetNewestMapDynamicInfos.verify|verify} messages.
             * @param message C_GetNewestMapDynamicInfos message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IC_GetNewestMapDynamicInfos, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified C_GetNewestMapDynamicInfos message, length delimited. Does not implicitly {@link C_GetNewestMapDynamicInfos.verify|verify} messages.
             * @param message C_GetNewestMapDynamicInfos message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IC_GetNewestMapDynamicInfos, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a C_GetNewestMapDynamicInfos message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns C_GetNewestMapDynamicInfos
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): C_GetNewestMapDynamicInfos;

            /**
             * Decodes a C_GetNewestMapDynamicInfos message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns C_GetNewestMapDynamicInfos
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): C_GetNewestMapDynamicInfos;

            /**
             * Verifies a C_GetNewestMapDynamicInfos message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a C_GetNewestMapDynamicInfos message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns C_GetNewestMapDynamicInfos
             */
            public static fromObject(object: { [k: string]: any }): C_GetNewestMapDynamicInfos;

            /**
             * Creates a plain object from a C_GetNewestMapDynamicInfos message. Also converts values to other types if specified.
             * @param message C_GetNewestMapDynamicInfos
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: C_GetNewestMapDynamicInfos, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this C_GetNewestMapDynamicInfos to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a S_GetNewestMapDynamicInfos. */
        export declare interface IS_GetNewestMapDynamicInfos {

            /** S_GetNewestMapDynamicInfos errorCode */
            errorCode?: (number | null);

            /** S_GetNewestMapDynamicInfos mapInfos */
            mapInfos?: (IMapDynamicInfo[] | null);
        }

        /** Represents a S_GetNewestMapDynamicInfos. */
        export declare class S_GetNewestMapDynamicInfos implements IS_GetNewestMapDynamicInfos {

            /**
             * Constructs a new S_GetNewestMapDynamicInfos.
             * @param [properties] Properties to set
             */
            constructor(properties?: IS_GetNewestMapDynamicInfos);

            /** S_GetNewestMapDynamicInfos errorCode. */
            public errorCode: number;

            /** S_GetNewestMapDynamicInfos mapInfos. */
            public mapInfos: IMapDynamicInfo[];

            /**
             * Creates a new S_GetNewestMapDynamicInfos instance using the specified properties.
             * @param [properties] Properties to set
             * @returns S_GetNewestMapDynamicInfos instance
             */
            public static create(properties?: IS_GetNewestMapDynamicInfos): S_GetNewestMapDynamicInfos;

            /**
             * Encodes the specified S_GetNewestMapDynamicInfos message. Does not implicitly {@link S_GetNewestMapDynamicInfos.verify|verify} messages.
             * @param message S_GetNewestMapDynamicInfos message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IS_GetNewestMapDynamicInfos, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified S_GetNewestMapDynamicInfos message, length delimited. Does not implicitly {@link S_GetNewestMapDynamicInfos.verify|verify} messages.
             * @param message S_GetNewestMapDynamicInfos message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IS_GetNewestMapDynamicInfos, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a S_GetNewestMapDynamicInfos message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns S_GetNewestMapDynamicInfos
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): S_GetNewestMapDynamicInfos;

            /**
             * Decodes a S_GetNewestMapDynamicInfos message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns S_GetNewestMapDynamicInfos
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): S_GetNewestMapDynamicInfos;

            /**
             * Verifies a S_GetNewestMapDynamicInfos message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a S_GetNewestMapDynamicInfos message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns S_GetNewestMapDynamicInfos
             */
            public static fromObject(object: { [k: string]: any }): S_GetNewestMapDynamicInfos;

            /**
             * Creates a plain object from a S_GetNewestMapDynamicInfos message. Also converts values to other types if specified.
             * @param message S_GetNewestMapDynamicInfos
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: S_GetNewestMapDynamicInfos, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this S_GetNewestMapDynamicInfos to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a S_NewestConfigVersion. */
        export declare interface IS_NewestConfigVersion {

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

        /** Properties of a C_GetMapDynamicInfo. */
        export declare interface IC_GetMapDynamicInfo {

            /** C_GetMapDynamicInfo mapName */
            mapName?: (string | null);

            /** C_GetMapDynamicInfo mapDesigner */
            mapDesigner?: (string | null);

            /** C_GetMapDynamicInfo mapVersion */
            mapVersion?: (number | null);
        }

        /** Represents a C_GetMapDynamicInfo. */
        export declare class C_GetMapDynamicInfo implements IC_GetMapDynamicInfo {

            /**
             * Constructs a new C_GetMapDynamicInfo.
             * @param [properties] Properties to set
             */
            constructor(properties?: IC_GetMapDynamicInfo);

            /** C_GetMapDynamicInfo mapName. */
            public mapName: string;

            /** C_GetMapDynamicInfo mapDesigner. */
            public mapDesigner: string;

            /** C_GetMapDynamicInfo mapVersion. */
            public mapVersion: number;

            /**
             * Creates a new C_GetMapDynamicInfo instance using the specified properties.
             * @param [properties] Properties to set
             * @returns C_GetMapDynamicInfo instance
             */
            public static create(properties?: IC_GetMapDynamicInfo): C_GetMapDynamicInfo;

            /**
             * Encodes the specified C_GetMapDynamicInfo message. Does not implicitly {@link C_GetMapDynamicInfo.verify|verify} messages.
             * @param message C_GetMapDynamicInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IC_GetMapDynamicInfo, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified C_GetMapDynamicInfo message, length delimited. Does not implicitly {@link C_GetMapDynamicInfo.verify|verify} messages.
             * @param message C_GetMapDynamicInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IC_GetMapDynamicInfo, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a C_GetMapDynamicInfo message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns C_GetMapDynamicInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): C_GetMapDynamicInfo;

            /**
             * Decodes a C_GetMapDynamicInfo message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns C_GetMapDynamicInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): C_GetMapDynamicInfo;

            /**
             * Verifies a C_GetMapDynamicInfo message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a C_GetMapDynamicInfo message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns C_GetMapDynamicInfo
             */
            public static fromObject(object: { [k: string]: any }): C_GetMapDynamicInfo;

            /**
             * Creates a plain object from a C_GetMapDynamicInfo message. Also converts values to other types if specified.
             * @param message C_GetMapDynamicInfo
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: C_GetMapDynamicInfo, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this C_GetMapDynamicInfo to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a S_GetMapDynamicInfo. */
        export declare interface IS_GetMapDynamicInfo {

            /** S_GetMapDynamicInfo errorCode */
            errorCode?: (number | null);

            /** S_GetMapDynamicInfo mapName */
            mapName?: (string | null);

            /** S_GetMapDynamicInfo mapDesigner */
            mapDesigner?: (string | null);

            /** S_GetMapDynamicInfo mapVersion */
            mapVersion?: (number | null);

            /** S_GetMapDynamicInfo mapDynamicInfo */
            mapDynamicInfo?: (IMapDynamicInfo | null);
        }

        /** Represents a S_GetMapDynamicInfo. */
        export declare class S_GetMapDynamicInfo implements IS_GetMapDynamicInfo {

            /**
             * Constructs a new S_GetMapDynamicInfo.
             * @param [properties] Properties to set
             */
            constructor(properties?: IS_GetMapDynamicInfo);

            /** S_GetMapDynamicInfo errorCode. */
            public errorCode: number;

            /** S_GetMapDynamicInfo mapName. */
            public mapName: string;

            /** S_GetMapDynamicInfo mapDesigner. */
            public mapDesigner: string;

            /** S_GetMapDynamicInfo mapVersion. */
            public mapVersion: number;

            /** S_GetMapDynamicInfo mapDynamicInfo. */
            public mapDynamicInfo?: (IMapDynamicInfo | null);

            /**
             * Creates a new S_GetMapDynamicInfo instance using the specified properties.
             * @param [properties] Properties to set
             * @returns S_GetMapDynamicInfo instance
             */
            public static create(properties?: IS_GetMapDynamicInfo): S_GetMapDynamicInfo;

            /**
             * Encodes the specified S_GetMapDynamicInfo message. Does not implicitly {@link S_GetMapDynamicInfo.verify|verify} messages.
             * @param message S_GetMapDynamicInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IS_GetMapDynamicInfo, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified S_GetMapDynamicInfo message, length delimited. Does not implicitly {@link S_GetMapDynamicInfo.verify|verify} messages.
             * @param message S_GetMapDynamicInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IS_GetMapDynamicInfo, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a S_GetMapDynamicInfo message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns S_GetMapDynamicInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): S_GetMapDynamicInfo;

            /**
             * Decodes a S_GetMapDynamicInfo message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns S_GetMapDynamicInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): S_GetMapDynamicInfo;

            /**
             * Verifies a S_GetMapDynamicInfo message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a S_GetMapDynamicInfo message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns S_GetMapDynamicInfo
             */
            public static fromObject(object: { [k: string]: any }): S_GetMapDynamicInfo;

            /**
             * Creates a plain object from a S_GetMapDynamicInfo message. Also converts values to other types if specified.
             * @param message S_GetMapDynamicInfo
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: S_GetMapDynamicInfo, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this S_GetMapDynamicInfo to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a S_ServerDisconnect. */
        export declare interface IS_ServerDisconnect {

            /** S_ServerDisconnect errorCode */
            errorCode?: (number | null);
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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): S_ServerDisconnect;

            /**
             * Decodes a S_ServerDisconnect message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns S_ServerDisconnect
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): S_ServerDisconnect;

            /**
             * Verifies a S_ServerDisconnect message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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

        /** Properties of a C_McrCreateWar. */
        export declare interface IC_McrCreateWar {

            /** C_McrCreateWar mapName */
            mapName?: (string | null);

            /** C_McrCreateWar mapDesigner */
            mapDesigner?: (string | null);

            /** C_McrCreateWar mapVersion */
            mapVersion?: (number | null);

            /** C_McrCreateWar warName */
            warName?: (string | null);

            /** C_McrCreateWar warPassword */
            warPassword?: (string | null);

            /** C_McrCreateWar warComment */
            warComment?: (string | null);

            /** C_McrCreateWar configVersion */
            configVersion?: (number | null);

            /** C_McrCreateWar playerIndex */
            playerIndex?: (number | null);

            /** C_McrCreateWar teamIndex */
            teamIndex?: (number | null);

            /** C_McrCreateWar hasFog */
            hasFog?: (number | null);

            /** C_McrCreateWar timeLimit */
            timeLimit?: (number | null);

            /** C_McrCreateWar initialFund */
            initialFund?: (number | null);

            /** C_McrCreateWar incomeModifier */
            incomeModifier?: (number | null);

            /** C_McrCreateWar initialEnergy */
            initialEnergy?: (number | null);

            /** C_McrCreateWar energyGrowthModifier */
            energyGrowthModifier?: (number | null);

            /** C_McrCreateWar moveRangeModifier */
            moveRangeModifier?: (number | null);

            /** C_McrCreateWar attackPowerModifier */
            attackPowerModifier?: (number | null);

            /** C_McrCreateWar visionRangeModifier */
            visionRangeModifier?: (number | null);
        }

        /** Represents a C_McrCreateWar. */
        export declare class C_McrCreateWar implements IC_McrCreateWar {

            /**
             * Constructs a new C_McrCreateWar.
             * @param [properties] Properties to set
             */
            constructor(properties?: IC_McrCreateWar);

            /** C_McrCreateWar mapName. */
            public mapName: string;

            /** C_McrCreateWar mapDesigner. */
            public mapDesigner: string;

            /** C_McrCreateWar mapVersion. */
            public mapVersion: number;

            /** C_McrCreateWar warName. */
            public warName: string;

            /** C_McrCreateWar warPassword. */
            public warPassword: string;

            /** C_McrCreateWar warComment. */
            public warComment: string;

            /** C_McrCreateWar configVersion. */
            public configVersion: number;

            /** C_McrCreateWar playerIndex. */
            public playerIndex: number;

            /** C_McrCreateWar teamIndex. */
            public teamIndex: number;

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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): C_McrCreateWar;

            /**
             * Decodes a C_McrCreateWar message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns C_McrCreateWar
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): C_McrCreateWar;

            /**
             * Verifies a C_McrCreateWar message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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
            errorCode?: (number | null);
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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): S_McrCreateWar;

            /**
             * Decodes a S_McrCreateWar message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns S_McrCreateWar
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): S_McrCreateWar;

            /**
             * Verifies a S_McrCreateWar message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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
            infoId?: (number | null);
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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): C_McrExitWar;

            /**
             * Decodes a C_McrExitWar message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns C_McrExitWar
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): C_McrExitWar;

            /**
             * Verifies a C_McrExitWar message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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
            errorCode?: (number | null);
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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): S_McrExitWar;

            /**
             * Decodes a S_McrExitWar message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns S_McrExitWar
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): S_McrExitWar;

            /**
             * Verifies a S_McrExitWar message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): C_McrGetJoinedWaitingInfos;

            /**
             * Decodes a C_McrGetJoinedWaitingInfos message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns C_McrGetJoinedWaitingInfos
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): C_McrGetJoinedWaitingInfos;

            /**
             * Verifies a C_McrGetJoinedWaitingInfos message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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
            errorCode?: (number | null);

            /** S_McrGetJoinedWaitingInfos warInfos */
            warInfos?: (IMcrWaitingInfo[] | null);
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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): S_McrGetJoinedWaitingInfos;

            /**
             * Decodes a S_McrGetJoinedWaitingInfos message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns S_McrGetJoinedWaitingInfos
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): S_McrGetJoinedWaitingInfos;

            /**
             * Verifies a S_McrGetJoinedWaitingInfos message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): C_McrGetUnjoinedWaitingInfos;

            /**
             * Decodes a C_McrGetUnjoinedWaitingInfos message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns C_McrGetUnjoinedWaitingInfos
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): C_McrGetUnjoinedWaitingInfos;

            /**
             * Verifies a C_McrGetUnjoinedWaitingInfos message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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
            errorCode?: (number | null);

            /** S_McrGetUnjoinedWaitingInfos warInfos */
            warInfos?: (IMcrWaitingInfo[] | null);
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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): S_McrGetUnjoinedWaitingInfos;

            /**
             * Decodes a S_McrGetUnjoinedWaitingInfos message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns S_McrGetUnjoinedWaitingInfos
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): S_McrGetUnjoinedWaitingInfos;

            /**
             * Verifies a S_McrGetUnjoinedWaitingInfos message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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
            infoId?: (number | null);

            /** C_McrJoinWar playerIndex */
            playerIndex?: (number | null);

            /** C_McrJoinWar teamIndex */
            teamIndex?: (number | null);
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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): C_McrJoinWar;

            /**
             * Decodes a C_McrJoinWar message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns C_McrJoinWar
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): C_McrJoinWar;

            /**
             * Verifies a C_McrJoinWar message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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
            errorCode?: (number | null);

            /** S_McrJoinWar isStarted */
            isStarted?: (boolean | null);
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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): S_McrJoinWar;

            /**
             * Decodes a S_McrJoinWar message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns S_McrJoinWar
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): S_McrJoinWar;

            /**
             * Verifies a S_McrJoinWar message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): C_McrGetJoinedOngoingInfos;

            /**
             * Decodes a C_McrGetJoinedOngoingInfos message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns C_McrGetJoinedOngoingInfos
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): C_McrGetJoinedOngoingInfos;

            /**
             * Verifies a C_McrGetJoinedOngoingInfos message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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
            infos?: (IMcwOngoingDetail[] | null);
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
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): S_McrGetJoinedOngoingInfos;

            /**
             * Decodes a S_McrGetJoinedOngoingInfos message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns S_McrGetJoinedOngoingInfos
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): S_McrGetJoinedOngoingInfos;

            /**
             * Verifies a S_McrGetJoinedOngoingInfos message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

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

        /** Properties of a C_McwBeginTurn. */
        export declare interface IC_McwBeginTurn {

            /** C_McwBeginTurn warId */
            warId?: (number | null);
        }

        /** Represents a C_McwBeginTurn. */
        export declare class C_McwBeginTurn implements IC_McwBeginTurn {

            /**
             * Constructs a new C_McwBeginTurn.
             * @param [properties] Properties to set
             */
            constructor(properties?: IC_McwBeginTurn);

            /** C_McwBeginTurn warId. */
            public warId: number;

            /**
             * Creates a new C_McwBeginTurn instance using the specified properties.
             * @param [properties] Properties to set
             * @returns C_McwBeginTurn instance
             */
            public static create(properties?: IC_McwBeginTurn): C_McwBeginTurn;

            /**
             * Encodes the specified C_McwBeginTurn message. Does not implicitly {@link C_McwBeginTurn.verify|verify} messages.
             * @param message C_McwBeginTurn message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IC_McwBeginTurn, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified C_McwBeginTurn message, length delimited. Does not implicitly {@link C_McwBeginTurn.verify|verify} messages.
             * @param message C_McwBeginTurn message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IC_McwBeginTurn, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a C_McwBeginTurn message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns C_McwBeginTurn
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): C_McwBeginTurn;

            /**
             * Decodes a C_McwBeginTurn message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns C_McwBeginTurn
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): C_McwBeginTurn;

            /**
             * Verifies a C_McwBeginTurn message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a C_McwBeginTurn message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns C_McwBeginTurn
             */
            public static fromObject(object: { [k: string]: any }): C_McwBeginTurn;

            /**
             * Creates a plain object from a C_McwBeginTurn message. Also converts values to other types if specified.
             * @param message C_McwBeginTurn
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: C_McwBeginTurn, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this C_McwBeginTurn to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a S_McwBeginTurn. */
        export declare interface IS_McwBeginTurn {

            /** S_McwBeginTurn errorCode */
            errorCode?: (number | null);

            /** S_McwBeginTurn warId */
            warId?: (number | null);

            /** S_McwBeginTurn actionId */
            actionId?: (number | null);

            /** S_McwBeginTurn remainingFund */
            remainingFund?: (number | null);

            /** S_McwBeginTurn isDefeated */
            isDefeated?: (boolean | null);

            /** S_McwBeginTurn repairDataByTile */
            repairDataByTile?: (IMcwRepairData[] | null);

            /** S_McwBeginTurn repairDataByUnit */
            repairDataByUnit?: (IMcwRepairData[] | null);
        }

        /** Represents a S_McwBeginTurn. */
        export declare class S_McwBeginTurn implements IS_McwBeginTurn {

            /**
             * Constructs a new S_McwBeginTurn.
             * @param [properties] Properties to set
             */
            constructor(properties?: IS_McwBeginTurn);

            /** S_McwBeginTurn errorCode. */
            public errorCode: number;

            /** S_McwBeginTurn warId. */
            public warId: number;

            /** S_McwBeginTurn actionId. */
            public actionId: number;

            /** S_McwBeginTurn remainingFund. */
            public remainingFund: number;

            /** S_McwBeginTurn isDefeated. */
            public isDefeated: boolean;

            /** S_McwBeginTurn repairDataByTile. */
            public repairDataByTile: IMcwRepairData[];

            /** S_McwBeginTurn repairDataByUnit. */
            public repairDataByUnit: IMcwRepairData[];

            /**
             * Creates a new S_McwBeginTurn instance using the specified properties.
             * @param [properties] Properties to set
             * @returns S_McwBeginTurn instance
             */
            public static create(properties?: IS_McwBeginTurn): S_McwBeginTurn;

            /**
             * Encodes the specified S_McwBeginTurn message. Does not implicitly {@link S_McwBeginTurn.verify|verify} messages.
             * @param message S_McwBeginTurn message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IS_McwBeginTurn, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified S_McwBeginTurn message, length delimited. Does not implicitly {@link S_McwBeginTurn.verify|verify} messages.
             * @param message S_McwBeginTurn message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IS_McwBeginTurn, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a S_McwBeginTurn message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns S_McwBeginTurn
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): S_McwBeginTurn;

            /**
             * Decodes a S_McwBeginTurn message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns S_McwBeginTurn
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): S_McwBeginTurn;

            /**
             * Verifies a S_McwBeginTurn message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a S_McwBeginTurn message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns S_McwBeginTurn
             */
            public static fromObject(object: { [k: string]: any }): S_McwBeginTurn;

            /**
             * Creates a plain object from a S_McwBeginTurn message. Also converts values to other types if specified.
             * @param message S_McwBeginTurn
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: S_McwBeginTurn, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this S_McwBeginTurn to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a C_McwEndTurn. */
        export declare interface IC_McwEndTurn {

            /** C_McwEndTurn warId */
            warId?: (number | null);
        }

        /** Represents a C_McwEndTurn. */
        export declare class C_McwEndTurn implements IC_McwEndTurn {

            /**
             * Constructs a new C_McwEndTurn.
             * @param [properties] Properties to set
             */
            constructor(properties?: IC_McwEndTurn);

            /** C_McwEndTurn warId. */
            public warId: number;

            /**
             * Creates a new C_McwEndTurn instance using the specified properties.
             * @param [properties] Properties to set
             * @returns C_McwEndTurn instance
             */
            public static create(properties?: IC_McwEndTurn): C_McwEndTurn;

            /**
             * Encodes the specified C_McwEndTurn message. Does not implicitly {@link C_McwEndTurn.verify|verify} messages.
             * @param message C_McwEndTurn message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IC_McwEndTurn, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified C_McwEndTurn message, length delimited. Does not implicitly {@link C_McwEndTurn.verify|verify} messages.
             * @param message C_McwEndTurn message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IC_McwEndTurn, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a C_McwEndTurn message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns C_McwEndTurn
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): C_McwEndTurn;

            /**
             * Decodes a C_McwEndTurn message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns C_McwEndTurn
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): C_McwEndTurn;

            /**
             * Verifies a C_McwEndTurn message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a C_McwEndTurn message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns C_McwEndTurn
             */
            public static fromObject(object: { [k: string]: any }): C_McwEndTurn;

            /**
             * Creates a plain object from a C_McwEndTurn message. Also converts values to other types if specified.
             * @param message C_McwEndTurn
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: C_McwEndTurn, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this C_McwEndTurn to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a S_McwEndTurn. */
        export declare interface IS_McwEndTurn {

            /** S_McwEndTurn errorCode */
            errorCode?: (number | null);

            /** S_McwEndTurn warId */
            warId?: (number | null);

            /** S_McwEndTurn actionId */
            actionId?: (number | null);
        }

        /** Represents a S_McwEndTurn. */
        export declare class S_McwEndTurn implements IS_McwEndTurn {

            /**
             * Constructs a new S_McwEndTurn.
             * @param [properties] Properties to set
             */
            constructor(properties?: IS_McwEndTurn);

            /** S_McwEndTurn errorCode. */
            public errorCode: number;

            /** S_McwEndTurn warId. */
            public warId: number;

            /** S_McwEndTurn actionId. */
            public actionId: number;

            /**
             * Creates a new S_McwEndTurn instance using the specified properties.
             * @param [properties] Properties to set
             * @returns S_McwEndTurn instance
             */
            public static create(properties?: IS_McwEndTurn): S_McwEndTurn;

            /**
             * Encodes the specified S_McwEndTurn message. Does not implicitly {@link S_McwEndTurn.verify|verify} messages.
             * @param message S_McwEndTurn message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IS_McwEndTurn, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified S_McwEndTurn message, length delimited. Does not implicitly {@link S_McwEndTurn.verify|verify} messages.
             * @param message S_McwEndTurn message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IS_McwEndTurn, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a S_McwEndTurn message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns S_McwEndTurn
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): S_McwEndTurn;

            /**
             * Decodes a S_McwEndTurn message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns S_McwEndTurn
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): S_McwEndTurn;

            /**
             * Verifies a S_McwEndTurn message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a S_McwEndTurn message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns S_McwEndTurn
             */
            public static fromObject(object: { [k: string]: any }): S_McwEndTurn;

            /**
             * Creates a plain object from a S_McwEndTurn message. Also converts values to other types if specified.
             * @param message S_McwEndTurn
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: S_McwEndTurn, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this S_McwEndTurn to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }
}
