# Put your environment variables here
export NODE_ENV=testing

if [ $CI = "true" ] ; then
  yarn cucumber > ./features/results/index.html
else
  yarn cucumber
fi
