
namespace Utility {
    export namespace ProtoTypes {
        /** Properties of an InstantialTile. */
        export declare interface IInstantialTile {

            /** InstantialTile currentHp */
            currentHp?: (number | null);

            /** InstantialTile currentBuildPoint */
            currentBuildPoint?: (number | null);

            /** InstantialTile currentCapturePoint */
            currentCapturePoint?: (number | null);
        }

        /** Represents an InstantialTile. */
        export declare class InstantialTile implements IInstantialTile {

            /**
             * Constructs a new InstantialTile.
             * @param [properties] Properties to set
             */
            constructor(properties?: IInstantialTile);

            /** InstantialTile currentHp. */
            public currentHp: number;

            /** InstantialTile currentBuildPoint. */
            public currentBuildPoint: number;

            /** InstantialTile currentCapturePoint. */
            public currentCapturePoint: number;

            /**
             * Creates a new InstantialTile instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InstantialTile instance
             */
            public static create(properties?: IInstantialTile): InstantialTile;

            /**
             * Encodes the specified InstantialTile message. Does not implicitly {@link InstantialTile.verify|verify} messages.
             * @param message InstantialTile message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IInstantialTile, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified InstantialTile message, length delimited. Does not implicitly {@link InstantialTile.verify|verify} messages.
             * @param message InstantialTile message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IInstantialTile, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes an InstantialTile message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InstantialTile
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): InstantialTile;

            /**
             * Decodes an InstantialTile message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InstantialTile
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): InstantialTile;

            /**
             * Verifies an InstantialTile message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates an InstantialTile message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns InstantialTile
             */
            public static fromObject(object: { [k: string]: any }): InstantialTile;

            /**
             * Creates a plain object from an InstantialTile message. Also converts values to other types if specified.
             * @param message InstantialTile
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: InstantialTile, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this InstantialTile to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a SerializedTile. */
        export declare interface ISerializedTile {

            /** SerializedTile gridX */
            gridX?: (number | null);

            /** SerializedTile gridY */
            gridY?: (number | null);

            /** SerializedTile baseViewId */
            baseViewId?: (number | null);

            /** SerializedTile objectViewId */
            objectViewId?: (number | null);

            /** SerializedTile instantialData */
            instantialData?: (IInstantialTile | null);
        }

        /** Represents a SerializedTile. */
        export declare class SerializedTile implements ISerializedTile {

            /**
             * Constructs a new SerializedTile.
             * @param [properties] Properties to set
             */
            constructor(properties?: ISerializedTile);

            /** SerializedTile gridX. */
            public gridX: number;

            /** SerializedTile gridY. */
            public gridY: number;

            /** SerializedTile baseViewId. */
            public baseViewId: number;

            /** SerializedTile objectViewId. */
            public objectViewId: number;

            /** SerializedTile instantialData. */
            public instantialData?: (IInstantialTile | null);

            /**
             * Creates a new SerializedTile instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SerializedTile instance
             */
            public static create(properties?: ISerializedTile): SerializedTile;

            /**
             * Encodes the specified SerializedTile message. Does not implicitly {@link SerializedTile.verify|verify} messages.
             * @param message SerializedTile message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: ISerializedTile, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified SerializedTile message, length delimited. Does not implicitly {@link SerializedTile.verify|verify} messages.
             * @param message SerializedTile message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: ISerializedTile, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a SerializedTile message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SerializedTile
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): SerializedTile;

            /**
             * Decodes a SerializedTile message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SerializedTile
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): SerializedTile;

            /**
             * Verifies a SerializedTile message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a SerializedTile message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SerializedTile
             */
            public static fromObject(object: { [k: string]: any }): SerializedTile;

            /**
             * Creates a plain object from a SerializedTile message. Also converts values to other types if specified.
             * @param message SerializedTile
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: SerializedTile, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SerializedTile to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a MapInfo. */
        export declare interface IMapInfo {

            /** MapInfo mapName */
            mapName?: (string | null);

            /** MapInfo designer */
            designer?: (string | null);

            /** MapInfo version */
            version?: (number | null);

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

            /** MapInfo designer. */
            public designer: string;

            /** MapInfo version. */
            public version: number;

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

