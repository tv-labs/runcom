# Used by "mix format"
[
  import_deps: [:bash],
  plugins: [Bash.Formatter],
  inputs: ["{mix,.formatter}.exs", "{config,test}/**/*.{ex,exs}", "{config,lib,test}/**/*.ex", "**/*.{sh,bash}"],
  bash: [
    indent_style: :spaces,
    indent_width: 2,
    line_length: 100
  ]
]
