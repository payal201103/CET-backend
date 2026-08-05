-- SP_GetStudentsBySchoolId
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_GetStudentsBySchoolId]
(
    @schoolId BIGINT,
    @statusType INT,
    @page INT = 0,
    @limit INT = 10,
    @search VARCHAR(100) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        DECLARE @sql NVARCHAR(MAX);
        DECLARE @countSql NVARCHAR(MAX);
        DECLARE @whereClause NVARCHAR(MAX) = '';
        DECLARE @paginationClause NVARCHAR(MAX) = '';
        DECLARE @params NVARCHAR(MAX);

        SET @whereClause = ' WHERE 1=1 ';

        SET @whereClause = @whereClause + '
            AND SG.schoolId = @schoolId';

        SET @whereClause = @whereClause + '
            AND (
                (@statusType = 1 AND SG.isRegistered IS NULL AND SG.isApproved IS NULL)
                OR
                (@statusType = 2 AND SG.isRegistered = 1 AND (SG.isApproved IS NULL OR SG.isApproved = 1))
                OR
                (@statusType = 3 AND SG.isRegistered = 0 AND SG.isApproved = 0)
            )';

        IF @search IS NOT NULL
        BEGIN
            SET @whereClause = @whereClause + '
                AND (
                    CAST(SG.childUID AS VARCHAR) LIKE @search + ''%''
                    OR SG.studentName LIKE @search + ''%''
                )';
        END

        IF @page IS NOT NULL AND @limit IS NOT NULL
        BEGIN
            SET @paginationClause = '
                ORDER BY SG.createdAt DESC
                OFFSET (@page * @limit) ROWS
                FETCH NEXT @limit ROWS ONLY';
        END
        ELSE
        BEGIN
            SET @paginationClause = ' ORDER BY SG.createdAt DESC';
        END

        SET @sql = N'
            SELECT
                SG.childUID,
                SG.schoolId,
                SG.studentName,
                SG.fatherName,
                SG.surname,
                SG.genderId,
                GM.genderName,
                CONVERT(VARCHAR(10), SG.birthDate, 120) AS birthDate,
                SG.categoryId,
                SG.isDisabilityMoreThen40,
                SG.disabilityPercentage,
                SG.disabilityType,
                SG.addressDistrictId,
                SG.addressBlockId,
                SG.addressVillageId,
                SG.parentMo,
                CASE WHEN SG.isRegistered = 1 THEN 1 ELSE 0 END isRegistered,
                CASE WHEN SG.isApproved = 1 THEN 1 ELSE 0 END isApproved
            FROM student_details SG
            LEFT JOIN gender_master GM ON SG.genderId = GM.genderId'
            + @whereClause
            + @paginationClause;

        SET @countSql = N'
            SELECT COUNT(SG.childUID) AS total
            FROM student_details SG'
            + @whereClause;

        SET @params = N'
            @schoolId BIGINT,
            @statusType INT,
            @page INT,
            @limit INT,
            @search VARCHAR(50)';

        EXEC sp_executesql
            @sql, @params, @schoolId, @statusType, @page, @limit, @search;

        EXEC sp_executesql
            @countSql, @params, @schoolId, @statusType, @page, @limit, @search;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
