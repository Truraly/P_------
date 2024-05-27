
-- Insert initial family members
INSERT INTO family_member (name, has_extra_risk_factors, is_deleted) VALUES ('John Doe', FALSE, FALSE);
INSERT INTO family_member (name, has_extra_risk_factors, is_deleted) VALUES ('Jane Doe', TRUE, FALSE);

-- Insert initial blood pressure records
INSERT INTO blood_pressure_record (family_member_id, sbp, dbp, heart_rate, timestamp, remark, location, intense_exercise_within_30min, sit_before_measurement, shower_within_1h, alcohol_smoking_caffeine_within_1h, meal_within_1h, empty_bladder_before_measurement, proper_posture_during_measurement, is_deleted) VALUES (1, 120, 80, 70, strftime('%s', 'now'), 'Morning measurement', 'right hand', FALSE, TRUE, FALSE, FALSE, TRUE, TRUE, TRUE, FALSE);
INSERT INTO blood_pressure_record (family_member_id, sbp, dbp, heart_rate, timestamp, remark, location, intense_exercise_within_30min, sit_before_measurement, shower_within_1h, alcohol_smoking_caffeine_within_1h, meal_within_1h, empty_bladder_before_measurement, proper_posture_during_measurement, is_deleted) VALUES (2, 130, 85, 75, strftime('%s', 'now'), 'After exercise', 'left hand', TRUE, FALSE, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE);
