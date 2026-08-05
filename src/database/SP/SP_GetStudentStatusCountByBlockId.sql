-- SP_GetStudentStatusCountByBlockId
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_GetStudentStatusCountByBlockId]
(
    @blockId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT
            COUNT(CASE
                    WHEN SD.isRegistered = 1
                         AND SD.isApproved IS NULL
                    THEN 1
                 END) AS PendingCount,

            COUNT(CASE
                    WHEN SD.isRegistered = 0
                         AND SD.isApproved = 0
                    THEN 1
                 END) AS QueryCount,

            COUNT(CASE
                    WHEN SD.isRegistered = 1
                         AND SD.isApproved = 1
                    THEN 1
                 END) AS ApprovedCount,

            COUNT(CASE
                    WHEN
                        (SD.isRegistered = 1 AND SD.isApproved IS NULL)
                        OR (SD.isRegistered = 0 AND SD.isApproved = 0)
                        OR (SD.isRegistered = 1 AND SD.isApproved = 1)
                    THEN 1
                 END) AS TotalCount
        FROM student_details SD
        INNER JOIN school_master S
            ON SD.schoolId = S.schoolId
        WHERE S.blockId = @blockId;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
