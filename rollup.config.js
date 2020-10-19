import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import styles from "rollup-plugin-styles";

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/index.js',
            format: 'iife',
            name: 'foocart'
        }
    ],
    inlineDynamicImports: true,
    plugins: [
        resolve({
            browser: true
        }),
        commonjs({
            include: [ 'node_modules/**' ],
            ignoreGlobal: false
        }),
        styles({
            modules: true
        }),
        typescript({
            clean: true,
            check: false,
            rollupCommonJSResolveHack: true,
            allowNonTsExtensions: true,
            typescript: require('typescript'),
            tsconfig: './dist.tsconfig.json'
        }),
        json(),
        terser()
    ]
};
