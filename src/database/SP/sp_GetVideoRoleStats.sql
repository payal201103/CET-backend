CREATE OR ALTER PROCEDURE [dbo].[sp_GetVideoRoleStats]
(
    @UserId INT,
    @UserRole VARCHAR(50),
    @BranchId INT = NULL
)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DECLARE @UserBranchId INT;
        DECLARE @UserActualRole VARCHAR(50);

        SELECT @UserBranchId = branchId, @UserActualRole = role FROM dbo.users WHERE userID = @UserId;

        DECLARE @EffectiveBranchId INT;
        IF @UserActualRole = 'Super Admin'
        BEGIN
            SET @EffectiveBranchId = @BranchId;
        END
        ELSE
        BEGIN
            SET @EffectiveBranchId = @UserBranchId;
        END

        -- Create Temp Table for Videographer stats
        CREATE TABLE #VideographerCombined (
            [name] VARCHAR(100),
            active INT DEFAULT 0,
            done INT DEFAULT 0
        );

        -- Insert active counts for videographers
        INSERT INTO #VideographerCombined ([name], active)
        SELECT 
            p.assignedBy,
            COUNT(*)
        FROM dbo.video_requests_pending p
        INNER JOIN dbo.job_cards jc ON p.jobCardNo = jc.jobCardNo
        WHERE p.isActive = 1
          AND (@EffectiveBranchId IS NULL OR jc.branchId = @EffectiveBranchId)
        GROUP BY p.assignedBy;

        -- Insert completed counts for videographers
        MERGE #VideographerCombined AS target
        USING (
            SELECT 
                c.assignedBy,
                COUNT(*) AS done_count
            FROM dbo.video_requests_completed c
            INNER JOIN dbo.job_cards jc ON c.jobCardNo = jc.jobCardNo
            WHERE (@EffectiveBranchId IS NULL OR jc.branchId = @EffectiveBranchId)
            GROUP BY c.assignedBy
        ) AS source
        ON target.[name] = source.assignedBy
        WHEN MATCHED THEN
            UPDATE SET target.done = source.done_count
        WHEN NOT MATCHED THEN
            INSERT ([name], active, done)
            VALUES (source.assignedBy, 0, source.done_count);

        -- Select Videographer stats
        SELECT [name], active, done FROM #VideographerCombined ORDER BY [name];

        -- Create Temp Table for Editor stats
        CREATE TABLE #EditorCombined (
            [name] VARCHAR(100),
            active INT DEFAULT 0,
            done INT DEFAULT 0
        );

        -- Insert active counts for editors
        INSERT INTO #EditorCombined ([name], active)
        SELECT 
            p.editor,
            COUNT(*)
        FROM dbo.video_editing_pending p
        INNER JOIN dbo.job_cards jc ON p.jobCardNo = jc.jobCardNo
        WHERE p.editor IS NOT NULL AND p.editor <> ''
          AND p.isActive = 1
          AND (@EffectiveBranchId IS NULL OR jc.branchId = @EffectiveBranchId)
        GROUP BY p.editor;

        -- Insert completed counts for editors
        MERGE #EditorCombined AS target
        USING (
            SELECT 
                c.editor,
                COUNT(*) AS done_count
            FROM dbo.video_editing_completed c
            INNER JOIN dbo.job_cards jc ON c.jobCardNo = jc.jobCardNo
            WHERE c.editor IS NOT NULL AND c.editor <> ''
              AND (@EffectiveBranchId IS NULL OR jc.branchId = @EffectiveBranchId)
            GROUP BY c.editor
        ) AS source
        ON target.[name] = source.editor
        WHEN MATCHED THEN
            UPDATE SET target.done = source.done_count
        WHEN NOT MATCHED THEN
            INSERT ([name], active, done)
            VALUES (source.editor, 0, source.done_count);

        -- Select Editor stats
        SELECT [name], active, done FROM #EditorCombined ORDER BY [name];

        -- Cleanup
        DROP TABLE #VideographerCombined;
        DROP TABLE #EditorCombined;
    END TRY
    BEGIN CATCH
        IF OBJECT_ID('tempdb..#VideographerCombined') IS NOT NULL
            DROP TABLE #VideographerCombined;
        IF OBJECT_ID('tempdb..#EditorCombined') IS NOT NULL
            DROP TABLE #EditorCombined;
        THROW;
    END CATCH
END;
GO
