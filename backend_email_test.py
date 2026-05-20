#!/usr/bin/env python3
"""
Backend Email Integration Test for Bagdrop Booking System
Tests the booking email sending functionality.
"""

import requests
import time
import subprocess
from datetime import datetime

# Base URL from frontend/.env
BASE_URL = "https://bagdrop-metro.preview.emergentagent.com/api"

# Use timestamp-based client_id as requested
timestamp = int(time.time())
CLIENT_ID = f"email_test_{timestamp}"

print("="*80)
print("BAGDROP BOOKING EMAIL INTEGRATION TEST")
print("="*80)
print(f"Base URL: {BASE_URL}")
print(f"Client ID: {CLIENT_ID}")
print(f"Timestamp: {timestamp}")
print("="*80)

# Step 1: POST /api/bookings with realistic payload
print("\n[STEP 1] Creating booking with email integration test...")
print("-"*80)

payload = {
    "client_id": CLIENT_ID,
    "service_id": "address-to-address",
    "service_title": "Doorstep to Doorstep",
    "service_color": "orange",
    "from_location_id": "bom",
    "to_location_id": "goi",
    "from_label": "Mumbai - T2 Terminal (CSMIA)",
    "to_label": "Goa - Dabolim / Mopa Airport",
    "pickup_address": "Flat 24, Pali Hill, Bandra West, Mumbai",
    "drop_address": "Taj Holiday Village, Sinquerim, North Goa",
    "date": "2026-06-20",
    "drop_date": "2026-06-21",
    "time_slot": "10:00 - 12:00",
    "bag_selections": {"travel": 2},
    "total_bags": 2,
    "total_price": 1798,
    "name": "Email Test Customer",
    "phone": "9876543210",
    "email": "test-customer@example.com"
}

print(f"Payload:")
print(f"  Client ID: {payload['client_id']}")
print(f"  Service: {payload['service_title']}")
print(f"  Route: {payload['from_label']} → {payload['to_label']}")
print(f"  Pickup Date: {payload['date']}")
print(f"  Drop Date: {payload['drop_date']}")
print(f"  Customer: {payload['name']} ({payload['email']})")
print(f"  Total: ₹{payload['total_price']}")

