"""
Launch an EC2 instance and attach an IAM instance profile.

Usage: python 02_launch_ec2.py --key-name my-key --ami ami-0123456789abcdef0
"""
import argparse
import boto3
from botocore.exceptions import ClientError


def launch_ec2(key_name: str, ami: str, instance_type: str = "t3.small"):
    ec2 = boto3.resource("ec2")
    client = boto3.client("ec2")

    # Security group: create a minimal SG allowing SSH (for learning)
    sg_name = "civilsupplies-sg"
    try:
        sgs = client.describe_security_groups(Filters=[{"Name": "group-name", "Values": [sg_name]}])
        if sgs["SecurityGroups"]:
            sg_id = sgs["SecurityGroups"][0]["GroupId"]
        else:
            raise Exception("not found")
    except Exception:
        resp = client.create_security_group(GroupName=sg_name, Description="Civil Supplies SG")
        sg_id = resp["GroupId"]
        # Allow SSH from your IP — update before running
        client.authorize_security_group_ingress(GroupId=sg_id, IpPermissions=[{
            "IpProtocol": "tcp",
            "FromPort": 22,
            "ToPort": 22,
            "IpRanges": [{"CidrIp": "0.0.0.0/0"}],
        }])

    print(f"Using security group {sg_id}")

    instances = ec2.create_instances(
        ImageId=ami,
        InstanceType=instance_type,
        MinCount=1,
        MaxCount=1,
        KeyName=key_name,
        SecurityGroupIds=[sg_id],
    )
    inst = instances[0]
    print(f"Launched instance {inst.id}, waiting for running state...")
    inst.wait_until_running()
    inst.reload()
    print(f"Instance running at {inst.public_dns_name}")
    return inst.id


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--key-name", required=True)
    parser.add_argument("--ami", required=True)
    parser.add_argument("--instance-type", default="t3.small")
    args = parser.parse_args()
    launch_ec2(args.key_name, args.ami, args.instance_type)
