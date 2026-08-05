-- SP_GetStudentDetailsByChildUID
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_GetStudentDetailsByChildUID]
(
    @childUID BIGINT = 240107009012120002,
    @userId BIGINT = 11
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF @userId IS NULL
        BEGIN
            IF EXISTS (
                SELECT 1
                FROM student_details SD
                INNER JOIN school_master SM
                    ON SD.schoolId = SM.schoolId
                WHERE SD.childUID = @childUID
                  AND SM.schoolManagementId != 5
            )
            BEGIN
                RAISERROR('You are not allowed to register from this school management.', 16, 1);
                RETURN;
            END
        END

        IF NOT EXISTS (SELECT 1 FROM student_details WHERE childUID = @childUID)
        BEGIN
            RAISERROR('Student not found.', 16, 1);
            RETURN;
        END

        IF EXISTS (
            SELECT 1
            FROM student_details
            WHERE childUID = @childUID
              AND isRegistered = 1
        )
        BEGIN
            RAISERROR('Your form has already been submitted.', 16, 1);
            RETURN;
        END

        SELECT
            SD.childUID,
            SD.schoolId,
            SD.studentName,
            SD.fatherName,
            SD.surname,
            SD.genderId,
            GM.genderName,
            CONVERT(VARCHAR(10), SD.birthDate, 120) AS birthDate,
            SD.birthCertificateDocument,
            SD.categoryId,
            CM.casteName,
            SD.castCertificateDocument,
            SD.subCategoryId,
            SCM.subCasteName,
            SD.subCategoryDocument,
            SD.psId,
            PSM.statusName,
            SD.psDocument,
            CASE WHEN SD.isLandDonor = 1 THEN 1 ELSE 0 END AS landDonor,
            SD.landDonorDocument,
            CASE WHEN SD.isDisabilityMoreThen40 = 1 THEN 1 ELSE 0 END AS isDisabilityMoreThen40,
            SD.disabilityPercentage,
            SD.disabilityType,
            DM.disabilityName,
            SD.disabilityCertificateDocument,
            CASE WHEN SD.isStd1To5GovtGrantCompleted = 1 THEN 1 ELSE 0 END AS isStd1To5GovtGrantCompleted,
            SD.addressDistrictId,
            D.districtName,
            SD.addressBlockId,
            B.blockName,
            SD.addressVillageId,
            V.villageName,
            SD.domicileCertificate,
            SD.parentMo,
            S.schoolManagementId,
            SM.schoolManagementName,
            CASE
                WHEN SD.isApproved = 0 AND SD.isRegistered = 0
                THEN (
                    SELECT TOP 1
                        ASM.approverId,
                        CASE WHEN ASM.section1 = 1 THEN 1 ELSE 0 END section1,
                        ASM.section1RejectedReason,
                        CASE WHEN ASM.section2 = 1 THEN 1 ELSE 0 END section2,
                        ASM.section2RejectedReason,
                        CASE WHEN ASM.section3 = 1 THEN 1 ELSE 0 END section3,
                        ASM.section3RejectedReason,
                        CASE WHEN ASM.section4 = 1 THEN 1 ELSE 0 END section4,
                        ASM.section4RejectedReason
                    FROM student_approval_status_master ASM
                    WHERE ASM.childUID = SD.childUID
                      AND SD.isApproved = 0
                      AND SD.isRegistered = 0
                    ORDER BY ASM.createdAt DESC
                    FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
                )
                ELSE NULL
            END AS approvalStatus
        FROM student_details SD
        LEFT JOIN gender_master GM ON SD.genderId = GM.genderId
        LEFT JOIN caste_master CM ON SD.categoryId = CM.categoryId
        LEFT JOIN sub_caste_master SCM ON SD.subCategoryId = SCM.subCategoryId
        LEFT JOIN parent_status_master PSM ON SD.psId = PSM.psId
        LEFT JOIN disability_master DM ON SD.disabilityType = DM.disabilityId
        LEFT JOIN district_master D ON SD.addressDistrictId = D.districtId
        LEFT JOIN block_master B ON SD.addressBlockId = B.blockId
        LEFT JOIN village_master V ON SD.addressVillageId = V.villageId
        LEFT JOIN school_master S ON SD.schoolId = S.schoolId
        LEFT JOIN school_management_master SM ON S.schoolManagementId = SM.schoolManagementId
        WHERE SD.childUID = @childUID;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
