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

RUN alias tclsh="tclsh8.6"