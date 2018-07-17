
namespace Network {
    export namespace Proto {

        /** Properties of an InstantialCompAttacker. */
        export declare interface IInstantialCompAttacker {

            /** InstantialCompAttacker primaryWeaponCurrentAmmo */
            primaryWeaponCurrentAmmo?: (number | null);
        }

        /** Represents an InstantialCompAttacker. */
        export declare class InstantialCompAttacker implements IInstantialCompAttacker {

            /**
             * Constructs a new InstantialCompAttacker.
             * @param [properties] Properties to set
             */
            constructor(properties?: IInstantialCompAttacker);

            /** InstantialCompAttacker primaryWeaponCurrentAmmo. */
            public primaryWeaponCurrentAmmo: number;

            /**
             * Creates a new InstantialCompAttacker instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InstantialCompAttacker instance
             */
            public static create(properties?: IInstantialCompAttacker): InstantialCompAttacker;

            /**
             * Encodes the specified InstantialCompAttacker message. Does not implicitly {@link InstantialCompAttacker.verify|verify} messages.
             * @param message InstantialCompAttacker message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IInstantialCompAttacker, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified InstantialCompAttacker message, length delimited. Does not implicitly {@link InstantialCompAttacker.verify|verify} messages.
             * @param message InstantialCompAttacker message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IInstantialCompAttacker, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes an InstantialCompAttacker message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InstantialCompAttacker
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): InstantialCompAttacker;

            /**
             * Decodes an InstantialCompAttacker message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InstantialCompAttacker
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): InstantialCompAttacker;

            /**
             * Verifies an InstantialCompAttacker message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates an InstantialCompAttacker message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns InstantialCompAttacker
             */
            public static fromObject(object: { [k: string]: any }): InstantialCompAttacker;

            /**
             * Creates a plain object from an InstantialCompAttacker message. Also converts values to other types if specified.
             * @param message InstantialCompAttacker
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: InstantialCompAttacker, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this InstantialCompAttacker to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an InstantialCompAttackable. */
        export declare interface IInstantialCompAttackable {

            /** InstantialCompAttackable currentHp */
            currentHp?: (number | null);
        }

        /** Represents an InstantialCompAttackable. */
        export declare class InstantialCompAttackable implements IInstantialCompAttackable {

            /**
             * Constructs a new InstantialCompAttackable.
             * @param [properties] Properties to set
             */
            constructor(properties?: IInstantialCompAttackable);

            /** InstantialCompAttackable currentHp. */
            public currentHp: number;

            /**
             * Creates a new InstantialCompAttackable instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InstantialCompAttackable instance
             */
            public static create(properties?: IInstantialCompAttackable): InstantialCompAttackable;

            /**
             * Encodes the specified InstantialCompAttackable message. Does not implicitly {@link InstantialCompAttackable.verify|verify} messages.
             * @param message InstantialCompAttackable message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IInstantialCompAttackable, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified InstantialCompAttackable message, length delimited. Does not implicitly {@link InstantialCompAttackable.verify|verify} messages.
             * @param message InstantialCompAttackable message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IInstantialCompAttackable, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes an InstantialCompAttackable message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InstantialCompAttackable
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): InstantialCompAttackable;

            /**
             * Decodes an InstantialCompAttackable message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InstantialCompAttackable
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): InstantialCompAttackable;

            /**
             * Verifies an InstantialCompAttackable message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates an InstantialCompAttackable message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns InstantialCompAttackable
             */
            public static fromObject(object: { [k: string]: any }): InstantialCompAttackable;

            /**
             * Creates a plain object from an InstantialCompAttackable message. Also converts values to other types if specified.
             * @param message InstantialCompAttackable
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: InstantialCompAttackable, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this InstantialCompAttackable to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an InstantialCompBuilder. */
        export declare interface IInstantialCompBuilder {

            /** InstantialCompBuilder isBuilding */
            isBuilding?: (boolean | null);

            /** InstantialCompBuilder currentMaterial */
            currentMaterial?: (number | null);
        }

