import json
import os
import requests

def main():
    sarif_path = "results.sarif"
    if not os.path.exists(sarif_path):
        sarif_path = "github-codeql-sarif"
    
    # Load the JSON file containing the issuer information
    with open(sarif_path, "r") as f:
        data = json.load(f)

    results = data["runs"][0]["results"]
    high_priority = [r for r in results if r["level"] == "error"]

    for error in high_priority[0:1]:
        rule_id = error["ruleId"]
        message = error["message"]["text"]
        

        location = error["locations"][0]["physicalLocation"]["artifactLocation"]["uri"]
        line = error["locations"][0]["physicalLocation"]["region"]["startLine"]

        prompt = f"I need you to fix a security vulnerability in the code. Location: {location}:{line}. Issue: {message}. Please: 1. Reproduce the vulnerability with a test case. 2. Apply a fix to the code. 3. Run existing tests to ensure no regressions are introduced. 4. Provide a detailed explanation of the changes made and how they address the vulnerability. 5. Submit a Pull Request with the fix."

        headers = {"Authorization": f"Bearer {os.getenv('DEVIN_API_KEY')}", "Content-Type": "application/json"}

        payload = {"prompt": prompt, "idempotency_key": f"{rule_id}_{location}_{line}"}

        response = requests.post("https://api.devin.ai/v3/organisations/org-7aaaba4d64474a1a931e3aa3323b5ce8/sessions", headers=headers, json=payload)    

        if response.status_code == 200:
            print(f"Successfully created session for {rule_id} at {location}:{line}")
        else:            
            print(f"Failed to create session for {rule_id} at {location}:{line}. Status code: {response.status_code}, Response: {response.text}")    

if __name__ == "__main__":
    main()