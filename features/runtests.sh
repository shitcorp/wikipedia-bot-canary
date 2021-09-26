#!/bin/bash

# Put your environment variables here
export NODE_ENV=testing

if [ $CI = "true" ] ; then
  yarn cucumber > ./features/results/index.html && echo "<!-- Generated on: $(date) -->" >> ./features/results/index.html && echo "{ \"file\": \"index.html\", \"generated\": \"$(date)\", \"generated_unix\": \"$(date +"%s")\" }" > ./features/results/meta.json
else
  yarn cucumber
fi
