-- SP_ResetStudentForm
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_ResetStudentForm]
(
    @childUID BIGINT,
    @userId INT,
    @roundNo INT,
    @resetReason NVARCHAR(500),
    @ipAddress VARCHAR(25)
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        IF NOT EXISTS (
            SELECT 1
            FROM student_details WITH (UPDLOCK, HOLDLOCK)
            WHERE childUID = @childUID
        )
        BEGIN
            RAISERROR('Student not found.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        IF EXISTS (
            SELECT 1
            FROM student_choice_filling_master
            WHERE childUID = @childUID
              AND roundNo = @roundNo
              AND isDeleted = 0
        )
        BEGIN
            RAISERROR('Choice filling must be reset first.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        IF EXISTS (
            SELECT 1
            FROM student_approval_status_master
            WHERE childUID = @childUID
              AND isDeleted = 0
        )
        BEGIN
            RAISERROR('Approver process must be reset first.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        INSERT INTO student_data_reset_log
        (
            childUID,
            schoolId,
            studentName,
            fatherName,
            surname,
            genderId,
            birthDate,
            birthCertificateDocument,
            categoryId,
            castCertificateDocument,
            subCategoryId,
            subCategoryDocument,
            psId,
            psDocument,
            isLandDonor,
            landDonorDocument,
            isDisabilityMoreThen40,
            disabilityPercentage,
            disabilityType,
            disabilityCertificateDocument,
            isStd1To5GovtGrantCompleted,
            addressDistrictId,
            addressBlockId,
            addressVillageId,
            domicileCertificate,
            parentMo,
            isRegistered,
            isApproved,
            ipAddress
        )
        SELECT
            childUID,
            schoolId,
            studentName,
            fatherName,
            surname,
            genderId,
            birthDate,
            birthCertificateDocument,
            categoryId,
            castCertificateDocument,
            subCategoryId,
            subCategoryDocument,
            psId,
            psDocument,
            isLandDonor,
            landDonorDocument,
            isDisabilityMoreThen40,
            disabilityPercentage,
            disabilityType,
            disabilityCertificateDocument,
            isStd1To5GovtGrantCompleted,
            addressDistrictId,
            addressBlockId,
            addressVillageId,
            domicileCertificate,
            parentMo,
            isRegistered,
            isApproved,
            @ipAddress
        FROM student_details
        WHERE childUID = @childUID;

        UPDATE student_details
        SET
            birthCertificateDocument = NULL,
            categoryId = NULL,
            castCertificateDocument = NULL,
            subCategoryId = NULL,
            subCategoryDocument = NULL,
            psId = NULL,
            psDocument = NULL,
            isLandDonor = NULL,
            landDonorDocument = NULL,
            isDisabilityMoreThen40 = NULL,
            disabilityPercentage = NULL,
            disabilityType = NULL,
            disabilityCertificateDocument = NULL,
            isStd1To5GovtGrantCompleted = NULL,
            addressVillageId = NULL,
            domicileCertificate = NULL,
            parentMo = NULL,
            isRegistered = NULL,
            isApproved = NULL,
            updatedAt = SYSDATETIME()
        WHERE childUID = @childUID;

        INSERT INTO student_reset_logs
        (
            childUID, userId, resetType, resetReason, ipAddress
        )
        VALUES
        (
            @childUID, @userId, 'REGISTRATION_FORM_RESET', @resetReason, @ipAddress
        );

        COMMIT TRANSACTION;

        SELECT 'Student registration form reset successfully.' AS message;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW;
    END CATCH
END;
GO
