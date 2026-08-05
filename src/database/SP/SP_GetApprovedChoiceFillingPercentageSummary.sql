-- SP_GetApprovedChoiceFillingPercentageSummary
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_GetApprovedChoiceFillingPercentageSummary]
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        WITH approved_student AS
        (
            SELECT COUNT(sd.childUID) AS APPROVED_STUDNET
            FROM student_details sd
            WHERE sd.isRegistered = 1
              AND sd.isApproved = 1
        ),
        choice_filling_completed AS
        (
            SELECT COUNT(DISTINCT scm.childUID) AS CHOICE_FILLING_COMPLETED_STUDENT
            FROM student_choice_filling_master scm
            INNER JOIN student_details sd ON sd.childUID = scm.childUID
            WHERE scm.isDeleted = 0
              AND sd.isRegistered = 1
              AND sd.isApproved = 1
        )
        SELECT
            aps.APPROVED_STUDNET,
            cfc.CHOICE_FILLING_COMPLETED_STUDENT,
            CAST(cfc.CHOICE_FILLING_COMPLETED_STUDENT * 100.0
                / NULLIF(aps.APPROVED_STUDNET, 0) AS DECIMAL(10,2)) AS CHOICE_FILLING_COMPLETED_PERCENTAGE,
            (aps.APPROVED_STUDNET - cfc.CHOICE_FILLING_COMPLETED_STUDENT) AS CHOICE_FILLING_PENDING_STUDENT,
            CAST((aps.APPROVED_STUDNET - cfc.CHOICE_FILLING_COMPLETED_STUDENT) * 100.0
                / NULLIF(aps.APPROVED_STUDNET, 0) AS DECIMAL(10,2)) AS CHOICE_FILLING_PENDING_PERCENTAGE
        FROM approved_student aps
        CROSS JOIN choice_filling_completed cfc;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
