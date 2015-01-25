#!/bin/sh
readonly CLIENT_ID=hip
readonly CLIENT_SECRET=ster
# CRED="$CLIENT_ID:$CLIENT_SECRET"
# OUTPUT="`echo $CRED | base64`"
# echo "Done! Use ${OUTPUT} in your Authorization Basic header"

OUTPUT="`redis-cli HGET AUTH_SCHEMA $CLIENT_ID`"
# check if cred exists
if [[ -n ${OUTPUT} ]]; then
  echo "Credential already exists with value: ${OUTPUT}"
else
  echo "Creating credential"
  OUTPUT="`redis-cli HSET AUTH_SCHEMA $CLIENT_ID $CLIENT_SECRET`"
  # check whether the value was written
  if [[ $OUTPUT == 1 ]]; then 
    OUTPUT = "`echo ${CLIENT_ID}:${CLIENT_SECRET} | base64`"
    echo "Done! Use ${OUTPUT} in your Authorization Basic header"
  else
    echo "Error creating credential";
  fi
fi  
