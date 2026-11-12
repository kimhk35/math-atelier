# McKay Math Atelier

Production: https://atelier.mathmckay.kr/

## Advanced mathematics

50 interactive experiments in 7 areas. Direct entry: /advanced-math/

- Linear algebra: 10
- Complex numbers: 8
- Curves and polar coordinates: 6
- Limits and analysis: 8
- Multivariable calculus: 6
- Numerical methods and models: 6
- Discrete mathematics: 6

Each experiment includes parameters, special-case presets, a graph, numerical metrics, three inquiry prompts, teacher notes and locally saved written responses. Course 18 integrates all 50 experiments into the main catalogue and search.

## Source and build

The complete static source is in site-source.tar.gz. Extract it to edit. build.cjs extracts the site to public and verifies every file against source-manifest.json. No runtime dependencies. Existing production experiments and assets are preserved.

Validation: 413 preset and parameter-boundary renders plus mathematical special cases. Public production checked through the browser.
