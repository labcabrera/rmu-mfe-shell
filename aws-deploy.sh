#!/usr/bin/env bash
set -euo pipefail

S3_BUCKET=${S3_BUCKET:-rmu-static-assets-pro}
S3_PREFIX=${S3_PREFIX:-rmu-mfe-shell}
AWS_REGION=${AWS_REGION:-eu-west-1}

S3_TARGET="s3://$S3_BUCKET/$S3_PREFIX"

aws s3 rm "$S3_TARGET" --recursive --region "$AWS_REGION"

aws s3 cp --recursive dist/ "$S3_TARGET" --region "$AWS_REGION"

