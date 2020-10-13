import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import pkg from './package.json';
import { terser } from "rollup-plugin-terser";
import json from '@rollup/plugin-json';

export default {
    input: 'src/index.ts', // our source file
    output: [
        {
            file: pkg.browser,
            format: 'iife',
            name: 'foocart', // the global which can be used in a browser
        }
    ],
    plugins: [
        nodeResolve(),
        commonjs({
            include: [ "node_modules/**" ],
            ignoreGlobal: false
        }),
        typescript({
            clean: true,
            typescript: require('typescript'),
            tsconfig: './dist.tsconfig.json'
        }),
        json(),
        terser() // minifies generated bundles
    ]
};
