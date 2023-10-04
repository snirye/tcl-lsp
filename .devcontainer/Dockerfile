FROM node:latest

# install tree-sitter-cli
RUN npm install -g tree-sitter-cli

# install tcl!
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y tcl8.6 \
        tcl8.6-doc \
        man \
    && apt-get clean


# install golang
RUN wget https://go.dev/dl/go1.21.1.linux-amd64.tar.gz && \
    tar -C /usr/local -xzf go1.21.1.linux-amd64.tar.gz

ENV PATH="$PATH:/usr/local/go/bin"

RUN go install -v golang.org/x/tools/gopls@latest





