#!/bin/bash

# Put your environment variables here
export NODE_ENV=testing

if [ $CI = "true" ] ; then
  # Run tests and pipe output html to file
  yarn cucumber > ./features/results/index.html &&\
  # Generate a JSON file with the results
  export CI=json &&\
  yarn cucumber > ./features/results/results.json &&\
  # Add the generation date to the generated html
  echo "<!-- Generated on: $(date) -->" >> ./features/results/index.html &&\
  # Generate a metadata json file with the generation info
  echo "{ \"files\": [\"index.html\", \"results.tar\", \"results.json\"], \"generated\": \"$(date)\", \"generated_unix\": \"$(date +"%s")\" }" > ./features/results/meta.json &&\
  # Add the generated html and metadata to the results archive
  tar -czf ./features/results.tar ./features/results &&\
  # Remove the generated html file
  rm -rf ./features/results/index.html &&\
  # Move the results archive to the results folder since we
  # cant archive the results folder while we write the resulting
  # tarball to the same folder at the same time
  mv ./features/results.tar ./features/results/results.tar &&\
  # Rerun the tests but pretend we are not on a CI environment
  # so we get the nice pretty output to console to see if the tests
  # passed without havint to unpack the results archive
  export CI=false &&\
  yarn cucumber |& tee ./features/results/results-pretty.txt
else
  # sine we are running locally the results will be printed to
  # STDOUT. The formatter is a different one. For details consult
  # the '../cucumber.js' file as well as the cucumber documentation
  yarn cucumber
fi
