// In Tcl, the evaluation of a command is done in 2 phases.
// The first phase is a single pass of substitutions. The second phase is the evaluation of the resulting command. Note that only one pass of substitutions is made. Thus in the command
// source: https://www.tcl.tk/man/tcl8.5/tutorial/Tcl3.html

// also see https://www.tcl.tk/man/tcl8.5/TclCmd/Tcl.html#M10

// tree-sitter: https://tree-sitter.github.io/tree-sitter/creating-parsers


// we follow this man! https://www.tcl.tk/man/tcl8.5/TclCmd/Tcl.html#M10

// not directly in grammer

module.exports = grammar({
    name: 'tcl',

    inline: $ => [
      // $.variable_substitution
    ],

    // backslash_sequence: $ => /\\\n\s*/g,
  
    rules: {
      // TODO last command can be without a _terminator
      tcl_script: $ => seq(repeat(seq(choice($.command, $.comment), $._terminator)), optional($.command)),

      command: $ => seq(
        field('name', $._word), 
        optional($.arguments_list),
      ),

      arguments_list: $ => repeat1($._word),


      comment: $ => seq(/#[^\n]*/), // TODO: add support for inline comments

      _word: $ => choice(
        $.alowed_variable_name,
        $.variable_substitution,
        $.command_substitution,
        $.double_quotes,
        $.braces,
      ),

      // avoid backslash sequence 
      _terminator: $ => choice($.new_line, ';'),

      new_line: _ => /\n/,

      // simple__word: $ => /[^\\\s\[\]\$\"]+/,

      alowed_variable_name: $ => /[a-zA-Z0-9_]+/,

      variable_substitution: $ => seq('$',
       choice(
        $.alowed_variable_name,
        $.braces,
        seq( $.alowed_variable_name, '(',$._word, ')' )
      )),

      command_substitution: $ => seq('[', $.command, ']'),

      double_quotes: $ => seq('"', optional($._double_quotes_internal), '"'),
      // Command substitution, variable substitution, and backslash substitution 
      _double_quotes_internal: $ => repeat1(choice(/[^\[\$\\\"]+/,$.command_substitution, $.variable_substitution, $._backslash_substitution)),

      braces: $ => seq('{', optional($._braces_internal), '}'),
      // braces: $ => seq('{', repeat($._word), '}'),

      // TODO: we dont care about the internals of the braces. just make sure they even
      _braces_internal: $ => repeat1(choice(/[^\{\}]+/, $.braces)),

      _backslash_substitution: $ => seq('\\', choice(/./,/\n/))


    }
});