            /** Container C_CreateCustomOnlineWar */
            C_CreateCustomOnlineWar?: (IC_CreateCustomOnlineWar | null);

            /** Container S_CreateCustomOnlineWar */
            S_CreateCustomOnlineWar?: (IS_CreateCustomOnlineWar | null);
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

            /** Container C_CreateCustomOnlineWar. */
            public C_CreateCustomOnlineWar?: (IC_CreateCustomOnlineWar | null);

            /** Container S_CreateCustomOnlineWar. */
            public S_CreateCustomOnlineWar?: (IS_CreateCustomOnlineWar | null);

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

            /** C_GetNewestMapInfos designer */
            designer?: (string | null);

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

            /** C_GetNewestMapInfos designer. */
            public designer: string;

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

        /** Properties of a C_CreateCustomOnlineWar. */
        export declare interface IC_CreateCustomOnlineWar {

            /** C_CreateCustomOnlineWar actionCode */
            actionCode?: (number | null);

            /** C_CreateCustomOnlineWar mapName */
            mapName?: (string | null);

            /** C_CreateCustomOnlineWar designer */
            designer?: (string | null);

            /** C_CreateCustomOnlineWar version */
            version?: (number | null);

            /** C_CreateCustomOnlineWar warName */
            warName?: (string | null);

            /** C_CreateCustomOnlineWar warPassword */
            warPassword?: (string | null);

            /** C_CreateCustomOnlineWar warComment */
            warComment?: (string | null);

            /** C_CreateCustomOnlineWar playerIndex */
            playerIndex?: (number | null);

            /** C_CreateCustomOnlineWar teamIndex */
            teamIndex?: (number | null);

            /** C_CreateCustomOnlineWar hasFog */
            hasFog?: (boolean | null);

            /** C_CreateCustomOnlineWar timeLimit */
            timeLimit?: (number | null);

            /** C_CreateCustomOnlineWar initialFund */
            initialFund?: (number | null);

            /** C_CreateCustomOnlineWar incomeModifier */
            incomeModifier?: (number | null);

            /** C_CreateCustomOnlineWar initialEnergy */
            initialEnergy?: (number | null);

            /** C_CreateCustomOnlineWar energyGrowthModifier */
            energyGrowthModifier?: (number | null);

            /** C_CreateCustomOnlineWar moveRangeModifier */
            moveRangeModifier?: (number | null);

            /** C_CreateCustomOnlineWar attackPowerModifier */
            attackPowerModifier?: (number | null);

            /** C_CreateCustomOnlineWar visionRangeModifier */
            visionRangeModifier?: (number | null);
        }

        /** Represents a C_CreateCustomOnlineWar. */
        export declare class C_CreateCustomOnlineWar implements IC_CreateCustomOnlineWar {

            /**
             * Constructs a new C_CreateCustomOnlineWar.
             * @param [properties] Properties to set
             */
            constructor(properties?: IC_CreateCustomOnlineWar);

            /** C_CreateCustomOnlineWar actionCode. */
            public actionCode: number;

            /** C_CreateCustomOnlineWar mapName. */
            public mapName: string;

            /** C_CreateCustomOnlineWar designer. */
            public designer: string;

            /** C_CreateCustomOnlineWar version. */
            public version: number;

            /** C_CreateCustomOnlineWar warName. */
            public warName: string;

            /** C_CreateCustomOnlineWar warPassword. */
            public warPassword: string;

            /** C_CreateCustomOnlineWar warComment. */
            public warComment: string;

            /** C_CreateCustomOnlineWar playerIndex. */
            public playerIndex: number;

            /** C_CreateCustomOnlineWar teamIndex. */
            public teamIndex: number;

            /** C_CreateCustomOnlineWar hasFog. */
            public hasFog: boolean;

            /** C_CreateCustomOnlineWar timeLimit. */
            public timeLimit: number;

            /** C_CreateCustomOnlineWar initialFund. */
            public initialFund: number;

            /** C_CreateCustomOnlineWar incomeModifier. */
            public incomeModifier: number;

            /** C_CreateCustomOnlineWar initialEnergy. */
            public initialEnergy: number;

            /** C_CreateCustomOnlineWar energyGrowthModifier. */
            public energyGrowthModifier: number;

