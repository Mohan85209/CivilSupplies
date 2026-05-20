"""
Create an RDS Postgres instance using boto3.
Idempotent: will skip if DB instance identifier already exists.

Usage: python 01_create_rds.py --db-identifier civilsupplies-db
"""
import argparse
import sys
import time

import boto3
from botocore.exceptions import ClientError


def create_rds(db_identifier: str, db_name: str = "civilsupplies"):
    rds = boto3.client("rds")
    try:
        # Check if exists
        resp = rds.describe_db_instances(DBInstanceIdentifier=db_identifier)
        print(f"RDS instance '{db_identifier}' already exists.")
        return resp
    except ClientError as e:
        if "DBInstanceNotFound" not in str(e):
            raise

    print("Creating RDS instance (this may take several minutes)...")
    resp = rds.create_db_instance(
        DBInstanceIdentifier=db_identifier,
        AllocatedStorage=20,
        DBInstanceClass="db.t3.micro",
        Engine="postgres",
        MasterUsername="postgres",
        MasterUserPassword="ChangeMe123!",
        DBName=db_name,
        PubliclyAccessible=False,
        StorageType="gp2",
    )

    # Wait until available
    waiter = rds.get_waiter("db_instance_available")
    waiter.wait(DBInstanceIdentifier=db_identifier)
    print("RDS instance is available.")
    return resp


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--db-identifier", default="civilsupplies-db")
    parser.add_argument("--db-name", default="civilsupplies")
    args = parser.parse_args()
    create_rds(args.db_identifier, args.db_name)
