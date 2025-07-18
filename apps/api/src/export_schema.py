import json
from pathlib import Path

from src.main import app


def export_openapi_schema():
    schema = app.openapi()
    output_path = Path(__file__).parent.parent / "openapi.json"
    with open(output_path, "w") as f:
        json.dump(schema, f, indent=2)
    print(f"✅ OpenAPI schema exported to {output_path}")


if __name__ == "__main__":
    export_openapi_schema()