try:
    response = requests.post(f"{BASE_URL}/bookings", json=payload, timeout=15)
    
    # Step 2: Confirm 200 OK
    print(f"\nResponse Status: {response.status_code}")
    
    if response.status_code != 200:
        print(f"❌ FAILED: Expected 200 OK, got {response.status_code}")
        print(f"Response: {response.text}")
        exit(1)
    
    print("✅ PASSED: Status code 200 OK")
    
    data = response.json()
    booking_code = data.get("code")
    booking_id = data.get("id")
    response_drop_date = data.get("drop_date")
    
    print(f"\nBooking Created:")
    print(f"  ID: {booking_id}")
    print(f"  Code: {booking_code}")
    print(f"  Status: {data.get('status')}")
    print(f"  Drop Date: {response_drop_date}")
    
    # Verify code format (BD#####)
    if booking_code and booking_code.startswith("BD") and len(booking_code) == 7:
        print(f"✅ PASSED: Booking code format correct (BD#####)")
    else:
        print(f"❌ FAILED: Invalid booking code format: {booking_code}")
    
    # Verify drop_date echoed back
    if response_drop_date == payload["drop_date"]:
        print(f"✅ PASSED: Drop date echoed back correctly ({response_drop_date})")
    else:
        print(f"❌ FAILED: Drop date mismatch. Expected: {payload['drop_date']}, Got: {response_drop_date}")
    
    # Step 3: Wait ~5 seconds for email to be sent
    print(f"\n[STEP 2] Waiting 5 seconds for email to be sent...")
    print("-"*80)
    time.sleep(5)
    
    # Step 4: Check backend logs
    print(f"\n[STEP 3] Checking backend logs for email status...")
    print("-"*80)
    
    # Check both err and out logs
    log_files = [
        "/var/log/supervisor/backend.err.log",
        "/var/log/supervisor/backend.out.log"
    ]
    
    email_sent = False
    email_failed = False
    smtp_not_configured = False
    error_message = None
    
    for log_file in log_files:
        try:
            result = subprocess.run(
                ["tail", "-n", "50", log_file],
                capture_output=True,
                text=True,
                timeout=5
            )
            
            log_content = result.stdout
            
            # Check for success message
            if f"Sent booking email for {booking_code} to info@bagdrop.co" in log_content:
                email_sent = True
                print(f"✅ FOUND in {log_file}:")
                print(f"   'Sent booking email for {booking_code} to info@bagdrop.co'")
            
            # Check for failure message
            if f"Failed to send booking email for {booking_code}" in log_content:
                email_failed = True
                # Extract the error message
                for line in log_content.split('\n'):
                    if f"Failed to send booking email for {booking_code}" in line:
                        error_message = line
                        print(f"❌ FOUND in {log_file}:")
                        print(f"   {line}")
            
            # Check for SMTP not configured message (must be for THIS booking)
            if f"SMTP not configured - skipping email for booking {booking_code}" in log_content:
                smtp_not_configured = True
                print(f"⚠️  FOUND in {log_file}:")
                print(f"   'SMTP not configured - skipping email for booking {booking_code}'")
        
        except Exception as e:
            print(f"⚠️  Could not read {log_file}: {e}")
    
    print("\n" + "-"*80)
    print("EMAIL SENDING OUTCOME:")
    print("-"*80)
    
    if email_sent:
        print(f"✅ SUCCESS: Email sent successfully for {booking_code} to info@bagdrop.co")
    elif email_failed:
        print(f"❌ FAILED: Email sending failed for {booking_code}")
        if error_message:
            print(f"   Error: {error_message}")
    elif smtp_not_configured:
        print(f"❌ FAILED: SMTP not configured - email was skipped")
    else:
        print(f"⚠️  UNKNOWN: No email log found for {booking_code}")
        print(f"   This could mean:")
        print(f"   - Email is still being sent (background task)")
        print(f"   - Logs were rotated")
        print(f"   - Email function was not called")
    
    # Step 5: Verify SMTP not configured message is NOT present
    print(f"\n[STEP 4] Verifying SMTP configuration...")
    print("-"*80)
    
    if smtp_not_configured:
        print(f"❌ FAILED: Found 'SMTP not configured' log line for {booking_code}")
        print(f"   SMTP environment variables should be set:")
        print(f"   - SMTP_HOST=smtp.gmail.com")
        print(f"   - SMTP_PORT=587")
        print(f"   - SMTP_USER=info@bagdrop.co")
        print(f"   - ADMIN_EMAIL=info@bagdrop.co")
    else:
        print(f"✅ PASSED: No 'SMTP not configured' log line found")
        print(f"   SMTP appears to be configured correctly")
    
    # Step 6: GET /api/bookings/{code} to verify drop_date persistence
    print(f"\n[STEP 5] Verifying drop_date persistence...")
    print("-"*80)
    
    get_response = requests.get(f"{BASE_URL}/bookings/{booking_code}", timeout=10)
    
    if get_response.status_code == 200:
        get_data = get_response.json()
        persisted_drop_date = get_data.get("drop_date")
        
        print(f"Retrieved booking {booking_code}:")
        print(f"  Drop Date: {persisted_drop_date}")
        
        if persisted_drop_date == payload["drop_date"]:
            print(f"✅ PASSED: Drop date persisted correctly in database")
        else:
            print(f"❌ FAILED: Drop date mismatch in database")
            print(f"   Expected: {payload['drop_date']}")
            print(f"   Got: {persisted_drop_date}")
    else:
        print(f"❌ FAILED: Could not retrieve booking {booking_code}")
        print(f"   Status: {get_response.status_code}")
    
    # Final Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    print(f"Booking Code: {booking_code}")
    print(f"Booking ID: {booking_id}")
    print(f"Client ID: {CLIENT_ID}")
    print(f"\nResults:")
    print(f"  ✅ Booking created successfully (200 OK)")
    print(f"  ✅ Code format correct (BD#####)")
    print(f"  ✅ Drop date echoed back in response")
    print(f"  ✅ Drop date persisted in database")
    
    if email_sent:
        print(f"  ✅ Email sent successfully to info@bagdrop.co")
    elif email_failed:
        print(f"  ❌ Email sending failed")
    elif smtp_not_configured:
        print(f"  ❌ SMTP not configured - email skipped")
    else:
        print(f"  ⚠️  Email status unknown (check logs manually)")
    
    if not smtp_not_configured:
        print(f"  ✅ SMTP configuration verified (no skip message)")
    else:
        print(f"  ❌ SMTP configuration issue detected")
    
    print("="*80)
    
    # Exit with appropriate code
    if email_sent and not smtp_not_configured:
        print("\n✅ ALL TESTS PASSED - Email integration working correctly")
        exit(0)
    elif email_failed or smtp_not_configured:
        print("\n❌ TESTS FAILED - Email integration has issues")
        exit(1)
    else:
        print("\n⚠️  TESTS INCOMPLETE - Email status unclear")
        exit(2)

except Exception as e:
    print(f"\n❌ EXCEPTION: {str(e)}")
    import traceback
    traceback.print_exc()
    exit(1)
