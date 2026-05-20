#!/usr/bin/env python3
"""
Backend API Tests for Bagdrop Booking System
Tests all booking CRUD operations, status updates, and tracking endpoints.
"""

import requests
import time
import json
from typing import Dict, Any

# Base URL from frontend/.env
BASE_URL = "https://bagdrop-metro.preview.emergentagent.com/api"

# Use unique client_id with timestamp
CLIENT_ID = f"test_client_{int(time.time())}"

# Test results tracking
test_results = {
    "passed": [],
    "failed": [],
    "total": 0
}


def log_test(name: str, passed: bool, details: str = ""):
    """Log test result"""
    test_results["total"] += 1
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"\n{status}: {name}")
    if details:
        print(f"  Details: {details}")
    
    if passed:
        test_results["passed"].append(name)
    else:
        test_results["failed"].append({"name": name, "details": details})


def create_sample_booking(client_id: str, service_id: str = "address-to-address") -> Dict[str, Any]:
    """Create a sample booking payload"""
    return {
        "client_id": client_id,
        "service_id": service_id,
        "service_title": "Address to Address",
        "service_color": "orange",
        "pickup_address": "Mumbai T2 Airport, Andheri East, Mumbai, Maharashtra 400099",
        "drop_address": "Bandra West, Mumbai, Maharashtra 400050",
        "date": "2024-02-15",
        "time_slot": "10:00 AM - 12:00 PM",
        "bag_selections": {"standard": 2, "oversized": 1},
        "total_bags": 3,
        "total_price": 1500,
        "name": "Rajesh Kumar",
        "phone": "+91 98765 43210",
        "email": "rajesh.kumar@example.com"
    }


def test_create_booking():
    """Test POST /api/bookings - create a new booking"""
    print("\n" + "="*80)
    print("TEST 1: Create Booking (POST /api/bookings)")
    print("="*80)
    
    payload = create_sample_booking(CLIENT_ID)
    
    try:
        response = requests.post(f"{BASE_URL}/bookings", json=payload, timeout=10)
        
        if response.status_code != 200:
            log_test("Create booking - status code", False, f"Expected 200, got {response.status_code}")
            return None
        
        log_test("Create booking - status code", True, "200 OK")
        
        data = response.json()
        
        # Verify uuid id
        if "id" in data and len(data["id"]) == 36:  # UUID format
            log_test("Create booking - uuid id", True, f"ID: {data['id']}")
        else:
            log_test("Create booking - uuid id", False, f"Invalid or missing ID: {data.get('id')}")
        
        # Verify BD##### code
        if "code" in data and data["code"].startswith("BD") and len(data["code"]) == 7:
            log_test("Create booking - BD##### code", True, f"Code: {data['code']}")
        else:
            log_test("Create booking - BD##### code", False, f"Invalid code format: {data.get('code')}")
        
        # Verify status="Booked"
        if data.get("status") == "Booked":
            log_test("Create booking - status='Booked'", True)
        else:
            log_test("Create booking - status='Booked'", False, f"Status: {data.get('status')}")
        
        # Verify stage_index=0
        if data.get("stage_index") == 0:
            log_test("Create booking - stage_index=0", True)
        else:
            log_test("Create booking - stage_index=0", False, f"stage_index: {data.get('stage_index')}")
        
        return data
        
    except Exception as e:
        log_test("Create booking", False, f"Exception: {str(e)}")
        return None


