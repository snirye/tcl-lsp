package tcl

import (
	"context"
	"testing"

	sitter "github.com/smacker/go-tree-sitter"
	"github.com/stretchr/testify/assert"
)

func TestGrammar(t *testing.T) {
	assert := assert.New(t)

	n, err := sitter.ParseCtx(context.Background(), []byte("puts hello"), GetLanguage())
	assert.NoError(err)
	assert.Equal(
		"(tcl_script (command name: (bare_word) arg_list: (arguments_list (bare_word))))",
		n.String(),
	)
}
