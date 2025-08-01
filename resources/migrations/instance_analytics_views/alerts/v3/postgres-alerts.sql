drop view if exists v_alerts;

create or replace view v_alerts as
with parsed_cron as (
    select
        n.id,
        ns.cron_schedule,
        ns.ui_display_type,
        split_part(ns.cron_schedule, ' ', 2) as minutes,
        split_part(ns.cron_schedule, ' ', 3) as hours,
        split_part(ns.cron_schedule, ' ', 4) as day_of_month,
        split_part(ns.cron_schedule, ' ', 6) as day_of_week
    from notification n
    join notification_subscription ns on n.id = ns.notification_id
    where n.payload_type = 'notification/card'
    and ns.type = 'notification-subscription/cron'
),
schedule_info as (
    select
        id,
        case
            when ui_display_type = 'cron/raw' then 'custom'
            when minutes ~ '^\*$' or minutes ~ '^\d+/\d+$' then 'by the minute'
            when day_of_month != '*' and
                 (day_of_week = '?' or
                  day_of_week ~ '^\d#1$' or
                  day_of_week ~ '^\dL$') then 'monthly'
            when day_of_week != '?' and day_of_week != '*' then 'weekly'
            when hours != '*' then 'daily'
            else 'hourly'
        end as schedule_type,
        case
            when day_of_week ~ '^1' then 'sun'
            when day_of_week ~ '^2' then 'mon'
            when day_of_week ~ '^3' then 'tue'
            when day_of_week ~ '^4' then 'wed'
            when day_of_week ~ '^5' then 'thu'
            when day_of_week ~ '^6' then 'fri'
            when day_of_week ~ '^7' then 'sat'
            else null
        end as schedule_day,
        case
            when hours = '*' then null
            else cast(hours as integer)
        end as schedule_hour
    from parsed_cron
),
agg_recipients as (
    select
        nr.notification_handler_id,
        string_agg(cu.email, ',') as recipients,
        (select string_agg(nr2.details, ',')
         from notification_recipient nr2
         where nr2.notification_handler_id = nr.notification_handler_id
         and nr2.type = 'notification-recipient/raw-value') as recipient_external
    FROM notification_recipient nr
    left join core_user cu on nr.user_id = cu.id and nr.type = 'notification-recipient/user'
    group by nr.notification_handler_id
)
select
    n.id as entity_id,
    'notification_' || n.id as entity_qualified_id,
    n.created_at,
    n.updated_at,
    n.creator_id,
    nc.card_id,
    'card_' || nc.card_id as card_qualified_id,
    case
        when nc.send_condition = 'has_result' then 'rows'
        when nc.send_condition in ('goal_above', 'goal_below') then 'goal'
    end as alert_condition,
    si.schedule_type,
    si.schedule_day,
    si.schedule_hour,
    not n.active as archived,
    nh.channel_type as recipient_type,
    ar.recipients,
    ar.recipient_external
from notification n
join notification_card nc on n.payload_id = nc.id
join schedule_info si on n.id = si.id
left join notification_handler nh on n.id = nh.notification_id
left join agg_recipients ar on nh.id = ar.notification_handler_id
where n.payload_type = 'notification/card';
