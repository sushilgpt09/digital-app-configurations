-- Popular Partners display config (stored on the partner itself)
ALTER TABLE wing_services
    ADD COLUMN popular_sort_order  INT          DEFAULT 0,
    ADD COLUMN popular_emoji       VARCHAR(10),
    ADD COLUMN popular_bg_color    VARCHAR(20),
    ADD COLUMN popular_border_color VARCHAR(20);

-- New Partners display config
ALTER TABLE wing_services
    ADD COLUMN new_sort_order  INT  DEFAULT 0,
    ADD COLUMN new_bg_color    VARCHAR(20),
    ADD COLUMN new_border_color VARCHAR(20),
    ADD COLUMN new_badge       VARCHAR(30);