        /** Represents an InstantialCompBuilder. */
        export declare class InstantialCompBuilder implements IInstantialCompBuilder {

            /**
             * Constructs a new InstantialCompBuilder.
             * @param [properties] Properties to set
             */
            constructor(properties?: IInstantialCompBuilder);

            /** InstantialCompBuilder isBuilding. */
            public isBuilding: boolean;

            /** InstantialCompBuilder currentMaterial. */
            public currentMaterial: number;

            /**
             * Creates a new InstantialCompBuilder instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InstantialCompBuilder instance
             */
            public static create(properties?: IInstantialCompBuilder): InstantialCompBuilder;

            /**
             * Encodes the specified InstantialCompBuilder message. Does not implicitly {@link InstantialCompBuilder.verify|verify} messages.
             * @param message InstantialCompBuilder message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IInstantialCompBuilder, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified InstantialCompBuilder message, length delimited. Does not implicitly {@link InstantialCompBuilder.verify|verify} messages.
             * @param message InstantialCompBuilder message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IInstantialCompBuilder, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes an InstantialCompBuilder message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InstantialCompBuilder
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): InstantialCompBuilder;

            /**
             * Decodes an InstantialCompBuilder message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InstantialCompBuilder
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): InstantialCompBuilder;

            /**
             * Verifies an InstantialCompBuilder message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates an InstantialCompBuilder message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns InstantialCompBuilder
             */
            public static fromObject(object: { [k: string]: any }): InstantialCompBuilder;

            /**
             * Creates a plain object from an InstantialCompBuilder message. Also converts values to other types if specified.
             * @param message InstantialCompBuilder
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: InstantialCompBuilder, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this InstantialCompBuilder to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an InstantialCompBuildable. */
        export declare interface IInstantialCompBuildable {

            /** InstantialCompBuildable currentBuildPoint */
            currentBuildPoint?: (number | null);
        }

        /** Represents an InstantialCompBuildable. */
        export declare class InstantialCompBuildable implements IInstantialCompBuildable {

            /**
             * Constructs a new InstantialCompBuildable.
             * @param [properties] Properties to set
             */
            constructor(properties?: IInstantialCompBuildable);

            /** InstantialCompBuildable currentBuildPoint. */
            public currentBuildPoint: number;

            /**
             * Creates a new InstantialCompBuildable instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InstantialCompBuildable instance
             */
            public static create(properties?: IInstantialCompBuildable): InstantialCompBuildable;

            /**
             * Encodes the specified InstantialCompBuildable message. Does not implicitly {@link InstantialCompBuildable.verify|verify} messages.
             * @param message InstantialCompBuildable message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IInstantialCompBuildable, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified InstantialCompBuildable message, length delimited. Does not implicitly {@link InstantialCompBuildable.verify|verify} messages.
             * @param message InstantialCompBuildable message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IInstantialCompBuildable, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes an InstantialCompBuildable message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InstantialCompBuildable
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): InstantialCompBuildable;

            /**
             * Decodes an InstantialCompBuildable message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InstantialCompBuildable
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): InstantialCompBuildable;

            /**
             * Verifies an InstantialCompBuildable message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates an InstantialCompBuildable message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns InstantialCompBuildable
             */
            public static fromObject(object: { [k: string]: any }): InstantialCompBuildable;

            /**
             * Creates a plain object from an InstantialCompBuildable message. Also converts values to other types if specified.
             * @param message InstantialCompBuildable
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: InstantialCompBuildable, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this InstantialCompBuildable to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an InstantialCompCapturer. */
        export declare interface IInstantialCompCapturer {

            /** InstantialCompCapturer isCapturing */
            isCapturing?: (boolean | null);
        }

        /** Represents an InstantialCompCapturer. */
        export declare class InstantialCompCapturer implements IInstantialCompCapturer {

            /**
             * Constructs a new InstantialCompCapturer.
             * @param [properties] Properties to set
             */
            constructor(properties?: IInstantialCompCapturer);

            /** InstantialCompCapturer isCapturing. */
            public isCapturing: boolean;

