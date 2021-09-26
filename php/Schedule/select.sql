select 
	t_schedule.id,
    t_schedule.dies_id,
    case when t_schedule.press_date = '2021-09-20' then t_schedule.press_quantity else "" end as '09-20'
    case when t_schedule.press_date = '2021-09-21' then t_schedule.press_quantity else "" end as '09-21'
    case when t_schedule.press_date = '2021-09-22' then t_schedule.press_quantity else "" end as '09-22'
    case when t_schedule.press_date = '2021-09-23' then t_schedule.press_quantity else "" end as '09-23'
from t_schedule


case when t_press.press_date_at = '2021-09-06' then t_press.actual_billet_quantities else '' end AS '2021-09-06',case when t_press.press_date_at = '2021-09-02' then t_press.actual_billet_quantities else '' end AS '2021-09-02',case when t_press.press_date_at = '2021-09-03' then t_press.actual_billet_quantities else '' end AS '2021-09-03',case when t_press.press_date_at = '2021-09-04' then t_press.actual_billet_quantities else '' end AS '2021-09-04',case when t_press.press_date_at = '2021-09-05' then t_press.actual_billet_quantities else '' end AS '2021-09-05',case when t_press.press_date_at = '2021-09-06' then t_press.actual_billet_quantities else '' end AS '2021-09-06',case when t_press.press_date_at = '2021-09-07' then t_press.actual_billet_quantities else '' end AS '2021-09-07',case when t_press.press_date_at = '2021-09-08' then t_press.actual_billet_quantities else '' end AS '2021-09-08',case when t_press.press_date_at = '2021-09-09' then t_press.actual_billet_quantities else '' end AS '2021-09-09',case when t_press.press_date_at = '2021-09-10' then t_press.actual_billet_quantities else '' end AS '2021-09-10',case when t_press.press_date_at = '2021-09-11' then t_press.actual_billet_quantities else '' end AS '2021-09-11',case when t_press.press_date_at = '2021-09-12' then t_press.actual_billet_quantities else '' end AS '2021-09-12',case when t_press.press_date_at = '2021-09-13' then t_press.actual_billet_quantities else '' end AS '2021-09-13',case when t_press.press_date_at = '2021-09-14' then t_press.actual_billet_quantities else '' end AS '2021-09-14',case when t_press.press_date_at = '2021-09-15' then t_press.actual_billet_quantities else '' end AS '2021-09-15',case when t_press.press_date_at = '2021-09-16' then t_press.actual_billet_quantities else '' end AS '2021-09-16',case when t_press.press_date_at = '2021-09-17' then t_press.actual_billet_quantities else '' end AS '2021-09-17',case when t_press.press_date_at = '2021-09-18' then t_press.actual_billet_quantities else '' end AS '2021-09-18',case when t_press.press_date_at = '2021-09-19' then t_press.actual_billet_quantities else '' end AS '2021-09-19',case when t_press.press_date_at = '2021-09-20' then t_press.actual_billet_quantities else '' end AS '2021-09-20',case when t_press.press_date_at = '2021-09-21' then t_press.actual_billet_quantities else '' end AS '2021-09-21',case when t_press.press_date_at = '2021-09-22' then t_press.actual_billet_quantities else '' end AS '2021-09-22',case when t_press.press_date_at = '2021-09-23' then t_press.actual_billet_quantities else '' end AS '2021-09-23',case when t_press.press_date_at = '2021-09-24' then t_press.actual_billet_quantities else '' end AS '2021-09-24',case when t_press.press_date_at = '2021-09-25' then t_press.actual_billet_quantities else '' end AS '2021-09-25',case when t_press.press_date_at = '2021-09-26' then t_press.actual_billet_quantities else '' end AS '2021-09-26',case when t_press.press_date_at = '2021-09-27' then t_press.actual_billet_quantities else '' end AS '2021-09-27',case when t_press.press_date_at = '2021-09-28' then t_press.actual_billet_quantities else '' end AS '2021-09-28',case when t_press.press_date_at = '2021-09-29' then t_press.actual_billet_quantities else '' end AS '2021-09-29',case when t_press.press_date_at = '2021-09-30' then t_press.actual_billet_quantities else '' end AS '2021-09-30'


SELECT 
    t_press.id,
    t_press.dies_id,
    m_dies.die_number,
    MAX(CASE
        WHEN t_press.`press_date_at` = '2021-09-06' THEN t_press.actual_billet_quantities
    END) '2021-09-06',
    MAX(CASE
        WHEN t_press.`press_date_at` = '2021-09-07' THEN t_press.actual_billet_quantities
    END) '2071-09-02',
    MAX(CASE
        WHEN t_press.`press_date_at` = '2021-09-08' THEN t_press.actual_billet_quantities
    END) '2021-09-08',
    MAX(CASE
        WHEN t_press.`press_date_at` = '2021-09-09' THEN t_press.actual_billet_quantities
    END) '2021-09-09',
    MAX(CASE
        WHEN t_press.`press_date_at` = '2021-09-10' THEN t_press.actual_billet_quantities
    END) '2021-09-10',
    MAX(CASE
        WHEN t_press.`press_date_at` = '2021-09-11' THEN t_press.actual_billet_quantities
    END) '2021-09-11'
FROM
    t_press t_press
        LEFT JOIN
    m_dies ON t_press.dies_id = m_dies.id
