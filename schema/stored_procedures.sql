DROP PROCEDURE IF EXISTS report_total_cost_by_worker;
CREATE PROCEDURE report_total_cost_by_worker(
    IN completion_status VARCHAR(12),
    IN worker_id_list VARCHAR(16383),
    IN location_id_list VARCHAR(16383))
BEGIN
SELECT
    w.id,
    w.username as "name",
    SUM(w.hourly_wage * (lt.time_seconds/3600)) as costs
FROM
    workers AS w
        JOIN logged_time AS lt ON w.id = lt.worker_id
        JOIN tasks AS t ON lt.task_id = t.id
WHERE
    (completion_status = 'both' OR (completion_status = 'complete' AND t.is_complete = 1) OR (completion_status = 'incomplete' AND t.is_complete = 0))
  AND (NULLIF(worker_id_list, '') is null OR (FIND_IN_SET(w.id, worker_id_list) > 0))
  AND (NULLIF(location_id_list, '') is null OR (FIND_IN_SET(t.location_id, location_id_list) > 0))
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
    SUM(w.hourly_wage * (lt.time_seconds/3600)) as costs
FROM
    locations as l
        JOIN tasks as t ON l.id = t.location_id
        JOIN logged_time as lt on t.id = lt.task_id
        JOIN workers as w on lt.worker_id = w.id
WHERE
    (completion_status = 'both' OR (completion_status = 'complete' AND t.is_complete = 1) OR (completion_status = 'incomplete' AND t.is_complete = 0))
  AND (NULLIF(worker_id_list, '') is null OR (FIND_IN_SET(w.id, worker_id_list) > 0))
  AND (NULLIF(location_id_list, '') is null OR (FIND_IN_SET(t.location_id, location_id_list) > 0))
GROUP BY
    l.id,
    l.name;
END;
