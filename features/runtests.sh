#!/bin/bash

# Put your environment variables here
export NODE_ENV=testing

if [ $CI = "true" ] ; then
  yarn cucumber > ./features/results/index.html && echo "<!-- Generated on: $(date) -->" >> ./features/results/index.html && echo "{ \"files\": [\"index.html\", \"results.tar\"], \"generated\": \"$(date)\", \"generated_unix\": \"$(date +"%s")\" }" > ./features/results/meta.json && tar -czf ./features/results/results.tar ./features/results && rm -rf ./features/results/index.html
else
  yarn cucumber
fi
