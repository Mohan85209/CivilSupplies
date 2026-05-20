AWS Deployment Runbook (learning path)
====================================

This folder contains example scripts and a runbook to provision resources on AWS manually and via boto3. These are educational examples — review IAM permissions and costs before running.

Prerequisites
- Python 3.10+
- Install packages: `pip install boto3 botocore`
- AWS credentials configured via environment or `~/.aws/credentials`

Scripts
- `scripts/01_create_rds.py` — create a Postgres RDS instance (db.t3.micro)
- `scripts/02_launch_ec2.py` — launch an EC2 instance and attach an IAM role
- `scripts/03_create_s3.py` — create an S3 bucket for BOQ uploads
- `scripts/04_setup_ses.py` — verify SES identity and create a simple configuration

Lambda digest
- `lambda/digest/handler.py` — Example Lambda that queries RDS for enquiries from last 24h and sends an HTML email via SES.
- `lambda/digest/deploy.sh` — helper to package & upload the Lambda code (requires AWS CLI).

Notes
- These scripts are examples for learning and are NOT production-ready. They do not handle every edge-case, networking setup (VPC/subnets), or strong IAM least-privilege configuration.
- Always inspect and tailor scripts to your environment. Running them may create chargeable AWS resources.
