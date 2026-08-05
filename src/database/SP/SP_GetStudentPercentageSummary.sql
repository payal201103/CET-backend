-- SP_GetStudentPercentageSummary
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_GetStudentPercentageSummary]
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT
            COUNT(childUID) AS TOTAL_STUDENT,

            COUNT(CASE WHEN isRegistered IN (0,1) THEN 1 END) AS REGISTER_STUDENT,
            CAST(COUNT(CASE WHEN isRegistered IN (0,1) THEN 1 END) * 100.0
                / NULLIF(COUNT(childUID), 0) AS DECIMAL(10,2)) AS REGISTER_PERCENTAGE,

            COUNT(CASE WHEN isRegistered IS NULL THEN 1 END) AS PENDING_FOR_REGISTRATION_STUDNET,
            CAST(COUNT(CASE WHEN isRegistered IS NULL THEN 1 END) * 100.0
                / NULLIF(COUNT(childUID), 0) AS DECIMAL(10,2)) AS PENDING_PERCENTAGE,

            COUNT(CASE WHEN isRegistered = 0 AND isApproved = 0 THEN 1 END) AS IN_QUERY_STUDENT,
            CAST(COUNT(CASE WHEN isRegistered = 0 AND isApproved = 0 THEN 1 END) * 100.0
                / NULLIF(COUNT(childUID), 0) AS DECIMAL(10,2)) AS IN_QUERY_PERCENTAGE
        FROM student_details;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
