from __future__ import annotations

from dataclasses import asdict, dataclass
from datetime import datetime
from pathlib import Path
from typing import Any
import json
import xml.etree.ElementTree as ET


class HealthKitParseError(Exception):
    """Raised when an Apple Health export cannot be parsed."""


@dataclass
class MetricSummary:
    label: str
    value: float | None
    unit: str | None
    record_count: int
    aggregation: str
    latest_start_date: str | None = None
    latest_end_date: str | None = None
    status: str = "ok"
    message: str | None = None


METRIC_CONFIG = {
    "steps": {
        "identifier": "HKQuantityTypeIdentifierStepCount",
        "label": "Steps",
        "unit": "count",
        "aggregation": "sum",
        "aliases": ["steps", "step_count", "stepCount"],
    },
    "heart_rate": {
        "identifier": "HKQuantityTypeIdentifierHeartRate",
        "label": "Heart Rate",
        "unit": "count/min",
        "aggregation": "average",
        "aliases": ["heart_rate", "heartRate", "heart-rate"],
    },
    "active_energy_burned": {
        "identifier": "HKQuantityTypeIdentifierActiveEnergyBurned",
        "label": "Active Energy Burned",
        "unit": "kcal",
        "aggregation": "sum",
        "aliases": ["active_energy_burned", "activeEnergy", "activeEnergyBurned"],
    },
    "hrv": {
        "identifier": "HKQuantityTypeIdentifierHeartRateVariabilitySDNN",
        "label": "Heart Rate Variability",
        "unit": "ms",
        "aggregation": "average",
        "aliases": ["hrv", "heart_rate_variability", "heartRateVariability"],
    },
    "respiratory_rate": {
        "identifier": "HKQuantityTypeIdentifierRespiratoryRate",
        "label": "Respiratory Rate",
        "unit": "count/min",
        "aggregation": "average",
        "aliases": ["respiratory_rate", "respiratoryRate"],
    },
    "sleep": {
        "identifier": "HKCategoryTypeIdentifierSleepAnalysis",
        "label": "Sleep Analysis",
        "unit": "hours",
        "aggregation": "sum",
        "aliases": ["sleep", "sleep_analysis", "sleepAnalysis"],
    },
}

APPLE_HEALTH_TYPES = {
    "steps": {
        "identifier": "HKQuantityTypeIdentifierStepCount",
        "label": "Steps",
        "unit": "count",
        "aggregation": "sum",
    },
    "heart_rate": {
        "identifier": "HKQuantityTypeIdentifierHeartRate",
        "label": "Heart Rate",
        "unit": "count/min",
        "aggregation": "average",
    },
    "active_energy_burned": {
        "identifier": "HKQuantityTypeIdentifierActiveEnergyBurned",
        "label": "Active Energy Burned",
        "unit": "kcal",
        "aggregation": "sum",
    },
    "hrv": {
        "identifier": "HKQuantityTypeIdentifierHeartRateVariabilitySDNN",
        "label": "Heart Rate Variability",
        "unit": "ms",
        "aggregation": "average",
    },
    "respiratory_rate": {
        "identifier": "HKQuantityTypeIdentifierRespiratoryRate",
        "label": "Respiratory Rate",
        "unit": "count/min",
        "aggregation": "average",
    },
}

SLEEP_IDENTIFIER = "HKCategoryTypeIdentifierSleepAnalysis"
SLEEP_IN_BED_VALUE = "HKCategoryValueSleepAnalysisInBed"
DEFAULT_STORAGE_PATH = Path(__file__).with_name("latest_healthkit.json")


def _parse_iso_datetime(value: str | None) -> datetime | None:
    if not value:
        return None

    # Apple export dates often look like: 2026-03-21 07:10:00 -0400
    for fmt in ("%Y-%m-%d %H:%M:%S %z", "%Y-%m-%d %H:%M:%S"):
        try:
            return datetime.strptime(value, fmt)
        except ValueError:
            continue
    return None


def _to_iso(value: datetime | None) -> str | None:
    return value.isoformat() if value else None


def _empty_metric(label: str, unit: str, aggregation: str, message: str) -> MetricSummary:
    return MetricSummary(
        label=label,
        value=None,
        unit=unit,
        record_count=0,
        aggregation=aggregation,
        status="missing",
        message=message,
    )


def _normalize_metric_value(value: Any) -> float | None:
    if value is None:
        return None

    if isinstance(value, (int, float)):
        return float(value)

    if isinstance(value, str):
        stripped = value.strip()
        if not stripped:
            return None

        try:
            return float(stripped)
        except ValueError:
            return None

    return None


def _extract_timestamp(payload: dict[str, Any], *keys: str) -> str | None:
    for key in keys:
        value = payload.get(key)
        if isinstance(value, str) and value.strip():
            return value
    return None


