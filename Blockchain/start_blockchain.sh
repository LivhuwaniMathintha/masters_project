#!/bin/bash

# --- Script to open terminals and run Hardhat commands on macOS ---

# Use the current directory as the project directory
PROJECT_DIR="$(pwd)"

# Check if package.json exists to verify this is a Hardhat project
if [ ! -f "$PROJECT_DIR/package.json" ]; then
    echo "Error: package.json not found in '$PROJECT_DIR'. Ensure you're running this script from the Hardhat project root."
    exit 1
fi

# Check if npx is installed
if ! command -v npx &> /dev/null; then
    echo "Error: npx is not installed. Ensure Node.js is installed."
    exit 1
fi

echo "Starting Hardhat Node in a new terminal..."

# Open a new terminal window for 'npx hardhat node'
osascript -e "tell application \"Terminal\" to do script \"cd $PROJECT_DIR && npx hardhat node\""

# Wait for the node to start
sleep 10

echo "Running Hardhat clean and compile..."

# Open a new terminal window for clean and compile
osascript -e "tell application \"Terminal\" to do script \"cd $PROJECT_DIR && npx hardhat clean && npx hardhat compile\""

# Wait for compilation to complete
sleep 10

echo "Deploying contracts..."

# Open a new terminal window for deployment
osascript -e "tell application \"Terminal\" to do script \"cd $PROJECT_DIR && npx hardhat ignition deploy ignition/modules/deployer.js --network localhost\""

echo "Commands initiated. Check the new Terminal windows for output."

echo "Starting FastAPI server in a new terminal..."

FASTAPI_DIR="${PROJECT_DIR}/../MachineLearningAPI"

# Open a new terminal window for FastAPI server
osascript -e "tell application \"Terminal\" to do script \"cd $FASTAPI_DIR/../MachineLearningAPI && source venv/bin/activate && uvicorn main:app --reload --port 8000\""

echo "Commands initiated. Check the new Terminal windows for output."