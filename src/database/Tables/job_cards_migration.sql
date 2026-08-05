----------- Job Card: Pending/Completed flag -----------
-- job_cards table already exists in DB; this only adds the flag
-- that drives the Pending/Completed status shown on the Job Card page.

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID('dbo.job_cards') AND name = 'isCompleted'
)
BEGIN
    ALTER TABLE dbo.job_cards
    ADD isCompleted BIT NOT NULL DEFAULT 0;
END
