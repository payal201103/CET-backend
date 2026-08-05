-- SP_GetDPEODashboardCount
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_GetDPEODashboardCount]
(
    @districtId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        WITH
        total_student AS (
            SELECT COUNT(sd.childUID) AS TOTAL_STUDENT
            FROM student_details sd
            INNER JOIN school_master sm ON sd.schoolId = sm.schoolId
            WHERE sm.districtId = @districtId
        ),
        register_student AS (
            SELECT COUNT(sd.childUID) AS REGISTER_STUDENT
            FROM student_details sd
            INNER JOIN school_master sm ON sd.schoolId = sm.schoolId
            WHERE sm.districtId = @districtId
              AND sd.isRegistered IN (0,1)
        ),
        pending_registration_student AS (
            SELECT COUNT(sd.childUID) AS PENDING_FOR_REGISTRATION_STUDENT
            FROM student_details sd
            INNER JOIN school_master sm ON sd.schoolId = sm.schoolId
            WHERE sm.districtId = @districtId
              AND sd.isRegistered IS NULL
        ),
        in_query_student AS (
            SELECT COUNT(sd.childUID) AS IN_QUERY_STUDENT
            FROM student_details sd
            INNER JOIN school_master sm ON sd.schoolId = sm.schoolId
            WHERE sm.districtId = @districtId
              AND sd.isRegistered = 0
              AND sd.isApproved = 0
        ),
        approved_student AS (
            SELECT COUNT(sd.childUID) AS APPROVED_STUDENT
            FROM student_details sd
            INNER JOIN school_master sm ON sd.schoolId = sm.schoolId
            WHERE sm.districtId = @districtId
              AND sd.isRegistered = 1
              AND sd.isApproved = 1
        ),
        pending_approval_student AS (
            SELECT COUNT(sd.childUID) AS PENDING_FOR_APPROVAL_STUDENT
            FROM student_details sd
            INNER JOIN school_master sm ON sd.schoolId = sm.schoolId
            WHERE sm.districtId = @districtId
              AND sd.isRegistered = 1
              AND sd.isApproved IS NULL
        ),
        choice_filling_completed AS (
            SELECT COUNT(DISTINCT scm.childUID) AS CHOICE_FILLING_COMPLETED_STUDENT
            FROM student_choice_filling_master scm
            INNER JOIN student_details sd ON scm.childUID = sd.childUID
            INNER JOIN school_master sm ON sd.schoolId = sm.schoolId
            WHERE sm.districtId = @districtId
              AND scm.isDeleted = 0
        ),
        total_approver AS (
            SELECT COUNT(approverId) AS TOTAL_APPROVER
            FROM approver_master
            WHERE districtId = @districtId
              AND isActive = 1
        )
        SELECT
            ts.TOTAL_STUDENT,
            rs.REGISTER_STUDENT,
            prs.PENDING_FOR_REGISTRATION_STUDENT,
            iqs.IN_QUERY_STUDENT,
            aps.APPROVED_STUDENT,
            pas.PENDING_FOR_APPROVAL_STUDENT,
            cfc.CHOICE_FILLING_COMPLETED_STUDENT,
            (aps.APPROVED_STUDENT - cfc.CHOICE_FILLING_COMPLETED_STUDENT) AS CHOICE_FILLING_PENDING_STUDENT,
            ta.TOTAL_APPROVER
        FROM total_student ts,
             register_student rs,
             pending_registration_student prs,
             in_query_student iqs,
             approved_student aps,
             pending_approval_student pas,
             choice_filling_completed cfc,
             total_approver ta;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
