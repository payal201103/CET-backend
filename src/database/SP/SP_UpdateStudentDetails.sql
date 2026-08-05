-- SP_UpdateStudentDetails
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_UpdateStudentDetails]
(
    @childUID BIGINT,
    @studentName NVARCHAR(100) = NULL,
    @fatherName NVARCHAR(100) = NULL,
    @surname NVARCHAR(100) = NULL,
    @genderId INT = NULL,
    @birthDate DATE = NULL,
    @birthCertificateDocument NVARCHAR(255) = NULL,
    @categoryId INT = NULL,
    @castCertificateDocument NVARCHAR(255) = NULL,
    @subCategoryId INT = NULL,
    @subCategoryDocument NVARCHAR(255) = NULL,
    @psId INT,
    @psDocument NVARCHAR(255) = NULL,
    @isLandDonor BIT = NULL,
    @landDonorDocument NVARCHAR(255) = NULL,
    @isDisabilityMoreThen40 INT = NULL,
    @disabilityPercentage INT = NULL,
    @disabilityType INT = NULL,
    @disabilityCertificateDocument NVARCHAR(255) = NULL,
    @isStd1To5GovtGrantCompleted INT = NULL,
    @addressDistrictId INT = NULL,
    @addressBlockId INT = NULL,
    @addressVillageId INT = NULL,
    @domicileCertificate NVARCHAR(255) = NULL,
    @parentMo VARCHAR(10) = NULL,
    @password VARCHAR(500) = NULL,
    @ipAddress VARCHAR(25) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF EXISTS (
            SELECT 1
            FROM config
            WHERE id = 'REGISTRATION'
              AND value = 0
        )
        BEGIN
            RAISERROR('Registration time is over. New registration is not allowed.', 16, 1);
            RETURN;
        END

        IF NOT EXISTS (SELECT 1 FROM student_details WHERE childUID = @childUID)
        BEGIN
            RAISERROR('Student not found.', 16, 1);
            RETURN;
        END

        DECLARE @currentRegistered INT;
        DECLARE @currentApproved INT;

        SELECT
            @currentRegistered = isRegistered,
            @currentApproved = isApproved
        FROM dbo.student_details
        WHERE childUID = @childUID;

        IF @currentRegistered = 1 AND @currentApproved = 1
        BEGIN
            RAISERROR('Form already approved. Cannot update again.', 16, 1);
            RETURN;
        END

        IF @parentMo IS NOT NULL
        BEGIN
            DECLARE @MobileCount INT;

            SELECT @MobileCount = COUNT(DISTINCT childUID)
            FROM student_details
            WHERE parentMo = @parentMo
              AND childUID <> @childUID;

            IF @MobileCount >= 3
            BEGIN
                RAISERROR('This parent mobile number is already used for 3 different students. Cannot use for more than 3 childUID.', 16, 1);
                RETURN;
            END
        END

        UPDATE student_details
        SET
            studentName = @studentName,
            fatherName = @fatherName,
            surname = @surname,
            genderId = @genderId,
            birthDate = @birthDate,
            birthCertificateDocument = @birthCertificateDocument,
            categoryId = @categoryId,
            castCertificateDocument = @castCertificateDocument,
            subCategoryId = @subCategoryId,
            subCategoryDocument = @subCategoryDocument,
            psId = @psId,
            psDocument = @psDocument,
            isLandDonor = @isLandDonor,
            landDonorDocument = @landDonorDocument,
            isDisabilityMoreThen40 = @isDisabilityMoreThen40,
            disabilityPercentage = @disabilityPercentage,
            disabilityType = @disabilityType,
            disabilityCertificateDocument = @disabilityCertificateDocument,
            isStd1To5GovtGrantCompleted = @isStd1To5GovtGrantCompleted,
            addressDistrictId = @addressDistrictId,
            addressBlockId = @addressBlockId,
            addressVillageId = @addressVillageId,
            domicileCertificate = @domicileCertificate,
            parentMo = @parentMo,
            isRegistered = 1,
            isApproved = CASE
                            WHEN @isStd1To5GovtGrantCompleted = 1 THEN 1
                            ELSE NULL
                         END,
            updatedAt = SYSDATETIME(),
            ipAddress = @ipAddress
        WHERE childUID = @childUID;

        SELECT 'Student Registration successfully.' AS message;

        IF NOT EXISTS (
            SELECT 1
            FROM user_master
            WHERE entityId = CAST(@childUID AS VARCHAR(50))
        )
        BEGIN
            INSERT INTO user_master
            (
                roleId, userName, entityId, mobileNo, password, isActive, createdAt, ipAddress
            )
            VALUES
            (
                3, CAST(@childUID AS VARCHAR(50)), CAST(@childUID AS VARCHAR(50)), @parentMo, @password, 1, SYSDATETIME(), @ipAddress
            );
        END
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
