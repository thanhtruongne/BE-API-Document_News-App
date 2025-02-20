import { I18n } from 'i18n';
import path from 'path';
import { fileURLToPath } from 'url';
const anyObject = {}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const i18n = new I18n({
    locales: ['en', 'vi'],
    fallbackLanguage: 'en',
    fallbacks: {
        'en-nz': 'en',
        'vi-vi': 'vi'
    },
    defaultLocale: 'vi',
    retryInDefaultLocale: false,
    cookie: 'lang',
    header: 'accept-language',
    queryParameter: 'lang',
    directoryPermissions: '755',
    autoReload: true,
    updateFiles: false,
    syncFiles: false,
    indent: '\t',
    extension: '.json',
    prefix: '',
    objectNotation: false,
    logDebugFn: (msg) => console.log('debug', msg),
    logWarnFn: (msg) => console.log('warn', msg),
    logErrorFn: (msg) => console.log('error', msg),
    missingKeyFn: (locale, value) => value,
    register: {},
    api: {
        __: 't',
        __n: 'tn'
    },
    preserveLegacyCase: true,
    mustacheConfig: {
        tags: ['{{', '}}'],
        disable: false
    },
    parser: JSON,
    directory: path.join(__dirname, 'locales')
});

i18n.translate = (key, ...args) => {
    return i18n.__.call(i18n, key, ...args);
};

export default i18n;