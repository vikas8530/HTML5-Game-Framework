#!/bin/bash

echo "Cleaning dist folder.."
rm -fr ./dist/*

echo "Creating distribution files.."
cp -r ./working_directory/* dist

printf "\nStarting server..\n"
./node_modules/lite-server/bin/lite-server