            /** C_CreateCustomOnlineWar moveRangeModifier. */
            public moveRangeModifier: number;

            /** C_CreateCustomOnlineWar attackPowerModifier. */
            public attackPowerModifier: number;

            /** C_CreateCustomOnlineWar visionRangeModifier. */
            public visionRangeModifier: number;

            /**
             * Creates a new C_CreateCustomOnlineWar instance using the specified properties.
             * @param [properties] Properties to set
             * @returns C_CreateCustomOnlineWar instance
             */
            public static create(properties?: IC_CreateCustomOnlineWar): C_CreateCustomOnlineWar;

            /**
             * Encodes the specified C_CreateCustomOnlineWar message. Does not implicitly {@link C_CreateCustomOnlineWar.verify|verify} messages.
             * @param message C_CreateCustomOnlineWar message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IC_CreateCustomOnlineWar, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified C_CreateCustomOnlineWar message, length delimited. Does not implicitly {@link C_CreateCustomOnlineWar.verify|verify} messages.
             * @param message C_CreateCustomOnlineWar message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IC_CreateCustomOnlineWar, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a C_CreateCustomOnlineWar message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns C_CreateCustomOnlineWar
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): C_CreateCustomOnlineWar;

            /**
             * Decodes a C_CreateCustomOnlineWar message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns C_CreateCustomOnlineWar
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): C_CreateCustomOnlineWar;

            /**
             * Verifies a C_CreateCustomOnlineWar message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a C_CreateCustomOnlineWar message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns C_CreateCustomOnlineWar
             */
            public static fromObject(object: { [k: string]: any }): C_CreateCustomOnlineWar;

            /**
             * Creates a plain object from a C_CreateCustomOnlineWar message. Also converts values to other types if specified.
             * @param message C_CreateCustomOnlineWar
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: C_CreateCustomOnlineWar, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this C_CreateCustomOnlineWar to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a S_CreateCustomOnlineWar. */
        export declare interface IS_CreateCustomOnlineWar {

            /** S_CreateCustomOnlineWar actionCode */
            actionCode?: (number | null);

            /** S_CreateCustomOnlineWar errorCode */
            errorCode?: (number | null);
        }

        /** Represents a S_CreateCustomOnlineWar. */
        export declare class S_CreateCustomOnlineWar implements IS_CreateCustomOnlineWar {

            /**
             * Constructs a new S_CreateCustomOnlineWar.
             * @param [properties] Properties to set
             */
            constructor(properties?: IS_CreateCustomOnlineWar);

            /** S_CreateCustomOnlineWar actionCode. */
            public actionCode: number;

            /** S_CreateCustomOnlineWar errorCode. */
            public errorCode: number;

            /**
             * Creates a new S_CreateCustomOnlineWar instance using the specified properties.
             * @param [properties] Properties to set
             * @returns S_CreateCustomOnlineWar instance
             */
            public static create(properties?: IS_CreateCustomOnlineWar): S_CreateCustomOnlineWar;

            /**
             * Encodes the specified S_CreateCustomOnlineWar message. Does not implicitly {@link S_CreateCustomOnlineWar.verify|verify} messages.
             * @param message S_CreateCustomOnlineWar message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IS_CreateCustomOnlineWar, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified S_CreateCustomOnlineWar message, length delimited. Does not implicitly {@link S_CreateCustomOnlineWar.verify|verify} messages.
             * @param message S_CreateCustomOnlineWar message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IS_CreateCustomOnlineWar, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes a S_CreateCustomOnlineWar message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns S_CreateCustomOnlineWar
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): S_CreateCustomOnlineWar;

            /**
             * Decodes a S_CreateCustomOnlineWar message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns S_CreateCustomOnlineWar
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): S_CreateCustomOnlineWar;

            /**
             * Verifies a S_CreateCustomOnlineWar message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates a S_CreateCustomOnlineWar message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns S_CreateCustomOnlineWar
             */
            public static fromObject(object: { [k: string]: any }): S_CreateCustomOnlineWar;

            /**
             * Creates a plain object from a S_CreateCustomOnlineWar message. Also converts values to other types if specified.
             * @param message S_CreateCustomOnlineWar
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: S_CreateCustomOnlineWar, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this S_CreateCustomOnlineWar to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }
}
