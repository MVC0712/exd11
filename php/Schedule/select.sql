SELECT 
    '2' AS o,
    m_production_numbers.id AS idd,
    m_production_numbers.production_number,
    t_press.pressing_type_id,
    m_pressing_type.pressing_type,
    MAX(CASE
        WHEN t_press.press_date_at = '2022-05-01' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210501',
    MAX(CASE
        WHEN t_press.press_date_at = '2022-05-02' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210502',
    MAX(CASE
        WHEN t_press.press_date_at = '2022-05-03' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210503',
    MAX(CASE
        WHEN t_press.press_date_at = '2022-05-04' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210504',
    MAX(CASE
        WHEN t_press.press_date_at = '2022-05-05' THEN t_press.actual_billet_quantities
        ELSE ''
    END) AS '_20210505'
FROM
    t_press
        LEFT JOIN
    m_dies ON t_press.dies_id = m_dies.id
        LEFT JOIN
    m_production_numbers ON m_production_numbers.id = m_dies.production_number_id
        LEFT JOIN
    m_pressing_type ON m_pressing_type.id = t_press.pressing_type_id
GROUP BY dies_id 
UNION SELECT 
    '1' AS o,
    t_press_plan.production_number_id AS idd,
    m_production_numbers.production_number,
    t_press_plan.pressing_type_id,
    m_pressing_type.pressing_type,
    MAX(CASE
        WHEN t_press_plan.plan_date = '2022-05-01' THEN t_press_plan.quantity
        ELSE ''
    END) AS '_20210501',
    MAX(CASE
        WHEN t_press_plan.plan_date = '2022-05-02' THEN t_press_plan.quantity
        ELSE ''
    END) AS '_20210502',
    MAX(CASE
        WHEN t_press_plan.plan_date = '2022-05-03' THEN t_press_plan.quantity
        ELSE ''
    END) AS '_20210503',
    MAX(CASE
        WHEN t_press_plan.plan_date = '2022-05-04' THEN t_press_plan.quantity
        ELSE ''
    END) AS '_20210504',
    MAX(CASE
        WHEN t_press_plan.plan_date = '2022-05-05' THEN t_press_plan.quantity
        ELSE ''
    END) AS '_20210505'
FROM
    t_press_plan
        LEFT JOIN
    m_dies ON t_press_plan.dies_id = m_dies.id
        LEFT JOIN
    m_production_numbers ON m_production_numbers.id = t_press_plan.production_number_id
        LEFT JOIN
    m_pressing_type ON m_pressing_type.id = t_press_plan.pressing_type_id
GROUP BY idd
ORDER BY pressing_type_id DESC , idd DESC , o ASC;