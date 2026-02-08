// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"; // Changed 'require' to 'import'

export default buildModule("SystemDeploymentModule", (m) => {

  const users = m.contract("Users");
  const funderRegistry = m.contract("FunderRegistry");
  const bankAccount = m.contract("BankAccountRegistry");
  const fundingContract = m.contract("FundingContract");
  const fundingConditions = m.contract("FundingConditions");
  const paymentsRegistry = m.contract("PaymentsRegistry");
  // Optionally, you can make the deployed contracts available for other modules
  // or for verification tools.
  return { funderRegistry, users, bankAccount, fundingContract, fundingConditions, paymentsRegistry };
});