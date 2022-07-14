// @ts-nocheck

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Cookies {
    interface CookieAttributes {
        /**
         * Define when the cookie will be removed. Value can be a Number
         * which will be interpreted as days from time of creation or a
         * Date instance. If omitted, the cookie becomes a session cookie.
         */
        expires?: number | Date | undefined;

        /**
         * Define the path where the cookie is available. Defaults to '/'
         */
        path?: string | undefined;

        /**
         * Define the domain where the cookie is available. Defaults to
         * the domain of the page where the cookie was created.
         */
        domain?: string | undefined;

        /**
         * A Boolean indicating if the cookie transmission requires a
         * secure protocol (https). Defaults to false.
         */
        secure?: boolean | undefined;

        /**
         * Asserts that a cookie must not be sent with cross-origin requests,
         * providing some protection against cross-site request forgery
         * attacks (CSRF)
         */
        sameSite?: 'strict' | 'Strict' | 'lax' | 'Lax' | 'none' | 'None' | undefined;

        /**
         * An attribute which will be serialized, conformably to RFC 6265
         * section 5.2.
         */
        [property: string]: any;
    }

    interface CookiesStatic<T = string> {
        readonly attributes: CookieAttributes;
        readonly converter: Required<Converter<string>>;
        /**
         * Create a cookie
         */
        set(name: string, value: string | T, options?: CookieAttributes): string | undefined;

        /**
         * Read cookie
         */
        get(name: string): string | T | undefined;

        /**
         * Read all available cookies
         */
        get(): { [key: string]: string };

        /**
         * Delete cookie
         */
        remove(name: string, options?: CookieAttributes): void;

        /**
         * Cookie attribute defaults can be set globally by creating an
         * instance of the api via withAttributes(), or individually for
         * each call to Cookies.set(...) by passing a plain object as the
         * last argument. Per-call attributes override the default attributes.
         */
        withAttributes(attributes: CookieAttributes): CookiesStatic<T>;

        /**
         * Create a new instance of the api that overrides the default
         * decoding implementation. All methods that rely in a proper
         * decoding to work, such as Cookies.remove() and Cookies.get(),
         * will run the converter first for each cookie. The returned
         * string will be used as the cookie value.
         */
        withConverter<TConv = string>(converter: Converter<TConv>): CookiesStatic<TConv>;
    }

    interface Converter<TConv> {
        write?: CookieWriteConverter<TConv> | undefined;
        read?: CookieReadConverter<TConv> | undefined;
    }

    type CookieWriteConverter<T> = (value: string | T, name: string) => string;
    type CookieReadConverter<T> = (value: string, name: string) => string | T;

    let cookiesManager: CookiesStatic | null = null;
    function getCookiesManager(): CookiesStatic {
        return cookiesManager ??= init(converter, { path: '/' });
    }

    export function setValue(key: string, value: string): void {
        getCookiesManager().set(key, value, { expires: 365 });
    }
    export function getInt(key: string): number | null {
        const value = getCookiesManager().get(key);
        if (value == null) {
            return null;
        } else {
            const i = parseInt(value);
            return isNaN(i) ? null : i;
        }
    }
    export function getFloat(key: string): number | null {
        const value = getCookiesManager().get(key);
        if (value == null) {
            return null;
        } else {
            const f = parseFloat(value);
            return isNaN(i) ? null : i;
        }
    }
    export function getString(key: string): string | null {
        return getCookiesManager().get(key) ?? null;
    }

    function init(converter, defaultAttributes) {
        function set(key, value, attributes) {
            if (typeof document === 'undefined') {
                return;
            }

            attributes = assign({}, defaultAttributes, attributes);

            if (typeof attributes.expires === 'number') {
                attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
            }
            if (attributes.expires) {
                attributes.expires = attributes.expires.toUTCString();
            }

            key = encodeURIComponent(key)
                .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
                .replace(/[()]/g, escape);

            let stringifiedAttributes = '';
            for (const attributeName in attributes) {
                if (!attributes[attributeName]) {
                    continue;
                }

                stringifiedAttributes += '; ' + attributeName;

                if (attributes[attributeName] === true) {
                    continue;
                }

                // Considers RFC 6265 section 5.2:
                // ...
                // 3.  If the remaining unparsed-attributes contains a %x3B (";")
                //     character:
                // Consume the characters of the unparsed-attributes up to,
                // not including, the first %x3B (";") character.
                // ...
                stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
            }

            return (document.cookie =
                key + '=' + converter.write(value, key) + stringifiedAttributes);
        }

        function get(key) {
            if (typeof document === 'undefined' || (arguments.length && !key)) {
                return;
            }

            // To prevent the for loop in the first place assign an empty array
            // in case there are no cookies at all.
            const cookies = document.cookie ? document.cookie.split('; ') : [];
            const jar = {};
            for (let i = 0; i < cookies.length; i++) {
                const parts = cookies[i].split('=');
                const value = parts.slice(1).join('=');

                try {
                    const foundKey = decodeURIComponent(parts[0]);
                    jar[foundKey] = converter.read(value, foundKey);

                    if (key === foundKey) {
                        break;
                    }
                } catch (e) {
                    //
                }
            }

            return key ? jar[key] : jar;
        }

        return Object.create(
            {
                set: set,
                get: get,
                remove: function (key, attributes) {
                    set(
                        key,
                        '',
                        assign({}, attributes, {
                            expires: -1
                        })
                    );
                },
                withAttributes: function (attributes) {
                    return init(this.converter, assign({}, this.attributes, attributes));
                },
                withConverter: function (converter) {
                    return init(assign({}, this.converter, converter), this.attributes);
                }
            },
            {
                attributes: { value: Object.freeze(defaultAttributes) },
                converter: { value: Object.freeze(converter) }
            }
        );
    }

    function assign(target) {
        for (let i = 1; i < arguments.length; i++) {
            const source = arguments[i];
            for (const key in source) {
                target[key] = source[key];
            }
        }
        return target;
    }

    const converter = {
        read: function (value) {
            if (value[0] === '"') {
                value = value.slice(1, -1);
            }
            return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
        },
        write: function (value) {
            return encodeURIComponent(value).replace(
                /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
                decodeURIComponent
            );
        }
    };
}
