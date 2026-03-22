from __future__ import annotations

from pathlib import Path
import tempfile
import json
import sys
import os

from flask import Flask, jsonify, request

from backend.healthkit.healthkit import (
    HealthKitParseError,
    load_healthkit_snapshot,
    normalize_mobile_healthkit_payload,
    parse_healthkit_export,
    save_healthkit_snapshot,
    get_pickleball_advice_from_healthkit,  # import the new function
)


# Ensure 'mcp' and 'healthkit' modules are importable
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

app = Flask(__name__)


@app.get("/api/healthkit/latest")
def get_latest_healthkit_snapshot():
    snapshot = load_healthkit_snapshot()
    if snapshot is None:
        return jsonify({"error": "No HealthKit data has been ingested yet."}), 404
    return jsonify(snapshot)


@app.post("/api/healthkit/upload-xml")
def upload_apple_health_export():
    uploaded_file = request.files.get("file")
    if uploaded_file is None or not uploaded_file.filename:
        return jsonify({"error": "Upload an Apple Health export.xml file as form-data field 'file'."}), 400

    suffix = Path(uploaded_file.filename).suffix or ".xml"

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
        uploaded_file.save(temp_file.name)
        temp_path = Path(temp_file.name)

    try:
        snapshot = parse_healthkit_export(temp_path)
        try:
            snapshot["advice"] = get_pickleball_advice_from_healthkit(snapshot)
        except Exception:
            snapshot["advice"] = None
        save_healthkit_snapshot(snapshot)
        return jsonify(snapshot)
    except HealthKitParseError as exc:
        return jsonify({"error": str(exc)}), 400
    finally:
        temp_path.unlink(missing_ok=True)


@app.post("/api/healthkit/sync-mobile")
def sync_mobile_healthkit_payload():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify({"error": "Send a JSON body containing HealthKit metrics from the mobile app."}), 400

    try:
        snapshot = normalize_mobile_healthkit_payload(payload)
        try:
            snapshot["advice"] = get_pickleball_advice_from_healthkit(snapshot)
        except Exception:
            snapshot["advice"] = None
        save_healthkit_snapshot(snapshot)
        return jsonify(snapshot)
    except HealthKitParseError as exc:
        return jsonify({"error": str(exc)}), 400


@app.get("/api/healthkit/pickleball-advice")
def get_pickleball_advice():
    """Return cached pickleball advice generated when the latest snapshot was ingested."""
    snapshot = load_healthkit_snapshot()
    if snapshot is None or not snapshot.get("metrics"):
        return jsonify({"error": "No HealthKit data has been ingested yet."}), 404

    return jsonify({"advice": snapshot.get("advice")})


if __name__ == "__main__":
    app.run(debug=True)