            /**
             * Creates a new InstantialCompCapturer instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InstantialCompCapturer instance
             */
            public static create(properties?: IInstantialCompCapturer): InstantialCompCapturer;

            /**
             * Encodes the specified InstantialCompCapturer message. Does not implicitly {@link InstantialCompCapturer.verify|verify} messages.
             * @param message InstantialCompCapturer message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IInstantialCompCapturer, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified InstantialCompCapturer message, length delimited. Does not implicitly {@link InstantialCompCapturer.verify|verify} messages.
             * @param message InstantialCompCapturer message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IInstantialCompCapturer, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes an InstantialCompCapturer message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InstantialCompCapturer
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): InstantialCompCapturer;

            /**
             * Decodes an InstantialCompCapturer message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InstantialCompCapturer
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): InstantialCompCapturer;

            /**
             * Verifies an InstantialCompCapturer message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates an InstantialCompCapturer message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns InstantialCompCapturer
             */
            public static fromObject(object: { [k: string]: any }): InstantialCompCapturer;

            /**
             * Creates a plain object from an InstantialCompCapturer message. Also converts values to other types if specified.
             * @param message InstantialCompCapturer
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: InstantialCompCapturer, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this InstantialCompCapturer to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an InstantialCompCapturable. */
        export declare interface IInstantialCompCapturable {

            /** InstantialCompCapturable currentCapturePoint */
            currentCapturePoint?: (number | null);
        }

        /** Represents an InstantialCompCapturable. */
        export declare class InstantialCompCapturable implements IInstantialCompCapturable {

            /**
             * Constructs a new InstantialCompCapturable.
             * @param [properties] Properties to set
             */
            constructor(properties?: IInstantialCompCapturable);

            /** InstantialCompCapturable currentCapturePoint. */
            public currentCapturePoint: number;

            /**
             * Creates a new InstantialCompCapturable instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InstantialCompCapturable instance
             */
            public static create(properties?: IInstantialCompCapturable): InstantialCompCapturable;

            /**
             * Encodes the specified InstantialCompCapturable message. Does not implicitly {@link InstantialCompCapturable.verify|verify} messages.
             * @param message InstantialCompCapturable message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IInstantialCompCapturable, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified InstantialCompCapturable message, length delimited. Does not implicitly {@link InstantialCompCapturable.verify|verify} messages.
             * @param message InstantialCompCapturable message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IInstantialCompCapturable, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes an InstantialCompCapturable message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InstantialCompCapturable
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): InstantialCompCapturable;

            /**
             * Decodes an InstantialCompCapturable message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InstantialCompCapturable
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): InstantialCompCapturable;

            /**
             * Verifies an InstantialCompCapturable message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates an InstantialCompCapturable message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns InstantialCompCapturable
             */
            public static fromObject(object: { [k: string]: any }): InstantialCompCapturable;

            /**
             * Creates a plain object from an InstantialCompCapturable message. Also converts values to other types if specified.
             * @param message InstantialCompCapturable
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: InstantialCompCapturable, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this InstantialCompCapturable to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an InstantialCompDiver. */
        export declare interface IInstantialCompDiver {

            /** InstantialCompDiver isDiving */
            isDiving?: (boolean | null);
        }

        /** Represents an InstantialCompDiver. */
        export declare class InstantialCompDiver implements IInstantialCompDiver {

            /**
             * Constructs a new InstantialCompDiver.
             * @param [properties] Properties to set
             */
            constructor(properties?: IInstantialCompDiver);

            /** InstantialCompDiver isDiving. */
            public isDiving: boolean;

            /**
             * Creates a new InstantialCompDiver instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InstantialCompDiver instance
             */
            public static create(properties?: IInstantialCompDiver): InstantialCompDiver;