GROUP BY dies_id;

SELECT 
        t_schedule.dies_id,
            m_dies.die_number,
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-01' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210901',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-02' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210902',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-03' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210903',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-04' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210904',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-05' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210905',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-06' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210906',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-07' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210907',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-08' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210908',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-09' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210909',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-10' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210910',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-11' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210911',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-12' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210912',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-13' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210913',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-14' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210914',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-15' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210915',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-16' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210916',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-17' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210917',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-18' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210918',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-19' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210919',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-20' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210920',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-21' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210921',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-22' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210922',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-23' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210923',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-24' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210924',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-25' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210925',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-26' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210926',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-27' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210927',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-28' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210928',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-29' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210929',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-30' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210930',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-10-01' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20211001',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-10-02' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20211002',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-10-03' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20211003'
    FROM
        t_schedule
    LEFT JOIN m_dies ON t_schedule.dies_id = m_dies.id;



SELECT 
    '2' AS o,
    t_press.dies_id,
    m_dies.die_number,
    MAX(CASE
        WHEN t_press.press_date_at = '2021-09-01' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210901',
    MAX(CASE
        WHEN t_press.press_date_at = '2021-09-02' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210902',
    MAX(CASE
        WHEN t_press.press_date_at = '2021-09-03' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210903',
    MAX(CASE
        WHEN t_press.press_date_at = '2021-09-04' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210904',
    MAX(CASE
        WHEN t_press.press_date_at = '2021-09-05' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210905',
    MAX(CASE
        WHEN t_press.press_date_at = '2021-09-06' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210906',
    MAX(CASE
        WHEN t_press.press_date_at = '2021-09-07' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210907',
    MAX(CASE
        WHEN t_press.press_date_at = '2021-09-08' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210908',
    MAX(CASE
        WHEN t_press.press_date_at = '2021-09-09' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210909',
    MAX(CASE
        WHEN t_press.press_date_at = '2021-09-10' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210910',
    MAX(CASE
        WHEN t_press.press_date_at = '2021-09-11' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210911',
    MAX(CASE
        WHEN t_press.press_date_at = '2021-09-12' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210912',
    MAX(CASE
        WHEN t_press.press_date_at = '2021-09-13' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210913',
    MAX(CASE
        WHEN t_press.press_date_at = '2021-09-14' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210914',
    MAX(CASE
        WHEN t_press.press_date_at = '2021-09-15' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210915',
    MAX(CASE
        WHEN t_press.press_date_at = '2021-09-16' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210916',
    MAX(CASE
        WHEN t_press.press_date_at = '2021-09-17' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210917',
    MAX(CASE
        WHEN t_press.press_date_at = '2021-09-18' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210918',
    MAX(CASE
        WHEN t_press.press_date_at = '2021-09-19' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210919',
    MAX(CASE
        WHEN t_press.press_date_at = '2021-09-20' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210920',
    MAX(CASE
        WHEN t_press.press_date_at = '2021-09-21' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210921',
    MAX(CASE
        WHEN t_press.press_date_at = '2021-09-22' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210922',
    MAX(CASE
        WHEN t_press.press_date_at = '2021-09-23' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210923',
    MAX(CASE
        WHEN t_press.press_date_at = '2021-09-24' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210924',
    MAX(CASE
        WHEN t_press.press_date_at = '2021-09-25' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210925',
    MAX(CASE
        WHEN t_press.press_date_at = '2021-09-26' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210926',
    MAX(CASE
        WHEN t_press.press_date_at = '2021-09-27' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210927',
    MAX(CASE
        WHEN t_press.press_date_at = '2021-09-28' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210928',
    MAX(CASE
        WHEN t_press.press_date_at = '2021-09-29' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210929',
    MAX(CASE
        WHEN t_press.press_date_at = '2021-09-30' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210930',
    MAX(CASE
        WHEN t_press.press_date_at = '2021-10-01' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20211001',
    MAX(CASE
        WHEN t_press.press_date_at = '2021-10-02' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20211002',
    MAX(CASE
        WHEN t_press.press_date_at = '2021-10-03' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20211003'
FROM
    t_press
        LEFT JOIN
    m_dies ON t_press.dies_id = m_dies.id
GROUP BY dies_id
UNION SELECT 
'1' AS o,
        t_schedule.dies_id,
            m_dies.die_number,
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-01' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210901',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-02' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210902',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-03' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210903',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-04' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210904',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-05' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210905',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-06' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210906',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-07' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210907',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-08' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210908',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-09' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210909',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-10' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210910',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-11' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210911',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-12' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210912',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-13' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210913',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-14' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210914',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-15' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210915',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-16' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210916',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-17' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210917',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-18' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210918',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-19' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210919',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-20' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210920',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-21' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210921',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-22' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210922',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-23' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210923',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-24' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210924',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-25' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210925',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-26' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210926',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-27' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210927',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-28' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210928',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-29' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210929',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-09-30' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20210930',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-10-01' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20211001',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-10-02' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20211002',
            MAX(CASE
                WHEN t_schedule.press_date = '2021-10-03' THEN t_schedule.press_quantity
                ELSE ''
            END) AS '_20211003'
    FROM
        t_schedule
        LEFT JOIN m_dies ON t_schedule.dies_id = m_dies.id
GROUP BY dies_id
ORDER BY dies_id DESC , o ASC;