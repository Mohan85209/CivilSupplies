"""
Create an S3 bucket (idempotent). Useful for BOQ uploads.

Usage: python 03_create_s3.py --bucket my-bucket-name
"""
import argparse
import boto3
from botocore.exceptions import ClientError


def create_bucket(bucket_name: str, region: str | None = None):
    s3 = boto3.client("s3", region_name=region)
    try:
        s3.head_bucket(Bucket=bucket_name)
        print(f"Bucket {bucket_name} already exists or is accessible.")
        return
    except ClientError:
        pass

    kwargs = {"Bucket": bucket_name}
    if region and region != "us-east-1":
        kwargs["CreateBucketConfiguration"] = {"LocationConstraint": region}

    s3.create_bucket(**kwargs)
    print(f"Created bucket {bucket_name}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--bucket", required=True)
    parser.add_argument("--region", default=None)
    args = parser.parse_args()
    create_bucket(args.bucket, args.region)
