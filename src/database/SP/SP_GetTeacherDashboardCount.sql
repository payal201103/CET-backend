-- SP_GetTeacherDashboardCount
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_GetTeacherDashboardCount]
(
    @schoolId BIGINT
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT
            COUNT(CASE
                    WHEN SG.isRegistered IN (0,1)
                    THEN 1
                 END) AS RegisteredCount,

            COUNT(CASE
                    WHEN SG.isRegistered = 0
                         AND SG.isApproved = 0
                    THEN 1
                 END) AS QueryCount,

            COUNT(CASE
                    WHEN SG.isRegistered IS NULL
                         AND SG.isApproved IS NULL
                    THEN 1
                 END) AS PendingCount,

            COUNT(CASE
                    WHEN SG.isRegistered = 1
                         AND SG.isApproved = 1
                    THEN 1
                 END) AS ApprovedCount,

            COUNT(childUID) AS TotalCount
        FROM student_details SG
        WHERE SG.schoolId = @schoolId;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
