-- SP_GetStudentDataByChildUID
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_GetStudentDataByChildUID]
(
    @childUID BIGINT,
    @roundNo INT,
    @roleId INT,
    @distictId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF NOT EXISTS (
            SELECT 1
            FROM student_details
            WHERE childUID = @childUID
        )
        BEGIN
            RAISERROR('Student not found.', 16, 1);
            RETURN;
        END

        IF @roleId = 4
        BEGIN
            IF NOT EXISTS (
                SELECT 1
                FROM student_details sd
                INNER JOIN school_master sm
                    ON sd.schoolId = sm.schoolId
                    AND sm.districtId = @distictId
                WHERE sd.childUID = @childUID
            )
            BEGIN
                RAISERROR('You cannot access student from another district.', 16, 1);
                RETURN;
            END
        END

        SELECT
            sd.childUID,
            sd.schoolId,
            sd.studentName,
            sd.fatherName,
            sd.surname,
            sd.genderId,
            sd.birthDate,
            sd.birthCertificateDocument,
            sd.categoryId,
            GM.genderName,
            CM.casteName,
            SCM.subCasteName,
            CASE WHEN sd.isStd1To5GovtGrantCompleted = 1 THEN 'YES' ELSE 'NO' END AS isStd1To5GovtGrantCompleted,
            CASE WHEN sd.isRegistered = 1 THEN 1 ELSE 0 END AS isRegistered,
            CASE WHEN sd.isApproved = 1 THEN 1 ELSE 0 END AS isApproved,
            CASE
                WHEN sd.isRegistered IN (0,1) THEN 1
                ELSE 0
            END AS isRegistrationReset,
            CASE
                WHEN EXISTS (
                    SELECT 1
                    FROM student_approval_status_master sm
                    WHERE sm.childUID = sd.childUID
                )
                THEN 1
                ELSE 0
            END AS isApproverProcessReset,
            CASE
                WHEN EXISTS (
                    SELECT 1
                    FROM student_choice_filling_master sc
                    WHERE sc.childUID = sd.childUID
                      AND sc.roundNo = @roundNo
                      AND sc.isDeleted = 0
                )
                THEN 1
                ELSE 0
            END AS isChoiceFillingRese
        FROM student_details sd
        LEFT JOIN gender_master GM ON sd.genderId = GM.genderId
        LEFT JOIN caste_master CM ON sd.categoryId = CM.categoryId
        LEFT JOIN sub_caste_master SCM ON sd.subCategoryId = SCM.subCategoryId
        WHERE sd.childUID = @childUID;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
