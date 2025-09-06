#!/bin/bash

# Export access tokena and start the app in live mode

set -a
source ./.env
set -e

read_access_token() {
    echo "Fetching access token from ${RMU_IAM_TOKEN_URI}"
    echo " Client: ${RMU_IAM_CLIENT_ID}"

    ACCESS_TOKEN=$(curl --location "${RMU_IAM_TOKEN_URI}" --silent \
        --header 'Content-Type: application/x-www-form-urlencoded' \
        --data-urlencode 'grant_type=password' \
        --data-urlencode "client_id=${RMU_IAM_CLIENT_ID}" \
        --data-urlencode "client_secret=${RMU_IAM_CLIENT_SECRET}" \
        --data-urlencode "username=${RMU_IAM_USERNAME}" \
        --data-urlencode "password=${RMU_IAM_PASSWORD}" \
        | jq -r '.access_token')

    echo "Token: $ACCESS_TOKEN"
    export TOKEN=$ACCESS_TOKEN
}

read_access_token

npm run start:live