def test_create_second_booking():
    """Create a second booking for the same client"""
    print("\n" + "="*80)
    print("TEST 2: Create Second Booking")
    print("="*80)
    
    payload = create_sample_booking(CLIENT_ID, "airport-to-address")
    payload["service_title"] = "Airport to Address"
    payload["name"] = "Priya Sharma"
    
    try:
        response = requests.post(f"{BASE_URL}/bookings", json=payload, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            log_test("Create second booking", True, f"Code: {data.get('code')}")
            return data
        else:
            log_test("Create second booking", False, f"Status: {response.status_code}")
            return None
            
    except Exception as e:
        log_test("Create second booking", False, f"Exception: {str(e)}")
        return None


def test_list_bookings():
    """Test GET /api/bookings?client_id=X - list bookings for client"""
    print("\n" + "="*80)
    print("TEST 3: List Bookings (GET /api/bookings?client_id=X)")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/bookings", params={"client_id": CLIENT_ID}, timeout=10)
        
        if response.status_code != 200:
            log_test("List bookings - status code", False, f"Expected 200, got {response.status_code}")
            return
        
        log_test("List bookings - status code", True, "200 OK")
        
        data = response.json()
        
        # Verify it's a list
        if not isinstance(data, list):
            log_test("List bookings - returns list", False, f"Type: {type(data)}")
            return
        
        log_test("List bookings - returns list", True, f"Count: {len(data)}")
        
        # Verify multiple bookings
        if len(data) >= 2:
            log_test("List bookings - multiple bookings", True, f"Found {len(data)} bookings")
        else:
            log_test("List bookings - multiple bookings", False, f"Expected >=2, got {len(data)}")
        
        # Verify newest first (check created_at timestamps)
        if len(data) >= 2:
            first_time = data[0].get("created_at", "")
            second_time = data[1].get("created_at", "")
            if first_time >= second_time:
                log_test("List bookings - newest first", True, f"Order correct")
            else:
                log_test("List bookings - newest first", False, f"First: {first_time}, Second: {second_time}")
        
    except Exception as e:
        log_test("List bookings", False, f"Exception: {str(e)}")


def test_get_booking_by_code(booking_code: str):
    """Test GET /api/bookings/{code} - get booking by code"""
    print("\n" + "="*80)
    print(f"TEST 4: Get Booking by Code (GET /api/bookings/{booking_code})")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/bookings/{booking_code}", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("code") == booking_code:
                log_test("Get booking by code", True, f"Retrieved booking: {booking_code}")
            else:
                log_test("Get booking by code", False, f"Code mismatch: {data.get('code')}")
        else:
            log_test("Get booking by code", False, f"Status: {response.status_code}")
            
    except Exception as e:
        log_test("Get booking by code", False, f"Exception: {str(e)}")


def test_get_booking_by_uuid(booking_id: str):
    """Test GET /api/bookings/{uuid} - get booking by uuid"""
    print("\n" + "="*80)
    print(f"TEST 5: Get Booking by UUID (GET /api/bookings/{booking_id})")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/bookings/{booking_id}", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("id") == booking_id:
                log_test("Get booking by uuid", True, f"Retrieved booking: {booking_id}")
            else:
                log_test("Get booking by uuid", False, f"ID mismatch: {data.get('id')}")
        else:
            log_test("Get booking by uuid", False, f"Status: {response.status_code}")
            
    except Exception as e:
        log_test("Get booking by uuid", False, f"Exception: {str(e)}")


def test_get_booking_404():
    """Test GET /api/bookings/{unknown} - should return 404"""
    print("\n" + "="*80)
    print("TEST 6: Get Unknown Booking (404)")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/bookings/BD99999", timeout=10)
        
        if response.status_code == 404:
            log_test("Get unknown booking - 404", True, "Correctly returned 404")
        else:
            log_test("Get unknown booking - 404", False, f"Expected 404, got {response.status_code}")
            
    except Exception as e:
        log_test("Get unknown booking - 404", False, f"Exception: {str(e)}")


def test_update_status_by_stage_index(booking_code: str):
    """Test PATCH /api/bookings/{code}/status with stage_index"""
    print("\n" + "="*80)
    print(f"TEST 7: Update Status by stage_index (PATCH /api/bookings/{booking_code}/status)")
    print("="*80)
    
    # Test stage_index=2 -> "In Transit"
    try:
        response = requests.patch(
            f"{BASE_URL}/bookings/{booking_code}/status",
            json={"stage_index": 2},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("stage_index") == 2 and data.get("status") == "In Transit":
                log_test("Update status - stage_index=2", True, "Status: In Transit")
            else:
                log_test("Update status - stage_index=2", False, 
                        f"stage_index={data.get('stage_index')}, status={data.get('status')}")
        else:
            log_test("Update status - stage_index=2", False, f"Status: {response.status_code}")
            
    except Exception as e:
        log_test("Update status - stage_index=2", False, f"Exception: {str(e)}")


def test_update_status_by_string(booking_code: str):
    """Test PATCH /api/bookings/{code}/status with status string"""
    print("\n" + "="*80)
    print(f"TEST 8: Update Status by String (PATCH /api/bookings/{booking_code}/status)")
    print("="*80)
    
    # Test status="Delivered" -> stage_index=4
    try:
        response = requests.patch(
            f"{BASE_URL}/bookings/{booking_code}/status",
            json={"status": "Delivered"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "Delivered" and data.get("stage_index") == 4:
                log_test("Update status - status='Delivered'", True, "stage_index=4")
            else:
                log_test("Update status - status='Delivered'", False, 
                        f"status={data.get('status')}, stage_index={data.get('stage_index')}")
        else:
            log_test("Update status - status='Delivered'", False, f"Status: {response.status_code}")
            
    except Exception as e:
        log_test("Update status - status='Delivered'", False, f"Exception: {str(e)}")


def test_update_status_clamping(booking_code: str):
    """Test PATCH /api/bookings/{code}/status with stage_index > 4 (should clamp to 4)"""
    print("\n" + "="*80)
    print(f"TEST 9: Update Status Clamping (stage_index=99 -> 4)")
    print("="*80)
    
    try:
        response = requests.patch(
            f"{BASE_URL}/bookings/{booking_code}/status",
            json={"stage_index": 99},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("stage_index") == 4:
                log_test("Update status - clamping", True, f"stage_index clamped to 4, status={data.get('status')}")
            else:
                log_test("Update status - clamping", False, f"stage_index={data.get('stage_index')}")
        else:
            log_test("Update status - clamping", False, f"Status: {response.status_code}")
            
    except Exception as e:
        log_test("Update status - clamping", False, f"Exception: {str(e)}")


def test_track_by_code(booking_code: str):
    """Test GET /api/track/{code}"""
    print("\n" + "="*80)
    print(f"TEST 10: Track by Code (GET /api/track/{booking_code})")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/track/{booking_code}", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("code") == booking_code:
                log_test("Track by code", True, f"Retrieved booking: {booking_code}")
            else:
                log_test("Track by code", False, f"Code mismatch: {data.get('code')}")
        else:
            log_test("Track by code", False, f"Status: {response.status_code}")
            
    except Exception as e:
        log_test("Track by code", False, f"Exception: {str(e)}")


def test_track_404():
    """Test GET /api/track/{unknown} - should return 404"""
    print("\n" + "="*80)
    print("TEST 11: Track Unknown Code (404)")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/track/BD00000", timeout=10)
        
        if response.status_code == 404:
            log_test("Track unknown code - 404", True, "Correctly returned 404")
        else:
            log_test("Track unknown code - 404", False, f"Expected 404, got {response.status_code}")
            
    except Exception as e:
        log_test("Track unknown code - 404", False, f"Exception: {str(e)}")


def test_delete_booking(booking_code: str):
    """Test DELETE /api/bookings/{code} - should set status to 'Cancelled'"""
    print("\n" + "="*80)
    print(f"TEST 12: Delete Booking (DELETE /api/bookings/{booking_code})")
    print("="*80)
    
    try:
        response = requests.delete(f"{BASE_URL}/bookings/{booking_code}", timeout=10)
        
        if response.status_code == 200:
            log_test("Delete booking - status code", True, "200 OK")
            
            # Verify status changed to "Cancelled"
            get_response = requests.get(f"{BASE_URL}/bookings/{booking_code}", timeout=10)
            if get_response.status_code == 200:
                data = get_response.json()
                if data.get("status") == "Cancelled":
                    log_test("Delete booking - status='Cancelled'", True)
                else:
                    log_test("Delete booking - status='Cancelled'", False, f"Status: {data.get('status')}")
            else:
                log_test("Delete booking - verify cancelled", False, "Could not retrieve booking after delete")
        else:
            log_test("Delete booking", False, f"Status: {response.status_code}")
            
    except Exception as e:
        log_test("Delete booking", False, f"Exception: {str(e)}")


def test_delete_404():
    """Test DELETE /api/bookings/{unknown} - should return 404"""
    print("\n" + "="*80)
    print("TEST 13: Delete Unknown Booking (404)")
    print("="*80)
    
    try:
        response = requests.delete(f"{BASE_URL}/bookings/BD00001", timeout=10)
        
        if response.status_code == 404:
            log_test("Delete unknown booking - 404", True, "Correctly returned 404")
        else:
            log_test("Delete unknown booking - 404", False, f"Expected 404, got {response.status_code}")
            
    except Exception as e:
        log_test("Delete unknown booking - 404", False, f"Exception: {str(e)}")


def print_summary():
    """Print test summary"""
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    print(f"Total Tests: {test_results['total']}")
    print(f"Passed: {len(test_results['passed'])}")
    print(f"Failed: {len(test_results['failed'])}")
    print(f"Success Rate: {len(test_results['passed'])/test_results['total']*100:.1f}%")
    
    if test_results['failed']:
        print("\n❌ FAILED TESTS:")
        for failure in test_results['failed']:
            print(f"  - {failure['name']}")
            if failure['details']:
                print(f"    {failure['details']}")
    else:
        print("\n✅ ALL TESTS PASSED!")


def main():
    """Run all backend tests"""
    print("="*80)
    print("BAGDROP BOOKING BACKEND API TESTS")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print(f"Client ID: {CLIENT_ID}")
    print("="*80)
    
    # Test 1: Create first booking
    booking1 = test_create_booking()
    if not booking1:
        print("\n❌ CRITICAL: Could not create first booking. Stopping tests.")
        print_summary()
        return
    
    booking1_code = booking1.get("code")
    booking1_id = booking1.get("id")
    
    # Test 2: Create second booking
    booking2 = test_create_second_booking()
    
    # Test 3: List bookings
    test_list_bookings()
    
    # Test 4-6: Get booking by code, uuid, and 404
    test_get_booking_by_code(booking1_code)
    test_get_booking_by_uuid(booking1_id)
    test_get_booking_404()
    
    # Test 7-9: Update status
    test_update_status_by_stage_index(booking1_code)
    test_update_status_by_string(booking1_code)
    test_update_status_clamping(booking1_code)
    
    # Test 10-11: Track endpoint
    test_track_by_code(booking1_code)
    test_track_404()
    
    # Test 12-13: Delete booking
    if booking2:
        booking2_code = booking2.get("code")
        test_delete_booking(booking2_code)
    test_delete_404()
    
    # Print summary
    print_summary()


if __name__ == "__main__":
    main()
