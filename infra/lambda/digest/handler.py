import os
import json
import datetime
import psycopg2
import boto3

DB_URL = os.environ.get("DATABASE_URL")
SES_FROM = os.environ.get("SES_FROM")
SES_TO = os.environ.get("SES_TO")


def lambda_handler(event, context):
    # Query DB for enquiries in last 24 hours
    since = datetime.datetime.utcnow() - datetime.timedelta(days=1)
    rows = []
    if DB_URL:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        cur.execute("SELECT id, name, email, phone, created_at FROM enquiries WHERE created_at >= %s", (since,))
        rows = cur.fetchall()
        cur.close()
        conn.close()

    html = "<h3>Daily Enquiries</h3>\n<ul>"
    for r in rows:
        html += f"<li>{r[1]} — {r[2]} — {r[3]} — {r[4]}</li>"
    html += "</ul>"

    if SES_FROM and SES_TO:
        ses = boto3.client("ses")
        ses.send_email(
            Source=SES_FROM,
            Destination={"ToAddresses": [SES_TO]},
            Message={
                "Subject": {"Data": "Daily Enquiries Digest"},
                "Body": {"Html": {"Data": html}},
            },
        )

    return {"statusCode": 200, "body": json.dumps({"count": len(rows)})}
