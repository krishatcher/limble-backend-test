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
    (4, 'B`Elanna Torres', 175.00),
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
