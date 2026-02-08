const { expect } = require("chai");
const { ethers } = require("hardhat");

// Helper function to convert a UUID string to a bytes16 hex string
// This is crucial for matching the bytes16 type in Solidity
function uuidToBytes16(uuid) {
  // Remove hyphens and ensure it's 32 hex characters
  const cleanUuid = uuid.replace(/-/g, '');
  if (cleanUuid.length !== 32) {
    throw new Error("Invalid UUID string length");
  }
  // Prepend '0x' to make it a hex string for ethers
  return `0x${cleanUuid}`;
}

describe("StudentRegistry", function () {
  let studentRegistry;
  let owner;
  let addr1;

  // Deploy a fresh contract before each test
  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners(); // Get signers (accounts)
    const StudentRegistryFactory = await ethers.getContractFactory("StudentRegistry");
    studentRegistry = await StudentRegistryFactory.deploy();
    await studentRegistry.deployed(); // Wait for the contract to be deployed
    console.log(`StudentRegistry deployed to: ${studentRegistry.address}`);
  });

  describe("addStudent", function () {
    it("Should add a new student and emit an event", async function () {
      const studentId = uuidToBytes16("a1b2c3d4-e5f6-7890-1234-567890abcdef");
      const studentNumber = 1001;
      const institutionId = uuidToBytes16("b1c2d3e4-f5a6-0987-6543-210fedcba987");
      const fullName = "Alice Smith";
      const isActive = true;
      const funderContractId = uuidToBytes16("c1d2e3f4-a5b6-7890-abcd-ef0123456789");
      const isChangeConfirmed = false;
      const bankAccountId = uuidToBytes16("d1e2f3a4-b5c6-0987-fedc-ba9876543210");
      const modifiedBy = "TestUser";
      const updatedAt = "2023-01-01 10:00:00";
      const courseName = "Computer Science";

      // Expect the transaction to emit the StudentAdded event
      await expect(
        studentRegistry.addStudent(
          studentId,
          studentNumber,
          institutionId,
          fullName,
          isActive,
          funderContractId,
          isChangeConfirmed,
          bankAccountId,
          modifiedBy,
          updatedAt,
          courseName
        )
      )
        .to.emit(studentRegistry, "StudentAdded")
        .withArgs(studentId, studentNumber, institutionId);

      // Verify the student was added by trying to retrieve them
      const retrievedStudent = await studentRegistry.getStudentByNumber(studentNumber);

      expect(retrievedStudent.id).to.equal(studentId);
      expect(retrievedStudent.studentNumber).to.equal(studentNumber);
      expect(retrievedStudent.fullName).to.equal(fullName);
      expect(retrievedStudent.isActive).to.equal("true"); // Note: Solidity returns "true"/"false" strings
      expect(retrievedStudent.courseName).to.equal(courseName);
    });

    it("Should revert if student ID already exists", async function () {
      const studentId = uuidToBytes16("a1b2c3d4-e5f6-7890-1234-567890abcdef");
      const studentNumber = 1001;
      const institutionId = uuidToBytes16("b1c2d3e4-f5a6-0987-6543-210fedcba987");
      const fullName = "Alice Smith";
      const isActive = true;
      const funderContractId = uuidToBytes16("c1d2e3f4-a5b6-7890-abcd-ef0123456789");
      const isChangeConfirmed = false;
      const bankAccountId = uuidToBytes16("d1e2f3a4-b5c6-0987-fedc-ba9876543210");
      const modifiedBy = "TestUser";
      const updatedAt = "2023-01-01 10:00:00";
      const courseName = "Computer Science";

      // Add the student first
      await studentRegistry.addStudent(
        studentId,
        studentNumber,
        institutionId,
        fullName,
        isActive,
        funderContractId,
        isChangeConfirmed,
        bankAccountId,
        modifiedBy,
        updatedAt,
        courseName
      );

      // Try to add the same student again and expect a revert
      await expect(
        studentRegistry.addStudent(
          studentId, // Same ID
          1002, // Different number, but ID is primary key
          institutionId,
          "Bob Johnson",
          true,
          funderContractId,
          true,
          bankAccountId,
          "AnotherUser",
          "2023-01-02 11:00:00",
          "Mathematics"
        )
      ).to.be.revertedWith("StudentRegistry: Student already exists.");
    });
  });

  describe("getStudentByNumber", function () {
    const studentId = uuidToBytes16("a1b2c3d4-e5f6-7890-1234-567890abcdef");
    const studentNumber = 1001;
    const institutionId = uuidToBytes16("b1c2d3e4-f5a6-0987-6543-210fedcba987");
    const fullName = "Alice Smith";
    const isActive = true;
    const funderContractId = uuidToBytes16("c1d2e3f4-a5b6-7890-abcd-ef0123456789");
    const isChangeConfirmed = false;
    const bankAccountId = uuidToBytes16("d1e2f3a4-b5c6-0987-fedc-ba9876543210");
    const modifiedBy = "TestUser";
    const updatedAt = "2023-01-01 10:00:00";
    const courseName = "Computer Science";

    beforeEach(async function () {
      // Add a student before tests in this block
      await studentRegistry.addStudent(
        studentId,
        studentNumber,
        institutionId,
        fullName,
        isActive,
        funderContractId,
        isChangeConfirmed,
        bankAccountId,
        modifiedBy,
        updatedAt,
        courseName
      );
    });

    it("Should retrieve a student by their student number", async function () {
      const retrievedStudent = await studentRegistry.getStudentByNumber(studentNumber);

      expect(retrievedStudent.id).to.equal(studentId);
      expect(retrievedStudent.studentNumber).to.equal(studentNumber);
      expect(retrievedStudent.institutionId).to.equal(institutionId);
      expect(retrievedStudent.fullName).to.equal(fullName);
      expect(retrievedStudent.isActive).to.equal("true");
      expect(retrievedStudent.funderContractId).to.equal(funderContractId);
      expect(retrievedStudent.isChangeConfirmed).to.equal(isChangeConfirmed);
      expect(retrievedStudent.bankAccountId).to.equal(bankAccountId);
      expect(retrievedStudent.modifiedBy).to.equal(modifiedBy);
      expect(retrievedStudent.updatedAt).to.equal(updatedAt);
      expect(retrievedStudent.courseName).to.equal(courseName);
    });

    it("Should revert if student number does not exist", async function () {
      await expect(studentRegistry.getStudentByNumber(9999)).to.be.revertedWith(
        "StudentRegistry: Student not found."
      );
    });
  });

  describe("updateStudentByNumber", function () {
    const studentId = uuidToBytes16("a1b2c3d4-e5f6-7890-1234-567890abcdef");
    const studentNumber = 1001;
    const institutionId = uuidToBytes16("b1c2d3e4-f5a6-0987-6543-210fedcba987");
    const fullName = "Alice Smith";
    const isActive = true;
    const funderContractId = uuidToBytes16("c1d2e3f4-a5b6-7890-abcd-ef0123456789");
    const isChangeConfirmed = false;
    const bankAccountId = uuidToBytes16("d1e2f3a4-b5c6-0987-fedc-ba9876543210");
    const modifiedBy = "TestUser";
    const updatedAt = "2023-01-01 10:00:00";
    const courseName = "Computer Science";

    beforeEach(async function () {
      // Add a student before tests in this block
      await studentRegistry.addStudent(
        studentId,
        studentNumber,
        institutionId,
        fullName,
        isActive,
        funderContractId,
        isChangeConfirmed,
        bankAccountId,
        modifiedBy,
        updatedAt,
        courseName
      );
    });

    it("Should update an existing student's details by student number", async function () {
      const newFullName = "Alice Wonderland";
      const newIsActive = false;
      const newFunderContractId = uuidToBytes16("e1f2a3b4-c5d6-7890-1234-567890abcdef");
      const newBankAccountId = uuidToBytes16("f1a2b3c4-d5e6-0987-6543-210fedcba987");
      const newModifiedBy = "Admin";
      const newUpdatedAt = "2023-01-02 12:00:00";
      const newCourseName = "Data Science";

      await studentRegistry.updateStudentByNumber(
        studentNumber,
        newFullName,
        newIsActive,
        newFunderContractId,
        newBankAccountId,
        newModifiedBy,
        newUpdatedAt,
        newCourseName
      );

      const updatedStudent = await studentRegistry.getStudentByNumber(studentNumber);

      expect(updatedStudent.fullName).to.equal(newFullName);
      expect(updatedStudent.isActive).to.equal("false"); // Note: Solidity returns "true"/"false" strings
      expect(updatedStudent.funderContractId).to.equal(newFunderContractId);
      expect(updatedStudent.bankAccountId).to.equal(newBankAccountId);
      expect(updatedStudent.modifiedBy).to.equal(newModifiedBy);
      expect(updatedStudent.updatedAt).to.equal(newUpdatedAt);
      expect(updatedStudent.courseName).to.equal(newCourseName);
    });

    it("Should revert if student number to update does not exist", async function () {
      const nonExistentStudentNumber = 9999;
      await expect(
        studentRegistry.updateStudentByNumber(
          nonExistentStudentNumber,
          "Non Existent",
          true,
          uuidToBytes16("00000000-0000-0000-0000-000000000000"),
          uuidToBytes16("00000000-0000-0000-0000-000000000000"),
          "Updater",
          "Now",
          "Course"
        )
      ).to.be.revertedWith("StudentRegistry: Student not found.");
    });
  });

  describe("getAllStudents", function () {
    it("Should return all added students", async function () {
      // Add multiple students
      const student1Id = uuidToBytes16("11111111-1111-1111-1111-111111111111");
      const student1Number = 1001;
      await studentRegistry.addStudent(
        student1Id,
        student1Number,
        uuidToBytes16("00000000-0000-0000-0000-000000000001"),
        "Alice",
        true,
        uuidToBytes16("00000000-0000-0000-0000-000000000002"),
        false,
        uuidToBytes16("00000000-0000-0000-0000-000000000003"),
        "Sys",
        "Date1",
        "CS"
      );

      const student2Id = uuidToBytes16("22222222-2222-2222-2222-222222222222");
      const student2Number = 1002;
      await studentRegistry.addStudent(
        student2Id,
        student2Number,
        uuidToBytes16("00000000-0000-0000-0000-000000000004"),
        "Bob",
        false,
        uuidToBytes16("00000000-0000-0000-0000-000000000005"),
        true,
        uuidToBytes16("00000000-0000-0000-0000-000000000006"),
        "Sys",
        "Date2",
        "Math"
      );

      const student3Id = uuidToBytes16("33333333-3333-3333-3333-333333333333");
      const student3Number = 1003;
      await studentRegistry.addStudent(
        student3Id,
        student3Number,
        uuidToBytes16("00000000-0000-0000-0000-000000000007"),
        "Charlie",
        true,
        uuidToBytes16("00000000-0000-0000-0000-000000000008"),
        false,
        uuidToBytes16("00000000-0000-0000-0000-000000000009"),
        "Sys",
        "Date3",
        "Physics"
      );

      const allStudents = await studentRegistry.getAllStudents();

      // Check lengths of all arrays
      expect(allStudents.ids.length).to.equal(3);
      expect(allStudents.studentNumbers.length).to.equal(3);
      expect(allStudents.fullNames.length).to.equal(3);
      // ... and so on for all other arrays

      // Verify data for student 1
      expect(allStudents.ids[0]).to.equal(student1Id);
      expect(allStudents.studentNumbers[0]).to.equal(student1Number);
      expect(allStudents.fullNames[0]).to.equal("Alice");
      expect(allStudents.isActives[0]).to.equal("true");
      expect(allStudents.courseNames[0]).to.equal("CS");

      // Verify data for student 2
      expect(allStudents.ids[1]).to.equal(student2Id);
      expect(allStudents.studentNumbers[1]).to.equal(student2Number);
      expect(allStudents.fullNames[1]).to.equal("Bob");
      expect(allStudents.isActives[1]).to.equal("false");
      expect(allStudents.courseNames[1]).to.equal("Math");

      // Verify data for student 3
      expect(allStudents.ids[2]).to.equal(student3Id);
      expect(allStudents.studentNumbers[2]).to.equal(student3Number);
      expect(allStudents.fullNames[2]).to.equal("Charlie");
      expect(allStudents.isActives[2]).to.equal("true");
      expect(allStudents.courseNames[2]).to.equal("Physics");
    });

    it("Should return empty arrays if no students are added", async function () {
      const allStudents = await studentRegistry.getAllStudents();
      expect(allStudents.ids.length).to.equal(0);
      expect(allStudents.studentNumbers.length).to.equal(0);
      expect(allStudents.fullNames.length).to.equal(0);
      // Add checks for all other arrays as well
      expect(allStudents.institutionIds.length).to.equal(0);
      expect(allStudents.isActives.length).to.equal(0);
      expect(allStudents.funderContractIds.length).to.equal(0);
      expect(allStudents.isChangeConfirmeds.length).to.equal(0);
      expect(allStudents.bankAccountIds.length).to.equal(0);
      expect(allStudents.modifiedBys.length).to.equal(0);
      expect(allStudents.updatedAts.length).to.equal(0);
      expect(allStudents.courseNames.length).to.equal(0);
    });
  });
});
