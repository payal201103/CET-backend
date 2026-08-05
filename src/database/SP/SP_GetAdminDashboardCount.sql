-- SP_GetAdminDashboardCount
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_GetAdminDashboardCount]
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        WITH
        total_student AS (
            SELECT COUNT(childUID) AS TOTAL_STUDENT
            FROM student_details
        ),
        register_student AS (
            SELECT COUNT(childUID) AS REGISTER_STUDENT
            FROM student_details
            WHERE isRegistered IN (0,1)
        ),
        pending_registration_student AS (
            SELECT COUNT(childUID) AS PENDING_FOR_REGISTRATION_STUDNET
            FROM student_details
            WHERE isRegistered IS NULL
        ),
        in_query_student AS (
            SELECT COUNT(childUID) AS IN_QUERY_STUDENT
            FROM student_details
            WHERE isRegistered = 0
              AND isApproved = 0
        ),
        approved_student AS (
            SELECT COUNT(childUID) AS APPROVED_STUDNET
            FROM student_details
            WHERE isRegistered = 1
              AND isApproved = 1
        ),
        pending_approval_student AS (
            SELECT COUNT(childUID) AS PENDING_FOR_APPROVEL_STUDENT
            FROM student_details
            WHERE isRegistered = 1
              AND isApproved IS NULL
        ),
        choice_filling_completed AS (
            SELECT COUNT(DISTINCT childUID) AS CHOICE_FILLING_COMPLETED_STUDENT
            FROM student_choice_filling_master
            WHERE isDeleted = 0
        ),
        total_approver AS (
            SELECT COUNT(approverId) AS TOTAL_APPROVER
            FROM approver_master
            WHERE isActive = 1
        )
        SELECT
            ts.TOTAL_STUDENT,
            rs.REGISTER_STUDENT,
            prs.PENDING_FOR_REGISTRATION_STUDNET,
            iqs.IN_QUERY_STUDENT,
            aps.APPROVED_STUDNET,
            pas.PENDING_FOR_APPROVEL_STUDENT,
            cfc.CHOICE_FILLING_COMPLETED_STUDENT,
            (aps.APPROVED_STUDNET - cfc.CHOICE_FILLING_COMPLETED_STUDENT) AS CHOICE_FILLING_PENDING_STUDENT,
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
