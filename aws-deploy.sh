#!/usr/bin/env bash

set -euo pipefail
set -a
source .env.aws
set +a 

S3_TARGET="s3://$S3_BUCKET/$S3_PREFIX"

aws s3 rm "$S3_TARGET" --recursive --region "$AWS_REGION"

aws s3 cp --recursive dist/ "$S3_TARGET" --region "$AWS_REGION"

aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" --paths "/*"

