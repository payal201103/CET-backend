-- SP_GetAdminDashboardData
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_GetAdminDashboardData]
(
    @statusType VARCHAR(50)
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF @statusType = 'TOTAL_STUDENT'
        BEGIN
            SELECT
                sd.childUID,
                sd.schoolId,
                sd.studentName,
                sd.fatherName,
                sd.surname,
                gm.genderName,
                CAST(sd.birthDate AS VARCHAR(10)) AS birthDate,
                sd.addressDistrictId,
                dm.districtName,
                sd.addressBlockId,
                bm.blockName,
                sd.addressVillageId,
                vm.villageName,
                sd.parentMo
            FROM student_details sd
            LEFT JOIN gender_master gm ON sd.genderId = gm.genderId
            LEFT JOIN district_master dm ON sd.addressDistrictId = dm.districtId
            LEFT JOIN block_master bm ON sd.addressBlockId = bm.blockId
            LEFT JOIN village_master vm ON sd.addressVillageId = vm.villageId
        END

        ELSE IF @statusType = 'REGISTER_STUDENT'
        BEGIN
            SELECT
                sd.childUID,
                sd.schoolId,
                sd.studentName,
                sd.fatherName,
                sd.surname,
                gm.genderName,
                CAST(sd.birthDate AS VARCHAR(10)) AS birthDate,
                sd.addressDistrictId,
                dm.districtName,
                sd.addressBlockId,
                bm.blockName,
                sd.addressVillageId,
                vm.villageName,
                sd.parentMo
            FROM student_details sd
            LEFT JOIN gender_master gm ON sd.genderId = gm.genderId
            LEFT JOIN district_master dm ON sd.addressDistrictId = dm.districtId
            LEFT JOIN block_master bm ON sd.addressBlockId = bm.blockId
            LEFT JOIN village_master vm ON sd.addressVillageId = vm.villageId
            WHERE sd.isRegistered IN (0,1)
        END

        ELSE IF @statusType = 'PENDING_FOR_REGISTRATION'
        BEGIN
            SELECT
                sd.childUID,
                sd.schoolId,
                sd.studentName,
                sd.fatherName,
                sd.surname,
                gm.genderName,
                CAST(sd.birthDate AS VARCHAR(10)) AS birthDate,
                sd.addressDistrictId,
                dm.districtName,
                sd.addressBlockId,
                bm.blockName,
                sd.addressVillageId,
                vm.villageName,
                sd.parentMo
            FROM student_details sd
            LEFT JOIN gender_master gm ON sd.genderId = gm.genderId
            LEFT JOIN district_master dm ON sd.addressDistrictId = dm.districtId
            LEFT JOIN block_master bm ON sd.addressBlockId = bm.blockId
            LEFT JOIN village_master vm ON sd.addressVillageId = vm.villageId
            WHERE sd.isRegistered IS NULL
        END

        ELSE IF @statusType = 'IN_QUERY_STUDENT'
        BEGIN
            SELECT
                sd.childUID,
                sd.schoolId,
                sd.studentName,
                sd.fatherName,
                sd.surname,
                gm.genderName,
                CAST(sd.birthDate AS VARCHAR(10)) AS birthDate,
                sd.addressDistrictId,
                dm.districtName,
                sd.addressBlockId,
                bm.blockName,
                sd.addressVillageId,
                vm.villageName,
                sd.parentMo
            FROM student_details sd
            LEFT JOIN gender_master gm ON sd.genderId = gm.genderId
            LEFT JOIN district_master dm ON sd.addressDistrictId = dm.districtId
            LEFT JOIN block_master bm ON sd.addressBlockId = bm.blockId
            LEFT JOIN village_master vm ON sd.addressVillageId = vm.villageId
            WHERE sd.isRegistered = 0
              AND sd.isApproved = 0
        END

        ELSE IF @statusType = 'APPROVED_STUDENT'
        BEGIN
            SELECT
                sd.childUID,
                sd.schoolId,
                sd.studentName,
                sd.fatherName,
                sd.surname,
                gm.genderName,
                CAST(sd.birthDate AS VARCHAR(10)) AS birthDate,
                sd.addressDistrictId,
                dm.districtName,
                sd.addressBlockId,
                bm.blockName,
                sd.addressVillageId,
                vm.villageName,
                sd.parentMo
            FROM student_details sd
            LEFT JOIN gender_master gm ON sd.genderId = gm.genderId
            LEFT JOIN district_master dm ON sd.addressDistrictId = dm.districtId
            LEFT JOIN block_master bm ON sd.addressBlockId = bm.blockId
            LEFT JOIN village_master vm ON sd.addressVillageId = vm.villageId
            WHERE sd.isRegistered = 1
              AND sd.isApproved = 1
        END

        ELSE IF @statusType = 'PENDING_FOR_APPROVAL'
        BEGIN
            SELECT
                sd.childUID,
                sd.schoolId,
                sd.studentName,
                sd.fatherName,
                sd.surname,
                gm.genderName,
                CAST(sd.birthDate AS VARCHAR(10)) AS birthDate,
                sd.addressDistrictId,
                dm.districtName,
                sd.addressBlockId,
                bm.blockName,
                sd.addressVillageId,
                vm.villageName,
                sd.parentMo
            FROM student_details sd
            LEFT JOIN gender_master gm ON sd.genderId = gm.genderId
            LEFT JOIN district_master dm ON sd.addressDistrictId = dm.districtId
            LEFT JOIN block_master bm ON sd.addressBlockId = bm.blockId
            LEFT JOIN village_master vm ON sd.addressVillageId = vm.villageId
            WHERE sd.isRegistered = 1
              AND sd.isApproved IS NULL
        END

        ELSE IF @statusType = 'CHOICE_FILLING_COMPLETED'
        BEGIN
            SELECT
                sd.childUID,
                sd.schoolId,
                sd.studentName,
                sd.fatherName,
                sd.surname,
                gm.genderName,
                CAST(sd.birthDate AS VARCHAR(10)) AS birthDate,
                sd.addressDistrictId,
                dm.districtName,
                sd.addressBlockId,
                bm.blockName,
                sd.addressVillageId,
                vm.villageName,
                sd.parentMo
            FROM student_choice_filling_master sc
            INNER JOIN student_details sd ON sc.childUID = sd.childUID AND sc.isDeleted = 0
            LEFT JOIN gender_master gm ON sd.genderId = gm.genderId
            LEFT JOIN district_master dm ON sd.addressDistrictId = dm.districtId
            LEFT JOIN block_master bm ON sd.addressBlockId = bm.blockId
            LEFT JOIN village_master vm ON sd.addressVillageId = vm.villageId
        END

        ELSE IF @statusType = 'CHOICE_FILLING_PENDING'
        BEGIN
            SELECT
                sd.childUID,
                sd.schoolId,
                sd.studentName,
                sd.fatherName,
                sd.surname,
                gm.genderName,
                CAST(sd.birthDate AS VARCHAR(10)) AS birthDate,
                sd.addressDistrictId,
                dm.districtName,
                sd.addressBlockId,
                bm.blockName,
                sd.addressVillageId,
                vm.villageName,
                sd.parentMo
            FROM student_details sd
            LEFT JOIN gender_master gm ON sd.genderId = gm.genderId
            LEFT JOIN district_master dm ON sd.addressDistrictId = dm.districtId
            LEFT JOIN block_master bm ON sd.addressBlockId = bm.blockId
            LEFT JOIN village_master vm ON sd.addressVillageId = vm.villageId
            WHERE sd.isRegistered = 1
              AND sd.isApproved = 1
              AND sd.childUID NOT IN
              (
                  SELECT childUID
                  FROM student_choice_filling_master
              )
        END

        ELSE IF @statusType = 'TOTAL_APPROVER'
        BEGIN
            SELECT
                am.approverId,
                am.name,
                am.districtId,
                dm.districtName,
                am.blockId,
                bm.blockName,
                am.mobileNo,
                dem.designationName,
                CASE WHEN am.isActive = 1 THEN 'Yes' ELSE 'No' END AS Active
            FROM approver_master am
            LEFT JOIN district_master dm ON am.districtId = dm.districtId
            LEFT JOIN block_master bm ON am.blockId = bm.blockId
            LEFT JOIN designation_master dem ON am.designationId = dem.id
            WHERE am.isActive = 1
        END
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
