const esbuild = require("esbuild")
const sveltePlugin = require("esbuild-svelte")
const path = require("path")

const args = process.argv.slice(2)
const watch = args.includes("--watch")
const deploy = args.includes("--deploy")

const shared = {
  bundle: true,
  format: "esm",
  minify: deploy,
  conditions: ["svelte", "browser", ...(deploy ? [] : ["development"])],
  target: "es2022",
  logLevel: "info",
  sourcemap: watch ? "inline" : false,
  loader: { ".css": "text" },
  nodePaths: [
    path.resolve(__dirname, "node_modules"),
    path.resolve(__dirname, "../deps"),
  ],
  plugins: [
    sveltePlugin({
      compilerOptions: {
        dev: !deploy,
        css: "injected",
        generate: "client",
      },
      filterWarnings(warning) {
        if (warning.code === "state_referenced_locally" && warning.filename?.includes("node_modules")) {
          return false
        }
        return true
      },
    }),
  ],
}

const builds = [
  { ...shared, entryPoints: ["js/app.js"], outfile: "../priv/static/runcom_web_app.js" },
  { ...shared, entryPoints: ["js/dag_viewer.svelte.js"], format: "iife", outfile: "../priv/static/runcom_web_dag.js" },
  { ...shared, entryPoints: ["js/asciinema_player.js"], format: "iife", outfile: "../priv/static/runcom_web_player.js" },
]

if (watch) {
  Promise.all(builds.map(opts => esbuild.context(opts).then(ctx => ctx.watch())))
    .catch(_error => process.exit(1))
} else {
  Promise.all(builds.map(opts => esbuild.build(opts)))
}