def _normalize_mobile_metric(metric_key: str, raw_metric: Any) -> MetricSummary:
    config = METRIC_CONFIG[metric_key]
    label = config["label"]
    unit = config["unit"]
    aggregation = config["aggregation"]

    if raw_metric is None:
        return _empty_metric(
            label,
            unit,
            aggregation,
            f"{label} was not included in the mobile HealthKit payload.",
        )

    if isinstance(raw_metric, dict):
        value = _normalize_metric_value(
            raw_metric.get("value", raw_metric.get("quantity", raw_metric.get("sumQuantity")))
        )
        record_count = raw_metric.get("record_count", raw_metric.get("recordCount", 1))
        latest_start = _extract_timestamp(raw_metric, "latest_start_date", "latestStartDate", "startDate")
        latest_end = _extract_timestamp(raw_metric, "latest_end_date", "latestEndDate", "endDate")
        message = raw_metric.get("message")
        incoming_status = raw_metric.get("status")
        incoming_unit = raw_metric.get("unit")

        if isinstance(record_count, str) and record_count.isdigit():
            record_count = int(record_count)
        elif not isinstance(record_count, int):
            record_count = 1 if value is not None else 0

        return MetricSummary(
            label=label,
            value=value,
            unit=incoming_unit if isinstance(incoming_unit, str) and incoming_unit else unit,
            record_count=record_count,
            aggregation=aggregation,
            latest_start_date=latest_start,
            latest_end_date=latest_end,
            status=(
                incoming_status
                if isinstance(incoming_status, str) and incoming_status
                else ("ok" if value is not None else "missing")
            ),
            message=message if isinstance(message, str) else None,
        )

    value = _normalize_metric_value(raw_metric)
    if value is None:
        return _empty_metric(
            label,
            unit,
            aggregation,
            f"{label} was included in the mobile HealthKit payload, but the value was invalid.",
        )

    return MetricSummary(
        label=label,
        value=value,
        unit=unit,
        record_count=1,
        aggregation=aggregation,
    )


def _find_mobile_metric(raw_metrics: dict[str, Any], metric_key: str) -> Any:
    config = METRIC_CONFIG[metric_key]
    for alias in config["aliases"]:
        if alias in raw_metrics:
            return raw_metrics[alias]
    return None


def _summarize_quantity_metric(records: list[ET.Element], *, label: str, unit: str, aggregation: str) -> MetricSummary:
    if not records:
        return _empty_metric(
            label,
            unit,
            aggregation,
            f"{label} records were not found in this Apple Health export.",
        )

    values: list[float] = []
    latest_start: datetime | None = None
    latest_end: datetime | None = None

    for record in records:
        raw_value = record.attrib.get("value")
        try:
            value = float(raw_value) if raw_value is not None else None
        except ValueError:
            value = None

        if value is not None:
            values.append(value)

        start_date = _parse_iso_datetime(record.attrib.get("startDate"))
        end_date = _parse_iso_datetime(record.attrib.get("endDate"))

        if start_date and (latest_start is None or start_date > latest_start):
            latest_start = start_date
        if end_date and (latest_end is None or end_date > latest_end):
            latest_end = end_date

    if not values:
        return _empty_metric(
            label,
            unit,
            aggregation,
            f"{label} records were found, but none had numeric values.",
        )

    if aggregation == "sum":
        result = sum(values)
    elif aggregation == "average":
        result = sum(values) / len(values)
    else:
        raise HealthKitParseError(f"Unsupported aggregation type: {aggregation}")

    return MetricSummary(
        label=label,
        value=result,
        unit=unit,
        record_count=len(values),
        aggregation=aggregation,
        latest_start_date=_to_iso(latest_start),
        latest_end_date=_to_iso(latest_end),
    )


def _summarize_sleep(records: list[ET.Element]) -> MetricSummary:
    sleep_records = [
        record
        for record in records
        if record.attrib.get("value") != SLEEP_IN_BED_VALUE
    ]

    if not sleep_records:
        return _empty_metric(
            "Sleep Analysis",
            "hours",
            "sum",
            "Sleep analysis records were not found in this Apple Health export.",
        )

    total_hours = 0.0
    latest_start: datetime | None = None
    latest_end: datetime | None = None
    valid_records = 0

    for record in sleep_records:
        start_date = _parse_iso_datetime(record.attrib.get("startDate"))
        end_date = _parse_iso_datetime(record.attrib.get("endDate"))

        if not start_date or not end_date or end_date <= start_date:
            continue

        total_hours += (end_date - start_date).total_seconds() / 3600
        valid_records += 1

        if latest_start is None or start_date > latest_start:
            latest_start = start_date
        if latest_end is None or end_date > latest_end:
            latest_end = end_date

    if valid_records == 0:
        return _empty_metric(
            "Sleep Analysis",
            "hours",
            "sum",
            "Sleep analysis records were found, but none had valid date ranges.",
        )

    return MetricSummary(
        label="Sleep Analysis",
        value=total_hours,
        unit="hours",
        record_count=valid_records,
        aggregation="sum",
        latest_start_date=_to_iso(latest_start),
        latest_end_date=_to_iso(latest_end),
    )