            /**
             * Encodes the specified InstantialCompDiver message. Does not implicitly {@link InstantialCompDiver.verify|verify} messages.
             * @param message InstantialCompDiver message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IInstantialCompDiver, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified InstantialCompDiver message, length delimited. Does not implicitly {@link InstantialCompDiver.verify|verify} messages.
             * @param message InstantialCompDiver message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IInstantialCompDiver, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes an InstantialCompDiver message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InstantialCompDiver
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): InstantialCompDiver;

            /**
             * Decodes an InstantialCompDiver message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InstantialCompDiver
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): InstantialCompDiver;

            /**
             * Verifies an InstantialCompDiver message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates an InstantialCompDiver message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns InstantialCompDiver
             */
            public static fromObject(object: { [k: string]: any }): InstantialCompDiver;

            /**
             * Creates a plain object from an InstantialCompDiver message. Also converts values to other types if specified.
             * @param message InstantialCompDiver
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: InstantialCompDiver, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this InstantialCompDiver to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an InstantialCompFlareLauncher. */
        export declare interface IInstantialCompFlareLauncher {

            /** InstantialCompFlareLauncher currentAmmo */
            currentAmmo?: (number | null);
        }

        /** Represents an InstantialCompFlareLauncher. */
        export declare class InstantialCompFlareLauncher implements IInstantialCompFlareLauncher {

            /**
             * Constructs a new InstantialCompFlareLauncher.
             * @param [properties] Properties to set
             */
            constructor(properties?: IInstantialCompFlareLauncher);

            /** InstantialCompFlareLauncher currentAmmo. */
            public currentAmmo: number;

            /**
             * Creates a new InstantialCompFlareLauncher instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InstantialCompFlareLauncher instance
             */
            public static create(properties?: IInstantialCompFlareLauncher): InstantialCompFlareLauncher;

            /**
             * Encodes the specified InstantialCompFlareLauncher message. Does not implicitly {@link InstantialCompFlareLauncher.verify|verify} messages.
             * @param message InstantialCompFlareLauncher message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IInstantialCompFlareLauncher, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified InstantialCompFlareLauncher message, length delimited. Does not implicitly {@link InstantialCompFlareLauncher.verify|verify} messages.
             * @param message InstantialCompFlareLauncher message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IInstantialCompFlareLauncher, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes an InstantialCompFlareLauncher message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InstantialCompFlareLauncher
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): InstantialCompFlareLauncher;

            /**
             * Decodes an InstantialCompFlareLauncher message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InstantialCompFlareLauncher
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): InstantialCompFlareLauncher;

            /**
             * Verifies an InstantialCompFlareLauncher message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates an InstantialCompFlareLauncher message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns InstantialCompFlareLauncher
             */
            public static fromObject(object: { [k: string]: any }): InstantialCompFlareLauncher;

            /**
             * Creates a plain object from an InstantialCompFlareLauncher message. Also converts values to other types if specified.
             * @param message InstantialCompFlareLauncher
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: InstantialCompFlareLauncher, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this InstantialCompFlareLauncher to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an InstantialCompMovable. */
        export declare interface IInstantialCompMovable {

            /** InstantialCompMovable currentFuel */
            currentFuel?: (number | null);
        }

        /** Represents an InstantialCompMovable. */
        export declare class InstantialCompMovable implements IInstantialCompMovable {

            /**
             * Constructs a new InstantialCompMovable.
             * @param [properties] Properties to set
             */
            constructor(properties?: IInstantialCompMovable);

            /** InstantialCompMovable currentFuel. */
            public currentFuel: number;

            /**
             * Creates a new InstantialCompMovable instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InstantialCompMovable instance
             */
            public static create(properties?: IInstantialCompMovable): InstantialCompMovable;

            /**
             * Encodes the specified InstantialCompMovable message. Does not implicitly {@link InstantialCompMovable.verify|verify} messages.
             * @param message InstantialCompMovable message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IInstantialCompMovable, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified InstantialCompMovable message, length delimited. Does not implicitly {@link InstantialCompMovable.verify|verify} messages.
             * @param message InstantialCompMovable message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IInstantialCompMovable, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes an InstantialCompMovable message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InstantialCompMovable
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): InstantialCompMovable;

            /**
             * Decodes an InstantialCompMovable message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InstantialCompMovable
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): InstantialCompMovable;

            /**
             * Verifies an InstantialCompMovable message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates an InstantialCompMovable message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns InstantialCompMovable
             */
            public static fromObject(object: { [k: string]: any }): InstantialCompMovable;

