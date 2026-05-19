"""File storage helpers.

In dev (`AWS_S3_BUCKET` unset) we save to local disk at `UPLOAD_DIR`.
In prod, set `AWS_S3_BUCKET` and uploads go to S3; admin downloads use presigned URLs.
"""
from __future__ import annotations

import logging
import os
import uuid
from pathlib import Path

from app.config import settings

logger = logging.getLogger(__name__)

ALLOWED_BOQ_EXTENSIONS = {".pdf", ".xlsx", ".xls"}


def _ext(filename: str) -> str:
    return os.path.splitext(filename)[1].lower()


def is_allowed_boq(filename: str) -> bool:
    return _ext(filename) in ALLOWED_BOQ_EXTENSIONS


def _safe_storage_name(original_filename: str) -> str:
    return f"{uuid.uuid4().hex}{_ext(original_filename)}"


def save_boq_local(original_filename: str, content: bytes) -> tuple[str, str]:
    """Save BOQ to local disk. Returns (storage_name, public_or_local_path)."""
    upload_dir = Path(settings.UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)
    storage_name = _safe_storage_name(original_filename)
    dest = upload_dir / storage_name
    dest.write_bytes(content)
    return storage_name, str(dest)


def save_boq_s3(original_filename: str, content: bytes) -> tuple[str, str]:
    """Upload to S3, returns (storage_key, s3_url). boto3 is imported lazily."""
    import boto3  # type: ignore[import-not-found]

    s3 = boto3.client("s3", region_name=settings.AWS_REGION)
    storage_key = f"boq/{_safe_storage_name(original_filename)}"
    s3.put_object(Bucket=settings.AWS_S3_BUCKET, Key=storage_key, Body=content)
    s3_url = f"s3://{settings.AWS_S3_BUCKET}/{storage_key}"
    return storage_key, s3_url


def save_boq(original_filename: str, content: bytes) -> tuple[str, str]:
    if settings.AWS_S3_BUCKET:
        return save_boq_s3(original_filename, content)
    return save_boq_local(original_filename, content)


def presigned_url_for_boq(storage_name_or_key: str, expires_seconds: int = 600) -> str | None:
    """Return a presigned S3 URL if using S3, else None (caller serves local file)."""
    if not settings.AWS_S3_BUCKET:
        return None
    import boto3  # type: ignore[import-not-found]

    s3 = boto3.client("s3", region_name=settings.AWS_REGION)
    return s3.generate_presigned_url(
        "get_object",
        Params={"Bucket": settings.AWS_S3_BUCKET, "Key": storage_name_or_key},
        ExpiresIn=expires_seconds,
    )


def local_path_for(storage_name: str) -> Path:
    return Path(settings.UPLOAD_DIR) / storage_name
