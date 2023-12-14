// rollup.config.js
import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
export default {
  input: "index.ts",
  output: {
    dir: "output",
    format: "cjs",
  },
  plugins: [commonjs(), json(), nodeResolve(), typescript()],
};