def parse_healthkit_export(xml_path: str | Path) -> dict[str, Any]:
    """
    Parse an Apple Health export.xml file into API-ready metric summaries.

    This does not talk to HealthKit directly. Instead, it reads an Apple Health
    export generated on-device and produces backend-friendly JSON data.
    """

    xml_file = Path(xml_path)
    if not xml_file.exists():
        raise HealthKitParseError(f"File not found: {xml_file}")

    try:
        tree = ET.parse(xml_file)
    except ET.ParseError as exc:
        raise HealthKitParseError("Invalid Apple Health export XML.") from exc

    root = tree.getroot()
    records = root.findall("Record")
    if not records:
        raise HealthKitParseError("No Apple Health records found in export.")

    quantity_buckets: dict[str, list[ET.Element]] = {
        config["identifier"]: [] for config in APPLE_HEALTH_TYPES.values()
    }
    sleep_records: list[ET.Element] = []

    for record in records:
        record_type = record.attrib.get("type")
        if record_type in quantity_buckets:
            quantity_buckets[record_type].append(record)
        elif record_type == SLEEP_IDENTIFIER:
            sleep_records.append(record)

    metrics: dict[str, MetricSummary] = {}
    missing_fields: list[str] = []

    for key, config in APPLE_HEALTH_TYPES.items():
        summary = _summarize_quantity_metric(
            quantity_buckets[config["identifier"]],
            label=config["label"],
            unit=config["unit"],
            aggregation=config["aggregation"],
        )
        metrics[key] = summary
        if summary.status == "missing":
            missing_fields.append(key)

    sleep_summary = _summarize_sleep(sleep_records)
    metrics["sleep"] = sleep_summary
    if sleep_summary.status == "missing":
        missing_fields.append("sleep")

    return {
        "source": "apple_health_export_xml",
        "file_name": xml_file.name,
        "imported_at": datetime.utcnow().isoformat() + "Z",
        "record_count": len(records),
        "missing_fields": missing_fields,
        "metrics": {key: asdict(value) for key, value in metrics.items()},
    }


def normalize_mobile_healthkit_payload(payload: dict[str, Any]) -> dict[str, Any]:
    """
    Normalize a payload posted by a mobile client that used
    @kingstinct/react-native-healthkit on-device.
    """

    raw_metrics = payload.get("metrics")
    if not isinstance(raw_metrics, dict):
        raw_metrics = payload

    metrics: dict[str, MetricSummary] = {}
    missing_fields: list[str] = []

    for metric_key in METRIC_CONFIG:
        raw_metric = _find_mobile_metric(raw_metrics, metric_key)
        summary = _normalize_mobile_metric(metric_key, raw_metric)
        metrics[metric_key] = summary
        if summary.status == "missing":
            missing_fields.append(metric_key)

    source_name = payload.get("source")
    if not isinstance(source_name, str) or not source_name.strip():
        source_name = "@kingstinct/react-native-healthkit"

    return {
        "source": source_name,
        "file_name": None,
        "imported_at": datetime.utcnow().isoformat() + "Z",
        "record_count": sum(metric.record_count for metric in metrics.values()),
        "missing_fields": missing_fields,
        "metrics": {key: asdict(value) for key, value in metrics.items()},
    }


def save_healthkit_snapshot(snapshot: dict[str, Any], destination: str | Path = DEFAULT_STORAGE_PATH) -> Path:
    destination_path = Path(destination)
    destination_path.parent.mkdir(parents=True, exist_ok=True)
    destination_path.write_text(json.dumps(snapshot, indent=2), encoding="utf-8")
    return destination_path


def load_healthkit_snapshot(source: str | Path = DEFAULT_STORAGE_PATH) -> dict[str, Any] | None:
    source_path = Path(source)
    if not source_path.exists():
        return None
    return json.loads(source_path.read_text(encoding="utf-8"))


def metrics_to_json(xml_path: str | Path) -> str:
    """Helper to produce serialized JSON for an API response."""
    return json.dumps(parse_healthkit_export(xml_path), indent=2)


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(
        description="Parse an Apple Health export.xml file into JSON summaries."
    )
    parser.add_argument("xml_path", help="Path to Apple Health export.xml")
    args = parser.parse_args()

    print(metrics_to_json(args.xml_path))
