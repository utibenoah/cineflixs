import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs}"], 
    plugins: { js }, 
    extends: ["js/recommended"], 
    languageOptions: { globals: globals.browser },
    
    
    // rules
    rules: {
      "no-unused-vars": "error",        // warn instead of error
      "no-console": "warn",             // allow console.log
      "eqeqeq": ["error", "always"],   // enforce === instead of ==
    }
  },
]);
