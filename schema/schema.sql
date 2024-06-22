CREATE TABLE IF NOT EXISTS locations (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL UNIQUE
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS tasks (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  description VARCHAR(100) NOT NULL,
  is_complete BOOLEAN NOT NULL DEFAULT 0,

  location_id INT(11) NOT NULL,

  FOREIGN KEY(location_id) REFERENCES locations(id) ON DELETE CASCADE
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS workers (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(30) NOT NULL UNIQUE,
  hourly_wage DECIMAL(5, 2) NOT NULL
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS logged_time (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  time_seconds INT(11) NOT NULL,

  task_id INT(11) NOT NULL,
  worker_id INT(11) NOT NULL,

  FOREIGN KEY(task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY(worker_id) REFERENCES workers(id) ON DELETE CASCADE
) ENGINE=INNODB;
/*
DROP PROCEDURE IF EXISTS report_total_cost_by_worker;
CREATE PROCEDURE report_total_cost_by_worker(
  IN completion_status VARCHAR(12),
  IN worker_id_list VARCHAR(16383),
  IN location_id_list VARCHAR(16383))
BEGIN
  SELECT
    w.id,
    w.username as "name",
    sum((w.hourly_wage * (lt.time_seconds/3600))) as costs
  FROM
    workers AS w
    JOIN logged_time AS lt ON w.id = lt.worker_id
    JOIN tasks AS t ON lt.task_id = t.id
  WHERE
    (completion_status = 'both' OR (completion_status = 'complete' AND t.is_complete = 1) OR (completion_status = 'incomplete' AND t.is_complete = 0))
    AND (nullif(worker_id_list,'') is null OR (FIND_IN_SET(w.id, worker_id_list) > 0))
    AND (nullif(location_id_list,'') is null OR (FIND_IN_SET(t.location_id, location_id_list) > 0))
  GROUP BY
    w.id,
    name;
END;

DROP PROCEDURE IF EXISTS report_total_cost_by_location;
CREATE PROCEDURE report_total_cost_by_location(
  IN completion_status VARCHAR(12),
  IN worker_id_list VARCHAR(16383),
  IN location_id_list VARCHAR(16383))
BEGIN
  SELECT
    l.id,
    l.name,
    sum((w.hourly_wage * (lt.time_seconds/3600))) as costs
  FROM
    locations as l
    JOIN tasks as t ON l.id = t.location_id
    JOIN logged_time as lt on t.id = lt.task_id
    JOIN workers as w on lt.worker_id = w.id
  WHERE
    (completion_status = 'both' OR (completion_status = 'complete' AND t.is_complete = 1) OR (completion_status = 'incomplete' AND t.is_complete = 0))
    AND (nullif(worker_id_list,'') is null OR (FIND_IN_SET(w.id, worker_id_list) > 0))
    AND (nullif(location_id_list,'') is null OR (FIND_IN_SET(t.location_id, location_id_list) > 0))
  GROUP BY
    l.id,
    l.name;
END;
*/
INSERT INTO locations
(id, name)
VALUES
  (1, 'The Bridge'),
  (2, 'Airponics Bay'),
  (3, 'Astrometrics'),
  (4, 'Cargo Bay 2'),
  (5, 'Holodeck 1'),
  (6, 'Holodeck 2'),
  (7, 'Engine Room'),
  (8, 'Sickbay');

INSERT INTO workers
(id, username, hourly_wage)
VALUES
  (1, 'Kathryn Janeway', 250.00),
  (2, 'Chakotay', 225.00),
  (3, 'Tuvok', 200.00),
  (4, 'B\'Elanna Torres', 175.00),
  (5, 'Tom Paris', 150.00),
  (6, 'Neelix', 125.00),
  (7, 'Annika Hansen', 100.00),
  (8, 'Harry Kim', 75.00);

INSERT INTO tasks
(id, description, is_complete, location_id)
VALUES
  (1, 'Provide Healthcare Services', 0, 8),
  (2, 'Pilot USS Voyager', 0, 1),
  (3, 'Investigate Spacial Phenomenon', 1, 3),
  (4, 'Meet New Life Forms', 1, 1),
  (5, 'Scrub the Plasma Conduits', 1, 7),
  (6, 'Build the Delta Flyer', 1, 4),
  (7, 'Destroy Omega', 1, 4),
  (8, 'Feed the Crew', 1, 2);

INSERT INTO logged_time
(time_seconds, task_id, worker_id)
VALUES
  (204800, 4, 1),
  (172800, 7, 1),
  (1512000, 2, 2),
  (604800, 6, 2),
  (1512000, 3, 3),
  (604800, 4, 3),
  (604800, 6, 4),
  (28800, 1, 5),
  (3024000, 2, 5),
  (907200, 6, 5),
  (10800, 8, 6),
  (1512000, 3, 7),
  (172800, 7, 7),
  (10800, 5, 8),
  (907200, 6, 8);
