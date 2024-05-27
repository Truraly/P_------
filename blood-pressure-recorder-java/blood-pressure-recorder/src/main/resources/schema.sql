CREATE TABLE family_member (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name TEXT NOT NULL,
    has_extra_risk_factors BOOLEAN NOT NULL DEFAULT FALSE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE blood_pressure_record (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    family_member_id INTEGER NOT NULL,
    sbp INTEGER NOT NULL,
    dbp INTEGER NOT NULL,
    heart_rate INTEGER NOT NULL,
    timestamp INTEGER NOT NULL,
    remark TEXT,
    location TEXT NOT NULL,
    intense_exercise_within_30min BOOLEAN NOT NULL,
    sit_before_measurement BOOLEAN NOT NULL,
    shower_within_1h BOOLEAN NOT NULL,
    alcohol_smoking_caffeine_within_1h BOOLEAN NOT NULL,
    meal_within_1h BOOLEAN NOT NULL,
    empty_bladder_before_measurement BOOLEAN NOT NULL,
    proper_posture_during_measurement BOOLEAN NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (family_member_id) REFERENCES family_member (id)
);
