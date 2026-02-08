# --- Script to open terminals and run Hardhat commands ---

Write-Host "Starting Hardhat Node in a new terminal..."

# Start the first terminal for 'npx hardhat node'
Start-Process pwsh -ArgumentList "-NoExit -Command & {npx hardhat node}"

Start-Sleep -Seconds 5 # Give the node a moment to start up

Write-Host "Opening another terminal for compile and deploy..."

# Start the second terminal for compile and deploy
Start-Process pwsh -ArgumentList "-NoExit -Command & {npx hardhat clean && npx hardhat compile}"
Start-Sleep -Seconds 5

Start-Process pwsh -ArgumentList "-NoExit -Command & {npx hardhat ignition deploy ignition/modules/deployer.js --network localhost}"
Write-Host "Commands initiated. Check the new terminal windows for output."