            /**
             * Creates a plain object from an InstantialCompMovable message. Also converts values to other types if specified.
             * @param message InstantialCompMovable
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: InstantialCompMovable, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this InstantialCompMovable to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an InstantialCompGridIndexable. */
        export declare interface IInstantialCompGridIndexable {

            /** InstantialCompGridIndexable x */
            x?: (number | null);

            /** InstantialCompGridIndexable y */
            y?: (number | null);
        }

        /** Represents an InstantialCompGridIndexable. */
        export declare class InstantialCompGridIndexable implements IInstantialCompGridIndexable {

            /**
             * Constructs a new InstantialCompGridIndexable.
             * @param [properties] Properties to set
             */
            constructor(properties?: IInstantialCompGridIndexable);

            /** InstantialCompGridIndexable x. */
            public x: number;

            /** InstantialCompGridIndexable y. */
            public y: number;

            /**
             * Creates a new InstantialCompGridIndexable instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InstantialCompGridIndexable instance
             */
            public static create(properties?: IInstantialCompGridIndexable): InstantialCompGridIndexable;

            /**
             * Encodes the specified InstantialCompGridIndexable message. Does not implicitly {@link InstantialCompGridIndexable.verify|verify} messages.
             * @param message InstantialCompGridIndexable message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IInstantialCompGridIndexable, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified InstantialCompGridIndexable message, length delimited. Does not implicitly {@link InstantialCompGridIndexable.verify|verify} messages.
             * @param message InstantialCompGridIndexable message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IInstantialCompGridIndexable, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes an InstantialCompGridIndexable message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InstantialCompGridIndexable
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): InstantialCompGridIndexable;

            /**
             * Decodes an InstantialCompGridIndexable message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InstantialCompGridIndexable
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): InstantialCompGridIndexable;

            /**
             * Verifies an InstantialCompGridIndexable message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates an InstantialCompGridIndexable message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns InstantialCompGridIndexable
             */
            public static fromObject(object: { [k: string]: any }): InstantialCompGridIndexable;

            /**
             * Creates a plain object from an InstantialCompGridIndexable message. Also converts values to other types if specified.
             * @param message InstantialCompGridIndexable
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: InstantialCompGridIndexable, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this InstantialCompGridIndexable to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an InstantialCompPromotable. */
        export declare interface IInstantialCompPromotable {

            /** InstantialCompPromotable currentPromotion */
            currentPromotion?: (number | null);
        }

        /** Represents an InstantialCompPromotable. */
        export declare class InstantialCompPromotable implements IInstantialCompPromotable {

            /**
             * Constructs a new InstantialCompPromotable.
             * @param [properties] Properties to set
             */
            constructor(properties?: IInstantialCompPromotable);

            /** InstantialCompPromotable currentPromotion. */
            public currentPromotion: number;

            /**
             * Creates a new InstantialCompPromotable instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InstantialCompPromotable instance
             */
            public static create(properties?: IInstantialCompPromotable): InstantialCompPromotable;

            /**
             * Encodes the specified InstantialCompPromotable message. Does not implicitly {@link InstantialCompPromotable.verify|verify} messages.
             * @param message InstantialCompPromotable message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IInstantialCompPromotable, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified InstantialCompPromotable message, length delimited. Does not implicitly {@link InstantialCompPromotable.verify|verify} messages.
             * @param message InstantialCompPromotable message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IInstantialCompPromotable, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes an InstantialCompPromotable message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InstantialCompPromotable
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): InstantialCompPromotable;

            /**
             * Decodes an InstantialCompPromotable message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InstantialCompPromotable
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): InstantialCompPromotable;

            /**
             * Verifies an InstantialCompPromotable message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates an InstantialCompPromotable message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns InstantialCompPromotable
             */
            public static fromObject(object: { [k: string]: any }): InstantialCompPromotable;

