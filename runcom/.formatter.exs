# Used by "mix format"
[
  import_deps: [:bash],
  plugins: [Bash.Formatter],
  exports: [
    locals_without_parents: [
      schema: 1,
      schema: 2,
      field: 1,
      field: 2,
      field: 3,
      group: 1,
      group: 2
    ]
  ],
  inputs: [
    "{mix,.formatter}.exs",
    "{config,test}/**/*.{ex,exs}",
    "{config,lib,test}/**/*.ex",
    "**/*.{sh,bash}"
  ],
  bash: [
    indent_style: :spaces,
    indent_width: 2,
    line_length: 100
  ]
]
