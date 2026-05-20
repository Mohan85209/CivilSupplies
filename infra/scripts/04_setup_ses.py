"""
Verify an SES identity (email) and send a test email.

Usage: python 04_setup_ses.py --email owner@example.com
"""
import argparse
import boto3
from botocore.exceptions import ClientError


def verify_identity(email: str, region: str | None = None):
    ses = boto3.client("ses", region_name=region)
    try:
        resp = ses.verify_email_identity(EmailAddress=email)
        print(f"Verification initiated for {email}. Check your mailbox to confirm.")
        return resp
    except ClientError as e:
        print("Error initiating verification:", e)
        raise


def send_test(from_addr: str, to_addr: str, region: str | None = None):
    ses = boto3.client("ses", region_name=region)
    try:
        resp = ses.send_email(
            Source=from_addr,
            Destination={"ToAddresses": [to_addr]},
            Message={
                "Subject": {"Data": "SES test"},
                "Body": {"Text": {"Data": "This is a test email from SES."}},
            },
        )
        print("Sent test email, message id:", resp.get("MessageId"))
        return resp
    except ClientError as e:
        print("Error sending email:", e)
        raise


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--email", required=True)
    parser.add_argument("--region", default=None)
    args = parser.parse_args()
    verify_identity(args.email, args.region)