            /**
             * Creates a plain object from an InstantialCompPromotable message. Also converts values to other types if specified.
             * @param message InstantialCompPromotable
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: InstantialCompPromotable, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this InstantialCompPromotable to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an InstantialCompProducer. */
        export declare interface IInstantialCompProducer {

            /** InstantialCompProducer currentMaterial */
            currentMaterial?: (number | null);
        }

        /** Represents an InstantialCompProducer. */
        export declare class InstantialCompProducer implements IInstantialCompProducer {

            /**
             * Constructs a new InstantialCompProducer.
             * @param [properties] Properties to set
             */
            constructor(properties?: IInstantialCompProducer);

            /** InstantialCompProducer currentMaterial. */
            public currentMaterial: number;

            /**
             * Creates a new InstantialCompProducer instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InstantialCompProducer instance
             */
            public static create(properties?: IInstantialCompProducer): InstantialCompProducer;

            /**
             * Encodes the specified InstantialCompProducer message. Does not implicitly {@link InstantialCompProducer.verify|verify} messages.
             * @param message InstantialCompProducer message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IInstantialCompProducer, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified InstantialCompProducer message, length delimited. Does not implicitly {@link InstantialCompProducer.verify|verify} messages.
             * @param message InstantialCompProducer message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IInstantialCompProducer, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes an InstantialCompProducer message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InstantialCompProducer
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): InstantialCompProducer;

            /**
             * Decodes an InstantialCompProducer message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InstantialCompProducer
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): InstantialCompProducer;

            /**
             * Verifies an InstantialCompProducer message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates an InstantialCompProducer message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns InstantialCompProducer
             */
            public static fromObject(object: { [k: string]: any }): InstantialCompProducer;

            /**
             * Creates a plain object from an InstantialCompProducer message. Also converts values to other types if specified.
             * @param message InstantialCompProducer
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: InstantialCompProducer, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this InstantialCompProducer to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an InstantialCompLoader. */
        export declare interface IInstantialCompLoader {

            /** InstantialCompLoader loadedUnitIds */
            loadedUnitIds?: (number[] | null);
        }

        /** Represents an InstantialCompLoader. */
        export declare class InstantialCompLoader implements IInstantialCompLoader {

            /**
             * Constructs a new InstantialCompLoader.
             * @param [properties] Properties to set
             */
            constructor(properties?: IInstantialCompLoader);

            /** InstantialCompLoader loadedUnitIds. */
            public loadedUnitIds: number[];

            /**
             * Creates a new InstantialCompLoader instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InstantialCompLoader instance
             */
            public static create(properties?: IInstantialCompLoader): InstantialCompLoader;

            /**
             * Encodes the specified InstantialCompLoader message. Does not implicitly {@link InstantialCompLoader.verify|verify} messages.
             * @param message InstantialCompLoader message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: IInstantialCompLoader, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Encodes the specified InstantialCompLoader message, length delimited. Does not implicitly {@link InstantialCompLoader.verify|verify} messages.
             * @param message InstantialCompLoader message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: IInstantialCompLoader, writer?: protobuf.Writer): protobuf.Writer;

            /**
             * Decodes an InstantialCompLoader message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InstantialCompLoader
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: (protobuf.Reader | Uint8Array), length?: number): InstantialCompLoader;

            /**
             * Decodes an InstantialCompLoader message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InstantialCompLoader
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: (protobuf.Reader | Uint8Array)): InstantialCompLoader;

            /**
             * Verifies an InstantialCompLoader message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string | null);

            /**
             * Creates an InstantialCompLoader message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns InstantialCompLoader
             */
            public static fromObject(object: { [k: string]: any }): InstantialCompLoader;

            /**
             * Creates a plain object from an InstantialCompLoader message. Also converts values to other types if specified.
             * @param message InstantialCompLoader
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: InstantialCompLoader, options?: protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this InstantialCompLoader to JSON.
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
    }
}
