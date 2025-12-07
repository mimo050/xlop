#!/usr/bin/env bash
# Usage: sign_ipa.sh <inputIpa> <outputIpa> <udid> <certificateId>
set -e

INPUT_IPA="$1"
OUTPUT_IPA="$2"
UDID="$3"
CERT_ID="$4"

echo "Simulating signing IPA..."
echo "Input: $INPUT_IPA"
echo "Output: $OUTPUT_IPA"
echo "UDID: $UDID"
echo "Certificate: $CERT_ID"

if [ -z "$INPUT_IPA" ] || [ -z "$OUTPUT_IPA" ]; then
  echo "Usage: sign_ipa.sh <inputIpa> <outputIpa> <udid> <certificateId>"
  exit 1
fi

mkdir -p "$(dirname "$OUTPUT_IPA")"
cp "$INPUT_IPA" "$OUTPUT_IPA"

echo "Done (simulated)."
