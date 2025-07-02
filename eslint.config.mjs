import eslint from "@eslint/js"
import tseslint from "typescript-eslint"

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    rules: {
      "quotes": ["error", "double"],
      "semi": ["error", "never"]
    }
  },
  {
    ignores: ["node_modules", "build"]
  },
)
