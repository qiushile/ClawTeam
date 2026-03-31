import json
import os
from pathlib import Path

def fix_openclaw_json(file_path):
    print(f"Checking {file_path}...")
    with open(file_path, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            print(f"Error decoding {file_path}")
            return

    changed = False
    
    # Select variable names based on directory
    if "sentinel" in str(file_path):
        id_var = "${FEISHU_SENTINEL_APP_ID}"
        secret_var = "${FEISHU_SENTINEL_APP_SECRET}"
    else:
        # For docker-compose services, they map FEISHU_APP_ID
        id_var = "${FEISHU_APP_ID}"
        secret_var = "${FEISHU_APP_SECRET}"

    # Fix channels.feishu
    if "channels" in data and "feishu" in data["channels"]:
        feishu = data["channels"]["feishu"]
        if feishu.get("appId") != id_var:
            feishu["appId"] = id_var
            changed = True
        if feishu.get("appSecret") != secret_var:
            feishu["appSecret"] = secret_var
            changed = True
            
    if changed:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"  Fixed {file_path}")
    else:
        print(f"  No changes needed for {file_path}")

def main():
    base_dir = Path("/Users/qiushile/WorkStation/mine/claw/ClawTeam")
    for json_file in base_dir.glob("**/openclaw.json"):
        if "node_modules" in str(json_file):
            continue
        fix_openclaw_json(json_file)

if __name__ == "__main__":
    main()
