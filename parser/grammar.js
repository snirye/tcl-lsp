// tree-sitter: https://tree-sitter.github.io/tree-sitter/creating-parsers

// we follow this man! https://www.tcl.tk/man/tcl8.6/TclCmd/Tcl.html#M10
// or `man tcl`

module.exports = grammar({
    name: 'tcl',

    rules: {
        // last command can be without a _terminator
        tcl_script: $ => seq(repeat(seq(choice($.command, $.comment), $._terminator)), optional($.command)),

        command: $ => seq(
            field('name', $._word),
            field('arg_list', optional($.arguments_list)),
        ),

        arguments_list: $ => repeat1($._word),

        // avoid backslash sequence 
        _terminator: $ => choice($._new_line, ';'),
        _new_line: _ => /\n/,


        _word: $ => choice(
            $.bare_word,
            $.variable_substitution,
            $.command_substitution,
            $.double_quotes,
            $.braces,
        ),

        // not quotes, braces, command_substitution and variable_substitution
        bare_word: $ => /[^\s\"\{\[\$]+/,


        // Command substitution, variable substitution, and backslash substitution 
        double_quotes: $ => seq('"', optional($._double_quotes_internal), '"'),
        _double_quotes_internal: $ => repeat1(choice(/[^\[\$\\\"]+/, $.command_substitution, $.variable_substitution, $._backslash_substitution)),

        // added prec so we dont confuse with braces
        argument_expansion: $ => prec(0, /\{\*\}[^\s]/),


        // I used prec since we first check its not argument_expansion
        braces: $ => prec(1, seq('{', optional($._braces_internal), '}')),
        // we dont care about the internals of the braces. just make sure they even
        _braces_internal: $ => repeat1(choice(/[^\{\}]+/, $._even_braces)),
        _even_braces: $ => prec(1, seq('{', optional($._braces_internal), '}')),


        command_substitution: $ => seq('[', $.command, ']'),


        variable_substitution: $ => seq('$',
            choice(
                $.alowed_variable_name,
                $.braces,
                seq($.alowed_variable_name, '(', $._word, ')')
            )),
        alowed_variable_name: $ => /[a-zA-Z0-9_]+/,


        _backslash_substitution: $ => seq('\\', choice(/./, /\n/)),

        
        comment: $ => seq(/#[^\n]*/), // TODO: add support for inline comments
    }
});