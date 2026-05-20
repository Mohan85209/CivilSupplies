#!/usr/bin/env bash
set -euo pipefail

# Package and upload Lambda function (requires AWS CLI + jq)
NAME=civilsupplies-digest
ZIP=deploy.zip

rm -f $ZIP
zip -r $ZIP handler.py

echo "Upload $ZIP to S3 or create Lambda function using AWS CLI. Example:"
echo "aws lambda create-function --function-name $NAME --runtime python3.10 --role <ROLE_ARN> --handler handler.lambda_handler --zip-file fileb://$ZIP --timeout 30"
