#!/bin/bash


git fetch origin main

if [[  $(git status -sb) == *"behind"* ]]; then
	echo "local branch behind remote"
	git pull
	docker-compose up -d --build
fi
