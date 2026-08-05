-- SP_GetEligibleSchoolListByChildUID
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_GetEligibleSchoolListByChildUID]
(
    @childUID BIGINT
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        DECLARE
            @age INT = NULL,
            @categoryId INT = NULL,
            @isStd1To5GovtGrantCompleted BIT = NULL,
            @isSTorSTPVT BIT = NULL,
            @isDisabilityMoreThen40 INT = NULL,
            @studentDistrictId INT = NULL;

        SELECT
            @categoryId = sd.categoryId,
            @isStd1To5GovtGrantCompleted = sd.isStd1To5GovtGrantCompleted,
            @age = DATEDIFF(YEAR, sd.birthDate, GETDATE()) - CASE
                    WHEN DATEADD(YEAR, DATEDIFF(YEAR, sd.birthDate, GETDATE()), sd.birthDate) > GETDATE()
                    THEN 1 ELSE 0
                  END,
            @isDisabilityMoreThen40 = sd.isDisabilityMoreThen40,
            @studentDistrictId = sd.addressDistrictId
        FROM student_details sd
        WHERE sd.childUID = @childUID;

        SET @isSTorSTPVT = CASE WHEN @categoryId IN (5,6) THEN 1 ELSE 0 END;

        IF @categoryId IS NULL
        BEGIN
            RAISERROR('Invalid childUID', 16, 1);
            RETURN;
        END

        DECLARE @EligibleSchemes TABLE (schemeName VARCHAR(20));

        IF (@isStd1To5GovtGrantCompleted = 1 AND @categoryId BETWEEN 1 AND 6)
        BEGIN
            INSERT INTO @EligibleSchemes VALUES ('GSS001');
            INSERT INTO @EligibleSchemes VALUES ('GRS001');
        END

        IF (@isStd1To5GovtGrantCompleted = 1 AND @isSTorSTPVT = 1)
        BEGIN
            INSERT INTO @EligibleSchemes VALUES ('TRS001');
        END

        IF (@categoryId BETWEEN 1 AND 6 AND @isDisabilityMoreThen40 = 0)
        BEGIN
            INSERT INTO @EligibleSchemes VALUES ('RKS001');
        END

        IF (@isSTorSTPVT = 1)
        BEGIN
            IF ((@age BETWEEN 10 AND 13)
                OR (@isDisabilityMoreThen40 = 1 AND @age BETWEEN 10 AND 15))
            BEGIN
                INSERT INTO @EligibleSchemes VALUES ('EMRS001');
            END
        END

        SELECT
            sm.schoolId,
            sm.schoolName,
            sm.districtId,
            sm.schemeName,
            dm.districtName,
            scm.priority,
            st.name AS schoolType
        FROM school_master sm
        INNER JOIN @EligibleSchemes es ON sm.schemeName = es.schemeName
        LEFT JOIN school_type_lookup st ON sm.schoolType = st.id
        LEFT JOIN student_choice_filling_master scm ON scm.childUID = @childUID
                  AND scm.schoolId = sm.schoolId
                  AND scm.isDeleted = 0
        LEFT JOIN district_master dm ON sm.districtId = dm.districtId
        WHERE sm.schoolType IN (1,2,3)
        ORDER BY
            CASE
                WHEN sm.districtId = @studentDistrictId THEN 0
                ELSE 1
            END,
            sm.districtId,
            sm.schoolName ASC;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
